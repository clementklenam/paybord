const mongoose = require('mongoose');
const crypto = require('crypto');
const { generatePaymentLinkUrl } = require('../config/frontend');

const paymentLinkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    linkId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be at least 0.01']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        uppercase: true,
        minlength: 3,
        maxlength: 3
    },
    imageUrl: {
        type: String,
        trim: true
    },
    paymentMethodTypes: {
        type: [String],
        enum: ['card', 'bank_transfer', 'mobile_money'],
        default: ['card']
    },
    requiredFields: {
        customerName: {
            type: Boolean,
            default: true
        },
        customerEmail: {
            type: Boolean,
            default: true
        },
        customerPhone: {
            type: Boolean,
            default: false
        },
        shippingAddress: {
            type: Boolean,
            default: false
        }
    },
    expiresAt: {
        type: Date,
        default: null // null means no expiration
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    },
    analytics: {
        clicks: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        conversions: {
            type: Number,
            default: 0
        }
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

// Generate a unique payment link ID and URL before saving
paymentLinkSchema.pre('validate', function(next) {
    console.log('PaymentLink validation - paymentMethodTypes:', this.paymentMethodTypes);
    console.log('PaymentLink validation - enum values:', ['card', 'bank_transfer', 'mobile_money']);
    
    if (this.isNew) {
        // Generate link ID if not provided
        if (!this.linkId) {
            this.linkId = 'pl_' + crypto.randomBytes(8).toString('hex');
        }
        
        // Generate URL if not provided
        if (!this.url) {
            this.url = generatePaymentLinkUrl(this.linkId);
            console.log('Generated payment link URL:', this.url);
        }
    }
    next();
});

const PaymentLink = mongoose.model('PaymentLink', paymentLinkSchema);

module.exports = PaymentLink; 