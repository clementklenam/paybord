const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percent', 'amount'], required: true },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true },
  validFrom: { type: Date },
  validTo: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema); 