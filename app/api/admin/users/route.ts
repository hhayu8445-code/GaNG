import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { validateAdminRole } from "@/lib/security"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const filter = searchParams.get("filter")

    const where: any = {}

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (filter && filter !== "all") {
      if (filter === "banned") {
        where.isBanned = true
      } else {
        where.membership = filter
      }
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        discordId: true,
        username: true,
        email: true,
        avatar: true,
        membership: true,
        coins: true,
        isAdmin: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            downloads: true,
            forumThreads: true,
            forumReplies: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users, total: users.length })
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { userId, action, data } = body

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let updatedUser

    switch (action) {
      case "ban":
        updatedUser = await prisma.user.update({
          where: { discordId: userId },
          data: {
            isBanned: true,
            bannedAt: new Date(),
            bannedBy: session.discordId,
          }
        })
        break
      case "unban":
        updatedUser = await prisma.user.update({
          where: { discordId: userId },
          data: {
            isBanned: false,
            bannedAt: null,
            bannedBy: null,
          }
        })
        break
      case "upgrade":
        updatedUser = await prisma.user.update({
          where: { discordId: userId },
          data: {
            membership: data.membership,
          }
        })
        break
      case "update":
        updatedUser = await prisma.user.update({
          where: { discordId: userId },
          data: data
        })
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: `User ${action} successful` 
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { discordId: userId }
    })

    return NextResponse.json({ 
      success: true,
      message: "User deleted successfully" 
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
