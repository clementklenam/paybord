const mongoose = require('mongoose');
const crypto = require('crypto');

// Helper function to generate a random ID
const generateId = (length = 16) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
};

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerId: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
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
    defaultPaymentMethod: {
        type: String,
        default: null
    },
    paymentMethods: [{
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['card', 'bank_account', 'wallet'],
            required: true
        },
        details: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {}
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    billingAddress: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    shippingAddress: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    isDeleted: {
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

// Generate a unique customer ID
customerSchema.pre('validate', function (next) {
    if (this.isNew && !this.customerId) {
        this.customerId = `cus_${generateId(16)}`;
    }
    next();
});

// Index for faster queries
customerSchema.index({ userId: 1, email: 1 });
customerSchema.index({ customerId: 1 });

module.exports = mongoose.model('Customer', customerSchema);
