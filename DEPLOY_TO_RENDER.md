# Deploy to Render (Cloud Hosting) - Step by Step

This guide will help you deploy the Fashion Model Visualizer to Render's free cloud hosting so you can access it from any device.

---

## What is Render?

Render is a cloud hosting service that runs your app 24/7 for FREE.
- ✅ Your app stays online even when your PC is off
- ✅ Access from any device (phone, tablet, laptop)
- ✅ FREE tier available
- ✅ Automatic deployments

---

## Step 1: Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with:
   - **GitHub account** (recommended - easiest)
   - OR email/password
4. Verify your email

---

## Step 2: Prepare Your Files

Your app folder (`/mnt/okcomputer/output/app`) already has everything needed:

```
app/
├── dist/              ← Built frontend (already done)
├── server.js          ← Backend API
├── package.json       ← Dependencies
├── render.yaml        ← Render configuration
└── README.md
```

---

## Step 3: Upload to GitHub (Required for Render)

Render needs your code on GitHub. Here's how:

### Option A: Use GitHub Desktop (Easiest)

1. **Download GitHub Desktop**: https://desktop.github.com
2. **Install and sign in** with your GitHub account
3. **Click "File" → "New Repository"**
4. **Fill in:**
   - Name: `fashion-model-visualizer`
   - Local path: Browse to `/mnt/okcomputer/output/app`
   - Click "Create Repository"
5. **Click "Publish repository"**
   - Keep it **Public** (free)
   - Click "Publish Repository"

### Option B: Command Line (If comfortable)

```bash
cd /mnt/okcomputer/output/app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fashion-model-visualizer.git
git push -u origin main
```

---

## Step 4: Deploy on Render

1. **Go to https://dashboard.render.com**
2. **Click "New"** (blue button)
3. **Select "Web Service"**
4. **Connect your GitHub repository:**
   - Find `fashion-model-visualizer`
   - Click "Connect"
5. **Configure the service:**

| Setting | Value |
|---------|-------|
| Name | `fashion-model-visualizer` |
| Environment | `Node` |
| Region | `Oregon (US West)` |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | `Free` |

6. **Click "Advanced"** and add Environment Variables:

   Click **"Add Environment Variable"**
   
   | Key | Value |
   |-----|-------|
   | `BANANA_API_KEY` | Your Banana API key (from Step 2 of Banana setup) |
   | `BANANA_MODEL_KEY` | Your deployed model key (from Banana dashboard) |

7. **Click "Create Web Service"**

8. **Wait for deployment** (2-3 minutes)
   - You'll see build logs
   - When it says "Your service is live", you're done!

---

## Step 5: Get Your Public Link

Once deployed, you'll see a URL like:
```
https://fashion-model-visualizer.onrender.com
```

**This is your public link!** 
- Bookmark it
- Use it on any device
- Share with your client

---

## How to Update Your App Later

If you make changes:

1. **Make changes to files** in `/mnt/okcomputer/output/app`
2. **In GitHub Desktop:**
   - See changes in the left panel
   - Add a summary (e.g., "Updated prompt box")
   - Click "Commit to main"
   - Click "Push origin"
3. **Render automatically redeploys** (takes 1-2 minutes)

---

## Troubleshooting

### "Build failed" error?
- Check that `render.yaml` is in your repository
- Check that `package.json` has `"start": "node server.js"`

### "Cannot find module" error?
- Make sure you ran `npm install` locally first
- Check that all dependencies are in `package.json`

### App shows "Setup Required"?
- Your `BANANA_API_KEY` environment variable isn't set
- Go to Render Dashboard → Your Service → Environment → Add Variable

### Need help?
- Render docs: https://render.com/docs
- Email: support@render.com

---

## Cost

| Service | Cost |
|---------|------|
| Render Hosting | **FREE** (Free tier) |
| Banana.dev GPU | ~$0.10/hour when generating |

**Total for 15-20 images:** ~$0.10 per session

---

## Summary

1. ✅ Sign up on Render
2. ✅ Upload code to GitHub
3. ✅ Connect GitHub to Render
4. ✅ Add Banana API key as environment variable
5. ✅ Deploy
6. ✅ Get public link
7. ✅ Use from any device!

---

**Need help with any step? Just ask!**
