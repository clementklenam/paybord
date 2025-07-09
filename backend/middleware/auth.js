const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ error: 'User not found' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// Middleware to verify API key for public API access
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    console.log('Received x-api-key:', apiKey, 'length:', apiKey ? apiKey.length : 0);
    console.log('Expected API_KEY:', process.env.API_KEY, 'length:', process.env.API_KEY ? process.env.API_KEY.length : 0);
    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }
    if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({ error: 'Invalid API key' });
        }
        next();
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Not authorized as an admin' });
    }
};

// Middleware to verify secret key for sensitive operations
const secretKeyAuth = async (req, res, next) => {
    const secretKey = req.headers['x-secret-key'];

    if (!secretKey) {
        return res.status(401).json({ error: 'Secret key is required' });
    }

    try {
        // Find user by secret key (need to select secretKey field explicitly)
        const user = await User.findOne({ secretKey }).select('+secretKey');

        if (!user) {
            return res.status(401).json({ error: 'Invalid secret key' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Secret key auth error:', error.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { protect, admin, apiKeyAuth, secretKeyAuth };
