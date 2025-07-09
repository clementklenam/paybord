const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin2:Admin1234@cluster0.nj0wmq4.mongodb.net/test";
const client = new MongoClient(uri);

// List of currencies that use 2 decimal places
const currenciesWithCents = [
  'GHS', 'NGN', 'KES', 'ZAR', 'USD', 'EUR', 'GBP', 'XOF', 'XAF', 'MAD', 'EGP'
];

async function run() {
  try {
    console.log("Connecting to database to fix transaction amounts...");
    await client.connect();
    const db = client.db('test'); // Use 'test' as your database name
    const collection = db.collection('transactions');

    // Find all transactions in relevant currencies
    const query = { currency: { $in: currenciesWithCents } };
    const transactions = await collection.find(query).toArray();
    let fixedCount = 0;
    let skippedCount = 0;

    for (const txn of transactions) {
      if (txn.amount > 1000) {
        const oldAmount = txn.amount;
        const newAmount = txn.amount / 100;
        await collection.updateOne(
          { _id: txn._id },
          { $set: { amount: newAmount } }
        );
        console.log(`[FIXED] Transaction ${txn._id}: ${oldAmount} -> ${newAmount} (${txn.currency})`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`\nSummary: Fixed ${fixedCount} transactions, skipped ${skippedCount}.`);
  } catch (err) {
    console.error('Error fixing transactions:', err);
  } finally {
    await client.close();
  }
}

run(); 