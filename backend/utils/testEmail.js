import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const testSMTPConnection = async () => {
  console.log('🔍 Testing SMTP Configuration...');
  console.log('📧 Email Service:', process.env.EMAIL_SERVICE);
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('📧 Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
  console.log('📧 Email Host:', process.env.EMAIL_HOST);
  console.log('📧 Email Port:', process.env.EMAIL_PORT);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER or EMAIL_PASS not configured');
    return false;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('🔍 Testing SMTP connection...');
    
    // Verify connection
    const verified = await transporter.verify();
    console.log('✅ SMTP connection verified:', verified);

    // Send test email
    console.log('🔍 Sending test email...');
    const testEmail = {
      from: `"Stratify Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'SMTP Test - Stratify Email Configuration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6366f1;">✅ SMTP Test Successful!</h2>
          <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          <p>If you received this email, your SMTP configuration is working properly!</p>
        </div>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
    return true;

  } catch (error) {
    console.error('❌ SMTP Test Failed:', error.message);
    console.error('❌ Error Code:', error.code);
    console.error('❌ Error Details:', error);
    
    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      console.log('\n🔧 AUTHENTICATION ERROR - Possible Solutions:');
      console.log('1. Enable 2-Factor Authentication on your Gmail account');
      console.log('2. Generate an App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use the App Password instead of your regular password');
      console.log('4. Make sure "Less secure app access" is enabled (if not using 2FA)');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 CONNECTION ERROR - Possible Solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify Gmail SMTP settings');
      console.log('3. Check if your firewall is blocking port 587');
    }
    
    return false;
  }
};

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSMTPConnection();
}