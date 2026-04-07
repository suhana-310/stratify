import express from 'express';
import { testSMTPConnection } from '../utils/testEmail.js';

const router = express.Router();

// @desc    Get email configuration status
// @route   GET /api/email/status
// @access  Public (for debugging)
router.get('/status', async (req, res) => {
  try {
    console.log('📧 Email status check requested...');
    
    const status = {
      configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      service: process.env.EMAIL_SERVICE || 'Not configured',
      host: process.env.EMAIL_HOST || 'Not configured',
      port: process.env.EMAIL_PORT || 'Not configured',
      user: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{3}).*(@.*)/, '$1***$2') : 'Not configured',
      timestamp: new Date().toISOString()
    };

    // Test SMTP connection
    let smtpWorking = false;
    let smtpError = null;
    
    try {
      smtpWorking = await testSMTPConnection();
    } catch (error) {
      smtpError = error.message;
    }

    res.json({
      success: true,
      emailStatus: {
        ...status,
        smtpWorking,
        smtpError,
        features: {
          registration: 'Enabled - Welcome emails sent on signup',
          passwordReset: 'Enabled - Reset emails sent on request',
          passwordChange: 'Enabled - Notification emails sent on change'
        }
      }
    });

  } catch (error) {
    console.error('Email status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email status',
      error: error.message
    });
  }
});

// @desc    Send test email
// @route   POST /api/email/test
// @access  Public (for debugging)
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    console.log(`📧 Test email requested for: ${email}`);
    
    // Import sendEmail dynamically
    const { sendEmail } = await import('../utils/sendEmail.js');
    
    const testEmailContent = {
      email,
      subject: '✅ SMTP Test - Stratify Email System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Email Test Successful!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">SMTP Configuration Working</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              This is a test email to verify that your Stratify email system is working correctly.
            </p>
            
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
              <p style="color: #0c4a6e; margin: 0; font-size: 14px;">
                <strong>✅ Email Features Available:</strong><br>
                • Welcome emails on registration<br>
                • Password reset emails<br>
                • Password change notifications<br>
                • Real-time email delivery
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              <strong>Timestamp:</strong> ${new Date().toISOString()}<br>
              <strong>Environment:</strong> ${process.env.NODE_ENV}<br>
              <strong>Service:</strong> ${process.env.EMAIL_SERVICE}
            </p>
            
            <p style="color: #475569; font-size: 16px; margin-top: 20px;">
              If you received this email, your SMTP configuration is working perfectly! 🎉
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmail(testEmailContent);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        method: result.method,
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

export default router;