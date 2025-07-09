const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Demo data routes
router.get('/demo/dashboard', testController.generateDashboardDemo);
router.get('/demo/balance-and-payout', testController.generateBalanceAndPayoutDemo);

module.exports = router;
