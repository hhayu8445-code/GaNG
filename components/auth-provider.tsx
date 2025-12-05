"use client"

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import type { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export function useAuth() {
  const { data: session, status, update } = useSession()
  
  const user = session?.user ? {
    id: session.user.id || '',
    discordId: session.user.id || '',
    username: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
    membership: session.user.membership || 'free',
    coins: session.user.coins || 100,
    isAdmin: session.user.isAdmin || false
  } : null
  
  return {
    user,
    isAdmin: user?.isAdmin || false,
    isLoading: status === 'loading',
    login: () => signIn('discord'),
    logout: () => signOut(),
    refreshSession: () => update()
  }
}
