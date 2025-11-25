import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { JobCreateForm } from "./job-create-form";

type SearchParams = {
	date?: string;
	startTime?: string;
	assignTo?: string;
	propertyId?: string;
	customerId?: string;
	equipmentId?: string;
	teamMemberId?: string;
	cloneFrom?: string;
};

export async function JobNewData({
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

	// Load team members for assignment
	const { data: teamMembers } = await supabase
		.from("team_members")
		.select("id, user_id, job_title, profiles!inner(id, full_name, email)")
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.limit(100);

	// If cloning from existing job, load that job's data
	let cloneJobData = null;
	if (searchParams.cloneFrom) {
		const { data: existingJob } = await supabase
			.from("jobs")
			.select(
				`
				id,
				title,
				description,
				priority,
				job_type,
				customer_id,
				property_id,
				notes
			`,
			)
			.eq("id", searchParams.cloneFrom)
			.eq("company_id", activeCompanyId)
			.single();

		if (existingJob) {
			cloneJobData = existingJob;
		}
	}

	// If we have a specific customer, pre-select their properties
	let preSelectedCustomerId = searchParams.customerId || cloneJobData?.customer_id;
	let preSelectedPropertyId = searchParams.propertyId || cloneJobData?.property_id;

	// If assignTo is provided, try to find the team member
	let preSelectedAssignee = searchParams.assignTo || searchParams.teamMemberId;

	// Build scheduled time from date and startTime params
	let scheduledStart: string | undefined;
	if (searchParams.date) {
		const dateStr = searchParams.date;
		const timeStr = searchParams.startTime || "09:00";
		scheduledStart = `${dateStr}T${timeStr}:00`;
	}

	return (
		<JobCreateForm
			customers={customers || []}
			properties={properties || []}
			teamMembers={
				teamMembers?.map((tm) => ({
					id: tm.id,
					userId: tm.user_id,
					name: (tm.profiles as any)?.full_name || (tm.profiles as any)?.email || "Unknown",
					jobTitle: tm.job_title,
				})) || []
			}
			defaultValues={{
				customerId: preSelectedCustomerId,
				propertyId: preSelectedPropertyId,
				assignedTo: preSelectedAssignee,
				scheduledStart,
				title: cloneJobData?.title ? `${cloneJobData.title} (Copy)` : undefined,
				description: cloneJobData?.description,
				priority: cloneJobData?.priority || "medium",
				jobType: cloneJobData?.job_type,
				notes: cloneJobData?.notes,
			}}
		/>
	);
}
