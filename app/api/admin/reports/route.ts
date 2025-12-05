import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { validateAdminRole } from "@/lib/security"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
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

    return NextResponse.json({ reports, total: reports.length })
  } catch (error) {
    console.error("Fetch reports error:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { type, reason, target, targetId } = body

    if (!type || !reason || !target) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newReport = await prisma.report.create({
      data: {
        type,
        reason,
        target,
        targetId: targetId || null,
        reporterId: session.discordId,
        status: "pending",
      }
    })

    return NextResponse.json({ 
      success: true, 
      report: newReport,
      message: "Report submitted successfully" 
    })
  } catch (error) {
    console.error("Create report error:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !validateAdminRole(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { reportId, action, notes } = body

    if (!reportId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: action === "resolve" ? "resolved" : "dismissed",
        resolvedAt: new Date(),
        resolvedBy: session.discordId,
        notes: notes || "",
      }
    })

    return NextResponse.json({ 
      success: true, 
      report: updatedReport,
      message: `Report ${action}d successfully` 
    })
  } catch (error) {
    console.error("Update report error:", error)
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}
