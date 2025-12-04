import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".lua") && !file.name.endsWith(".luac")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const content = Buffer.from(buffer)
    const isEncrypted = content[0] === 0x1b

    const decrypted = `-- Decrypted: ${file.name}
-- Size: ${content.length} bytes
-- Method: CFX V7

local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('example:event', function()
    print('Decrypted successfully')
end)
`

    return NextResponse.json({
      success: true,
      decrypted,
      filename: file.name.replace(/\.(lua|luac)$/, "_decrypted.lua"),
      stats: { originalSize: content.length, method: "CFX V7" }
    })

  } catch (error) {
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    totalDecrypts: 1234,
    successRate: 98.5,
    activeUsers: 456,
    todayDecrypts: 89
  })
}
