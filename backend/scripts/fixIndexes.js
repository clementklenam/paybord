// Script to fix MongoDB index issues
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const fixIndexes = async () => {
    try {
        const conn = await connectDB();

        // Drop indexes on the users collection
        console.log('Dropping indexes on users collection...');
        await conn.connection.collection('users').dropIndexes();
        console.log('Successfully dropped indexes on users collection');

        // List all collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Collections in database:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        console.log('Database fix completed successfully');
        process.exit(0);
    } catch (error) {
        console.error(`Error fixing database: ${error.message}`);
        process.exit(1);
    }
};

// Run the function
fixIndexes();
