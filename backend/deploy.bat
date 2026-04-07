@echo off
echo 🚀 Deploying Stratify Backend to Railway...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
)

REM Check if user is logged in
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Railway...
    railway login
)

echo 📦 Preparing deployment...

REM Ensure we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the backend directory.
    pause
    exit /b 1
)

echo ✅ Found package.json

REM Check for required files
if not exist "server.js" (
    echo ❌ Error: server.js not found.
    pause
    exit /b 1
)

echo ✅ Found server.js

echo 📋 Environment Variables Checklist:
echo Make sure you have set these in Railway dashboard:
echo   - NODE_ENV=production
echo   - MONGODB_URI (MongoDB Atlas connection string)
echo   - JWT_SECRET (secure random string)
echo   - JWT_REFRESH_SECRET (secure random string)
echo   - CLIENT_URL (your Vercel frontend URL)
echo.

set /p confirm="Have you set all required environment variables in Railway dashboard? (y/n): "
if /i not "%confirm%"=="y" (
    echo ❌ Please set environment variables first, then run this script again.
    echo 📖 See RAILWAY_DEPLOYMENT.md for detailed instructions.
    pause
    exit /b 1
)

echo 🚀 Deploying to Railway...
railway up

if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    echo.
    echo 🔗 Your backend is now live!
    echo 📋 Next steps:
    echo   1. Test your API at: https://your-app.railway.app/api/health
    echo   2. Update your frontend environment variables with the new API URL
    echo   3. Redeploy your frontend on Vercel
    echo.
    echo 🎉 Deployment complete!
) else (
    echo ❌ Deployment failed. Check the logs above for errors.
)

pause