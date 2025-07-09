require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');

async function testAnalytics() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the GHS business
    const business = await Business.findOne({ currency: 'GHS' });
    if (!business) {
      console.log('No GHS business found');
      return;
    }
    console.log('Using business:', business.businessName, 'ID:', business._id.toString());

    // Get all transactions for this business
    const allTransactions = await Transaction.find({ 
      businessId: business._id.toString(),
      status: 'success'
    });
    console.log('Total successful transactions for business:', allTransactions.length);

    // Calculate total amount
    const totalAmount = allTransactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('Total amount for business:', totalAmount);

    // Test the analytics query logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Last 30 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());

    const successfulTransactions = await Transaction.find({ 
      businessId: business._id.toString(), 
      status: 'success', 
      createdAt: { $gte: startDate, $lte: endDate } 
    });

    console.log('Transactions in date range:', successfulTransactions.length);
    successfulTransactions.forEach(t => {
      console.log(`- ${t.customerName}: ${t.amount} ${t.currency} (${t.createdAt})`);
    });

    const grossVolume = successfulTransactions.reduce((total, t) => total + t.amount, 0);
    console.log('Gross volume in date range:', grossVolume);

    await mongoose.connection.close();
    console.log('Test completed');
  } catch (error) {
    console.error('Test error:', error);
    await mongoose.connection.close();
  }
}

testAnalytics(); 