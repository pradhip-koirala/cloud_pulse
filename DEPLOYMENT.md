# CloudPulse - Deployment Guide

## Production Deployment ✅

CloudPulse is successfully deployed and running in production!

**Live URLs:**
- **Frontend**: https://cloud-pulse-two.vercel.app
- **Backend API**: https://cloud-pulse-40uq.onrender.com
- **Database**: MongoDB Atlas (cloud-hosted)

This guide documents the deployment process and provides instructions for replicating or modifying the deployment.

---

## Current Production Configuration

### Backend (Render)
- **Service Name**: cloud-pulse-40uq
- **URL**: https://cloud-pulse-40uq.onrender.com
- **Region**: US
- **Instance Type**: Free tier
- **Root Directory**: backend
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
```
PORT=5000
MONGODB_URI=mongodb+srv://zaw_htwe:***@cloudpulse.2syvxqc.mongodb.net/?appName=cloudPulse
CORS_ORIGIN=https://cloud-pulse-two.vercel.app
REQUEST_TIMEOUT_MS=10000
```

### Frontend (Vercel)
- **Project Name**: cloud-pulse-two
- **URL**: https://cloud-pulse-two.vercel.app
- **Framework**: Vite
- **Root Directory**: frontend
- **Build Command**: `npm run build`
- **Output Directory**: dist

**Environment Variables:**
```
VITE_API_BASE_URL=https://cloud-pulse-40uq.onrender.com/api
```

**Vercel Configuration** (`frontend/vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_BASE_URL": "https://cloud-pulse-40uq.onrender.com/api"
  }
}
```

### Database (MongoDB Atlas)
- **Cluster**: cloudPulse.2syvxqc
- **Database**: cloudPulse
- **Tier**: M0 (Free)
- **Region**: AWS / US East
- **Network Access**: 0.0.0.0/0 (Allow all)

---

## Deployment History

### Initial Deployment Issues & Fixes

**Problem 1**: CORS errors blocking API calls
- **Cause**: Backend CORS_ORIGIN missing `https://` protocol
- **Fix**: Updated to `CORS_ORIGIN=https://cloud-pulse-two.vercel.app`

**Problem 2**: Frontend calling `localhost:5000` in production
- **Cause**: Environment variable `VITE_API_BASE_URL` not being used during build
- **Fix**: 
  1. Added fallback logic in `api.js` to detect production mode
  2. Created `vercel.json` with explicit environment variables
  3. Redeployed frontend

**Problem 3**: Wrong environment variable name
- **Cause**: Using `VITE_API_URL` instead of `VITE_API_BASE_URL`
- **Fix**: Updated `.env` files to use correct variable name

---

## Prerequisites

- MongoDB Atlas account (free tier available)
- Render account (free tier available)
- Vercel account (free tier available)
- Git repository on GitHub/GitLab

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click "Build a Database"
4. Choose "FREE" tier (M0 Sandbox)
5. Select a cloud provider and region (closest to your users)
6. Click "Create Cluster"

### 1.2 Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, restrict to specific IPs
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `cloudpulse`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cloudpulse
```

---

## Step 2: Deploy Backend to Render

### 2.1 Prepare Backend

1. Ensure `backend/.env.example` exists
2. Update `backend/server.js` to use `database.js` (not `database.dev.js`):

```javascript
import { connectDatabase } from './config/database.js';
```

3. Commit and push changes to Git

### 2.2 Create Render Web Service

1. Go to https://render.com
2. Sign up or log in
3. Click "New +" → "Web Service"
4. Connect your Git repository
5. Configure:
   - **Name**: cloudpulse-api (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.3 Set Environment Variables

In Render dashboard, go to "Environment" and add:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cloudpulse
REQUEST_TIMEOUT_MS=10000
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Note**: You'll update `CORS_ORIGIN` after deploying the frontend.

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://cloudpulse-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

1. Update `frontend/.env.example`:
```
VITE_API_BASE_URL=https://cloudpulse-api.onrender.com/api
```

2. Commit changes

### 3.2 Deploy to Vercel

1. Go to https://vercel.com
2. Sign up or log in
3. Click "Add New" → "Project"
4. Import your Git repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

### 3.3 Set Environment Variables

In Vercel project settings, add:

```
VITE_API_BASE_URL=https://cloudpulse-api.onrender.com/api
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment
3. Note your frontend URL: `https://cloudpulse.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to Render backend dashboard
2. Update environment variable:
```
CORS_ORIGIN=https://cloudpulse.vercel.app
```
3. Redeploy backend

---

## Step 5: Test Production Deployment

### 5.1 Basic Functionality

1. Open your Vercel URL
2. Test URL input with `https://example.com`
3. Verify result appears
4. Check Dashboard shows data
5. Test Compare view with multiple URLs

### 5.2 Backend Health Check

Visit: `https://cloudpulse-api.onrender.com/health`

Should return:
```json
{"status":"ok","timestamp":"2026-07-29T..."}
```

### 5.3 Verify Data Persistence

1. Run several tests
2. Refresh the page
3. Confirm tests persist in history

---

## Step 6: Post-Deployment Configuration

### 6.1 Custom Domain (Optional)

**Vercel:**
1. Go to project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Render:**
1. Go to service settings → Custom Domain
2. Add your custom domain
3. Update DNS records

### 6.2 Enable HTTPS

Both Render and Vercel provide automatic HTTPS. Ensure:
- Vercel frontend uses `https://`
- Render backend uses `https://`
- Update `CORS_ORIGIN` if domain changes

### 6.3 Monitoring

**Render:**
- Check "Metrics" tab for CPU/Memory usage
- Set up "Notifications" for failures

**Vercel:**
- Check "Analytics" for page views
- Monitor "Functions" for errors

**MongoDB Atlas:**
- Check "Metrics" for database performance
- Set up "Alerts" for high usage

---

## Troubleshooting

### Backend won't start
- Check Render logs
- Verify `MONGODB_URI` is correct
- Ensure database user has proper permissions

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` is correct
- Verify `CORS_ORIGIN` matches frontend URL
- Check browser console for CORS errors

### Database connection fails
- Verify network access allows all IPs (0.0.0.0/0)
- Check database user credentials
- Ensure connection string format is correct

### Tests not persisting
- Verify MongoDB Atlas cluster is running
- Check backend logs for database errors
- Test MongoDB connection string locally first

---

## Cost Estimates

### Free Tier Limits

**MongoDB Atlas (Free M0):**
- 512 MB storage
- Shared RAM
- Suitable for ~1000s of test records

**Render (Free):**
- 750 hours/month (sleeps after 15min inactivity)
- 512 MB RAM
- Auto-wakes on request

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions

### When to Upgrade

- **MongoDB**: When >500MB data or need backups
- **Render**: When traffic requires always-on or >512MB RAM
- **Vercel**: When >100GB bandwidth/month

---

## Security Recommendations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Rotate database passwords regularly
3. **CORS**: Restrict to specific domains in production
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **Monitoring**: Set up error tracking (Sentry, etc.)

---

## Maintenance

### Regular Tasks

- **Weekly**: Check error logs
- **Monthly**: Review MongoDB Atlas usage
- **Quarterly**: Update dependencies (`npm audit fix`)
- **Yearly**: Rotate database credentials

### Backup Strategy

MongoDB Atlas free tier doesn't include automated backups. Consider:
- Exporting data manually periodically
- Upgrading to paid tier for automatic backups
- Implementing your own backup script

---

## Rollback Procedure

If deployment fails:

1. **Vercel**: Use "Deployments" tab to rollback to previous version
2. **Render**: Use "Manual Deploy" to redeploy previous commit
3. **Database**: Restore from backup (if available)

---

## Phase 7 Complete! 🎉

Your CloudPulse application is now live and accessible worldwide!

**Production URLs:**
- **Frontend**: https://cloud-pulse-two.vercel.app
- **Backend API**: https://cloud-pulse-40uq.onrender.com
- **Health Check**: https://cloud-pulse-40uq.onrender.com/health

**Features Working:**
- ✅ URL latency testing
- ✅ Test history persistence
- ✅ Dashboard with charts
- ✅ Multi-URL comparison
- ✅ SSRF protection
- ✅ Responsive design
- ✅ All CRUD operations

**Known Considerations:**
- Render free tier sleeps after 15 minutes of inactivity (first request after sleep takes ~30 seconds)
- MongoDB Atlas free tier limited to 512MB storage (~10,000+ test records)
- No rate limiting implemented (consider adding for high-traffic scenarios)

---

## Quick Reference

### Update Backend Code
```bash
cd backend
# Make changes
git add .
git commit -m "Update backend"
git push
# Render auto-deploys from Git
```

### Update Frontend Code
```bash
cd frontend
# Make changes
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys from Git
```

### Check Backend Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab

### Check Frontend Deployment
1. Go to Vercel dashboard
2. Select your project
3. Check "Deployments" tab

### Update Environment Variables
**Render**: Dashboard → Environment → Edit → Save Changes → Manual Deploy
**Vercel**: Settings → Environment Variables → Save → Redeploy

---

## Support & Resources

- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project Repo**: https://github.com/pradhip-koirala/cloud_pulse
