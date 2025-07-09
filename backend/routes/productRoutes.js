const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productController = require('../controllers/productController');
const { protect: auth } = require('../middleware/auth');

// @route   GET /api/products/categories
// @desc    Get product categories
// @access  Private
router.get('/categories', auth, productController.getProductCategories);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post(
    '/',
    auth,
    [
        check('business', 'Business ID is required').not().isEmpty(),
        check('name', 'Name is required').not().isEmpty(),
        check('price', 'Price is required and must be a number').isNumeric()
    ],
    productController.createProduct
);

// @route   GET /api/products
// @desc    Get all products for a business
// @access  Private
router.get('/', auth, productController.getProducts);

// @route   GET /api/products/:id
// @desc    Get a product by ID
// @access  Private
router.get('/:id', auth, productController.getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put(
    '/:id',
    auth,
    [
        check('name', 'Name is required').optional().not().isEmpty(),
        check('price', 'Price must be a number').optional().isNumeric()
    ],
    productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, productController.deleteProduct);

// @route   PATCH /api/products/:id/status
// @desc    Update product status
// @access  Private
router.patch(
    '/:id/status',
    auth,
    [
        check('active', 'Active status is required').isBoolean()
    ],
    productController.updateProductStatus
);

module.exports = router;
