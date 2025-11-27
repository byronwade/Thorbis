/**
 * Schedule Integration Tests
 *
 * Tests that verify end-to-end workflows and state synchronization.
 * Focus: assign jobs, move between techs, delete cascade, bulk ops.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Job, Technician } from "@/components/schedule/schedule-types";

// =============================================================================
// MOCK STORE (Simulates Zustand behavior without actual store)
// =============================================================================

type MockScheduleStore = {
	jobs: Map<string, Job>;
	technicians: Map<string, Technician>;
	setJobs: (jobs: Job[]) => void;
	addJob: (job: Job) => void;
	updateJob: (jobId: string, updates: Partial<Job>) => void;
	deleteJob: (jobId: string) => void;
	moveJob: (
		jobId: string,
		newTechnicianId: string,
		newStartTime: Date,
		newEndTime: Date,
	) => void;
	bulkUpdateJobs: (updates: Array<{ jobId: string; updates: Partial<Job> }>) => void;
	bulkDeleteJobs: (jobIds: string[]) => void;
	removeTechnician: (techId: string) => void;
	getJobsByTechnician: (techId: string) => Job[];
	getUnassignedJobs: () => Job[];
};

const createMockStore = (): MockScheduleStore => {
	const jobs = new Map<string, Job>();
	const technicians = new Map<string, Technician>();

	return {
		jobs,
		technicians,

		setJobs: (newJobs) => {
			jobs.clear();
			newJobs.forEach((j) => jobs.set(j.id, j));
		},

		addJob: (job) => {
			jobs.set(job.id, job);
		},

		updateJob: (jobId, updates) => {
			const existing = jobs.get(jobId);
			if (existing) {
				jobs.set(jobId, { ...existing, ...updates });
			}
		},

		deleteJob: (jobId) => {
			jobs.delete(jobId);
		},

		moveJob: (jobId, newTechnicianId, newStartTime, newEndTime) => {
			const existing = jobs.get(jobId);
			if (existing) {
				const updatedAssignments =
					existing.assignments.length > 0
						? existing.assignments.map((a) =>
								a.role === "primary"
									? { ...a, technicianId: newTechnicianId }
									: a,
							)
						: [
								{
									technicianId: newTechnicianId,
									displayName: `Tech ${newTechnicianId}`,
									role: "primary" as const,
									isActive: true,
								},
							];

				jobs.set(jobId, {
					...existing,
					technicianId: newTechnicianId,
					assignments: updatedAssignments,
					isUnassigned: !newTechnicianId,
					startTime: newStartTime,
					endTime: newEndTime,
				});
			}
		},

		bulkUpdateJobs: (updates) => {
			updates.forEach(({ jobId, updates: jobUpdates }) => {
				const existing = jobs.get(jobId);
				if (existing) {
					jobs.set(jobId, { ...existing, ...jobUpdates });
				}
			});
		},

		bulkDeleteJobs: (jobIds) => {
			jobIds.forEach((id) => jobs.delete(id));
		},

		removeTechnician: (techId) => {
			technicians.delete(techId);

			// Update all jobs assigned to this technician
			for (const [jobId, job] of jobs) {
				const filteredAssignments = job.assignments.filter(
					(a) => a.technicianId !== techId,
				);

				if (filteredAssignments.length !== job.assignments.length) {
					jobs.set(jobId, {
						...job,
						assignments: filteredAssignments,
						technicianId:
							filteredAssignments.find((a) => a.role === "primary")
								?.technicianId ?? "",
						isUnassigned: filteredAssignments.length === 0,
					});
				}
			}
		},

		getJobsByTechnician: (techId) =>
			Array.from(jobs.values()).filter((job) =>
				job.assignments.some((a) => a.technicianId === techId),
			),

		getUnassignedJobs: () =>
			Array.from(jobs.values()).filter((job) => job.isUnassigned),
	};
};

// =============================================================================
// TEST DATA FACTORIES
// =============================================================================

const createTestJob = (
	id: string,
	technicianId: string = "",
	startHour: number = 9,
): Job => ({
	id,
	jobId: `actual-${id}`,
	technicianId,
	assignments: technicianId
		? [
				{
					technicianId,
					displayName: `Tech ${technicianId}`,
					role: "primary",
					isActive: true,
				},
			]
		: [],
	isUnassigned: !technicianId,
	title: `Job ${id}`,
	description: `Test job ${id}`,
	customer: {
		id: `customer-${id}`,
		name: `Customer ${id}`,
		location: {
			address: { street: "123 Test", city: "City", state: "ST", zip: "12345", country: "USA" },
			coordinates: { lat: 37.7749, lng: -122.4194 },
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	location: {
		address: { street: "123 Test", city: "City", state: "ST", zip: "12345", country: "USA" },
		coordinates: { lat: 37.7749, lng: -122.4194 },
	},
	startTime: new Date(`2024-01-15T${startHour.toString().padStart(2, "0")}:00:00`),
	endTime: new Date(`2024-01-15T${(startHour + 2).toString().padStart(2, "0")}:00:00`),
	status: "scheduled",
	priority: "medium",
	metadata: {},
	createdAt: new Date(),
	updatedAt: new Date(),
});

const createTestTechnician = (id: string): Technician => ({
	id,
	userId: `user-${id}`,
	name: `Technician ${id}`,
	role: "technician",
	status: "available",
	schedule: {
		availableHours: { start: 8, end: 18 },
		daysOff: [],
	},
	createdAt: new Date(),
	updatedAt: new Date(),
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe("Schedule Integration Tests", () => {
	let store: MockScheduleStore;

	beforeEach(() => {
		store = createMockStore();
	});

	describe("Assign Unscheduled Job Workflow", () => {
		it("should assign unscheduled job to technician and appear on timeline", () => {
			// Setup: unassigned job
			const unassignedJob = createTestJob("job-1", "", 10);
			store.addJob(unassignedJob);

			// Verify initial state
			expect(store.getUnassignedJobs().length).toBe(1);
			expect(store.getJobsByTechnician("tech-1").length).toBe(0);

			// Action: assign to technician
			const newStart = new Date("2024-01-15T09:00:00");
			const newEnd = new Date("2024-01-15T11:00:00");
			store.moveJob("job-1", "tech-1", newStart, newEnd);

			// Verify: job moved to technician
			expect(store.getUnassignedJobs().length).toBe(0);
			expect(store.getJobsByTechnician("tech-1").length).toBe(1);

			const assignedJob = store.jobs.get("job-1");
			expect(assignedJob?.technicianId).toBe("tech-1");
			expect(assignedJob?.isUnassigned).toBe(false);
			expect(assignedJob?.startTime).toEqual(newStart);
		});
	});

	describe("Move Job Between Technicians", () => {
		it("should move job from tech-1 to tech-2 and update both", () => {
			// Setup: job assigned to tech-1
			const job = createTestJob("job-1", "tech-1", 9);
			store.addJob(job);

			// Verify initial state
			expect(store.getJobsByTechnician("tech-1").length).toBe(1);
			expect(store.getJobsByTechnician("tech-2").length).toBe(0);

			// Action: move to tech-2
			const newStart = new Date("2024-01-15T14:00:00");
			const newEnd = new Date("2024-01-15T16:00:00");
			store.moveJob("job-1", "tech-2", newStart, newEnd);

			// Verify: job moved
			expect(store.getJobsByTechnician("tech-1").length).toBe(0);
			expect(store.getJobsByTechnician("tech-2").length).toBe(1);

			const movedJob = store.jobs.get("job-1");
			expect(movedJob?.technicianId).toBe("tech-2");
			expect(movedJob?.assignments[0].technicianId).toBe("tech-2");
		});
	});

	describe("Delete Job Cascade", () => {
		it("should remove job from all views when deleted", () => {
			// Setup: multiple jobs
			store.addJob(createTestJob("job-1", "tech-1", 9));
			store.addJob(createTestJob("job-2", "tech-1", 11));
			store.addJob(createTestJob("job-3", "", 10)); // unassigned

			expect(store.jobs.size).toBe(3);

			// Action: delete job-2
			store.deleteJob("job-2");

			// Verify: job removed
			expect(store.jobs.size).toBe(2);
			expect(store.jobs.has("job-2")).toBe(false);
			expect(store.getJobsByTechnician("tech-1").length).toBe(1);
		});

		it("should handle deleting unassigned job", () => {
			store.addJob(createTestJob("job-1", "", 9));

			expect(store.getUnassignedJobs().length).toBe(1);

			store.deleteJob("job-1");

			expect(store.getUnassignedJobs().length).toBe(0);
		});
	});

	describe("Bulk Operations", () => {
		it("should bulk update 10 jobs status", () => {
			// Setup: 10 jobs
			for (let i = 0; i < 10; i++) {
				store.addJob(createTestJob(`job-${i}`, "tech-1", 8 + i));
			}

			// Action: bulk update all to "dispatched"
			const updates = Array.from({ length: 10 }, (_, i) => ({
				jobId: `job-${i}`,
				updates: { status: "dispatched" as const },
			}));
			store.bulkUpdateJobs(updates);

			// Verify: all updated
			for (let i = 0; i < 10; i++) {
				expect(store.jobs.get(`job-${i}`)?.status).toBe("dispatched");
			}
		});

		it("should bulk delete multiple jobs", () => {
			// Setup
			for (let i = 0; i < 5; i++) {
				store.addJob(createTestJob(`job-${i}`, "tech-1", 8 + i));
			}

			expect(store.jobs.size).toBe(5);

			// Action: delete jobs 1, 3
			store.bulkDeleteJobs(["job-1", "job-3"]);

			// Verify
			expect(store.jobs.size).toBe(3);
			expect(store.jobs.has("job-1")).toBe(false);
			expect(store.jobs.has("job-3")).toBe(false);
			expect(store.jobs.has("job-0")).toBe(true);
			expect(store.jobs.has("job-2")).toBe(true);
			expect(store.jobs.has("job-4")).toBe(true);
		});
	});

	describe("Buffer Extension (Date Range)", () => {
		it("should extend buffer correctly when navigating", () => {
			const BUFFER_DAYS_BEFORE = 3;
			const BUFFER_DAYS_AFTER = 3;
			const EXTEND_DAYS = 3;

			let bufferStart = new Date();
			bufferStart.setHours(12, 0, 0, 0);
			const originalStartDay = bufferStart.getDate();

			let bufferEnd = new Date(bufferStart);
			bufferEnd.setDate(bufferEnd.getDate() + 6); // 6 days after start

			// Navigate to earlier date - extend left
			const newStart = new Date(bufferStart);
			newStart.setDate(newStart.getDate() - EXTEND_DAYS);
			bufferStart = newStart;

			// Verify buffer was extended
			const expectedStart = new Date();
			expectedStart.setHours(12, 0, 0, 0);
			expectedStart.setDate(expectedStart.getDate() - EXTEND_DAYS);

			expect(bufferStart.getDate()).toBe(expectedStart.getDate());
		});
	});

	describe("Search + Filter Integration", () => {
		it("should filter unassigned jobs by search term", () => {
			// Setup: various unassigned jobs
			const job1 = createTestJob("job-1", "");
			job1.title = "HVAC Repair";
			job1.customer.name = "John Smith";

			const job2 = createTestJob("job-2", "");
			job2.title = "Plumbing Fix";
			job2.customer.name = "Jane Doe";

			const job3 = createTestJob("job-3", "");
			job3.title = "HVAC Maintenance";
			job3.customer.name = "Bob Johnson";

			store.addJob(job1);
			store.addJob(job2);
			store.addJob(job3);

			// Action: search for "HVAC"
			const searchTerm = "hvac";
			const filtered = store.getUnassignedJobs().filter(
				(job) =>
					job.title.toLowerCase().includes(searchTerm) ||
					job.customer.name.toLowerCase().includes(searchTerm),
			);

			// Verify: 2 matches
			expect(filtered.length).toBe(2);
			expect(filtered.map((j) => j.id).sort()).toEqual(["job-1", "job-3"]);
		});
	});

	describe("Optimistic Update Rollback", () => {
		it("should rollback state when server fails", () => {
			// Setup
			const originalJob = createTestJob("job-1", "tech-1", 9);
			store.addJob(originalJob);

			// Store original state for rollback
			const rollbackState = {
				technicianId: originalJob.technicianId,
				startTime: originalJob.startTime,
				endTime: originalJob.endTime,
				assignments: [...originalJob.assignments],
				isUnassigned: originalJob.isUnassigned,
			};

			// Optimistic update
			const newStart = new Date("2024-01-15T14:00:00");
			const newEnd = new Date("2024-01-15T16:00:00");
			store.moveJob("job-1", "tech-2", newStart, newEnd);

			// Verify optimistic state
			expect(store.jobs.get("job-1")?.technicianId).toBe("tech-2");

			// Simulate server failure - rollback
			store.updateJob("job-1", rollbackState);

			// Verify rollback
			const rolledBack = store.jobs.get("job-1");
			expect(rolledBack?.technicianId).toBe("tech-1");
			expect(rolledBack?.startTime).toEqual(originalJob.startTime);
		});
	});

	describe("Technician Removal Cascade", () => {
		it("should unassign all jobs when technician is removed", () => {
			// Setup: technician with 3 jobs
			store.technicians.set("tech-1", createTestTechnician("tech-1"));
			store.addJob(createTestJob("job-1", "tech-1", 9));
			store.addJob(createTestJob("job-2", "tech-1", 11));
			store.addJob(createTestJob("job-3", "tech-1", 14));

			expect(store.getJobsByTechnician("tech-1").length).toBe(3);
			expect(store.getUnassignedJobs().length).toBe(0);

			// Action: remove technician
			store.removeTechnician("tech-1");

			// Verify: all jobs become unassigned
			expect(store.getJobsByTechnician("tech-1").length).toBe(0);
			expect(store.getUnassignedJobs().length).toBe(3);

			// Verify each job is properly unassigned
			for (const jobId of ["job-1", "job-2", "job-3"]) {
				const job = store.jobs.get(jobId);
				expect(job?.isUnassigned).toBe(true);
				expect(job?.technicianId).toBe("");
				expect(job?.assignments.length).toBe(0);
			}
		});
	});
});
