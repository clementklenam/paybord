# Frontend Configuration for Payment Links

This document explains how to configure the frontend URL for payment links in different environments.

## Environment Variables

You can configure the frontend URL using the following environment variables:

### Option 1: Individual Components
```bash
FRONTEND_HOST=localhost
FRONTEND_PORT=5002
FRONTEND_PROTOCOL=http
```

### Option 2: Full URL (overrides individual components)
```bash
FRONTEND_URL=http://localhost:5002
```

### Option 3: Use Vite's Port
```bash
VITE_PORT=5002
```

### Option 4: Use Client Port
```bash
CLIENT_PORT=5002
```

## Priority Order

The system uses the following priority order to determine the frontend URL:

1. `FRONTEND_URL` (full URL override)
2. `PAYMENT_LINK_BASE_URL` (full URL override)
3. Individual components: `FRONTEND_PROTOCOL://FRONTEND_HOST:FRONTEND_PORT`
4. Fallback to default: `http://localhost:5002`

## Examples

### Development with Vite on port 5002
```bash
VITE_PORT=5002
```

### Development with custom port
```bash
FRONTEND_PORT=3000
```

### Production
```bash
FRONTEND_URL=https://yourdomain.com
```

## Updating Existing Payment Links

To update existing payment links in the database to use the new configuration:

```bash
node scripts/update-payment-link-urls.js
```

This script will:
- Find all existing payment links
- Update their URLs to use the current configuration
- Skip links that already have the correct URL
- Show a summary of changes

## Automatic Port Detection

The system now automatically detects and uses the correct port based on your environment configuration. When you change the frontend port:

1. Set the appropriate environment variable
2. Restart the backend server
3. New payment links will use the correct port
4. Run the migration script to update existing links

## Configuration File

The configuration is handled by `config/frontend.js` which provides:

- `getFrontendConfig()` - Returns the complete frontend configuration
- `generatePaymentLinkUrl(linkId)` - Generates a payment link URL with the correct configuration 