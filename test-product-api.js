// Direct test script for product creation API
const fetch = require('node-fetch');

// Get token from command line or use default
const token = process.argv[2] || '';
if (!token) {
  console.error('Please provide your authentication token as a command line argument');
  process.exit(1);
}

// Your business ID from Esthers Bakery Shop
const businessId = '68226b39653af0df3da731e9';

async function testProductCreation() {
  try {
    console.log('Testing product creation API...');
    console.log('Using business ID:', businessId);
    
    // Create test product data
    const productData = {
      business: businessId,
      name: `Test Product ${new Date().toISOString()}`,
      description: 'This is a test product created via direct API script',
      price: 19.99,
      image: 'https://via.placeholder.com/800x600?text=Test+Product',
      category: 'Test',
      currency: 'USD',
      customId: `test_${Date.now()}`,
      metadata: {}
    };
    
    console.log('Product data:', JSON.stringify(productData, null, 2));
    
    // Make API request
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    // Parse response
    const responseData = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('✅ Product created successfully!');
    } else {
      console.log('❌ Failed to create product');
    }
  } catch (error) {
    console.error('Error testing product creation:', error);
  }
}

// Run the test
testProductCreation();
