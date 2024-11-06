import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  const isLoggedIn = !!token
  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isOnLoginPage = request.nextUrl.pathname.startsWith('/login')

  // Redirect authenticated users away from login page
  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect dashboard routes
  if (isOnDashboard) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Optional: Check for admin role
    if (token?.role !== 'admin') {
      return new NextResponse(null, { status: 403 })
    }
  }

  return NextResponse.next()
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ]
}