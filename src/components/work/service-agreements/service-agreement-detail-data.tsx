/**
 * Service Agreement Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all service agreement data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Service agreement/plan data (with customer & property)
 * - Generated invoices
 * - Related jobs
 * - Equipment covered
 * - Activity log
 * - Notes
 * - Attachments
 *
 * Total: 7 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import type { StatCard } from "@/components/ui/stats-cards";
import { ServiceAgreementPageContent } from "@/components/work/service-agreements/service-agreement-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { formatCurrency } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/server";

type ServiceAgreementDetailDataProps = {
	agreementId: string;
};

export async function ServiceAgreementDetailData({ agreementId }: ServiceAgreementDetailDataProps) {
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

	// Fetch service agreement
	const { data: agreement, error: agreementError } = await supabase
		.from("service_plans")
		.select(`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*)
    `)
		.eq("id", agreementId)
		.eq("type", "contract")
		.is("deleted_at", null)
		.single();

	if (agreementError || !agreement) {
		return notFound();
	}

	if (agreement.company_id !== activeCompanyId) {
		return notFound();
	}

	// Get related data
	const customer = Array.isArray(agreement.customer) ? agreement.customer[0] : agreement.customer;
	const property = Array.isArray(agreement.property) ? agreement.property[0] : agreement.property;

	// Fetch all related data in parallel
	const [
		{ data: invoices },
		{ data: jobs },
		{ data: equipment },
		{ data: activities },
		{ data: notes },
		{ data: attachments },
	] = await Promise.all([
		// Generated invoices
		supabase
			.from("invoices")
			.select("id, invoice_number, total_amount, status, created_at")
			.eq("company_id", activeCompanyId)
			.or(`metadata->>'service_agreement_id'.eq.${agreementId},metadata->>'service_plan_id'.eq.${agreementId}`)
			.order("created_at", { ascending: false })
			.limit(20),
		// Related jobs
		supabase
			.from("jobs")
			.select("id, job_number, title, status, completed_at")
			.eq("company_id", activeCompanyId)
			.or(`metadata->>'service_agreement_id'.eq.${agreementId},metadata->>'service_plan_id'.eq.${agreementId}`)
			.order("created_at", { ascending: false })
			.limit(20),
		// Equipment covered
		agreement.property_id
			? supabase.from("equipment").select("*").eq("property_id", agreement.property_id).is("deleted_at", null)
			: Promise.resolve({ data: [], error: null }),
		// Activity log
		supabase
			.from("activity_log")
			.select("*, user:users!user_id(*)")
			.eq("entity_type", "service_plan")
			.eq("entity_id", agreementId)
			.order("created_at", { ascending: false })
			.limit(50),
		// Notes
		supabase
			.from("notes")
			.select("*")
			.eq("entity_type", "service_plan")
			.eq("entity_id", agreementId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false }),
		// Attachments
		supabase
			.from("attachments")
			.select("*")
			.eq("entity_type", "service_plan")
			.eq("entity_id", agreementId)
			.order("created_at", { ascending: false }),
	]);

	const agreementData = {
		agreement,
		customer,
		property,
		invoices: invoices || [],
		jobs: jobs || [],
		equipment: equipment || [],
		activities: activities || [],
		notes: notes || [],
		attachments: attachments || [],
	};

	// Calculate metrics
	const totalRevenue = (invoices || []).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
	const completedJobs = (jobs || []).filter((j) => j.completed_at).length;
	const activeJobs = (jobs || []).filter((j) => j.status === "in_progress").length;

	const stats: StatCard[] = [
		{
			label: "Total Revenue",
			value: formatCurrency(totalRevenue),
			change: 0,
			changeLabel: "from this agreement",
		},
		{
			label: "Completed Jobs",
			value: completedJobs,
			change: 0,
			changeLabel: "services delivered",
		},
		{
			label: "Active Jobs",
			value: activeJobs,
			change: 0,
			changeLabel: "in progress",
		},
		{
			label: "Equipment",
			value: (equipment || []).length,
			change: 0,
			changeLabel: "covered items",
		},
	];

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<ServiceAgreementPageContent entityData={agreementData} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
