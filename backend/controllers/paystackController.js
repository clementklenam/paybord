const Transaction = require('../models/Transaction');
const PaymentLink = require('../models/PaymentLink');
const Business = require('../models/Business');
const crypto = require('crypto');
const { convertFromSmallestUnit } = require('../utils/currency');

/**
 * Initialize Paystack payment
 * @route POST /api/paystack/initialize
 * @access Public
 */
exports.initializePayment = async (req, res) => {
    const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    try {
        const {
            amount,
            email,
            currency = 'NGN',
            reference,
            callback_url,
            metadata = {},
            paymentLinkId,
            customerInfo = {}
        } = req.body;

        // Validate required fields
        if (!amount || !email || !reference) {
            return res.status(400).json({
                success: false,
                message: 'Amount, email, and reference are required'
            });
        }

        // Check if Paystack API key is configured or SDK failed to initialize
        if (!process.env.PAYSTACK_SECRET_KEY || 
            process.env.PAYSTACK_SECRET_KEY === 'sk_test_1234567890abcdef1234567890abcdef12345678') {
            console.log('⚠️ Paystack API key not configured or SDK failed to initialize, using mock response for development');
            
            // Return mock response for development
            const mockAuthorizationUrl = `https://checkout.paystack.com/${reference}?amount=${Math.round(amount * 100)}&email=${email}&currency=${currency}`;
            
            return res.json({
                success: true,
                data: {
                    reference: reference,
                    authorization_url: mockAuthorizationUrl,
                    access_code: `mock_access_${Date.now()}`,
                    amount: amount,
                    currency: currency
                },
                message: 'Mock payment initialized (Paystack API key not configured)'
            });
        }

        // If paymentLinkId is provided, validate and get business info
        let businessId = null;
        let paymentLink = null;
        
        if (paymentLinkId) {
            paymentLink = await PaymentLink.findOne({ linkId: paymentLinkId });
            if (!paymentLink) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment link not found'
                });
            }
            businessId = paymentLink.businessId;
            
            // Get business details
            const business = await Business.findById(businessId);
            if (business) {
                metadata.business_name = business.businessName;
                metadata.business_id = businessId;
            }
        }

        // Add customer info to metadata
        if (customerInfo.name) metadata.customer_name = customerInfo.name;
        if (customerInfo.phone) metadata.customer_phone = customerInfo.phone;
        if (customerInfo.address) metadata.customer_address = customerInfo.address;
        if (paymentLinkId) metadata.payment_link_id = paymentLinkId;

        // Prepare Paystack initialization data
        // The amount is already in the smallest currency unit (pesewas for GHS, kobo for NGN)
        const paystackData = {
            amount: Math.round(amount), // Amount is already in smallest unit
            email,
            currency,
            reference,
            callback_url,
            metadata
        };

        console.log('About to call Paystack.transaction.initialize');
        const response = await Paystack.transaction.initialize(paystackData);

        if (response.status && response.data) {
            console.log('Paystack payment initialized successfully:', {
                reference: response.data.reference,
                authorization_url: response.data.authorization_url,
                access_code: response.data.access_code
            });

            res.json({
                success: true,
                data: {
                    reference: response.data.reference,
                    authorization_url: response.data.authorization_url,
                    access_code: response.data.access_code,
                    amount: amount,
                    currency: currency
                }
            });
        } else {
            console.error('Paystack API error:', response); // Log the full error response
            throw new Error('Failed to initialize payment with Paystack');
        }

    } catch (error) {
        console.error('Paystack initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Verify Paystack payment
 * @route GET /api/paystack/verify/:reference
 * @access Public
 */
exports.verifyPayment = async (req, res) => {
    const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: 'Payment reference is required'
            });
        }

        console.log('Verifying Paystack payment:', reference);

        // Check if Paystack API key is configured or SDK failed to initialize
        if (!process.env.PAYSTACK_SECRET_KEY || 
            process.env.PAYSTACK_SECRET_KEY === 'sk_test_1234567890abcdef1234567890abcdef12345678') {
            console.log('⚠️ Paystack API key not configured or SDK failed to initialize, using mock verification for development');
            
            // Return mock successful verification for development
            const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Create a mock transaction record
            const transaction = new Transaction({
                transactionId: mockTransactionId,
                amount: 150, // Mock amount
                currency: 'NGN',
                status: 'success',
                customerName: 'Test Customer',
                customerEmail: 'test@example.com',
                customerPhone: '+1234567890',
                businessId: null,
                paymentMethod: 'card',
                paymentType: 'payment_link',
                metadata: {
                    paystack_reference: reference,
                    paystack_data: {
                        reference: reference,
                        status: 'success',
                        amount: 15000, // in kobo
                        currency: 'NGN'
                    },
                    customer_address: 'Test Address',
                    payment_link_id: null
                },
                processedAt: new Date()
            });

            await transaction.save();
            console.log('Mock transaction saved successfully:', mockTransactionId);

            return res.json({
                success: true,
                data: {
                    reference: reference,
                    status: 'success',
                    amount: 150,
                    currency: 'NGN',
                    customer: {
                        email: 'test@example.com',
                        first_name: 'Test',
                        last_name: 'Customer'
                    },
                    transaction_id: mockTransactionId,
                    payment_method: 'card'
                },
                message: 'Mock payment verified (Paystack API key not configured)'
            });
        }

        // Verify payment with Paystack
        const response = await Paystack.transaction.verify(reference);

        if (response.status && response.data) {
            const transactionData = response.data;
            
            console.log('Paystack payment verified:', {
                reference: transactionData.reference,
                status: transactionData.status,
                amount: transactionData.amount,
                currency: transactionData.currency
            });

            // Check if payment was successful
            if (transactionData.status === 'success') {
                // Extract metadata
                const metadata = transactionData.metadata || {};
                let businessId = metadata.business_id;
                const paymentLinkId = metadata.payment_link_id;
                const customerName = metadata.customer_name || transactionData.customer?.first_name || 'Anonymous';
                const customerPhone = metadata.customer_phone || transactionData.customer?.phone;
                const customerAddress = metadata.customer_address;

                // Fallback: If businessId is missing but paymentLinkId is present, fetch from DB
                if (!businessId && paymentLinkId) {
                  try {
                    const PaymentLink = require('../models/PaymentLink');
                    const paymentLink = await PaymentLink.findOne({ linkId: paymentLinkId });
                    if (paymentLink && paymentLink.businessId) {
                      businessId = paymentLink.businessId.toString();
                      console.log('[Paystack VERIFY] Fetched businessId from PaymentLink:', businessId);
                    } else {
                      console.warn('[Paystack VERIFY] Could not find businessId for paymentLinkId:', paymentLinkId);
                    }
                  } catch (err) {
                    console.error('[Paystack VERIFY] Error fetching businessId from PaymentLink:', err);
                  }
                }

                // Determine payment method
                let paymentMethod = 'card';
                if (transactionData.channel === 'mobile_money') paymentMethod = 'mobile_money';
                else if (transactionData.channel === 'bank') paymentMethod = 'bank_transfer';

                // Create transaction record
                const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                console.log('[Paystack VERIFY] About to save transaction:', {
                  transactionId,
                  businessId,
                  paymentLinkId,
                  metadata,
                  customerName,
                  customerEmail: transactionData.customer?.email,
                  amount: convertFromSmallestUnit(transactionData.amount, transactionData.currency),
                  currency: transactionData.currency
                });
                const transaction = new Transaction({
                    transactionId,
                    amount: convertFromSmallestUnit(transactionData.amount, transactionData.currency), // Convert from smallest unit to base unit
                    currency: transactionData.currency,
                    status: 'success',
                    customerName,
                    customerEmail: transactionData.customer?.email,
                    customerPhone,
                    businessId,
                    paymentMethod,
                    paymentType: paymentLinkId ? 'payment_link' : 'other',
                    paymentLinkId,
                    metadata: {
                        paystack_reference: reference,
                        paystack_data: transactionData,
                        customer_address: customerAddress,
                        payment_link_id: paymentLinkId
                    },
                    processedAt: new Date()
                });

                await transaction.save();

                console.log('Transaction saved successfully:', transactionId);

                res.json({
                    success: true,
                    data: {
                        reference: transactionData.reference,
                        status: transactionData.status,
                        amount: convertFromSmallestUnit(transactionData.amount, transactionData.currency),
                        currency: transactionData.currency,
                        customer: transactionData.customer,
                        transaction_id: transactionId,
                        payment_method: paymentMethod
                    }
                });
            } else {
                res.json({
                    success: false,
                    data: {
                        reference: transactionData.reference,
                        status: transactionData.status,
                        message: 'Payment was not successful'
                    }
                });
            }
        } else {
            throw new Error('Failed to verify payment with Paystack');
        }

    } catch (error) {
        console.error('Paystack verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get Paystack banks for bank transfer
 * @route GET /api/paystack/banks
 * @access Public
 */
exports.getBanks = async (req, res) => {
    const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    try {
        // Check if Paystack API key is configured
        if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY === 'sk_test_1234567890abcdef1234567890abcdef12345678') {
            console.log('⚠️ Paystack API key not configured, using mock banks for development');
            
            // Return mock banks for development
            const mockBanks = [
                { id: 1, name: 'Access Bank', code: '044', active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
                { id: 2, name: 'Zenith Bank', code: '057', active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
                { id: 3, name: 'GT Bank', code: '058', active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
                { id: 4, name: 'First Bank', code: '011', active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
                { id: 5, name: 'UBA', code: '033', active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' }
            ];
            
            return res.json({
                success: true,
                data: mockBanks,
                message: 'Mock banks returned (Paystack API key not configured)'
            });
        }

        const response = await Paystack.misc.list_banks();
        
        if (response.status && response.data) {
            res.json({
                success: true,
                data: response.data
            });
        } else {
            throw new Error('Failed to fetch banks from Paystack');
        }
    } catch (error) {
        console.error('Error fetching banks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch banks',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Resolve bank account number
 * @route POST /api/paystack/resolve-account
 * @access Public
 */
exports.resolveAccount = async (req, res) => {
    const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    try {
        const { account_number, bank_code } = req.body;

        if (!account_number || !bank_code) {
            return res.status(400).json({
                success: false,
                message: 'Account number and bank code are required'
            });
        }

        const response = await Paystack.verification.resolve_account({
            account_number,
            bank_code
        });

        if (response.status && response.data) {
            res.json({
                success: true,
                data: response.data
            });
        } else {
            throw new Error('Failed to resolve account with Paystack');
        }
    } catch (error) {
        console.error('Error resolving account:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resolve account',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 