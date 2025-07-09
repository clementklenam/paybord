const express = require('express');
const {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    addPaymentMethod,
    getCustomersByBusiness
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private
router.post(
    '/',
    [
        check('email', 'Valid email is required').isEmail(),
        check('name', 'Name is required').not().isEmpty()
    ],
    createCustomer
);

// @route   GET /api/customers
// @desc    Get all customers for a user
// @access  Private
router.get('/', getCustomers);

// @route   GET /api/customers/:id
// @desc    Get a customer by ID
// @access  Private
router.get('/:id', getCustomerById);

// @route   PUT /api/customers/:id
// @desc    Update a customer
// @access  Private
router.put(
    '/:id',
    [
        check('email', 'Email must be valid if provided').optional().isEmail()
    ],
    updateCustomer
);

// @route   DELETE /api/customers/:id
// @desc    Delete a customer (soft delete)
// @access  Private
router.delete('/:id', deleteCustomer);

// @route   POST /api/customers/:id/payment-methods
// @desc    Add a payment method to customer
// @access  Private
router.post(
    '/:id/payment-methods',
    [
        check('type', 'Payment method type is required').isIn(['card', 'bank_account', 'wallet']),
        check('details', 'Payment method details are required').not().isEmpty()
    ],
    addPaymentMethod
);

// @route   GET /api/customers/business/:businessId
// @desc    Get all customers for a specific business
// @access  Private
router.get('/business/:businessId', getCustomersByBusiness);

module.exports = router;
