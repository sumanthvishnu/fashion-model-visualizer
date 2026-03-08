import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Sparkles, ImageIcon, X, Download, RefreshCw, CheckCircle, AlertTriangle, Loader2, ExternalLink, Copy, Server, Images, User } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ApiStatus {
  connected: boolean;
  message: string;
  setupRequired?: boolean;
}

interface SetupGuide {
  title: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    url?: string;
    action?: string;
    note?: string;
    command?: string;
    windowsCommand?: string;
  }>;
  pricing: {
    warmMode: string;
    perImage: string;
    freeCredit: string;
    note: string;
  };
  benefits: string[];
}

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [setupGuide, setSetupGuide] = useState<SetupGuide | null>(null)
  const [seed, setSeed] = useState('')
  const [numImages, setNumImages] = useState('4')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check API status on mount
  useEffect(() => {
    checkApiStatus()
    fetchSetupGuide()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      setApiStatus(data)
      if (data.setupRequired) {
        setShowSetupDialog(true)
      }
    } catch (error) {
      setApiStatus({ connected: false, message: 'Cannot reach server', setupRequired: true })
    }
  }

  const fetchSetupGuide = async () => {
    try {
      const response = await fetch('/api/setup-guide')
      const data = await response.json()
      setSetupGuide(data)
    } catch (error) {
      console.error('Failed to fetch setup guide')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
          toast.success('Model photo uploaded successfully!')
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Please upload a valid image file')
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        toast.success('Model photo uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (apiStatus?.setupRequired) {
      setShowSetupDialog(true)
      return
    }

    if (!uploadedFile && !uploadedImage) {
      toast.error('Please upload a model photo first')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please enter a prompt describing the scene')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(5)
    setGeneratedImages([])
    
    try {
      const formData = new FormData()
      if (uploadedFile) {
        formData.append('image', uploadedFile)
      }
      formData.append('description', prompt)
      formData.append('numImages', numImages)
      formData.append('mode', 'face_swap') // Tell backend this is face swap mode
      if (seed && seed !== 'random') {
        formData.append('seed', seed)
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 85) return prev
          return prev + Math.random() * 5
        })
      }, 1000)

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.setupGuide) {
          setShowSetupDialog(true)
          throw new Error(errorData.message || 'RunPod not configured')
        }
        throw new Error(errorData.error || 'Failed to generate images')
      }

      const data = await response.json()
      
      if (data.success && data.images && data.images.length > 0) {
        setGeneratedImages(data.images)
        setGenerationProgress(100)
        toast.success(`${data.images.length} image(s) generated successfully!`)
      } else {
        throw new Error('No images received')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate images')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    toast.success('Command copied!')
  }

  const clearUploadedImage = () => {
    setUploadedImage(null)
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearGeneratedImages = () => {
    setGeneratedImages([])
    setSelectedImage(null)
    setGenerationProgress(0)
  }

  const downloadImage = (imageData: string, index: number) => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = `model-visualization-${Date.now()}-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Image downloaded!')
  }

  const downloadAllImages = () => {
    generatedImages.forEach((img, index) => {
      setTimeout(() => downloadImage(img, index), index * 500)
    })
    toast.success('Downloading all images...')
  }

  const regenerate = () => {
    setSeed(Math.floor(Math.random() * 2147483647).toString())
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Fashion Model Visualizer
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-4">
            Upload a model's photo and visualize different body types, poses, and outfits. 
            Perfect for casting decisions.
          </p>
          
          {/* API Status Badge */}
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge 
              variant={apiStatus?.connected ? "default" : "destructive"}
              className={`cursor-pointer ${apiStatus?.connected ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={() => apiStatus?.setupRequired && setShowSetupDialog(true)}
            >
              {apiStatus?.connected ? (
                <><CheckCircle className="w-3 h-3 mr-1" /> RunPod Connected</>
              ) : (
                <><AlertTriangle className="w-3 h-3 mr-1" /> Setup Required</>
              )}
            </Badge>
            {apiStatus?.setupRequired && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSetupDialog(true)}
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
              >
                <Server className="w-3 h-3 mr-1" />
                Setup RunPod
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Step 1: Upload Model Photo
              </CardTitle>
              <CardDescription className="text-slate-300">
                Upload a clear photo of the model. The face will be kept consistent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center cursor-pointer hover:border-white/60 transition-colors bg-white/5"
                >
                  <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">
                    Click or drag model photo here
                  </p>
                  <p className="text-slate-400 text-sm">
                    Clear face photo for best results
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={clearUploadedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={uploadedImage}
                    alt="Uploaded model"
                    className="w-full rounded-xl object-contain max-h-96 bg-black/20"
                  />
                  <p className="text-center text-slate-400 text-sm mt-2">
                    Face will remain consistent in all generated images
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prompt & Generate Section */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Step 2: Describe the Scene
              </CardTitle>
              <CardDescription className="text-slate-300">
                Describe body type, outfit, pose, and setting. Face stays the same.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-white mb-2 block">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Plus-size body type, wearing elegant black lace lingerie, confident standing pose, soft studio lighting, professional fashion photography..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-2">Prompt Tips:</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• <strong>Body type:</strong> plus-size, curvy, athletic, slim</li>
                  <li>• <strong>Outfit:</strong> red lace bra, black silk robe, etc.</li>
                  <li>• <strong>Pose:</strong> standing, sitting, side profile, full body</li>
                  <li>• <strong>Setting:</strong> studio, bedroom, outdoor, plain background</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numImages" className="text-white mb-2 block">
                    Variations
                  </Label>
                  <Select value={numImages} onValueChange={setNumImages}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="1" className="text-white">1 Image</SelectItem>
                      <SelectItem value="2" className="text-white">2 Images</SelectItem>
                      <SelectItem value="4" className="text-white">4 Images</SelectItem>
                      <SelectItem value="8" className="text-white">8 Images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="seed" className="text-white mb-2 block">
                    Seed (Optional)
                  </Label>
                  <Input
                    id="seed"
                    type="number"
                    placeholder="Random"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Generating {numImages} variation(s)...</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-slate-400">Keeping face consistent • 15-45 seconds</p>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating {numImages} Variation(s)...
                  </>
                ) : (
                  <>
                    <Images className="w-5 h-5 mr-2" />
                    {apiStatus?.connected ? `Generate ${numImages} Variation${parseInt(numImages) > 1 ? 's' : ''}` : 'Setup Required'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Images Section */}
        {generatedImages.length > 0 && (
          <Card className="mt-6 bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Generated Results ({generatedImages.length} images)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={regenerate}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllImages}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearGeneratedImages}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {generatedImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Generated ${index + 1}`}
                      className="w-full aspect-[2/3] object-cover rounded-xl hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Click to enlarge</span>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Selected Image</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadImage(selectedImage, generatedImages.indexOf(selectedImage))}
                      className="border-white/30 text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download This
                    </Button>
                  </div>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full max-h-[600px] object-contain rounded-xl"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="mt-6 bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">1. Upload Model Photo</h4>
                <p className="text-slate-300">Upload a clear photo of your model. The AI will keep their face consistent across all generated images.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">2. Describe the Scene</h4>
                <p className="text-slate-300">Specify body type, outfit, pose, and setting. The AI will generate variations based on your description.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">3. Review & Download</h4>
                <p className="text-slate-300">Compare different variations and download the ones that work best for your casting decision.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Guide Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Server className="w-6 h-6 text-yellow-500" />
              Setup RunPod Serverless
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Set up RunPod to enable face-consistent model visualization.
            </DialogDescription>
          </DialogHeader>
          
          {setupGuide && (
            <div className="space-y-6 mt-4">
              {/* Benefits */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Why RunPod?</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  {setupGuide.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Pricing</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Warm mode:</span>
                    <span className="text-green-400">{setupGuide.pricing.warmMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Per image:</span>
                    <span className="text-green-400">{setupGuide.pricing.perImage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Free credit:</span>
                    <span className="text-yellow-400">{setupGuide.pricing.freeCredit}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{setupGuide.pricing.note}</p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Setup Steps:</h4>
                {setupGuide.steps.map((step) => (
                  <div key={step.step} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-white mb-1">{step.title}</h5>
                        <p className="text-sm text-slate-400 mb-2">{step.description}</p>
                        
                        {step.note && (
                          <p className="text-xs text-yellow-400 mb-2">{step.note}</p>
                        )}
                        
                        {step.url && (
                          <a
                            href={step.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors"
                          >
                            {step.action}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {step.command && (
                          <div className="mt-3">
                            <Tabs defaultValue="mac" className="w-full">
                              <TabsList className="bg-white/10">
                                <TabsTrigger value="mac" className="text-white data-[state=active]:bg-white/20">Mac/Linux</TabsTrigger>
                                <TabsTrigger value="windows" className="text-white data-[state=active]:bg-white/20">Windows</TabsTrigger>
                              </TabsList>
                              <TabsContent value="mac" className="mt-2">
                                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-green-400 flex justify-between items-center">
                                  <code>{step.command}</code>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => copyCommand(step.command!)}
                                    className="h-6 px-2 text-slate-400 hover:text-white"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TabsContent>
                              <TabsContent value="windows" className="mt-2">
                                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-green-400 flex justify-between items-center">
                                  <code>{step.windowsCommand}</code>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => copyCommand(step.windowsCommand!)}
                                    className="h-6 px-2 text-slate-400 hover:text-white"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowSetupDialog(false)}
              className="border-white/30 text-white hover:bg-white/20"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                checkApiStatus()
                setShowSetupDialog(false)
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
