import { NextResponse } from "next/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Get incomplete company data for onboarding
 * Returns company details if active company has incomplete onboarding
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Get the active company ID
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      return NextResponse.json({ company: null });
    }

    // Fetch company data including onboarding progress
    // Exclude archived companies
    const { data: company, error } = await supabase
      .from("companies")
      .select("*, onboarding_progress")
      .eq("id", activeCompanyId)
      .is("deleted_at", null) // Exclude archived companies
      .maybeSingle();

    if (error || !company) {
      return NextResponse.json({ company: null });
    }

    // Only return if company has incomplete onboarding
    const subscriptionStatus = company.stripe_subscription_status;
    const hasPayment =
      subscriptionStatus === "active" || subscriptionStatus === "trialing";

    if (hasPayment) {
      return NextResponse.json({ company: null });
    }

    // Parse address into components
    // Address format: "123 Main St, San Francisco, CA, 94103"
    const addressParts =
      company.address?.split(",").map((s: string) => s.trim()) || [];
    const address = addressParts[0] || "";
    const city = addressParts[1] || "";
    const state = addressParts[2] || "";
    const zipCode = addressParts[3] || "";

    // Get onboarding progress
    const onboardingProgress =
      (company.onboarding_progress as Record<string, unknown>) || {};

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        industry: company.industry || "",
        size: company.company_size || "",
        phone: company.phone || "",
        address,
        city,
        state,
        zipCode,
        website: company.website || "",
        taxId: company.tax_id || "",
        logo: company.logo || null,
        onboardingProgress: {
          currentStep: onboardingProgress.currentStep || 1,
          step2: onboardingProgress.step2 || null, // Team members
          step3: onboardingProgress.step3 || null, // Phone number
          step4: onboardingProgress.step4 || null, // Notifications
          step5: onboardingProgress.step5 || null, // Billing (usually empty until payment)
        },
      },
    });
  } catch (error) {
    console.error("Error fetching incomplete company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
