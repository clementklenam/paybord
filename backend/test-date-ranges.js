require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');

async function testDateRanges() {
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

    allTransactions.forEach(t => {
      console.log(`- ${t.customerName}: ${t.amount} ${t.currency} (${t.createdAt})`);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('\n=== Testing Date Ranges ===');
    console.log('Today (start of day):', today.toISOString());

    // Test different time ranges
    const timeRanges = ['today', 'last7days', 'last30days', 'thisMonth'];

    timeRanges.forEach(timeRange => {
      console.log(`\n--- ${timeRange} ---`);
      
      let startDate, endDate;

      switch (timeRange) {
        case 'today':
          startDate = new Date(today);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'last7days':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 6);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'last30days':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 29);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'thisMonth':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      console.log('Start date:', startDate.toISOString());
      console.log('End date:', endDate.toISOString());

      const transactions = allTransactions.filter(t => 
        t.createdAt >= startDate && t.createdAt <= endDate
      );

      console.log('Transactions found:', transactions.length);
      transactions.forEach(t => {
        console.log(`  - ${t.customerName}: ${t.amount} ${t.currency} (${t.createdAt})`);
      });

      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      console.log('Total amount:', totalAmount);
    });

    await mongoose.connection.close();
    console.log('\nTest completed');
  } catch (error) {
    console.error('Test error:', error);
    await mongoose.connection.close();
  }
}

testDateRanges(); 