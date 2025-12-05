import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    const [threads, total] = await Promise.all([
      prisma.forumThread.findMany({
        where,
        include: {
          author: {
            select: {
              username: true,
              avatar: true,
              membership: true
            }
          },
          _count: {
            select: { replies: true }
          }
        },
        orderBy: [
          { isPinned: 'desc' },
          { updatedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.forumThread.count({ where })
    ])

    return NextResponse.json({
      threads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Forum threads API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const thread = await prisma.forumThread.create({
      data: {
        ...data,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true
          }
        },
        _count: {
          select: { replies: true }
        }
      }
    })

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error('Create thread error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}