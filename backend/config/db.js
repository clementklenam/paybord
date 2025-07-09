// backend/config/db.js

const mongoose = require('mongoose');
const dns = require('dns');
const http = require('http');

// Function to get public IP address
const getPublicIP = () => {
    return new Promise((resolve, reject) => {
        http.get('http://api.ipify.org', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            console.error('Error getting public IP:', err.message);
            resolve('Unable to determine');
        });
    });
};

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        
        // Get public IP for troubleshooting
        const publicIP = await getPublicIP();
        console.log(`Your public IP address is: ${publicIP}`);
        console.log('Make sure to add this IP to MongoDB Atlas Network Access whitelist.');
        
        // Check DNS resolution
        console.log('\nTesting DNS resolution...');
        
        try {
            // Use Promise to handle async DNS lookup
            const lookupPromise = new Promise((resolve, reject) => {
                dns.lookup('mongodb.com', (err, address) => {
                    if (err) reject(err);
                    else resolve(address);
                });
            });
            
            const mongodbAddress = await lookupPromise;
            console.log(`DNS resolution successful. MongoDB.com resolves to: ${mongodbAddress}`);
        } catch (dnsError) {
            console.error(`DNS resolution failed: ${dnsError.message}`);
            console.log('This may indicate network or DNS configuration issues.');
        }
        
        console.log('\nAttempting database connection...');
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 30000, // 30 seconds
            maxPoolSize: 10,
        });
        
        console.log('MongoDB Connected');
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
