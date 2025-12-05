"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SponsorBanner } from "@/components/sponsor-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { useStatsStore } from "@/lib/store"
import { FORUM_CATEGORIES } from "@/lib/constants"
import {
  MessageSquare,
  Plus,
  Pin,
  Eye,
  Heart,
  Megaphone,
  HelpCircle,
  Code,
  Star,
  MessageCircle,
  Users,
  TrendingUp,
  Flame,
  Clock,
  Crown,
  Shield,
  Search,
  Filter,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  megaphone: Megaphone,
  "message-circle": MessageCircle,
  "help-circle": HelpCircle,
  code: Code,
  star: Star,
  "shopping-bag": ShoppingBag,
}

interface ForumThread {
  id: string
  title: string
  category: string
  author: {
    username: string
    avatar: string
    membership: "free" | "vip" | "admin"
  }
  replies: number
  likes: number
  views: number
  isPinned: boolean
  createdAt: string
}

export default function ForumPage() {
  const { user } = useAuth()
  const { stats } = useStatsStore()
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/forum/threads")
        const data = await res.json()
        if (data.threads) {
          setThreads(data.threads.map((t: any) => ({
            id: t.id,
            title: t.title,
            category: t.categoryId,
            author: {
              username: t.author.username,
              avatar: t.author.avatar || "/placeholder-user.jpg",
              membership: t.author.membership || "free"
            },
            replies: t.replies?.length || 0,
            likes: t.likes || 0,
            views: t.views || 0,
            isPinned: t.isPinned || false,
            createdAt: t.createdAt
          })))
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchThreads()
  }, [])

  const pinnedThreads = threads.filter((t) => t.isPinned)
  const regularThreads = threads.filter((t) => !t.isPinned)

  const categoriesWithCounts = FORUM_CATEGORIES.map((cat) => ({
    ...cat,
    threadCount: Math.floor(Math.random() * 200) + 50,
    postCount: Math.floor(Math.random() * 1000) + 200,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="p-6">
          <SponsorBanner />

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Community Forum</h1>
                <p className="text-muted-foreground">Join discussions, get help, and connect with the community</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-secondary/50 border-border/50 rounded-xl"
                />
              </div>
              {user && (
                <Button className="bg-primary hover:bg-primary/90 gap-2 rounded-xl glow-sm">
                  <Plus className="h-4 w-4" />
                  New Thread
                </Button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4 flex items-center gap-4 card-hover">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalThreads.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Threads</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-4 card-hover">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalPosts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-4 card-hover">
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.floor(stats.onlineUsers * 3.5)}</p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-4 card-hover">
              <div className="h-12 w-12 rounded-xl bg-chart-3/20 flex items-center justify-center">
                <div className="relative">
                  <Users className="h-6 w-6 text-chart-3" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full status-online" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.onlineUsers}</p>
                <p className="text-sm text-muted-foreground">Online Now</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Categories */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Categories
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoriesWithCounts.map((category) => {
                    const Icon = iconMap[category.icon] || MessageSquare
                    return (
                      <Link
                        key={category.id}
                        href={`/forum/category/${category.id}`}
                        className="group flex items-center gap-4 rounded-xl bg-secondary/30 p-4 transition-all hover:bg-secondary/50 card-hover"
                      >
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: category.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">{category.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-foreground">{category.threadCount}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">threads</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Pinned Threads */}
              {pinnedThreads.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Pin className="h-5 w-5 text-primary" />
                    Pinned Threads
                  </h2>
                  <div className="space-y-3">
                    {pinnedThreads.map((thread) => (
                      <Link
                        key={thread.id}
                        href={`/forum/thread/${thread.id}`}
                        className="flex items-center gap-4 rounded-xl bg-primary/5 border border-primary/20 p-4 transition-all hover:bg-primary/10 hover:border-primary/40"
                      >
                        <div className="h-11 w-11 overflow-hidden rounded-full bg-secondary shrink-0 ring-2 ring-primary/30">
                          <img
                            src={thread.author.avatar || "/placeholder.svg"}
                            alt={thread.author.username}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Pin className="h-4 w-4 text-primary shrink-0" />
                            <h3 className="font-semibold text-foreground truncate">{thread.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            {thread.author.membership === "admin" && <Shield className="h-3 w-3 text-destructive" />}
                            <span className="font-medium text-foreground">{thread.author.username}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span>{thread.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium text-foreground">{thread.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span className="font-medium text-foreground">{thread.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Threads */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Recent Threads
                  </h2>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 rounded-xl bg-secondary/20 p-4">
                        <div className="h-11 w-11 rounded-full bg-secondary/50 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-2/3 bg-secondary/50 rounded animate-pulse" />
                          <div className="h-3 w-1/3 bg-secondary/50 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {regularThreads.map((thread) => (
                      <Link
                        key={thread.id}
                        href={`/forum/thread/${thread.id}`}
                        className="flex items-center gap-4 rounded-xl bg-secondary/20 p-4 transition-all hover:bg-secondary/40"
                      >
                        <div className="h-11 w-11 overflow-hidden rounded-full bg-secondary shrink-0">
                          <img
                            src={thread.author.avatar || "/placeholder.svg"}
                            alt={thread.author.username}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
                            {thread.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {thread.author.membership === "vip" && <Crown className="h-3 w-3 text-primary" />}
                              {thread.author.membership === "admin" && <Shield className="h-3 w-3 text-destructive" />}
                              <span className="font-medium text-foreground">{thread.author.username}</span>
                            </span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span>{thread.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{thread.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{thread.likes}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Online Users */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full status-online" />
                  Online Users
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["FiveM Admin", "ServerOwner_RP", "MLOCreator", "QBDeveloper", "ScriptDev"].map((username, i) => (
                    <div
                      key={username}
                      className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-xs"
                    >
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <span className="text-foreground font-medium">{username}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground">
                    +{stats.onlineUsers - 5} more
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-warning" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "FiveM Admin", points: 12500, badge: "admin" },
                    { name: "MLOCreator", points: 8420, badge: "vip" },
                    { name: "QBDeveloper", points: 6890, badge: "vip" },
                    { name: "ScriptMaster", points: 5230, badge: "vip" },
                    { name: "ServerOwner_RP", points: 3150, badge: "free" },
                  ].map((contributor, i) => (
                    <div key={contributor.name} className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-5">#{i + 1}</span>
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/50 to-accent/50" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground text-sm truncate">{contributor.name}</span>
                          {contributor.badge === "admin" && <Shield className="h-3.5 w-3.5 text-destructive" />}
                          {contributor.badge === "vip" && <Crown className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{contributor.points.toLocaleString()} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forum Rules */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Forum Rules</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    Be respectful to all members
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    No spam or self-promotion
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    Use appropriate categories
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">4.</span>
                    Search before posting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
