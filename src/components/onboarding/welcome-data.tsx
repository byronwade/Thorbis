import { redirect } from "next/navigation";
import { WelcomePageClientAdvanced } from "@/components/onboarding/welcome-page-client-advanced";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

type OnboardingProgress = {
  currentStep?: number;
  [key: string]: unknown;
};

type WelcomeDataProps = {
  isCreatingNewCompany: boolean;
};

/**
 * Welcome Data - Async Server Component
 *
 * Fetches all onboarding data and renders the welcome page.
 * This streams in after the shell renders.
 */
export async function WelcomeData({ isCreatingNewCompany }: WelcomeDataProps) {
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

  // Get the active company ID (if any)
  const activeCompanyId = await getActiveCompanyId();

  // Check if user has ANY active company with payment
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select(
      "company_id, companies!inner(id, name, stripe_subscription_status, onboarding_progress, onboarding_completed_at)"
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .is("companies.deleted_at", null);

  // biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
  const hasActiveCompany = teamMembers?.some((tm: any) => {
    const companies = Array.isArray(tm.companies)
      ? tm.companies[0]
      : tm.companies;
    const status = companies?.stripe_subscription_status;
    const onboardingProgress =
      (companies?.onboarding_progress as Record<string, unknown>) || null;
    const onboardingComplete = isOnboardingComplete({
      progress: onboardingProgress,
      completedAt: companies?.onboarding_completed_at ?? null,
    });
    return (status === "active" || status === "trialing") && onboardingComplete;
  });

  // If user has an active company and is NOT explicitly creating a new one,
  // redirect them to the main dashboard
  if (hasActiveCompany && !isCreatingNewCompany) {
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
      const onboardingProgress =
        (company.onboarding_progress as OnboardingProgress) || {};
      const currentStep =
        typeof onboardingProgress.currentStep === "number"
          ? onboardingProgress.currentStep
          : 1;
      const onboardingComplete = isOnboardingComplete({
        progress: onboardingProgress,
        completedAt: company.onboarding_completed_at ?? null,
      });

      // Only return if onboarding is incomplete
      if (!(hasPayment && onboardingComplete)) {
        // Parse address
        const addressParts =
          company.address?.split(",").map((s: string) => s.trim()) || [];

        incompleteCompany = {
          id: company.id,
          name: company.name,
          industry: company.industry || "",
          size: company.company_size || "",
          phone: company.phone || "",
          email: company.email || "",
          support_email: company.support_email || "",
          support_phone: company.support_phone || "",
          legal_name: company.legal_name || company.name || "",
          doing_business_as: company.doing_business_as || company.name || "",
          brand_color: company.brand_color || null,
          ein: company.ein || null,
          address: addressParts[0] || "",
          city: addressParts[1] || "",
          state: addressParts[2] || "",
          zipCode: addressParts[3] || "",
          website: company.website || "",
          taxId: company.tax_id || "",
          logo: company.logo || null,
          onboardingProgress,
          currentStep,
          trialEndsAt: company.trial_ends_at || null,
          subscriptionStatus,
          hasPayment,
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

  let emailInfrastructure: {
    domain: Record<string, unknown> | null;
    inboundRoute: Record<string, unknown> | null;
  } | null = null;

  if (activeCompanyId) {
    const [{ data: domain }, { data: inboundRoute }] = await Promise.all([
      supabase
        .from("communication_email_domains")
        .select("domain, status, last_synced_at")
        .eq("company_id", activeCompanyId)
        .order("created_at", { ascending: false })
        .maybeSingle(),
      supabase
        .from("communication_email_inbound_routes")
        .select("route_address, status, destination_url")
        .eq("company_id", activeCompanyId)
        .maybeSingle(),
    ]);

    emailInfrastructure = {
      domain: domain ?? null,
      inboundRoute: inboundRoute ?? null,
    };
  }

  return (
    <WelcomePageClientAdvanced
      emailInfrastructure={emailInfrastructure}
      hasActiveCompany={hasActiveCompany ?? false}
      incompleteCompany={incompleteCompany}
      user={userProps}
    />
  );
}
