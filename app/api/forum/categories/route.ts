import { NextResponse } from "next/server"
import { FORUM_CATEGORIES } from "@/lib/constants"

export async function GET() {
  return NextResponse.json({ categories: FORUM_CATEGORIES })
}
