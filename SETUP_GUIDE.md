# Fashion Model Visualizer - Setup Guide

This guide will help you set up a **self-hosted ComfyUI server** for generating fashion model visualizations with **zero content restrictions**.

## Why Self-Hosted?

- **No content filters** - Full creative freedom
- **Complete privacy** - Your images never leave your server
- **Cost-effective** - Pay per hour, not per image
- **Full control** - Customize models, workflows, and settings

---

## Quick Start (Recommended)

### Option 1: RunPod (Easiest - 15 minutes)

1. **Sign up** at [runpod.io](https://www.runpod.io)
2. **Add payment method** (credit card or crypto)
3. **Go to "Templates"** and search for **"ComfyUI Flux"**
4. **Select a template** that includes:
   - Flux.1-dev
   - IP-Adapter
   - ControlNet (optional)
5. **Deploy on RTX 4090** (24GB VRAM)
6. **Wait 2-3 minutes** for deployment
7. **Copy the Proxy URL** (looks like `https://xxx-8188.proxy.runpod.net`)
8. **Set environment variable:**
   ```bash
   COMFYUI_URL=https://xxx-8188.proxy.runpod.net
   ```

### Option 2: Vast.ai (Cheapest - $0.40/hour)

1. **Sign up** at [vast.ai](https://vast.ai)
2. **Go to "Create"** → "Templates"
3. **Search for "ComfyUI"**
4. **Filter by:**
   - GPU: RTX 4090 or A100
   - Image: ComfyUI with Flux
5. **Select an instance** and deploy
6. **Copy the instance URL**
7. **Set environment variable:**
   ```bash
   COMFYUI_URL=http://your-instance-ip:8188
   ```

---

## Detailed Setup

### Step 1: Rent GPU Server

**Recommended Specs:**
- GPU: RTX 4090 (24GB) or A100 (40GB)
- RAM: 32GB+
- Storage: 100GB+ (for models)

**Platforms:**
| Platform | Price/hour | Ease | Link |
|----------|------------|------|------|
| RunPod | $0.69-1.29 | ⭐⭐⭐ Easiest | [runpod.io](https://www.runpod.io) |
| Vast.ai | $0.40-0.80 | ⭐⭐ Medium | [vast.ai](https://vast.ai) |
| Lambda Labs | $0.60-1.10 | ⭐⭐ Medium | [lambdalabs.com](https://lambdalabs.com) |

### Step 2: Install ComfyUI (If Not Using Template)

If your instance doesn't have ComfyUI pre-installed:

```bash
# SSH into your instance
ssh root@your-instance-ip

# Install dependencies
apt update && apt install -y python3-pip git wget

# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install requirements
pip install -r requirements.txt

# Start ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

### Step 3: Install Required Models

**Download these models to your ComfyUI instance:**

```bash
# SSH into your instance
ssh root@your-instance-ip
cd ComfyUI

# Create directories
mkdir -p models/checkpoints models/ipadapter models/clip_vision

# Download Flux.1-dev (23GB)
wget -O models/checkpoints/flux1-dev.safetensors \
  "https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors"

# Download IP-Adapter for SDXL (1GB)
wget -O models/ipadapter/ip-adapter_sdxl.safetensors \
  "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15.safetensors"

# Download CLIP Vision (3GB)
wget -O models/clip_vision/clip_vision_g.safetensors \
  "https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors"
```

**Alternative: Use ComfyUI-Manager (easier)**
1. Start ComfyUI
2. Open the web interface
3. Click "Manager" → "Model Manager"
4. Search and install:
   - `flux1-dev.safetensors`
   - `ip-adapter_sdxl.safetensors`

### Step 4: Install Custom Nodes

```bash
# In ComfyUI directory
cd custom_nodes

# Install ComfyUI-Manager
git clone https://github.com/ltdrdata/ComfyUI-Manager.git

# Install IP-Adapter Plus
git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git

# Restart ComfyUI
```

### Step 5: Configure Environment Variables

In your Fashion Model Visualizer app:

```bash
# Create .env file
cat > .env << EOF
COMFYUI_URL=http://your-server-ip:8188
COMFYUI_WS_URL=ws://your-server-ip:8188/ws
EOF

# Or set directly
export COMFYUI_URL=http://your-server-ip:8188
export COMFYUI_WS_URL=ws://your-server-ip:8188/ws
```

### Step 6: Test Connection

```bash
# Check if ComfyUI is running
curl http://your-server-ip:8188/system_stats

# Should return GPU info
```

---

## Usage

### Start the App

```bash
# Install dependencies
npm install

# Start the server
npm run server

# Or with environment variables
COMFYUI_URL=http://your-server:8188 npm run server
```

### Access the App

- **Frontend:** http://localhost:3001
- **ComfyUI:** http://your-server:8188

---

## Cost Estimation

| Usage | Cost |
|-------|------|
| Setup (1 hour) | $0.50-1.30 |
| Per 100 images | $0.50-1.00 |
| Monthly (8 hrs/day) | $150-300 |

**vs API Services:**
- Midjourney: $30-60/month + $0.05-0.10 per image
- DALL-E 3: $0.04-0.08 per image
- **Self-hosted: $0.005-0.01 per image**

---

## Troubleshooting

### Connection Refused
```bash
# Check if ComfyUI is running
curl http://your-server:8188/system_stats

# Check firewall
ufw allow 8188
```

### Out of Memory
```bash
# Reduce batch size or image dimensions
# Use FP8 version of Flux (smaller, faster)
```

### Slow Generation
```bash
# Use TensorRT optimization
# Enable xformers
python main.py --listen 0.0.0.0 --port 8188 --xformers
```

---

## Advanced: Custom Workflows

The included workflow uses:
- **Flux.1-dev** for high-quality generation
- **IP-Adapter** for product consistency
- **832x1216** resolution (2:3 ratio)

To customize, edit `server.js` → `createFashionWorkflow()` function.

---

## Security Notes

1. **Use HTTPS in production** - Set up reverse proxy with nginx
2. **Add authentication** - Use ComfyUI's `--auth` flag
3. **Firewall rules** - Only allow your app IP
4. **No persistent storage** - Images auto-delete after generation

---

## Support

- **ComfyUI Docs:** https://comfyanonymous.github.io/ComfyUI_examples/
- **RunPod Help:** https://docs.runpod.io/
- **Vast.ai Docs:** https://vast.ai/docs/

---

## Next Steps

1. ✅ Rent GPU server
2. ✅ Deploy ComfyUI
3. ✅ Download models
4. ✅ Configure environment variables
5. ✅ Start generating images!
