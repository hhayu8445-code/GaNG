import { NextRequest, NextResponse } from "next/server"

const downloads = new Map<string, { filename: string; content: string; createdAt: Date }>()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const download = downloads.get(id)
  
  if (!download) {
    return NextResponse.json({ error: "Download not found or expired" }, { status: 404 })
  }

  return new NextResponse(download.content, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${download.filename}"`,
    }
  })
}
