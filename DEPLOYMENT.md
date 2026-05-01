# Deployment Guide

## Overview

This guide covers deploying the ProductAPI application using:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: MongoDB Atlas (free tier)
- **Cache**: Upstash Redis (free tier)

---

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for free tier
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/productapi?retryWrites=true&w=majority
   ```

---

## Step 2: Upstash Redis Setup (Optional but Recommended)

1. Go to [Upstash](https://upstash.com/)
2. Create a free Redis database
3. Copy the connection string:
   ```
   redis://default:xxxxx@xxxxx.upstash.io:6379
   ```

---

## Step 3: Deploy Backend to Render

1. Go to [Render](https://render.com/) and sign in with GitHub
2. Click **New +** → **Web Service**
3. Connect your repository: `pulkit334/Scalable-REST-API-with-Authentication-Role-Based-Access`
4. Configure the service:
   - **Name**: `productapi-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string (use `openssl rand -hex 32`) |
   | `JWT_EXPIRE` | `7d` |
   | `REDIS_URL` | Your Upstash Redis URL (optional) |
   | `CORS_ORIGIN` | Your Vercel frontend URL (set in Step 4) |

6. Click **Create Web Service**
7. Wait for deployment (first deploy takes ~3-5 minutes)
8. Copy your backend URL: `https://productapi-backend.onrender.com`

---

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in with GitHub
2. Click **Add New...** → **Project**
3. Import your repository: `pulkit334/Scalable-REST-API-with-Authentication-Role-Based-Access`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend-url.onrender.com/api/v1` |

6. Click **Deploy**
7. Wait for deployment (~1-2 minutes)
8. Your frontend is live at: `https://your-app.vercel.app`

---

## Step 5: Update CORS Origin

After deploying the frontend, go back to Render and update the `CORS_ORIGIN` environment variable with your Vercel URL:

```
CORS_ORIGIN=https://your-app.vercel.app
```

Redeploy the backend on Render for changes to take effect.

---

## Verify Deployment

1. **Backend Health Check**: Visit `https://your-backend.onrender.com/api/v1/health`
2. **Swagger Docs**: Visit `https://your-backend.onrender.com/api/v1/docs`
3. **Frontend**: Visit `https://your-app.vercel.app`
4. **Test Login**: Register a new user and verify authentication works

---

## Troubleshooting

### Backend won't start on Render
- Check logs in Render dashboard
- Verify `MONGODB_URI` is correct
- Ensure `NODE_ENV=production` is set

### Frontend can't connect to backend
- Verify `VITE_API_URL` ends with `/api/v1`
- Check CORS settings in backend
- Open browser console for network errors

### MongoDB connection fails
- Whitelist all IPs (0.0.0.0/0) in Atlas
- Verify username/password in connection string
- Check network access settings

---

## Custom Domain (Optional)

### Vercel
1. Go to your project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to your service settings → Custom Domain
2. Add your domain
3. Update DNS records (CNAME)

---

## Continuous Deployment

Both Vercel and Render automatically redeploy when you push to the `main` branch.

```bash
git add .
git commit -m "update: your changes"
git push origin main
```

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | Free |
| Render | Free | Free |
| MongoDB Atlas | M0 | Free |
| Upstash Redis | Free | Free |
| **Total** | | **$0/month** |

> Note: Free tiers have limitations (sleep after inactivity, limited compute). Upgrade for production workloads.
