const axios = require('axios');

const API_BASE = 'http://localhost:5002/api';
const AUTH_TOKEN = 'your-auth-token-here'; // Replace with actual token

async function testSubscriptionData() {
  try {
    console.log('🔍 Testing subscription data structure...');
    
    const response = await axios.get(`${API_BASE}/paystack-subscriptions`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔍 Response structure:', Object.keys(response.data));
    console.log('🔍 Subscriptions count:', response.data.subscriptions?.length || 0);
    
    if (response.data.subscriptions && response.data.subscriptions.length > 0) {
      const firstSub = response.data.subscriptions[0];
      console.log('🔍 First subscription structure:', Object.keys(firstSub));
      
      if (firstSub.customer) {
        console.log('🔍 Customer type:', typeof firstSub.customer);
        console.log('🔍 Customer structure:', Object.keys(firstSub.customer));
        console.log('🔍 Customer has __v:', '__v' in firstSub.customer);
        console.log('🔍 Customer has createdAt:', 'createdAt' in firstSub.customer);
      }
      
      if (firstSub.product) {
        console.log('🔍 Product type:', typeof firstSub.product);
        console.log('🔍 Product structure:', Object.keys(firstSub.product));
        console.log('🔍 Product has __v:', '__v' in firstSub.product);
        console.log('🔍 Product has createdAt:', 'createdAt' in firstSub.product);
      }
    }
    
  } catch (error) {
    console.error('🔍 Error testing subscription data:', error.response?.data || error.message);
  }
}

testSubscriptionData(); 