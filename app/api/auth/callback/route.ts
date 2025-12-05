import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForTokens, getDiscordUser, getAvatarUrl, createSessionToken, checkIsAdmin } from "@/lib/auth"
import type { SessionUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  const storedState = request.cookies.get("oauth_state")?.value

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL("/?error=invalid_state", request.url))
  }

  const tokens = await exchangeCodeForTokens(code)
  if (!tokens) {
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url))
  }

  const discordUser = await getDiscordUser(tokens.access_token)
  if (!discordUser) {
    return NextResponse.redirect(new URL("/?error=user_fetch_failed", request.url))
  }

  const isAdmin = checkIsAdmin(discordUser.id)

  let dbUser = await prisma.user.findUnique({
    where: { discordId: discordUser.id }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        discordId: discordUser.id,
        username: discordUser.global_name || discordUser.username,
        email: discordUser.email,
        avatar: getAvatarUrl(discordUser),
        membership: isAdmin ? "admin" : "free",
        isAdmin,
        coins: 100,
      }
    })

    await prisma.coinTransaction.create({
      data: {
        userId: discordUser.id,
        amount: 100,
        type: "registration",
        description: "Welcome bonus"
      }
    })
  } else {
    await prisma.user.update({
      where: { discordId: discordUser.id },
      data: {
        username: discordUser.global_name || discordUser.username,
        email: discordUser.email,
        avatar: getAvatarUrl(discordUser),
      }
    })
  }

  const sessionUser: SessionUser = {
    id: `user_${discordUser.id}`,
    discordId: discordUser.id,
    username: dbUser.username,
    email: dbUser.email,
    avatar: dbUser.avatar || getAvatarUrl(discordUser),
    membership: dbUser.membership as "free" | "vip" | "admin",
    isAdmin: dbUser.isAdmin,
    coins: dbUser.coins,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  }

  const sessionToken = await createSessionToken(sessionUser)

  const redirectUrl = isAdmin ? "/admin" : "/dashboard"
  const response = NextResponse.redirect(new URL(redirectUrl, request.url))

  response.cookies.delete("oauth_state")
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}
