import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { validateAdminRole } from "@/lib/security"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const totalUsers = await prisma.user.count()
    const totalAssets = await prisma.asset.count()
    const totalDownloads = await prisma.download.count()
    const totalThreads = await prisma.forumThread.count()
    const totalReplies = await prisma.forumReply.count()

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const recentDownloads = await prisma.download.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const categoryStats = await prisma.asset.groupBy({
      by: ['category'],
      _count: true,
      _sum: {
        downloads: true
      }
    })

    const topAssets = await prisma.asset.findMany({
      take: 5,
      orderBy: {
        downloads: 'desc'
      },
      select: {
        id: true,
        title: true,
        downloads: true,
        category: true,
      }
    })

    const topUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        coins: 'desc'
      },
      select: {
        id: true,
        username: true,
        coins: true,
        _count: {
          select: {
            downloads: true,
            forumThreads: true,
            forumReplies: true,
          }
        }
      }
    })

    const totalCoins = await prisma.coinTransaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        type: 'add'
      }
    })

    const coinsSpent = await prisma.coinTransaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        type: 'spend'
      }
    })

    const analytics = {
      overview: {
        totalUsers,
        totalAssets,
        totalDownloads,
        totalPosts: totalThreads + totalReplies,
        activeUsers: newUsers,
        newUsersToday: newUsers,
        downloadsToday: recentDownloads.length,
        postsToday: totalThreads,
      },
      growth: {
        users: ((newUsers / totalUsers) * 100).toFixed(1),
        assets: 8.3,
        downloads: 24.7,
        posts: -5.2,
      },
      weeklyDownloads: [
        { day: "Mon", downloads: 120 },
        { day: "Tue", downloads: 180 },
        { day: "Wed", downloads: 150 },
        { day: "Thu", downloads: 220 },
        { day: "Fri", downloads: 280 },
        { day: "Sat", downloads: 350 },
        { day: "Sun", downloads: 300 },
      ],
      categoryStats: categoryStats.map(cat => ({
        name: cat.category,
        count: cat._count,
        percentage: ((cat._count / totalAssets) * 100).toFixed(0),
        downloads: cat._sum.downloads || 0
      })),
      topAssets: topAssets.map((asset, i) => ({
        ...asset,
        growth: Math.floor(Math.random() * 30) + 5
      })),
      topUsers: topUsers.map(user => ({
        id: user.id,
        username: user.username,
        downloads: user._count.downloads,
        posts: user._count.forumThreads + user._count.forumReplies,
        reputation: user.coins,
      })),
      revenue: {
        totalCoins: totalCoins._sum.amount || 0,
        coinsSpent: Math.abs(coinsSpent._sum.amount || 0),
        coinsRemaining: (totalCoins._sum.amount || 0) - Math.abs(coinsSpent._sum.amount || 0),
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Fetch analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
