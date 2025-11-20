import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, subDays } from "date-fns";
import type {
	Job,
	JobAssignment,
	Technician,
} from "@/components/schedule/schedule-types";
import type { UnassignedJobsMeta } from "@/lib/schedule/types";
import type { ScheduleHydrationPayload } from "@/lib/schedule-bootstrap";
import type { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];

type ScheduleRow = Tables["appointments"]["Row"];
type CustomerRow = Tables["customers"]["Row"];
type PropertyRow = Tables["properties"]["Row"];
type JobRow = Tables["jobs"]["Row"];
type TeamMemberRow = Tables["team_members"]["Row"];
type JobTeamAssignmentRow = Tables["job_team_assignments"]["Row"];
type JobRecord = Tables["jobs"]["Row"];

type JobCustomer = Pick<
	CustomerRow,
	| "id"
	| "first_name"
	| "last_name"
	| "email"
	| "phone"
	| "created_at"
	| "updated_at"
>;

type JobRowWithRelations = JobRecord & {
	customer?: JobCustomer | JobCustomer[] | null;
	property?: ScheduleProperty | ScheduleProperty[] | null;
	job_team_assignments?: Array<
		JobTeamAssignmentRow & {
			team_member: TeamMemberRow | null;
		}
	> | null;
};

export type ScheduleRecord = ScheduleRow & {
	customer: Pick<
		CustomerRow,
		"id" | "first_name" | "last_name" | "email" | "phone"
	> | null;
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
	| "id"
	| "name"
	| "address"
	| "address2"
	| "city"
	| "state"
	| "zip_code"
	| "country"
	| "lat"
	| "lon"
>;

type Range = {
	start: Date;
	end: Date;
};

type LoadParams = {
	supabase: SupabaseClient<Database>;
	companyId: string;
	range?: Range;
	unscheduledLimit?: number;
	unscheduledOffset?: number;
	unscheduledSearch?: string;
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

const UNSCHEDULED_JOBS_SELECT = `
  *,
  customer:customers!customer_id(
    id,
    first_name,
    last_name,
    email,
    phone,
    created_at,
    updated_at
  ),
  property:properties!property_id(
    id,
    name,
    address,
    address2,
    city,
    state,
    zip_code,
    country,
    lat,
    lon
  ),
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

const DEFAULT_UNSCHEDULED_DURATION_MINUTES = 60;
const DEFAULT_UNSCHEDULED_PAGE_SIZE = 50;

type UnscheduledQueryOptions = {
	limit?: number;
	offset?: number;
	search?: string;
};

export async function fetchScheduleData({
	supabase,
	companyId,
	range,
	unscheduledLimit = DEFAULT_UNSCHEDULED_PAGE_SIZE,
	unscheduledOffset = 0,
	unscheduledSearch = "",
}: LoadParams): Promise<{
	jobs: Job[];
	technicians: Technician[];
	unassignedMeta: UnassignedJobsMeta;
}> {
	const scheduleQuery = supabase
		.from("appointments")
		.select(scheduleSelect)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.is("archived_at", null)
		.order("start_time", { ascending: true });

	if (range) {
		scheduleQuery.lte("start_time", range.end.toISOString());
		scheduleQuery.gte("end_time", range.start.toISOString());
	}

	let scheduleResult;
	let teamMembers;

	try {
		[scheduleResult, teamMembers] = await Promise.all([
			scheduleQuery,
			fetchTeamMembersWithUsers(supabase, companyId),
		]);
	} catch (error) {
		console.error("Failed to fetch appointments or team members:", error);
		throw new Error(
			`Schedule data query failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	const scheduleRows = scheduleResult.data ?? [];
	const scheduleError = scheduleResult.error;

	if (scheduleError) {
		console.error("Appointments query error:", scheduleError);
		throw new Error(`Appointments query failed: ${scheduleError.message}`);
	}

	const scheduledJobIds = new Set(
		scheduleRows
			.map((row) => (row as ScheduleRow).job_id)
			.filter((id): id is string => Boolean(id)),
	);

	let unscheduledJobRows;
	let unscheduledMeta: {
		totalCount: number;
		hasMore: boolean;
		fetchedCount: number;
	};
	try {
		const unscheduledResult = await fetchUnscheduledJobs(supabase, companyId, {
			limit: unscheduledLimit,
			offset: unscheduledOffset,
			search: unscheduledSearch,
		});
		unscheduledJobRows = unscheduledResult.rows.filter(
			(row) => !scheduledJobIds.has(row.id),
		);
		unscheduledMeta = {
			totalCount: unscheduledResult.totalCount,
			hasMore: unscheduledResult.hasMore,
			fetchedCount: unscheduledResult.rows.length,
		};
	} catch (error) {
		console.error("Failed to fetch unscheduled jobs:", error);
		throw new Error(
			`Unscheduled jobs query failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	let propertyMap;
	try {
		propertyMap = await fetchPropertiesByIds(
			supabase,
			collectPropertyIds(scheduleRows as ScheduleRow[], unscheduledJobRows),
		);
	} catch (error) {
		console.error("Failed to fetch properties:", error);
		throw new Error(
			`Properties query failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	const technicianLookups = mapTeamMembersToTechnicians(teamMembers);

	const normalizedSchedules = scheduleRows as unknown as ScheduleRecord[];

	const scheduledJobs = normalizedSchedules.map((schedule) =>
		mapScheduleToJob(
			schedule,
			technicianLookups,
			propertyMap.get(schedule.property_id ?? "") ?? null,
		),
	);

	const unscheduledJobs = unscheduledJobRows.map((jobRow) =>
		mapJobRowToUnscheduledJob(
			jobRow,
			technicianLookups,
			propertyMap.get(jobRow.property_id ?? "") ?? null,
		),
	);

	const jobs = [...scheduledJobs, ...unscheduledJobs];

	return {
		jobs,
		technicians: technicianLookups.technicians,
		unassignedMeta: {
			limit: unscheduledLimit,
			nextOffset: unscheduledOffset + unscheduledMeta.fetchedCount,
			hasMore: unscheduledMeta.hasMore,
			search: unscheduledSearch,
			totalCount: unscheduledMeta.totalCount,
		},
	};
}

export function resolveScheduleRange(
	range?: Range,
	anchor: Date = new Date(),
): Range {
	if (range) {
		return range;
	}

	const start = subDays(anchor, 7);
	const end = addDays(anchor, 30);
	return { start, end };
}

export async function loadScheduleSnapshot(
	params: LoadParams & { range?: Range },
): Promise<ScheduleHydrationPayload> {
	const resolvedRange = resolveScheduleRange(params.range);
	const { jobs, technicians, unassignedMeta } = await fetchScheduleData({
		...params,
		range: resolvedRange,
	});

	return {
		companyId: params.companyId,
		range: resolvedRange,
		lastSync: new Date(),
		jobs,
		technicians,
		unassignedMeta,
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
	companyId: string,
): Promise<TeamMemberRecord[]> {
	const { data: bareMembers, error: bareError } = await supabase
		.from("company_memberships")
		.select("*")
		.eq("company_id", companyId)
		.eq("status", "active")
		.is("archived_at", null);

	if (bareError) {
		throw bareError;
	}

	const userIds = Array.from(
		new Set(
			(bareMembers ?? [])
				.map((member) => member.user_id)
				.filter((id): id is string => Boolean(id)),
		),
	);

	const usersById = new Map<string, TeamMemberRecord["users"]>();
	if (userIds.length > 0) {
		const { data: users, error: userError } = await supabase
			.from("profiles")
			.select("id, full_name, email, phone, avatar_url")
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

async function fetchUnscheduledJobs(
	supabase: SupabaseClient<Database>,
	companyId: string,
	options: UnscheduledQueryOptions,
): Promise<{
	rows: JobRowWithRelations[];
	totalCount: number;
	hasMore: boolean;
}> {
	const limit = options.limit ?? DEFAULT_UNSCHEDULED_PAGE_SIZE;
	const offset = options.offset ?? 0;

	let query = supabase
		.from("jobs")
		.select(UNSCHEDULED_JOBS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.is("archived_at", null)
		.is("scheduled_start", null)
		.is("scheduled_end", null)
		.not("status", "in", '("completed","cancelled")')
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (options.search?.trim()) {
		const sanitized = options.search.trim().replace(/,/g, "\\,");
		const term = `%${sanitized}%`;
		query = query.or(
			`title.ilike.${term},job_number.ilike.${term},description.ilike.${term}`,
		);
	}

	const { data, error, count } = await query;

	if (error) {
		throw error;
	}

	const rows = (data ?? []) as JobRowWithRelations[];
	const totalCount = typeof count === "number" ? count : rows.length;
	const hasMore = offset + rows.length < totalCount;

	return { rows, totalCount, hasMore };
}

async function fetchPropertiesByIds(
	supabase: SupabaseClient<Database>,
	propertyIds: string[],
): Promise<Map<string, ScheduleProperty>> {
	const map = new Map<string, ScheduleProperty>();
	if (propertyIds.length === 0) {
		return map;
	}

	const chunkSize = 100;
	for (let i = 0; i < propertyIds.length; i += chunkSize) {
		const chunk = propertyIds.slice(i, i + chunkSize);
		const { data, error } = await supabase
			.from("properties")
			.select(
				"id, name, address, address2, city, state, zip_code, country, lat, lon",
			)
			.in("id", chunk);

		if (error) {
			console.error("Properties query error details:", error);
			const details = JSON.stringify(error, null, 2);
			throw new Error(`Properties query failed: ${details}`);
		}

		(data ?? []).forEach((property) => map.set(property.id, property));
	}
	return map;
}

export function mapTeamMembersToTechnicians(
	teamMembers: TeamMemberRecord[],
): TechniciansLookup {
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
			name:
				user?.name || member.invited_name || member.job_title || "Team Member",
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

function collectPropertyIds(
	schedules: ScheduleRow[],
	unscheduledJobs: JobRowWithRelations[],
): string[] {
	const ids = new Set<string>();
	schedules.forEach((row) => {
		if (row.property_id) {
			ids.add(row.property_id);
		}
	});
	unscheduledJobs.forEach((job) => {
		if (job.property_id) {
			ids.add(job.property_id);
		}
	});
	return Array.from(ids);
}

function normalizeSingleRecord<T>(value: T | T[] | null | undefined): T | null {
	if (Array.isArray(value)) {
		return value[0] ?? null;
	}
	return value ?? null;
}

function mapJobRowToUnscheduledJob(
	job: JobRowWithRelations,
	lookups: TechniciansLookup,
	property: ScheduleProperty | null,
): Job {
	const location = buildLocation(property);
	const customer = buildJobCustomer(job, location.address.street);
	const assignments = buildAssignmentsFromJobRow(job, lookups);
	const startTime = job.scheduled_start
		? new Date(job.scheduled_start)
		: new Date(job.created_at);
	const endTime = job.scheduled_end
		? new Date(job.scheduled_end)
		: new Date(
				startTime.getTime() + DEFAULT_UNSCHEDULED_DURATION_MINUTES * 60 * 1000,
			);

	return {
		id: job.id,
		jobId: job.id,
		technicianId: "",
		assignments,
		isUnassigned: true,
		title: job.title || job.job_number || "Job",
		description: job.description || undefined,
		customer,
		location,
		startTime,
		endTime,
		status: mapJobStatus(job.status),
		priority: mapJobPriority(job.priority),
		metadata: buildJobMetadata(job),
		createdAt: new Date(job.created_at),
		updatedAt: new Date(job.updated_at),
	};
}

function buildAssignmentsFromJobRow(
	job: JobRowWithRelations,
	lookups: TechniciansLookup,
): JobAssignment[] {
	const assignments: JobAssignment[] = [];

	if (job.assigned_to) {
		const technician =
			lookups.byUserId.get(job.assigned_to) ||
			lookups.byId.get(job.assigned_to);
		assignments.push({
			technicianId: null,
			teamMemberId: technician?.teamMemberId,
			displayName: technician?.name || "Primary Technician",
			avatar: technician?.avatar ?? null,
			role: "primary",
			status: technician?.status ?? "available",
			isActive: technician?.isActive ?? true,
		});
	}

	const crewAssignments = Array.isArray(job.job_team_assignments)
		? job.job_team_assignments
		: job.job_team_assignments
			? [job.job_team_assignments]
			: [];

	crewAssignments
		.filter((assignment) => !assignment.removed_at)
		.forEach((assignment) => {
			const teamMember = assignment.team_member;
			if (!teamMember) {
				return;
			}

			const technician =
				(teamMember.user_id && lookups.byUserId.get(teamMember.user_id)) ||
				lookups.byTeamMemberId.get(teamMember.id);

			assignments.push({
				technicianId: null,
				teamMemberId: teamMember.id,
				displayName:
					technician?.name ||
					teamMember.invited_name ||
					teamMember.job_title ||
					"Crew Member",
				avatar: technician?.avatar ?? null,
				role: (assignment.role as JobAssignment["role"]) || "crew",
				status: technician?.status ?? deriveTechnicianStatus(teamMember.status),
				isActive: technician?.isActive ?? teamMember.status === "active",
			});
		});

	return dedupeAssignments(assignments);
}

function buildJobCustomer(
	job: JobRowWithRelations,
	fallbackStreet: string,
): Job["customer"] {
	const customerRecord = normalizeSingleRecord(job.customer);
	const name = [
		customerRecord?.first_name?.trim() ?? "",
		customerRecord?.last_name?.trim() ?? "",
	]
		.filter(Boolean)
		.join(" ")
		.trim();

	return {
		id: customerRecord?.id || job.customer_id || `customer-${job.id}`,
		name: name || job.title || "Unspecified Customer",
		email: customerRecord?.email || undefined,
		phone: customerRecord?.phone || undefined,
		location: {
			...DEFAULT_LOCATION,
			address: {
				...DEFAULT_LOCATION.address,
				street: fallbackStreet,
			},
		},
		createdAt: new Date(customerRecord?.created_at ?? job.created_at),
		updatedAt: new Date(customerRecord?.updated_at ?? job.updated_at),
	};
}

function buildJobMetadata(job: JobRowWithRelations): Job["metadata"] {
	const baseMetadata =
		job.metadata && typeof job.metadata === "object"
			? (job.metadata as Job["metadata"])
			: {};
	const metadata = { ...baseMetadata };
	if (job.notes) {
		metadata.notes = job.notes;
	}
	return metadata;
}

function mapJobPriority(value?: string | null): Job["priority"] {
	if (!value) {
		return "medium";
	}
	const normalized = value.toLowerCase();
	switch (normalized) {
		case "low":
		case "medium":
		case "high":
		case "urgent":
			return normalized as Job["priority"];
		case "critical":
		case "emergency":
			return "urgent";
		default:
			return "medium";
	}
}

function mapJobStatus(value?: string | null): Job["status"] {
	if (!value) {
		return "scheduled";
	}
	const normalized = value.toLowerCase();
	switch (normalized) {
		case "scheduled":
		case "dispatched":
		case "arrived":
		case "closed":
		case "cancelled":
			return normalized as Job["status"];
		case "in-progress":
		case "in_progress":
			return "in-progress";
		case "completed":
		case "complete":
		case "done":
			return "completed";
		case "inprogress":
			return "in-progress";
		case "open":
		case "pending":
		case "draft":
		default:
			return "scheduled";
	}
}

export function mapScheduleToJob(
	schedule: ScheduleRecord,
	lookups: TechniciansLookup,
	property: ScheduleProperty | null,
): Job {
	const location = buildLocation(property);
	const customer = buildCustomer(schedule, location.address.street);
	const assignments = buildAssignments(schedule, lookups);

	const primaryAssignment = assignments.find(
		(assignment) => assignment.role === "primary",
	);
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
					endDate: schedule.recurrence_end_date
						? new Date(schedule.recurrence_end_date)
						: undefined,
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

function buildAssignments(
	schedule: ScheduleRecord,
	lookups: TechniciansLookup,
): JobAssignment[] {
	const assignments: JobAssignment[] = [];

	if (schedule.assigned_to) {
		const technician =
			lookups.byUserId.get(schedule.assigned_to) ||
			lookups.byId.get(schedule.assigned_to);
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

	const crewAssignments =
		schedule.job?.job_team_assignments?.filter(
			(assignment) => !assignment.removed_at,
		) ?? [];

	crewAssignments.forEach((assignment) => {
		const teamMember = assignment.team_member;
		if (!teamMember) {
			return;
		}

		const technician =
			(teamMember.user_id && lookups.byUserId.get(teamMember.user_id)) ||
			lookups.byTeamMemberId.get(teamMember.id);

		const displayName =
			technician?.name ||
			teamMember.invited_name ||
			teamMember.job_title ||
			"Crew Member";

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

function buildCustomer(
	schedule: ScheduleRecord,
	fallbackStreet: string,
): Job["customer"] {
	const customerRecord = schedule.customer;
	const name =
		customerRecord &&
		`${customerRecord.first_name ?? ""} ${customerRecord.last_name ?? ""}`.trim();

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
	return [
		"scheduled",
		"dispatched",
		"arrived",
		"in-progress",
		"closed",
		"completed",
		"cancelled",
	].includes(value);
}

export async function fetchAdditionalUnscheduledJobs({
	supabase,
	companyId,
	limit = DEFAULT_UNSCHEDULED_PAGE_SIZE,
	offset = 0,
	search = "",
}: {
	supabase: SupabaseClient<Database>;
	companyId: string;
	limit?: number;
	offset?: number;
	search?: string;
}): Promise<{ jobs: Job[]; meta: UnassignedJobsMeta }> {
	const teamMembers = await fetchTeamMembersWithUsers(supabase, companyId);
	const technicianLookups = mapTeamMembersToTechnicians(teamMembers);
	const { rows, totalCount, hasMore } = await fetchUnscheduledJobs(
		supabase,
		companyId,
		{
			limit,
			offset,
			search,
		},
	);

	const propertyMap = await fetchPropertiesByIds(
		supabase,
		collectPropertyIds([], rows),
	);
	const jobs = rows.map((row) =>
		mapJobRowToUnscheduledJob(
			row,
			technicianLookups,
			propertyMap.get(row.property_id ?? "") ?? null,
		),
	);

	return {
		jobs,
		meta: {
			limit,
			nextOffset: offset + rows.length,
			hasMore,
			search,
			totalCount,
		},
	};
}
