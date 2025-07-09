const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Business = require('../models/Business');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, username } = req.body;
    console.log('Register attempt:', email);

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        console.log('User exists:', !!userExists);

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            username: username || `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
        });
        console.log('User created:', user.email);

        if (user) {
            // Generate API keys
            const keys = user.generateAPIKeys();
            await user.save();

            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role,
                apiKey: keys.apiKey,
                secretKey: keys.secretKey,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Fetch businesses
        const businesses = await Business.find({ user: user._id });

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            business: businesses,
            businessId: businesses[0]?._id || null,
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Fetch all businesses owned by the user
        const businesses = await Business.find({ user: user._id });
        // Attach business array and businessId (first business's _id, if any)
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            apiKey: user.apiKey,
            business: businesses,
            businessId: businesses[0]?._id || null,
        });
    } catch (error) {
        console.error('Get profile error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Generate new API keys
// @route   POST /api/auth/api-key
// @access  Private
const generateAPIKeys = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new API keys
        const keys = user.generateAPIKeys();
        await user.save();

        res.json({
            apiKey: keys.apiKey,
            secretKey: keys.secretKey,
        });
    } catch (error) {
        console.error('Generate API keys error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    generateAPIKeys,
};
