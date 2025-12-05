"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Shield, Users, Package, Download, Coins, Settings } from "lucide-react"

interface StatsData {
  users: number
  assets: number
  downloads: number
  posts: number
  categories: number
  frameworks: number
}

export default function AdminPage() {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/")
      else if (!isAdmin) router.push("/dashboard")
      else fetchStats()
    }
  }, [user, isAdmin, isLoading, router])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const res = await fetch("/api/stats")
      const data = await res.json()
      setStatsData(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (isLoading || loadingStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) return null

  const stats = [
    { label: "Total Users", value: statsData?.users ?? 0, icon: Users, color: "text-primary", bg: "bg-primary/20" },
    { label: "Total Assets", value: statsData?.assets ?? 0, icon: Package, color: "text-success", bg: "bg-success/20" },
    { label: "Total Downloads", value: statsData?.downloads ?? 0, icon: Download, color: "text-chart-5", bg: "bg-chart-5/20" },
    { label: "Total Posts", value: statsData?.posts ?? 0, icon: Coins, color: "text-warning", bg: "bg-warning/20" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="p-6">
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="h-16 w-16 rounded-xl object-cover ring-4 ring-primary/20" />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-destructive flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30">ADMIN</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Logged in as {user.username}</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2 rounded-xl">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Asset Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <a href="/upload">
                    <Button className="rounded-xl">Add New Asset</Button>
                  </a>
                  <a href="/scripts">
                    <Button variant="outline" className="rounded-xl">View All Assets</Button>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="rounded-xl">Approve Submissions</Button>
                  <Button variant="outline" className="rounded-xl">Manage Categories</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>User Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <a href="/admin/users">
                    <Button variant="outline" className="rounded-xl">Search Users</Button>
                  </a>
                  <a href="/admin/analytics">
                    <Button variant="outline" className="rounded-xl">View Reports</Button>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="rounded-xl">Ban User</Button>
                  <Button variant="outline" className="rounded-xl">Grant VIP</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

