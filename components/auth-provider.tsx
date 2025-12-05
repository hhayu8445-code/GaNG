"use client"

import { useEffect, createContext, useContext, type ReactNode } from "react"
import { useAuthStore } from "@/lib/store"
import type { SessionUser } from "@/lib/auth"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: any
  isLoading: boolean
  isAdmin: boolean
  login: () => void
  logout: () => void
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore()

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: 'no-store' })
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Session check failed:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    checkSession()
    const interval = setInterval(checkSession, 5000)
    return () => clearInterval(interval)
  }, [setUser])

  const login = () => {
    window.location.href = "/api/auth/login"
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    logout()
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.isAdmin ?? false,
        login,
        logout: handleLogout,
        refreshSession: checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
