// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
console.log('Loaded PAYSTACK_SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY);
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const businessRoutes = require('./routes/businessRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const storefrontRoutes = require('./routes/storefrontRoutes');
const productRoutes = require('./routes/productRoutes');
const testRoutes = require('./routes/testRoutes');
const paymentLinkRoutes = require('./routes/paymentLinkRoutes');
const paystackRoutes = require('./routes/paystackRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paystackSubscriptionRoutes = require('./routes/paystackSubscriptionRoutes');
const couponRoutes = require('./routes/couponRoutes');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

// Special handling for webhooks - needs raw body for signature verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Regular body parsing for other routes with increased size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const isDevelopment = process.env.NODE_ENV === 'development';
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 5000 : 1000, // More lenient in development
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: true, // Don't count successful requests
    skipFailedRequests: false // Count failed requests
});

// Apply rate limiting to API routes (except webhooks which may need higher limits)
app.use('/api/auth', apiLimiter);
app.use('/api/customers', apiLimiter);
app.use('/api/payments', apiLimiter);
app.use('/api/business', apiLimiter);
app.use('/api/analytics', apiLimiter);
app.use('/api/storefronts', apiLimiter);
app.use('/api/products', apiLimiter);
app.use('/api/payment-links', apiLimiter);
app.use('/api/paystack', apiLimiter);
app.use('/api/test', apiLimiter);
app.use('/api/subscriptions', apiLimiter);
app.use('/api/coupons', apiLimiter);

// Timeout middleware: 30 seconds
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    console.error('Request timed out:', req.method, req.originalUrl);
    res.status(503).json({ error: 'Request timed out' });
  });
  next();
});

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Paymesa Payment Service API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// API Documentation route (placeholder)
app.get('/api/docs', (req, res) => {
    res.json({
        message: 'API Documentation',
        endpoints: {
            auth: '/api/auth',
            customers: '/api/customers',
            payments: '/api/payments',
            webhooks: '/api/webhooks',
            business: '/api/business',
            analytics: '/api/analytics',
            storefronts: '/api/storefronts',
            products: '/api/products',
            paymentLinks: '/api/payment-links',
            test: '/api/test'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/storefronts', storefrontRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment-links', paymentLinkRoutes);
app.use('/api/paystack', paystackRoutes);
app.use('/api/test', testRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/paystack-subscriptions', paystackSubscriptionRoutes);
app.use('/api/coupons', couponRoutes);

// Error handling middleware
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Paybord Payment Service API running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
server.setTimeout(30000); // 30 seconds

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // process.exit(1);
});
