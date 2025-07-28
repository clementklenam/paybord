const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const Storefront = require('../models/Storefront');
const storefrontController = require('../controllers/storefrontController');
const { protect: auth } = require('../middleware/auth');
const mongoose = require('mongoose'); // Assuming mongoose is installed and configured

// @route   POST /api/storefronts
// @desc    Create a new storefront
// @access  Private
router.post(
  '/',
  auth,
  [
    // Accept either 'business' or 'businessId' as required
    (req, res, next) => {
      if (!req.body.business && !req.body.businessId) {
        return res.status(400).json({ errors: [{ msg: 'Business ID is required' }] });
      }
      next();
    },
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  storefrontController.createStorefront
);

// @route   GET /api/storefronts
// @desc    Get all storefronts for a business
// @access  Private
router.get('/', auth, storefrontController.getStorefronts);

// @route   GET /api/storefronts/slug/:slug
// @desc    Get a storefront by slug (public access)
// @access  Public
router.get('/slug/:slug', storefrontController.getStorefrontBySlug);

// @route   GET /api/storefronts/public/:id
// @desc    Get a storefront by ID (public access)
// @access  Public
router.get('/public/:id', storefrontController.getPublicStorefrontById);

// @route   GET /api/storefronts/:id
// @desc    Get a storefront by ID
// @access  Private/Public (depending on storefront status)
router.get('/:id', auth, storefrontController.getStorefrontById);

// @route   PUT /api/storefronts/:id
// @desc    Update a storefront
// @access  Private
router.put(
  '/:id',
  auth,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty()
  ],
  storefrontController.updateStorefront
);

// @route   DELETE /api/storefronts/:id
// @desc    Delete a storefront
// @access  Private
router.delete('/:id', auth, storefrontController.deleteStorefront);

// @route   PATCH /api/storefronts/:id/status
// @desc    Update storefront status
// @access  Private
router.patch(
  '/:id/status',
  auth,
  [
    check('status', 'Status is required').isIn(['active', 'inactive', 'draft'])
  ],
  storefrontController.updateStorefrontStatus
);

// @route   POST /api/storefronts/:id/products
// @desc    Add products to storefront
// @access  Private
router.post(
  '/:id/products',
  auth,
  [
    check('products', 'Products array is required').isArray()
  ],
  storefrontController.addProducts
);

// @route   DELETE /api/storefronts/:id/products
// @desc    Remove products from storefront
// @access  Private
router.delete(
  '/:id/products',
  auth,
  [
    check('productIds', 'Product IDs array is required').isArray()
  ],
  storefrontController.removeProducts
);

// @route   GET /api/storefronts/:id/analytics
// @desc    Get storefront analytics
// @access  Private
router.get('/:id/analytics', auth, storefrontController.getStorefrontAnalytics);

// @route   DELETE /api/storefronts/cleanup
// @desc    Cleanup invalid storefronts
// @access  Private
router.delete(
  '/cleanup',
  auth,
  storefrontController.cleanupInvalidStorefronts
);

module.exports = router;
