const express = require('express');
const router = express.Router();
const paystackSubscriptionController = require('../controllers/paystackSubscriptionController');
const { protect } = require('../middleware/auth');

// Public webhook route (no auth required) - must be first
router.post('/webhook', paystackSubscriptionController.handlePaymentWebhook);

// Update subscription status (for testing) - no auth required
router.put('/test/:id/status', paystackSubscriptionController.updateSubscriptionStatus);

// Protected routes (require authentication)
router.use(protect);

// Create subscription
router.post('/', paystackSubscriptionController.createSubscription);

// Send invoice to customer
router.post('/:subscriptionId/send-invoice', paystackSubscriptionController.sendInvoice);

// Get payment status
router.get('/:subscriptionId/payment-status', paystackSubscriptionController.getPaymentStatus);

// List subscriptions
router.get('/', paystackSubscriptionController.listSubscriptions);

// Get single subscription
router.get('/:id', paystackSubscriptionController.getSubscription);

// Cancel subscription
router.put('/:id/cancel', paystackSubscriptionController.cancelSubscription);

module.exports = router; 