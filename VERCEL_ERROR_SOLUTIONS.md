# 🚨 Vercel Deployment Error - Solutions

## Common Vercel Deployment Errors & Fixes

### Solution 1: Use Simplified vercel.json
If you're getting deployment errors, try the minimal configuration:

1. **Replace vercel.json content** with this simple version:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. **Or delete vercel.json entirely** and let Vercel auto-detect

### Solution 2: Manual Deployment via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Navigate to frontend directory**:
```bash
cd stratify/frontend
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel --prod
```

### Solution 3: GitHub Integration Reset

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project** → Settings
3. **Git Integration** → Disconnect
4. **Reconnect** your GitHub repository
5. **Trigger new deployment**

### Solution 4: Environment Variables Check

Ensure these are set in Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://stratify-production-57f5.up.railway.app/api
VITE_SOCKET_URL=https://stratify-production-57f5.up.railway.app
VITE_APP_NAME=Stratify
VITE_APP_VERSION=1.0.0
```

### Solution 5: Build Command Override

In Vercel Dashboard → Settings → Build & Output Settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Solution 6: Delete and Recreate Project

If all else fails:
1. **Delete current Vercel project**
2. **Create new project** from GitHub
3. **Select frontend folder** as root directory
4. **Deploy with auto-detection**

### Solution 7: Alternative Deployment Platforms

If Vercel continues to have issues:

#### Netlify Deployment
1. Go to https://netlify.com
2. Connect GitHub repository
3. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `frontend`

#### GitHub Pages (Static)
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for automated deployment

### Solution 8: Local Build Verification

Before deploying, ensure local build works:
```bash
cd stratify/frontend
npm install
npm run build
npm run preview
```

### Solution 9: Dependency Issues

If there are dependency conflicts:
```bash
cd stratify/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Solution 10: Vercel Support Files

Create these files in `frontend/` directory:

**`.vercelignore`**:
```
node_modules
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**`public/_redirects`** (already created):
```
/*    /index.html   200
```

## Quick Fix Commands

### Option A: Minimal Configuration
```bash
cd stratify/frontend
echo '{"rewrites":[{"source":"/(.*)", "destination":"/index.html"}]}' > vercel.json
git add vercel.json
git commit -m "Simplify vercel config"
git push origin main
```

### Option B: Remove Configuration (Auto-detect)
```bash
cd stratify/frontend
rm vercel.json
git add -A
git commit -m "Remove vercel config for auto-detection"
git push origin main
```

### Option C: CLI Deployment
```bash
cd stratify/frontend
npx vercel --prod
```

## Error-Specific Solutions

### "Build failed" Error
- Check build logs for specific error
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

### "Function not found" Error
- Remove `functions` section from vercel.json
- Use simplified configuration

### "Invalid configuration" Error
- Validate JSON syntax in vercel.json
- Use minimal configuration

### "Environment variable" Error
- Set all VITE_ variables in Vercel dashboard
- Ensure no typos in variable names

## Test After Deployment

Once deployed, test these URLs:
- https://your-app.vercel.app (main page)
- https://your-app.vercel.app/login (should not 404)
- https://your-app.vercel.app/dashboard (should not 404)

---

**Try Solution 1 (simplified vercel.json) first - it fixes most deployment issues!**