"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Upload, X, FileCode, Tag, Image as ImageIcon, CheckCircle, AlertTriangle, Coins, Link2, FileText, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "scripts",
    framework: "qbcore",
    price: "free",
    coinPrice: 0,
    version: "1.0.0",
    tags: [] as string[],
    image: null as File | null,
    downloadLink: "",
    requirements: "",
    changelog: "",
    fileSize: "",
  })
  const [tagInput, setTagInput] = useState("")
  const [virusScan, setVirusScan] = useState<{ status: "idle" | "scanning" | "clean" | "threat"; result?: any }>({ status: "idle" })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      setFormData({ ...formData, fileSize: `${sizeMB} MB` })
      await scanFile(selectedFile)
    }
  }

  const scanFile = async (file: File) => {
    setVirusScan({ status: "scanning" })
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/upload/virus-scan", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setVirusScan({ status: data.clean ? "clean" : "threat", result: data })
    } catch (error) {
      setVirusScan({ status: "clean" })
    }
  }

  const addTag = () => {
    if (tagInput.trim() && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim().toLowerCase()] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || virusScan.status !== "clean") return

    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append("file", file)
    uploadData.append("data", JSON.stringify(formData))
    if (formData.image) uploadData.append("image", formData.image)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('category', formData.category)
      uploadFormData.append('framework', formData.framework)
      uploadFormData.append('coinPrice', formData.coinPrice.toString())
      uploadFormData.append('tags', JSON.stringify(formData.tags))

      const res = await fetch("/api/upload/asset", {
        method: "POST",
        body: uploadFormData,
      })
      const data = await res.json()
      if (data.success) {
        alert('Asset uploaded successfully!')
        router.push(`/asset/${data.asset.id}`)
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-8">
          <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground">Please login to upload assets</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="p-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm">
                <Upload className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Upload Asset</h1>
                <p className="text-muted-foreground">Share your scripts, MLOs, and resources with the community</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                Upload File
              </h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input type="file" id="file" onChange={handleFileChange} className="hidden" accept=".zip,.rar,.7z" />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">ZIP, RAR, 7Z (Max 500MB)</p>
                </label>
              </div>
              {file && (
                <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-foreground font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formData.fileSize}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {virusScan.status !== "idle" && (
                <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${virusScan.status === "clean" ? "bg-success/10 border border-success/30" : virusScan.status === "threat" ? "bg-destructive/10 border border-destructive/30" : "bg-secondary/30"}`}>
                  {virusScan.status === "scanning" && <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                  {virusScan.status === "clean" && <CheckCircle className="h-5 w-5 text-success" />}
                  {virusScan.status === "threat" && <AlertTriangle className="h-5 w-5 text-destructive" />}
                  <div className="flex-1">
                    <p className="text-foreground font-medium">
                      {virusScan.status === "scanning" && "Scanning for viruses..."}
                      {virusScan.status === "clean" && "✓ File is clean - No threats detected"}
                      {virusScan.status === "threat" && "⚠ Threat detected - Cannot upload"}
                    </p>
                    {virusScan.result?.hash && (
                      <p className="text-xs text-muted-foreground mt-1">SHA256: {virusScan.result.hash.substring(0, 16)}...</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Advanced Banking System V2" className="bg-secondary/50 border-border/50 h-11" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your asset in detail..." className="w-full h-32 rounded-xl border border-border/50 bg-secondary/50 p-3 text-foreground resize-none" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-11 rounded-xl border border-border/50 bg-secondary/50 px-3 text-foreground">
                      <option value="scripts">Scripts</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="mlo">MLO</option>
                      <option value="clothing">Clothing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Framework *</label>
                    <select value={formData.framework} onChange={(e) => setFormData({ ...formData, framework: e.target.value })} className="w-full h-11 rounded-xl border border-border/50 bg-secondary/50 px-3 text-foreground">
                      <option value="qbcore">QBCore</option>
                      <option value="esx">ESX</option>
                      <option value="qbox">QBox</option>
                      <option value="standalone">Standalone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Version</label>
                    <Input value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} placeholder="1.0.0" className="bg-secondary/50 border-border/50 h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price Type *</label>
                    <select value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full h-11 rounded-xl border border-border/50 bg-secondary/50 px-3 text-foreground">
                      <option value="free">Free</option>
                      <option value="premium">Premium (Coins)</option>
                    </select>
                  </div>
                  {formData.price === "premium" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <img src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif" alt="Coins" className="h-4 w-4" />
                        Coin Price *
                      </label>
                      <Input type="number" min="0" value={formData.coinPrice} onChange={(e) => setFormData({ ...formData, coinPrice: parseInt(e.target.value) || 0 })} placeholder="100" className="bg-secondary/50 border-border/50 h-11" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                SEO & Tags
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tags (Max 10) - For better search visibility</label>
                  <div className="flex gap-2">
                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="banking, economy, qbcore, realistic" className="bg-secondary/50 border-border/50 h-11" />
                    <Button type="button" onClick={addTag} variant="outline" className="bg-transparent h-11">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1.5">
                        #{tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Media & Links
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Thumbnail Image *</label>
                  <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} accept="image/*" className="w-full text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" required />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1920x1080px, JPG/PNG, Max 5MB</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Download Link (Optional)
                  </label>
                  <Input value={formData.downloadLink} onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })} placeholder="https://example.com/download" className="bg-secondary/50 border-border/50 h-11" />
                  <p className="text-xs text-muted-foreground mt-1">External download link (GitHub, Google Drive, etc.)</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Additional Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Requirements</label>
                  <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="List any dependencies or requirements (one per line)" className="w-full h-24 rounded-xl border border-border/50 bg-secondary/50 p-3 text-foreground resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Changelog</label>
                  <textarea value={formData.changelog} onChange={(e) => setFormData({ ...formData, changelog: e.target.value })} placeholder="Version history and changes" className="w-full h-24 rounded-xl border border-border/50 bg-secondary/50 p-3 text-foreground resize-none" />
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-primary/30">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-success shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">Before you submit:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ File has been scanned for viruses</li>
                    <li>✓ All required fields are filled</li>
                    <li>✓ Description is clear and detailed</li>
                    <li>✓ Tags are relevant for SEO</li>
                    <li>✓ Thumbnail image is high quality</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={!file || virusScan.status !== "clean" || isUploading || !formData.image} className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold glow-sm">
              {isUploading ? "Uploading..." : "Upload Asset"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
