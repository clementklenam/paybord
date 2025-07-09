require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');

async function testPaymentFlow() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a GHS business
    const business = await Business.findOne({ currency: 'GHS' });
    if (!business) {
      console.log('No GHS business found');
      return;
    }
    console.log('Using business:', business.businessName, 'ID:', business._id.toString());

    // Create a test transaction
    const testTransaction = new Transaction({
      transactionId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: 200.59, // Test amount
      currency: 'GHS',
      status: 'success',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+233123456789',
      businessId: business._id.toString(),
      paymentMethod: 'card',
      paymentType: 'payment_link',
      provider: 'paystack',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    });

    await testTransaction.save();
    console.log('Test transaction created:', testTransaction._id.toString());

    // Count total transactions for this business
    const totalTransactions = await Transaction.countDocuments({ 
      businessId: business._id.toString(),
      status: 'success'
    });
    console.log('Total successful transactions for business:', totalTransactions);

    // Calculate total amount
    const totalAmount = await Transaction.aggregate([
      {
        $match: {
          businessId: business._id.toString(),
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    console.log('Total amount for business:', totalAmount[0]?.total || 0);

    await mongoose.connection.close();
    console.log('Test completed');
  } catch (error) {
    console.error('Test error:', error);
    await mongoose.connection.close();
  }
}

testPaymentFlow(); 