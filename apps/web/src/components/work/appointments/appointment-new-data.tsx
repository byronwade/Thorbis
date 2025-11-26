import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { AppointmentCreateFormV2 } from "./appointment-create-form-v2";

type SearchParams = {
	jobId?: string;
	customerId?: string;
	propertyId?: string;
};

export async function AppointmentNewData({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	// Load customers
	const { data: customers } = await supabase
		.from("customers")
		.select("id, first_name, last_name, display_name, email, phone")
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null)
		.order("display_name")
		.limit(100);

	// Load properties
	const { data: properties } = await supabase
		.from("properties")
		.select("id, customer_id, address, city, state, zip_code")
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null)
		.order("address")
		.limit(500);

	// Load jobs with full data including customer and property details
	// Use explicit foreign key relationships to avoid ambiguity
	// jobs_customer_id_customers_id_fk and jobs_property_id_properties_id_fk
	let jobsQuery = supabase
		.from("jobs")
		.select(
			`
			id,
			job_number,
			title,
			description,
			customer_id,
			property_id,
			status,
			customer:customers!jobs_customer_id_customers_id_fk(id, display_name, first_name, last_name, email, phone),
			property:properties!jobs_property_id_properties_id_fk(id, address, city, state, zip_code)
		`,
		)
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null);

	// If we have a specific jobId, load just that job
	if (searchParams.jobId) {
		jobsQuery = jobsQuery.eq("id", searchParams.jobId);
	} else {
		// Otherwise load recent active jobs
		jobsQuery = jobsQuery
			.in("status", ["scheduled", "in_progress", "pending"])
			.order("created_at", { ascending: false })
			.limit(50);
	}

	const { data: jobs, error: jobsError } = await jobsQuery;

	// Log errors for debugging
	if (jobsError) {
		console.error("Jobs query error:", jobsError);
	}

	// Load team members
	const { data: teamMembers } = await supabase
		.from("profiles")
		.select("id, email, full_name")
		.eq("company_id", activeCompanyId)
		.order("full_name")
		.limit(100);

	return (
		<AppointmentCreateFormV2
			jobId={searchParams.jobId}
			customerId={searchParams.customerId}
			propertyId={searchParams.propertyId}
			customers={customers || []}
			properties={properties || []}
			jobs={jobs || []}
			teamMembers={teamMembers || []}
		/>
	);
}
