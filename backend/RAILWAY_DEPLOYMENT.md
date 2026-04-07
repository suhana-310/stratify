# Railway Deployment Guide for Stratify Backend

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code
- MongoDB Atlas account (for production database)

### 2. Environment Variables Required

Set these environment variables in Railway dashboard:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stratify?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-for-production
JWT_REFRESH_EXPIRE=30d

# Frontend URL (Your Vercel deployment)
CLIENT_URL=https://your-vercel-app.vercel.app

# Email Configuration (Optional - for password reset)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist Railway's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to MONGODB_URI

### 4. Railway Deployment

#### Option A: Deploy from GitHub (Recommended)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your stratify repository
5. Select the backend folder as root directory
6. Railway will automatically detect it's a Node.js app
7. Add all environment variables in the Variables tab
8. Deploy!

#### Option B: Deploy using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project in backend directory
cd backend
railway init

# Add environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set CLIENT_URL="https://your-vercel-app.vercel.app"
# ... add other variables

# Deploy
railway up
```

### 5. Post-Deployment Steps

1. **Test the API**: Visit `https://your-railway-app.railway.app/api/health`
2. **Update Frontend**: Update your Vercel frontend environment variables:
   ```env
   VITE_API_URL=https://your-railway-app.railway.app/api
   VITE_SOCKET_URL=https://your-railway-app.railway.app
   ```
3. **Redeploy Frontend**: Redeploy your Vercel app with new environment variables

### 6. Verification Checklist

- [ ] Backend API responds at `/api/health`
- [ ] Database connection working
- [ ] Authentication endpoints working
- [ ] Socket.IO connection working
- [ ] CORS configured for your frontend domain
- [ ] Frontend can connect to backend API
- [ ] Real-time features working

### 7. Monitoring and Logs

- View logs in Railway dashboard
- Monitor performance and usage
- Set up alerts for downtime

### 8. Custom Domain (Optional)

1. In Railway dashboard, go to Settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update CLIENT_URL and frontend API URLs

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure CLIENT_URL matches your Vercel domain exactly
2. **Database Connection**: Check MongoDB Atlas IP whitelist and connection string
3. **Environment Variables**: Verify all required variables are set in Railway
4. **Socket.IO Issues**: Ensure WebSocket connections are allowed

### Debug Commands:

```bash
# View Railway logs
railway logs

# Check environment variables
railway variables

# Connect to Railway shell
railway shell
```

## 📞 Support

If you encounter issues:
1. Check Railway logs for error messages
2. Verify environment variables are correctly set
3. Test API endpoints individually
4. Check MongoDB Atlas connection and permissions

Your Stratify backend should now be live on Railway! 🎉