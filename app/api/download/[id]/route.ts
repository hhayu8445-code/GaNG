import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { discordId: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough coins
    if (asset.coinPrice > 0 && user.coins < asset.coinPrice) {
      return NextResponse.json({ 
        error: 'Insufficient coins',
        required: asset.coinPrice,
        available: user.coins
      }, { status: 400 })
    }

    // Check if already downloaded
    const existingDownload = await prisma.download.findFirst({
      where: {
        userId: session.user.id,
        assetId: id
      }
    })

    if (existingDownload) {
      return NextResponse.json({
        success: true,
        downloadUrl: asset.downloadLink,
        message: 'Already purchased'
      })
    }

    // Process download transaction
    await prisma.$transaction(async (tx) => {
      // Deduct coins if required
      if (asset.coinPrice > 0) {
        await tx.user.update({
          where: { discordId: session.user.id },
          data: { coins: { decrement: asset.coinPrice } }
        })

        await tx.coinTransaction.create({
          data: {
            userId: session.user.id,
            amount: -asset.coinPrice,
            type: 'asset_purchase',
            description: `Purchased: ${asset.title}`
          }
        })
      }

      // Record download
      await tx.download.create({
        data: {
          userId: session.user.id,
          assetId: id,
          coinSpent: asset.coinPrice
        }
      })

      // Increment download count
      await tx.asset.update({
        where: { id },
        data: { downloads: { increment: 1 } }
      })
    })

    return NextResponse.json({
      success: true,
      downloadUrl: asset.downloadLink,
      coinsSpent: asset.coinPrice
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}