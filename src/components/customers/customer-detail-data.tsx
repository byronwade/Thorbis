import { notFound } from "next/navigation";
import { CustomerPageContent } from "@/components/customers/customer-page-content";
import { ToolbarActionsProvider } from "@/components/layout/toolbar-actions-provider";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { generateCustomerStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type CustomerDetailDataProps = {
	customerId: string;
};

/**
 * Customer Detail Data - Async Server Component
 *
 * Fetches all customer data and related entities.
 * This streams in after the shell renders.
 *
 * Fetches 13 parallel queries for complete customer 360° view.
 */
export async function CustomerDetailData({
	customerId,
}: CustomerDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return notFound();
	}

	// Get the active company ID
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Get user's membership for the ACTIVE company
	const { data: teamMember, error: teamMemberError } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", user.id)
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.maybeSingle();

	// Check for real errors
	const hasRealError =
		teamMemberError &&
		teamMemberError.code !== "PGRST116" &&
		Object.keys(teamMemberError).length > 0;

	if (hasRealError) {
		return notFound();
	}

	if (!teamMember) {
		return notFound();
	}

	// Fetch customer
	const { data: customer, error: customerError } = await supabase
		.from("customers")
		.select("*")
		.eq("id", customerId)
		.eq("company_id", teamMember.company_id)
		.is("deleted_at", null)
		.maybeSingle();

	if (customerError) {
		if (customerError.code === "PGRST116") {
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-lg">
						<h1 className="mb-4 font-bold text-2xl">Customer Not Found</h1>
						<p className="mb-6 text-muted-foreground text-sm">
							This customer doesn't exist or has been deleted.
						</p>
						<a
							className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
							href="/dashboard/customers"
						>
							Back to Customers
						</a>
					</div>
				</div>
			);
		}

		if (customerError.code === "42501") {
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-lg">
						<h1 className="mb-4 font-bold text-2xl">Wrong Company</h1>
						<p className="mb-2 text-muted-foreground text-sm">
							This customer belongs to a different company.
						</p>
						<p className="mb-6 text-muted-foreground text-sm">
							If you need to access this customer, please switch to the correct
							company using the company selector in the header.
						</p>
						<a
							className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
							href="/dashboard/customers"
						>
							Back to Customers
						</a>
					</div>
				</div>
			);
		}

		return notFound();
	}

	if (!customer) {
		return notFound();
	}

	// Fetch related data (13 parallel queries for complete 360° view)
	const [
		{ data: properties },
		{ data: jobs },
		{ data: invoices },
		{ data: estimates },
		{ data: appointments },
		{ data: contracts },
		{ data: payments },
		{ data: maintenancePlans },
		{ data: serviceAgreements },
		{ data: activities },
		{ data: equipment },
		{ data: attachments },
		{ data: paymentMethods },
	] = await Promise.all([
		supabase
			.from("properties")
			.select("*")
			.eq("primary_contact_id", customerId)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("jobs")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("invoices")
			.select("*")
			.eq("customer_id", customerId)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("estimates")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("schedules")
			.select(`
        *,
        job:jobs!job_id(id, job_number, title),
        property:properties!property_id(id, name, address)
      `)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("scheduled_start", { ascending: false })
			.limit(10),
		supabase
			.from("contracts")
			.select(`
        *,
        job:jobs!job_id(id, job_number),
        estimate:estimates!estimate_id(id, estimate_number),
        invoice:invoices!invoice_id(id, invoice_number)
      `)
			.eq("company_id", teamMember.company_id)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(50),
		supabase
			.from("payments")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("processed_at", { ascending: false })
			.limit(10),
		supabase
			.from("maintenance_plans")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("service_plans")
			.select("*")
			.eq("customer_id", customerId)
			.eq("type", "contract")
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("customer_activities")
			.select("*")
			.eq("customer_id", customerId)
			.order("created_at", { ascending: false })
			.limit(20),
		supabase
			.from("equipment")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("customer_attachments")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("customer_payment_methods")
			.select("*")
			.eq("customer_id", customerId)
			.eq("is_active", true)
			.order("is_default", { ascending: false })
			.limit(5),
	]);

	// Filter contracts to only include those related to this customer
	const customerContracts = (contracts || []).filter((contract) => {
		const hasJob = jobs?.some((job) => job.id === contract.job_id);
		const hasEstimate = estimates?.some(
			(est) => est.id === contract.estimate_id,
		);
		const hasInvoice = invoices?.some((inv) => inv.id === contract.invoice_id);
		return hasJob || hasEstimate || hasInvoice;
	});

	// Build metrics and stats for toolbar
	const metrics = {
		totalRevenue: (customer as any).total_revenue || 0,
		totalJobs: jobs?.length || 0,
		totalProperties: properties?.length || 0,
		outstandingBalance: (customer as any).outstanding_balance || 0,
	};

	const stats = generateCustomerStats(metrics);

	// Build customer 360° data object expected by CustomerPageContent
	const customerData = {
		customer,
		properties: properties || [],
		jobs: jobs || [],
		invoices: invoices || [],
		estimates: estimates || [],
		appointments: appointments || [],
		contracts: customerContracts,
		payments: payments || [],
		maintenancePlans: maintenancePlans || [],
		serviceAgreements: serviceAgreements || [],
		activities: activities || [],
		equipment: equipment || [],
		attachments: attachments || [],
		paymentMethods: paymentMethods || [],
		enrichmentData: null,
	};

	return (
		<ToolbarStatsProvider stats={stats}>
			<ToolbarActionsProvider>
				<CustomerPageContent customerData={customerData} metrics={metrics} />
			</ToolbarActionsProvider>
		</ToolbarStatsProvider>
	);
}
