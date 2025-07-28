const Storefront = require('../models/Storefront');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new storefront
 * @route   POST /api/storefronts
 * @access  Private
 */
exports.createStorefront = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Accept both 'businessId' and 'business' from the request body
        const businessId = req.body.businessId || req.body.business;
        console.log('Storefront creation request body:', req.body);
        console.log('Resolved businessId:', businessId);
        console.log('User ID from req.user:', req.user?._id);
        if (!businessId || !mongoose.Types.ObjectId.isValid(businessId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing business ID.'
            });
        }
        // Check business ownership
        const business = await Business.findOne({ _id: businessId, user: req.user._id });
        console.log('Business lookup result:', business);
        if (!business) {
            return res.status(403).json({
                success: false,
                message: 'You do not own this business.'
            });
        }
        // Create the storefront with the correct businessId
        const storefront = new Storefront({
            ...req.body,
            business: businessId,
            status: 'active'
        });
        const savedStorefront = await storefront.save();
        const obj = savedStorefront.toObject();
        obj.id = obj._id;
        delete obj._id;
        res.status(201).json({ success: true, data: obj });
    } catch (error) {
        console.error('Storefront creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create storefront'
        });
    }
};

/**
 * @desc    Get all storefronts for a business
 * @route   GET /api/storefronts
 * @access  Private
 */
exports.getStorefronts = async (req, res) => {
    try {
        const { businessId, page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, returning mock data');
            
            // Return mock data when MongoDB is not available
            const mockStorefronts = [
                {
                    id: 'mock_1',
                    name: 'Premium Shop',
                    description: 'High-quality products for discerning customers',
                    status: 'active',
                    banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
                    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069',
                    visits: 1250,
                    sales: 78,
                    products: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'mock_2',
                    name: 'Tech Gadgets',
                    description: 'Latest technology and gadgets at competitive prices',
                    status: 'active',
                    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101',
                    logo: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1974',
                    visits: 2340,
                    sales: 156,
                    products: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'mock_3',
                    name: 'Fitness Store',
                    description: 'Everything you need for your fitness journey',
                    status: 'draft',
                    banner: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070',
                    logo: 'https://images.unsplash.com/photo-1517162418377-2b7e3e7399d8?q=80&w=1965',
                    visits: 980,
                    sales: 42,
                    products: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];

            // Apply filters to mock data
            let filteredStorefronts = mockStorefronts;

            if (search) {
                const searchLower = search.toLowerCase();
                filteredStorefronts = filteredStorefronts.filter(store =>
                    store.name.toLowerCase().includes(searchLower) ||
                    store.description.toLowerCase().includes(searchLower)
                );
            }

            if (status) {
                filteredStorefronts = filteredStorefronts.filter(store => store.status === status);
            }

            // Apply pagination
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const paginatedStorefronts = filteredStorefronts.slice(skip, skip + limitNum);

            return res.json({
                success: true,
                data: paginatedStorefronts,
                total: filteredStorefronts.length,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(filteredStorefronts.length / limitNum)
            });
        }

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
            // If no businessId provided, get all storefronts for all businesses owned by the user
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

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Use aggregation for better handling of large datasets with disk usage
        const aggregation = [
            { $match: query },
            { $sort: sort },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: parseInt(limit) },
                        {
                            $lookup: {
                                from: 'businesses',
                                localField: 'business',
                                foreignField: '_id',
                                as: 'business'
                            }
                        },
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'products',
                                foreignField: '_id',
                                as: 'products',
                                pipeline: [
                                    { $limit: 3 }, // Only get first 3 products for the list view
                                    {
                                        $project: {
                                            name: 1,
                                            price: 1,
                                            image: 1,
                                            isActive: 1
                                        }
                                    }
                                ]
                            }
                        },
                        { $unwind: '$business' },
                        {
                            $project: {
                                'business.businessName': 1,
                                'business._id': 1,
                                'business.currency': 1,
                                name: 1,
                                description: 1,
                                status: 1,
                                banner: 1,
                                logo: 1,
                                visits: 1,
                                sales: 1,
                                products: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ];

        // Add debug logging
        console.log('Storefront list query:', JSON.stringify(query));
        console.log('User ID:', req.user._id);

        const [result] = await Storefront.aggregate(aggregation).allowDiskUse(true);

        const storefronts = result.paginatedResults;
        const total = result.totalCount[0]?.count || 0;

        // Add debug logging
        console.log('Storefronts returned:', storefronts.map(sf => ({ id: sf._id, name: sf.name, status: sf.status, business: sf.business?._id || sf.business })));
        console.log('Total count:', total);

        // After fetching storefronts array:
        const storefrontsWithId = storefronts.map(sf => {
            const obj = { ...sf, id: sf._id };
            delete obj._id;
            return obj;
        });
        res.json({
            success: true,
            data: storefrontsWithId,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error('Error fetching storefronts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a storefront by ID (public access)
 * @route   GET /api/storefronts/public/:id
 * @access  Public
 */
exports.getPublicStorefrontById = async (req, res) => {
    try {
        console.log('Fetching public storefront with ID:', req.params.id);

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Storefront ID is required'
            });
        }

        // Verify MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection is not established');
        }

        let storefront;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            storefront = await Storefront.findOne({
                _id: id,
                status: 'active'  // Only active storefronts are publicly accessible
            })
                .populate('business', 'businessName currency')
                .populate({
                    path: 'products',
                    select: 'name description price image currency active',
                    match: { active: true }  // Only show active products
                })
                .lean();
        } else {
            storefront = await Storefront.findOne({
                customId: id,
                status: 'active'
            })
                .populate('business', 'businessName currency')
                .populate({
                    path: 'products',
                    select: 'name description price image currency active',
                    match: { active: true }  // Only show active products
                })
                .lean();
        }

        if (!storefront) {
            console.error('Public storefront not found for ID:', id);
            return res.status(404).json({
                success: false,
                message: 'Storefront not found or not active'
            });
        }

        console.log('[DEBUG] Public storefront found:', {
            id: storefront._id,
            name: storefront.name,
            status: storefront.status,
            productsCount: storefront.products ? storefront.products.length : 0,
            products: storefront.products
        });

        // If no active products found, try to get all products
        if (!storefront.products || storefront.products.length === 0) {
            console.log('[DEBUG] No active products found, trying to get all products');
            if (isValidObjectId) {
                storefront = await Storefront.findOne({
                    _id: id,
                    status: 'active'
                })
                    .populate('business', 'businessName currency')
                    .populate({
                        path: 'products',
                        select: 'name description price image currency active'
                    })
                    .lean();
            } else {
                storefront = await Storefront.findOne({
                    customId: id,
                    status: 'active'
                })
                    .populate('business', 'businessName currency')
                    .populate({
                        path: 'products',
                        select: 'name description price image currency active'
                    })
                    .lean();
            }
            
            console.log('[DEBUG] After fallback - products found:', {
                productsCount: storefront.products ? storefront.products.length : 0,
                products: storefront.products
            });
        }

        // Increment visit count
        await Storefront.findByIdAndUpdate(storefront._id, { $inc: { visits: 1 } });

        // Return the storefront data
        const obj = { ...storefront, id: storefront._id };
        delete obj._id;
        res.json({
            success: true,
            data: obj
        });
    } catch (error) {
        console.error('Error fetching public storefront by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * @desc    Get a storefront by ID
 * @route   GET /api/storefronts/:id
 * @access  Private
 */
exports.getStorefrontById = async (req, res) => {
    try {
        console.log('Fetching storefront with ID:', req.params.id);
        console.log('Request headers:', req.headers);

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Storefront ID is required'
            });
        }

        // Verify MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection is not established');
        }

        let storefront;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            storefront = await Storefront.findById(id)
                .populate('business', 'businessName currency')
                .populate({
                    path: 'products',
                    select: 'name description price image currency'
                })
                .lean();
        } else {
            storefront = await Storefront.findOne({ customId: id })
                .populate('business', 'businessName currency')
                .populate({
                    path: 'products',
                    select: 'name description price image currency'
                })
                .lean();
        }

        if (!storefront) {
            console.error('Storefront not found for ID:', id);
            return res.status(404).json({
                success: false,
                message: 'Storefront not found'
            });
        }

        // Always check if user owns the business
            if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
            }
        const businessId = storefront.business._id || storefront.business;
            const business = await Business.findOne({
            _id: businessId,
                user: req.user._id
            });
            if (!business) {
            return res.status(403).json({ message: 'You do not have permission to view this storefront' });
            }

        // If ownership check passes, return the storefront
        const obj = { ...storefront, id: storefront._id };
        delete obj._id;
        res.json({
            success: true,
            data: obj
        });
    } catch (error) {
        console.error('Error fetching storefront by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * @desc    Update a storefront
 * @route   PUT /api/storefronts/:id
 * @access  Private
 */
exports.updateStorefront = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        let storefront;

        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            storefront = await Storefront.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            storefront = await Storefront.findOne({ customId: id });
        }

        if (!storefront) {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: storefront.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to update this storefront' });
        }

        // Update fields
        const updateData = { ...req.body, updatedAt: Date.now() };

        // Don't allow changing the business
        delete updateData.business;

        // Handle products if they are provided
        if (req.body.products && Array.isArray(req.body.products)) {
            // Store product IDs in the storefront
            updateData.products = req.body.products;
        }

        // Update storefront
        let updatedStorefront;

        if (isValidObjectId) {
            // If it's a valid ObjectId, use findByIdAndUpdate
            updatedStorefront = await Storefront.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        } else {
            // If it's a custom ID, use findOneAndUpdate
            updatedStorefront = await Storefront.findOneAndUpdate(
                { customId: req.params.id },
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        res.json(updatedStorefront);
    } catch (error) {
        console.error('Error updating storefront:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete a storefront
 * @route   DELETE /api/storefronts/:id
 * @access  Private
 */
exports.deleteStorefront = async (req, res) => {
    try {
        const { id } = req.params;
        let storefront;
        
        // Check if ID is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            // Just find the storefront by ID first
            storefront = await Storefront.findById(id);
        } else {
            // Try to find by customId if not a valid ObjectId
            storefront = await Storefront.findOne({ customId: id });
        }
        
        if (!storefront) {
            return res.status(404).json({
                success: false,
                message: 'Storefront not found'
            });
        }
        
        // After finding the storefront, verify ownership
        const business = await Business.findOne({
            _id: storefront.business,
            user: req.user._id
        });
        
        if (!business) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this storefront'
            });
        }
        
        // Now delete the storefront
        await Storefront.deleteOne({ _id: storefront._id });
        
        return res.json({
            success: true,
            message: 'Storefront deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting storefront:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting storefront'
        });
    }
};

/**
 * @desc    Update storefront status
 * @route   PATCH /api/storefronts/:id/status
 * @access  Private
 */
exports.updateStorefrontStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['active', 'inactive', 'draft'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const id = req.params.id;
        let storefront;

        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            storefront = await Storefront.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            storefront = await Storefront.findOne({ customId: id });
        }

        if (!storefront) {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: storefront.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to update this storefront' });
        }

        storefront.status = status;
        storefront.updatedAt = Date.now();
        await storefront.save();

        res.json(storefront);
    } catch (error) {
        console.error('Error updating storefront status:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get storefront by slug (public access)
 * @route   GET /api/storefronts/slug/:slug
 * @access  Public
 */
exports.getStorefrontBySlug = async (req, res) => {
    try {
        // First try to find by slug
        let storefront = await Storefront.findOne({
            slug: req.params.slug,
            status: 'active'  // Only active storefronts are publicly accessible
        }).populate('business', 'businessName currency')
            .populate({
                path: 'products',
                select: 'name price image isActive',
            });

        // If not found by slug, try to find by customId
        if (!storefront) {
            storefront = await Storefront.findOne({
                customId: req.params.slug,
                status: 'active'
            }).populate('business', 'businessName currency')
                .populate({
                    path: 'products',
                    select: 'name price image isActive',
                });
        }

        if (!storefront) {
            return res.status(404).json({ message: 'Storefront not found or not active' });
        }

        // Increment visit count
        storefront.visits += 1;
        await storefront.save();

        res.json(storefront);
    } catch (error) {
        console.error('Error fetching storefront by slug:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Add products to storefront
 * @route   POST /api/storefronts/:id/products
 * @access  Private
 */
exports.addProducts = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        const id = req.params.id;
        let storefront;

        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            storefront = await Storefront.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            storefront = await Storefront.findOne({ customId: id });
        }

        if (!storefront) {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: storefront.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to update this storefront' });
        }

        // Extract and validate product IDs
        const productIds = products.map(product =>
            typeof product === 'string' ? product : (product._id || product.id)
        );

        // Convert to ObjectId for comparison
        const existingProductIds = storefront.products.map(p => p.toString());
        const newProductIds = productIds.filter(id => !existingProductIds.includes(id.toString()));

        if (newProductIds.length > 0) {
            // Verify the products exist and belong to the same business
            const Product = require('../models/Product');
            const validProducts = await Product.find({
                _id: { $in: newProductIds },
                business: storefront.business
            }).select('_id');

            if (validProducts.length !== newProductIds.length) {
                return res.status(400).json({
                    message: 'One or more products not found or do not belong to your business'
                });
            }

            // Add the product references to the storefront
            storefront.products = [...storefront.products, ...validProducts.map(p => p._id)];
            storefront.updatedAt = Date.now();
            await storefront.save();
        }

        res.json(storefront);
    } catch (error) {
        console.error('Error adding products to storefront:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Remove products from storefront
 * @route   DELETE /api/storefronts/:id/products
 * @access  Private
 */
exports.removeProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: 'Product IDs array is required' });
        }

        const id = req.params.id;
        let storefront;

        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            storefront = await Storefront.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            storefront = await Storefront.findOne({ customId: id });
        }

        if (!storefront) {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: storefront.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to update this storefront' });
        }

        // Remove products
        storefront.products = storefront.products.filter(product =>
            !productIds.includes(product._id.toString())
        );

        storefront.updatedAt = Date.now();
        await storefront.save();

        res.json(storefront);
    } catch (error) {
        console.error('Error removing products from storefront:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get storefront analytics
 * @route   GET /api/storefronts/:id/analytics
 * @access  Private
 */
exports.getStorefrontAnalytics = async (req, res) => {
    try {
        const id = req.params.id;
        let storefront;

        // Check if the ID is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isValidObjectId) {
            // If it's a valid ObjectId, use findById
            storefront = await Storefront.findById(id);
        } else {
            // If it's not a valid ObjectId, it might be a custom ID format
            storefront = await Storefront.findOne({ customId: id });
        }

        if (!storefront) {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        // Verify user owns the business
        const business = await Business.findOne({
            _id: storefront.business,
            user: req.user._id
        });

        if (!business) {
            return res.status(403).json({ message: 'Forbidden - You do not have permission to access this storefront' });
        }

        // For now, return basic analytics
        // In a real implementation, you would query more detailed analytics data
        const analytics = {
            visits: storefront.visits,
            sales: storefront.sales,
            conversionRate: storefront.visits > 0 ? (storefront.sales / storefront.visits) * 100 : 0,
            // Add more analytics data as needed
        };

        res.json(analytics);
    } catch (error) {
        console.error('Error fetching storefront analytics:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Storefront not found' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Clean up storefronts with undefined IDs
 * @route   DELETE /api/storefronts/cleanup
 * @access  Private
 */
exports.cleanupInvalidStorefronts = async (req, res) => {
    try {
        // Find storefronts where _id is not a valid ObjectId
        const invalidStorefronts = await Storefront.find({ 
          $or: [
            { _id: { $exists: false } },
            { _id: null },
            { _id: 'undefined' },
            { _id: { $type: 'string' } } // Any string IDs that aren't valid ObjectIds
          ]
        });

        if (invalidStorefronts.length === 0) {
          return res.json({
            success: true,
            message: 'No invalid storefronts found',
            count: 0
          });
        }

        // Delete all invalid storefronts
        const result = await Storefront.deleteMany({
          _id: { $in: invalidStorefronts.map(s => s._id) }
        });

        return res.json({
          success: true,
          message: `Cleaned up ${result.deletedCount} invalid storefronts`,
          count: result.deletedCount
        });
    } catch (error) {
        console.error('Error cleaning up invalid storefronts:', error);
        return res.status(500).json({
          success: false,
          message: 'Error cleaning up invalid storefronts'
        });
    }
};
