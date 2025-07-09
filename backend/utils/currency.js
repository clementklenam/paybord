/**
 * Currency conversion utilities
 * Paystack sends amounts in the smallest currency unit (e.g., kobo for NGN, pesewas for GHS)
 * We need to convert these to the base currency unit for storage
 */

// Currencies that use the smallest unit (divide by 100)
const SMALLEST_UNIT_CURRENCIES = [
    'NGN', // Nigerian Naira (kobo)
    'GHS', // Ghanaian Cedi (pesewas)
    'KES', // Kenyan Shilling (cents)
    'ZAR', // South African Rand (cents)
    'EGP', // Egyptian Pound (piastres)
    'MAD', // Moroccan Dirham (centimes)
    'XOF', // West African CFA franc (centimes)
    'XAF'  // Central African CFA franc (centimes)
];

/**
 * Convert Paystack amount to base currency unit
 * @param {number} amount - Amount in smallest currency unit (from Paystack)
 * @param {string} currency - Currency code
 * @returns {number} - Amount in base currency unit
 */
function convertFromSmallestUnit(amount, currency) {
    if (!amount || typeof amount !== 'number') {
        return 0;
    }

    // For currencies that use smallest units, divide by 100
    if (SMALLEST_UNIT_CURRENCIES.includes(currency.toUpperCase())) {
        return amount / 100;
    }

    // For other currencies (USD, EUR, GBP), return as-is
    return amount;
}

/**
 * Convert base currency unit to smallest unit (for Paystack)
 * @param {number} amount - Amount in base currency unit
 * @param {string} currency - Currency code
 * @returns {number} - Amount in smallest currency unit
 */
function convertToSmallestUnit(amount, currency) {
    if (!amount || typeof amount !== 'number') {
        return 0;
    }

    // For currencies that use smallest units, multiply by 100
    if (SMALLEST_UNIT_CURRENCIES.includes(currency.toUpperCase())) {
        return Math.round(amount * 100);
    }

    // For other currencies (USD, EUR, GBP), return as-is
    return amount;
}

/**
 * Format currency amount for display
 * @param {number} amount - Amount in base currency unit
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currency) {
    if (!amount || typeof amount !== 'number') {
        return '0.00';
    }

    const currencyConfigs = {
        'GHS': { locale: 'en-GH', currency: 'GHS' },
        'NGN': { locale: 'en-NG', currency: 'NGN' },
        'KES': { locale: 'en-KE', currency: 'KES' },
        'ZAR': { locale: 'en-ZA', currency: 'ZAR' },
        'EGP': { locale: 'en-EG', currency: 'EGP' },
        'MAD': { locale: 'en-MA', currency: 'MAD' },
        'USD': { locale: 'en-US', currency: 'USD' },
        'EUR': { locale: 'en-EU', currency: 'EUR' },
        'GBP': { locale: 'en-GB', currency: 'GBP' },
        'XOF': { locale: 'en-SN', currency: 'XOF' },
        'XAF': { locale: 'en-CM', currency: 'XAF' }
    };

    const config = currencyConfigs[currency.toUpperCase()] || { locale: 'en-US', currency: currency.toUpperCase() };
    
    try {
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (error) {
        // Fallback for unsupported currencies
        console.warn(`Currency ${currency} not supported, using fallback formatting`);
        return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
    }
}

module.exports = {
    convertFromSmallestUnit,
    convertToSmallestUnit,
    formatCurrency,
    SMALLEST_UNIT_CURRENCIES
}; 