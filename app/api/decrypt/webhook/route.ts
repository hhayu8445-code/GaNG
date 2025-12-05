import { NextRequest, NextResponse } from "next/server"
import { downloads } from "../route"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const expectedAuth = `Bearer ${process.env.DISCORD_BOT_API_KEY}`
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { downloadId, filename, content, status, jobId } = body

    if (status === "completed" && downloadId && content) {
      downloads.set(downloadId, {
        filename: filename || "decrypted.lua",
        content: content,
        createdAt: new Date()
      })

      return NextResponse.json({ 
        success: true, 
        message: "Download stored successfully",
        downloadUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/decrypt/download/${downloadId}`
      })
    }

    return NextResponse.json({ success: true, message: "Webhook received" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
