import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const userId = String(body.userId || '')
    const amount = parseInt(String(body.amount || '0'))
    const reason = String(body.reason || '')
    const action = String(body.action || 'add')

    if (!userId || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const increment = action === 'remove' ? -amount : amount

    const [updatedUser] = await Promise.all([
      prisma.user.update({
        where: { discordId: userId },
        data: { coins: { increment } },
      }),
      prisma.coinTransaction.create({
        data: {
          userId,
          amount: increment,
          type: 'admin_adjust',
          description: reason || (action === 'remove' ? 'Admin remove coins' : 'Admin add coins'),
          adminId: session.user.id,
        },
      }),
    ])

    return NextResponse.json({ success: true, totalCoins: updatedUser.coins })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
