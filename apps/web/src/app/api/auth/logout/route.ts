import { NextResponse } from "next/server";
import { clearAuthSessionCookies } from "@/lib/auth-cookies";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthSessionCookies(response);
  return response;
}
