import { NextResponse } from "next/server"
import { getDiscordAuthUrl, generateState } from "@/lib/auth"

export async function GET() {
  const state = generateState()

  const authUrl = getDiscordAuthUrl(state)

  // Redirect and attach state cookie for CSRF protection
  const response = NextResponse.redirect(authUrl)
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })
  return response
}
