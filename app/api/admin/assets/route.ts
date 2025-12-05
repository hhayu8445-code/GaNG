import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { validateAdminRole, rateLimitAdmin } from "@/lib/security"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assets = await prisma.asset.findMany({
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ assets, total: assets.length })
  } catch (error) {
    console.error("Fetch assets error:", error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!rateLimitAdmin(session.discordId)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await req.json()
    const { title, description, category, framework, coinPrice, downloadLink, thumbnail, tags, version } = body

    if (!title || !category || !framework) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newAsset = await prisma.asset.create({
      data: {
        title,
        description: description || "",
        category,
        framework,
        coinPrice: coinPrice || 0,
        downloadLink: downloadLink || "",
        thumbnail: thumbnail || "/placeholder.jpg",
        tags: tags || [],
        version: version || "1.0.0",
        authorId: session.discordId,
        status: "active",
        virusScanStatus: "pending",
      }
    })

    return NextResponse.json({ 
      success: true, 
      asset: newAsset,
      message: "Asset created successfully" 
    })
  } catch (error) {
    console.error("Create asset error:", error)
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 })
    }

    await prisma.asset.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true,
      message: "Asset deleted successfully" 
    })
  } catch (error) {
    console.error("Delete asset error:", error)
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
  }
}
