import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const dataStr = formData.get("data") as string
    const image = formData.get("image") as File | null
    
    if (!file || !dataStr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const data = JSON.parse(dataStr)
    
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    let thumbnailPath = "/placeholder.jpg"
    if (image) {
      const imageBytes = await image.arrayBuffer()
      const imageBuffer = Buffer.from(imageBytes)
      const imageName = `thumb-${Date.now()}.jpg`
      const imagePath = join(uploadsDir, imageName)
      await writeFile(imagePath, imageBuffer)
      thumbnailPath = `/uploads/${imageName}`
    }

    const newAsset = await prisma.asset.create({
      data: {
        title: data.title || "Untitled Asset",
        description: data.description || "",
        category: data.category || "scripts",
        framework: data.framework || "qbcore",
        coinPrice: data.price === "premium" ? (data.coinPrice || 100) : 0,
        downloadLink: `/uploads/${fileName}`,
        thumbnail: thumbnailPath,
        tags: data.tags || [],
        version: data.version || "1.0.0",
        requirements: data.requirements || "",
        changelog: data.changelog || "",
        fileSize: data.fileSize || "",
        authorId: session.discordId,
        status: "active",
        virusScanStatus: "clean",
      }
    })

    return NextResponse.json({
      success: true,
      assetId: newAsset.id,
      message: "Asset uploaded successfully",
      asset: newAsset,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
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
