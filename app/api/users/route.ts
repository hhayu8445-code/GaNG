import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        discordId: true,
        username: true,
        email: true,
        avatar: true,
        membership: true,
        coins: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            downloads: true,
            forumThreads: true,
            forumReplies: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = users.map((u) => ({
      id: u.discordId,
      username: u.username,
      email: u.email,
      avatar: u.avatar || '/placeholder.svg',
      membership: u.membership,
      coins: u.coins,
      downloads: u._count.downloads,
      posts: u._count.forumThreads + u._count.forumReplies,
      status: u.isBanned ? 'banned' : 'active',
      createdAt: u.createdAt,
    }))

    return NextResponse.json({ users: formatted })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

