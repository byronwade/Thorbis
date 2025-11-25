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
import { getEstimateComplete } from "@/lib/queries/estimates";
import { generateEstimateStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type EstimateDetailDataProps = {
	estimateId: string;
};

export async function EstimateDetailData({
	estimateId,
}: EstimateDetailDataProps) {
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
		redirect("/dashboard");
	}

	// Get active company ID
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard");
	}

	// Fetch complete estimate data with tags via RPC (single optimized query)
	const estimateData = await getEstimateComplete(estimateId, activeCompanyId);

	if (!estimateData) {
		return notFound();
	}

	// Extract data from RPC response
	const estimate = estimateData;
	const customer = estimateData.customer;
	const job = estimateData.job;
	const property = estimateData.property;

	// Fetch invoice separately (not in RPC yet)
	const { data: invoice } = await supabase
		.from("invoices")
		.select("*")
		.eq("converted_from_estimate_id", estimateId)
		.is("deleted_at", null)
		.maybeSingle();

	// Fetch all related data (including contract for workflow timeline)
	const [
		{ data: contract },
		{ data: activities },
		{ data: notes },
		{ data: attachments },
	] = await Promise.all([
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

	const completeEstimateData = {
		estimate,
		customer,
		job,
		property,
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
		? Math.ceil(
				(new Date(estimate.valid_until).getTime() - Date.now()) /
					(1000 * 60 * 60 * 24),
			)
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
					<EstimatePageContent
						entityData={completeEstimateData}
						metrics={metrics}
					/>
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
