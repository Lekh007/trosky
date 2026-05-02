import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { JWTPayload } from "@hotel-pricing/shared";

function getSecret(name: string): Uint8Array {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === "production" && typeof window === "undefined" && !process.env.NEXT_PHASE) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return new TextEncoder().encode(`dev-${name.toLowerCase()}-unsafe`);
  }
  return new TextEncoder().encode(value);
}

function getJwtSecret() { return getSecret("getJwtSecret()"); }
function getJwtRefreshSecret() { return getSecret("getJwtRefreshSecret()"); }

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

export async function createAccessToken(payload: {
  sub: string;
  email: string;
  role: "ANALYST" | "CLIENT";
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getJwtSecret());
}

export async function createRefreshToken(payload: {
  sub: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(getJwtRefreshSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtRefreshSecret());
    return payload as unknown as { sub: string };
  } catch {
    return null;
  }
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;
  return verifyAccessToken(accessToken);
}
