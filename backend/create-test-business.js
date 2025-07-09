// Script to create a test business for a user
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Business = require('./models/Business');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to create a test business
async function createTestBusiness() {
  try {
    // Get the user ID from command line or use a default
    const userId = process.argv[2];
    
    if (!userId) {
      console.error('Please provide a user ID as a command line argument');
      process.exit(1);
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      process.exit(1);
    }
    
    console.log(`Creating test business for user: ${user.email}`);
    
    // Check if user already has a business
    const existingBusiness = await Business.findOne({ user: userId });
    
    if (existingBusiness) {
      console.log(`User already has a business with ID: ${existingBusiness._id}`);
      console.log('Business details:', existingBusiness);
      process.exit(0);
    }
    
    // Create a new business
    const newBusiness = new Business({
      user: userId,
      businessName: `${user.firstName}'s Test Business`,
      businessType: 'sole_proprietorship',
      industry: 'Technology',
      email: user.email,
      phone: '+1234567890',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country'
      },
      currency: 'USD',
      active: true
    });
    
    // Save the business
    await newBusiness.save();
    
    console.log(`Business created successfully with ID: ${newBusiness._id}`);
    console.log('Use this ID for product creation testing');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error creating test business:', error);
    process.exit(1);
  }
}

// Run the function
createTestBusiness();
