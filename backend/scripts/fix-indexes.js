const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the correct location
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import the same connection function used by server.js
const connectDB = require('../config/db');

// Import the User model
const User = require('../models/User');

// Main function to fix indexes
const fixIndexes = async () => {
    try {
        // Connect to MongoDB using the same method as server.js
        await connectDB();

        console.log('\nAttempting to fix indexes...');

        try {
            // Try to drop the specific index first
            try {
                await User.collection.dropIndex('username_1');
                console.log('Successfully dropped username_1 index');
            } catch (indexError) {
                console.log('Could not drop specific index, trying to drop all indexes...');
                // If specific index drop fails, try the static method
                await User.dropIndexes();
            }

            console.log('Index operation completed. User registration should work now.');
        } catch (error) {
            console.error('Error fixing indexes:', error.message);
        }

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');

    } catch (error) {
        console.error('Script failed:', error.message);
    }
};

// Run the function
fixIndexes();
