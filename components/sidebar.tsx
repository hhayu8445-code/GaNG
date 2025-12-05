"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SITE_LOGO, SITE_NAME } from "@/lib/constants"
import { useAuth } from "@/components/auth-provider"
import { useStatsStore } from "@/lib/store"
import { DailyCoinsButton } from "@/components/daily-coins-button"
import {
  MessageSquare,
  Compass,
  Code,
  MapPin,
  Car,
  Shirt,
  Mail,
  Crown,
  Key,
  Rocket,
  LayoutDashboard,
  Shield,
  ChevronLeft,
  Users,
  Upload,
  Coins,
} from "lucide-react"

const navItems = [
  { label: "Community Forum", href: "/forum", icon: MessageSquare, badge: "HOT" },
  { label: "Discover", href: "/", icon: Compass },
  { label: "Scripts", href: "/scripts", icon: Code },
  { label: "Maps & MLO", href: "/mlo", icon: MapPin },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "EUP & Clothing", href: "/clothing", icon: Shirt },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Membership", href: "/membership", icon: Crown },
  { label: "Decrypt CFX V7", href: "/decrypt", icon: Key },
  { label: "Upvotes Server", href: "/upvotes", icon: Rocket },
  { label: "Upload Asset", href: "/upload", icon: Upload, badge: "NEW" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAdmin } = useAuth()
  const { stats, setStats } = useStatsStore()

  // Fetch real-time stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats")
        const data = await res.json()
        setStats({
          onlineUsers: data.online ?? 0,
          totalMembers: data.users,
          totalAssets: data.assets,
          totalDownloads: data.downloads,
          totalPosts: data.posts,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [setStats])

  const userItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requireAuth: true },
    { label: "Admin Panel", href: "/admin", icon: Shield, requireAdmin: true },
  ]

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-border"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
        "md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl glow-sm">
              <img src={SITE_LOGO || "/placeholder.svg"} alt={SITE_NAME} className="h-full w-full object-contain" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground">FiveM Tools</h1>
                <p className="text-xs text-primary font-medium">V7 Premium</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors",
              collapsed && "absolute -right-3 top-6 bg-sidebar border border-border",
            )}
          >
            <ChevronLeft
              className={cn("h-4 w-4 text-muted-foreground transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/15 text-primary glow-sm"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Section */}
          {user && (
            <div className="pt-4 mt-4 border-t border-sidebar-border">
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </p>
              )}
              {userItems.map((item) => {
                if (item.requireAdmin && !isAdmin) return null
                if (item.requireAuth && !user) return null

                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/15 text-primary glow-sm"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        {/* Status Card */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full status-online absolute -top-0.5 -right-0.5" />
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Live Status</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-background/50 p-2">
                  <p className="text-lg font-bold text-primary">{stats.onlineUsers}</p>
                  <p className="text-[10px] text-muted-foreground">Online</p>
                </div>
                <div className="rounded-lg bg-background/50 p-2">
                  <p className="text-lg font-bold text-foreground">{(stats.totalMembers / 1000).toFixed(1)}K</p>
                  <p className="text-[10px] text-muted-foreground">Members</p>
                </div>
              </div>
              {user && (
                <>
                  <div className="mt-3 rounded-lg bg-gradient-to-r from-warning/20 to-chart-5/20 border border-warning/30 p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif" alt="Coins" className="h-5 w-5" />
                        <span className="text-xs font-medium text-foreground">Coins</span>
                      </div>
                      <span className="text-sm font-bold text-warning">{user.coins || 0}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <DailyCoinsButton />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
