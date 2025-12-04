import { NextResponse } from "next/server"

// Pass-through Proxy (renamed from Middleware)
export function proxy() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except for:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
