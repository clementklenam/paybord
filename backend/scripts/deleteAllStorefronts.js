const mongoose = require('mongoose');
require('dotenv').config();
const axios = require('axios');

// Check Node.js version
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 16 || (major === 16 && minor < 14)) {
  console.error('Error: Node.js version 16.14.0 or higher required');
  process.exit(1);
}

async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Could not determine public IP:', error.message);
    return null;
  }
}

async function connectDB() {
  try {
    console.log('Checking MongoDB connection...');
    
    const currentIP = await getPublicIP();
    if (currentIP) {
      console.log(`\nYour current public IP: ${currentIP}`);
      console.log('Please ensure this IP is whitelisted in MongoDB Atlas');
    }
    
    const conn = await mongoose.createConnection(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      family: 4
    }).asPromise();
    
    console.log('\nSuccessfully connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('\nConnection failed:', error.message);
    console.log('\nRequired actions:');
    console.log(`1. Whitelist your IP in MongoDB Atlas: ${currentIP || 'YOUR_CURRENT_IP'}`);
    console.log('2. Wait 2 minutes after whitelisting');
    console.log('3. Verify MONGO_URI in .env matches Atlas connection string');
    return null;
  }
}

async function deleteAllStorefronts() {
  let conn;
  try {
    // Retry connection up to 3 times
    let retries = 3;
    while (retries > 0) {
      conn = await connectDB();
      if (conn) break;
      retries--;
      if (retries > 0) {
        console.log(`\nRetrying connection (${retries} attempts remaining)...`);
        await new Promise(resolve => setTimeout(resolve, 120000));
      }
    }
    
    if (!conn) {
      console.log('\nFailed to connect after multiple attempts');
      process.exit(1);
    }
    
    // Initialize model with the connection
    const Storefront = conn.model('Storefront', require('../models/storefrontModel').schema);
    
    const count = await Storefront.countDocuments();
    
    if (count === 0) {
      console.log('No storefronts found to delete');
      process.exit(0);
    }
    
    console.warn(`\nWARNING: This will permanently delete ALL ${count} storefronts!`);
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer1 = await new Promise(resolve => {
      readline.question(`Are you SURE you want to delete ALL ${count} storefronts? (yes/no) `, resolve);
    });
    
    if (answer1.toLowerCase() !== 'yes') {
      console.log('Operation cancelled');
      process.exit(0);
    }
    
    const answer2 = await new Promise(resolve => {
      readline.question(`Type 'CONFIRM' to permanently delete ${count} storefronts: `, resolve);
    });
    
    readline.close();
    
    if (answer2 !== 'CONFIRM') {
      console.log('Operation cancelled');
      process.exit(0);
    }
    
    console.log('Starting deletion...');
    const result = await Storefront.deleteMany({});
    
    console.log(`\nSuccessfully deleted ${result.deletedCount} storefronts`);
    console.log('Database cleanup complete');
    
  } catch (error) {
    console.error('Deletion failed:', error.message);
    process.exit(1);
  } finally {
    if (conn) await conn.close();
    process.exit(0);
  }
}

deleteAllStorefronts();
