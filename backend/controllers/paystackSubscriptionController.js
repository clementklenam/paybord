const Subscription = require('../models/Subscription');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Business = require('../models/Business');
const axios = require('axios');
const crypto = require('crypto');
const { sendSubscriptionInvoice, sendPaymentConfirmation } = require('../services/emailService');
const { getFrontendConfig } = require('../config/frontend');

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Helper function to generate invoice ID
const generateInvoiceId = () => {
  return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Helper function to convert amount from smallest unit (kobo) to main unit
const convertFromSmallestUnit = (amount, currency) => {
  if (currency === 'NGN' || currency === 'GHS' || currency === 'USD') {
    return amount / 100;
  }
  return amount;
};

// Create a new subscription with invoice
exports.createSubscription = async (req, res) => {
  try {
    const { customer, product, price, currency, interval, startDate, endDate, metadata } = req.body;
    
    if (!customer || !product || !price || !currency || !interval) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate customer and product exist
    const customerExists = await Customer.findById(customer);
    const productExists = await Product.findById(product);
    
    if (!customerExists || !productExists) {
      return res.status(404).json({ error: 'Customer or Product not found' });
    }

    // Generate invoice ID
    const invoiceId = generateInvoiceId();

    // Get product to ensure we use its currency
    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create subscription in database using product's currency
    const subscription = new Subscription({
      customer,
      product,
      price,
      currency: productData.currency || currency, // Use product currency as priority
      interval,
      startDate: startDate || Date.now(),
      endDate,
      nextBillingDate: startDate || Date.now(),
      invoiceId,
      invoiceStatus: 'draft',
      metadata
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      subscription,
      message: 'Subscription created successfully. Invoice can now be sent to customer.'
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Generate and send invoice to customer
exports.sendInvoice = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer')
      .populate('product');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (subscription.invoiceStatus === 'sent') {
      return res.status(400).json({ error: 'Invoice already sent' });
    }

    // Get frontend configuration
    const frontendConfig = getFrontendConfig();
    
    // Create Paystack payment link
    const paymentData = {
      amount: subscription.price * 100, // Convert to kobo
      email: subscription.customer.email,
      currency: subscription.currency,
      callback_url: `${frontendConfig.baseUrl}/payment/success?subscription=${subscriptionId}`,
      metadata: {
        subscriptionId: subscriptionId,
        invoiceId: subscription.invoiceId,
        customerName: subscription.customer.name,
        productName: subscription.product.name
      }
    };

    const paystackResponse = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (paystackResponse.data.status) {
      // Create custom payment URL that redirects to our payment page
      const customPaymentUrl = `${frontendConfig.baseUrl}/payment/${subscriptionId}`;
      
      // Update subscription with custom payment link
      subscription.paymentLink = customPaymentUrl;
      subscription.paystackPaymentUrl = paystackResponse.data.data.authorization_url; // Store original Paystack URL
      subscription.invoiceStatus = 'sent';
      subscription.invoiceSentAt = new Date();
      subscription.invoiceDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      await subscription.save();

      // Send email to customer with custom payment link
      try {
        await sendSubscriptionInvoice(subscription, customPaymentUrl);
        console.log('Invoice email sent successfully to:', subscription.customer.email);
      } catch (emailError) {
        console.error('Failed to send invoice email:', emailError);
        // Don't fail the request if email fails
      }
      
      res.json({
        success: true,
        paymentLink: customPaymentUrl,
        paystackUrl: paystackResponse.data.data.authorization_url,
        subscription,
        message: 'Invoice sent successfully to customer'
      });
    } else {
      throw new Error('Failed to create payment link');
    }

  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle Paystack webhook for payment confirmation
exports.handlePaymentWebhook = async (req, res) => {
  try {
    console.log('=== PAYSTACK SUBSCRIPTION WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    console.log('Expected signature:', hash);
    console.log('Received signature:', req.headers['x-paystack-signature']);

    if (hash !== req.headers['x-paystack-signature']) {
      console.log('Signature mismatch!');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Event type:', event.event);

    if (event.event === 'charge.success') {
      const transaction = event.data;
      const subscriptionId = transaction.metadata?.subscriptionId;
      
      console.log('Transaction data:', JSON.stringify(transaction, null, 2));
      console.log('Subscription ID from metadata:', subscriptionId);

      if (subscriptionId) {
        const subscription = await Subscription.findById(subscriptionId)
          .populate('customer')
          .populate('product');
        
        console.log('Found subscription:', subscription ? subscription._id : 'Not found');
        
        if (subscription) {
          console.log('Updating subscription status to active...');
          
          // Update subscription status
          subscription.status = 'active';
          subscription.invoiceStatus = 'paid';
          subscription.paystackSubscriptionId = transaction.id;
          subscription.currentPeriodStart = new Date();
          subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
          subscription.nextBillingDate = subscription.currentPeriodEnd;
          
          await subscription.save();
          console.log('Subscription updated successfully!');

          // Create transaction record for analytics
          try {
            // Get business ID from the subscription's product
            const product = await Product.findById(subscription.product._id).populate('business');
            const businessId = product && product.business ? product.business._id.toString() : null;
            
            if (businessId) {
              console.log('Found business ID for subscription transaction:', businessId);
              
              // Extract payment method from transaction
              let paymentMethod = 'other';
              if (transaction.channel === 'mobile_money') paymentMethod = 'mobile_money';
              else if (transaction.channel === 'card') paymentMethod = 'card';
              else if (transaction.channel === 'bank') paymentMethod = 'bank_transfer';

              const transactionId = `sub_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const transactionData = {
                transactionId,
                amount: convertFromSmallestUnit(transaction.amount, transaction.currency || subscription.currency),
                currency: transaction.currency || subscription.currency,
                status: 'success',
                customerName: subscription.customer.name || 'Anonymous',
                customerEmail: subscription.customer.email,
                customerPhone: subscription.customer.phone,
                paymentMethod,
                paymentType: 'subscription',
                provider: 'paystack',
                businessId,
                paystackReference: transaction.reference,
                paystackData: transaction,
                metadata: {
                  subscriptionId: subscription._id.toString(),
                  productId: subscription.product._id.toString(),
                  productName: subscription.product.name,
                  interval: subscription.interval,
                  invoiceId: subscription.invoiceId,
                  ...transaction.metadata
                }
              };

              console.log('Creating subscription transaction:', transactionData);
              const newTransaction = new Transaction(transactionData);
              await newTransaction.save();
              console.log('Subscription transaction saved successfully:', transactionId);
            } else {
              console.log('Could not find business for subscription product');
            }
          } catch (transactionError) {
            console.error('Error creating subscription transaction:', transactionError);
            // Don't fail the webhook if transaction creation fails
          }

          // Send confirmation email to customer
          try {
            await sendPaymentConfirmation(subscription);
            console.log('Payment confirmation email sent to:', subscription.customer.email);
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        } else {
          console.log('Subscription not found with ID:', subscriptionId);
        }
      } else {
        console.log('No subscription ID found in transaction metadata');
      }
    } else {
      console.log('Unhandled event type:', event.event);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get subscription payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer')
      .populate('product');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({
      success: true,
      subscription,
      paymentLink: subscription.paymentLink,
      isPaid: subscription.status === 'active'
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// List all subscriptions
exports.listSubscriptions = async (req, res) => {
  try {
    const { customer, status } = req.query;
    const filter = {};
    
    if (customer) filter.customer = customer;
    if (status) filter.status = status;

    const subscriptions = await Subscription.find(filter)
      .populate('customer')
      .populate('product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscriptions,
      count: subscriptions.length
    });

  } catch (error) {
    console.error('List subscriptions error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single subscription
exports.getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscription = await Subscription.findById(id)
      .populate('customer')
      .populate('product');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Manual update subscription status (for testing)
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.status = status;
    if (status === 'active') {
      subscription.invoiceStatus = 'paid';
      subscription.currentPeriodStart = new Date();
      subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      subscription.nextBillingDate = subscription.currentPeriodEnd;
    }
    
    await subscription.save();

    res.json({
      success: true,
      subscription,
      message: `Subscription status updated to ${status}`
    });

  } catch (error) {
    console.error('Update subscription status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.status = 'canceled';
    subscription.endDate = new Date();
    await subscription.save();

    res.json({
      success: true,
      subscription,
      message: 'Subscription canceled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message });
  }
}; 