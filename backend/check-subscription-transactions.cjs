const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Subscription = require('./models/Subscription');
const Product = require('./models/Product');
const Business = require('./models/Business');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/paymesa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkSubscriptionTransactions() {
  try {
    console.log('Checking subscription transactions...');
    
    // Find all subscription transactions
    const subscriptionTransactions = await Transaction.find({ paymentType: 'subscription' });
    console.log(`Found ${subscriptionTransactions.length} subscription transactions`);
    
    // Check each transaction
    for (const transaction of subscriptionTransactions) {
      console.log(`\nTransaction ID: ${transaction._id}`);
      console.log(`Business ID: ${transaction.businessId}`);
      console.log(`Customer Email: ${transaction.customerEmail}`);
      console.log(`Amount: ${transaction.amount}`);
      console.log(`Created: ${transaction.createdAt}`);
      
      // Check if businessId is valid
      if (transaction.businessId) {
        const business = await Business.findById(transaction.businessId);
        if (business) {
          console.log(`✅ Business found: ${business.businessName} (User: ${business.user})`);
        } else {
          console.log(`❌ Business not found for ID: ${transaction.businessId}`);
        }
      } else {
        console.log(`❌ No businessId set`);
      }
      
      // Check if we can find the subscription
      if (transaction.metadata && transaction.metadata.subscriptionId) {
        const subscription = await Subscription.findById(transaction.metadata.subscriptionId);
        if (subscription) {
          console.log(`✅ Subscription found: ${subscription._id}`);
          
          // Check if we can get the correct businessId from the product
          const product = await Product.findById(subscription.product).populate('business');
          if (product && product.business) {
            console.log(`✅ Product business: ${product.business._id} (${product.business.businessName})`);
            
            // Check if businessId matches
            if (transaction.businessId !== product.business._id.toString()) {
              console.log(`⚠️  BusinessId mismatch! Transaction: ${transaction.businessId}, Product: ${product.business._id}`);
              
              // Fix the businessId
              transaction.businessId = product.business._id.toString();
              await transaction.save();
              console.log(`✅ Fixed businessId to: ${product.business._id}`);
            }
          } else {
            console.log(`❌ Product or business not found for subscription`);
          }
        } else {
          console.log(`❌ Subscription not found: ${transaction.metadata.subscriptionId}`);
        }
      } else {
        console.log(`❌ No subscriptionId in metadata`);
      }
    }
    
    console.log('\n✅ Subscription transaction check completed');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkSubscriptionTransactions(); 