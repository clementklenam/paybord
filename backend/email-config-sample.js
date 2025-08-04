// Email Configuration Sample
// Copy this to your .env file or set these environment variables

module.exports = {
  // Gmail Configuration
  EMAIL_USER: 'your_email@gmail.com',
  EMAIL_PASSWORD: 'your_app_password_here', // Use Gmail App Password, not regular password
  
  // Alternative: SendGrid Configuration
  // SENDGRID_API_KEY: 'your_sendgrid_api_key',
  
  // Alternative: Mailgun Configuration  
  // MAILGUN_API_KEY: 'your_mailgun_api_key',
  // MAILGUN_DOMAIN: 'your_mailgun_domain',
  
  // Alternative: AWS SES Configuration
  // AWS_ACCESS_KEY_ID: 'your_aws_access_key',
  // AWS_SECRET_ACCESS_KEY: 'your_aws_secret_key',
  // AWS_REGION: 'us-east-1'
};

/*
To set up Gmail for sending emails:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Use the generated password as EMAIL_PASSWORD

Example .env file:
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
*/ 