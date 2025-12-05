import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const thread = await prisma.forumThread.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true,
          }
        },
        replies: {
          include: {
            author: {
              select: {
                username: true,
                avatar: true,
                membership: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
    
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    await prisma.forumThread.update({
      where: { id },
      data: { views: { increment: 1 } }
    })
    
    return NextResponse.json({ thread })
  } catch (error) {
    console.error("Fetch thread error:", error)
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
  }
}
