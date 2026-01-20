# 🚀 Render Deployment Guide

## Prerequisites
1. GitHub account with your code pushed
2. Render account (free at render.com)
3. MongoDB Atlas database (you already have this)

## Quick Deploy Steps

### Option 1: Using render.yaml (Automated)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create New Blueprint on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and set up both services automatically

3. **Configure Environment Variables** (in Render Dashboard)
   
   **For Backend Service:**
   - `MONGODB_URI`: `mongodb+srv://lenmonireach123:UkpRoEGqh2S8gqcw@cluster0.q5kop.mongodb.net/notes-app?retryWrites=true&w=majority&appName=Cluster0`
   - `ACCESS_TOKEN_SECRET`: Generate a secure key (min 32 characters)
   - `FRONTEND_URL`: Will be provided after frontend deploys (e.g., `https://notes-app-frontend.onrender.com`)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (already set in render.yaml)

   **For Frontend Service:**
   - `VITE_API_BASE_URL`: Will be provided after backend deploys (e.g., `https://notes-app-backend.onrender.com`)

4. **Update URLs After First Deploy**
   - After both services deploy, update the environment variables with actual URLs
   - Redeploy both services

### Option 2: Manual Setup (Step by Step)

#### Deploy Backend:
1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: `notes-app-backend`
   - **Region**: Oregon (Free)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add environment variables (same as above)
5. Click "Create Web Service"
6. **Copy the backend URL** (e.g., `https://notes-app-backend.onrender.com`)

#### Deploy Frontend:
1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `notes-app-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL`: (paste your backend URL from step 6 above)
5. Click "Create Static Site"
6. **Copy the frontend URL** (e.g., `https://notes-app-frontend.onrender.com`)

#### Update Backend with Frontend URL:
1. Go back to backend service in Render
2. Environment → Edit `FRONTEND_URL`
3. Set it to your frontend URL
4. Save → Service will auto-redeploy

## MongoDB Atlas Setup

1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

## Generate Secure ACCESS_TOKEN_SECRET

Run this in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Testing Your Deployment

1. Visit your frontend URL
2. Create an account
3. Log in
4. Create a note
5. Test all features

## Important Notes

⚠️ **Free Tier Limitations:**
- Backend will spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of uptime

🔒 **Security:**
- Remove `config.json` from git history if it was committed
- Never commit `.env` files
- Rotate MongoDB credentials if they were exposed

## Troubleshooting

**Backend won't start:**
- Check environment variables are set correctly
- View logs in Render Dashboard
- Ensure MongoDB Atlas allows Render's IP

**Frontend can't connect to backend:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running (check Render logs)

**Database connection fails:**
- Verify MongoDB Atlas network access allows all IPs
- Check connection string format
- Ensure database user has correct permissions

## Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Add custom domain in Render settings
   - Update DNS records
   - Update CORS and environment variables

2. **Monitoring**:
   - Set up Render email notifications
   - Monitor logs for errors
   - Check MongoDB Atlas metrics

3. **Upgrades** (If needed):
   - Upgrade to paid plan to prevent spin-down
   - Add Redis for caching
   - Set up CI/CD for automatic deployments
