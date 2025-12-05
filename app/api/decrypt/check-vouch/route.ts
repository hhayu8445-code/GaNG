import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vouchChannelId = process.env.VOUCH_CHANNEL_ID
    const requireVouch = process.env.REQUIRE_VOUCH_FOR_DECRYPT === "true"

    if (!requireVouch) {
      return NextResponse.json({ hasVouch: true, required: false })
    }

    if (!vouchChannelId) {
      return NextResponse.json({ hasVouch: true, required: false })
    }

    const hasVouch = await checkUserVouch(session.discordId, vouchChannelId)

    return NextResponse.json({ 
      hasVouch, 
      required: true,
      vouchChannelId,
      message: hasVouch ? "Vouch verified" : "Please post a vouch in the vouch channel first"
    })

  } catch (error) {
    return NextResponse.json({ error: "Failed to check vouch" }, { status: 500 })
  }
}

async function checkUserVouch(userId: string, channelId: string): Promise<boolean> {
  const botToken = process.env.DISCORD_BOT_TOKEN
  if (!botToken) return false

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=100`,
      {
        headers: {
          Authorization: `Bot ${botToken}`
        }
      }
    )

    if (!response.ok) return false

    const messages = await response.json()
    return messages.some((msg: any) => msg.author.id === userId)
  } catch (error) {
    console.error("Error checking vouch:", error)
    return false
  }
}
