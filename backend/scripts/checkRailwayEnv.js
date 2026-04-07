// Railway Environment Variables Checker
import dotenv from 'dotenv';

// Load local environment for comparison
dotenv.config();

console.log('🚂 Railway Environment Variables Check');
console.log('=====================================\n');

// Check current environment
console.log('📍 Current Environment:', process.env.NODE_ENV || 'Not set');
console.log('📍 Port:', process.env.PORT || 'Not set');
console.log('📍 Database URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('📍 JWT Secret:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('📍 Client URL:', process.env.CLIENT_URL || 'Not set');

console.log('\n📧 Email Configuration:');
console.log('📧 EMAIL_SERVICE:', process.env.EMAIL_SERVICE || '❌ Not set');
console.log('📧 EMAIL_HOST:', process.env.EMAIL_HOST || '❌ Not set');
console.log('📧 EMAIL_PORT:', process.env.EMAIL_PORT || '❌ Not set');
console.log('📧 EMAIL_SECURE:', process.env.EMAIL_SECURE || '❌ Not set');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (***hidden***)' : '❌ Not set');

// Check if email is properly configured
const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
console.log('\n📧 Email Status:', emailConfigured ? '✅ Configured' : '❌ Not configured');

if (!emailConfigured) {
  console.log('\n🔧 RAILWAY SETUP REQUIRED:');
  console.log('You need to set these environment variables in Railway dashboard:');
  console.log('');
  console.log('1. Go to: https://railway.app/dashboard');
  console.log('2. Select your Stratify project');
  console.log('3. Go to Variables tab');
  console.log('4. Add these variables:');
  console.log('');
  console.log('EMAIL_SERVICE=gmail');
  console.log('EMAIL_HOST=smtp.gmail.com');
  console.log('EMAIL_PORT=587');
  console.log('EMAIL_SECURE=false');
  console.log('EMAIL_USER=roshankumarsingh021@gmail.com');
  console.log('EMAIL_PASS=dysmkgiupnjvehbd');
  console.log('');
  console.log('5. Click "Deploy" to restart with new variables');
}

// Test SMTP if configured
if (emailConfigured) {
  console.log('\n🔍 Testing SMTP connection...');
  
  try {
    const { testSMTPConnection } = await import('../utils/testEmail.js');
    const result = await testSMTPConnection();
    
    if (result) {
      console.log('✅ SMTP working correctly in Railway!');
    } else {
      console.log('❌ SMTP test failed in Railway environment');
    }
  } catch (error) {
    console.log('❌ SMTP test error:', error.message);
  }
}

console.log('\n=====================================');
console.log('🚂 Railway Environment Check Complete');