const mongoose = require('mongoose');

const businessAnalyticsSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Daily metrics
  dailyGrossVolume: {
    type: Number,
    default: 0
  },
  dailyNetVolume: {
    type: Number,
    default: 0
  },
  dailyPaymentCount: {
    type: Number,
    default: 0
  },
  dailyFailedPaymentCount: {
    type: Number,
    default: 0
  },
  dailyNewCustomerCount: {
    type: Number,
    default: 0
  },
  // Balance information
  availableBalance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  // Next payout information
  nextPayoutAmount: {
    type: Number,
    default: 0
  },
  nextPayoutDate: {
    type: Date
  },
  // Timestamps for data freshness
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for business and date to ensure uniqueness and fast queries
businessAnalyticsSchema.index({ business: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('BusinessAnalytics', businessAnalyticsSchema);
