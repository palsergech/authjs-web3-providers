import { NextResponse, NextRequest     } from "next/server"
import { withAuth } from "next-auth/middleware"

async function middleware(req: NextRequest) {
  console.log('middleware', req.nextUrl.pathname)
  const token = req.cookies.get('next-auth.session-token')?.value
  console.log('middleware token', token)
  const url = req.nextUrl.clone()
  if (!token && url.pathname !== '/landing' && !url.pathname.startsWith('/signin')) {
    url.pathname = '/landing'
    return NextResponse.redirect(url)
  }
}

export default withAuth(middleware, {
  callbacks: {
    async authorized() {
      // This is a work-around for handling redirect on auth pages.
      // We return true here so that the middleware function above
      // is always called.
      return true
    },
  },
})

export const config = {
  matcher: '/((?!api|_next|fonts|static|images|public|favicon.ico).*)',
}