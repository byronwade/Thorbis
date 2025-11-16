import { notFound } from "next/navigation";
import { AppointmentsKanban } from "@/components/work/appointments-kanban";
import { AppointmentsTable } from "@/components/work/appointments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

// Configuration constants
const MAX_APPOINTMENTS_PER_PAGE = 100;

/**
 * AppointmentsData - Async Server Component
 *
 * Fetches and displays appointments data.
 * This streams in after the shell renders.
 */
export async function AppointmentsData() {
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

	// Get active company ID
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch ALL appointments from schedules table where type = 'appointment'
	// Client-side filtering will handle archive status
	const { data: appointmentsRaw, error } = await supabase
		.from("schedules")
		.select(`
      *,
      customers!customer_id(first_name, last_name, display_name, company_name),
      properties!property_id(address, city, state, zip_code),
      assigned_user:users!assigned_to(id, name, email)
    `)
		.eq("company_id", activeCompanyId)
		.eq("type", "appointment")
		.order("start_time", { ascending: true })
		.limit(MAX_APPOINTMENTS_PER_PAGE);

	if (error) {
		const errorMessage = error.message || error.hint || JSON.stringify(error) || "Unknown database error";
		throw new Error(`Failed to load appointments: ${errorMessage}`);
	}

	// Transform data for components
	const appointments = (appointmentsRaw || [])
		.filter((apt: any) => apt.start_time) // Only include appointments with start time
		.map((apt: any) => {
			const customer = Array.isArray(apt.customers) ? apt.customers[0] : apt.customers;
			const property = Array.isArray(apt.properties) ? apt.properties[0] : apt.properties;

			return {
				id: apt.id,
				title: apt.title,
				description: apt.description,
				start_time: new Date(apt.start_time),
				end_time: apt.end_time ? new Date(apt.end_time) : new Date(apt.start_time),
				status: apt.status || "scheduled",
				type: apt.type,
				customer,
				property,
				assigned_user: Array.isArray(apt.assigned_user) ? apt.assigned_user[0] : apt.assigned_user,
				job_id: apt.job_id,
				property_id: apt.property_id,
				customer_id: apt.customer_id,
				company_id: apt.company_id,
				created_at: new Date(apt.created_at),
				updated_at: new Date(apt.updated_at),
				archived_at: apt.archived_at,
				deleted_at: apt.deleted_at,
			};
		});

	return (
		<WorkDataView
			kanban={<AppointmentsKanban appointments={appointments} />}
			section="appointments"
			table={<AppointmentsTable appointments={appointments} itemsPerPage={50} />}
		/>
	);
}
