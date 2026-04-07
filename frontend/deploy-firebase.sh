#!/bin/bash

echo "🔥 Deploying Stratify to Firebase..."
echo ""

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building application..."
npm run build

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo ""
echo "✅ Deployment complete!"
echo "🔗 Your app should be live at: https://stratify31-app.web.app"
echo ""