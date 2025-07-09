const mongoose = require('mongoose');
const PaymentLink = require('./models/PaymentLink');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paymesa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function checkPaymentLink() {
    try {
        console.log('Checking payment link: pl_4cd7e05d236e21d2');
        
        const paymentLink = await PaymentLink.findOne({ linkId: 'pl_4cd7e05d236e21d2' });
        
        if (!paymentLink) {
            console.log('Payment link not found');
            return;
        }
        
        console.log('Payment link found:');
        console.log('- ID:', paymentLink._id);
        console.log('- Link ID:', paymentLink.linkId);
        console.log('- Title:', paymentLink.title);
        console.log('- Amount:', paymentLink.amount);
        console.log('- Currency:', paymentLink.currency);
        console.log('- Business ID:', paymentLink.businessId);
        console.log('- User ID:', paymentLink.userId);
        console.log('- Status:', paymentLink.status);
        
        if (paymentLink.businessId) {
            console.log('✅ Payment link has businessId');
        } else {
            console.log('❌ Payment link missing businessId');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkPaymentLink(); 