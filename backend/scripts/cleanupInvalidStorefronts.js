const mongoose = require('mongoose');
require('dotenv').config();
const { Storefront } = require('../models/storefrontModel');

// Match your existing connection config
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

async function cleanup() {
  try {
    await connectDB();
    
    // Verify Storefront collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const storefrontCollectionExists = collections.some(c => c.name === 'storefronts');
    
    if (!storefrontCollectionExists) {
      console.error('Error: storefronts collection does not exist');
      process.exit(1);
    }
    
    console.log('Searching for invalid storefronts...');
    const invalidStorefronts = await Storefront.find({ 
      $or: [
        { _id: { $exists: false } },
        { _id: null },
        { _id: 'undefined' },
        { _id: { $type: 'string' } }
      ]
    }).limit(100); // Add limit for safety

    if (invalidStorefronts.length === 0) {
      console.log('No invalid storefronts found');
      process.exit(0);
    }

    console.log(`Found ${invalidStorefronts.length} potentially invalid storefronts`);
    
    // Add confirmation prompt
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      readline.question(`Delete ${invalidStorefronts.length} invalid storefronts? (y/n) `, resolve);
    });
    readline.close();
    
    if (answer.toLowerCase() !== 'y') {
      console.log('Cleanup cancelled');
      process.exit(0);
    }
    
    const result = await Storefront.deleteMany({
      _id: { $in: invalidStorefronts.map(s => s._id) }
    });

    console.log(`Successfully deleted ${result.deletedCount} invalid storefronts`);
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

cleanup();
