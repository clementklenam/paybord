const mongoose = require('mongoose');
const crypto = require('crypto');

const businessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true
    },
    businessType: {
        type: String,
        required: [true, 'Business type is required'],
        enum: ['sole_proprietorship', 'partnership', 'limited_liability', 'corporation', 'non_profit', 'other']
    },
    registrationNumber: {
        type: String,
        trim: true
    },
    taxId: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        required: [true, 'Industry is required']
    },
    website: {
        type: String,
        trim: true,
        match: [
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'Please enter a valid URL'
        ]
    },
    email: {
        type: String,
        required: [true, 'Business email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Business phone is required'],
        trim: true
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'MAD', 'XOF', 'XAF']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State/Province is required']
        },
        postalCode: {
            type: String
        },
        country: {
            type: String,
            required: [true, 'Country is required']
        }
    },
    // PCI Compliance Fields
    complianceInfo: {
        pciDssCompliant: {
            type: Boolean,
            default: false
        },
        pciDssLevel: {
            type: String,
            enum: ['level_1', 'level_2', 'level_3', 'level_4', 'not_applicable'],
            default: 'not_applicable'
        },
        dataSecurityOfficer: {
            name: String,
            email: String,
            phone: String
        },
        dataProtectionPolicy: {
            exists: {
                type: Boolean,
                default: false
            },
            lastUpdated: Date
        }
    },
    // Banking Information (encrypted for security)
    bankingInfo: {
        bankName: {
            type: String,
            required: [true, 'Bank name is required']
        },
        accountNumber: {
            type: String,
            required: [true, 'Account number is required']
        },
        accountName: {
            type: String,
            required: [true, 'Account name is required']
        },
        swiftCode: String,
        routingNumber: String
    },
    // For African specific payment methods
    mobileMoneyInfo: {
        provider: String,
        accountNumber: String,
        accountName: String
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified'
    },
    verificationDocuments: [
        {
            documentType: {
                type: String,
                enum: ['business_registration', 'tax_certificate', 'utility_bill', 'director_id', 'bank_statement', 'other']
            },
            documentUrl: String,
            uploadDate: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
            },
            rejectionReason: String
        }
    ],
    merchantId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'inactive'
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

// Generate a unique merchant ID before saving
businessSchema.pre('save', function (next) {
    if (!this.merchantId) {
        this.merchantId = 'MERCH_' + crypto.randomBytes(8).toString('hex').toUpperCase();
    }
    next();
});

// Method to encrypt sensitive banking information
businessSchema.methods.encryptBankingInfo = function () {
    // Implement encryption logic here if needed
    // This is a placeholder for actual encryption implementation
};

// Method to decrypt sensitive banking information
businessSchema.methods.decryptBankingInfo = function () {
    // Implement decryption logic here if needed
    // This is a placeholder for actual decryption implementation
};

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
