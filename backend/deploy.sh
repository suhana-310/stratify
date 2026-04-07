#!/bin/bash

# Stratify Backend Deployment Script for Railway
echo "🚀 Deploying Stratify Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

echo "📦 Preparing deployment..."

# Ensure we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the backend directory."
    exit 1
fi

echo "✅ Found package.json"

# Check for required files
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found."
    exit 1
fi

echo "✅ Found server.js"

# Initialize Railway project if not already done
if [ ! -f "railway.json" ]; then
    echo "🔧 Initializing Railway project..."
    railway init
fi

echo "📋 Environment Variables Checklist:"
echo "Make sure you have set these in Railway dashboard:"
echo "  - NODE_ENV=production"
echo "  - MONGODB_URI (MongoDB Atlas connection string)"
echo "  - JWT_SECRET (secure random string)"
echo "  - JWT_REFRESH_SECRET (secure random string)"
echo "  - CLIENT_URL (your Vercel frontend URL)"
echo ""

read -p "Have you set all required environment variables in Railway dashboard? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set environment variables first, then run this script again."
    echo "📖 See RAILWAY_DEPLOYMENT.md for detailed instructions."
    exit 1
fi

echo "🚀 Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🔗 Your backend is now live!"
    echo "📋 Next steps:"
    echo "  1. Test your API at: https://your-app.railway.app/api/health"
    echo "  2. Update your frontend environment variables with the new API URL"
    echo "  3. Redeploy your frontend on Vercel"
    echo ""
    echo "🎉 Deployment complete!"
else
    echo "❌ Deployment failed. Check the logs above for errors."
    exit 1
fi