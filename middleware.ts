import { getIronSession } from "iron-session/edge";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

const cookieOptions = {
  cookieName: "minitwittersession",
  password: process.env.COOKIE_PASSWORD!,
};

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, cookieOptions);

  //check if user is logged in or not, then redirect to enter or home
  if (!req.url.includes("/api")) {
    //if user is MISSING and tries to get in
    if (!session.user && !req.url.includes("/enter")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
    //if user is PRESENT but not SETUP, and tries to get in
    if (session.user && !session.user.setup && !req.url.includes("/setup")) {
      return NextResponse.redirect(new URL("/setup", req.url));
    }
    //if user is SETUP and tries to go to enter or setup page
    if (
      session.user &&
      session.user.setup &&
      (req.url.includes("/enter") || req.url.includes("/setup"))
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname === "/profile") {
      return NextResponse.redirect(
        new URL(`/profile/${session.user?.id}`, req.url)
      );
    }
  }
}
