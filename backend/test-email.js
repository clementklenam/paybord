const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
async function testEmail() {
  console.log('🧪 Testing Gmail Email Configuration...\n');

  // Check environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.error('❌ Missing email configuration:');
    console.error('   EMAIL_USER:', emailUser ? '✅ Set' : '❌ Missing');
    console.error('   EMAIL_PASSWORD:', emailPassword ? '✅ Set' : '❌ Missing');
    console.error('\n📝 Please add these to your .env file:');
    console.error('   EMAIL_USER=your_gmail@gmail.com');
    console.error('   EMAIL_PASSWORD=your_app_password');
    return;
  }

  console.log('✅ Email configuration found');
  console.log('📧 From:', emailUser);
  console.log('🔑 Password:', emailPassword ? '✅ Set' : '❌ Missing');
  console.log('');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

  // Test email
  const testEmail = {
    from: emailUser,
    to: emailUser, // Send to yourself for testing
    subject: '🧪 Paymesa Email Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d5a5a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Email Test Successful!</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hello!</h2>
          <p>This is a test email from your Paymesa subscription system.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details</h3>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> ✅ Working</p>
          </div>
          
          <p>Your email configuration is working correctly!</p>
        </div>
        
        <div style="background: #2d5a5a; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 Paymesa. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    console.log('📤 Sending test email...');
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox for the test email');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('\n🔧 Common issues:');
    console.error('   1. Check if 2FA is enabled on Gmail');
    console.error('   2. Verify the app password is correct');
    console.error('   3. Make sure EMAIL_USER is your full Gmail address');
    console.error('   4. Check if "Less secure app access" is enabled (if not using app password)');
  }
}

// Run the test
testEmail(); 