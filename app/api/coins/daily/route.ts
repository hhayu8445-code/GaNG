import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { discordId: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (user.lastDailyClaim && user.lastDailyClaim >= today) {
      return NextResponse.json({ 
        error: 'Daily coins already claimed today',
        nextClaim: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }, { status: 400 })
    }

    const dailyAmount = user.membership === 'premium' ? 50 : 25

    const [updatedUser] = await Promise.all([
      prisma.user.update({
        where: { discordId: session.user.id },
        data: {
          coins: { increment: dailyAmount },
          lastDailyClaim: now
        }
      }),
      prisma.coinTransaction.create({
        data: {
          userId: session.user.id,
          amount: dailyAmount,
          type: 'daily_claim',
          description: 'Daily coin claim'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      coinsEarned: dailyAmount,
      totalCoins: updatedUser.coins,
      nextClaim: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    })
  } catch (error) {
    console.error('Daily coins error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}