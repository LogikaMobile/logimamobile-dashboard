import { auth } from "../auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const path = req.nextUrl.pathname

  console.log("MIDDLEWARE: path=", path, "isLoggedIn=", isLoggedIn, "role=", role);

  if (!isLoggedIn && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If logged in but has no role (e.g. session cookie from another app on the same domain)
  if (isLoggedIn && !role && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url))
  }

  // If already logged in AND has a role, redirect away from login page
  if (isLoggedIn && role && path.startsWith('/login')) {
    if (role === 'ENGINEER') {
      return NextResponse.redirect(new URL('/apps/board', req.url))
    }
    return NextResponse.redirect(new URL('/apps/projects/dashboard', req.url))
  }

  if (isLoggedIn && role === 'ENGINEER') {
    // Restrict access to projects dashboard and personal hr dashboard
    if (path.startsWith('/apps/projects/dashboard') || path.startsWith('/apps/personal') || path === '/') {
      return NextResponse.redirect(new URL('/apps/board', req.url))
    }
  }

  if (isLoggedIn && path === '/') {
    return NextResponse.redirect(new URL('/apps/projects/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
