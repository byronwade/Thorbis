/**
 * Schedule Performance Benchmarks
 *
 * Tests that measure speed and performance of schedule operations.
 * Targets: render < 100ms, drag < 16ms (1 frame), view switch < 200ms
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Job, Technician, Customer, Location } from "@/components/schedule/schedule-types";

// =============================================================================
// TEST UTILITIES - Factory functions for generating test data
// =============================================================================

const createMockLocation = (index: number): Location => ({
	address: {
		street: `${index} Test Street`,
		city: "Test City",
		state: "TS",
		zip: "12345",
		country: "USA",
	},
	coordinates: { lat: 37.7749 + index * 0.01, lng: -122.4194 + index * 0.01 },
});

const createMockCustomer = (index: number): Customer => ({
	id: `customer-${index}`,
	name: `Customer ${index}`,
	email: `customer${index}@test.com`,
	phone: "555-0100",
	location: createMockLocation(index),
	createdAt: new Date(),
	updatedAt: new Date(),
});

const createMockJob = (index: number, technicianId: string = ""): Job => {
	const startTime = new Date();
	startTime.setHours(8 + (index % 10), (index % 4) * 15, 0, 0);
	const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours

	return {
		id: `job-${index}`,
		jobId: `actual-job-${index}`,
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
		title: `Job ${index}`,
		description: `Description for job ${index}`,
		jobType: "service",
		customer: createMockCustomer(index),
		location: createMockLocation(index),
		startTime,
		endTime,
		status: "scheduled",
		priority: "medium",
		metadata: {},
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};

const createMockTechnician = (index: number): Technician => ({
	id: `tech-${index}`,
	userId: `user-${index}`,
	name: `Technician ${index}`,
	email: `tech${index}@test.com`,
	role: "technician",
	status: "available",
	isActive: true,
	schedule: {
		availableHours: { start: 8, end: 18 },
		daysOff: [],
	},
	createdAt: new Date(),
	updatedAt: new Date(),
});

const generateJobsForTechnicians = (
	technicianCount: number,
	jobsPerTechnician: number,
): { jobs: Job[]; technicians: Technician[] } => {
	const technicians = Array.from({ length: technicianCount }, (_, i) =>
		createMockTechnician(i),
	);

	const jobs: Job[] = [];
	let jobIndex = 0;
	for (const tech of technicians) {
		for (let j = 0; j < jobsPerTechnician; j++) {
			jobs.push(createMockJob(jobIndex++, tech.id));
		}
	}

	return { jobs, technicians };
};

const generateUnassignedJobs = (count: number): Job[] => {
	return Array.from({ length: count }, (_, i) => createMockJob(i, ""));
};

// =============================================================================
// PERFORMANCE MEASUREMENT UTILITY
// =============================================================================

function measurePerformance(fn: () => void): number {
	const start = performance.now();
	fn();
	return performance.now() - start;
}

async function measureAsyncPerformance(fn: () => Promise<void>): Promise<number> {
	const start = performance.now();
	await fn();
	return performance.now() - start;
}

// =============================================================================
// PERFORMANCE BENCHMARKS
// =============================================================================

describe("Schedule Performance Benchmarks", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Data Structure Performance", () => {
		it("should render 50 jobs in < 100ms (Map creation + iteration)", () => {
			const { jobs } = generateJobsForTechnicians(5, 10); // 50 jobs

			const elapsed = measurePerformance(() => {
				// Simulate store operations: create Map, iterate for grouping
				const jobMap = new Map(jobs.map((j) => [j.id, j]));
				const grouped: Record<string, Job[]> = {};

				for (const job of jobMap.values()) {
					for (const assignment of job.assignments) {
						if (!assignment.technicianId) continue;
						if (!grouped[assignment.technicianId]) {
							grouped[assignment.technicianId] = [];
						}
						grouped[assignment.technicianId].push(job);
					}
				}
			});

			expect(elapsed).toBeLessThan(100);
		});

		it("should render 500 jobs in < 500ms (stress test)", () => {
			const { jobs } = generateJobsForTechnicians(50, 10); // 500 jobs

			const elapsed = measurePerformance(() => {
				const jobMap = new Map(jobs.map((j) => [j.id, j]));
				const grouped: Record<string, Job[]> = {};

				for (const job of jobMap.values()) {
					for (const assignment of job.assignments) {
						if (!assignment.technicianId) continue;
						if (!grouped[assignment.technicianId]) {
							grouped[assignment.technicianId] = [];
						}
						grouped[assignment.technicianId].push(job);
					}
				}
			});

			expect(elapsed).toBeLessThan(500);
		});

		it("should render 1000 jobs in < 1000ms (breaking point)", () => {
			const { jobs } = generateJobsForTechnicians(100, 10); // 1000 jobs

			const elapsed = measurePerformance(() => {
				const jobMap = new Map(jobs.map((j) => [j.id, j]));
				const grouped: Record<string, Job[]> = {};

				for (const job of jobMap.values()) {
					for (const assignment of job.assignments) {
						if (!assignment.technicianId) continue;
						if (!grouped[assignment.technicianId]) {
							grouped[assignment.technicianId] = [];
						}
						grouped[assignment.technicianId].push(job);
					}
				}
			});

			expect(elapsed).toBeLessThan(1000);
		});
	});

	describe("Job Lookup Performance (O(1) vs O(n))", () => {
		it("should lookup job by ID in O(1) using Map (< 1ms for 1000 jobs)", () => {
			const { jobs } = generateJobsForTechnicians(100, 10); // 1000 jobs
			const jobMap = new Map(jobs.map((j) => [j.id, j]));
			const targetId = "job-500";

			const elapsed = measurePerformance(() => {
				// Perform 1000 lookups to get measurable time
				for (let i = 0; i < 1000; i++) {
					jobMap.get(targetId);
				}
			});

			expect(elapsed).toBeLessThan(5); // 1000 lookups in < 5ms
		});

		it("should be faster than O(n) array find", () => {
			const { jobs } = generateJobsForTechnicians(100, 10); // 1000 jobs
			const jobMap = new Map(jobs.map((j) => [j.id, j]));
			const targetId = "job-500";

			// Map lookup
			const mapElapsed = measurePerformance(() => {
				for (let i = 0; i < 100; i++) {
					jobMap.get(targetId);
				}
			});

			// Array find (O(n))
			const arrayElapsed = measurePerformance(() => {
				for (let i = 0; i < 100; i++) {
					jobs.find((j) => j.id === targetId);
				}
			});

			// Map should be significantly faster
			expect(mapElapsed).toBeLessThan(arrayElapsed);
		});
	});

	describe("Drag Operation Performance", () => {
		it("should cache job data for drag in < 16ms (1 frame)", () => {
			const { jobs, technicians } = generateJobsForTechnicians(10, 50); // 500 jobs
			const technicianLanes = technicians.map((tech) => ({
				technicianId: tech.id,
				jobs: jobs
					.filter((j) => j.technicianId === tech.id)
					.map((job) => ({ job })),
			}));

			const targetJobId = "job-250";

			const elapsed = measurePerformance(() => {
				// Simulate drag start - find job in lanes
				const jobData = technicianLanes
					.flatMap((lane) => lane.jobs)
					.find((j) => j.job.id === targetJobId);

				if (jobData) {
					const job = jobData.job;
					const duration = job.endTime.getTime() - job.startTime.getTime();
					// Cache creation
					const cache = {
						job,
						startTime: job.startTime,
						endTime: job.endTime,
						duration,
						isFromUnassigned: false,
					};
				}
			});

			expect(elapsed).toBeLessThan(16);
		});

		it("should calculate snapped time in < 1ms", () => {
			const SNAP_INTERVAL = 15; // 15 minute intervals

			const elapsed = measurePerformance(() => {
				// Simulate 1000 drag move calculations
				for (let i = 0; i < 1000; i++) {
					const deltaMinutes = Math.random() * 480 - 240; // -4 to +4 hours
					const snappedMinutes =
						Math.round(deltaMinutes / SNAP_INTERVAL) * SNAP_INTERVAL;
					const newTime = new Date(Date.now() + snappedMinutes * 60 * 1000);
				}
			});

			expect(elapsed).toBeLessThan(10); // 1000 calculations in < 10ms
		});

		it("should complete drag drop operation in < 50ms", () => {
			const { jobs, technicians } = generateJobsForTechnicians(10, 50);
			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			const elapsed = measurePerformance(() => {
				// Simulate optimistic update
				const targetJob = jobMap.get("job-100");
				if (targetJob) {
					const newStart = new Date(targetJob.startTime.getTime() + 60 * 60 * 1000);
					const newEnd = new Date(targetJob.endTime.getTime() + 60 * 60 * 1000);

					// Update Map (simulates Zustand state update)
					jobMap.set(targetJob.id, {
						...targetJob,
						technicianId: "tech-5",
						startTime: newStart,
						endTime: newEnd,
					});
				}
			});

			expect(elapsed).toBeLessThan(50);
		});
	});

	describe("View Switching Performance", () => {
		it("should switch from day to week view in < 200ms", () => {
			const { jobs } = generateJobsForTechnicians(10, 50); // 500 jobs
			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			const elapsed = measurePerformance(() => {
				// Simulate day → week: need to filter jobs for 7-day range
				const weekStart = new Date();
				weekStart.setDate(weekStart.getDate() - weekStart.getDay());
				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekEnd.getDate() + 7);

				const weekJobs = Array.from(jobMap.values()).filter(
					(job) => job.startTime >= weekStart && job.startTime <= weekEnd,
				);

				// Group by day
				const grouped: Record<string, Job[]> = {};
				for (const job of weekJobs) {
					const dayKey = job.startTime.toISOString().split("T")[0];
					if (!grouped[dayKey]) grouped[dayKey] = [];
					grouped[dayKey].push(job);
				}
			});

			expect(elapsed).toBeLessThan(200);
		});

		it("should switch from week to month view in < 200ms", () => {
			const { jobs } = generateJobsForTechnicians(10, 100); // 1000 jobs for month view

			const elapsed = measurePerformance(() => {
				// Simulate week → month: need to filter jobs for ~30 days
				const monthStart = new Date();
				monthStart.setDate(1);
				const monthEnd = new Date(monthStart);
				monthEnd.setMonth(monthEnd.getMonth() + 1);

				const monthJobs = jobs.filter(
					(job) => job.startTime >= monthStart && job.startTime <= monthEnd,
				);

				// Group by day for calendar display
				const grouped: Record<string, Job[]> = {};
				for (const job of monthJobs) {
					const dayKey = job.startTime.toISOString().split("T")[0];
					if (!grouped[dayKey]) grouped[dayKey] = [];
					grouped[dayKey].push(job);
				}
			});

			expect(elapsed).toBeLessThan(200);
		});
	});

	describe("Unassigned Panel Performance", () => {
		it("should load 50 unassigned jobs in < 100ms", () => {
			const unassigned = generateUnassignedJobs(50);

			const elapsed = measurePerformance(() => {
				const jobMap = new Map(unassigned.map((j) => [j.id, j]));
				const filtered = Array.from(jobMap.values()).filter((j) => j.isUnassigned);
			});

			expect(elapsed).toBeLessThan(100);
		});

		it("should paginate (load 50 more) in < 150ms", () => {
			const existing = generateUnassignedJobs(500);
			const newBatch = generateUnassignedJobs(50).map((j, i) => ({
				...j,
				id: `job-new-${i}`,
			}));

			const jobMap = new Map(existing.map((j) => [j.id, j]));

			const elapsed = measurePerformance(() => {
				// Add new batch to existing Map
				for (const job of newBatch) {
					jobMap.set(job.id, job);
				}
				// Re-filter unassigned
				const unassigned = Array.from(jobMap.values()).filter((j) => j.isUnassigned);
			});

			expect(elapsed).toBeLessThan(150);
		});
	});

	describe("Search/Filter Performance", () => {
		it("should filter 500 jobs by search term in < 100ms", () => {
			const { jobs } = generateJobsForTechnicians(50, 10); // 500 jobs

			const elapsed = measurePerformance(() => {
				const searchTerm = "job 10".toLowerCase();
				const filtered = jobs.filter(
					(job) =>
						job.title.toLowerCase().includes(searchTerm) ||
						job.customer.name.toLowerCase().includes(searchTerm) ||
						job.description?.toLowerCase().includes(searchTerm),
				);
			});

			expect(elapsed).toBeLessThan(100);
		});
	});

	describe("Zoom Level Performance", () => {
		it("should recalculate positions for zoom change in < 100ms", () => {
			const { jobs, technicians } = generateJobsForTechnicians(10, 50); // 500 jobs

			const HOUR_WIDTH_15 = 320; // 15-min zoom
			const HOUR_WIDTH_30 = 160; // 30-min zoom
			const HOUR_WIDTH_60 = 80; // 60-min zoom

			const elapsed = measurePerformance(() => {
				// Simulate zoom from 30 → 15 minutes
				const dayStart = new Date();
				dayStart.setHours(0, 0, 0, 0);

				const positions = jobs.map((job) => {
					const startMinutes =
						(job.startTime.getTime() - dayStart.getTime()) / (1000 * 60);
					const endMinutes =
						(job.endTime.getTime() - dayStart.getTime()) / (1000 * 60);

					return {
						jobId: job.id,
						left: (startMinutes / 60) * HOUR_WIDTH_15,
						width: ((endMinutes - startMinutes) / 60) * HOUR_WIDTH_15,
					};
				});
			});

			expect(elapsed).toBeLessThan(100);
		});
	});

	describe("Conflict Detection Performance", () => {
		it("should check conflicts for 100 jobs in < 10ms", () => {
			const { jobs } = generateJobsForTechnicians(1, 100); // 100 jobs, 1 technician
			const technicianId = "tech-0";

			// Target time to check for conflicts
			const checkStart = new Date();
			checkStart.setHours(10, 0, 0, 0);
			const checkEnd = new Date();
			checkEnd.setHours(12, 0, 0, 0);

			const elapsed = measurePerformance(() => {
				const techJobs = jobs.filter((job) =>
					job.assignments.some((a) => a.technicianId === technicianId),
				);

				const hasConflict = techJobs.some((job) => {
					return (
						(checkStart >= job.startTime && checkStart < job.endTime) ||
						(checkEnd > job.startTime && checkEnd <= job.endTime) ||
						(checkStart <= job.startTime && checkEnd >= job.endTime)
					);
				});
			});

			expect(elapsed).toBeLessThan(10);
		});
	});

	describe("Route Optimization Mock Performance", () => {
		it("should sort 10 stops by distance in < 2s (nearest neighbor)", () => {
			const stops = Array.from({ length: 10 }, (_, i) => ({
				id: `stop-${i}`,
				lat: 37.7749 + Math.random() * 0.1,
				lng: -122.4194 + Math.random() * 0.1,
			}));

			const haversineDistance = (
				lat1: number,
				lng1: number,
				lat2: number,
				lng2: number,
			): number => {
				const R = 6371; // Earth's radius in km
				const dLat = ((lat2 - lat1) * Math.PI) / 180;
				const dLng = ((lng2 - lng1) * Math.PI) / 180;
				const a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos((lat1 * Math.PI) / 180) *
						Math.cos((lat2 * Math.PI) / 180) *
						Math.sin(dLng / 2) *
						Math.sin(dLng / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				return R * c;
			};

			const elapsed = measurePerformance(() => {
				// Nearest neighbor algorithm
				const visited = new Set<string>();
				const route: typeof stops = [];
				let current = stops[0];
				route.push(current);
				visited.add(current.id);

				while (route.length < stops.length) {
					let nearest: (typeof stops)[0] | null = null;
					let nearestDist = Infinity;

					for (const stop of stops) {
						if (visited.has(stop.id)) continue;
						const dist = haversineDistance(
							current.lat,
							current.lng,
							stop.lat,
							stop.lng,
						);
						if (dist < nearestDist) {
							nearestDist = dist;
							nearest = stop;
						}
					}

					if (nearest) {
						route.push(nearest);
						visited.add(nearest.id);
						current = nearest;
					}
				}
			});

			expect(elapsed).toBeLessThan(2000);
		});

		it("should sort 25 stops by distance in < 5s", () => {
			const stops = Array.from({ length: 25 }, (_, i) => ({
				id: `stop-${i}`,
				lat: 37.7749 + Math.random() * 0.2,
				lng: -122.4194 + Math.random() * 0.2,
			}));

			const haversineDistance = (
				lat1: number,
				lng1: number,
				lat2: number,
				lng2: number,
			): number => {
				const R = 6371;
				const dLat = ((lat2 - lat1) * Math.PI) / 180;
				const dLng = ((lng2 - lng1) * Math.PI) / 180;
				const a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos((lat1 * Math.PI) / 180) *
						Math.cos((lat2 * Math.PI) / 180) *
						Math.sin(dLng / 2) *
						Math.sin(dLng / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				return R * c;
			};

			const elapsed = measurePerformance(() => {
				const visited = new Set<string>();
				const route: typeof stops = [];
				let current = stops[0];
				route.push(current);
				visited.add(current.id);

				while (route.length < stops.length) {
					let nearest: (typeof stops)[0] | null = null;
					let nearestDist = Infinity;

					for (const stop of stops) {
						if (visited.has(stop.id)) continue;
						const dist = haversineDistance(
							current.lat,
							current.lng,
							stop.lat,
							stop.lng,
						);
						if (dist < nearestDist) {
							nearestDist = dist;
							nearest = stop;
						}
					}

					if (nearest) {
						route.push(nearest);
						visited.add(nearest.id);
						current = nearest;
					}
				}
			});

			expect(elapsed).toBeLessThan(5000);
		});
	});
});
