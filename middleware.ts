import { getIronSession } from "iron-session/edge";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const cookieOptions = {
    cookieName: "minitwittersession",
    password: process.env.COOKIE_PASSWORD!,
  };

  const session = await getIronSession(req, res, cookieOptions);
  // if (userAgent(req).isBot) {
  //   return new Response("Please don't be a bot. Be human", { status: 403 });
  // }

  //check if user is logged in or not, then redirect to enter or home
  if (!req.url.includes("/api") && !req.url.includes("/_next/image")) {
    //if user is MISSING and tries to get in
    if (!session.user && !req.url.includes("/enter")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }

    //if user is AUTH, but tries to go to enter
    // if (session.user && session.user.auth && req.url.includes("/enter")) {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    // //if user is PRESENT but not SETUP, and tries to get in
    // if (session.user && !session.user.setup) {
    //   if (req.url.includes("/setup") || req.url.includes("/enter")) {
    //     return;
    //   } else {
    //     return NextResponse.redirect(new URL("/setup", req.url));
    //   }
    // }
    // //if user is SETUP and tries to go to enter or setup page
    // if (
    //   session.user &&
    //   session.user.setup &&
    //   (req.url.includes("/enter") || req.url.includes("/setup"))
    // ) {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    // if (req.nextUrl.pathname === "/profile") {
    //   return NextResponse.redirect(
    //     new URL(`/profile/${session.user?.id}`, req.url)
    //   );
    // }
    // if (req.nextUrl.pathname === "/tweet") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }
  }
}
