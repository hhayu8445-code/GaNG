import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    const threads = await prisma.forumThread.findMany({
      where,
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true,
          }
        },
        replies: true
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ threads, total: threads.length })
  } catch (error) {
    console.error("Fetch threads error:", error)
    return NextResponse.json({ threads: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, categoryId } = body

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const thread = await prisma.forumThread.create({
      data: {
        title,
        content,
        categoryId,
        authorId: session.discordId,
      },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, thread })
  } catch (error) {
    console.error("Create thread error:", error)
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
  }
}
