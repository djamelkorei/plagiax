import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerUser, verifyToken } from "@/lib/auth.service";

const dashboardRoute = "/dashboard";

const instructorRoutes = ["/dashboard", "/dashboard/students"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDashboardPath = pathname.startsWith(dashboardRoute);
  const isValidToken = validateToken(req);

  // -------------------------------------------
  // 1. PROTECTED ROUTES (dashboard)
  // -------------------------------------------
  if (isDashboardPath) {
    if (!isValidToken) {
      // Must be logged in → redirect to login
      return createUnauthorizedResponse(req, pathname);
    }

    // Page authroization check
    if (instructorRoutes.filter((r) => pathname === r).length > 0) {
      const user = await getServerUser();
      if (!user?.is_instructor) {
        const redirectUrl = new URL("/dashboard/submissions", req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Valid token → allow access
    return NextResponse.next();
  }

  // -------------------------------------------
  // 2. PUBLIC ROUTES
  // If logged in and visiting login/register → redirect to dashboard
  // -------------------------------------------
  if (!isDashboardPath) {
    if (isValidToken) {
      return createAuthorizedResponse(req, pathname);
    }

    // Public page + no token → allow access
    return NextResponse.next();
  }

  // Fallback (should not happen)
  return NextResponse.next();
}

function validateToken(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return false;
  }

  // Decode + validate JWT
  return verifyToken(token);
}

// 🔧 Shared unauthorized handler — removes cookie
function createUnauthorizedResponse(req: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  const res = NextResponse.redirect(loginUrl);

  // 🔥 Remove cookie
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return res;
}

// 🔧 Shared authorized handler — removes cookie
function createAuthorizedResponse(req: NextRequest, pathname: string) {
  const loginUrl = new URL("/dashboard", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard:path*",
    "/reset-password:path*",
    "/forget-password:path*",
    "/login:path*",
    "/register:path*",
  ],
};
