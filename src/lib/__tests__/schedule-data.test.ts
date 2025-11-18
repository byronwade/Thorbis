import { describe, expect, it } from "@jest/globals";
import type { Job, Technician } from "@/components/schedule/schedule-types";
import type { ScheduleRecord, TechniciansLookup } from "@/lib/schedule-data";
import {
	createTechnicianJobMap,
	mapScheduleToJob,
	mapTeamMembersToTechnicians,
	resolveScheduleRange,
	UNASSIGNED_TECHNICIAN_ID,
} from "@/lib/schedule-data";

const baseSchedule: Partial<ScheduleRecord> = {
	company_id: "company-1",
	property_id: "property-1",
	customer_id: "customer-1",
	job_id: null,
	service_plan_id: null,
	type: "appointment",
	title: "Emergency visit",
	description: null,
	start_time: new Date("2025-01-01T08:00:00Z").toISOString(),
	end_time: new Date("2025-01-01T09:00:00Z").toISOString(),
	duration: 60,
	all_day: false,
	is_recurring: false,
	status: "scheduled",
	confirmed_at: null,
	confirmed_by: null,
	actual_start_time: null,
	actual_end_time: null,
	actual_duration: null,
	completed_by: null,
	reminder_sent: false,
	reminder_sent_at: null,
	reminder_method: null,
	reminder_hours_before: null,
	service_types: null,
	estimated_cost: null,
	location: null,
	access_instructions: null,
	cancelled_at: null,
	cancelled_by: null,
	cancellation_reason: null,
	rescheduled_from_id: null,
	rescheduled_to_id: null,
	notes: null,
	customer_notes: null,
	metadata: null,
	color: null,
	created_at: new Date("2025-01-01T07:00:00Z").toISOString(),
	updated_at: new Date("2025-01-01T07:05:00Z").toISOString(),
	deleted_at: null,
	deleted_by: null,
	archived_at: null,
	parent_schedule_id: null,
	job: null,
	customer: null,
};

const emptyLookups: TechniciansLookup = {
	technicians: [],
	byId: new Map(),
	byUserId: new Map(),
	byTeamMemberId: new Map(),
};

describe("schedule-data normalization", () => {
	it("marks schedules without assignments as unassigned while retaining fallback customer name", () => {
		const schedule = {
			...baseSchedule,
			id: "schedule-unassigned",
			assigned_to: null,
		} as unknown as ScheduleRecord;

		const job = mapScheduleToJob(schedule, emptyLookups, null);

		expect(job.isUnassigned).toBe(true);
		expect(job.assignments).toHaveLength(0);
		expect(job.customer.name).toBe("Unspecified Customer");
	});

	it("creates assignments for primary assignee and job team members", () => {
		const techniciansLookup: TechniciansLookup = {
			technicians: [],
			byId: new Map(),
			byUserId: new Map(),
			byTeamMemberId: new Map(),
		};

		const primaryTechnician: Technician = {
			id: "user-primary",
			userId: "user-primary",
			teamMemberId: "team-primary",
			name: "Primary Tech",
			role: "Lead",
			status: "available",
			schedule: {
				availableHours: { start: 0, end: 40 },
				daysOff: [],
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		techniciansLookup.technicians.push(primaryTechnician);
		techniciansLookup.byId.set(primaryTechnician.id, primaryTechnician);
		techniciansLookup.byUserId.set(
			primaryTechnician.userId!,
			primaryTechnician,
		);

		const schedule = {
			...baseSchedule,
			id: "schedule-assigned",
			assigned_to: "user-primary",
			primary_assignee: {
				id: "user-primary",
				name: "Primary Tech",
				email: "primary@example.com",
				phone: null,
			},
			job: {
				id: "job-1",
				company_id: "company-1",
				job_number: "JOB-1",
				title: "Install",
				created_at: baseSchedule.created_at!,
				updated_at: baseSchedule.updated_at!,
				status: "draft",
				description: null,
				scheduled_start: null,
				scheduled_end: null,
				due_date: null,
				metadata: null,
				customer_id: "customer-1",
				property_id: "property-1",
				deleted_at: null,
				deleted_by: null,
				completed_at: null,
				archived_at: null,
				progress: null,
				actual_start: null,
				actual_end: null,
				actual_duration: null,
				price_book_id: null,
				job_team_assignments: [
					{
						id: "assignment-crew",
						job_id: "job-1",
						team_member_id: "team-crew",
						role: "assistant",
						assigned_at: baseSchedule.created_at!,
						assigned_by: null,
						removed_at: null,
						removed_by: null,
						notes: null,
						metadata: null,
						created_at: baseSchedule.created_at!,
						updated_at: baseSchedule.updated_at!,
						team_member: {
							id: "team-crew",
							company_id: "company-1",
							status: "active",
							job_title: "Crew",
							department: null,
							archived_at: null,
							user_id: "user-crew",
							phone: null,
							email: null,
							invited_name: "Crew Member",
							created_at: baseSchedule.created_at!,
							updated_at: baseSchedule.updated_at!,
							call_forwarding_enabled: null,
							call_forwarding_number: null,
							department_id: null,
							direct_inward_dial: null,
							extension_enabled: null,
							invited_at: null,
							invited_by: null,
							invited_email: null,
							joined_at: null,
							last_active_at: null,
							permissions: null,
							phone_extension: null,
							ring_timeout_seconds: null,
							role: "technician",
							role_id: null,
							simultaneous_ring_enabled: null,
							user_id_old: null,
							voicemail_greeting_url: null,
							voicemail_pin: null,
							users: {
								id: "user-crew",
								name: "Crew Mate",
								email: "crew@example.com",
								phone: null,
							},
						},
					},
				],
			},
		} as unknown as ScheduleRecord;

		const job = mapScheduleToJob(schedule, techniciansLookup, {
			id: "property-1",
			name: "HQ",
			address: "123 Main St",
			address2: null,
			city: "Metropolis",
			state: "CA",
			zip_code: "90210",
			country: "USA",
			lat: 0,
			lon: 0,
		});

		expect(job.technicianId).toBe("user-primary");
		expect(job.assignments).toHaveLength(2);
		expect(job.assignments[0].role).toBe("primary");
		expect(job.assignments[0].displayName).toBe("Primary Tech");
		expect(job.assignments[1].role).toBe("assistant");
		expect(job.assignments[1].displayName).toBe("Crew Mate");
	});

	it("converts team members to technicians with stable identifiers", () => {
		const technicians = mapTeamMembersToTechnicians([
			{
				id: "team-member-1",
				company_id: "company-1",
				status: "active",
				job_title: "Installer",
				department: null,
				archived_at: null,
				user_id: "user-123",
				phone: "555-0101",
				email: "tech@example.com",
				invited_name: null,
				created_at: baseSchedule.created_at!,
				updated_at: baseSchedule.updated_at!,
				call_forwarding_enabled: null,
				call_forwarding_number: null,
				department_id: null,
				direct_inward_dial: null,
				extension_enabled: null,
				invited_at: null,
				invited_by: null,
				invited_email: null,
				joined_at: null,
				last_active_at: null,
				permissions: null,
				phone_extension: null,
				ring_timeout_seconds: null,
				role: "technician",
				role_id: null,
				simultaneous_ring_enabled: null,
				voicemail_greeting_url: null,
				voicemail_pin: null,
				users: {
					id: "user-123",
					name: "Installer One",
					email: "tech@example.com",
					phone: "555-0101",
				},
			},
		]);

		expect(technicians.technicians).toHaveLength(1);
		const tech = technicians.technicians[0];
		expect(tech.id).toBe("user-123");
		expect(tech.teamMemberId).toBe("team-member-1");
		expect(tech.name).toBe("Installer One");
	});
});

describe("schedule-data helpers", () => {
	it("groups jobs by technician and unassigned bucket", () => {
		const now = new Date();
		const jobs: Job[] = [
			{
				id: "job-assigned",
				technicianId: "tech-1",
				assignments: [],
				isUnassigned: false,
				title: "Assigned",
				customer: {
					id: "cust-1",
					name: "Customer",
					location: baseLocation(),
					createdAt: now,
					updatedAt: now,
				},
				location: baseLocation(),
				startTime: now,
				endTime: now,
				status: "scheduled",
				priority: "medium",
				metadata: {},
				createdAt: now,
				updatedAt: now,
			},
			{
				id: "job-unassigned",
				technicianId: "",
				assignments: [],
				isUnassigned: true,
				title: "Needs Tech",
				customer: {
					id: "cust-2",
					name: "Customer 2",
					location: baseLocation(),
					createdAt: now,
					updatedAt: now,
				},
				location: baseLocation(),
				startTime: now,
				endTime: now,
				status: "scheduled",
				priority: "medium",
				metadata: {},
				createdAt: now,
				updatedAt: now,
			},
		];

		const map = createTechnicianJobMap(jobs);
		expect(map["tech-1"]).toHaveLength(1);
		expect(map[UNASSIGNED_TECHNICIAN_ID]).toHaveLength(1);
		expect(map[UNASSIGNED_TECHNICIAN_ID]?.[0].id).toBe("job-unassigned");
	});

	it("builds default range when none is provided", () => {
		const anchor = new Date("2025-01-10T12:00:00Z");
		const range = resolveScheduleRange(undefined, anchor);
		const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
		const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

		expect(range.end.getTime() - range.start.getTime()).toBe(
			sevenDaysMs + thirtyDaysMs,
		);
		expect(range.start.getTime()).toBe(anchor.getTime() - sevenDaysMs);
		expect(range.end.getTime()).toBe(anchor.getTime() + thirtyDaysMs);
	});
});

function baseLocation() {
	return {
		address: {
			street: "123 Main",
			city: "Metropolis",
			state: "CA",
			zip: "90210",
			country: "USA",
		},
		coordinates: {
			lat: 0,
			lng: 0,
		},
	};
}
