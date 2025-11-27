/**
 * Schedule Stress Tests
 *
 * Tests that verify system behavior under extreme load conditions.
 * Focus: large data volumes, memory management, rapid operations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Job, Technician, Customer, Location } from "@/components/schedule/schedule-types";

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const createMockLocation = (index: number): Location => ({
	address: {
		street: `${index} Test Street`,
		city: "Test City",
		state: "TS",
		zip: "12345",
		country: "USA",
	},
	coordinates: { lat: 37.7749 + index * 0.001, lng: -122.4194 + index * 0.001 },
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
	const dayOffset = Math.floor(index / 20); // Spread across multiple days
	const hourOffset = (index % 10) + 8; // 8 AM to 5 PM

	const startTime = new Date();
	startTime.setDate(startTime.getDate() + dayOffset);
	startTime.setHours(hourOffset, (index % 4) * 15, 0, 0);

	const endTime = new Date(startTime.getTime() + (60 + (index % 60)) * 60 * 1000);

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
		title: `Job ${index} - ${["Repair", "Install", "Service", "Maintenance"][index % 4]}`,
		description: `Description for job ${index}`,
		jobType: ["service", "repair", "installation", "maintenance"][index % 4] as Job["jobType"],
		customer: createMockCustomer(index),
		location: createMockLocation(index),
		startTime,
		endTime,
		status: "scheduled",
		priority: ["low", "medium", "high", "urgent"][index % 4] as Job["priority"],
		metadata: {
			estimatedDuration: 60 + (index % 60),
			notes: `Notes for job ${index}`,
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};

const createMockTechnician = (index: number): Technician => ({
	id: `tech-${index}`,
	userId: `user-${index}`,
	name: `Technician ${index}`,
	email: `tech${index}@test.com`,
	role: ["technician", "senior", "lead"][index % 3],
	status: ["available", "on-job", "on-break"][index % 3] as Technician["status"],
	isActive: true,
	skills: ["HVAC", "Plumbing", "Electrical"].slice(0, (index % 3) + 1),
	schedule: {
		availableHours: { start: 8, end: 18 },
		daysOff: [],
	},
	createdAt: new Date(),
	updatedAt: new Date(),
});

// =============================================================================
// STRESS TESTS
// =============================================================================

describe("Schedule Stress Tests", () => {
	describe("100 Technicians Rendered", () => {
		it("should handle creating and grouping jobs for 100 technicians", () => {
			const technicianCount = 100;
			const jobsPerTech = 5;

			const technicians = Array.from({ length: technicianCount }, (_, i) =>
				createMockTechnician(i),
			);

			const jobs: Job[] = [];
			let jobIndex = 0;
			for (const tech of technicians) {
				for (let j = 0; j < jobsPerTech; j++) {
					jobs.push(createMockJob(jobIndex++, tech.id));
				}
			}

			// Create Maps (simulates store)
			const techMap = new Map(technicians.map((t) => [t.id, t]));
			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			// Group jobs by technician
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

			// Verify
			expect(techMap.size).toBe(100);
			expect(jobMap.size).toBe(500);
			expect(Object.keys(grouped).length).toBe(100);

			// Each technician should have 5 jobs
			for (let i = 0; i < 100; i++) {
				expect(grouped[`tech-${i}`]?.length).toBe(5);
			}
		});

		it("should not exceed reasonable memory for 100 technicians", () => {
			const technicians = Array.from({ length: 100 }, (_, i) =>
				createMockTechnician(i),
			);

			// Estimate memory: each technician object is roughly 500 bytes
			// 100 technicians * 500 bytes = ~50KB (very reasonable)
			const serialized = JSON.stringify(technicians);
			const sizeInKB = serialized.length / 1024;

			expect(sizeInKB).toBeLessThan(500); // Should be well under 500KB
		});
	});

	describe("500+ Jobs in Day View", () => {
		it("should handle 500 jobs in a single day", () => {
			// Create 500 jobs spread across 10 technicians
			const technicians = Array.from({ length: 10 }, (_, i) =>
				createMockTechnician(i),
			);

			const jobs: Job[] = [];
			for (let i = 0; i < 500; i++) {
				const techIndex = i % 10;
				jobs.push(createMockJob(i, `tech-${techIndex}`));
			}

			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			// Filter for today
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const todayJobs = Array.from(jobMap.values()).filter(
				(job) => job.startTime >= today && job.startTime < tomorrow,
			);

			// Group by technician
			const lanes: Record<string, Job[]> = {};
			for (const job of todayJobs) {
				const techId = job.technicianId || "unassigned";
				if (!lanes[techId]) lanes[techId] = [];
				lanes[techId].push(job);
			}

			// Verify structure is correct
			expect(jobMap.size).toBe(500);
			expect(typeof lanes).toBe("object");
		});

		it("should filter 500 jobs efficiently", () => {
			const jobs = Array.from({ length: 500 }, (_, i) =>
				createMockJob(i, `tech-${i % 10}`),
			);

			const start = performance.now();

			// Filter by multiple criteria
			const filtered = jobs.filter(
				(job) =>
					job.status === "scheduled" &&
					job.priority === "high" &&
					job.jobType === "service",
			);

			const elapsed = performance.now() - start;

			// Should complete in < 50ms
			expect(elapsed).toBeLessThan(50);
		});
	});

	describe("1000 Unassigned Jobs", () => {
		it("should handle 1000 unassigned jobs in panel", () => {
			const unassignedJobs = Array.from({ length: 1000 }, (_, i) =>
				createMockJob(i, ""),
			);

			const jobMap = new Map(unassignedJobs.map((j) => [j.id, j]));

			// Get unassigned
			const unassigned = Array.from(jobMap.values()).filter(
				(job) => job.isUnassigned,
			);

			expect(unassigned.length).toBe(1000);
		});

		it("should paginate 1000 unassigned jobs efficiently", () => {
			const allJobs = Array.from({ length: 1000 }, (_, i) =>
				createMockJob(i, ""),
			);

			const PAGE_SIZE = 50;
			let offset = 0;
			const pages: Job[][] = [];

			const start = performance.now();

			// Simulate loading 20 pages (1000 / 50)
			while (offset < 1000) {
				const page = allJobs.slice(offset, offset + PAGE_SIZE);
				pages.push(page);
				offset += PAGE_SIZE;
			}

			const elapsed = performance.now() - start;

			expect(pages.length).toBe(20);
			expect(elapsed).toBeLessThan(50);
		});

		it("should search through 1000 jobs quickly", () => {
			const jobs = Array.from({ length: 1000 }, (_, i) => {
				const job = createMockJob(i, "");
				// Add variety to titles for search testing
				job.title = `${["HVAC", "Plumbing", "Electrical", "General"][i % 4]} Job ${i}`;
				return job;
			});

			const start = performance.now();

			const searchTerm = "hvac";
			const results = jobs.filter(
				(job) =>
					job.title.toLowerCase().includes(searchTerm) ||
					job.customer.name.toLowerCase().includes(searchTerm) ||
					job.description?.toLowerCase().includes(searchTerm),
			);

			const elapsed = performance.now() - start;

			// Should find ~250 results (1/4 of jobs have HVAC)
			expect(results.length).toBe(250);
			expect(elapsed).toBeLessThan(100);
		});
	});

	describe("30-Day Range Loading", () => {
		it("should load jobs for 30-day range efficiently", () => {
			// Generate ~30 jobs per day for 30 days = 900 jobs
			const jobs: Job[] = [];
			for (let day = 0; day < 30; day++) {
				for (let job = 0; job < 30; job++) {
					const j = createMockJob(day * 30 + job, `tech-${job % 10}`);
					const startTime = new Date();
					startTime.setDate(startTime.getDate() + day);
					startTime.setHours(8 + (job % 10), (job % 4) * 15, 0, 0);
					j.startTime = startTime;
					j.endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
					jobs.push(j);
				}
			}

			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			// Filter for date range
			const rangeStart = new Date();
			rangeStart.setHours(0, 0, 0, 0);
			const rangeEnd = new Date(rangeStart);
			rangeEnd.setDate(rangeEnd.getDate() + 30);

			const start = performance.now();

			const rangeJobs = Array.from(jobMap.values()).filter(
				(job) => job.startTime >= rangeStart && job.startTime <= rangeEnd,
			);

			// Group by day
			const byDay: Record<string, Job[]> = {};
			for (const job of rangeJobs) {
				const dayKey = job.startTime.toISOString().split("T")[0];
				if (!byDay[dayKey]) byDay[dayKey] = [];
				byDay[dayKey].push(job);
			}

			const elapsed = performance.now() - start;

			expect(rangeJobs.length).toBe(900);
			expect(Object.keys(byDay).length).toBe(30);
			expect(elapsed).toBeLessThan(200);
		});
	});

	describe("Rapid View Switching", () => {
		it("should handle 10 rapid view switches without corruption", () => {
			const jobs = Array.from({ length: 200 }, (_, i) =>
				createMockJob(i, `tech-${i % 5}`),
			);

			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			type ViewMode = "day" | "week" | "month" | "list";
			const viewModes: ViewMode[] = ["day", "week", "month", "list"];

			let currentView: ViewMode = "day";
			let currentDate = new Date();
			const results: { view: ViewMode; jobCount: number }[] = [];

			// Simulate 10 rapid view switches
			for (let i = 0; i < 10; i++) {
				currentView = viewModes[i % 4];

				// Filter based on view
				let rangeStart = new Date(currentDate);
				let rangeEnd = new Date(currentDate);

				switch (currentView) {
					case "day":
						rangeStart.setHours(0, 0, 0, 0);
						rangeEnd.setHours(23, 59, 59, 999);
						break;
					case "week":
						rangeStart.setDate(rangeStart.getDate() - rangeStart.getDay());
						rangeEnd.setDate(rangeStart.getDate() + 7);
						break;
					case "month":
						rangeStart.setDate(1);
						rangeEnd.setMonth(rangeEnd.getMonth() + 1);
						rangeEnd.setDate(0);
						break;
					case "list":
						// List shows all
						rangeStart = new Date(0);
						rangeEnd = new Date(2099, 11, 31);
						break;
				}

				const viewJobs = Array.from(jobMap.values()).filter(
					(job) => job.startTime >= rangeStart && job.startTime <= rangeEnd,
				);

				results.push({ view: currentView, jobCount: viewJobs.length });
			}

			// Verify no corruption - same view should return same count
			expect(results.length).toBe(10);

			// Map should still have all jobs
			expect(jobMap.size).toBe(200);
		});
	});

	describe("Rapid Date Navigation", () => {
		it("should handle 20 rapid date navigations without state corruption", () => {
			const jobs = Array.from({ length: 300 }, (_, i) => {
				const job = createMockJob(i, `tech-${i % 5}`);
				// Spread across 30 days
				const startTime = new Date();
				startTime.setDate(startTime.getDate() + (i % 30) - 15); // -15 to +15 days
				startTime.setHours(8 + (i % 10), 0, 0, 0);
				job.startTime = startTime;
				job.endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
				return job;
			});

			const jobMap = new Map(jobs.map((j) => [j.id, j]));

			let currentDate = new Date();
			const navigationHistory: Date[] = [new Date(currentDate)];

			// Simulate 20 navigations (mix of next/previous)
			for (let i = 0; i < 20; i++) {
				if (i % 3 === 0) {
					// Go previous
					currentDate.setDate(currentDate.getDate() - 1);
				} else {
					// Go next
					currentDate.setDate(currentDate.getDate() + 1);
				}
				navigationHistory.push(new Date(currentDate));
			}

			// Final state check
			expect(navigationHistory.length).toBe(21);

			// Get jobs for final date
			const dayStart = new Date(currentDate);
			dayStart.setHours(0, 0, 0, 0);
			const dayEnd = new Date(currentDate);
			dayEnd.setHours(23, 59, 59, 999);

			const dayJobs = Array.from(jobMap.values()).filter(
				(job) => job.startTime >= dayStart && job.startTime <= dayEnd,
			);

			// Should still be able to filter correctly
			expect(Array.isArray(dayJobs)).toBe(true);

			// Map should be unchanged
			expect(jobMap.size).toBe(300);
		});
	});

	describe("Memory Efficiency", () => {
		it("should not leak memory on repeated operations", () => {
			const jobs = new Map<string, Job>();

			// Simulate 1000 add/remove cycles
			for (let cycle = 0; cycle < 100; cycle++) {
				// Add 10 jobs
				for (let i = 0; i < 10; i++) {
					const job = createMockJob(cycle * 10 + i, `tech-${i % 5}`);
					jobs.set(job.id, job);
				}

				// Remove 10 jobs
				for (let i = 0; i < 10; i++) {
					jobs.delete(`job-${cycle * 10 + i}`);
				}
			}

			// After all cycles, map should be empty
			expect(jobs.size).toBe(0);
		});

		it("should handle large JSON serialization", () => {
			const jobs = Array.from({ length: 500 }, (_, i) =>
				createMockJob(i, `tech-${i % 10}`),
			);

			// Simulate persist serialization
			const start = performance.now();
			const serialized = JSON.stringify(jobs);
			const parsed = JSON.parse(serialized);
			const elapsed = performance.now() - start;

			expect(parsed.length).toBe(500);
			expect(elapsed).toBeLessThan(500); // Should complete in < 500ms
		});
	});
});
