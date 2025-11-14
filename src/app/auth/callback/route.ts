import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth Callback Route - Handles OAuth and Email Verification Redirects
 *
 * This route is called by Supabase after:
 * - OAuth provider authentication (Google, Facebook, etc.)
 *   - Handles both NEW signups and EXISTING user logins
 *   - Supabase automatically determines if user exists
 * - Email verification link clicks
 * - Password reset link clicks
 *
 * After successful authentication, checks if user profile is complete:
 * - If missing phone or name → Redirect to /complete-profile
 * - If complete → Redirect to dashboard
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

      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(exchangeError.message)}`
        );
      }

      if (data.user) {
        // Check if user profile is complete
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("phone, name")
          .eq("id", data.user.id)
          .single();

        console.log("📋 OAuth Callback - Profile check:", {
          userId: data.user.id,
          email: data.user.email,
          hasProfile: !!profile,
          profileError: profileError?.message,
          phone: profile?.phone || "MISSING",
          name: profile?.name || "MISSING",
          isComplete: !!(profile?.phone && profile?.name),
        });

        // If missing required fields, redirect to complete profile
        if (!(profile?.phone && profile?.name)) {
          console.log(
            "⚠️ Profile incomplete - redirecting to /complete-profile"
          );
          return NextResponse.redirect(`${requestUrl.origin}/complete-profile`);
        }

        console.log("✅ Profile complete - redirecting to dashboard");
      }

      // Successfully authenticated with complete profile
      // Check if user has an active company to determine redirect
      const { data: hasCompany } = await supabase
        .from("team_members")
        .select("company_id")
        .eq("user_id", data.user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      const redirectPath = hasCompany ? "/dashboard" : "/dashboard/welcome";
      console.log(
        `✅ Redirecting to ${redirectPath} (hasCompany: ${!!hasCompany})`
      );

      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
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
