@echo off
echo 🔥 Deploying Stratify to Firebase...
echo.

echo 📦 Installing dependencies...
call npm install

echo 🏗️ Building application...
call npm run build

echo 🚀 Deploying to Firebase...
call firebase deploy --only hosting

echo.
echo ✅ Deployment complete!
echo 🔗 Your app should be live at: https://stratify31-app.web.app
echo.
pause