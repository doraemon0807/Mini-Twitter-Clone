import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  //check if user is logged in or not, then redirect to enter or home
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.has("minitwittersession")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
    if (req.url.includes("/enter") && req.cookies.has("minitwittersession")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
