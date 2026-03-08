# Fashion Model Visualizer

AI-powered tool for visualizing lingerie products on models. Generate multiple variations instantly with zero content restrictions.

**Powered by RunPod Serverless** (recommended by Banana.dev as the best migration alternative)

---

## Features

- ✅ **Upload product image** - Drag & drop or click to select
- ✅ **One simple prompt** - No positive/negative prompts, just describe what you want
- ✅ **Generate multiple variations** - Choose 1, 2, 4, or 8 images at once
- ✅ **AI automatically varies** - Poses, angles, lighting, expressions
- ✅ **Download individually or all at once**
- ✅ **Zero content restrictions** - Full creative freedom
- ✅ **Warm mode** - No cold start delays
- ✅ **Private** - Your images stay in your isolated instance

---

## How It Works

### Simple 3-Step Process:

1. **Upload** your lingerie product image
2. **Enter one prompt** describing the model and scene
3. **Select how many variations** you want (1/2/4/8)
4. **Click Generate** - Get all images at once!

### Example Prompt:
```
Plus-size model wearing this lingerie, confident pose, soft studio lighting, elegant professional fashion photography
```

**AI will automatically create variations with:**
- Different poses (standing, sitting, leaning)
- Different angles (front, side, 3/4 view)
- Different lighting (soft, dramatic, natural)
- Different expressions (confident, playful, serious)

---

## Why RunPod Serverless?

Banana.dev shut down their serverless GPU platform on March 31st, 2024. They **officially recommended RunPod Serverless** as the best alternative:

| Feature | RunPod Serverless |
|---------|-------------------|
| **Setup** | Easy (most "banana-like") |
| **Restrictions** | **Minimal** |
| **Pricing** | ~$0.20-0.40/hour warm mode |
| **Cold start** | Yes (use warm mode to avoid) |
| **Privacy** | High (isolated GPU instance) |

---

## Setup (10 Minutes)

### Step 1: Create RunPod Account
1. Go to **runpod.io** → Click "Sign Up"
2. Verify your email
3. You get **$10 free credit** to start

### Step 2: Get Your API Key
1. In RunPod dashboard, click **Settings** (gear icon)
2. Click **API Keys**
3. Click **"Create API Key"**
4. Copy the key (starts with `rpa_...`)
5. **SAVE THIS** - you'll need it

### Step 3: Deploy Serverless Endpoint
1. In RunPod dashboard, click **"Serverless"**
2. Click **"Deploy"** or **"New Endpoint"**
3. Search for template: `ComfyUI Flux` or `Flux IP-Adapter`
4. Click **Deploy**

### Step 4: Configure GPU Workers (IMPORTANT!)
This enables "warm mode" for instant generation:

| Setting | Value |
|---------|-------|
| **Min Workers** | `1` (keeps GPU warm) |
| **Max Workers** | `3` (handles multiple requests) |

Click **Save**

### Step 5: Copy Endpoint ID
1. After deployment, you'll see an **Endpoint ID**
2. Looks like: `abc123def-xyz789`
3. **SAVE THIS** - you'll need it too

### Step 6: Add to Environment Variables

**Mac/Linux:**
```bash
export RUNPOD_API_KEY=rpa_your_key_here
export RUNPOD_ENDPOINT_ID=your_endpoint_id_here
```

**Windows:**
```cmd
set RUNPOD_API_KEY=rpa_your_key_here
set RUNPOD_ENDPOINT_ID=your_endpoint_id_here
```

### Step 7: Start the App
```bash
cd /mnt/okcomputer/output/app
npm run server
```

Open **http://localhost:3001**

---

## Cost

| Service | Cost |
|---------|------|
| **Warm mode GPU** | ~$0.20-0.40/hour |
| **Per image** | ~$0.006-0.01 |
| **15-20 images session** | ~$0.15-0.30 |

**With $10 free credit = ~30-60 sessions FREE!**

### Cost Comparison

| Provider | Per Image | Restrictions | Setup |
|----------|-----------|--------------|-------|
| **RunPod Serverless** | ~$0.006-0.01 | **Minimal** | Medium |
| Replicate | ~$0.025 | Some | Easy |
| Self-hosted | ~$0.001 | None | Hard |

---

## Interface

```
┌─────────────────────────────────────────────────┐
│  Fashion Model Visualizer                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Upload Product Image]                         │
│  ┌─────────────────────────┐                   │
│  │  Drag image here        │                   │
│  │  or click to select     │                   │
│  └─────────────────────────┘                   │
│                                                 │
│  [Enter Prompt]                                 │
│  ┌─────────────────────────┐                   │
│  │ Plus-size model wearing │                   │
│  │ this lingerie, soft     │                   │
│  │ studio lighting...      │                   │
│  └─────────────────────────┘                   │
│                                                 │
│  Number of Variations: [ 4 ▼]                  │
│  Seed (optional): [________]                    │
│                                                 │
│  [ Generate 4 Variations ]                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Example Workflows

### Workflow 1: Single Product, Multiple Poses
1. Upload: `red_lace_bra.jpg`
2. Prompt: `Plus-size model wearing this red lace bra, confident pose, soft studio lighting, professional fashion photography`
3. Select: **8 variations**
4. Result: 8 different poses/angles of the same product

### Workflow 2: Find the Perfect Shot
1. Upload: `black_panty_set.jpg`
2. Prompt: `Curvy model in elegant black lingerie, luxury bedroom setting, warm golden lighting`
3. Select: **4 variations**
4. Pick the best one for your ad

### Workflow 3: Casting Decision
1. Upload: `new_collection_piece.jpg`
2. Prompt: `Full-figured model, editorial fashion style, dramatic rim lighting, black background`
3. Select: **8 variations**
4. Show client options, pick model look

---

## Tips for Best Results

1. **Upload clear product images** - Well-lit, centered, no background clutter
2. **Be specific about model type** - "Plus-size", "curvy", "full-figured"
3. **Describe lighting** - "soft studio", "dramatic", "natural", "golden hour"
4. **Mention mood** - "elegant", "confident", "playful", "sensual"
5. **Generate 4-8 variations** - More options to choose from
6. **Use same seed** - For similar variations with minor changes

---

## Troubleshooting

**"Setup Required" message?**
→ Your RunPod API key or Endpoint ID isn't set. Follow the setup steps above.

**Images not generating?**
→ Check that your RunPod endpoint is active (green status in dashboard).

**Slow generation?**
→ Make sure Min Workers = 1 in your endpoint settings (warm mode).

**Need help?**
→ RunPod Discord: https://discord.gg/runpod
→ Email: support@runpod.io

---

## Migration from Banana.dev

If you were using Banana.dev before they shut down:

| What to Change | Banana | RunPod |
|----------------|--------|--------|
| API Key | `banana_...` | `rpa_...` |
| Environment Var | `BANANA_API_KEY` | `RUNPOD_API_KEY` |
| Extra Var | `BANANA_MODEL_KEY` | `RUNPOD_ENDPOINT_ID` |
| Pricing | ~$0.10/hour | ~$0.20-0.40/hour |

The app interface and workflow stay exactly the same!

---

## Files

- `src/App.tsx` - Frontend code
- `server.js` - RunPod API backend
- `dist/` - Built app (deployed)
- `QUICK_START.md` - Simple step-by-step guide

---

## Cost Comparison

| Service | Cost per Image | Restrictions | Privacy |
|---------|----------------|--------------|---------|
| Midjourney | $0.05-0.10 | High | Low |
| DALL-E 3 | $0.04-0.08 | High | Low |
| Replicate | $0.025 | Medium | Medium |
| **RunPod Serverless** | **$0.006-0.01** | **Minimal** | **High** |

**RunPod is 5-10x cheaper with minimal restrictions!**

---

Built for your lingerie business! 🎉
