import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { discordId: session.discordId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: "Account banned" }, { status: 403 })
    }

    const now = new Date()
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim) : null
    
    if (lastClaim) {
      const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastClaim < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim)
        return NextResponse.json({ 
          error: "Already claimed today",
          canClaimIn: `${hoursRemaining} hours`,
          nextClaimAt: new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000).toISOString()
        }, { status: 429 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { discordId: session.discordId },
      data: {
        coins: { increment: 20 },
        lastDailyClaim: now
      }
    })

    await prisma.coinTransaction.create({
      data: {
        userId: session.discordId,
        amount: 20,
        type: "daily_claim",
        description: "Daily coin claim"
      }
    })

    return NextResponse.json({
      success: true,
      coinsAdded: 20,
      newBalance: updatedUser.coins,
      nextClaimAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    })
  } catch (error) {
    console.error("Daily claim error:", error)
    return NextResponse.json({ error: "Failed to claim daily coins" }, { status: 500 })
  }
}
