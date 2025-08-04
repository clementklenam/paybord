const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function updateSubscriptionStatus() {
  try {
    // Replace with your actual subscription ID
    const subscriptionId = '688b96d99be25024cb040bd4';
    
    console.log('Updating subscription status to active...');
    
    const response = await axios.put(`${API_BASE}/paystack-subscriptions/test/${subscriptionId}/status`, {
      status: 'active'
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Add your auth token if needed
        // 'Authorization': 'Bearer YOUR_TOKEN'
      }
    });

    console.log('Success:', response.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

updateSubscriptionStatus(); 