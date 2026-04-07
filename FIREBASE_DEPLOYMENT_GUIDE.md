# 🔥 Firebase Hosting Deployment Guide

## Prerequisites
1. **Google Account** (for Firebase Console)
2. **Node.js** installed (v16 or higher)
3. **Firebase CLI** installed

## Step 1: Install Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

## Step 2: Firebase Project Setup

### Option A: Create New Project (Recommended)
1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Click "Create a project"**
3. **Project name**: `stratify-2026` (or your preferred name)
4. **Disable Google Analytics** (not needed for hosting)
5. **Click "Create project"**

### Option B: Use Existing Project
If you already have a Firebase project, note the project ID.

## Step 3: Firebase Authentication & Initialization

```bash
# Navigate to frontend directory
cd stratify/frontend

# Login to Firebase (opens browser)
firebase login

# Initialize Firebase in the project
firebase init hosting
```

### During `firebase init hosting`:
- **Select existing project** or create new one
- **Public directory**: `dist` (important!)
- **Single-page app**: `Yes`
- **Set up automatic builds**: `No` (we'll build manually)
- **Overwrite index.html**: `No`

## Step 4: Build the Application

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Verify build output
ls dist/
```

Expected output in `dist/`:
- `index.html`
- `assets/` folder with CSS and JS files
- Static assets (images, fonts, etc.)

## Step 5: Deploy to Firebase

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy with custom message
firebase deploy --only hosting -m "Deploy Stratify frontend"
```

## Step 6: Update Backend CORS Configuration

After deployment, you'll get a Firebase URL like:
`https://stratify-2026.web.app` or `https://stratify-2026.firebaseapp.com`

Update the backend CORS configuration to include the new Firebase URL.

## Step 7: Update Environment Variables

Update your frontend `.env` file if needed:
```env
# API Configuration
VITE_API_URL=https://stratify-production-57f5.up.railway.app/api
VITE_SOCKET_URL=https://stratify-production-57f5.up.railway.app

# App Configuration
VITE_APP_NAME=Stratify
VITE_APP_VERSION=1.0.0
```

## Complete Deployment Script

Create this script for easy redeployment:

**`deploy-firebase.sh`** (Linux/Mac):
```bash
#!/bin/bash
echo "🔥 Deploying Stratify to Firebase..."
cd frontend
npm run build
firebase deploy --only hosting
echo "✅ Deployment complete!"
```

**`deploy-firebase.bat`** (Windows):
```batch
@echo off
echo 🔥 Deploying Stratify to Firebase...
cd frontend
npm run build
firebase deploy --only hosting
echo ✅ Deployment complete!
```

## Firebase CLI Commands Reference

```bash
# Login/logout
firebase login
firebase logout

# List projects
firebase projects:list

# Switch project
firebase use <project-id>

# Build and deploy
npm run build && firebase deploy --only hosting

# Deploy with preview (test before going live)
firebase hosting:channel:deploy preview

# View deployment history
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:releases:rollback

# Open Firebase console
firebase open hosting
```

## Custom Domain Setup (Optional)

1. **In Firebase Console** → Hosting → Add custom domain
2. **Enter your domain** (e.g., `app.yourdomain.com`)
3. **Follow DNS setup instructions**
4. **Wait for SSL certificate** (automatic)

## Environment-Specific Deployments

### Development
```bash
firebase hosting:channel:deploy dev --expires 7d
```

### Staging
```bash
firebase hosting:channel:deploy staging --expires 30d
```

### Production
```bash
firebase deploy --only hosting
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Permission Errors
```bash
# Re-authenticate
firebase logout
firebase login
```

### Wrong Project
```bash
# Check current project
firebase projects:list
firebase use <correct-project-id>
```

### Deployment Fails
```bash
# Check Firebase status
firebase status

# Deploy with debug info
firebase deploy --only hosting --debug
```

## Firebase vs Vercel Comparison

| Feature | Firebase | Vercel |
|---------|----------|--------|
| **Speed** | Very Fast | Very Fast |
| **CDN** | Global | Global |
| **SSL** | Free | Free |
| **Custom Domain** | Free | Free |
| **Build Time** | Manual | Auto |
| **Rollback** | Easy | Easy |
| **Analytics** | Built-in | Third-party |

## Post-Deployment Checklist

- [ ] Frontend loads at Firebase URL
- [ ] All routes work (login, register, dashboard)
- [ ] API calls to Railway backend work
- [ ] Real-time features (Socket.IO) work
- [ ] Authentication flow works
- [ ] Mobile responsiveness works

## Expected URLs After Deployment

- **Main App**: `https://stratify-2026.web.app`
- **Login**: `https://stratify-2026.web.app/login`
- **Dashboard**: `https://stratify-2026.web.app/dashboard`

---

**Firebase Hosting provides excellent performance and reliability for React applications! 🚀**