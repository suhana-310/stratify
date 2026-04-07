# Railway Email Configuration Setup

## 🚂 Railway Environment Variables Setup

The SMTP email functionality requires environment variables to be set in Railway dashboard. Here's how to configure them:

### 📋 Step-by-Step Setup:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Select your Stratify project

2. **Navigate to Variables**
   - Click on your service/deployment
   - Go to the "Variables" tab

3. **Add Email Environment Variables**
   Add these exact variables:

   ```
   EMAIL_SERVICE=gmail
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=roshankumarsingh021@gmail.com
   EMAIL_PASS=dysmkgiupnjvehbd
   ```

4. **Verify Other Required Variables**
   Make sure these are also set:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://stratify-admin:Rs9826348254@stratify-cluster.7jv5xvd.mongodb.net/stratify?retryWrites=true&w=majority
   JWT_SECRET=stratify-production-jwt-secret-change-this-2024
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=stratify-production-refresh-secret-change-this-2024
   JWT_REFRESH_EXPIRE=30d
   CLIENT_URL=https://stratify31-app.web.app
   ```

5. **Deploy/Restart**
   - After adding variables, Railway will automatically redeploy
   - Or click "Deploy" to force a restart

### 🔍 Testing Email Configuration:

Once variables are set, test using these endpoints:

1. **Check Configuration:**
   ```
   GET https://stratify-production-57f5.up.railway.app/api/auth/email-check
   ```

2. **Test Forgot Password:**
   ```
   POST https://stratify-production-57f5.up.railway.app/api/auth/forgot-password
   Body: {"email": "roshankumarsingh021@gmail.com"}
   ```

3. **Test Registration:**
   ```
   POST https://stratify-production-57f5.up.railway.app/api/auth/register
   Body: {"name": "Test User", "email": "test@example.com", "password": "Password123", "confirmPassword": "Password123"}
   ```

### 🔧 Troubleshooting:

**If emails still don't work:**

1. **Check Railway Logs:**
   - Go to Railway dashboard
   - Click on "Deployments" tab
   - View logs for SMTP errors

2. **Verify Gmail Settings:**
   - Ensure 2FA is enabled on Gmail account
   - Use App Password instead of regular password
   - Check if "Less secure app access" is enabled

3. **Test Locally:**
   - Run the backend locally with same environment variables
   - Check if SMTP works in local environment

### 📧 Email Features:

Once configured, these features will work:
- ✅ Welcome emails on user registration
- ✅ Password reset emails
- ✅ Password change notifications
- ✅ Real-time email delivery

### 🚨 Common Issues:

1. **Variables not set:** Email falls back to file-based system
2. **Wrong Gmail password:** Use App Password, not regular password
3. **SMTP blocked:** Check firewall/network restrictions
4. **Gmail security:** Enable 2FA and generate App Password

### 📱 Alternative: Use Railway CLI

You can also set variables using Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Set variables
railway variables set EMAIL_SERVICE=gmail
railway variables set EMAIL_HOST=smtp.gmail.com
railway variables set EMAIL_PORT=587
railway variables set EMAIL_SECURE=false
railway variables set EMAIL_USER=roshankumarsingh021@gmail.com
railway variables set EMAIL_PASS=dysmkgiupnjvehbd

# Deploy
railway deploy
```

---

**Note:** Replace the email credentials with your actual Gmail account and App Password for production use.