const Coupon = require('../models/Coupon');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, type, value, validFrom, validTo, usageLimit, businessId, metadata } = req.body;
    if (!code || !type || !value || !businessId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const coupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      validFrom,
      validTo,
      usageLimit,
      businessId,
      metadata
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validate a coupon code
exports.validateCoupon = async (req, res) => {
  try {
    const { code, businessId } = req.body;
    if (!code || !businessId) {
      return res.status(400).json({ error: 'Code and businessId are required' });
    }
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), businessId, active: true });
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found or inactive' });
    }
    // Check date validity
    const now = new Date();
    if ((coupon.validFrom && now < coupon.validFrom) || (coupon.validTo && now > coupon.validTo)) {
      return res.status(400).json({ error: 'Coupon not valid at this time' });
    }
    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    res.json({ valid: true, coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a coupon by code
exports.getCoupon = async (req, res) => {
  try {
    const { code, businessId } = req.query;
    if (!code || !businessId) {
      return res.status(400).json({ error: 'Code and businessId are required' });
    }
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), businessId });
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 