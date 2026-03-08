# Fashion Model Visualizer

AI-powered tool for visualizing models with different body types, poses, and outfits while keeping the face consistent. Perfect for casting decisions in lingerie/fashion photography.

---

## How It Works

1. **Upload a model's photo** - The AI will keep their face consistent
2. **Describe what you want** - Body type, outfit, pose, setting
3. **Generate variations** - See the same model in different scenarios

### Example Use Cases:

- **Casting Decision**: Upload a lean model's photo, visualize how they'd look as plus-size
- **Outfit Testing**: Same model, different lingerie styles
- **Pose Variations**: Same model, different poses and angles
- **Setting Preview**: Same model, different backgrounds (studio, bedroom, etc.)

---

## Features

- ✅ **Face consistency** - Same model face across all variations
- ✅ **Body type changes** - Visualize plus-size, curvy, athletic, slim
- ✅ **Outfit variations** - Different lingerie, robes, styles
- ✅ **Pose control** - Standing, sitting, side profile, full body
- ✅ **Setting changes** - Studio, bedroom, outdoor, plain background
- ✅ **Generate multiple variations** - 1, 2, 4, or 8 images at once
- ✅ **Download individually or all at once**
- ✅ **Zero content restrictions** - Full creative freedom
- ✅ **Warm mode** - No cold start delays

---

## Example Prompts

### Body Type Testing:
```
Plus-size body type, wearing elegant black lace lingerie, confident standing pose, soft studio lighting, professional fashion photography
```

### Outfit Variations:
```
Same model, wearing red silk robe, sitting on velvet chair, warm golden lighting, luxury bedroom setting
```

### Pose Testing:
```
Side profile pose, wearing white lace bra and panties, dramatic rim lighting, black background, high fashion editorial style
```

### Setting Preview:
```
Full body shot, wearing nude-colored lingerie set, natural window lighting, minimalist white studio background
```

---

## Setup (10 Minutes)

### Step 1: Create RunPod Account
1. Go to **runpod.io** → Click "Sign Up"
2. Verify your email
3. You get **$10 free credit** to start

### Step 2: Get Your API Key
1. In RunPod dashboard, click **Settings** (gear icon)
2. Click **"API Keys"**
3. Click **"Create API Key"**
4. Copy the key (starts with `rpa_`)

### Step 3: Deploy Serverless Endpoint
1. In RunPod dashboard, click **"Serverless"**
2. Click **"New Endpoint"**
3. Search for: `ComfyUI Flux` or `Flux IP-Adapter`
4. Click **Deploy**

### Step 4: Configure GPU Workers (IMPORTANT!)
Set for warm mode (instant generation):
- **Min Workers**: `1`
- **Max Workers**: `3`
- Click **Save**

### Step 5: Copy Endpoint ID
1. After deployment, copy the **Endpoint ID**
2. Looks like: `abc123def-xyz789`

### Step 6: Deploy App to Render
Follow the deployment guide in `QUICK_START.md`

---

## Cost

| Service | Cost |
|---------|------|
| **Warm mode GPU** | ~$0.20-0.40/hour |
| **Per image** | ~$0.006-0.01 |
| **15-20 variations session** | ~$0.15-0.30 |

**With $10 free credit = ~30-60 sessions FREE!**

---

## Why RunPod Serverless?

- ✅ **Zero content restrictions** - Your own GPU instance
- ✅ **Face consistency** - Using IP-Adapter FaceID technology
- ✅ **Full privacy** - Images not shared with anyone
- ✅ **Warm mode** - Set Min Workers=1 for instant generation
- ✅ **ComfyUI with Flux.1** - State-of-the-art image quality

---

## Interface

```
┌─────────────────────────────────────────────────┐
│  Fashion Model Visualizer                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Upload Model Photo]                           │
│  ┌─────────────────────────┐                   │
│  │  Drag model photo here  │                   │
│  │  Face will stay same    │                   │
│  └─────────────────────────┘                   │
│                                                 │
│  [Describe the Scene]                           │
│  ┌─────────────────────────┐                   │
│  │ Plus-size body type,    │                   │
│  │ wearing red lace...     │                   │
│  └─────────────────────────┘                   │
│                                                 │
│  Variations: [ 4 ▼]                            │
│                                                 │
│  [ Generate 4 Variations ]                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Prompt Tips

| Element | Examples |
|---------|----------|
| **Body Type** | plus-size, curvy, athletic, slim, voluptuous |
| **Outfit** | red lace bra, black silk robe, white lingerie set |
| **Pose** | standing, sitting, side profile, full body, close-up |
| **Lighting** | soft studio, dramatic, natural, golden hour, rim lighting |
| **Setting** | studio, bedroom, outdoor, plain background, luxury interior |
| **Mood** | elegant, confident, playful, sensual, professional |

---

## Troubleshooting

**"Setup Required" message?**
→ Your RunPod API key or Endpoint ID isn't set.

**Face not consistent?**
→ Upload a clearer face photo (front-facing, good lighting)

**Slow generation?**
→ Make sure Min Workers = 1 in your RunPod endpoint settings.

**Need help?**
→ RunPod Discord: https://discord.gg/runpod

---

## Files

- `src/App.tsx` - Frontend code
- `server.js` - RunPod API backend
- `dist/` - Built app
- `QUICK_START.md` - Deployment guide

---

Built for fashion casting decisions! 🎉
