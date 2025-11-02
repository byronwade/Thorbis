import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth Callback Route - Handles OAuth and Email Verification Redirects
 *
 * This route is called by Supabase after:
 * - OAuth provider authentication (Google, Facebook, etc.)
 * - Email verification link clicks
 * - Password reset link clicks
 *
 * Next.js 16+ compliant with async request APIs
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("Auth callback error:", error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // Exchange code for session
  if (code) {
    try {
      const supabase = await createClient();

      if (!supabase) {
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent("Authentication service not configured")}`
        );
      }

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(exchangeError.message)}`
        );
      }

      // Successfully authenticated - redirect directly to dashboard
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent("An unexpected error occurred")}`
      );
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
