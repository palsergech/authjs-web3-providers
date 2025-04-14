import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is not authenticated and trying to access protected routes
    if (!req.nextauth.token && req.nextUrl.pathname !== "/hello" && req.nextUrl.pathname !== "/signin") {
      return NextResponse.redirect(new URL("/hello", req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Specify which routes to protect
export const config = {
  matcher: [
    "/"
  ],
} 