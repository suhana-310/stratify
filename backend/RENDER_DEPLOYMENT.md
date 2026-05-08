# 🚀 Render Deployment Guide for Stratify Backend

## Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas database (already configured)

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
cd stratify/backend
git init
git add .
git commit -m "Initial commit for Render deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `stratify` repository

### 3. Configure Web Service

**Basic Settings:**
- **Name**: `stratify-backend` (or your choice)
- **Region**: Singapore (or closest to you)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** tier (0.1 CPU, 512 MB RAM)

### 4. Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://stratify-admin:Rs9826348254@stratify-cluster.7jv5xvd.mongodb.net/stratify?retryWrites=true&w=majority
JWT_SECRET=stratify-production-jwt-secret-change-this-2024
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=stratify-production-refresh-secret-change-this-2024
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=https://stratify31-app.web.app
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=roshankumarsingh021@gmail.com
EMAIL_PASS=dysmkgiupnjvehbd
```

**⚠️ IMPORTANT**: Change JWT secrets for production!

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your server
   - Provide a public URL like: `https://stratify-backend.onrender.com`

### 6. Update Frontend Configuration

After deployment, update your frontend `.env` file:

```env
VITE_API_URL=https://stratify-backend.onrender.com
VITE_SOCKET_URL=https://stratify-backend.onrender.com
```

Then redeploy your Firebase frontend.

### 7. Update CORS in Backend (if needed)

Your backend already has flexible CORS configured, but verify the Render URL is allowed in `server.js`.

## Health Check

After deployment, test your API:
```
https://your-app-name.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-05-08T...",
  "environment": "production"
}
```

## Important Notes

### Free Tier Limitations:
- ⏰ **Spins down after 15 minutes of inactivity**
- 🐌 **First request after sleep takes 30-50 seconds** (cold start)
- 💾 **512 MB RAM limit**
- 🔄 **Automatic deploys on git push**

### Keeping Service Active:
To prevent cold starts, you can:
1. Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your health endpoint every 10 minutes
2. Upgrade to paid plan ($7/month) for always-on service

### Auto-Deploy:
- Every `git push` to main branch triggers automatic deployment
- Check deployment logs in Render dashboard

## Troubleshooting

### Build Fails:
- Check Node version in `package.json` engines
- Verify all dependencies are in `package.json`

### Connection Issues:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check environment variables are set correctly

### CORS Errors:
- Add your Render URL to CORS whitelist in `server.js`
- Update `CLIENT_URL` environment variable

## Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory usage visible in dashboard
- **Health Check**: `/api/health` endpoint

## Cost

- **Free Tier**: $0/month
  - 750 hours/month
  - Spins down after inactivity
  
- **Starter Plan**: $7/month
  - Always on
  - Better performance

## Alternative: Railway vs Render

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | 750 hrs/month | $5 credit/month |
| Cold Starts | Yes | No |
| Setup | Easier | Slightly complex |
| Performance | Good | Better |
| Auto-deploy | Yes | Yes |

Both are excellent choices! Render is better for getting started quickly.

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get your Render URL
3. ✅ Update frontend environment variables
4. ✅ Redeploy frontend to Firebase
5. ✅ Test the full application

Need help? Check Render documentation: https://render.com/docs
