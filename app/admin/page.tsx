"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddAssetModal } from "@/components/add-asset-modal"
import { useAuth } from "@/components/auth-provider"
import { useStatsStore } from "@/lib/store"
import {
  Users,
  Package,
  Download,
  Flag,
  Plus,
  Edit,
  Trash2,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Ban,
  Crown,
} from "lucide-react"
import Link from "next/link"

interface AdminUser {
  id: string
  username: string
  email: string
  membership: "free" | "vip" | "admin"
  downloads: number
  posts: number
  createdAt: string
  isBanned: boolean
}

interface Report {
  id: string
  type: "thread" | "reply" | "user" | "asset"
  reason: string
  target: string
  reporter: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: string
}

export default function AdminPage() {
  const { user, isLoading, isAdmin } = useAuth()
  const { stats } = useStatsStore()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [showAddAsset, setShowAddAsset] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, isLoading, isAdmin, router])

  useEffect(() => {
    // Simulate fetching admin data
    setUsers([
      {
        id: "1",
        username: "ServerOwner_RP",
        email: "owner@server.com",
        membership: "vip",
        downloads: 145,
        posts: 78,
        createdAt: "2025-01-15",
        isBanned: false,
      },
      {
        id: "2",
        username: "MLOCreator",
        email: "creator@mlo.com",
        membership: "vip",
        downloads: 320,
        posts: 167,
        createdAt: "2025-01-05",
        isBanned: false,
      },
      {
        id: "3",
        username: "NewMember",
        email: "new@member.com",
        membership: "free",
        downloads: 5,
        posts: 3,
        createdAt: "2025-12-01",
        isBanned: false,
      },
      {
        id: "4",
        username: "QBDeveloper",
        email: "qb@dev.com",
        membership: "vip",
        downloads: 189,
        posts: 145,
        createdAt: "2025-01-20",
        isBanned: false,
      },
      {
        id: "5",
        username: "SpamUser",
        email: "spam@user.com",
        membership: "free",
        downloads: 0,
        posts: 50,
        createdAt: "2025-12-03",
        isBanned: true,
      },
    ])

    setReports([
      {
        id: "1",
        type: "thread",
        reason: "Spam Content",
        target: "Buy cheap scripts here!",
        reporter: "ServerOwner_RP",
        status: "pending",
        createdAt: "2025-12-04",
      },
      {
        id: "2",
        type: "user",
        reason: "Harassment",
        target: "SpamUser",
        reporter: "MLOCreator",
        status: "pending",
        createdAt: "2025-12-03",
      },
    ])
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) return null

  const pendingReports = reports.filter((r) => r.status === "pending")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-destructive to-chart-5 flex items-center justify-center glow-sm">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-muted-foreground">Manage users, assets, and moderate the community</p>
              </div>
            </div>
            <Link href="/admin/analytics">
              <Button variant="outline" className="gap-2 rounded-xl bg-transparent">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Users",
                value: stats.totalMembers.toLocaleString(),
                change: "+12%",
                icon: Users,
                color: "text-primary",
                bg: "bg-primary/20",
              },
              {
                label: "Total Assets",
                value: stats.totalAssets.toLocaleString(),
                change: "+8",
                icon: Package,
                color: "text-success",
                bg: "bg-success/20",
              },
              {
                label: "Total Downloads",
                value: stats.totalDownloads.toLocaleString(),
                change: "+24%",
                icon: Download,
                color: "text-accent",
                bg: "bg-accent/20",
              },
              {
                label: "Pending Reports",
                value: pendingReports.length,
                change: null,
                icon: Flag,
                color: "text-destructive",
                bg: "bg-destructive/20",
                alert: pendingReports.length > 0,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`glass rounded-2xl p-5 card-hover ${stat.alert ? "border-destructive/50" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.change && <span className="text-xs text-success font-medium">{stat.change}</span>}
                  {stat.alert && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Users
                </h2>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-primary gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                      u.isBanned ? "bg-destructive/10" : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center font-bold text-foreground">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{u.username}</span>
                          {u.membership === "vip" && <Crown className="h-3.5 w-3.5 text-primary" />}
                          {u.isBanned && <Ban className="h-3.5 w-3.5 text-destructive" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{u.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Reports */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Flag className="h-5 w-5 text-destructive" />
                  Pending Reports
                  {pendingReports.length > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                      {pendingReports.length}
                    </span>
                  )}
                </h2>
              </div>
              {pendingReports.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="text-foreground font-medium">All clear!</p>
                  <p className="text-sm text-muted-foreground">No pending reports</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingReports.map((report) => (
                    <div key={report.id} className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs border-border capitalize">
                          {report.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium text-foreground mb-1">{report.reason}</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Target: <span className="text-foreground">{report.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">Reported by: {report.reporter}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" className="flex-1 rounded-lg">
                          Take Action
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 rounded-lg bg-transparent">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link href="/admin/coins" className="w-full">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 rounded-xl bg-transparent">
                  <img src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif" alt="Coins" className="h-6 w-6" />
                  <span>Manage Coins</span>
                </Button>
              </Link>
              <Button onClick={() => setShowAddAsset(true)} variant="outline" className="h-auto py-4 flex-col gap-2 rounded-xl bg-transparent">
                <Plus className="h-5 w-5 text-primary" />
                <span>Add Asset</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-xl bg-transparent">
                <Users className="h-5 w-5 text-success" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-xl bg-transparent">
                <Flag className="h-5 w-5 text-destructive" />
                <span>View Reports</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-xl bg-transparent">
                <BarChart3 className="h-5 w-5 text-warning" />
                <span>Analytics</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <AddAssetModal open={showAddAsset} onOpenChange={setShowAddAsset} />
    </div>
  )
}
