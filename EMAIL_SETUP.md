# 📧 Email Configuration Guide

This guide will help you set up email notifications for Stratify, including registration confirmation emails and password reset functionality.

## 🚀 Quick Setup (Gmail - Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Follow the setup process to enable 2FA

### Step 2: Generate App Password
1. In Google Account settings, go to **Security** → **App passwords**
2. Select **Mail** as the app and **Other** as the device
3. Enter "Stratify" as the device name
4. Copy the generated 16-character password

### Step 3: Update Environment Variables
Edit `backend/.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Step 4: Test Email Configuration
```bash
cd backend
npm run test-email
```

## 🔧 Alternative SMTP Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### Custom SMTP Server
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@provider.com
EMAIL_PASS=your-password
```

## 📧 Email Templates

Stratify includes the following email templates:

### 1. Registration Success Email
- **Trigger**: When a user successfully registers
- **Content**: Welcome message with dashboard link
- **Subject**: "Welcome to Stratify - Registration Successful! 🎉"

### 2. Password Reset Email
- **Trigger**: When a user requests password reset
- **Content**: Secure reset link (expires in 10 minutes)
- **Subject**: "Reset Your Stratify Password"

### 3. Password Changed Confirmation
- **Trigger**: When a user successfully changes their password
- **Content**: Security notification
- **Subject**: "Your Stratify Password Has Been Changed"

## 🛠️ Development Mode

If you don't configure email settings, Stratify will run in development mode:

- ✅ All functionality works normally
- 📧 Emails are logged to the console instead of being sent
- 🔍 You can see email content in the server logs
- 🚀 Perfect for development and testing

## 🔒 Security Best Practices

### For Gmail:
- ✅ Always use App Passwords (never your regular password)
- ✅ Enable 2-factor authentication
- ✅ Regularly review and rotate App Passwords

### For Production:
- ✅ Use environment variables (never hardcode credentials)
- ✅ Consider using dedicated email services (SendGrid, Mailgun)
- ✅ Implement rate limiting for email sending
- ✅ Monitor email delivery and bounce rates

## 🚨 Troubleshooting

### Common Issues:

**"Authentication failed"**
- Check that you're using an App Password (not regular password)
- Verify 2FA is enabled on your Google account
- Ensure EMAIL_USER and EMAIL_PASS are correct

**"Connection refused"**
- Check your internet connection
- Verify EMAIL_HOST and EMAIL_PORT settings
- Some networks block SMTP ports (try different network)

**"Invalid credentials"**
- Double-check email address and password
- For Gmail, regenerate App Password
- Ensure no extra spaces in environment variables

### Testing Commands:

```bash
# Test email configuration
npm run test-email

# Test authentication system
npm run test-auth

# Check server logs
npm run dev
```

## 📞 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify your email provider's SMTP settings
3. Test with a different email provider
4. Run the test commands to isolate the issue

For Gmail-specific issues, refer to [Google's App Password documentation](https://support.google.com/accounts/answer/185833).

---

**Note**: Email configuration is optional for development. The application will work perfectly without it, with emails being logged to the console instead.