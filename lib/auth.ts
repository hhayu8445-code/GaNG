import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
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
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        const dbUser = await prisma.user.upsert({
          where: { discordId: (profile as any).id },
          update: {
            username: (profile as any).username,
            email: token.email,
            avatar: (profile as any).avatar ? `https://cdn.discordapp.com/avatars/${(profile as any).id}/${(profile as any).avatar}.png` : null,
          },
          create: {
            discordId: (profile as any).id,
            username: (profile as any).username,
            email: token.email,
            avatar: (profile as any).avatar ? `https://cdn.discordapp.com/avatars/${(profile as any).id}/${(profile as any).avatar}.png` : null,
            coins: 100,
            isAdmin: (profile as any).id === process.env.ADMIN_DISCORD_ID,
          },
        })
        token.discordId = dbUser.discordId
        token.coins = dbUser.coins
        token.membership = dbUser.membership
        token.isAdmin = dbUser.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token.discordId) {
        const dbUser = await prisma.user.findUnique({
          where: { discordId: token.discordId as string },
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
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
}