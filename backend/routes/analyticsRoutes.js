const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Test top customers endpoint (no auth for debugging) - must be before protect middleware
router.get('/test-top-customers', analyticsController.testTopCustomers);

// Test dashboard overview endpoint (no auth for debugging) - must be before protect middleware
router.get('/test-dashboard-overview', analyticsController.testDashboardOverview);

// Test main dashboard endpoint (no auth for debugging) - must be before protect middleware
router.get('/test-main-dashboard', analyticsController.testMainDashboard);

// Test balance endpoint (no auth for debugging) - must be before protect middleware
router.get('/test-balance-and-payout', analyticsController.getBalanceAndPayout);

// Test subscription analytics endpoint (no auth for debugging) - must be before protect middleware
router.get('/test-subscription-analytics', analyticsController.testSubscriptionAnalytics);

// Apply authentication middleware to all routes
router.use(protect);

// Fresh dashboard endpoint (with auth)
router.get('/fresh-dashboard', analyticsController.getFreshDashboardData);

// Dashboard overview route
router.get('/dashboard-overview', analyticsController.getDashboardOverview);

// Real payment analytics route
router.get('/payment-analytics', analyticsController.getPaymentAnalytics);

// Debug route to check transactions
router.get('/debug-transactions', analyticsController.debugTransactions);

// Test data isolation endpoint
router.get('/test-data-isolation', analyticsController.testDataIsolation);

// Check and fix transactions endpoint
router.get('/check-transactions', analyticsController.checkAndFixTransactions);

// Cleanup orphaned transactions endpoint
router.delete('/cleanup-orphaned-transactions', analyticsController.cleanupOrphanedTransactions);

// Individual metrics routes
router.get('/gross-volume', analyticsController.getGrossVolume);
router.get('/balance-and-payout', analyticsController.getBalanceAndPayout);
router.get('/top-customers', analyticsController.getTopCustomers);
router.get('/failed-payments', analyticsController.getFailedPayments);
router.get('/product-analytics', analyticsController.getProductAnalytics);
router.get('/customer-analytics', analyticsController.getCustomerAnalytics);
router.get('/subscription-analytics', analyticsController.getSubscriptionAnalytics);

module.exports = router;
