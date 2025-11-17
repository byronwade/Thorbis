import { NextResponse } from "next/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Check onboarding status for the ACTIVE company
 * Returns company ID and payment status for the currently active company
 * This is company-specific, not user-specific
 *
 * SECURITY: Uses service role because:
 * - Query filters to user's own membership (user_id = authenticated user)
 * - JOIN to companies table causes RLS recursion with anon key
 * - User only sees their own team_members record
 */
export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Get the active company ID (from cookie or first available)
		const activeCompanyId = await getActiveCompanyId();

		if (!activeCompanyId) {
			// No active company - user needs to create one
			return NextResponse.json({
				companyId: null,
				hasPayment: false,
				needsOnboarding: true,
			});
		}

		// Use service role to bypass RLS recursion on JOIN
		// Query is safe: explicitly filtered to user's own record
		const supabase = await createServiceSupabaseClient();

		// Check the ACTIVE company's payment status
		const { data: teamMember } = await supabase
			.from("team_members")
			.select(
				"company_id, companies!inner(stripe_subscription_status, onboarding_progress, onboarding_completed_at)"
			)
			.eq("user_id", user.id)
			.eq("company_id", activeCompanyId)
			.eq("status", "active")
			.maybeSingle();

		if (!teamMember) {
			// User doesn't have access to active company - reset to no company
			return NextResponse.json({
				companyId: null,
				hasPayment: false,
				needsOnboarding: true,
			});
		}

		const companies = Array.isArray(teamMember.companies)
			? teamMember.companies[0]
			: teamMember.companies;
		const subscriptionStatus = companies?.stripe_subscription_status;
		const subscriptionActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";
		const onboardingProgress = (companies?.onboarding_progress as Record<string, unknown>) || null;
		const onboardingComplete = isOnboardingComplete({
			progress: onboardingProgress,
			completedAt: companies?.onboarding_completed_at ?? null,
		});
		const hasPayment = subscriptionActive && onboardingComplete;

		return NextResponse.json({
			companyId: teamMember.company_id,
			hasPayment,
			subscriptionStatus,
			needsOnboarding: !onboardingComplete,
		});
	} catch (_error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
