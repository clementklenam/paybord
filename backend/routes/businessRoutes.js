const express = require('express');
const {
    registerBusiness,
    getBusinessProfile,
    updateBusinessProfile,
    uploadVerificationDocument,
    checkVerificationStatus
} = require('../controllers/businessController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');
const Business = require('../models/Business');

const router = express.Router();

// All business routes require authentication
router.use(protect);

// @route   POST /api/business/register
// @desc    Register a new business
// @access  Private
router.post(
    '/register',
    [
        check('businessName', 'Business name is required').not().isEmpty(),
        check('businessType', 'Business type is required').not().isEmpty(),
        check('industry', 'Industry is required').not().isEmpty(),
        check('email', 'Please include a valid business email').isEmail(),
        check('phone', 'Business phone is required').not().isEmpty(),
        check('address.street', 'Street address is required').not().isEmpty(),
        check('address.city', 'City is required').not().isEmpty(),
        check('address.state', 'State/Province is required').not().isEmpty(),
        check('address.country', 'Country is required').not().isEmpty(),
        check('bankingInfo.bankName', 'Bank name is required').not().isEmpty(),
        check('bankingInfo.accountNumber', 'Account number is required').not().isEmpty(),
        check('bankingInfo.accountName', 'Account name is required').not().isEmpty()
    ],
    registerBusiness
);

// @route   GET /api/business/profile
// @desc    Get business profile
// @access  Private
router.get('/profile', getBusinessProfile);

// @route   PUT /api/business/profile
// @desc    Update business profile
// @access  Private
router.put('/profile', updateBusinessProfile);

// @route   POST /api/business/upload-document/:documentType
// @desc    Upload verification document
// @access  Private
router.post('/upload-document/:documentType', uploadVerificationDocument);

// @route   GET /api/business/verification-status
// @desc    Check business verification status
// @access  Private
router.get('/verification-status', checkVerificationStatus);

// @route   GET /api/business
// @desc    Get all businesses for the current user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const businesses = await Business.find({ user: req.user._id });
        res.json({ data: businesses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch businesses' });
    }
});

module.exports = router;
