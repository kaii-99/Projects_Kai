// lib/session.ts
import { withIronSessionApiRoute } from "iron-session/next";
import { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,  // Ensure you set this in your .env file
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Secure only in production
  },
};

// Wrapper for API routes to use session
export function withSession(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Extend request types
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      email: string;
      username: string;
      role: string;
    };
  }
}
