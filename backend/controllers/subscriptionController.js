const Subscription = require('../models/Subscription');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { customer, product, price, currency, interval, startDate, endDate, metadata } = req.body;
    if (!customer || !product || !price || !currency || !interval) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Optionally: validate customer and product exist
    const customerExists = await Customer.findById(customer);
    const productExists = await Product.findById(product);
    if (!customerExists || !productExists) {
      return res.status(404).json({ error: 'Customer or Product not found' });
    }
    const subscription = new Subscription({
      customer,
      product,
      price,
      currency,
      interval,
      startDate: startDate || Date.now(),
      endDate,
      nextBillingDate: startDate || Date.now(),
      metadata
    });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all subscriptions (optionally filter by customer)
exports.listSubscriptions = async (req, res) => {
  try {
    const { customer } = req.query;
    const filter = customer ? { customer } : {};
    const subscriptions = await Subscription.find(filter).populate('customer').populate('product');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single subscription by ID
exports.getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id).populate('customer').populate('product');
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 