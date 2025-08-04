const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testSubscriptionAnalytics() {
  try {
    console.log('Testing subscription analytics...');
    
    // Test the subscription analytics endpoint
    const response = await axios.get(`${API_BASE}/analytics/subscription-analytics`, {
      headers: {
        'Content-Type': 'application/json',
        // Add your auth token if needed
        // 'Authorization': 'Bearer YOUR_TOKEN'
      }
    });

    console.log('Subscription Analytics Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Test the main dashboard to see if subscription transactions are included
    console.log('\nTesting main dashboard analytics...');
    const dashboardResponse = await axios.get(`${API_BASE}/analytics/dashboard-overview`, {
      headers: {
        'Content-Type': 'application/json',
        // Add your auth token if needed
        // 'Authorization': 'Bearer YOUR_TOKEN'
      }
    });

    console.log('Dashboard Overview Response:');
    console.log(JSON.stringify(dashboardResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testSubscriptionAnalytics(); 