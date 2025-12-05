import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalUsers,
      totalAssets,
      totalDownloads,
      totalThreads,
      totalReplies
    ] = await Promise.all([
      prisma.user.count(),
      prisma.asset.count({ where: { status: 'active' } }),
      prisma.download.count(),
      prisma.forumThread.count(),
      prisma.forumReply.count()
    ])

    const stats = {
      users: totalUsers,
      assets: totalAssets,
      downloads: totalDownloads,
      posts: totalThreads + totalReplies,
      categories: 4, // scripts, mlo, vehicles, clothing
      frameworks: 4  // qbcore, esx, standalone, qbox
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}