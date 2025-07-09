const axios = require('axios');

const API_URL = 'http://localhost:5000/api/payments';

// Test GET endpoint
const testGetTransactions = async () => {
  try {
    console.log('Testing GET /api/payments - Get all transactions');
    const response = await axios.get(API_URL);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing GET endpoint:', error.response?.data || error.message);
  }
};

// Test POST endpoint
const testCreateTransaction = async () => {
  try {
    const testData = {
      amount: 250,
      status: 'success',
      customerName: 'Jane Smith'
    };

    console.log('Testing POST /api/payments - Create transaction');
    console.log('Sending data:', testData);

    const response = await axios.post(API_URL, testData);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing POST endpoint:', error.response?.data || error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('=== Starting API Tests ===');

  // Test create transaction first to add data
  await testCreateTransaction();
  console.log('\n');

  // Then test get transactions to see the results
  await testGetTransactions();

  console.log('\n=== API Tests Complete ===');
};

runTests();
