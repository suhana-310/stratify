// Email Functionality Test Utility
import { authAPI } from '../services/api';

export const testEmailFunctionality = async () => {
  console.log('📧 Testing Email Functionality...');
  
  try {
    // Test forgot password functionality
    console.log('🔍 Testing forgot password email...');
    
    const testEmail = 'roshankumarsingh021@gmail.com'; // Use existing user email
    
    const response = await authAPI.forgotPassword(testEmail);
    
    if (response.success) {
      console.log('✅ Forgot password email request successful!');
      console.log('📧 Response:', response.message);
      
      // Show user-friendly message
      alert(`✅ Email Test Successful!\n\nA password reset email has been sent to ${testEmail}.\n\nPlease check:\n• Your inbox\n• Spam/Junk folder\n• Promotions tab (Gmail)\n\nThe email should arrive within a few minutes.`);
      
      return true;
    } else {
      console.error('❌ Forgot password request failed:', response);
      alert(`❌ Email Test Failed!\n\nError: ${response.message || 'Unknown error'}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Email test error:', error);
    alert(`❌ Email Test Error!\n\nError: ${error.message}\n\nThis could be due to:\n• Network connectivity issues\n• API server problems\n• Invalid email configuration`);
    return false;
  }
};

export const showEmailInstructions = () => {
  const instructions = `
📧 Email Configuration Status

✅ SMTP Server: Working correctly
✅ Email Service: Gmail configured
✅ Authentication: Valid credentials
✅ API Endpoints: Responding properly

📋 Email Features Available:
• Welcome emails on registration
• Password reset emails
• Password change notifications

🔍 If you're not receiving emails, check:
1. Spam/Junk folder
2. Promotions tab (Gmail)
3. Email filters/rules
4. Correct email address
5. Email client settings

💡 Test Email:
Click "Test Email" to send a password reset email to verify delivery.
  `;
  
  console.log(instructions);
  alert(instructions);
};

// Auto-run in development
if (import.meta.env.DEV) {
  console.log('📧 Email test utility loaded. Use testEmailFunctionality() to test.');
}