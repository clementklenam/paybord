const Transaction = require('../models/Transaction');
const PaymentIntent = require('../models/PaymentIntent');
const Customer = require('../models/Customer');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const Storefront = require('../models/Storefront');
const PaymentLink = require('../models/PaymentLink');
const Business = require('../models/Business');

const currenciesWithCents = [
  'GHS', 'NGN', 'KES', 'ZAR', 'USD', 'EUR', 'GBP', 'XOF', 'XAF', 'MAD', 'EGP'
];

// Helper to check if amount is in base unit
function isBaseUnit(amount, currency) {
  const currenciesWithCents = [
    'GHS', 'NGN', 'KES', 'ZAR', 'USD', 'EUR', 'GBP', 'XOF', 'XAF', 'MAD', 'EGP'
  ];
  if (currenciesWithCents.includes((currency || '').toUpperCase())) {
    return Number(amount) <= 1000;
  }
  return true;
}

// @desc    Create a payment intent
// @route   POST /api/payments/intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            amount,
            currency = 'USD',
            customerId,
            paymentMethodTypes = ['card'],
            description,
            metadata,
            receiptEmail,
            statementDescriptor
        } = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        // If customerId is provided, verify customer exists and belongs to this user
        let customer = null;
        if (customerId) {
            customer = await Customer.findOne({
                $or: [
                    { _id: customerId },
                    { customerId: customerId }
                ],
                userId: req.user._id,
                isDeleted: false
            });

            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
        }

        // Create payment intent
        const paymentIntent = new PaymentIntent({
            userId: req.user._id,
            amount,
            currency: currency.toUpperCase(),
            customer: customer ? customer.customerId : null,
            paymentMethodTypes,
            description,
            metadata,
            receiptEmail,
            statementDescriptor
        });

        const savedIntent = await paymentIntent.save();

        // Return the payment intent with client_secret
        res.status(201).json({
            id: savedIntent.paymentIntentId,
            amount: savedIntent.amount,
            currency: savedIntent.currency,
            status: savedIntent.status,
            client_secret: savedIntent.clientSecret,
            customer: savedIntent.customer,
            created: savedIntent.createdAt.getTime() / 1000, // Unix timestamp in seconds
            payment_method_types: savedIntent.paymentMethodTypes
        });
    } catch (error) {
        console.error('Create payment intent error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Retrieve a payment intent
// @route   GET /api/payments/intent/:id
// @access  Private
const getPaymentIntent = async (req, res) => {
    try {
        const paymentIntent = await PaymentIntent.findOne({
            paymentIntentId: req.params.id,
            userId: req.user._id
        });

        if (!paymentIntent) {
            return res.status(404).json({ error: 'Payment intent not found' });
        }

        res.json({
            id: paymentIntent.paymentIntentId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            customer: paymentIntent.customer,
            payment_method: paymentIntent.paymentMethod,
            created: paymentIntent.createdAt.getTime() / 1000,
            payment_method_types: paymentIntent.paymentMethodTypes
        });
    } catch (error) {
        console.error('Get payment intent error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update a payment intent
// @route   PUT /api/payments/intent/:id
// @access  Private
const updatePaymentIntent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            amount,
            currency,
            description,
            metadata,
            receiptEmail,
            statementDescriptor,
            paymentMethodTypes
        } = req.body;

        const paymentIntent = await PaymentIntent.findOne({
            paymentIntentId: req.params.id,
            userId: req.user._id
        });

        if (!paymentIntent) {
            return res.status(404).json({ error: 'Payment intent not found' });
        }

        // Cannot update payment intent if it's not in a modifiable state
        const modifiableStates = ['created', 'requires_payment_method', 'requires_confirmation'];
        if (!modifiableStates.includes(paymentIntent.status)) {
            return res.status(400).json({
                error: `Payment intent cannot be updated in status: ${paymentIntent.status}`
            });
        }

        // Update fields
        if (amount && amount > 0) paymentIntent.amount = amount;
        if (currency) paymentIntent.currency = currency.toUpperCase();
        if (description) paymentIntent.description = description;
        if (metadata) paymentIntent.metadata = metadata;
        if (receiptEmail) paymentIntent.receiptEmail = receiptEmail;
        if (statementDescriptor) paymentIntent.statementDescriptor = statementDescriptor;
        if (paymentMethodTypes) paymentIntent.paymentMethodTypes = paymentMethodTypes;

        const updatedIntent = await paymentIntent.save();

        res.json({
            id: updatedIntent.paymentIntentId,
            amount: updatedIntent.amount,
            currency: updatedIntent.currency,
            status: updatedIntent.status,
            customer: updatedIntent.customer,
            created: updatedIntent.createdAt.getTime() / 1000,
            payment_method_types: updatedIntent.paymentMethodTypes
        });
    } catch (error) {
        console.error('Update payment intent error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Confirm a payment intent
// @route   POST /api/payments/intent/:id/confirm
// @access  Private
const confirmPaymentIntent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { paymentMethod } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ error: 'Payment method is required' });
        }

        const paymentIntent = await PaymentIntent.findOne({
            paymentIntentId: req.params.id,
            userId: req.user._id
        });

        if (!paymentIntent) {
            return res.status(404).json({ error: 'Payment intent not found' });
        }

        // Can only confirm payment intent in certain states
        const confirmableStates = ['created', 'requires_payment_method', 'requires_confirmation'];
        if (!confirmableStates.includes(paymentIntent.status)) {
            return res.status(400).json({
                error: `Payment intent cannot be confirmed in status: ${paymentIntent.status}`
            });
        }

        // Update payment intent with payment method and status
        paymentIntent.paymentMethod = paymentMethod;
        paymentIntent.status = 'processing';

        // In a real implementation, this is where you would process the payment
        // with a payment processor like Stripe, PayPal, etc.
        // For now, we'll simulate payment processing

        // Simulate payment processing (success 90% of the time)
        const isSuccessful = Math.random() < 0.9;

        if (isSuccessful) {
            paymentIntent.status = 'succeeded';
            paymentIntent.paymentResult = {
                id: `txn_${crypto.randomBytes(8).toString('hex')}`,
                status: 'succeeded',
                update_time: new Date().toISOString(),
                email_address: paymentIntent.receiptEmail
            };
        } else {
            paymentIntent.status = 'failed';
            paymentIntent.paymentResult = {
                error: 'Payment processing failed',
                status: 'failed',
                update_time: new Date().toISOString()
            };
        }

        const updatedIntent = await paymentIntent.save();

        // Validate amount is in base unit
        if (!isBaseUnit(updatedIntent.amount, updatedIntent.currency)) {
          console.error(`[REJECTED] Payment intent confirmation: amount not in base unit: ${updatedIntent.amount} (${updatedIntent.currency}). Request rejected.`);
          return res.status(400).json({
            error: `Amount for ${updatedIntent.currency} must be in base units (e.g., 53.55 for GHS, not 5355 or 535500)`
          });
        }

        // Create a transaction record
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const transaction = new Transaction({
            transactionId,
            amount: updatedIntent.amount,
            status: updatedIntent.status,
            customerName: updatedIntent.receiptEmail || 'Anonymous',
            paymentMethod: updatedIntent.paymentMethod || 'card'
        });
        await transaction.save();

        const io = req.app.get('io');
        if (io) {
          io.emit('payment_update', { type: 'new_payment', transaction });
        }

        res.json({
            id: updatedIntent.paymentIntentId,
            amount: updatedIntent.amount,
            currency: updatedIntent.currency,
            status: updatedIntent.status,
            customer: updatedIntent.customer,
            payment_method: updatedIntent.paymentMethod,
            created: updatedIntent.createdAt.getTime() / 1000,
            payment_result: updatedIntent.paymentResult
        });
    } catch (error) {
        console.error('Confirm payment intent error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Cancel a payment intent
// @route   POST /api/payments/intent/:id/cancel
// @access  Private
const cancelPaymentIntent = async (req, res) => {
    try {
        const paymentIntent = await PaymentIntent.findOne({
            paymentIntentId: req.params.id,
            userId: req.user._id
        });

        if (!paymentIntent) {
            return res.status(404).json({ error: 'Payment intent not found' });
        }

        // Cannot cancel payment intent if it's already succeeded or canceled
        if (['succeeded', 'canceled'].includes(paymentIntent.status)) {
            return res.status(400).json({
                error: `Payment intent cannot be canceled in status: ${paymentIntent.status}`
            });
        }

        // Update payment intent status
        paymentIntent.status = 'canceled';
        paymentIntent.canceledAt = new Date();

        const updatedIntent = await paymentIntent.save();

        res.json({
            id: updatedIntent.paymentIntentId,
            amount: updatedIntent.amount,
            currency: updatedIntent.currency,
            status: updatedIntent.status,
            customer: updatedIntent.customer,
            canceled_at: updatedIntent.canceledAt.getTime() / 1000
        });
    } catch (error) {
        console.error('Cancel payment intent error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    List all payment intents for a user
// @route   GET /api/payments/intents
// @access  Private
const listPaymentIntents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = { userId: req.user._id };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.customer) {
            filter.customer = req.query.customer;
        }

        const paymentIntents = await PaymentIntent.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await PaymentIntent.countDocuments(filter);

        const formattedIntents = paymentIntents.map(intent => ({
            id: intent.paymentIntentId,
            amount: intent.amount,
            currency: intent.currency,
            status: intent.status,
            customer: intent.customer,
            payment_method: intent.paymentMethod,
            created: intent.createdAt.getTime() / 1000
        }));

        res.json({
            data: formattedIntents,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error('List payment intents error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all transactions
// @route   GET /api/payments
// @access  Private
const getAllTransactions = async (req, res) => {
    try {
        // Add pagination support
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Find all businesses owned by the current user
        const businesses = await Business.find({ user: req.user._id }).select('_id');
        const businessIds = businesses.map(b => b._id.toString());

        // Only show transactions for the user's businesses
        const filter = { businessId: { $in: businessIds }, status: { $in: ['success', 'succeeded'] } };

        const total = await Transaction.countDocuments(filter);
        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Enhance transactions with source info
        const enhancedTransactions = await Promise.all(transactions.map(async t => {
            const obj = t.toObject();
            obj.id = obj._id;
            delete obj._id;
            // Add source info
            if (obj.paymentType === 'storefront_purchase' && obj.storefrontId) {
                try {
                    const storefront = await Storefront.findById(obj.storefrontId).select('name');
                    obj.storefrontName = storefront ? storefront.name : null;
                } catch (e) {
                    obj.storefrontName = null;
                }
            }
            if (obj.paymentType === 'payment_link' && obj.paymentLinkId) {
                try {
                    const paymentLink = await PaymentLink.findOne({ linkId: obj.paymentLinkId }).select('title');
                    obj.paymentLinkTitle = paymentLink ? paymentLink.title : null;
                } catch (e) {
                    obj.paymentLinkTitle = null;
                }
            }
            return obj;
        }));

        res.status(200).json({
            data: enhancedTransactions,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new transaction
// @route   POST /api/payments/transactions
// @access  Private
const createTransaction = async (req, res) => {
    console.log('[DEBUG] /api/payments body:', req.body);
    const { amount, status, customerName, currency, customerEmail, customerPhone, paymentType, provider, businessId, storefrontId, paymentLinkId, paymentMethod } = req.body;

    console.log('[DEBUG] Creating transaction with data:', {
        amount, status, customerName, currency, customerEmail, customerPhone, paymentType, provider, businessId, storefrontId, paymentLinkId
    });
    
    console.log('[DEBUG] Amount details:', {
        amount,
        amountType: typeof amount,
        amountValue: Number(amount),
        currency
    });

    try {
        let finalBusinessId = businessId;
        
        // If businessId is not provided but paymentLinkId is, try to get businessId from payment link
        if (!finalBusinessId && paymentLinkId) {
            console.log('BusinessId not provided, trying to get from payment link:', paymentLinkId);
            try {
                const PaymentLink = require('../models/PaymentLink');
                const paymentLink = await PaymentLink.findOne({ linkId: paymentLinkId });
                if (paymentLink && paymentLink.businessId) {
                    finalBusinessId = paymentLink.businessId;
                    console.log('Found businessId from payment link:', finalBusinessId);
                } else {
                    console.log('Payment link found but no businessId:', paymentLink ? 'Payment link exists but no businessId' : 'Payment link not found');
                }
            } catch (error) {
                console.error('Error fetching payment link for businessId:', error);
            }
        }
        
        // If still no businessId, we can still create the transaction but log a warning
        if (!finalBusinessId) {
            console.warn('No businessId available for transaction, creating without businessId');
        }

        // --- ENFORCE BASE UNIT FOR AMOUNT ---
        let fixedAmount = Number(amount);
        if (currenciesWithCents.includes((currency || '').toUpperCase()) && fixedAmount > 1000) {
            console.error(`[REJECTED] Transaction amount not in base unit: ${fixedAmount} (${currency}). Request rejected.`);
            return res.status(400).json({
              success: false,
              message: `Amount for ${currency} must be in base units (e.g., 53.55 for GHS, not 5355 or 535500)`,
              error: 'Amount not in base unit'
            });
        }

        // Create the transaction
        const transaction = new Transaction({
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: fixedAmount, // Always store in base unit
            currency: currency || 'NGN',
            status,
            customerName,
            customerEmail,
            customerPhone,
            businessId: finalBusinessId, // This might be undefined
            storefrontId,
            paymentLinkId,
            paymentType: paymentType || 'payment_link',
            paymentMethod: paymentMethod || 'card',
            provider: provider || 'paystack',
            metadata: {
                source: 'payment_link',
                paymentLinkId
            }
        });

        await transaction.save();
        const io = req.app.get('io');
        if (io) {
          io.emit('payment_update', { type: 'new_payment', transaction });
        }
        console.log('[DEBUG] Transaction created successfully:', { id: transaction._id, amount: transaction.amount, currency: transaction.currency });

        // Add a small delay to ensure the transaction is saved before responding
        // This helps with real-time updates
        setTimeout(() => {
            console.log('[DEBUG] Transaction saved, analytics should update soon');
        }, 100);

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createPaymentIntent,
    getPaymentIntent,
    updatePaymentIntent,
    confirmPaymentIntent,
    cancelPaymentIntent,
    listPaymentIntents,
    getAllTransactions,
    createTransaction
};
