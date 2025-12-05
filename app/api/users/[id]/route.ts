import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { discordId: id },
      select: {
        id: true,
        discordId: true,
        username: true,
        avatar: true,
        membership: true,
        coins: true,
        createdAt: true,
        _count: {
          select: {
            assets: true,
            downloads: true,
            forumThreads: true,
            forumReplies: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}