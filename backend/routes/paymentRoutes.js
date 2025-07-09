const express = require('express');
const {
    createPaymentIntent,
    getPaymentIntent,
    updatePaymentIntent,
    confirmPaymentIntent,
    cancelPaymentIntent,
    listPaymentIntents,
    getAllTransactions,
    createTransaction
} = require('../controllers/paymentController');
const { protect, apiKeyAuth } = require('../middleware/auth');
const { check } = require('express-validator');

const router = express.Router();

// Routes for payment intents - require authentication
router.use('/intent', protect);
router.use('/intents', protect);

// @route   POST /api/payments/intent
// @desc    Create a payment intent
// @access  Private
router.post(
    '/intent',
    [
        check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
        check('currency', 'Currency must be a 3-letter code if provided').optional().isLength({ min: 3, max: 3 }),
        check('paymentMethodTypes', 'Payment method types must be an array if provided').optional().isArray()
    ],
    createPaymentIntent
);

// @route   GET /api/payments/intent/:id
// @desc    Retrieve a payment intent
// @access  Private
router.get('/intent/:id', getPaymentIntent);

// @route   PUT /api/payments/intent/:id
// @desc    Update a payment intent
// @access  Private
router.put('/intent/:id', updatePaymentIntent);

// @route   POST /api/payments/intent/:id/confirm
// @desc    Confirm a payment intent
// @access  Private
router.post(
    '/intent/:id/confirm',
    [
        check('paymentMethod', 'Payment method is required').not().isEmpty()
    ],
    confirmPaymentIntent
);

// @route   POST /api/payments/intent/:id/cancel
// @desc    Cancel a payment intent
// @access  Private
router.post('/intent/:id/cancel', cancelPaymentIntent);

// @route   GET /api/payments/intents
// @desc    List all payment intents for a user
// @access  Private
router.get('/intents', listPaymentIntents);

// Transaction routes - some are accessible with API key
// @route   GET /api/payments
// @desc    Get all transactions
// @access  Private (API key or user auth)
router.get('/', getAllTransactions);

// @route   POST /api/payments
// @desc    Create a new transaction
// @access  Public (for storefront payments)
router.post(
    '/',
    [
        check('amount', 'Amount is required').not().isEmpty(),
        check('status', 'Status is required').isIn(['success', 'failed', 'pending']),
        check('customerName', 'Customer name is required').not().isEmpty()
    ],
    createTransaction
);

// @route   POST /api/payments/stripe-intent
// @desc    Create a Stripe PaymentIntent (public, for storefront)
// @access  Public (MVP)
router.post('/stripe-intent', require('../controllers/stripeController').createStripePaymentIntent);

// @route   POST /api/payments/update-transaction
// @desc    Update transaction status (public, for storefront)
// @access  Public
router.post('/update-transaction', require('../controllers/stripeController').updateTransactionStatus);

module.exports = router;
