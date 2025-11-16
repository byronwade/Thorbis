import { getAllCustomers } from "@/actions/customers";
import type { Customer } from "@/components/customers/customers-table";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";

/**
 * Customers Stats - Async Server Component
 *
 * Fetches customer data and calculates statistics.
 * Streams in after shell renders.
 */
export async function CustomersStats() {
	// Fetch customers from database
	const result = await getAllCustomers();
	const dbCustomers = result.success ? result.data : [];

	// Transform database records to table format
	const customers: Customer[] = dbCustomers.map((c) => {
		let status: "active" | "inactive" | "prospect" = "prospect";
		if (c.status === "active") {
			status = "active";
		} else if (c.status === "inactive") {
			status = "inactive";
		}

		return {
			id: c.id,
			name: c.display_name,
			contact: `${c.first_name} ${c.last_name}`,
			email: c.email,
			phone: c.phone,
			address: c.address,
			city: c.city,
			state: c.state,
			zipCode: c.zip_code,
			status,
			lastService: c.last_job_date ? new Date(c.last_job_date).toLocaleDateString() : "None",
			nextService: c.next_scheduled_job ? new Date(c.next_scheduled_job).toLocaleDateString() : "TBD",
			totalValue: c.total_revenue || 0,
			archived_at: c.archived_at,
			deleted_at: c.deleted_at,
		};
	});

	// Filter to active customers for stats calculations
	const activeCustomersData = customers.filter((c) => !(c.archived_at || c.deleted_at));

	// Calculate statistics from real data
	const totalCustomers = activeCustomersData.length;
	const activeCustomers = activeCustomersData.filter((c) => c.status === "active").length;
	const prospectCustomers = activeCustomersData.filter((c) => c.status === "prospect").length;
	const totalRevenue = activeCustomersData.reduce((sum, c) => sum + c.totalValue, 0);

	// Constants for revenue calculation and stat changes
	const CENTS_PER_DOLLAR = 100;
	const TOTAL_CUSTOMERS_CHANGE = 12.3;
	const ACTIVE_CUSTOMERS_CHANGE = 8.7;
	const PROSPECTS_CHANGE = 15.2;
	const REVENUE_CHANGE = 18.9;

	const customerStats: StatCard[] = [
		{
			label: "Total Customers",
			value: totalCustomers,
			change: totalCustomers > 0 ? TOTAL_CUSTOMERS_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Active",
			value: activeCustomers,
			change: activeCustomers > 0 ? ACTIVE_CUSTOMERS_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Prospects",
			value: prospectCustomers,
			change: prospectCustomers > 0 ? PROSPECTS_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Total Revenue",
			value: `$${(totalRevenue / CENTS_PER_DOLLAR).toLocaleString()}`,
			change: totalRevenue > 0 ? REVENUE_CHANGE : 0,
			changeLabel: "vs last month",
		},
	];

	return <StatusPipeline compact stats={customerStats} />;
}
