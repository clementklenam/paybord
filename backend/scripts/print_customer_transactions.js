const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin2:Admin1234@cluster0.nj0wmq4.mongodb.net/test";
const client = new MongoClient(uri);

async function run() {
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node print_customer_transactions.js <customer_email>');
      process.exit(1);
    }
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('transactions');
    const transactions = await collection.find({ customerEmail: email }).sort({ createdAt: -1 }).limit(10).toArray();
    if (transactions.length === 0) {
      console.log('No transactions found for customer:', email);
      return;
    }
    console.log(`Latest transactions for ${email}:`);
    transactions.forEach(txn => {
      console.log({
        _id: txn._id,
        amount: txn.amount,
        currency: txn.currency,
        businessId: txn.businessId,
        status: txn.status,
        createdAt: txn.createdAt
      });
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run(); 