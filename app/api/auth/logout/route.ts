import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url))
  response.cookies.delete("session")
  return response
}

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("session")
  return response
}
