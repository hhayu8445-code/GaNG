import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      coins?: number
      membership?: string
      isAdmin?: boolean
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findFirst({
          where: { email: session.user.email! },
        })
        
        if (dbUser) {
          session.user.id = dbUser.discordId
          session.user.coins = dbUser.coins
          session.user.membership = dbUser.membership
          session.user.isAdmin = dbUser.isAdmin
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          await prisma.user.upsert({
            where: { discordId: (profile as any).id },
            update: {
              username: (profile as any).username,
              email: user.email,
              avatar: user.image,
            },
            create: {
              discordId: (profile as any).id,
              username: (profile as any).username,
              email: user.email,
              avatar: user.image,
              coins: 100,
            },
          })
        } catch (error) {
          console.error('Error creating/updating user:', error)
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}