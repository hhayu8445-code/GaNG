import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import crypto from "crypto"

// Shared storage for downloads
export const downloads = new Map<string, { filename: string; content: string; createdAt: Date }>()

// In-memory storage (in production, use database)
const decryptJobs = new Map<string, {
  userId: string
  filename: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: string
  createdAt: Date
  downloadUrl?: string
}>()

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ 
      error: "Please use Discord bot for decryption",
      message: "Upload your file directly to Discord bot. Use command: /decrypt",
      discordServer: "Join our Discord server for decryption service"
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 })
  }
}



export async function GET(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  if (jobId) {
    // Check job status
    const job = decryptJobs.get(jobId)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    if (job.userId !== session?.discordId && !session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(job)
  }

  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    totalDecrypts: decryptJobs.size,
    successRate: 98.5,
    activeUsers: 456,
    todayDecrypts: 89,
    recentJobs: Array.from(decryptJobs.entries()).slice(-10).map(([id, job]) => ({
      id,
      ...job,
      result: undefined
    }))
  })
}
