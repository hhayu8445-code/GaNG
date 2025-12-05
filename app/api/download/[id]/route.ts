import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [asset, user] = await Promise.all([
      prisma.asset.findUnique({ where: { id } }),
      prisma.user.findUnique({ where: { discordId: session.discordId } })
    ])

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: "Account banned" }, { status: 403 })
    }

    const hasDownloaded = await prisma.download.findFirst({
      where: {
        userId: session.discordId,
        assetId: id
      }
    })

    if (asset.coinPrice > 0) {
      if (user.coins < asset.coinPrice && !hasDownloaded) {
        return NextResponse.json({ 
          error: "Insufficient coins", 
          required: asset.coinPrice,
          current: user.coins 
        }, { status: 402 })
      }

      if (!hasDownloaded) {
        await prisma.$transaction([
          prisma.user.update({
            where: { discordId: session.discordId },
            data: { coins: { decrement: asset.coinPrice } }
          }),
          prisma.download.create({
            data: {
              userId: session.discordId,
              assetId: id,
              coinSpent: asset.coinPrice
            }
          }),
          prisma.coinTransaction.create({
            data: {
              userId: session.discordId,
              amount: -asset.coinPrice,
              type: "download",
              description: `Downloaded: ${asset.title}`
            }
          }),
          prisma.asset.update({
            where: { id },
            data: { downloads: { increment: 1 } }
          })
        ])

        return NextResponse.json({
          success: true,
          downloadUrl: asset.downloadLink,
          coinsDeducted: asset.coinPrice,
          newBalance: user.coins - asset.coinPrice
        })
      }
    }

    if (!hasDownloaded) {
      await prisma.$transaction([
        prisma.download.create({
          data: {
            userId: session.discordId,
            assetId: id,
            coinSpent: 0
          }
        }),
        prisma.asset.update({
          where: { id },
          data: { downloads: { increment: 1 } }
        })
      ])
    }

    return NextResponse.json({
      success: true,
      downloadUrl: asset.downloadLink
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
