import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { discordId: session.discordId },
      select: {
        coins: true,
        membership: true,
        isAdmin: true,
        isBanned: true,
      }
    })

    const safeUser = {
      id: session.id,
      discordId: session.discordId,
      username: session.username,
      email: session.email,
      avatar: session.avatar,
      membership: dbUser?.membership || session.membership,
      isAdmin: dbUser?.isAdmin || session.isAdmin,
      coins: dbUser?.coins || 0,
    }

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    const safeUser = {
      id: session.id,
      discordId: session.discordId,
      username: session.username,
      email: session.email,
      avatar: session.avatar,
      membership: session.membership,
      isAdmin: session.isAdmin,
      coins: session.coins || 0,
    }
    return NextResponse.json({ user: safeUser })
  }
}
