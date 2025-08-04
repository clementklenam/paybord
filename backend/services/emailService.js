const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send subscription invoice email
const sendSubscriptionInvoice = async (subscription, paymentLink) => {
  try {
    const { customer, product, price, currency, interval, invoiceId } = subscription;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d5a5a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Subscription Invoice</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hello ${customer.name},</h2>
          <p>Thank you for your subscription! Here are your invoice details:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Invoice Details</h3>
            <p><strong>Invoice ID:</strong> ${invoiceId}</p>
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Amount:</strong> ${currency} ${price}</p>
            <p><strong>Billing Cycle:</strong> ${interval}</p>
            <p><strong>Due Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentLink}" 
               style="background: #2d5a5a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Pay Now
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div style="background: #2d5a5a; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 Paymesa. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Invoice for ${product.name} - ${invoiceId}`,
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send payment confirmation email
const sendPaymentConfirmation = async (subscription) => {
  try {
    const { customer, product, price, currency, interval } = subscription;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Payment Confirmed!</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hello ${customer.name},</h2>
          <p>Your payment has been successfully processed!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Subscription Details</h3>
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Amount Paid:</strong> ${currency} ${price}</p>
            <p><strong>Billing Cycle:</strong> ${interval}</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Next Billing:</strong> ${new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
          </div>
          
          <p>Thank you for your subscription!</p>
        </div>
        
        <div style="background: #28a745; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 Paymesa. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Payment Confirmed - ${product.name}`,
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Confirmation email failed:', error);
    throw error;
  }
};

module.exports = {
  sendSubscriptionInvoice,
  sendPaymentConfirmation
}; 