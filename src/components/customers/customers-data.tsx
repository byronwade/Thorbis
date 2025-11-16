import { getAllCustomers } from "@/actions/customers";
import { CustomersKanban } from "@/components/customers/customers-kanban";
import { type Customer, CustomersTable } from "@/components/customers/customers-table";
import { WorkDataView } from "@/components/work/work-data-view";

/**
 * Customers Data - Async Server Component
 *
 * Fetches customer data and renders table/kanban views.
 * Streams in after stats.
 */
export async function CustomersData() {
	// Fetch customers from database
	const result = await getAllCustomers();
	const dbCustomers = result.success ? result.data : [];

	// Transform database records to table format
	const customers: Customer[] = dbCustomers.map((c) => ({
		id: c.id,
		name: c.display_name,
		contact: `${c.first_name} ${c.last_name}`,
		email: c.email,
		phone: c.phone,
		address: c.address,
		city: c.city,
		state: c.state,
		zipCode: c.zip_code,
		status: c.status === "active" ? "active" : c.status === "inactive" ? "inactive" : "prospect",
		lastService: c.last_job_date ? new Date(c.last_job_date).toLocaleDateString() : "None",
		nextService: c.next_scheduled_job ? new Date(c.next_scheduled_job).toLocaleDateString() : "TBD",
		totalValue: c.total_revenue || 0,
		archived_at: c.archived_at,
		deleted_at: c.deleted_at,
	}));

	return (
		<WorkDataView
			kanban={<CustomersKanban customers={customers} />}
			section="customers"
			table={<CustomersTable customers={customers} itemsPerPage={50} />}
		/>
	);
}
