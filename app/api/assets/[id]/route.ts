import { NextResponse, type NextRequest } from "next/server"
import type { Asset } from "@/lib/types"
import { assets } from "../route"

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const asset = (assets as Asset[]).find((a) => a.id === id)
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 })
  }
  return NextResponse.json(asset)
}
