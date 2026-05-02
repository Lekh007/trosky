import type { NextResponse } from "next/server";

/** Shared auth cookie flags for login, refresh, and logout (Route Handlers). */
export const AUTH_COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function attachAuthSessionCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  res.cookies.set("access_token", accessToken, {
    ...AUTH_COOKIE_BASE,
    maxAge: 15 * 60,
  });
  res.cookies.set("refresh_token", refreshToken, {
    ...AUTH_COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthSessionCookies(res: NextResponse): void {
  res.cookies.set("access_token", "", { ...AUTH_COOKIE_BASE, maxAge: 0 });
  res.cookies.set("refresh_token", "", { ...AUTH_COOKIE_BASE, maxAge: 0 });
}
