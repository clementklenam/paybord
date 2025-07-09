const mongoose = require('mongoose');
const crypto = require('crypto');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0
    },
    image: {
        type: String
    }
});

const storefrontSchema = new mongoose.Schema({
    customId: {
        type: String,
        unique: true,
        sparse: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Storefront name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    url: {
        type: String
    },
    banner: {
        type: String,
        default: null
    },
    logo: {
        type: String,
        default: null
    },
    primaryColor: {
        type: String,
        default: '#1e8449'
    },
    accentColor: {
        type: String,
        default: '#27ae60'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    socialLinks: {
        instagram: String,
        twitter: String,
        facebook: String
    },
    paymentMethods: {
        type: [String],
        default: ['card', 'bank_transfer']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'draft'
    },
    visits: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Generate a unique slug before saving
storefrontSchema.pre('save', async function(next) {
    if (!this.slug) {
        // Generate slug from name
        let slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
        
        // Check if slug exists
        const existingStorefront = await mongoose.model('Storefront').findOne({ slug });
        
        if (existingStorefront) {
            // If slug exists, append a random string
            slug = `${slug}-${crypto.randomBytes(3).toString('hex')}`;
        }
        
        this.slug = slug;
    }
    
    // Generate URL based on slug
    if (!this.url) {
        // In production, this would be your actual domain
        const baseUrl = process.env.STOREFRONT_BASE_URL || 'https://paymesa.com/storefront';
        this.url = `${baseUrl}/${this.slug}`;
    }
    
    next();
});

const Storefront = mongoose.model('Storefront', storefrontSchema);

module.exports = Storefront;
