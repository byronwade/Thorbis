/**
 * Estimate Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all estimate data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Estimate data
 * - Customer data
 * - Job data
 * - Invoice data (if converted)
 * - Contract data (workflow timeline)
 * - Activity log
 * - Notes
 * - Attachments
 *
 * Total: 8 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { EstimatePageContent } from "@/components/work/estimates/estimate-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { generateEstimateStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type EstimateDetailDataProps = {
	estimateId: string;
};

export async function EstimateDetailData({ estimateId }: EstimateDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	// Check if active company has completed onboarding
	const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

	if (!isOnboardingComplete) {
		redirect("/dashboard/welcome");
	}

	// Get active company ID
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard/welcome");
	}

	// First fetch the estimate without joins to check basic access
	const { data: estimate, error: estimateError } = await supabase
		.from("estimates")
		.select("*")
		.eq("id", estimateId)
		.is("deleted_at", null)
		.maybeSingle();

	if (estimateError || !estimate) {
		return notFound();
	}

	if (estimate.company_id !== activeCompanyId) {
		return notFound();
	}

	// Now fetch related data separately to avoid join issues
	const [{ data: customer }, { data: job }, { data: invoice }] = await Promise.all([
		// Fetch customer
		estimate.customer_id
			? supabase.from("customers").select("*").eq("id", estimate.customer_id).maybeSingle()
			: Promise.resolve({ data: null }),
		// Fetch job
		estimate.job_id
			? supabase.from("jobs").select("*").eq("id", estimate.job_id).maybeSingle()
			: Promise.resolve({ data: null }),
		// Fetch invoice (if this estimate was converted)
		supabase
			.from("invoices")
			.select("*")
			.eq("converted_from_estimate_id", estimateId)
			.is("deleted_at", null)
			.maybeSingle(),
	]);

	// Fetch all related data (including contract for workflow timeline)
	const [{ data: contract }, { data: activities }, { data: notes }, { data: attachments }] =
		await Promise.all([
			// Fetch contract generated from this estimate
			supabase
				.from("contracts")
				.select("*")
				.eq("estimate_id", estimateId)
				.is("deleted_at", null)
				.maybeSingle(),
			supabase
				.from("activity_log")
				.select("*, user:users!user_id(*)")
				.eq("entity_type", "estimate")
				.eq("entity_id", estimateId)
				.order("created_at", { ascending: false })
				.limit(50),
			supabase
				.from("notes")
				.select("*")
				.eq("entity_type", "estimate")
				.eq("entity_id", estimateId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false }),
			supabase
				.from("attachments")
				.select("*")
				.eq("entity_type", "estimate")
				.eq("entity_id", estimateId)
				.order("created_at", { ascending: false }),
		]);

	const estimateData = {
		estimate,
		customer,
		job,
		invoice,
		contract, // for workflow timeline
		activities: activities || [],
		notes: notes || [],
		attachments: attachments || [],
	};

	// Calculate metrics for stats bar
	const lineItems = estimate.line_items
		? typeof estimate.line_items === "string"
			? JSON.parse(estimate.line_items)
			: estimate.line_items
		: [];

	// Calculate days until expiry
	const daysUntilExpiry = estimate.valid_until
		? Math.ceil((new Date(estimate.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
		: null;

	const metrics = {
		totalAmount: estimate.total_amount || 0,
		lineItemsCount: lineItems.length,
		status: estimate.status || "draft",
		validUntil: estimate.valid_until,
		daysUntilExpiry,
		isAccepted: estimate.status === "accepted",
	};

	// Generate stats for toolbar
	const stats = generateEstimateStats(metrics);

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<EstimatePageContent entityData={estimateData} metrics={metrics} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
