const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Create a new subscription
router.post('/', subscriptionController.createSubscription);
// List all subscriptions (optionally filter by customer)
router.get('/', subscriptionController.listSubscriptions);
// Get a single subscription by ID
router.get('/:id', subscriptionController.getSubscription);

module.exports = router; 