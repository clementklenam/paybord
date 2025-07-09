const express = require('express');
const { processWebhook } = require('../controllers/webhookController');

const router = express.Router();

// Webhook routes need raw body for signature verification
// This middleware needs to be applied in server.js before routes are defined
// app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// @route   POST /api/webhooks
// @desc    Process webhooks from payment providers
// @access  Public (but verified by signature)
router.post('/', processWebhook);

module.exports = router;
