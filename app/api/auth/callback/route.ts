import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForTokens, getDiscordUser, getAvatarUrl, createSessionToken, checkIsAdmin } from "@/lib/auth"
import type { SessionUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  // Verify state for CSRF protection
  const storedState = request.cookies.get("oauth_state")?.value

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL("/?error=invalid_state", request.url))
  }

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code)
  if (!tokens) {
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url))
  }

  // Get user info
  const discordUser = await getDiscordUser(tokens.access_token)
  if (!discordUser) {
    return NextResponse.redirect(new URL("/?error=user_fetch_failed", request.url))
  }

  const isAdmin = checkIsAdmin(discordUser.id)

  // Create session
  const sessionUser: SessionUser = {
    id: `user_${discordUser.id}`,
    discordId: discordUser.id,
    username: discordUser.global_name || discordUser.username,
    email: discordUser.email,
    avatar: getAvatarUrl(discordUser),
    membership: isAdmin ? "admin" : "free",
    isAdmin,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  }

  const sessionToken = await createSessionToken(sessionUser)

  // Redirect to dashboard or admin based on role
  const redirectUrl = isAdmin ? "/admin" : "/dashboard"
  const response = NextResponse.redirect(new URL(redirectUrl, request.url))

  // Clear OAuth state cookie and set session cookie on response
  response.cookies.delete("oauth_state")
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}
