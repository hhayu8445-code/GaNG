import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 })
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    if (thread.isLocked) {
      return NextResponse.json({ error: "Thread is locked" }, { status: 403 })
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        threadId: id,
        authorId: session.discordId,
      },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("Create reply error:", error)
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 })
  }
}
