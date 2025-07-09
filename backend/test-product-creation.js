// Direct test script for product creation
const axios = require('axios');

// Get token from command line or use a default test token
const token = process.argv[2] || 'YOUR_TEST_TOKEN_HERE';

// Test product data
const testProduct = {
  business: '6462d8933f7119d98a9330a2', // Replace with a valid business ID from your database
  name: 'Test Product via Script',
  description: 'This is a test product created via direct API call',
  price: 19.99,
  category: 'Test',
  currency: 'USD'
};

// Function to test product creation
async function testCreateProduct() {
  try {
    console.log('Attempting to create product with data:', JSON.stringify(testProduct, null, 2));
    
    const response = await axios.post('http://localhost:5000/api/products', testProduct, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Product created successfully!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to create product:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Function to test product fetching
async function testGetProducts() {
  try {
    console.log('\nAttempting to fetch products...');
    
    const response = await axios.get('http://localhost:5000/api/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Products fetched successfully!');
    console.log('Response status:', response.status);
    console.log('Total products:', response.data.data.length);
    console.log('First few products:', JSON.stringify(response.data.data.slice(0, 2), null, 2));
    return true;
  } catch (error) {
    console.error('Failed to fetch products:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('=== PRODUCT API TEST ===');
  console.log('Using token:', token.substring(0, 10) + '...');
  
  const createResult = await testCreateProduct();
  if (createResult) {
    await testGetProducts();
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

runTests();
