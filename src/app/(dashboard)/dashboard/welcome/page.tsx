/**
 * Welcome Page - Onboarding Entry Point
 *
 * Server Component - Handles authentication and data fetching
 *
 * Access Control:
 * - New users (no company/incomplete payment): ONLY page they can access
 * - Existing users (with active company): Can access anytime without restrictions
 *
 * Features:
 * - Beautiful, modern onboarding flow
 * - Step-by-step company setup
 * - Team member management
 * - Bank account connection
 * - Payment processing
 */

import { redirect } from "next/navigation";
import { WelcomePageClientAdvanced } from "@/components/onboarding/welcome-page-client-advanced";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  // Server-side authentication check
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?message=Please log in to continue");
  }

  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-bold text-2xl">Database Not Configured</h1>
          <p className="text-muted-foreground">
            Please configure your database to continue.
          </p>
        </div>
      </div>
    );
  }

  // Check if user is explicitly creating a new company
  const params = await searchParams;
  const isCreatingNewCompany = params.new === "true";

  // Get the active company ID (if any)
  const activeCompanyId = await getActiveCompanyId();

  // Check if user has ANY active company with payment
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("company_id, companies!inner(id, name, stripe_subscription_status)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .is("companies.deleted_at", null);

  const hasActiveCompany = teamMembers?.some((tm: any) => {
    const companies = Array.isArray(tm.companies)
      ? tm.companies[0]
      : tm.companies;
    const status = companies?.stripe_subscription_status;
    return status === "active" || status === "trialing";
  });

  // If user has an active company and is NOT explicitly creating a new one,
  // redirect them to the main dashboard
  if (hasActiveCompany && !isCreatingNewCompany) {
    console.log(
      `✅ User has active company - redirecting to dashboard (company: ${activeCompanyId})`
    );
    redirect("/dashboard");
  }

  // Fetch incomplete company data if exists
  let incompleteCompany = null;
  if (activeCompanyId) {
    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .eq("id", activeCompanyId)
      .is("deleted_at", null)
      .maybeSingle();

    if (company) {
      const subscriptionStatus = company.stripe_subscription_status;
      const hasPayment =
        subscriptionStatus === "active" || subscriptionStatus === "trialing";

      // Only return if payment is incomplete
      if (!hasPayment) {
        // Parse address
        const addressParts =
          company.address?.split(",").map((s: string) => s.trim()) || [];

        const onboardingProgress = (company.onboarding_progress as any) || {};

        incompleteCompany = {
          id: company.id,
          name: company.name,
          industry: company.industry || "",
          size: company.company_size || "",
          phone: company.phone || "",
          address: addressParts[0] || "",
          city: addressParts[1] || "",
          state: addressParts[2] || "",
          zipCode: addressParts[3] || "",
          website: company.website || "",
          taxId: company.tax_id || "",
          logo: company.logo || null,
          onboardingProgress,
          // Determine which step to resume from based on completed steps
          currentStep: onboardingProgress.currentStep || 1,
        };
      }
    }
  }

  // Get user info for pre-filling
  const { data: userData } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", user.id)
    .maybeSingle();

  const userProps = {
    id: user.id,
    email: user.email || userData?.email || "",
    name: user.user_metadata?.full_name || userData?.name || "",
  };

  return (
    <WelcomePageClientAdvanced
      hasActiveCompany={hasActiveCompany ?? false}
      incompleteCompany={incompleteCompany}
      user={userProps}
    />
  );
}
