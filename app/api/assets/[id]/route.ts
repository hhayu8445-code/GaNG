import { NextResponse } from "next/server"
import type { Asset } from "@/lib/types"
import { assets } from "../route"

export async function GET(_: Request, context: { params: { id: string } }) {
  const { id } = context.params
  const asset = (assets as Asset[]).find((a) => a.id === id)
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 })
  }
  return NextResponse.json(asset)
}
