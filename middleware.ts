import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // For admin routes, require authentication
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    
    // For signup route, we'll handle setup status in the page component
    // since middleware can't easily check database state
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For admin routes, require token
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        // For signup route, allow access (setup status checked in component)
        if (req.nextUrl.pathname === '/signup') {
          return true;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/signup"
  ]
}; 