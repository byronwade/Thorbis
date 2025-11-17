/**
 * Property Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all property data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Property data
 * - Customer data
 * - Jobs at property
 * - Equipment at property
 * - Schedules/appointments
 * - Estimates
 * - Invoices
 * - Maintenance plans
 * - Activity log
 * - Notes
 * - Attachments
 * - Communications
 *
 * Total: 12 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { PropertyPageContent } from "@/components/properties/property-details/property-page-content";
import { getActiveCompanyId, isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { generatePropertyStats } from "@/lib/stats/utils";
import { hasReportableError, isMissingColumnError } from "@/lib/supabase/error-helpers";
import { createClient } from "@/lib/supabase/server";

type PropertyDetailDataProps = {
	propertyId: string;
};

export async function PropertyDetailData({ propertyId }: PropertyDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get current user
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
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard/welcome");
	}

	// First fetch property to check if it exists
	const { data: property, error: propertyError } = await supabase
		.from("properties")
		.select("*")
		.eq("id", propertyId)
		.eq("company_id", activeCompanyId)
		.single();

	if (propertyError || !property) {
		return notFound();
	}

	// Then fetch all related data in parallel (including financial data for Property 360° view)
	const [
		customerResult,
		jobsResult,
		equipmentResult,
		schedulesResult,
		estimatesResult,
		invoicesResult,
		maintenancePlansResult,
		activitiesResult,
		notesResult,
		attachmentsResult,
	] = await Promise.all([
		// 1. Customer info
		property.customer_id
			? supabase
					.from("customers")
					.select("id, first_name, last_name, email, phone, company_name")
					.eq("id", property.customer_id)
					.single()
			: Promise.resolve({ data: null, error: null }),

		// 2. Jobs at this property
		supabase
			.from("jobs")
			.select(
				`
        id,
        job_number,
        title,
        status,
        priority,
        scheduled_start,
        scheduled_end,
        total_amount,
        paid_amount,
        created_at,
        customer:customers!customer_id (
          id,
          first_name,
          last_name
        ),
        assigned_user:users!assigned_to (
          id,
          name,
          avatar
        )
      `
			)
			.eq("property_id", propertyId)
			.eq("company_id", activeCompanyId)
			.order("created_at", { ascending: false }),

		// 3. Equipment installed at property
		supabase
			.from("equipment")
			.select("*")
			.eq("property_id", propertyId)
			.eq("company_id", activeCompanyId)
			.order("install_date", { ascending: false }),

		// 4. Upcoming schedules/appointments
		supabase
			.from("schedules")
			.select(
				`
        id,
        title,
        description,
        start_time,
        end_time,
        duration,
        status,
        type,
        job:jobs!job_id (
          id,
          job_number,
          title
        )
      `
			)
			.eq("property_id", propertyId)
			.gte("start_time", new Date().toISOString())
			.order("start_time", { ascending: true })
			.limit(20),

		// 5. Estimates for this property
		supabase
			.from("estimates")
			.select("id, estimate_number, title, total_amount, status, created_at, job_id, property_id")
			.eq("company_id", activeCompanyId)
			.is("deleted_at", null)
			.eq("property_id", propertyId)
			.order("created_at", { ascending: false })
			.limit(10),

		// 6. Invoices for this property
		supabase
			.from("invoices")
			.select(
				"id, invoice_number, title, total_amount, balance_amount, status, created_at, job_id, property_id"
			)
			.eq("company_id", activeCompanyId)
			.or(`property_id.eq.${propertyId}`)
			.order("created_at", { ascending: false })
			.limit(10),

		// 7. Maintenance plans for this property
		supabase
			.from("service_plans")
			.select("id, name, description, frequency, status, created_at, next_service_date")
			.eq("property_id", propertyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false }),

		// 8. Activity log
		supabase
			.from("activity_log")
			.select("*, user:users(id, name, email, avatar)")
			.eq("entity_type", "property")
			.eq("entity_id", propertyId)
			.order("created_at", { ascending: false })
			.limit(50),

		// 9. Notes
		supabase
			.from("notes")
			.select("*, user:users(id, name, email, avatar)")
			.eq("entity_type", "property")
			.eq("entity_id", propertyId)
			.order("created_at", { ascending: false }),

		// 10. Attachments
		supabase
			.from("attachments")
			.select("*")
			.eq("entity_type", "property")
			.eq("entity_id", propertyId)
			.order("created_at", { ascending: false }),
	]);

	// Extract customer data
	const customer = customerResult.data;

	// Extract data from results
	const jobs = jobsResult.data || [];
	const equipment = equipmentResult.data || [];
	const schedules = schedulesResult.data || [];
	const estimates = estimatesResult.data || [];
	const invoices = invoicesResult.data || [];
	const maintenancePlans = maintenancePlansResult.data || [];
	const activities = activitiesResult.data || [];
	const notes = notesResult.data || [];
	const attachments = attachmentsResult.data || [];

	const propertyCommunicationFilters: string[] = [];
	if (customer?.id) {
		propertyCommunicationFilters.push(`customer_id.eq.${customer.id}`);
	}
	const jobIds = jobs.map((job: any) => job.id).filter(Boolean);
	for (const id of jobIds) {
		propertyCommunicationFilters.push(`job_id.eq.${id}`);
	}
	const invoiceIds = invoices.map((invoice: any) => invoice.id).filter(Boolean);
	for (const id of invoiceIds) {
		propertyCommunicationFilters.push(`invoice_id.eq.${id}`);
	}

	const propertyFilter = propertyId ? `property_id.eq.${propertyId}` : null;

	const buildPropertyCommunicationsQuery = (filters: string[]) => {
		let query = supabase
			.from("communications")
			.select(
				`
          *,
          customer:customers!customer_id(id, first_name, last_name)
        `
			)
			.eq("company_id", activeCompanyId)
			.order("created_at", { ascending: false })
			.limit(50);

		if (filters.length > 0) {
			query = query.or(filters.join(","));
		}

		return query;
	};

	const filtersWithProperty = propertyFilter
		? [...propertyCommunicationFilters, propertyFilter]
		: propertyCommunicationFilters;

	let { data: propertyCommunications, error: propertyCommunicationsError } =
		await buildPropertyCommunicationsQuery(filtersWithProperty);

	const shouldFallbackToFiltersWithoutProperty =
		propertyFilter && isMissingColumnError(propertyCommunicationsError, "property_id");

	if (shouldFallbackToFiltersWithoutProperty) {
		if (propertyCommunicationFilters.length > 0) {
			({ data: propertyCommunications, error: propertyCommunicationsError } =
				await buildPropertyCommunicationsQuery(propertyCommunicationFilters));
		} else {
			propertyCommunications = [];
			propertyCommunicationsError = null;
		}
	}

	if (hasReportableError(propertyCommunicationsError)) {
	}

	const communications =
		(propertyCommunications || []).filter((record, index, self) => {
			if (!record?.id) {
				return false;
			}
			return self.findIndex((entry) => entry.id === record.id) === index;
		}) ?? [];

	// Calculate metrics for stats bar
	const totalJobs = jobs.length;
	const activeJobs = jobs.filter(
		(job: any) => job.status && !["completed", "cancelled"].includes(job.status.toLowerCase())
	).length;
	// Access financial domain with optional chaining
	const totalRevenue = jobs.reduce(
		(sum: number, job: any) => sum + (job.financial?.total_amount ?? 0),
		0
	);
	const completedJobs = jobs.filter((job: any) => job.status?.toLowerCase() === "completed");
	const lastServiceDate = completedJobs.length > 0 ? completedJobs[0]?.created_at || null : null;
	const nextScheduledDate = schedules.length > 0 ? schedules[0]?.start_time || null : null;
	const equipmentCount = equipment.length;

	const metrics = {
		totalJobs,
		activeJobs,
		totalRevenue,
		lastServiceDate,
		nextScheduledDate,
		equipmentCount,
	};

	// Prepare data for page content
	const propertyData = {
		property,
		customer,
		jobs,
		equipment,
		schedules,
		estimates,
		invoices,
		maintenancePlans,
		communications,
		activities,
		notes,
		attachments,
	};

	// Generate stats for toolbar
	const stats = generatePropertyStats(metrics);

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<PropertyPageContent entityData={propertyData} metrics={metrics} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
