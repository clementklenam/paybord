/**
 * Migration script to update existing payment link URLs
 * This script updates all existing payment links to use the correct frontend port
 */

const mongoose = require('mongoose');
const PaymentLink = require('../models/PaymentLink');
const { generatePaymentLinkUrl } = require('../config/frontend');
require('dotenv').config();

const updatePaymentLinkUrls = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paymesa');
        console.log('Connected to MongoDB');

        // Find all payment links
        const paymentLinks = await PaymentLink.find({});
        console.log(`Found ${paymentLinks.length} payment links to update`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const paymentLink of paymentLinks) {
            const oldUrl = paymentLink.url;
            const newUrl = generatePaymentLinkUrl(paymentLink.linkId);

            // Only update if the URL has changed
            if (oldUrl !== newUrl) {
                paymentLink.url = newUrl;
                await paymentLink.save();
                console.log(`Updated: ${oldUrl} -> ${newUrl}`);
                updatedCount++;
            } else {
                console.log(`Skipped (no change): ${oldUrl}`);
                skippedCount++;
            }
        }

        console.log(`\nMigration completed:`);
        console.log(`- Updated: ${updatedCount} payment links`);
        console.log(`- Skipped: ${skippedCount} payment links`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the migration if this script is executed directly
if (require.main === module) {
    updatePaymentLinkUrls();
}

module.exports = updatePaymentLinkUrls; 