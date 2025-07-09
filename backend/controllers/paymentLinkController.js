const PaymentLink = require('../models/PaymentLink');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { convertFromSmallestUnit, convertToSmallestUnit } = require('../utils/currency');

/**
 * @desc    Create a payment link
 * @route   POST /api/payment-links
 * @access  Private
 */
exports.createPaymentLink = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            title,
            description,
            amount,
            currency = 'USD',
            imageUrl,
            paymentMethodTypes = ['card'],
            businessId,
            requiredFields,
            expiresAt,
            metadata
        } = req.body;

        // Debug logging
        console.log('Creating payment link for user:', req.user._id);
        console.log('Business ID from request:', businessId);
        console.log('Request body:', req.body);

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'A valid amount is required' });
        }

        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        // Verify the business belongs to this user
        const Business = require('../models/Business');
        
        // First, let's see what businesses the user has
        const userBusinesses = await Business.find({ user: req.user._id });
        console.log('User businesses:', userBusinesses.map(b => ({ id: b._id, name: b.name })));
        
        const business = await Business.findOne({
            _id: businessId,
            user: req.user._id
        });

        console.log('Found business:', business ? business._id : 'Not found');

        if (!business) {
            if (userBusinesses.length === 0) {
                return res.status(403).json({ message: 'You need to create a business first before creating payment links' });
            }
            return res.status(403).json({ 
                message: 'You do not have permission to create a payment link for this business',
                userBusinesses: userBusinesses.map(b => ({ id: b._id, name: b.name }))
            });
        }

        // Create the payment link
        // Convert amount to smallest unit for storage
        const paymentLink = new PaymentLink({
            userId: req.user._id,
            businessId,
            title,
            description,
            amount: convertToSmallestUnit(amount, currency),
            currency,
            imageUrl,
            paymentMethodTypes,
            requiredFields,
            expiresAt,
            metadata
        });

        // Save the payment link
        const savedPaymentLink = await paymentLink.save();

        res.status(201).json({
            success: true,
            data: savedPaymentLink
        });
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Get all payment links
 * @route   GET /api/payment-links
 * @access  Private
 */
exports.getPaymentLinks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build query - only show payment links for the current user's businesses
        const Business = require('../models/Business');
        const userBusinesses = await Business.find({ user: req.user._id }).select('_id');
        const businessIds = userBusinesses.map(business => business._id);

        const query = {
            businessId: { $in: businessIds.map(id => id.toString()) }
        };

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with pagination
        const paymentLinks = await PaymentLink.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Convert amounts from smallest unit to base unit for display
        const convertedPaymentLinks = paymentLinks.map(link => ({
            ...link.toObject(),
            amount: convertFromSmallestUnit(link.amount, link.currency)
        }));

        // Get total count
        const total = await PaymentLink.countDocuments(query);

        res.json({
            success: true,
            data: convertedPaymentLinks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching payment links:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Get a payment link by ID
 * @route   GET /api/payment-links/:id
 * @access  Private
 */
exports.getPaymentLinkById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the payment link
        let paymentLink;
        
        // Try to find by linkId or by _id if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            paymentLink = await PaymentLink.findById(id);
        } 
        
        if (!paymentLink) {
            paymentLink = await PaymentLink.findOne({ linkId: id });
        }

        if (!paymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found'
            });
        }

        // Verify user has permission to access this payment link
        const Business = require('../models/Business');
        const business = await Business.findOne({
            _id: paymentLink.businessId,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this payment link'
            });
        }

        // Convert amount from smallest unit to base unit for display
        const convertedPaymentLink = {
            ...paymentLink.toObject(),
            amount: convertFromSmallestUnit(paymentLink.amount, paymentLink.currency)
        };

        res.json({
            success: true,
            data: convertedPaymentLink
        });
    } catch (error) {
        console.error('Error fetching payment link:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Update a payment link
 * @route   PUT /api/payment-links/:id
 * @access  Private
 */
exports.updatePaymentLink = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find the payment link
        let paymentLink;
        
        // Try to find by linkId or by _id if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            paymentLink = await PaymentLink.findById(id);
        } 
        
        if (!paymentLink) {
            paymentLink = await PaymentLink.findOne({ linkId: id });
        }

        if (!paymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found'
            });
        }

        // Verify user has permission to update this payment link
        const Business = require('../models/Business');
        const business = await Business.findOne({
            _id: paymentLink.businessId,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this payment link'
            });
        }

        // Don't allow updating userId or businessId
        delete updates.userId;
        delete updates.businessId;
        delete updates.linkId;

        // Convert amount to smallest unit if it's being updated
        if (updates.amount !== undefined) {
            updates.amount = convertToSmallestUnit(updates.amount, updates.currency || paymentLink.currency);
        }

        // Update the payment link
        Object.keys(updates).forEach(key => {
            paymentLink[key] = updates[key];
        });
        
        paymentLink.updatedAt = Date.now();
        const updatedPaymentLink = await paymentLink.save();

        // Convert amount back to base unit for response
        const convertedPaymentLink = {
            ...updatedPaymentLink.toObject(),
            amount: convertFromSmallestUnit(updatedPaymentLink.amount, updatedPaymentLink.currency)
        };

        res.json({
            success: true,
            data: convertedPaymentLink
        });
    } catch (error) {
        console.error('Error updating payment link:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Delete a payment link
 * @route   DELETE /api/payment-links/:id
 * @access  Private
 */
exports.deletePaymentLink = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the payment link
        let paymentLink;
        
        // Try to find by linkId or by _id if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            paymentLink = await PaymentLink.findById(id);
        } 
        
        if (!paymentLink) {
            paymentLink = await PaymentLink.findOne({ linkId: id });
        }

        if (!paymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found'
            });
        }

        // Verify user has permission to delete this payment link
        const Business = require('../models/Business');
        const business = await Business.findOne({
            _id: paymentLink.businessId,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this payment link'
            });
        }

        // Delete the payment link
        await PaymentLink.deleteOne({ _id: paymentLink._id });

        res.json({
            success: true,
            message: 'Payment link deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting payment link:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Track a visit to a payment link (public)
 * @route   GET /api/payment-links/:id/track-view
 * @access  Public
 */
exports.trackView = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the payment link by linkId
        const paymentLink = await PaymentLink.findOne({ linkId: id });
        
        if (!paymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found'
            });
        }
        
        // Increment the views count
        paymentLink.analytics.views += 1;
        await paymentLink.save();
        
        res.json({
            success: true,
            message: 'View tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get a payment link for public viewing
 * @route   GET /api/payment-links/public/:id
 * @access  Public
 */
exports.getPublicPaymentLink = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the payment link by linkId
        const paymentLink = await PaymentLink.findOne({ linkId: id, status: 'active' });
        
        if (!paymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found or inactive'
            });
        }

        // Check if the link has expired
        if (paymentLink.expiresAt && new Date(paymentLink.expiresAt) < new Date()) {
            // Update status to expired
            paymentLink.status = 'expired';
            await paymentLink.save();
            
            return res.status(410).json({
                success: false,
                message: 'This payment link has expired'
            });
        }
        
        // Increment the views count
        paymentLink.analytics.clicks += 1;
        await paymentLink.save();
        
        // Return limited data for public consumption
        // Convert amount from smallest unit to base unit for display
        const publicData = {
            title: paymentLink.title,
            description: paymentLink.description,
            amount: convertFromSmallestUnit(paymentLink.amount, paymentLink.currency),
            currency: paymentLink.currency,
            imageUrl: paymentLink.imageUrl,
            paymentMethodTypes: paymentLink.paymentMethodTypes,
            requiredFields: paymentLink.requiredFields,
            linkId: paymentLink.linkId,
            businessId: paymentLink.businessId
        };
        
        // If business information is needed, fetch it
        if (paymentLink.businessId) {
            try {
                const Business = require('../models/Business');
                const business = await Business.findById(paymentLink.businessId).select('name businessName');
                if (business) {
                    publicData.business = {
                        _id: business._id,
                        name: business.businessName || business.name
                    };
                }
            } catch (error) {
                console.error('Error fetching business info:', error);
                // Continue without business info
            }
        }
        
        res.json({
            success: true,
            data: publicData
        });
    } catch (error) {
        console.error('Error getting public payment link:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}; 