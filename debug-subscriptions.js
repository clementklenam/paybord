const axios = require('axios');

// Test the subscription API directly
async function debugSubscriptions() {
  try {
    console.log('🔍 Testing subscription API...');
    
    // You'll need to replace this with a valid token
    const token = 'your-token-here';
    
    const response = await axios.get('http://localhost:5002/api/paystack-subscriptions', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response data structure:', Object.keys(response.data));
    
    if (response.data.subscriptions && response.data.subscriptions.length > 0) {
      const firstSub = response.data.subscriptions[0];
      console.log('🔍 First subscription:', firstSub);
      
      if (firstSub.customer) {
        console.log('🔍 Customer object:', firstSub.customer);
        console.log('🔍 Customer type:', typeof firstSub.customer);
        console.log('🔍 Customer keys:', Object.keys(firstSub.customer));
        
        // Check for problematic properties
        if (firstSub.customer.__v !== undefined) {
          console.warn('🔍 WARNING: Customer has __v property:', firstSub.customer.__v);
        }
        if (firstSub.customer.createdAt !== undefined) {
          console.warn('🔍 WARNING: Customer has createdAt property:', firstSub.customer.createdAt);
        }
        if (firstSub.customer.updatedAt !== undefined) {
          console.warn('🔍 WARNING: Customer has updatedAt property:', firstSub.customer.updatedAt);
        }
        if (firstSub.customer.paymentMethods !== undefined) {
          console.warn('🔍 WARNING: Customer has paymentMethods property:', firstSub.customer.paymentMethods);
        }
      }
      
      if (firstSub.product) {
        console.log('🔍 Product object:', firstSub.product);
        console.log('🔍 Product type:', typeof firstSub.product);
        console.log('🔍 Product keys:', Object.keys(firstSub.product));
        
        // Check for problematic properties
        if (firstSub.product.__v !== undefined) {
          console.warn('🔍 WARNING: Product has __v property:', firstSub.product.__v);
        }
        if (firstSub.product.createdAt !== undefined) {
          console.warn('🔍 WARNING: Product has createdAt property:', firstSub.product.createdAt);
        }
        if (firstSub.product.updatedAt !== undefined) {
          console.warn('🔍 WARNING: Product has updatedAt property:', firstSub.product.updatedAt);
        }
        if (firstSub.product.customId !== undefined) {
          console.warn('🔍 WARNING: Product has customId property:', firstSub.product.customId);
        }
      }
    }
    
  } catch (error) {
    console.error('🔍 Error testing subscription API:', error.response?.data || error.message);
  }
}

debugSubscriptions(); 