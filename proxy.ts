/**
 * Next.js 16+ Proxy - Minimal Configuration
 *
 * This file is REQUIRED for Next.js 16 to generate manifest files.
 * Without it, the dev server crashes with "Cannot find middleware-manifest.json"
 */

import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Minimal proxy - just pass through
  // Auth is handled by Supabase client-side and Server Actions
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
