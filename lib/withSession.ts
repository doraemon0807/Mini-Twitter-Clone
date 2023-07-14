import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      setup?: boolean;
    };
  }
}

export const cookieOptions = {
  cookieName: "minitwittersession",
  password: "98nv94p3nq49ou92q4nu3v2mfjv98qht9824nb9p42n3vmi4j3q",
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions);
}
