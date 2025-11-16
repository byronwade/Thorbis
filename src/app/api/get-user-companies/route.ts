import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ error: "Database not configured" }, { status: 500 });
		}

		// Fetch user's companies via team_members join
		// Exclude archived companies (deleted_at IS NULL)
		const { data: memberships, error } = await supabase
			.from("team_members")
			.select(
				`
				company_id,
				companies!inner (
					id,
					name,
					stripe_subscription_status,
					onboarding_progress,
					onboarding_completed_at,
					deleted_at
				)
			`
			)
			.eq("user_id", user.id)
			.eq("status", "active")
			.is("companies.deleted_at", null); // Exclude archived companies

		if (error) {
			return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
		}

		// Map to simplified structure with onboarding status
		// Deduplicate by company ID in case of multiple team_member records
		const companyMap = new Map<
			string,
			{
				id: string;
				name: string;
				plan: string;
				onboardingComplete: boolean;
				hasPayment: boolean;
			}
		>();

		memberships?.forEach((m: any) => {
			const companyId = m.companies.id;
			if (!companyMap.has(companyId)) {
				const subscriptionStatus = m.companies.stripe_subscription_status;
				const onboardingProgress = (m.companies.onboarding_progress as Record<string, unknown>) || null;
				const onboardingComplete = isOnboardingComplete({
					progress: onboardingProgress,
					completedAt: m.companies.onboarding_completed_at ?? null,
				});
				const hasPayment = subscriptionStatus === "active" || subscriptionStatus === "trialing";

				let planLabel = "Active";
				if (!(hasPayment && onboardingComplete)) {
					planLabel = subscriptionStatus === "incomplete" ? "Incomplete Onboarding" : "Setup Required";
				}

				companyMap.set(companyId, {
					id: companyId,
					name: m.companies.name,
					plan: planLabel,
					onboardingComplete,
					hasPayment,
				});
			}
		});

		const companies = Array.from(companyMap.values());

		// Add cache-busting headers to prevent stale data
		return NextResponse.json(companies, {
			headers: {
				"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			},
		});
	} catch (_error) {
    console.error("Error:", _error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
