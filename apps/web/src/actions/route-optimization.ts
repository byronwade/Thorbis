"use server";

/**
 * Route Optimization Server Actions
 *
 * Uses Google Distance Matrix API to optimize technician routes.
 * Features:
 * - Optimize job order for minimum travel time
 * - Calculate total route duration
 * - Suggest optimal assignments for multiple technicians
 */

import { revalidatePath } from "next/cache";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

type Location = {
	address?: string;
	latitude?: number;
	longitude?: number;
};

type Job = {
	id: string;
	title?: string;
	location: Location;
	scheduledStart?: Date | string;
	scheduledEnd?: Date | string;
	duration?: number; // minutes
};

type OptimizationResult = {
	optimizedOrder: string[]; // Job IDs in optimized order
	totalTravelTime: number; // seconds
	totalDistance: number; // meters
	savings: {
		timeSeconds: number;
		distanceMeters: number;
		percentImprovement: number;
	};
	route: Array<{
		jobId: string;
		fromPrevious: {
			durationSeconds: number;
			distanceMeters: number;
		} | null;
	}>;
};

/**
 * Optimize the order of jobs for a technician to minimize travel time
 *
 * Uses a nearest-neighbor heuristic with 2-opt improvement.
 */
export async function optimizeTechnicianRoute(
	technicianId: string,
	jobs: Job[],
	startLocation?: Location,
): Promise<{
	success: boolean;
	data?: OptimizationResult;
	error?: string;
}> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company" };
		}

		if (jobs.length < 2) {
			return {
				success: true,
				data: {
					optimizedOrder: jobs.map((j) => j.id),
					totalTravelTime: 0,
					totalDistance: 0,
					savings: { timeSeconds: 0, distanceMeters: 0, percentImprovement: 0 },
					route: jobs.map((j) => ({
						jobId: j.id,
						fromPrevious: null,
					})),
				},
			};
		}

		// Get technician's current location if not provided
		let techStart = startLocation;
		if (!techStart) {
			const { data: techData } = await supabase
				.from("company_memberships")
				.select("user:users!user_id(current_latitude, current_longitude)")
				.eq("id", technicianId)
				.single();

			if (techData?.user?.current_latitude && techData?.user?.current_longitude) {
				techStart = {
					latitude: techData.user.current_latitude,
					longitude: techData.user.current_longitude,
				};
			}
		}

		// Build locations array for API call
		const jobLocations = jobs.map((job) => ({
			id: job.id,
			location: job.location,
		}));

		// Get distance matrix from API
		const matrixResponse = await fetch(
			`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/distance`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "matrix",
					origins: jobLocations.map((j) => j.location),
					destinations: jobLocations.map((j) => j.location),
					options: { mode: "driving", departureTime: "now" },
				}),
			},
		);

		if (!matrixResponse.ok) {
			// Fallback: return original order
			return {
				success: true,
				data: {
					optimizedOrder: jobs.map((j) => j.id),
					totalTravelTime: 0,
					totalDistance: 0,
					savings: { timeSeconds: 0, distanceMeters: 0, percentImprovement: 0 },
					route: jobs.map((j) => ({
						jobId: j.id,
						fromPrevious: null,
					})),
				},
			};
		}

		const matrixData = await matrixResponse.json();

		if (!matrixData.success || !matrixData.data?.rows) {
			return {
				success: true,
				data: {
					optimizedOrder: jobs.map((j) => j.id),
					totalTravelTime: 0,
					totalDistance: 0,
					savings: { timeSeconds: 0, distanceMeters: 0, percentImprovement: 0 },
					route: jobs.map((j) => ({
						jobId: j.id,
						fromPrevious: null,
					})),
				},
			};
		}

		// Parse the distance matrix
		const n = jobs.length;
		const distances: number[][] = Array(n)
			.fill(null)
			.map(() => Array(n).fill(Infinity));
		const durations: number[][] = Array(n)
			.fill(null)
			.map(() => Array(n).fill(Infinity));

		for (let i = 0; i < n; i++) {
			const row = matrixData.data.rows[i];
			if (row?.elements) {
				for (let j = 0; j < n; j++) {
					const element = row.elements[j];
					if (element?.status === "OK") {
						distances[i][j] = element.distance?.value || Infinity;
						durations[i][j] = element.duration?.value || Infinity;
					}
				}
			}
		}

		// Calculate original route cost
		const originalOrder = jobs.map((_, i) => i);
		const originalCost = calculateRouteCost(originalOrder, durations);

		// Optimize using nearest neighbor + 2-opt
		const optimizedIndices = optimizeRouteOrder(durations, 0);
		const optimizedCost = calculateRouteCost(optimizedIndices, durations);

		// Build result
		const optimizedOrder = optimizedIndices.map((i) => jobs[i].id);
		const route = optimizedIndices.map((idx, position) => ({
			jobId: jobs[idx].id,
			fromPrevious:
				position === 0
					? null
					: {
							durationSeconds: durations[optimizedIndices[position - 1]][idx],
							distanceMeters: distances[optimizedIndices[position - 1]][idx],
						},
		}));

		const totalTravelTime = optimizedCost;
		const totalDistance = calculateRouteCost(optimizedIndices, distances);

		const savings = {
			timeSeconds: originalCost - optimizedCost,
			distanceMeters:
				calculateRouteCost(originalOrder, distances) -
				calculateRouteCost(optimizedIndices, distances),
			percentImprovement:
				originalCost > 0
					? Math.round(((originalCost - optimizedCost) / originalCost) * 100)
					: 0,
		};

		return {
			success: true,
			data: {
				optimizedOrder,
				totalTravelTime,
				totalDistance,
				savings,
				route,
			},
		};
	} catch (error) {
		console.error("[optimizeTechnicianRoute] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to optimize route",
		};
	}
}

/**
 * Apply route optimization by reordering appointments
 */
export async function applyOptimizedRoute(
	technicianId: string,
	appointmentIds: string[],
	optimizedOrder: string[],
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get current appointments with their times
		const { data: appointments, error: fetchError } = await supabase
			.from("schedule_assignments")
			.select("id, scheduled_start, scheduled_end")
			.in("id", appointmentIds)
			.order("scheduled_start");

		if (fetchError || !appointments) {
			return { success: false, error: "Failed to fetch appointments" };
		}

		// Create a map of original times
		const timeSlots = appointments.map((a) => ({
			start: a.scheduled_start,
			end: a.scheduled_end,
		}));

		// Reassign times based on optimized order
		const updates = optimizedOrder.map((id, newIndex) => ({
			id,
			scheduled_start: timeSlots[newIndex].start,
			scheduled_end: timeSlots[newIndex].end,
			route_optimized_at: new Date().toISOString(),
		}));

		// Update each appointment
		for (const update of updates) {
			await supabase
				.from("schedule_assignments")
				.update({
					scheduled_start: update.scheduled_start,
					scheduled_end: update.scheduled_end,
					route_optimized_at: update.route_optimized_at,
				})
				.eq("id", update.id);
		}

		revalidatePath("/dashboard/schedule");

		return { success: true };
	} catch (error) {
		console.error("[applyOptimizedRoute] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to apply route",
		};
	}
}

/**
 * Get route optimization suggestions for all technicians for a day
 */
export async function getDailyRouteOptimizations(
	date: Date,
): Promise<{
	success: boolean;
	data?: Array<{
		technicianId: string;
		technicianName: string;
		jobCount: number;
		currentTravelTime: number;
		optimizedTravelTime: number;
		potentialSavings: number;
	}>;
	error?: string;
}> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company" };
		}

		// Get the date range
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		// Get all appointments for the day with technician info
		const { data: appointments, error: fetchError } = await supabase
			.from("schedule_assignments")
			.select(
				`
				id,
				technician_id,
				scheduled_start,
				scheduled_end,
				property:properties!property_id(
					id,
					address,
					city,
					state,
					latitude,
					longitude
				),
				technician:company_memberships!technician_id(
					id,
					user:users!user_id(first_name, last_name)
				)
			`,
			)
			.eq("company_id", companyId)
			.gte("scheduled_start", startOfDay.toISOString())
			.lte("scheduled_start", endOfDay.toISOString())
			.is("deleted_at", null)
			.order("scheduled_start");

		if (fetchError || !appointments) {
			return { success: false, error: "Failed to fetch appointments" };
		}

		// Group by technician
		const techAppointments = new Map<string, any[]>();
		for (const apt of appointments) {
			if (apt.technician_id) {
				if (!techAppointments.has(apt.technician_id)) {
					techAppointments.set(apt.technician_id, []);
				}
				techAppointments.get(apt.technician_id)!.push(apt);
			}
		}

		// Calculate optimization potential for each technician
		const results: Array<{
			technicianId: string;
			technicianName: string;
			jobCount: number;
			currentTravelTime: number;
			optimizedTravelTime: number;
			potentialSavings: number;
		}> = [];

		for (const [techId, apts] of techAppointments) {
			if (apts.length < 2) continue;

			const jobs: Job[] = apts.map((a: any) => ({
				id: a.id,
				title: "Job",
				location: {
					address: a.property?.address
						? `${a.property.address}, ${a.property.city}, ${a.property.state}`
						: undefined,
					latitude: a.property?.latitude,
					longitude: a.property?.longitude,
				},
				scheduledStart: a.scheduled_start,
				scheduledEnd: a.scheduled_end,
			}));

			const result = await optimizeTechnicianRoute(techId, jobs);

			if (result.success && result.data) {
				const techName =
					apts[0].technician?.user?.first_name && apts[0].technician?.user?.last_name
						? `${apts[0].technician.user.first_name} ${apts[0].technician.user.last_name}`
						: "Technician";

				results.push({
					technicianId: techId,
					technicianName: techName,
					jobCount: apts.length,
					currentTravelTime:
						result.data.totalTravelTime + result.data.savings.timeSeconds,
					optimizedTravelTime: result.data.totalTravelTime,
					potentialSavings: result.data.savings.timeSeconds,
				});
			}
		}

		return { success: true, data: results };
	} catch (error) {
		console.error("[getDailyRouteOptimizations] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to get route optimizations",
		};
	}
}

// Helper: Calculate total route cost
function calculateRouteCost(order: number[], costs: number[][]): number {
	let total = 0;
	for (let i = 1; i < order.length; i++) {
		total += costs[order[i - 1]][order[i]];
	}
	return total;
}

// Helper: Nearest neighbor algorithm with 2-opt improvement
function optimizeRouteOrder(
	durations: number[][],
	startIndex: number,
): number[] {
	const n = durations.length;
	if (n <= 2) return Array.from({ length: n }, (_, i) => i);

	// Nearest neighbor to get initial solution
	const visited = new Set<number>();
	const route: number[] = [startIndex];
	visited.add(startIndex);

	while (visited.size < n) {
		const current = route[route.length - 1];
		let nearest = -1;
		let nearestDist = Infinity;

		for (let i = 0; i < n; i++) {
			if (!visited.has(i) && durations[current][i] < nearestDist) {
				nearest = i;
				nearestDist = durations[current][i];
			}
		}

		if (nearest !== -1) {
			route.push(nearest);
			visited.add(nearest);
		}
	}

	// 2-opt improvement
	let improved = true;
	while (improved) {
		improved = false;
		for (let i = 0; i < route.length - 2; i++) {
			for (let j = i + 2; j < route.length; j++) {
				if (j === route.length - 1 && i === 0) continue; // Skip if would reverse entire route

				const currentCost =
					durations[route[i]][route[i + 1]] + durations[route[j]][route[j + 1 < route.length ? j + 1 : 0]];
				const newCost =
					durations[route[i]][route[j]] + durations[route[i + 1]][route[j + 1 < route.length ? j + 1 : 0]];

				if (newCost < currentCost) {
					// Reverse the segment between i+1 and j
					const newRoute = [
						...route.slice(0, i + 1),
						...route.slice(i + 1, j + 1).reverse(),
						...route.slice(j + 1),
					];
					route.length = 0;
					route.push(...newRoute);
					improved = true;
				}
			}
		}
	}

	return route;
}
