import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    
    const asset = await prisma.asset.findUnique({
      where: { id },
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

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    await prisma.asset.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    const formattedAsset = {
      ...asset,
      price: asset.coinPrice === 0 ? "free" : "premium",
      author: asset.author.username,
      rating: 4.8,
      isVerified: true,
      isFeatured: asset.downloads > 10000,
      image: asset.thumbnail,
    }

    return NextResponse.json(formattedAsset)
  } catch (error) {
    console.error("Fetch asset error:", error)
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 })
  }
}
