import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("session")
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // API routes protection
  if (pathname.startsWith("/api/download") || pathname.startsWith("/api/upload")) {
    const session = request.cookies.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Rate limiting headers
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/api/download/:path*", "/api/upload/:path*", "/upload"],
}
