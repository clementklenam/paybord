// scripts/fixMongoIndexes.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function fixIndexes() {
    try {
        // Get the MongoDB URI from environment variables
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }

        console.log('Connecting to MongoDB...');

        // Connect to MongoDB
        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Get the users collection
        const users = conn.connection.collection('users');

        // List all indexes
        const indexes = await users.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Find and drop the username_1 index if it exists
        const usernameIndex = indexes.find(index => index.name === 'username_1');
        if (usernameIndex) {
            console.log('Dropping username_1 index...');
            await users.dropIndex('username_1');
            console.log('Successfully dropped username_1 index');
        } else {
            console.log('username_1 index not found');
        }

        // Verify indexes after dropping
        const updatedIndexes = await users.indexes();
        console.log('Updated indexes:', updatedIndexes.map(i => i.name));

        process.exit(0);
    } catch (error) {
        console.error('Error fixing indexes:', error.message);
        process.exit(1);
    }
}

fixIndexes();