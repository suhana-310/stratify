# 📧 SMTP Email Setup Guide

This guide will help you configure real email sending for the Stratify application using various SMTP providers.

## 🚀 Quick Setup Options

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
3. **Update .env file**:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Option 2: Outlook/Hotmail

```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Option 3: Yahoo Mail

```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### Option 4: Custom SMTP Server

```env
EMAIL_SERVICE=
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

---

## 🔧 Detailed Gmail Setup (Step-by-Step)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the setup process to enable 2FA

### Step 2: Generate App Password
1. In Google Account Security, click "2-Step Verification"
2. Scroll down to "App passwords"
3. Click "App passwords"
4. Select "Mail" from the dropdown
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Configuration
Edit `stratify/backend/.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

**Important**: Use the App Password, NOT your regular Gmail password!

---

## 🌐 Alternative SMTP Providers

### SendGrid (Production Recommended)
```env
EMAIL_SERVICE=
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Mailgun
```env
EMAIL_SERVICE=
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
```

### Amazon SES
```env
EMAIL_SERVICE=
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-access-key
EMAIL_PASS=your-ses-secret-key
```

---

## 🧪 Testing Your Configuration

### Test 1: Run Email Test Script
```bash
cd stratify/backend
npm run test-email
```

**Expected Output (Success)**:
```
📧 Setting up SMTP email configuration...
✅ SMTP server connection verified
📧 =============== EMAIL SENT SUCCESSFULLY ===============
📧 To: test@example.com
📧 Subject: Welcome to Stratify - Registration Successful! 🎉
📧 Message ID: <message-id@gmail.com>
📧 Email sent via SMTP to recipient's inbox
```

**Expected Output (Failure)**:
```
❌ SMTP connection failed: Invalid login
📧 Falling back to file-based email system...
```

### Test 2: Register a New User
1. Go to http://localhost:5174
2. Register with a real email address
3. Check your inbox for the confirmation email

### Test 3: Verify SMTP Connection
```bash
cd stratify/backend
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.verify().then(() => console.log('✅ SMTP OK')).catch(err => console.log('❌ SMTP Error:', err.message));
"
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ **Never commit** `.env` files to version control
- ✅ **Use App Passwords** instead of regular passwords
- ✅ **Rotate credentials** regularly
- ✅ **Use different credentials** for development and production

### 2. Gmail Security
- ✅ **Enable 2FA** before creating App Passwords
- ✅ **Use App Passwords** (16 characters, no spaces in .env)
- ✅ **Monitor account activity** for suspicious logins
- ✅ **Revoke unused** App Passwords

### 3. Production Considerations
- ✅ **Use dedicated email service** (SendGrid, Mailgun, SES)
- ✅ **Set up SPF/DKIM** records for your domain
- ✅ **Monitor email delivery** rates and bounces
- ✅ **Implement rate limiting** to prevent abuse

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### "Invalid login" Error
- ✅ **Check credentials**: Ensure EMAIL_USER and EMAIL_PASS are correct
- ✅ **Use App Password**: Don't use your regular Gmail password
- ✅ **Enable 2FA**: Required for Gmail App Passwords

#### "Connection timeout" Error
- ✅ **Check internet**: Ensure stable internet connection
- ✅ **Firewall settings**: Allow outbound connections on port 587
- ✅ **Try different port**: Use 465 with EMAIL_SECURE=true

#### "Authentication failed" Error
- ✅ **Regenerate App Password**: Create a new App Password
- ✅ **Check email service**: Ensure EMAIL_SERVICE matches your provider
- ✅ **Verify account**: Make sure the email account is active

#### Emails not received
- ✅ **Check spam folder**: Emails might be filtered as spam
- ✅ **Verify recipient**: Ensure email address is correct
- ✅ **Check logs**: Look for error messages in backend console

---

## 📊 Configuration Examples

### Development Setup (Gmail)
```env
# Development with Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=dev.stratify@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### Production Setup (SendGrid)
```env
# Production with SendGrid
EMAIL_SERVICE=
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=SG.your-sendgrid-api-key
```

### Testing Setup (Mailtrap)
```env
# Testing with Mailtrap
EMAIL_SERVICE=
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
```

---

## ✅ Verification Checklist

Before going live, ensure:

- [ ] SMTP credentials are configured in `.env`
- [ ] Email test script runs successfully
- [ ] Registration emails are received in inbox
- [ ] Password reset emails work
- [ ] Emails are not going to spam folder
- [ ] Email templates display correctly
- [ ] All email types are tested (welcome, reset, confirmation)

---

*Need help? Check the logs in your backend console for detailed error messages.*