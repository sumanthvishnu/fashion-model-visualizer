# Quick Start Guide - Fashion Model Visualizer

## For Non-Technical Users

---

## What You Need to Know

**Banana.dev shut down on March 31st, 2024.** The app now uses **RunPod Serverless**, which Banana themselves recommended as the best alternative.

---

## What You Need to Do (Summary)

### Part 1: Set up RunPod Serverless (AI Image Generation)
1. Go to **runpod.io** → Sign up → Get $10 free
2. Get API key from Settings
3. Deploy a ComfyUI serverless endpoint
4. Set Min Workers = 1 (for warm mode)
5. Copy Endpoint ID

### Part 2: Deploy App to Render (Cloud Hosting)
1. Go to **render.com** → Sign up with GitHub
2. Upload this app to GitHub (use GitHub Desktop - it's easy!)
3. Connect GitHub to Render
4. Add your RunPod API key and Endpoint ID in Render settings
5. Get your public link

---

## Detailed Steps

### STEP 1: Create RunPod Account (3 minutes)

1. Open browser → Go to **https://www.runpod.io**
2. Click **"Sign Up"**
3. Enter your email and password
4. Check your email → Click verification link
5. You're in! You have **$10 free credit**

---

### STEP 2: Get Your RunPod API Key (2 minutes)

1. In RunPod dashboard, click **Settings** (gear icon ⚙️)
2. Click **"API Keys"** tab
3. Click **"Create API Key"**
4. Give it a name (e.g., "Fashion App")
5. Copy the key (starts with `rpa_...`)
6. **SAVE THIS SOMEWHERE SAFE** (you'll need it later)

---

### STEP 3: Deploy Serverless Endpoint (3 minutes)

1. In RunPod dashboard, click **"Serverless"** in left menu
2. Click **"Deploy"** or **"New Endpoint"**
3. Search for: `ComfyUI Flux` or `Flux IP-Adapter`
4. Click on the template → Click **"Deploy"**
5. Wait 1-2 minutes for deployment

---

### STEP 4: Configure GPU Workers (IMPORTANT!) (1 minute)

This enables "warm mode" - GPU stays ready for instant generation:

1. In your endpoint settings, find **"Workers"**
2. Set:
   - **Min Workers:** `1` ← This keeps GPU warm!
   - **Max Workers:** `3`
3. Click **"Save"**

**Why Min Workers = 1?**
- GPU stays "warm" (always ready)
- No cold start delay (instant generation)
- Costs a bit more but much faster

---

### STEP 5: Copy Endpoint ID (1 minute)

1. After deployment, you'll see an **Endpoint ID**
2. Looks like: `abc123def-xyz789` or similar
3. **SAVE THIS** - you'll need it too!

You now have:
- ✅ RunPod API Key (starts with `rpa_`)
- ✅ RunPod Endpoint ID

---

### STEP 6: Create GitHub Account (2 minutes)

1. Go to **https://github.com**
2. Click **"Sign up"**
3. Enter email, create password, choose username
4. Verify your email

---

### STEP 7: Download GitHub Desktop (2 minutes)

1. Go to **https://desktop.github.com**
2. Download for your computer (Windows/Mac)
3. Install it
4. Open it and sign in with your GitHub account

---

### STEP 8: Upload App to GitHub (3 minutes)

1. Open GitHub Desktop
2. Click **"File"** → **"New Repository"**
3. Fill in:
   - **Name:** `fashion-model-visualizer`
   - **Local path:** Click "Choose" and select this folder: `/mnt/okcomputer/output/app`
   - Click **"Create Repository"**
4. You'll see files listed on the left
5. At bottom, type: `Initial commit`
6. Click **"Commit to main"**
7. Click **"Publish repository"**
8. Keep it **Public** (it's free)
9. Click **"Publish Repository"**

✅ Your code is now on GitHub!

---

### STEP 9: Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Click **"Sign up with GitHub"** (easiest option)
4. Authorize Render to access your GitHub

---

### STEP 10: Deploy on Render (5 minutes)

1. In Render dashboard, click **"New"** (blue button)
2. Click **"Web Service"**
3. Find your `fashion-model-visualizer` repository
4. Click **"Connect"**
5. Fill in these settings:

| Setting | What to Enter |
|---------|---------------|
| Name | `fashion-model-visualizer` |
| Environment | `Node` |
| Region | `Oregon (US West)` |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | `Free` |

6. Click **"Advanced"** button
7. Click **"Add Environment Variable"**
   - Key: `RUNPOD_API_KEY`
   - Value: Paste your RunPod API key here (starts with `rpa_`)
8. Click **"Add Environment Variable"** again
   - Key: `RUNPOD_ENDPOINT_ID`
   - Value: Paste your RunPod Endpoint ID here
9. Click **"Create Web Service"**
10. Wait 2-3 minutes for deployment

---

### STEP 11: Get Your Public Link (Instant!)

When deployment is done, you'll see a green checkmark and a URL like:

```
https://fashion-model-visualizer.onrender.com
```

**This is YOUR app link!**

✅ Bookmark it
✅ Use it on your phone
✅ Share with your client
✅ Works from anywhere!

---

## How Much Does It Cost?

| Service | Cost |
|---------|------|
| Render Hosting | **FREE** |
| RunPod (warm mode) | ~$0.20-0.40/hour when generating |
| Per image | ~$0.006-0.01 |

**Example: Generate 15 images**
- Time: ~5 minutes
- Cost: ~$0.15-0.25

**With $10 free credit on RunPod = ~40-60 sessions FREE!**

---

## Using the App

1. Open your Render link on any device
2. Upload a product image
3. Enter a prompt (e.g., "Plus-size model wearing this lingerie, soft studio lighting")
4. Select how many variations (1, 2, 4, or 8)
5. Click Generate
6. Download your images!

---

## Need Help?

**Stuck on any step?** Just tell me which step number and I'll help!

---

## Files in This Folder

- `DEPLOY_TO_RENDER.md` - Detailed technical guide
- `QUICK_START.md` - This file (simple version)
- `README.md` - App documentation
- `render.yaml` - Render configuration (already set up)
- `server.js` - Backend code (already set up for RunPod)
- `dist/` - Built frontend (already built)

---

**You're all set! Follow the steps above and you'll have your app running in the cloud! 🎉**
