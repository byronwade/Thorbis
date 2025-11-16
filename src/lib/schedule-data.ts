import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, subDays } from "date-fns";
import type { Job, JobAssignment, Technician } from "@/components/schedule/schedule-types";
import type { ScheduleHydrationPayload } from "@/lib/schedule-bootstrap";
import type { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];

type ScheduleRow = Tables["schedules"]["Row"];
type CustomerRow = Tables["customers"]["Row"];
type PropertyRow = Tables["properties"]["Row"];
type JobRow = Tables["jobs"]["Row"];
type TeamMemberRow = Tables["team_members"]["Row"];
type JobTeamAssignmentRow = Tables["job_team_assignments"]["Row"];

export type ScheduleRecord = ScheduleRow & {
	customer: Pick<CustomerRow, "id" | "first_name" | "last_name" | "email" | "phone"> | null;
	job:
		| (JobRow & {
				job_team_assignments: Array<
					JobTeamAssignmentRow & {
						team_member: TeamMemberRow | null;
					}
				> | null;
		  })
		| null;
};

type ScheduleProperty = Pick<
	PropertyRow,
	"id" | "name" | "address" | "address2" | "city" | "state" | "zip_code" | "country" | "lat" | "lon"
>;

type Range = {
	start: Date;
	end: Date;
};

type LoadParams = {
	supabase: SupabaseClient<Database>;
	companyId: string;
	range?: Range;
};

type TeamMemberRecord = TeamMemberRow & {
	users: {
		id: string;
		name: string | null;
		email: string | null;
		phone: string | null;
		avatar: string | null;
	} | null;
};

export type TechniciansLookup = {
	technicians: Technician[];
	byId: Map<string, Technician>;
	byUserId: Map<string, Technician>;
	byTeamMemberId: Map<string, Technician>;
};

export const UNASSIGNED_TECHNICIAN_ID = "__unassigned";

const scheduleSelect = `
  *,
  customer:customers(
    id,
    first_name,
    last_name,
    email,
    phone
  ),
  job:jobs(
    id,
    job_number,
    title,
    company_id,
    job_team_assignments:job_team_assignments!job_team_assignments_job_id_fkey(
      id,
      role,
      team_member_id,
      removed_at,
      team_member:team_members(
        id,
        company_id,
        status,
        job_title,
        department,
        archived_at,
        user_id,
        phone,
        email,
        invited_name,
        created_at,
        updated_at
      )
    )
  )
`;

const DEFAULT_TECHNICIAN_COLOR = "#3B82F6";

const DEFAULT_SCHEDULE = {
	workingHours: { start: "08:00", end: "17:00" },
	daysOff: [] as Date[],
	availableHours: { start: 0, end: 40 },
};

const DEFAULT_LOCATION = {
	address: {
		street: "",
		city: "",
		state: "",
		zip: "",
		country: "",
	},
	coordinates: {
		lat: 0,
		lng: 0,
	},
};

export async function fetchScheduleData({
	supabase,
	companyId,
	range,
}: LoadParams): Promise<{ jobs: Job[]; technicians: Technician[] }> {
	const scheduleQuery = supabase
		.from("schedules")
		.select(scheduleSelect)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.is("archived_at", null)
		.order("start_time", { ascending: true });

	if (range) {
		scheduleQuery.lte("start_time", range.end.toISOString());
		scheduleQuery.gte("end_time", range.start.toISOString());
	}

	const [scheduleResult, teamMembers] = await Promise.all([
		scheduleQuery,
		fetchTeamMembersWithUsers(supabase, companyId),
	]);

	const scheduleRows = scheduleResult.data;
	const scheduleError = scheduleResult.error;

	if (scheduleError) {
		throw scheduleError;
	}

	const propertyMap = await fetchPropertiesForSchedules(supabase, scheduleRows ?? []);
	const technicianLookups = mapTeamMembersToTechnicians(teamMembers);

	const normalizedSchedules = (scheduleRows ?? []) as unknown as ScheduleRecord[];

	const jobs = normalizedSchedules.map((schedule) =>
		mapScheduleToJob(schedule, technicianLookups, propertyMap.get(schedule.property_id ?? "") ?? null)
	);

	return {
		jobs,
		technicians: technicianLookups.technicians,
	};
}

export function resolveScheduleRange(range?: Range, anchor: Date = new Date()): Range {
	if (range) {
		return range;
	}

	const start = subDays(anchor, 7);
	const end = addDays(anchor, 30);
	return { start, end };
}

export async function loadScheduleSnapshot(params: LoadParams & { range?: Range }): Promise<ScheduleHydrationPayload> {
	const resolvedRange = resolveScheduleRange(params.range);
	const { jobs, technicians } = await fetchScheduleData({
		...params,
		range: resolvedRange,
	});

	return {
		companyId: params.companyId,
		range: resolvedRange,
		lastSync: new Date(),
		jobs,
		technicians,
	};
}

export function createTechnicianJobMap(jobs: Job[]): Record<string, Job[]> {
	return jobs.reduce<Record<string, Job[]>>((acc, job) => {
		const key = job.technicianId || UNASSIGNED_TECHNICIAN_ID;
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(job);
		return acc;
	}, {});
}

async function fetchTeamMembersWithUsers(
	supabase: SupabaseClient<Database>,
	companyId: string
): Promise<TeamMemberRecord[]> {
	const { data: bareMembers, error: bareError } = await supabase
		.from("team_members")
		.select("*")
		.eq("company_id", companyId)
		.eq("status", "active")
		.is("archived_at", null);

	if (bareError) {
		throw bareError;
	}

	const userIds = Array.from(
		new Set((bareMembers ?? []).map((member) => member.user_id).filter((id): id is string => Boolean(id)))
	);

	const usersById = new Map<string, TeamMemberRecord["users"]>();
	if (userIds.length > 0) {
		const { data: users, error: userError } = await supabase
			.from("users")
			.select("id, name, email, phone, avatar")
			.in("id", userIds);
		if (userError) {
			throw userError;
		}
		(users ?? []).forEach((user) => {
			usersById.set(user.id, user);
		});
	}

	return (bareMembers ?? []).map((member) => ({
		...member,
		users: member.user_id ? (usersById.get(member.user_id) ?? null) : null,
	})) as TeamMemberRecord[];
}

async function fetchPropertiesForSchedules(
	supabase: SupabaseClient<Database>,
	schedules: ScheduleRow[]
): Promise<Map<string, ScheduleProperty>> {
	const propertyIds = Array.from(
		new Set(schedules.map((row) => row.property_id).filter((id): id is string => Boolean(id)))
	);

	const map = new Map<string, ScheduleProperty>();
	if (propertyIds.length === 0) {
		return map;
	}

	const { data, error } = await supabase
		.from("properties")
		.select("id, name, address, address2, city, state, zip_code, country, lat, lon")
		.in("id", propertyIds);

	if (error) {
		throw error;
	}

	(data ?? []).forEach((property) => map.set(property.id, property));
	return map;
}

export function mapTeamMembersToTechnicians(teamMembers: TeamMemberRecord[]): TechniciansLookup {
	const technicians: Technician[] = [];
	const byId = new Map<string, Technician>();
	const byUserId = new Map<string, Technician>();
	const byTeamMemberId = new Map<string, Technician>();

	teamMembers.forEach((member) => {
		const technicianId = member.user_id ?? member.id;
		if (!technicianId) {
			return;
		}

		const user = member.users;
		const technician: Technician = {
			id: technicianId,
			userId: member.user_id ?? undefined,
			teamMemberId: member.id,
			name: user?.name || member.invited_name || member.job_title || "Team Member",
			email: user?.email || member.email || undefined,
			phone: user?.phone || member.phone || undefined,
			avatar: user?.avatar || undefined,
			role: member.job_title || member.role || "Team Member",
			department: member.department || undefined,
			status: member.status === "active" ? "available" : "offline",
			isActive: member.status === "active" && !member.archived_at,
			schedule: { ...DEFAULT_SCHEDULE },
			color: DEFAULT_TECHNICIAN_COLOR,
			createdAt: new Date(member.created_at),
			updatedAt: new Date(member.updated_at),
		};

		technicians.push(technician);
		byId.set(technician.id, technician);
		if (technician.userId) {
			byUserId.set(technician.userId, technician);
		}
		if (technician.teamMemberId) {
			byTeamMemberId.set(technician.teamMemberId, technician);
		}
	});

	return { technicians, byId, byUserId, byTeamMemberId };
}

export function mapScheduleToJob(
	schedule: ScheduleRecord,
	lookups: TechniciansLookup,
	property: ScheduleProperty | null
): Job {
	const location = buildLocation(property);
	const customer = buildCustomer(schedule, location.address.street);
	const assignments = buildAssignments(schedule, lookups);

	const primaryAssignment = assignments.find((assignment) => assignment.role === "primary");
	const technicianId = primaryAssignment?.technicianId ?? "";

	return {
		id: schedule.id,
		jobId: schedule.job_id || undefined,
		technicianId,
		assignments,
		isUnassigned: assignments.length === 0,
		title: schedule.title || schedule.job?.title || "Appointment",
		description: schedule.description || undefined,
		customer,
		location,
		startTime: new Date(schedule.start_time),
		endTime: new Date(schedule.end_time),
		allDay: schedule.all_day,
		status:
			(schedule.status as Job["status"]) && isJobStatus(schedule.status)
				? (schedule.status as Job["status"])
				: "scheduled",
		priority: "medium",
		recurrence: schedule.is_recurring
			? {
					frequency: "weekly",
					interval: 1,
					endDate: schedule.recurrence_end_date ? new Date(schedule.recurrence_end_date) : undefined,
				}
			: undefined,
		metadata: {
			estimatedDuration: schedule.duration,
			notes: schedule.notes || undefined,
		},
		createdAt: new Date(schedule.created_at),
		updatedAt: new Date(schedule.updated_at),
	};
}

function buildAssignments(schedule: ScheduleRecord, lookups: TechniciansLookup): JobAssignment[] {
	const assignments: JobAssignment[] = [];

	if (schedule.assigned_to) {
		const technician = lookups.byUserId.get(schedule.assigned_to) || lookups.byId.get(schedule.assigned_to);
		assignments.push({
			technicianId: technician?.id ?? schedule.assigned_to,
			teamMemberId: technician?.teamMemberId,
			displayName: technician?.name || "Primary Technician",
			avatar: technician?.avatar || null,
			role: "primary",
			status: technician?.status ?? "available",
			isActive: technician?.isActive ?? true,
		});
	}

	const crewAssignments = schedule.job?.job_team_assignments?.filter((assignment) => !assignment.removed_at) ?? [];

	crewAssignments.forEach((assignment) => {
		const teamMember = assignment.team_member;
		if (!teamMember) {
			return;
		}

		const technician =
			(teamMember.user_id && lookups.byUserId.get(teamMember.user_id)) || lookups.byTeamMemberId.get(teamMember.id);

		const displayName = technician?.name || teamMember.invited_name || teamMember.job_title || "Crew Member";

		assignments.push({
			technicianId: technician?.id ?? teamMember.user_id ?? teamMember.id,
			teamMemberId: teamMember.id,
			displayName,
			avatar: technician?.avatar || null,
			role: (assignment.role as JobAssignment["role"]) || "crew",
			status: technician?.status ?? deriveTechnicianStatus(teamMember.status),
			isActive: technician?.isActive ?? teamMember.status === "active",
		});
	});

	return dedupeAssignments(assignments);
}

function dedupeAssignments(assignments: JobAssignment[]): JobAssignment[] {
	const seen = new Set<string>();

	return assignments.filter((assignment) => {
		const key = `${assignment.role}-${assignment.technicianId ?? assignment.teamMemberId ?? ""}`;
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}

function buildCustomer(schedule: ScheduleRecord, fallbackStreet: string): Job["customer"] {
	const customerRecord = schedule.customer;
	const name = customerRecord && `${customerRecord.first_name ?? ""} ${customerRecord.last_name ?? ""}`.trim();

	return {
		id: customerRecord?.id || schedule.customer_id || `customer-${schedule.id}`,
		name: name && name.length > 0 ? name : "Unspecified Customer",
		email: customerRecord?.email || undefined,
		phone: customerRecord?.phone || undefined,
		location: {
			...DEFAULT_LOCATION,
			address: {
				...DEFAULT_LOCATION.address,
				street: fallbackStreet,
			},
		},
		createdAt: new Date(schedule.created_at),
		updatedAt: new Date(schedule.updated_at),
	};
}

function buildLocation(property: ScheduleProperty | null): Job["location"] {
	if (!property) {
		return { ...DEFAULT_LOCATION };
	}

	return {
		address: {
			street: property.address || property.address2 || property.name || "",
			city: property.city || "",
			state: property.state || "",
			zip: property.zip_code || "",
			country: property.country || "",
		},
		coordinates: {
			lat: property.lat || 0,
			lng: property.lon || 0,
		},
	};
}

function deriveTechnicianStatus(status?: string | null): Technician["status"] {
	return status === "active" ? "available" : "offline";
}

function isJobStatus(value: string): value is Job["status"] {
	return ["scheduled", "dispatched", "arrived", "in-progress", "closed", "completed", "cancelled"].includes(value);
}
