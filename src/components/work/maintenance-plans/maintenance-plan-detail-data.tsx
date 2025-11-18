/**
 * Maintenance Plan Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all maintenance plan data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Maintenance plan data (with customer & property)
 * - Equipment linked to plan
 * - Generated jobs
 * - Scheduled appointments
 * - Generated invoices
 * - Activity log
 * - Notes
 * - Attachments
 *
 * Total: 9 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { MaintenancePlanPageContent } from "@/components/work/maintenance-plans/maintenance-plan-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

type MaintenancePlanDetailDataProps = {
	planId: string;
};

export async function MaintenancePlanDetailData({
	planId,
}: MaintenancePlanDetailDataProps) {
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

	// Fetch maintenance plan with all related data
	const { data: planRecord, error: planError } = await supabase
		.from("maintenance_plans")
		.select(
			`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*)
    `,
		)
		.eq("id", planId)
		.eq("company_id", activeCompanyId)
		.maybeSingle();

	if (planError || !planRecord) {
		return notFound();
	}

	const normalizedPlan = {
		...planRecord,
		price:
			planRecord.price ??
			(planRecord.amount !== null && planRecord.amount !== undefined
				? Math.round(Number(planRecord.amount) * 100)
				: 0),
		included_services:
			planRecord.included_services ?? planRecord.services_included ?? [],
		next_service_due:
			planRecord.next_service_due ?? planRecord.next_service_date ?? null,
		visits_per_term:
			planRecord.visits_per_term ?? planRecord.total_services_scheduled ?? 1,
		type: planRecord.type ?? "maintenance",
		taxable: planRecord.taxable ?? false,
	};

	// Get related data
	const customer = Array.isArray(normalizedPlan.customer)
		? normalizedPlan.customer[0]
		: normalizedPlan.customer;
	const property = Array.isArray(normalizedPlan.property)
		? normalizedPlan.property[0]
		: normalizedPlan.property;

	// Fetch equipment linked to this plan
	const { data: equipment } = await supabase
		.from("equipment")
		.select("*")
		.eq("service_plan_id", planId)
		.is("deleted_at", null);

	// Fetch all related data (including generated jobs and appointments)
	const [
		{ data: generatedJobs },
		{ data: scheduledAppointments },
		{ data: generatedInvoices },
		{ data: activities },
		{ data: notes },
		{ data: attachments },
	] = await Promise.all([
		// Fetch jobs generated from this maintenance plan
		supabase
			.from("jobs")
			.select(
				"id, job_number, title, status, completed_at, property:properties!property_id(id, name, address)",
			)
			.eq("company_id", activeCompanyId)
			.is("deleted_at", null)
			.or(
				`metadata->>'service_plan_id'.eq.${planId},metadata->>'maintenance_plan_id'.eq.${planId}`,
			)
			.order("created_at", { ascending: false })
			.limit(10),

		// Fetch scheduled appointments for equipment covered by this plan
		equipment && equipment.length > 0
			? supabase
					.from("appointments")
					.select(
						`
            id,
            scheduled_start,
            scheduled_end,
            status,
            type,
            job:jobs!job_id(id, job_number, title),
            property:properties!property_id(id, name, address)
          `,
					)
					.eq("company_id", activeCompanyId)
					.gte("scheduled_start", new Date().toISOString())
					.is("deleted_at", null)
					.order("scheduled_start", { ascending: true })
					.limit(10)
					.then(async (result) => {
						// Filter to appointments for equipment in this plan
						if (!result.data) {
							return result;
						}

						// biome-ignore lint/suspicious/noExplicitAny: Supabase query result
						const equipmentIds = equipment.map((e: any) => e.id);
						const jobIds = result.data
							// biome-ignore lint/suspicious/noExplicitAny: Supabase query result
							.map((s: any) => s.job_id)
							.filter(Boolean);

						if (jobIds.length === 0) {
							return { data: [], error: null };
						}

						const { data: relatedJobs } = await supabase
							.from("job_equipment")
							.select("job_id")
							.in("equipment_id", equipmentIds)
							.in("job_id", jobIds);

						const relatedJobIds = new Set(
							// biome-ignore lint/suspicious/noExplicitAny: Supabase query result
							relatedJobs?.map((j: any) => j.job_id) || [],
						);
						const filtered = result.data.filter(
							// biome-ignore lint/suspicious/noExplicitAny: Supabase query result
							(s: any) => s.job_id && relatedJobIds.has(s.job_id),
						);

						return { data: filtered, error: null };
					})
			: Promise.resolve({ data: [], error: null }),

		// Fetch invoices from jobs generated by this plan
		supabase
			.from("invoices")
			.select("id, invoice_number, total_amount, status, created_at")
			.eq("company_id", activeCompanyId)
			.or(
				`metadata->>'service_plan_id'.eq.${planId},metadata->>'maintenance_plan_id'.eq.${planId}`,
			)
			.order("created_at", { ascending: false })
			.limit(10),

		supabase
			.from("activity_log")
			.select("*, user:users!user_id(*)")
			.eq("entity_type", "service_plan")
			.eq("entity_id", planId)
			.order("created_at", { ascending: false })
			.limit(50),
		supabase
			.from("notes")
			.select("*")
			.eq("entity_type", "service_plan")
			.eq("entity_id", planId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false }),
		supabase
			.from("attachments")
			.select("*")
			.eq("entity_type", "service_plan")
			.eq("entity_id", planId)
			.order("created_at", { ascending: false }),
	]);

	const planData = {
		plan: normalizedPlan,
		customer,
		property,
		equipment: equipment || [],
		generatedJobs: generatedJobs || [],
		scheduledAppointments: scheduledAppointments || [],
		generatedInvoices: generatedInvoices || [],
		activities: activities || [],
		notes: notes || [],
		attachments: attachments || [],
	};

	return (
		<div className="flex h-full w-full flex-col overflow-auto">
			<div className="mx-auto w-full max-w-7xl">
				<MaintenancePlanPageContent entityData={planData} />
			</div>
		</div>
	);
}
