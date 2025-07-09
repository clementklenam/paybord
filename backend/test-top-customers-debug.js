const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');
require('dotenv').config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  maxPoolSize: 10,
});

async function testTopCustomers() {
  try {
    console.log('Testing top customers aggregation...');
    
    // First, let's see what transactions exist
    const allTransactions = await Transaction.find({});
    console.log('Total transactions in database:', allTransactions.length);
    
    if (allTransactions.length > 0) {
      console.log('Sample transaction:', {
        id: allTransactions[0]._id,
        businessId: allTransactions[0].businessId,
        customerEmail: allTransactions[0].customerEmail,
        customerName: allTransactions[0].customerName,
        amount: allTransactions[0].amount,
        status: allTransactions[0].status,
        createdAt: allTransactions[0].createdAt
      });
    }
    
    // Find all businesses
    const businesses = await Business.find({});
    console.log('Total businesses in database:', businesses.length);
    
    if (businesses.length > 0) {
      console.log('Sample business:', {
        id: businesses[0]._id,
        businessName: businesses[0].businessName,
        user: businesses[0].user
      });
    }
    
    // Test the aggregation pipeline
    const businessIds = businesses.map(b => b._id);
    console.log('Business IDs for aggregation:', businessIds);
    
    const customerSpendAggregation = await Transaction.aggregate([
      {
        $match: {
          businessId: { $in: businessIds.map(id => id.toString()), $exists: true, $ne: null },
          status: 'success'
        }
      },
      {
        $group: {
          _id: '$customerEmail',
          totalSpend: { $sum: '$amount' },
          customerName: { $first: '$customerName' },
          transactionCount: { $sum: 1 },
          lastPaymentDate: { $max: '$createdAt' },
          firstPaymentDate: { $min: '$createdAt' }
        }
      },
      {
        $sort: { totalSpend: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ['$customerName', 'Unknown Customer'] },
          email: '$_id',
          spend: '$totalSpend',
          transactionCount: 1,
          lastPaymentDate: 1,
          firstPaymentDate: 1,
          averageOrderValue: { $divide: ['$totalSpend', '$transactionCount'] }
        }
      }
    ]);
    
    console.log('Top customers aggregation result:', {
      count: customerSpendAggregation.length,
      customers: customerSpendAggregation
    });
    
    // Test with a specific business ID
    if (businesses.length > 0) {
      const specificBusinessId = businesses[0]._id;
      console.log('\nTesting with specific business ID:', specificBusinessId);
      
      const specificBusinessTransactions = await Transaction.find({
        businessId: specificBusinessId,
        status: 'success'
      });
      
      console.log('Transactions for specific business:', specificBusinessTransactions.length);
      
      if (specificBusinessTransactions.length > 0) {
        console.log('Sample transaction for specific business:', {
          id: specificBusinessTransactions[0]._id,
          businessId: specificBusinessTransactions[0].businessId,
          customerEmail: specificBusinessTransactions[0].customerEmail,
          customerName: specificBusinessTransactions[0].customerName,
          amount: specificBusinessTransactions[0].amount,
          status: specificBusinessTransactions[0].status
        });
      }
    }
    
  } catch (error) {
    console.error('Error testing top customers:', error);
  } finally {
    mongoose.connection.close();
  }
}

testTopCustomers(); 