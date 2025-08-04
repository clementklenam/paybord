const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

async function testSubscriptionAPI() {
  console.log('🧪 Testing Subscription API...\n');

  try {
    // Test 1: List subscriptions
    console.log('1. Testing list subscriptions...');
    const listResponse = await axios.get(`${API_BASE}/paystack-subscriptions`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('✅ List subscriptions:', listResponse.data);
    console.log('');

    // Test 2: Create subscription
    console.log('2. Testing create subscription...');
    const createData = {
      customer: 'CUSTOMER_ID_HERE', // Replace with actual customer ID
      product: 'PRODUCT_ID_HERE',   // Replace with actual product ID
      price: 5000,
      currency: 'NGN',
      interval: 'month',
      startDate: new Date().toISOString(),
      metadata: {
        description: 'Test subscription',
        trialDays: 0
      }
    };

    const createResponse = await axios.post(`${API_BASE}/paystack-subscriptions`, createData, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('✅ Create subscription:', createResponse.data);
    console.log('');

    const subscriptionId = createResponse.data.subscription._id;

    // Test 3: Send invoice
    console.log('3. Testing send invoice...');
    const invoiceResponse = await axios.post(`${API_BASE}/paystack-subscriptions/${subscriptionId}/send-invoice`, {}, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('✅ Send invoice:', invoiceResponse.data);
    console.log('');

    // Test 4: Get payment status
    console.log('4. Testing get payment status...');
    const statusResponse = await axios.get(`${API_BASE}/paystack-subscriptions/${subscriptionId}/payment-status`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('✅ Payment status:', statusResponse.data);
    console.log('');

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSubscriptionAPI(); 