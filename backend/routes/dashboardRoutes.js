const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary data
// @access  Private
router.get('/summary', (req, res) => {
    // Placeholder response until we implement the full controller
    res.json({
        today: {
            grossVolume: {
                amount: 0,
                lastUpdated: new Date().toLocaleTimeString(),
                trend: 0
            },
            balance: {
                amount: 0,
                type: 'USD',
                trend: 0
            }
        },
        overview: {
            grossVolume: {
                total: 0,
                previousPeriod: 0,
                trend: [],
                lastUpdated: new Date().toLocaleTimeString()
            },
            netVolume: {
                total: 0,
                previousPeriod: 0,
                trend: [],
                lastUpdated: new Date().toLocaleTimeString()
            },
            newCustomers: {
                total: 0,
                previousPeriod: 0,
                trend: [],
                lastUpdated: new Date().toLocaleTimeString()
            },
            topCustomers: []
        }
    });
});

// @route   GET /api/dashboard/revenue
// @desc    Get revenue statistics
// @access  Private
router.get('/revenue', (req, res) => {
    // Placeholder response
    res.json({
        data: [],
        total: 0,
        change: 0
    });
});

// @route   GET /api/dashboard/customers
// @desc    Get customer statistics
// @access  Private
router.get('/customers', (req, res) => {
    // Placeholder response
    res.json({
        data: [],
        total: 0,
        change: 0
    });
});

// @route   GET /api/dashboard/top-customers
// @desc    Get top customers by spend
// @access  Private
router.get('/top-customers', (req, res) => {
    // Placeholder response
    res.json([]);
});

module.exports = router;
