import { NextRequest, NextResponse } from "next/server"
import { downloads } from "../../route"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const download = downloads.get(id)
  
  if (!download) {
    return new NextResponse(
      `Download ID not found or expired.\n\nPlease check your Download ID from Discord bot.`,
      { status: 404, headers: { 'Content-Type': 'text/plain' } }
    )
  }

  const expiryTime = 24 * 60 * 60 * 1000
  if (Date.now() - download.createdAt.getTime() > expiryTime) {
    downloads.delete(id)
    return new NextResponse(
      `Download link expired (24 hours).\n\nPlease decrypt again using Discord bot.`,
      { status: 410, headers: { 'Content-Type': 'text/plain' } }
    )
  }

  return new NextResponse(download.content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${download.filename}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Download-ID': id
    }
  })
}
