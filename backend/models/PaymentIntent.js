const mongoose = require('mongoose');
const crypto = require('crypto');

// Helper function to generate a random ID
const generateId = (length = 16) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
};

const paymentIntentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentIntentId: {
        type: String,
        unique: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        uppercase: true,
        minlength: 3,
        maxlength: 3
    },
    status: {
        type: String,
        enum: ['created', 'processing', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'succeeded', 'canceled', 'failed'],
        default: 'created'
    },
    paymentMethod: {
        type: String,
        default: null
    },
    paymentMethodTypes: {
        type: [String],
        default: ['card']
    },
    customer: {
        type: String,
        ref: 'Customer',
        required: false
    },
    description: {
        type: String,
        trim: true
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    },
    receiptEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    statementDescriptor: {
        type: String,
        trim: true,
        maxlength: 22
    },
    clientSecret: {
        type: String,
        select: false // Don't return in queries by default
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
        error: String
    },
    expiresAt: {
        type: Date,
        default: function () {
            const now = new Date();
            return new Date(now.setDate(now.getDate() + 7)); // Expires in 7 days by default
        }
    },
    canceledAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate a unique payment intent ID and client secret
paymentIntentSchema.pre('validate', function (next) {
    if (this.isNew) {
        if (!this.paymentIntentId) {
            this.paymentIntentId = `pi_${generateId(16)}`;
        }
        if (!this.clientSecret) {
            this.clientSecret = `${this.paymentIntentId}_secret_${crypto.randomBytes(16).toString('hex')}`;
        }
    }
    next();
});

// Index for faster queries
paymentIntentSchema.index({ userId: 1 });
paymentIntentSchema.index({ paymentIntentId: 1 });
paymentIntentSchema.index({ customer: 1 });
paymentIntentSchema.index({ status: 1 });

module.exports = mongoose.model('PaymentIntent', paymentIntentSchema);
