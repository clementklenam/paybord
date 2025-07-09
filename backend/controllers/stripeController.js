const Stripe = require('stripe');
const Transaction = require('../models/Transaction');

// Use environment variable for Stripe key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = Stripe(STRIPE_SECRET_KEY);

// @desc    Create a Stripe PaymentIntent (public, for storefront)
// @route   POST /api/payments/stripe-intent
// @access  Public (MVP)
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', customerInfo = {}, metadata = {}, businessId, storefrontId } = req.body;
    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe configuration error' });
    }
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Amount is required and must be at least 1 (in the smallest currency unit).' });
    }
    const paymentMetadata = {
      ...metadata,
      customerName: customerInfo.name || '',
      customerEmail: customerInfo.email || '',
      customerPhone: customerInfo.phone || '',
      paymentType: 'storefront_purchase',
      timestamp: new Date().toISOString()
    };
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: paymentMetadata,
      payment_method_types: ['card'],
      receipt_email: customerInfo.email || undefined,
    });
    try {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transaction = new Transaction({
        transactionId,
        stripePaymentIntentId: paymentIntent.id,
        amount: amount / 100,
        currency: currency.toUpperCase(),
        status: 'pending',
        customerName: customerInfo.name || '',
        customerEmail: customerInfo.email || '',
        customerPhone: customerInfo.phone || '',
        businessId: businessId || null,
        storefrontId: storefrontId || null,
        paymentType: 'storefront_purchase',
        metadata: paymentMetadata,
        paymentMethod: 'card'
      });
      await transaction.save();
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        transactionId: transaction._id
      });
    } catch (transactionError) {
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        transactionId: null,
        warning: 'Payment created but transaction record failed'
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent: ' + error.message });
  }
};

// @desc    Update transaction status when payment is completed (called from frontend)
// @route   POST /api/payments/update-transaction
// @access  Public
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { paymentIntentId, status, paymentIntent } = req.body;
    if (!paymentIntentId || !status) {
      return res.status(400).json({ error: 'PaymentIntent ID and status are required' });
    }
    const updateData = {
      status,
      processedAt: new Date()
    };
    if (status === 'success' && paymentIntent) {
      updateData.stripePaymentIntent = paymentIntent;
      if (paymentIntent.payment_method_types && paymentIntent.payment_method_types.length > 0) {
        updateData.paymentMethod = paymentIntent.payment_method_types[0];
      } else if (paymentIntent.payment_method) {
        updateData.paymentMethod = paymentIntent.payment_method;
      }
    } else if (status === 'failed') {
      updateData.failureReason = paymentIntent?.last_payment_error?.message || 'Payment failed';
    }
    const transaction = await Transaction.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      updateData,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ 
      success: true, 
      transactionId: transaction._id,
      status: transaction.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction: ' + error.message });
  }
}; 