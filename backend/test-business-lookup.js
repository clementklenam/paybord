// Script to test business lookup directly
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Business = require('./models/Business');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to test business lookup
async function testBusinessLookup() {
  try {
    // The business ID you're trying to use
    const businessId = '68226b39653af0df3da731e9';
    
    console.log('Testing business lookup with ID:', businessId);
    console.log('Is valid ObjectId?', mongoose.Types.ObjectId.isValid(businessId));
    
    // Try to find the business
    const business = await Business.findById(businessId);
    
    if (business) {
      console.log('✅ Business found:');
      console.log('Business ID:', business._id);
      console.log('Business Name:', business.businessName);
      console.log('Owner User ID:', business.user);
    } else {
      console.log('❌ Business not found with ID:', businessId);
      
      // Try a broader search
      console.log('Searching for any businesses in the database...');
      const allBusinesses = await Business.find().limit(5);
      
      if (allBusinesses.length > 0) {
        console.log('Found these businesses:');
        allBusinesses.forEach(b => {
          console.log(`- ${b.businessName} (ID: ${b._id}, Owner: ${b.user})`);
        });
      } else {
        console.log('No businesses found in the database at all.');
      }
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error testing business lookup:', error);
  }
}

// Run the function
testBusinessLookup();
