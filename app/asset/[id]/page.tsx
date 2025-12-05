import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DownloadButton } from "@/components/download-button"
import type { Asset } from "@/lib/types"
import {
  Download,
  Star,
  Eye,
  User,
  Tag,
  Heart,
  Share2,
  Flag,
  CheckCircle,
  Zap,
  Clock,
  Shield,
  ExternalLink,
  Coins,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

async function getAsset(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/assets/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AssetPage({ params }: { params: { id: string } }) {
  const { id } = params
  const asset = await getAsset(id)
  if (!asset) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/${asset.category === "mlo" ? "mlo" : asset.category}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {asset.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{asset.title}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-2xl glass">
                <Image
                  src={asset.image || "/placeholder.svg?height=400&width=700&query=gaming asset"}
                  alt={asset.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-0">
                      <Zap className="h-3 w-3 mr-1 text-primary" />
                      {asset.category.toUpperCase()}
                    </Badge>
                    <Badge
                      className={
                        asset.price === "free"
                          ? "bg-success text-success-foreground"
                          : "bg-primary text-primary-foreground glow-sm"
                      }
                    >
                      {asset.price === "free" ? "FREE" : "PREMIUM"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{asset.title}</h1>
                    <p className="text-muted-foreground">{asset.description}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 uppercase">
                    {asset.framework}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 py-4 border-y border-border/50">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">{asset.downloads.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="font-semibold text-foreground">{asset.rating}</span>
                    <span className="text-sm text-muted-foreground">rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{(asset.downloads * 3).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {asset.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="gap-1 rounded-lg bg-secondary/50">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Description
                </h2>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                  <p>{asset.description}</p>
                  <p className="mt-4">
                    This resource has been tested and verified to work with the latest FiveM builds. It supports both
                    ESX and QBCore frameworks out of the box with minimal configuration required.
                  </p>
                  <h3 className="text-foreground mt-6 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Features
                  </h3>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Easy installation and configuration",
                      "Optimized performance (0.0ms idle)",
                      "Multi-language support",
                      "Active support and updates",
                      "Well documented code",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Download Card */}
              <div className="glass rounded-2xl p-6 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <Badge variant="secondary" className="rounded-lg">
                    {asset.version}
                  </Badge>
                </div>
                {asset.price === "premium" && asset.coinPrice && (
                  <div className="mb-4 p-3 rounded-xl bg-warning/10 border border-warning/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-lg font-bold text-warning flex items-center gap-1">
                        <img src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif" alt="Coins" className="h-5 w-5" />
                        {asset.coinPrice}
                      </span>
                    </div>
                  </div>
                )}
                <DownloadButton assetId={asset.id} price={asset.price} coinPrice={asset.coinPrice} />
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 rounded-xl bg-transparent h-10">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 rounded-xl bg-transparent h-10">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl bg-transparent h-10 w-10">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {asset.price === "premium" ? "Premium membership required" : "Free for all members"}
                </p>
              </div>

              {/* Author */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Author
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center">
                    <User className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{asset.author}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3 text-success" />
                      Verified Creator
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Information</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Category", value: asset.category, capitalize: true },
                    { label: "Framework", value: asset.framework, uppercase: true },
                    { label: "Released", value: new Date(asset.createdAt).toLocaleDateString() },
                    { label: "Last Updated", value: "2 days ago" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span
                        className={`text-foreground font-medium ${item.capitalize ? "capitalize" : ""} ${item.uppercase ? "uppercase" : ""}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="glass rounded-2xl p-5 border-accent/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Need Help?</p>
                    <p className="text-sm text-muted-foreground">Get support on Discord</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl bg-transparent gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
