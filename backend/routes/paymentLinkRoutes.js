const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const paymentLinkController = require('../controllers/paymentLinkController');

// @route   POST /api/payment-links
// @desc    Create a payment link
// @access  Private
router.post(
    '/',
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('amount', 'Amount is required and must be greater than 0').isFloat({ min: 0.01 }),
        check('businessId', 'Business ID is required').not().isEmpty(),
    ],
    paymentLinkController.createPaymentLink
);

// @route   GET /api/payment-links
// @desc    Get all payment links
// @access  Private
router.get('/', auth, paymentLinkController.getPaymentLinks);

// @route   GET /api/payment-links/test-auth
// @desc    Test authentication and user businesses
// @access  Private
router.get('/test-auth', auth, async (req, res) => {
    try {
        const Business = require('../models/Business');
        const userBusinesses = await Business.find({ user: req.user._id });
        
        res.json({
            success: true,
            user: {
                id: req.user._id,
                email: req.user.email
            },
            businesses: userBusinesses.map(b => ({
                id: b._id,
                name: b.name
            }))
        });
    } catch (error) {
        console.error('Test auth error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/payment-links/:id
// @desc    Get a payment link by ID
// @access  Private
router.get('/:id', auth, paymentLinkController.getPaymentLinkById);

// @route   PUT /api/payment-links/:id
// @desc    Update a payment link
// @access  Private
router.put(
    '/:id',
    auth,
    [
        check('title', 'Title is required').optional().not().isEmpty(),
        check('amount', 'Amount must be greater than 0').optional().isFloat({ min: 0.01 }),
    ],
    paymentLinkController.updatePaymentLink
);

// @route   DELETE /api/payment-links/:id
// @desc    Delete a payment link
// @access  Private
router.delete('/:id', auth, paymentLinkController.deletePaymentLink);

// @route   GET /api/payment-links/:id/track-view
// @desc    Track a visit to a payment link
// @access  Public
router.get('/:id/track-view', paymentLinkController.trackView);

// @route   GET /api/payment-links/public/:id
// @desc    Get a payment link for public viewing
// @access  Public
// Note: This route must be defined before the /:id route to avoid conflict
router.get('/public/:id', paymentLinkController.getPublicPaymentLink);

// @route   GET /api/payment-links/test-enum
// @desc    Test PaymentLink model enum values
// @access  Public
router.get('/test-enum', async (req, res) => {
    try {
        const PaymentLink = require('../models/PaymentLink');
        const schema = PaymentLink.schema;
        const paymentMethodTypesField = schema.path('paymentMethodTypes');
        
        res.json({
            success: true,
            enumValues: paymentMethodTypesField.enumValues,
            enum: paymentMethodTypesField.enum,
            schema: {
                type: paymentMethodTypesField.instance,
                enum: paymentMethodTypesField.enum,
                default: paymentMethodTypesField.defaultValue
            }
        });
    } catch (error) {
        console.error('Test enum error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router; 