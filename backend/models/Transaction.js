const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    // Unique transaction identifier
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    
    // Basic transaction info
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending', 'refunded'],
        default: 'pending'
    },
    
    // Stripe integration
    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentIntent: {
        type: mongoose.Schema.Types.Mixed
    },
    
    // Paystack integration
    paystackReference: {
        type: String,
        unique: true,
        sparse: true
    },
    paystackData: {
        type: mongoose.Schema.Types.Mixed
    },
    provider: {
        type: String,
        enum: ['stripe', 'paystack', 'other'],
        default: 'stripe'
    },
    
    // Customer information
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    
    // Business context
    businessId: String,
    storefrontId: String,
    paymentLinkId: String,
    paymentType: {
        type: String,
        enum: ['storefront_purchase', 'payment_link', 'subscription', 'other'],
        default: 'storefront_purchase'
    },
    
    // Financial calculations
    grossAmount: Number, // Total amount before fees
    netAmount: Number,   // Amount after Stripe fees
    feeAmount: Number,   // Stripe fee amount
    feePercentage: Number, // Stripe fee percentage
    
    // Metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date,
    failureReason: String,
    
    // Analytics fields
    isNewCustomer: {
        type: Boolean,
        default: false
    },
    customerLifetimeValue: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bank_transfer', 'mobile_money', 'other'],
        default: 'card'
    }
});

// Indexes for better query performance
transactionSchema.index({ businessId: 1, createdAt: -1 });
transactionSchema.index({ customerEmail: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ stripePaymentIntentId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
