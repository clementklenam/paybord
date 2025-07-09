const mongoose = require('mongoose');
const crypto = require('crypto');

// Helper function to generate a random ID
const generateId = (length = 16) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
};

const paymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerId: {
        type: String,
        ref: 'Customer',
        required: true
    },
    paymentMethodId: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: ['card', 'bank_account', 'wallet'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    card: {
        brand: String,
        last4: String,
        expiryMonth: Number,
        expiryYear: Number,
        fingerprint: String,
        country: String,
        funding: String
    },
    bankAccount: {
        bankName: String,
        accountType: String,
        last4: String,
        country: String,
        currency: String
    },
    wallet: {
        type: String,
        email: String,
        walletId: String
    },
    billingDetails: {
        name: String,
        email: String,
        phone: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        }
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    },
    isDefault: {
        type: Boolean,
        default: false
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

// Generate a unique payment method ID
paymentMethodSchema.pre('validate', function (next) {
    if (this.isNew && !this.paymentMethodId) {
        const prefix = this.type === 'card' ? 'pm_card_' :
            this.type === 'bank_account' ? 'pm_bank_' : 'pm_wallet_';
        this.paymentMethodId = `${prefix}${generateId(16)}`;
    }
    next();
});

// Index for faster queries
paymentMethodSchema.index({ userId: 1 });
paymentMethodSchema.index({ customerId: 1 });
paymentMethodSchema.index({ paymentMethodId: 1 });
paymentMethodSchema.index({ type: 1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
