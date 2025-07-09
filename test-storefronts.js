const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/paymesa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Storefront = require('./backend/models/Storefront');

async function testStorefronts() {
    try {
        console.log('Testing storefronts...');
        
        // Get all storefronts
        const storefronts = await Storefront.find({}).lean();
        
        console.log(`Found ${storefronts.length} storefronts:`);
        
        storefronts.forEach((sf, index) => {
            console.log(`\n${index + 1}. Storefront: ${sf.name}`);
            console.log(`   ID: ${sf._id}`);
            console.log(`   Banner: ${sf.banner || 'null'}`);
            console.log(`   Logo: ${sf.logo || 'null'}`);
            console.log(`   Status: ${sf.status}`);
            console.log(`   Business: ${sf.business}`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

testStorefronts(); 