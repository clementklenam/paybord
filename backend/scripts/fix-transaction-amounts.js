const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// List of currencies that use 2 decimal places
const currenciesWithCents = [
  'GHS', 'NGN', 'KES', 'ZAR', 'USD', 'EUR', 'GBP', 'XOF', 'XAF', 'MAD', 'EGP'
];

async function fixTransactionAmounts() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/paymesa';
  console.log('Connecting to MongoDB at:', mongoUri);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const query = { currency: { $in: currenciesWithCents } };
  const transactions = await Transaction.find(query);
  let fixedCount = 0;
  let skippedCount = 0;

  for (const txn of transactions) {
    // If amount is suspiciously large, fix it
    if (txn.amount > 1000) {
      const oldAmount = txn.amount;
      txn.amount = txn.amount / 100;
      await txn.save();
      console.log(`[FIXED] Transaction ${txn._id}: ${oldAmount} -> ${txn.amount} (${txn.currency})`);
      fixedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\nSummary: Fixed ${fixedCount} transactions, skipped ${skippedCount}.`);
  process.exit(0);
}

fixTransactionAmounts().catch(err => {
  console.error('Error fixing transactions:', err);
  process.exit(1);
}); 