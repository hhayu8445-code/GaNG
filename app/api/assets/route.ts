import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const framework = searchParams.get("framework")
    const price = searchParams.get("price")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "12")

    const where: any = { status: "active" }
    
    if (category) where.category = category
    if (framework && framework !== "all") where.framework = framework
    if (price === "free") where.coinPrice = 0
    if (price === "premium") where.coinPrice = { gt: 0 }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } }
      ]
    }

    const [items, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          author: {
            select: {
              username: true,
              avatar: true,
            }
          }
        },
        orderBy: { downloads: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.asset.count({ where })
    ])

    const formattedItems = items.map(item => ({
      ...item,
      price: item.coinPrice === 0 ? "free" : "premium",
      author: item.author.username,
      rating: 4.8,
      isVerified: true,
      isFeatured: item.downloads > 10000,
    }))

    return NextResponse.json({ 
      items: formattedItems, 
      total, 
      page, 
      pageSize, 
      hasMore: (page * pageSize) < total 
    })
  } catch (error) {
    console.error("Fetch assets error:", error)
    return NextResponse.json({ items: [], total: 0, page: 1, pageSize: 12, hasMore: false })
  }
}
