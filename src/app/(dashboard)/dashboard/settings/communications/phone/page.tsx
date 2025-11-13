/**
 * Settings > Communications > Phone Page - Advanced VoIP System
 *
 * Server Component that checks company membership before rendering
 * Prevents "Company not found" errors by validating access
 *
 * Features:
 * - Comprehensive call routing and extension management
 * - Team member extension assignment and configuration
 * - Vacation mode and holiday scheduling
 * - Advanced voicemail settings with greeting management
 * - Call flow designer with visual routing builder
 * - Business hours configuration
 * - Call analytics and reporting
 */

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PhoneSettingsClient } from "./phone-settings-client";

export default async function PhoneSettingsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Please log in to access phone settings");
  }

  // Check for company membership
  const { data: teamMember, error: teamError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (teamError || !teamMember?.company_id) {
    // User doesn't have an active company membership
    // Redirect to welcome/onboarding instead of showing 404
    redirect(
      "/dashboard/welcome?message=Please complete onboarding to access phone settings"
    );
  }

  // User has valid company membership, render the client component
  return <PhoneSettingsClient />;
}
