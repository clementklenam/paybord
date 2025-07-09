# Paystack Integration Setup

This guide will help you set up Paystack payment processing in your Paymesa application.

## Prerequisites

1. A Paystack account (sign up at https://paystack.com)
2. Your Paystack API keys

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

## Getting Your Paystack API Keys

1. Log in to your Paystack dashboard
2. Go to Settings > API Keys & Webhooks
3. Copy your Secret Key and Public Key
4. For testing, use the test keys (they start with `sk_test_` and `pk_test_`)
5. For production, use the live keys (they start with `sk_live_` and `pk_live_`)

## Webhook Configuration

1. In your Paystack dashboard, go to Settings > API Keys & Webhooks
2. Add a new webhook with the following URL:
   ```
   https://your-domain.com/api/webhooks
   ```
3. Select the following events:
   - `charge.success`
   - `transfer.success`
   - `refund.processed`

## Testing the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Create a payment link and test the payment flow

## Payment Flow

1. User visits payment link page
2. User fills in required information
3. User clicks "Pay" button
4. System initializes Paystack payment
5. User is redirected to Paystack payment page
6. User completes payment on Paystack
7. User is redirected back to your site
8. System verifies payment with Paystack
9. Transaction is recorded in database
10. User sees success page

## Transaction Recording

All successful payments are automatically recorded in the database with the following information:
- Transaction ID
- Amount and currency
- Customer information
- Payment method used
- Business ID
- Paystack reference
- Payment type (payment_link, storefront_purchase, etc.)

## Analytics Integration

Transactions are automatically included in your dashboard analytics:
- Revenue tracking
- Payment method breakdown
- Customer analytics
- Business performance metrics

## Troubleshooting

### Common Issues

1. **"Invalid Paystack webhook signature"**
   - Check that your webhook secret is correctly configured
   - Ensure the webhook URL is accessible

2. **"Failed to initialize payment"**
   - Verify your Paystack secret key is correct
   - Check that the amount is in the correct currency unit (kobo for NGN)

3. **"Payment verification failed"**
   - Ensure the reference parameter is being passed correctly
   - Check that the payment was actually successful on Paystack

### Debug Logs

The system includes comprehensive logging. Check your server logs for:
- Payment initialization attempts
- Webhook processing
- Transaction creation
- Error details

## Security Notes

- Never expose your Paystack secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Monitor for failed payments and webhook failures 