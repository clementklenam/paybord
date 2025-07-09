/**
 * Frontend configuration utility
 * Dynamically determines the frontend URL based on environment and configuration
 */

const getFrontendConfig = () => {
    // Production configuration
    if (process.env.NODE_ENV === 'production') {
        return {
            baseUrl: process.env.FRONTEND_URL || 
                     process.env.PAYMENT_LINK_BASE_URL || 
                     'https://yourdomain.com',
            protocol: 'https',
            host: process.env.FRONTEND_HOST || 'yourdomain.com',
            port: process.env.FRONTEND_PORT || '443'
        };
    }

    // Development configuration
    const config = {
        protocol: process.env.FRONTEND_PROTOCOL || 'http',
        host: process.env.FRONTEND_HOST || 'localhost',
        port: process.env.FRONTEND_PORT || 
              process.env.VITE_PORT || 
              process.env.CLIENT_PORT || 
              '5002'
    };

    // Allow override with full URL
    const fullUrl = process.env.FRONTEND_URL || process.env.PAYMENT_LINK_BASE_URL;
    if (fullUrl) {
        try {
            const url = new URL(fullUrl);
            config.protocol = url.protocol.replace(':', '');
            config.host = url.hostname;
            config.port = url.port || (config.protocol === 'https' ? '443' : '80');
        } catch (error) {
            console.warn('Invalid FRONTEND_URL format, using default configuration');
        }
    }

    config.baseUrl = `${config.protocol}://${config.host}:${config.port}`;
    
    return config;
};

const generatePaymentLinkUrl = (linkId) => {
    const config = getFrontendConfig();
    return `${config.baseUrl}/payment-link/${linkId}`;
};

module.exports = {
    getFrontendConfig,
    generatePaymentLinkUrl
}; 