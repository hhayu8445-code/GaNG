import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const action = String(body.action || '')

    if (!id || !action) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    if (action === 'ban') {
      const ban = Boolean(body.ban)
      const user = await prisma.user.update({
        where: { discordId: id },
        data: { isBanned: ban, bannedAt: ban ? new Date() : null, bannedBy: session.user.id },
      })
      return NextResponse.json({ success: true, status: user.isBanned ? 'banned' : 'active' })
    }

    if (action === 'setMembership') {
      const membership = String(body.membership || 'free')
      const user = await prisma.user.update({
        where: { discordId: id },
        data: { membership },
      })
      return NextResponse.json({ success: true, membership: user.membership })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.forumReply.deleteMany({ where: { authorId: id } }),
      prisma.forumThread.deleteMany({ where: { authorId: id } }),
      prisma.download.deleteMany({ where: { userId: id } }),
      prisma.coinTransaction.deleteMany({ where: { userId: id } }),
      prisma.report.deleteMany({ where: { reporterId: id } }),
      prisma.asset.deleteMany({ where: { authorId: id } }),
      prisma.user.delete({ where: { discordId: id } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
