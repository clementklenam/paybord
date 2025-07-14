const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password in queries
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    apiKey: {
        type: String,
        unique: true,
        sparse: true
    },
    secretKey: {
        type: String,
        select: false
    },
    isVerified: {
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

// Hash password before saving
userSchema.pre('save', async function (next) {
    console.log('Pre-save hook called for user:', this.email);
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hash');
        return next();
    }
    // Only hash if not already hashed (bcrypt hashes are 60 chars and start with $2)
    if (this.password && this.password.startsWith('$2') && this.password.length === 60) {
        console.log('Password already hashed, skipping re-hash');
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated for user:', this.email);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed for user:', this.email);
        next();
    } catch (err) {
        console.error('Error in pre-save hook:', err);
        next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log('Comparing password for user:', this.email);
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate API keys
userSchema.methods.generateAPIKeys = function () {
    const uuid = require('uuid');
    const crypto = require('crypto');

    this.apiKey = `pk_${uuid.v4().replace(/-/g, '')}`;
    this.secretKey = `sk_${crypto.randomBytes(24).toString('hex')}`;

    return {
        apiKey: this.apiKey,
        secretKey: this.secretKey
    };
};

// Drop existing indexes to fix the username issue
userSchema.statics.dropIndexes = async function () {
    try {
        await this.collection.dropIndexes();
        console.log('Indexes dropped successfully');
    } catch (error) {
        console.error('Error dropping indexes:', error);
    }
};

module.exports = mongoose.model('User', userSchema);
