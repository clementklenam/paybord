const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN',
    required: true
  },
  interval: {
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    default: 'month',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused', 'completed'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  // Paystack-specific fields
  paystackSubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paystackCustomerId: {
    type: String
  },
  paystackPlanId: {
    type: String
  },
  paymentMethodId: {
    type: String
  },
  trialEnd: {
    type: Date
  },
  currentPeriodStart: {
    type: Date
  },
  currentPeriodEnd: {
    type: Date
  },
  // Invoice fields
  invoiceId: {
    type: String,
    unique: true
  },
  invoiceStatus: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  invoiceSentAt: {
    type: Date
  },
  invoiceDueDate: {
    type: Date
  },
  paymentLink: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema); 