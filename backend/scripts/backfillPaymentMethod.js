// Usage: node backend/scripts/backfillPaymentMethod.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin2:Admin1234@cluster0.nj0wmq4.mongodb.net/test";
const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Connecting to database to backfill paymentMethod...");
    await client.connect();
    const db = client.db('test'); // Ensure 'test' is your database name
    const collection = db.collection('transactions');

    // Find all transactions where paymentMethod is missing or null
    const filter = { $or: [ { paymentMethod: { $exists: false } }, { paymentMethod: null } ] };
    const transactions = await collection.find(filter).toArray();
    console.log(`Found ${transactions.length} transactions to update.`);

    let updatedCount = 0;
    for (const txn of transactions) {
      let method = 'card'; // default
      if (txn.provider === 'stripe') {
        method = 'card';
      } else if (txn.provider === 'paystack') {
        if (txn.paymentType) {
          const type = txn.paymentType.toLowerCase();
          if (type.includes('mobile')) method = 'mobile_money';
          else if (type.includes('bank')) method = 'bank_transfer';
          else if (type.includes('card')) method = 'card';
          else method = 'card';
        } else {
          method = 'card';
        }
      }
      await collection.updateOne(
        { _id: txn._id },
        { $set: { paymentMethod: method } }
      );
      updatedCount++;
    }
    console.log(`Updated ${updatedCount} transactions.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.close();
  }
}

run(); 