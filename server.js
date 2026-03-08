const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// RunPod Configuration
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY || '';
const RUNPOD_ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID || '';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('dist'));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ensure temp directory exists
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// ============================================
// RUNPOD SERVERLESS API FUNCTIONS
// ============================================

// Call RunPod Serverless API for image generation
async function callRunPodAPI(imageBase64, prompt, numImages = 1, seed = null) {
  if (!RUNPOD_API_KEY) {
    throw new Error('RunPod API key not configured');
  }
  if (!RUNPOD_ENDPOINT_ID) {
    throw new Error('RunPod Endpoint ID not configured');
  }

  const endpointUrl = `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/run`;
  const actualSeed = seed || Math.floor(Math.random() * 2147483647);

  // Build ComfyUI workflow
  const workflow = {
    "1": {
      "inputs": { "ckpt_name": "flux1-dev.safetensors" },
      "class_type": "CheckpointLoaderSimple"
    },
    "2": {
      "inputs": { "text": prompt, "clip": ["1", 1] },
      "class_type": "CLIPTextEncode"
    },
    "3": {
      "inputs": { "text": "blurry, low quality, distorted, ugly, bad anatomy", "clip": ["1", 1] },
      "class_type": "CLIPTextEncode"
    },
    "4": {
      "inputs": { "width": 832, "height": 1216, "batch_size": 1 },
      "class_type": "EmptyLatentImage"
    },
    "5": {
      "inputs": {
        "seed": actualSeed,
        "steps": 28,
        "cfg": 3.5,
        "sampler_name": "euler",
        "scheduler": "simple",
        "denoise": 1,
        "model": ["1", 0],
        "positive": ["2", 0],
        "negative": ["3", 0],
        "latent_image": ["4", 0]
      },
      "class_type": "KSampler"
    },
    "6": {
      "inputs": { "samples": ["5", 0], "vae": ["1", 2] },
      "class_type": "VAEDecode"
    },
    "7": {
      "inputs": { "filename_prefix": "output", "images": ["6", 0] },
      "class_type": "SaveImage"
    }
  };

  // Add image loading node if image provided
  let inputs = {};
  if (imageBase64) {
    inputs.images = [{ "name": "input.png", "image": imageBase64 }];
  }

  console.log('Calling RunPod API...');
  console.log('Endpoint:', endpointUrl);

  // Step 1: Submit the job
  const submitResponse = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RUNPOD_API_KEY}`
    },
    body: JSON.stringify({ input: { workflow, ...inputs } })
  });

  if (!submitResponse.ok) {
    const errorText = await submitResponse.text();
    throw new Error(`RunPod API error: ${errorText}`);
  }

  const submitResult = await submitResponse.json();
  const jobId = submitResult.id;
  
  console.log('Job submitted:', jobId);

  // Step 2: Poll for results
  const statusUrl = `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/status/${jobId}`;
  
  let attempts = 0;
  const maxAttempts = 90;
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(statusUrl, {
      headers: { 'Authorization': `Bearer ${RUNPOD_API_KEY}` }
    });
    
    if (!statusResponse.ok) {
      throw new Error('Failed to check job status');
    }
    
    const statusResult = await statusResponse.json();
    console.log('Status:', statusResult.status);
    
    if (statusResult.status === 'COMPLETED') {
      // Extract images from output
      const images = [];
      if (statusResult.output) {
        const outputs = Array.isArray(statusResult.output) ? statusResult.output : [statusResult.output];
        for (const out of outputs) {
          if (out.images) {
            for (const img of out.images) {
              if (img.image || img.url) {
                images.push(img.image || img.url);
              }
            }
          }
        }
      }
      return { images };
    } else if (statusResult.status === 'FAILED') {
      throw new Error(statusResult.error || 'Job failed');
    }
    
    attempts++;
  }
  
  throw new Error('Generation timeout');
}

// Check RunPod API status
app.get('/api/status', async (req, res) => {
  const hasKey = !!RUNPOD_API_KEY;
  const hasEndpoint = !!RUNPOD_ENDPOINT_ID;
  
  if (!hasKey || !hasEndpoint) {
    return res.json({
      connected: false,
      message: hasKey ? 'Endpoint ID not configured' : 'API key not configured',
      setupRequired: true
    });
  }

  try {
    // Test with a simple health check
    const response = await fetch(`https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/health`, {
      headers: { 'Authorization': `Bearer ${RUNPOD_API_KEY}` }
    });
    
    if (response.ok) {
      res.json({
        connected: true,
        message: 'RunPod API connected',
        setupRequired: false
      });
    } else {
      const error = await response.text();
      res.json({
        connected: false,
        message: 'Invalid API key or Endpoint ID',
        setupRequired: true,
        error: error
      });
    }
  } catch (error) {
    res.json({
      connected: false,
      message: 'Cannot reach RunPod API',
      setupRequired: true,
      error: error.message
    });
  }
});

// Generate image endpoint
app.post('/api/generate-image', upload.single('image'), async (req, res) => {
  try {
    // Check if API key and endpoint are set
    if (!RUNPOD_API_KEY) {
      return res.status(503).json({
        error: 'API key not configured',
        message: 'Please add your RunPod API key',
        setupGuide: '/api/setup-guide'
      });
    }
    if (!RUNPOD_ENDPOINT_ID) {
      return res.status(503).json({
        error: 'Endpoint ID not configured',
        message: 'Please add your RunPod Endpoint ID',
        setupGuide: '/api/setup-guide'
      });
    }

    const { description, numImages = 1, seed } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const numImagesInt = parseInt(numImages) || 1;
    console.log(`Generation request: ${numImagesInt} image(s)`);
    console.log('Prompt:', description);

    let imageBase64 = null;

    // If product image uploaded, convert to base64
    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      console.log('Image processed');
    }

    // Call RunPod API
    console.log('Calling RunPod Serverless API...');
    const result = await callRunPodAPI(
      imageBase64,
      description,
      numImagesInt,
      seed && seed !== 'random' ? parseInt(seed) : null
    );

    console.log('Generation complete!');

    // Process the result
    if (result && result.images && result.images.length > 0) {
      res.json({
        success: true,
        images: result.images,
        count: result.images.length
      });
    } else {
      throw new Error('No images generated');
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      message: error.message
    });
  }
});

// Setup guide endpoint
app.get('/api/setup-guide', (req, res) => {
  res.json({
    title: 'Setup RunPod Serverless (10 Minutes)',
    steps: [
      {
        step: 1,
        title: 'Create RunPod Account',
        description: 'Sign up at runpod.io - get $10 free credit to start',
        url: 'https://www.runpod.io/console/signup',
        action: 'Sign Up'
      },
      {
        step: 2,
        title: 'Get Your API Key',
        description: 'Go to Settings → API Keys → Create New Key',
        url: 'https://www.runpod.io/console/user/settings',
        action: 'Get API Key'
      },
      {
        step: 3,
        title: 'Deploy Serverless Endpoint',
        description: 'Go to Serverless → Deploy a template → Search for ComfyUI Flux',
        url: 'https://www.runpod.io/console/serverless',
        action: 'Deploy Endpoint'
      },
      {
        step: 4,
        title: 'Configure GPU Workers',
        description: 'Set Min/Max Workers. For warm mode: Min=1, Max=3',
        note: 'Min Workers = 1 keeps GPU warm (faster generation)'
      },
      {
        step: 5,
        title: 'Copy Endpoint ID',
        description: 'After deployment, copy the Endpoint ID (looks like "abc123def-xyz")',
        note: 'You will need both API Key and Endpoint ID'
      },
      {
        step: 6,
        title: 'Add to Environment Variables',
        description: 'Set both RUNPOD_API_KEY and RUNPOD_ENDPOINT_ID',
        command: 'export RUNPOD_API_KEY=your_key && export RUNPOD_ENDPOINT_ID=your_endpoint',
        windowsCommand: 'set RUNPOD_API_KEY=your_key && set RUNPOD_ENDPOINT_ID=your_endpoint'
      }
    ],
    pricing: {
      warmMode: '~$0.20-0.40/hour (GPU time)',
      perImage: '~$0.006-0.01 per image',
      freeCredit: '$10 free credit on signup',
      note: 'Set Min Workers=1 for warm mode (no cold start delays)'
    },
    benefits: [
      'Zero content restrictions (recommended by Banana)',
      'Your own isolated GPU instance',
      'Full privacy - images not shared',
      'Warm mode = instant generation',
      'ComfyUI with Flux.1 + IP-Adapter',
      'Most "Banana-like" experience'
    ],
    comparison: {
      title: 'Why RunPod?',
      text: 'Banana.dev themselves recommended RunPod Serverless as the easiest migration path. Same workflow, similar pricing, minimal restrictions.'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    runpodConfigured: !!(RUNPOD_API_KEY && RUNPOD_ENDPOINT_ID)
  });
});

// Serve the React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Fashion Model Visualizer Server                    ║
║                                                              ║
║  Frontend: http://localhost:${PORT}                           ║
║                                                              ║
║  Status: ${RUNPOD_API_KEY && RUNPOD_ENDPOINT_ID ? '✅ RunPod Configured' : '⚠️  Setup Required'}
║                                                              ║
║  To get started:                                             ║
║  1. Sign up at https://www.runpod.io                         ║
║  2. Get API key from Settings                                ║
║  3. Deploy ComfyUI Flux serverless endpoint                  ║
║  4. Set Min Workers=1 for warm mode                          ║
║  5. Copy Endpoint ID                                         ║
║  6. Set environment variables                                ║
║  7. Restart this server                                      ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
