import { NextResponse } from "next/server"
import { security } from "@/lib/security"

export async function POST(request: Request) {
  try {
    const { userId, targetUserId, amount, action, reason } = await request.json()

    const session = request.headers.get("cookie")
    if (!session?.includes("session=")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!security.isAdmin(userId)) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    if (!security.checkRateLimit(`admin-coins-${userId}`, 50, 60000)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    if (!targetUserId || !amount || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount < 0 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const targetUser = { id: targetUserId, coins: 500, isBanned: false }

    if (targetUser.isBanned) {
      return NextResponse.json({ error: "User is banned" }, { status: 403 })
    }

    let newBalance = targetUser.coins
    if (action === "add") {
      newBalance += amount
    } else if (action === "remove") {
      newBalance = Math.max(0, newBalance - amount)
    }

    const log = {
      adminId: userId,
      targetUserId,
      action,
      amount,
      reason: security.sanitizeInput(reason || ""),
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    }

    return NextResponse.json({
      success: true,
      newBalance,
      transaction: log,
    })
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}
