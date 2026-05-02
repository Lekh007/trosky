/**
 * JWT signing keys shared by Edge middleware and Node route handlers.
 * Edge-safe: only TextEncoder + process.env (no Node-only APIs).
 */

function secretBytes(
  envName: "JWT_SECRET" | "JWT_REFRESH_SECRET",
  devFallback: string
): Uint8Array {
  const value = process.env[envName];
  if (!value) {
    const requireSecret =
      process.env.NODE_ENV === "production" &&
      typeof window === "undefined" &&
      !process.env.NEXT_PHASE;

    if (requireSecret) {
      throw new Error(`Missing required environment variable: ${envName}`);
    }
    return new TextEncoder().encode(devFallback);
  }
  return new TextEncoder().encode(value);
}

/** Access token: must match middleware verification and landing-page token checks. */
export function jwtAccessSecretBytes(): Uint8Array {
  return secretBytes("JWT_SECRET", "dev-jwt_secret-unsafe");
}

/** Refresh token (API routes only; not used in middleware). */
export function jwtRefreshSecretBytes(): Uint8Array {
  return secretBytes("JWT_REFRESH_SECRET", "dev-jwt_refresh_secret-unsafe");
}
