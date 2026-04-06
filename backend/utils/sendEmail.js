import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Create reusable transporter object using SMTP transport
const createTransporter = async () => {
  // Production email configuration - try SMTP first
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('📧 Setting up SMTP email configuration...');
    
    const config = {
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // Alternative SMTP configuration for other providers
    if (process.env.EMAIL_HOST && process.env.EMAIL_SERVICE !== 'gmail') {
      config.host = process.env.EMAIL_HOST;
      config.port = parseInt(process.env.EMAIL_PORT) || 587;
      config.secure = process.env.EMAIL_SECURE === 'true';
      delete config.service;
    }

    try {
      const transporter = nodemailer.createTransport(config);
      
      // Verify the connection
      await transporter.verify();
      console.log('✅ SMTP server connection verified');
      return transporter;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error.message);
      console.log('📧 Falling back to file-based email system...');
      return null;
    }
  }

  // For development without email credentials, return null to use file-based emails
  console.log('📧 No SMTP credentials found, using file-based email system...');
  return null;
};

export const sendEmail = async (options) => {
  try {
    const transporter = await createTransporter();

    // If SMTP is configured and working, send real email
    if (transporter) {
      const mailOptions = {
        from: `"Stratify Team" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html || options.message,
        text: options.text
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('\n📧 =============== EMAIL SENT SUCCESSFULLY ===============');
      console.log('📧 To:', options.email);
      console.log('📧 Subject:', options.subject);
      console.log('📧 Message ID:', info.messageId);
      console.log('📧 Email sent via SMTP to recipient\'s inbox');
      console.log('📧 ================================================== 📧\n');
      
      return { 
        success: true, 
        messageId: info.messageId,
        method: 'smtp',
        message: 'Email sent successfully via SMTP'
      };
    }

    // Fallback to file-based system for development
    const emailsDir = path.join(process.cwd(), 'emails');
    
    // Create emails directory if it doesn't exist
    if (!fs.existsSync(emailsDir)) {
      fs.mkdirSync(emailsDir, { recursive: true });
    }

    // Create a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `email-${timestamp}-${options.email.replace(/[@.]/g, '_')}.html`;
    const filepath = path.join(emailsDir, filename);

    // Create a complete HTML email file
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.subject}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .email-header { background: #6366f1; color: white; padding: 20px; text-align: center; }
        .email-info { background: #e0e7ff; padding: 15px; border-bottom: 1px solid #c7d2fe; }
        .email-content { padding: 0; }
        .email-footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
        .fallback-notice { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px; color: #92400e; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>📧 Email Preview</h1>
        </div>
        <div class="fallback-notice">
            <strong>⚠️ Development Mode:</strong> SMTP not configured. This email was saved as a file instead of being sent.
            <br><strong>To enable real email sending:</strong> Configure EMAIL_USER and EMAIL_PASS in .env file.
        </div>
        <div class="email-info">
            <p><strong>To:</strong> ${options.email}</p>
            <p><strong>Subject:</strong> ${options.subject}</p>
            <p><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div class="email-content">
            ${options.html || options.message}
        </div>
        <div class="email-footer">
            <p>This is a development email preview. In production with SMTP configured, this would be sent to the recipient's inbox.</p>
        </div>
    </div>
</body>
</html>`;

    // Write the email to file
    fs.writeFileSync(filepath, emailHtml);

    console.log('\n📧 =============== EMAIL SAVED TO FILE ===============');
    console.log('📧 To:', options.email);
    console.log('📧 Subject:', options.subject);
    console.log('📧 Email saved to:', filepath);
    console.log('📧 Open this file in your browser to view the email');
    console.log('📧 ⚠️  SMTP not configured - using file fallback');
    console.log('📧 ================================================ 📧\n');
    
    return { 
      success: true, 
      messageId: 'file-' + Date.now(),
      filePath: filepath,
      method: 'file',
      message: 'Email saved to file - SMTP not configured'
    };

  } catch (error) {
    console.error('📧 Email send error:', error);
    
    // Return different error messages based on the error type
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your email credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Please check your internet connection.');
    } else if (error.code === 'EMESSAGE') {
      throw new Error('Invalid email message format.');
    } else {
      throw new Error(`Email could not be sent: ${error.message}`);
    }
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name, verificationUrl) => ({
    subject: 'Welcome to Stratify - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Stratify!</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Thank you for joining Stratify! We're excited to have you on board. 
            To get started, please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 15px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            If you didn't create an account with Stratify, you can safely ignore this email.
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            This verification link will expire in 24 hours.
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #e2e8f0; color: #64748b; font-size: 12px;">
          <p>© 2024 Stratify. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Reset Your Stratify Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            You requested to reset your password for your Stratify account. 
            Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 15px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            This reset link will expire in 10 minutes for security reasons.
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #e2e8f0; color: #64748b; font-size: 12px;">
          <p>© 2024 Stratify. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordChanged: (name) => ({
    subject: 'Your Stratify Password Has Been Changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Changed</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your Stratify account password has been successfully changed. 
            If you made this change, no further action is required.
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            If you didn't make this change, please contact our support team immediately 
            at <a href="mailto:support@stratify.com" style="color: #6366f1;">support@stratify.com</a>
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Security Tip:</strong> Always use a strong, unique password and enable two-factor authentication when available.
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #e2e8f0; color: #64748b; font-size: 12px;">
          <p>© 2024 Stratify. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  registrationSuccess: (name) => ({
    subject: 'Welcome to Stratify - Registration Successful! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Stratify!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">You have successfully signed up</p>
        </div>
        
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            🎉 <strong>Congratulations!</strong> You have successfully signed up for Stratify. 
            We're excited to have you join our community of productive teams and individuals.
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 18px;">🚀 What's Next?</h3>
            <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Explore your dashboard and create your first project</li>
              <li style="margin-bottom: 8px;">Invite team members to collaborate</li>
              <li style="margin-bottom: 8px;">Set up your profile and preferences</li>
              <li>Start managing your projects efficiently</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="display: inline-block; padding: 15px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Go to Dashboard
            </a>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Complete your profile setup to get the most out of Stratify's collaboration features.
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            If you have any questions or need help getting started, feel free to reach out to our support team at 
            <a href="mailto:support@stratify.com" style="color: #6366f1;">support@stratify.com</a>
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #e2e8f0; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© 2024 Stratify. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Making project management simple and effective.</p>
        </div>
      </div>
    `
  })
};