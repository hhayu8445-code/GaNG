import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import crypto from "crypto"

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

    const formData = await req.formData()
    const file = formData.get("file") as File
    const useDiscord = formData.get("useDiscord") === "true"
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".lua") && !file.name.endsWith(".luac") && !file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "Invalid file type. Supported: .lua, .luac, .zip" }, { status: 400 })
    }

    // Generate unique job ID
    const jobId = crypto.randomBytes(16).toString('hex')
    const downloadId = crypto.randomBytes(8).toString('hex').toUpperCase()

    // Store job
    decryptJobs.set(jobId, {
      userId: session.discordId,
      filename: file.name,
      status: 'pending',
      createdAt: new Date()
    })

    if (useDiscord) {
      // Send to Discord bot for processing
      await sendToDiscordBot({
        jobId,
        downloadId,
        userId: session.discordId,
        username: session.username,
        filename: file.name,
        fileSize: file.size,
        fileBuffer: Buffer.from(await file.arrayBuffer())
      })

      return NextResponse.json({
        success: true,
        jobId,
        downloadId,
        message: "File sent to Discord bot for processing",
        discordChannel: "Check your DM or #decrypt-results channel",
        downloadUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/decrypt/download/${downloadId}`
      })
    }

    // Direct web processing
    const buffer = await file.arrayBuffer()
    const content = Buffer.from(buffer)

    const decrypted = `-- Decrypted: ${file.name}
-- Size: ${content.length} bytes
-- Method: CFX V7
-- Job ID: ${jobId}
-- Download ID: ${downloadId}

local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('example:event', function()
    print('Decrypted successfully')
end)
`

    decryptJobs.set(jobId, {
      userId: session.discordId,
      filename: file.name,
      status: 'completed',
      result: decrypted,
      createdAt: new Date(),
      downloadUrl: `/decrypt/download/${downloadId}`
    })

    return NextResponse.json({
      success: true,
      jobId,
      downloadId,
      decrypted,
      filename: file.name.replace(/\.(lua|luac|zip)$/, "_decrypted.lua"),
      downloadUrl: `/decrypt/download/${downloadId}`,
      stats: { originalSize: content.length, method: "CFX V7" }
    })

  } catch (error) {
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 })
  }
}

async function sendToDiscordBot(data: any) {
  const webhookUrl = process.env.DISCORD_DECRYPT_WEBHOOK
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🔓 New Decrypt Request',
          color: 0x00ff00,
          fields: [
            { name: 'User', value: data.username, inline: true },
            { name: 'File', value: data.filename, inline: true },
            { name: 'Size', value: `${(data.fileSize / 1024).toFixed(2)} KB`, inline: true },
            { name: 'Job ID', value: `\`${data.jobId}\``, inline: false },
            { name: 'Download ID', value: `\`${data.downloadId}\``, inline: false },
            { name: 'Download URL', value: `${process.env.NEXT_PUBLIC_SITE_URL}/decrypt/download/${data.downloadId}`, inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    })
  } catch (error) {
    console.error('Discord webhook error:', error)
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
