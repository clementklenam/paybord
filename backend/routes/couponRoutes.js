const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Create a new coupon
router.post('/', couponController.createCoupon);
// Validate a coupon
router.post('/validate', couponController.validateCoupon);
// Get a coupon by code
router.get('/', couponController.getCoupon);

module.exports = router; 