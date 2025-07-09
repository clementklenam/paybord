const express = require('express');
const router = express.Router();
const paystackController = require('../controllers/paystackController');

// Initialize Paystack payment
router.post('/initialize', paystackController.initializePayment);

// Verify Paystack payment
router.get('/verify/:reference', paystackController.verifyPayment);

// Get banks for bank transfer
router.get('/banks', paystackController.getBanks);

// Resolve bank account number
router.post('/resolve-account', paystackController.resolveAccount);

module.exports = router; 