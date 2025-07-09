const Customer = require('../models/Customer');
const { validationResult } = require('express-validator');
const Business = require('../models/Business');

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, name, phone, description, metadata, billingAddress, shippingAddress, businessId } = req.body;

        if (!businessId) {
            return res.status(400).json({ error: 'businessId is required' });
        }

        // Check if business exists and belongs to user
        const business = await Business.findOne({ _id: businessId, user: req.user._id });
        if (!business) {
            return res.status(403).json({ error: 'Business not found or you do not have permission' });
        }

        // Check if customer already exists for this user and business
        const existingCustomer = await Customer.findOne({
            userId: req.user._id,
            email: email,
            businessId: businessId
        });

        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists for this business' });
        }

        // Create new customer
        const customer = new Customer({
            userId: req.user._id,
            email,
            name,
            phone,
            description,
            metadata: metadata || {},
            billingAddress,
            shippingAddress,
            businessId
        });

        const savedCustomer = await customer.save();

        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error('Create customer error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all customers for a user
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const customers = await Customer.find({
            userId: req.user._id,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Customer.countDocuments({
            userId: req.user._id,
            isDeleted: false
        });

        res.json({
            customers,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Get customers error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get a customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            $or: [
                { _id: req.params.id },
                { customerId: req.params.id }
            ],
            userId: req.user._id,
            isDeleted: false
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error('Get customer error:', error.message);

        // Check if error is due to invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, name, phone, description, metadata, billingAddress, shippingAddress } = req.body;

        // Find customer by ID or customerId
        const customer = await Customer.findOne({
            $or: [
                { _id: req.params.id },
                { customerId: req.params.id }
            ],
            userId: req.user._id,
            isDeleted: false
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Update customer fields
        if (email) customer.email = email;
        if (name) customer.name = name;
        if (phone) customer.phone = phone;
        if (description) customer.description = description;
        if (metadata) customer.metadata = metadata;
        if (billingAddress) customer.billingAddress = billingAddress;
        if (shippingAddress) customer.shippingAddress = shippingAddress;

        const updatedCustomer = await customer.save();

        res.json(updatedCustomer);
    } catch (error) {
        console.error('Update customer error:', error.message);

        // Check if error is due to invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete a customer (soft delete)
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
    try {
        // Find customer by ID or customerId
        const customer = await Customer.findOne({
            $or: [
                { _id: req.params.id },
                { customerId: req.params.id }
            ],
            userId: req.user._id,
            isDeleted: false
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Soft delete
        customer.isDeleted = true;
        await customer.save();

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error.message);

        // Check if error is due to invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Add a payment method to customer
// @route   POST /api/customers/:id/payment-methods
// @access  Private
const addPaymentMethod = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { type, details, isDefault } = req.body;

        // Find customer by ID or customerId
        const customer = await Customer.findOne({
            $or: [
                { _id: req.params.id },
                { customerId: req.params.id }
            ],
            userId: req.user._id,
            isDeleted: false
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Generate a unique ID for the payment method
        // Use crypto instead of nanoid to avoid ES Module issues
        const crypto = require('crypto');
        const paymentMethodId = `pm_${crypto.randomBytes(8).toString('hex')}`;

        // Create new payment method
        const newPaymentMethod = {
            id: paymentMethodId,
            type,
            details,
            isDefault: isDefault || false,
            createdAt: new Date()
        };

        // If this is set as default, update any existing default
        if (isDefault) {
            customer.paymentMethods.forEach(method => {
                method.isDefault = false;
            });
            customer.defaultPaymentMethod = paymentMethodId;
        }

        // Add to payment methods array
        customer.paymentMethods.push(newPaymentMethod);
        const updatedCustomer = await customer.save();

        res.status(201).json({
            paymentMethod: newPaymentMethod,
            customer: updatedCustomer
        });
    } catch (error) {
        console.error('Add payment method error:', error.message);

        // Check if error is due to invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all customers for a specific business
// @route   GET /api/customers/business/:businessId
// @access  Private
const getCustomersByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        if (!businessId) {
            return res.status(400).json({ error: 'businessId is required' });
        }
        // Find all customers for this user and business
        const customers = await Customer.find({
            userId: req.user._id,
            businessId: businessId,
            isDeleted: false
        }).sort({ createdAt: -1 });
        res.json({ customers });
    } catch (error) {
        console.error('Get customers by business error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    addPaymentMethod,
    getCustomersByBusiness
};
