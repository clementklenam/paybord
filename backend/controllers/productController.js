const Product = require('../models/Product');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { business: businessId, name, description, price, image, category, currency, metadata } = req.body;

        console.log('Creating product with business ID:', businessId);
        console.log('Authenticated user ID:', req.user._id);
        
        // Check if businessId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(businessId)) {
            console.log('Invalid business ID format:', businessId);
            return res.status(400).json({ message: 'Invalid business ID format' });
        }
        
        // First check if business exists at all
        let businessExists;
        try {
            console.log('Looking up business with ID:', businessId);
            
            // Try to find by string comparison of IDs instead of direct ObjectId lookup
            // This is more reliable in some MongoDB configurations
            const allBusinesses = await Business.find({ user: req.user._id });
            console.log('Available businesses for this user:', allBusinesses.map(b => ({ id: b._id.toString(), name: b.businessName })));
            
            // Find the business by string comparison
            businessExists = allBusinesses.find(b => b._id.toString() === businessId);
            console.log('Business lookup result:', businessExists ? 'Found' : 'Not found');
            
            if (!businessExists) {
                // If not found, try direct lookup as fallback
                businessExists = await Business.findById(businessId);
                
                if (!businessExists) {
                    console.log('Business not found with either method');
                    return res.status(404).json({ message: 'Business not found' });
                }
            }
        } catch (error) {
            console.error('Error looking up business:', error);
            return res.status(500).json({ message: 'Error looking up business', error: error.message });
        }
        
        // Then check if it belongs to the user
        if (businessExists.user.toString() !== req.user._id.toString()) {
            console.log('Business owner:', businessExists.user);
            console.log('Current user:', req.user._id);
            return res.status(403).json({ message: 'You do not have permission to create products for this business' });
        }
        
        // Business exists and belongs to user
        const business = businessExists;

        // Create new product
        const product = new Product({
            business: businessId,
            name,
            description,
            price,
            image,
            category,
            currency: currency || business.currency || 'USD',
            metadata
        });
        
        // If a customId is provided in the request, use it
        if (req.body.customId) {
            product.customId = req.body.customId;
        }

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all products for a business
 * @route   GET /api/products
 * @access  Private
 */
exports.getProducts = async (req, res) => {
    try {
        const { businessId, page = 1, limit = 10, search, category, active, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build query
        const query = {};
        
        // Filter by business if provided
        if (businessId) {
            // Verify business belongs to the user
            const business = await Business.findOne({ 
                _id: businessId,
                user: req.user._id
            });

            if (!business) {
                return res.status(404).json({ message: 'Business not found or you do not have permission' });
            }
            
            query.business = businessId;
        } else {
            // If no businessId provided, get all products for all businesses owned by the user
            const businesses = await Business.find({ user: req.user._id }).select('_id');
            const businessIds = businesses.map(business => business._id);
            query.business = { $in: businessIds };
        }

        // Add search filter if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Add category filter if provided
        if (category) {
            query.category = category;
        }

        // Add active filter if provided
        if (active !== undefined) {
            query.active = active === 'true';
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with pagination
        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('business', 'businessName');

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.json({
            data: products,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a product by ID
 * @route   GET /api/products/:id
 * @access  Private
 */
exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        let product;
        
        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            product = await Product.findById(id)
                .populate('business', 'businessName currency');
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            product = await Product.findOne({ customId: id })
                .populate('business', 'businessName currency');
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: product.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to view this product' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private
 */
exports.updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        let product;
        
        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            product = await Product.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            product = await Product.findOne({ customId: id });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: product.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to update this product' });
        }

        // Update fields
        const updateData = { ...req.body, updatedAt: Date.now() };
        
        // Don't allow changing the business
        delete updateData.business;
        
        // Update product
        let updatedProduct;
        
        if (isValidObjectId) {
            // If it's a valid ObjectId, use findByIdAndUpdate
            updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        } else {
            // If it's a custom ID, use findOneAndUpdate
            updatedProduct = await Product.findOneAndUpdate(
                { customId: req.params.id },
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        let product;
        
        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            product = await Product.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            product = await Product.findOne({ customId: id });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: product.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to delete this product' });
        }

        if (isValidObjectId) {
            // Use findByIdAndDelete for valid ObjectId
            await Product.findByIdAndDelete(id);
        } else {
            // Use findOneAndDelete for custom ID
            await Product.findOneAndDelete({ customId: id });
        }

        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error('Error deleting product:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update product active status
 * @route   PATCH /api/products/:id/status
 * @access  Private
 */
exports.updateProductStatus = async (req, res) => {
    try {
        const { active } = req.body;

        if (active === undefined) {
            return res.status(400).json({ message: 'Active status is required' });
        }

        const id = req.params.id;
        let product;
        
        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            product = await Product.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            product = await Product.findOne({ customId: id });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: product.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to update this product' });
        }

        product.active = active;
        product.updatedAt = Date.now();
        await product.save();

        res.json(product);
    } catch (error) {
        console.error('Error updating product status:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Private
 */
exports.getProductCategories = async (req, res) => {
    try {
        // Get all businesses owned by the user
        const businesses = await Business.find({ user: req.user._id }).select('_id');
        const businessIds = businesses.map(business => business._id);

        // Find all distinct categories from products in these businesses
        const categories = await Product.distinct('category', { 
            business: { $in: businessIds },
            category: { $ne: null, $ne: '' } 
        });

        res.json(categories);
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
