/**
 * Test Data Generator Script for Paymesa Dashboard
 * 
 * This script generates test data for the dashboard including:
 * - Payment intents with various statuses
 * - Customers
 * - Business data with GHS currency
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import models
const PaymentIntent = require('../models/paymentIntent');
const Customer = require('../models/customer');
const Business = require('../models/business');
const User = require('../models/user');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for test data generation'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to generate random amount between min and max
const randomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Function to generate random date within the past days
const randomDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date;
};

// Main function to generate test data
const generateTestData = async (userId) => {
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    
    console.log(`Generating test data for user: ${user.email}`);
    
    // Create or update business with GHS currency
    let business = await Business.findOne({ user: userId });
    if (!business) {
      business = new Business({
        user: userId,
        name: 'Test Business',
        type: 'individual',
        country: 'Ghana',
        currency: 'GHS',
        email: user.email,
        phone: '+233123456789',
        address: {
          line1: '123 Test Street',
          city: 'Accra',
          state: 'Greater Accra',
          postalCode: '00233',
          country: 'Ghana'
        }
      });
      await business.save();
      console.log('Created new business with GHS currency');
    } else {
      business.currency = 'GHS';
      await business.save();
      console.log('Updated existing business to use GHS currency');
    }
    
    // Generate customers (10)
    const existingCustomers = await Customer.countDocuments({ userId });
    if (existingCustomers < 10) {
      const customersToCreate = 10 - existingCustomers;
      console.log(`Creating ${customersToCreate} test customers`);
      
      for (let i = 0; i < customersToCreate; i++) {
        const customer = new Customer({
          userId,
          name: `Test Customer ${i + 1}`,
          email: `customer${i + 1}@test.com`,
          phone: `+23312345${i.toString().padStart(4, '0')}`,
          address: {
            line1: `${i + 1} Customer Street`,
            city: 'Accra',
            state: 'Greater Accra',
            postalCode: '00233',
            country: 'Ghana'
          },
          metadata: { source: 'test-data-generator' }
        });
        await customer.save();
      }
    }
    
    // Get all customers for this user
    const customers = await Customer.find({ userId });
    console.log(`Found ${customers.length} customers`);
    
    // Generate payment intents (50)
    const existingPayments = await PaymentIntent.countDocuments({ userId });
    if (existingPayments < 50) {
      const paymentsToCreate = 50 - existingPayments;
      console.log(`Creating ${paymentsToCreate} test payment intents`);
      
      // Statuses with weighted distribution
      const statuses = [
        'succeeded', 'succeeded', 'succeeded', 'succeeded', 'succeeded', 'succeeded', 'succeeded', 
        'processing', 'processing', 
        'failed', 'failed', 'failed'
      ];
      
      for (let i = 0; i < paymentsToCreate; i++) {
        // Select a random customer
        const customer = customers[Math.floor(Math.random() * customers.length)];
        
        // Determine status with weighted distribution
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Create payment intent
        const paymentIntent = new PaymentIntent({
          userId,
          customerId: customer._id,
          amount: randomAmount(1000, 50000), // Between 10 GHS and 500 GHS (in pesewas)
          currency: 'GHS',
          paymentMethod: 'card',
          description: `Test payment ${i + 1}`,
          status,
          metadata: { source: 'test-data-generator' },
          createdAt: randomDate(30) // Within the last 30 days
        });
        
        await paymentIntent.save();
      }
    }
    
    console.log('Test data generation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error generating test data:', error);
    process.exit(1);
  }
};

// Check if userId was provided as command line argument
if (process.argv.length < 3) {
  console.error('Please provide a user ID as a command line argument');
  console.log('Usage: node generateTestData.js <userId>');
  process.exit(1);
}

const userId = process.argv[2];
generateTestData(userId);
