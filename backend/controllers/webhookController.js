const crypto = require('crypto');
const PaymentIntent = require('../models/PaymentIntent');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const { convertFromSmallestUnit } = require('../utils/currency');
const Storefront = require('../models/Storefront');
const PaymentLink = require('../models/PaymentLink');

// Helper function to verify webhook signature
const verifySignature = (payload, signature, secret) => {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(digest),
        Buffer.from(signature)
    );
};

// @desc    Process webhooks from payment providers
// @route   POST /api/webhooks
// @access  Public (but verified by signature)
const processWebhook = async (req, res) => {
    // Log headers and raw payload for debugging
    console.log('--- Incoming Webhook ---');
    console.log('Headers:', req.headers);
    try {
        const rawPayload = req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body));
        console.log('Raw payload:', rawPayload.toString());
    } catch (e) {
        console.log('Could not log raw payload:', e);
    }
    // --- PAYSTACK WEBHOOK HANDLING ---
    const paystackSignature = req.headers['x-paystack-signature'];
    const isPaystack = !!paystackSignature;
    const payload = req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body));
    if (isPaystack) {
        // Verify Paystack signature
        const secret = process.env.PAYSTACK_SECRET_KEY; // Set this in your .env
        const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
        if (hash !== paystackSignature) {
            return res.status(401).json({ error: 'Invalid Paystack webhook signature' });
        }
        // Parse the event as Paystack expects
        let event;
        try {
            event = JSON.parse(payload.toString());
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON payload' });
        }
        // Handle Paystack event
        if (event.event === 'charge.success') {
            const data = event.data;
            // Extract payment method
            let paymentMethod = 'other';
            if (data.channel === 'mobile_money') paymentMethod = 'mobile_money';
            else if (data.channel === 'card') paymentMethod = 'card';
            else if (data.channel === 'bank') paymentMethod = 'bank_transfer';
            // Extract businessId and storefrontId from metadata if available
            let businessId = undefined;
            let storefrontId = undefined;
            let paymentLinkId = undefined;
            if (data.metadata && data.metadata.custom_fields) {
                for (const field of data.metadata.custom_fields) {
                    if (field.variable_name === 'business_id') businessId = field.value;
                    if (field.variable_name === 'storefront_id') storefrontId = field.value;
                    if (field.variable_name === 'payment_link_id') paymentLinkId = field.value;
                }
            }
            
            // Also check direct metadata properties
            if (data.metadata) {
                if (data.metadata.business_id) businessId = data.metadata.business_id;
                if (data.metadata.storefront_id) storefrontId = data.metadata.storefront_id;
                if (data.metadata.payment_link_id) paymentLinkId = data.metadata.payment_link_id;
            }
            
            // If paymentLinkId is provided, get businessId from PaymentLink
            if (paymentLinkId && !businessId) {
                try {
                    const paymentLink = await PaymentLink.findOne({ linkId: paymentLinkId });
                    if (paymentLink) {
                        businessId = paymentLink.businessId.toString();
                        console.log('Fetched businessId from PaymentLink:', businessId);
                    } else {
                        console.warn('Could not find businessId for paymentLinkId:', paymentLinkId);
                    }
                } catch (err) {
                    console.error('Error fetching businessId from PaymentLink:', err);
                }
            }
            
            // If businessId is missing but storefrontId is present, fetch businessId from Storefront
            if (!businessId && storefrontId) {
                try {
                    const storefront = await Storefront.findById(storefrontId).select('business');
                    if (storefront && storefront.business) {
                        businessId = storefront.business.toString();
                        console.log('Fetched businessId from Storefront:', businessId);
                    } else {
                        console.warn('Could not find businessId for storefrontId:', storefrontId);
                    }
                } catch (err) {
                    console.error('Error fetching businessId from Storefront:', err);
                }
            }
            
            // Determine payment type based on what's available
            let paymentType = 'other';
            if (storefrontId) {
                paymentType = 'storefront_purchase';
            } else if (paymentLinkId) {
                paymentType = 'payment_link';
            }
            // Always set paymentType
            paymentType = paymentType || 'storefront_purchase';
            // Create transaction
            try {
                const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const transaction = new Transaction({
                    transactionId,
                    amount: convertFromSmallestUnit(data.amount, data.currency || 'NGN'), // Convert from smallest unit to base unit
                    currency: data.currency || 'NGN',
                    status: 'success',
                    customerName: (data.metadata && data.metadata.custom_fields && data.metadata.custom_fields.find(f => f.variable_name === 'full_name')) ? data.metadata.custom_fields.find(f => f.variable_name === 'full_name').value : (data.customer && data.customer.first_name ? data.customer.first_name : 'Anonymous'),
                    customerEmail: data.customer ? data.customer.email : undefined,
                    customerPhone: data.customer ? data.customer.phone : undefined,
                    paymentMethod,
                    paymentType,
                    provider: 'paystack',
                    businessId,
                    storefrontId,
                    paymentLinkId,
                    paystackReference: data.reference,
                    paystackData: data,
                    metadata: {
                        ...data.metadata,
                        payment_link_id: paymentLinkId,
                        storefront_id: storefrontId
                    }
                });
                console.log('Creating transaction with data:', transaction.toObject());
                await transaction.save();
                console.log('Paystack transaction saved:', transactionId);
            } catch (err) {
                console.error('Error saving Paystack transaction:', err);
                return res.status(500).json({ error: 'Failed to save Paystack transaction', details: err.message });
            }
        }
        // You can add more detailed event handling here if needed
        return res.status(200).json({ received: true });
    }

    // --- EXISTING LOGIC FOR OTHER PROVIDERS ---
    const signature = req.headers['x-webhook-signature'];
    if (!signature) {
        return res.status(400).json({ error: 'Webhook signature is missing' });
    }
    try {
        const payloadStr = JSON.stringify(req.body);
        const isValid = verifySignature(
            payloadStr,
            signature,
            process.env.WEBHOOK_SECRET
        );
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }
        // Process the webhook event
        const { type, data } = req.body;
        switch (type) {
            case 'payment.succeeded':
                await handlePaymentSucceeded(data);
                break;
            case 'payment.failed':
                await handlePaymentFailed(data);
                break;
            case 'payment.refunded':
                await handlePaymentRefunded(data);
                break;
            case 'customer.created':
                await handleCustomerCreated(data);
                break;
            case 'customer.updated':
                await handleCustomerUpdated(data);
                break;
            case 'payment_method.attached':
                await handlePaymentMethodAttached(data);
                break;
            default:
                console.log(`Unhandled webhook event type: ${type}`);
        }
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed', details: error.message, stack: error.stack });
    }
};

// Handle payment succeeded event
const handlePaymentSucceeded = async (data) => {
    try {
        console.log('Paystack webhook data:', JSON.stringify(data, null, 2));
        const { paymentIntentId, amount, currency, customerId } = data;

        // Update payment intent status
        const paymentIntent = await PaymentIntent.findOne({ paymentIntentId });

        if (paymentIntent) {
            paymentIntent.status = 'succeeded';
            paymentIntent.paymentResult = {
                id: data.transactionId || `txn_${crypto.randomBytes(8).toString('hex')}`,
                status: 'succeeded',
                update_time: new Date().toISOString(),
                email_address: paymentIntent.receiptEmail
            };

            await paymentIntent.save();

            // Extract payment method for Paystack
            let method = paymentIntent.paymentMethod || data.paymentMethod || 'card';
            if (data.provider === 'paystack') {
                if (data.channel) {
                    if (data.channel === 'mobile_money') method = 'mobile_money';
                    else if (data.channel === 'bank') method = 'bank_transfer';
                    else if (data.channel === 'card') method = 'card';
                } else if (data.authorization && data.authorization.channel) {
                    if (data.authorization.channel === 'mobile_money') method = 'mobile_money';
                    else if (data.authorization.channel === 'bank') method = 'bank_transfer';
                    else if (data.authorization.channel === 'card') method = 'card';
                }
            }
            // Create a transaction record
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const transaction = new Transaction({
                transactionId,
                amount: paymentIntent.amount,
                status: 'success',
                customerName: customerId || paymentIntent.receiptEmail || 'Anonymous',
                paymentMethod: method
            });

            await transaction.save();

            console.log(`Payment succeeded for intent: ${paymentIntentId}`);
        } else {
            console.error(`Payment intent not found: ${paymentIntentId}`);
        }
    } catch (error) {
        console.error('Error handling payment.succeeded:', error.message);
        throw error;
    }
};

// Handle payment failed event
const handlePaymentFailed = async (data) => {
    try {
        const { paymentIntentId, errorMessage } = data;

        // Update payment intent status
        const paymentIntent = await PaymentIntent.findOne({ paymentIntentId });

        if (paymentIntent) {
            paymentIntent.status = 'failed';
            paymentIntent.paymentResult = {
                error: errorMessage || 'Payment processing failed',
                status: 'failed',
                update_time: new Date().toISOString()
            };

            await paymentIntent.save();

            // Create a transaction record
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const transaction = new Transaction({
                transactionId,
                amount: paymentIntent.amount,
                status: 'failed',
                customerName: paymentIntent.receiptEmail || 'Anonymous',
                paymentMethod: paymentIntent.paymentMethod || data.paymentMethod || 'card'
            });

            await transaction.save();

            console.log(`Payment failed for intent: ${paymentIntentId}`);
        } else {
            console.error(`Payment intent not found: ${paymentIntentId}`);
        }
    } catch (error) {
        console.error('Error handling payment.failed:', error.message);
        throw error;
    }
};

// Handle payment refunded event
const handlePaymentRefunded = async (data) => {
    try {
        const { paymentIntentId, amount, refundId } = data;

        // Update payment intent status
        const paymentIntent = await PaymentIntent.findOne({ paymentIntentId });

        if (paymentIntent) {
            // Create a refund record in the payment intent
            if (!paymentIntent.refunds) {
                paymentIntent.refunds = [];
            }

            paymentIntent.refunds.push({
                id: refundId,
                amount: amount,
                status: 'succeeded',
                created: new Date()
            });

            await paymentIntent.save();

            // Create a transaction record for the refund
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const transaction = new Transaction({
                transactionId,
                amount: -amount, // Negative amount for refunds
                status: 'success',
                customerName: paymentIntent.receiptEmail || 'Anonymous',
                description: `Refund for payment ${paymentIntentId}`,
                paymentMethod: paymentIntent.paymentMethod || data.paymentMethod || 'card'
            });

            await transaction.save();

            console.log(`Payment refunded for intent: ${paymentIntentId}`);
        } else {
            console.error(`Payment intent not found: ${paymentIntentId}`);
        }
    } catch (error) {
        console.error('Error handling payment.refunded:', error.message);
        throw error;
    }
};

// Handle customer created event
const handleCustomerCreated = async (data) => {
    // In a real implementation, you might want to sync customer data
    // between your payment provider and your database
    console.log(`Customer created: ${data.customerId}`);
};

// Handle customer updated event
const handleCustomerUpdated = async (data) => {
    // In a real implementation, you might want to sync customer data
    // between your payment provider and your database
    console.log(`Customer updated: ${data.customerId}`);
};

// Handle payment method attached event
const handlePaymentMethodAttached = async (data) => {
    try {
        const { customerId, paymentMethodId, type } = data;

        // Find the customer
        const customer = await Customer.findOne({ customerId });

        if (customer) {
            // Check if payment method already exists
            const existingMethod = customer.paymentMethods.find(
                method => method.id === paymentMethodId
            );

            if (!existingMethod) {
                // Add new payment method
                customer.paymentMethods.push({
                    id: paymentMethodId,
                    type,
                    details: data.details || {},
                    isDefault: data.isDefault || false,
                    createdAt: new Date()
                });

                // If this is set as default, update any existing default
                if (data.isDefault) {
                    customer.paymentMethods.forEach(method => {
                        if (method.id !== paymentMethodId) {
                            method.isDefault = false;
                        }
                    });
                    customer.defaultPaymentMethod = paymentMethodId;
                }

                await customer.save();
                console.log(`Payment method ${paymentMethodId} attached to customer ${customerId}`);
            }
        } else {
            console.error(`Customer not found: ${customerId}`);
        }
    } catch (error) {
        console.error('Error handling payment_method.attached:', error.message);
        throw error;
    }
};

module.exports = {
    processWebhook
};
