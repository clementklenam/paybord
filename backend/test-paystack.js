const Paystack = require('paystack')('sk_test_1234567890'); // Replace with your actual test key

async function testPaystackConnection() {
    try {
        console.log('Testing Paystack connection...');
        
        // Test getting banks
        const banksResponse = await Paystack.misc.list_banks();
        console.log('Banks response:', banksResponse.status ? 'Success' : 'Failed');
        
        if (banksResponse.status) {
            console.log('✅ Paystack connection successful!');
            console.log(`Found ${banksResponse.data.length} banks`);
        } else {
            console.log('❌ Paystack connection failed');
            console.log('Error:', banksResponse.message);
        }
        
    } catch (error) {
        console.error('❌ Error testing Paystack:', error.message);
    }
}

// Run the test
testPaystackConnection(); 