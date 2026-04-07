# MongoDB Atlas Setup Guide for Stratify

## 🚀 Complete MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**:
   - Visit: https://cloud.mongodb.com
   - Click "Try Free" or "Sign Up"
   - Create account with your email

2. **Verify Email**:
   - Check your email for verification link
   - Click to verify your account

### Step 2: Create a New Cluster

1. **Create Organization** (if prompted):
   - Organization Name: `Stratify`
   - Click "Next"

2. **Create Project**:
   - Project Name: `Stratify Backend`
   - Click "Next"

3. **Build a Database**:
   - Choose "M0 Sandbox" (FREE tier)
   - Provider: AWS (recommended)
   - Region: Choose closest to your location
   - Cluster Name: `Stratify-Cluster`
   - Click "Create"

### Step 3: Configure Database Access

1. **Create Database User**:
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `stratify-admin`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

2. **Save Credentials**:
   ```
   Username: stratify-admin
   Password: [your-generated-password]
   ```

### Step 4: Configure Network Access

1. **Add IP Address**:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Comment: "Railway and Development Access"
   - Click "Confirm"

   **Note**: This allows Railway to connect. For production, you can restrict to specific IPs later.

### Step 5: Get Connection String

1. **Connect to Cluster**:
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: 5.5 or later
   - Copy the connection string

2. **Your Connection String**:
   ```
   mongodb+srv://stratify-admin:<password>@stratify-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

3. **Replace Password**:
   - Replace `<password>` with your actual password
   - Add database name: `/stratify` before the `?`
   - Final format:
   ```
   mongodb+srv://stratify-admin:YOUR_PASSWORD@stratify-cluster.xxxxx.mongodb.net/stratify?retryWrites=true&w=majority
   ```

### Step 6: Test Connection

Let me create a test script to verify the connection works.

### Step 7: Environment Variables

Add this to your Railway environment variables:

```env
MONGODB_URI=mongodb+srv://stratify-admin:YOUR_PASSWORD@stratify-cluster.xxxxx.mongodb.net/stratify?retryWrites=true&w=majority
```

## 🔧 Database Collections

Your Stratify app will automatically create these collections:
- `users` - User accounts and profiles
- `projects` - Project information and settings
- `tasks` - Task details and assignments

## 📊 Monitoring

1. **Atlas Dashboard**:
   - Monitor database performance
   - View connection logs
   - Track usage metrics

2. **Alerts** (Optional):
   - Set up alerts for high usage
   - Monitor connection issues

## 🔒 Security Best Practices

1. **Strong Password**: Use a complex password for database user
2. **IP Whitelist**: Restrict to specific IPs in production
3. **Regular Backups**: Atlas provides automatic backups
4. **Monitor Access**: Review connection logs regularly

## 🚨 Troubleshooting

**Common Issues**:

1. **Connection Timeout**: Check IP whitelist settings
2. **Authentication Failed**: Verify username/password
3. **Database Not Found**: Ensure database name is in connection string
4. **Network Error**: Check internet connection and firewall

**Test Commands**:
```bash
# Test connection from your app
node test-db-connection.js
```

## 📞 Support

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Community Forums: https://community.mongodb.com
- Support: Available in Atlas dashboard

Your MongoDB Atlas database is now ready for Stratify! 🎉