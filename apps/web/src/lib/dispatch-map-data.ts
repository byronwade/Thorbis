import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export type DispatchMapTechnician = {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	avatar?: string;
	role: string;
	status: string;
};

export type DispatchMapGPSLocation = {
	id: string;
	technician_id: string;
	lat: number;
	lng: number;
	accuracy?: number;
	heading?: number;
	speed?: number;
	battery_level?: number;
	status?: string;
	updated_at: string;
	company_id: string;
};

export type DispatchMapCustomer = {
	id: string;
	display_name: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	lat?: number;
	lon?: number;
};

export type DispatchMapProperty = {
	id: string;
	address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	lat?: number;
	lon?: number;
};

export type DispatchMapJob = {
	id: string;
	title: string;
	job_type?: string;
	priority?: string;
	status: string;
	total_amount?: number;
	customer?: DispatchMapCustomer;
	property?: DispatchMapProperty;
};

export type DispatchMapAppointment = {
	id: string;
	start_time: string;
	end_time?: string;
	status: string;
	assigned_technician_ids?: string[];
	job?: DispatchMapJob;
};

export type DispatchMapData = {
	technicians: DispatchMapTechnician[];
	gpsLocations: DispatchMapGPSLocation[];
	appointments: DispatchMapAppointment[];
	unassignedJobs: DispatchMapJob[];
	companyId: string;
	defaultCenter?: { address: string };
};

/**
 * Shared data loader for the dispatch map view so it can be used from the page
 * route and the embedded schedule view without duplicating queries.
 */
export async function fetchDispatchMapData(
	supabase: SupabaseClient<Database>,
	companyId: string,
): Promise<DispatchMapData> {
	const technicianRecords = await fetchTechnicians(supabase, companyId);

	// Get today's date range
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const [
		{ data: gpsLocations, error: gpsError },
		{ data: appointments, error: appointmentsError },
		{ data: unassignedJobs, error: unassignedError },
		{ data: companySettings },
	] = await Promise.all([
		supabase.from("technician_locations").select("*").eq("company_id", companyId),
		supabase
			.from("appointments")
			.select(
				`
				id,
				start_time,
				end_time,
				status,
				assigned_to,
				appointment_team_assignments:appointment_team_assignments!appointment_team_assignments_appointment_id_fkey (
					team_member_id,
					team_member:team_members!appointment_team_assignments_team_member_id_fkey (
						user_id
					)
				),
				job:jobs!appointments_job_id_jobs_id_fk (
					id,
					title,
					job_type,
					priority,
					status,
					financial:job_financial!job_financial_job_id_fkey (
						total_amount
					),
					customer:customers!jobs_customer_id_customers_id_fk (
						id,
						display_name,
						phone,
						address,
						city,
						state,
						zip_code,
						lat,
						lon
					),
					property:properties!jobs_property_id_properties_id_fk (
						id,
						address,
						city,
						state,
						zip_code,
						lat,
						lon
					)
				)
			`,
			)
			.eq("company_id", companyId)
			.gte("start_time", today.toISOString())
			.lt("start_time", tomorrow.toISOString())
			.order("start_time", { ascending: true }),
		supabase
			.from("jobs")
			.select(
				`
				id,
				title,
				job_type,
				priority,
				status,
				financial:job_financial!job_financial_job_id_fkey (
					total_amount
				),
				customer:customers!jobs_customer_id_customers_id_fk (
					id,
					display_name,
					phone,
					address,
					city,
					state,
					lat,
					lon
				),
				property:properties!jobs_property_id_properties_id_fk (
					id,
					address,
					city,
					state,
					lat,
					lon
				)
			`,
			)
			.eq("company_id", companyId)
			.eq("status", "pending")
			.is("archived_at", null)
			.limit(50),
		supabase
			.from("company_settings")
			.select("address, city, state")
			.eq("company_id", companyId)
			.maybeSingle(),
	]);

	if (gpsError) {
		throw new Error(
			`Failed to load technician locations: ${
				gpsError.message || "Unknown GPS error"
			}`,
		);
	}

	if (appointmentsError) {
		throw new Error(
			`Failed to load appointments: ${
				appointmentsError.message || "Unknown appointments error"
			}`,
		);
	}

	if (unassignedError) {
		throw new Error(
			`Failed to load unassigned jobs: ${
				unassignedError.message || "Unknown jobs error"
			}`,
		);
	}

	const technicians =
		technicianRecords.map((tech) => ({
			id: tech.id,
			name: tech.name,
			email: tech.email || undefined,
			phone: tech.phone || undefined,
			avatar: tech.avatar || undefined,
			role: tech.role,
			status: tech.status,
		})) ?? [];

	// Transform appointments and jobs to flatten financial.total_amount to total_amount
	// and extract assigned_technician_ids from team assignments
	const transformedAppointments = (appointments ?? []).map((apt: any) => {
		// Extract technician IDs from team assignments
		const teamAssignments = Array.isArray(apt.appointment_team_assignments)
			? apt.appointment_team_assignments
			: apt.appointment_team_assignments
				? [apt.appointment_team_assignments]
				: [];
		
		const technicianIds = new Set<string>();
		
		// Add assigned_to if it exists
		if (apt.assigned_to) {
			technicianIds.add(apt.assigned_to);
		}
		
		// Add user_ids from team member assignments
		teamAssignments
			.filter((assignment: any) => assignment.team_member?.user_id)
			.forEach((assignment: any) => {
				if (assignment.team_member.user_id) {
					technicianIds.add(assignment.team_member.user_id);
				}
			});
		
		const assigned_technician_ids = Array.from(technicianIds);
		
		// Flatten financial.total_amount
		let job = apt.job;
		if (job && job.financial) {
			const financial = Array.isArray(job.financial)
				? job.financial[0]
				: job.financial;
			job = {
				...job,
				total_amount: financial?.total_amount ?? undefined,
				financial: undefined, // Remove nested financial
			};
		}
		
		return {
			...apt,
			assigned_technician_ids,
			job,
			appointment_team_assignments: undefined, // Remove nested assignments
			assigned_to: undefined, // Remove since we have assigned_technician_ids
		};
	});

	const transformedUnassignedJobs = (unassignedJobs ?? []).map((job: any) => {
		if (job.financial) {
			const financial = Array.isArray(job.financial)
				? job.financial[0]
				: job.financial;
			return {
				...job,
				total_amount: financial?.total_amount ?? undefined,
				financial: undefined, // Remove nested financial
			};
		}
		return job;
	});

	return {
		technicians,
		gpsLocations: gpsLocations ?? [],
		appointments: transformedAppointments,
		unassignedJobs: transformedUnassignedJobs,
		companyId,
		defaultCenter: companySettings?.city
			? {
					address: `${companySettings.address}, ${companySettings.city}, ${companySettings.state}`,
				}
			: undefined,
	};
}

type MembershipWithProfile = Database["public"]["Tables"]["company_memberships"]["Row"] & {
	users?:
		| {
				id: string;
				full_name: string | null;
				email: string | null;
				phone: string | null;
				avatar_url: string | null;
		  }
		| null;
};

async function fetchTechnicians(
	supabase: SupabaseClient<Database>,
	companyId: string,
): Promise<DispatchMapTechnician[]> {
	const technicianQuery = supabase
		.from("company_memberships")
		.select(
			`
			id,
			user_id,
			role,
			status,
			job_title,
			users:profiles!company_memberships_profile_id_fkey(
				id,
				full_name,
				email,
				phone,
				avatar_url
			)
		`,
		)
		.eq("company_id", companyId)
		.eq("status", "active")
		.is("archived_at", null);

	const { data, error } = await technicianQuery;

	if (error) {
		console.warn(
			"[Dispatch Map] Technician join failed, falling back to basic membership fetch:",
			error.message,
		);
		return fetchTechniciansFallback(supabase, companyId);
	}

	return (data ?? [])
		.map((member) => mapMembershipToTechnician(member))
		.filter(Boolean) as DispatchMapTechnician[];
}

async function fetchTechniciansFallback(
	supabase: SupabaseClient<Database>,
	companyId: string,
): Promise<DispatchMapTechnician[]> {
	const { data: members, error } = await supabase
		.from("company_memberships")
		.select(
			"id, user_id, role, status, job_title",
		)
		.eq("company_id", companyId)
		.eq("status", "active")
		.is("archived_at", null);

	if (error) {
		throw new Error(
			`Failed to load technicians: ${error.message || "Unknown technician error"}`,
		);
	}

	const userIds = Array.from(
		new Set(
			(members ?? [])
				.map((member) => member.user_id)
				.filter((id): id is string => Boolean(id)),
		),
	);

	const profilesById = new Map<string, MembershipWithProfile["users"]>();
	if (userIds.length > 0) {
		const { data: profiles, error: profilesError } = await supabase
			.from("profiles")
			.select("id, full_name, email, phone, avatar_url")
			.in("id", userIds);

		if (profilesError) {
			console.warn("[Dispatch Map] Failed to load profiles for technicians:", profilesError.message);
		} else {
			(profiles ?? []).forEach((profile) => {
				profilesById.set(profile.id, profile);
			});
		}
	}

	return (members ?? [])
		.map((member) =>
			mapMembershipToTechnician({
				...member,
				users: member.user_id ? profilesById.get(member.user_id) ?? null : null,
			} as MembershipWithProfile),
		)
		.filter(Boolean) as DispatchMapTechnician[];
}

function mapMembershipToTechnician(
	member: MembershipWithProfile,
): DispatchMapTechnician | null {
	const normalizedRole = member.role?.toLowerCase() ?? member.job_title?.toLowerCase();
	const isTechnician =
		!normalizedRole ||
		normalizedRole === "technician" ||
		normalizedRole.includes("tech");

	if (!isTechnician) {
		return null;
	}

	const fullName =
		member.users?.full_name ||
		member.job_title ||
		member.users?.email ||
		"Unknown";

	return {
		id: member.id,
		name: fullName,
		email: member.users?.email ?? undefined,
		phone: member.users?.phone ?? undefined,
		avatar: member.users?.avatar_url ?? undefined,
		role: member.role || "technician",
		status: member.status || "active",
	};
}
