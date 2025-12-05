import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const thread = await prisma.forumThread.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                username: true,
                avatar: true,
                membership: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    // Increment views
    await prisma.forumThread.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(thread)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}