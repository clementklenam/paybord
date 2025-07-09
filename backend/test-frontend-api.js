const axios = require('axios');

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API calls...');
    
    const baseURL = 'http://localhost:5000/api';
    const timeRanges = ['today', 'last7days', 'last30days', 'thisMonth'];
    
    for (const timeRange of timeRanges) {
      console.log(`\n--- Testing ${timeRange} ---`);
      
      try {
        const response = await axios.get(`${baseURL}/analytics/payment-analytics`, {
          params: { timeRange },
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log(`Status: ${response.status}`);
        console.log(`Success: ${response.data.success}`);
        
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          console.log(`Gross Volume: ${data.grossVolume.amount}`);
          console.log(`Net Volume: ${data.netVolume.amount}`);
          console.log(`Total Transactions: ${data.totalTransactions}`);
          console.log(`Time Range: ${data.timeRange}`);
        } else {
          console.log('Response not successful:', response.data);
        }
      } catch (error) {
        console.error(`Error testing ${timeRange}:`, error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testFrontendAPI(); 