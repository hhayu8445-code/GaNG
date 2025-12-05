import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      where: { status: 'active' },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true
          }
        }
      },
      orderBy: { downloads: 'desc' },
      take: 4
    })

    const formatted = assets.map(asset => ({
      ...asset,
      price: asset.coinPrice === 0 ? "free" : "premium",
      author: asset.author.username,
      rating: 4.8,
      isVerified: true,
      isFeatured: asset.downloads > 10000,
      image: asset.thumbnail,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Trending API error:', error)
    return NextResponse.json([])
  }
}
