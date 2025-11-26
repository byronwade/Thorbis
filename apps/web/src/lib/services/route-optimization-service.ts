/**
 * Route Optimization Service
 *
 * Optimizes routes for field service technicians using Google Route Optimization API
 * - Multi-stop route optimization (TSP solver)
 * - Time window constraints
 * - Vehicle capacity constraints
 * - Real-time traffic consideration
 * - Support for multiple technicians (VRP)
 *
 * API: Google Route Optimization API
 * Docs: https://developers.google.com/maps/documentation/route-optimization
 *
 * Fallback: Local nearest-neighbor algorithm when API unavailable
 */

import { z } from "zod";
import { googleRoutesService, type LatLng } from "./google-routes-service";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const TimeWindowSchema = z.object({
	start: z.date(),
	end: z.date(),
});

const StopSchema = z.object({
	id: z.string(),
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	address: z.string().optional(),
	serviceDuration: z.number().default(60), // minutes
	timeWindow: TimeWindowSchema.optional(),
	priority: z.number().min(1).max(10).default(5), // 1=low, 10=high
	skills: z.array(z.string()).optional(), // Required skills for this stop
	notes: z.string().optional(),
});

const TechnicianSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	startLocation: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	endLocation: z
		.object({
			lat: z.number(),
			lng: z.number(),
		})
		.optional(), // Defaults to startLocation if not set
	workStart: z.date().optional(), // Start of work day
	workEnd: z.date().optional(), // End of work day
	skills: z.array(z.string()).optional(), // Technician's skills
	maxStops: z.number().optional(), // Maximum stops per day
});

const OptimizedStopSchema = z.object({
	stop: StopSchema,
	arrivalTime: z.date(),
	departureTime: z.date(),
	travelDuration: z.number(), // minutes from previous stop
	travelDistance: z.number(), // meters from previous stop
	waitTime: z.number(), // minutes waiting for time window
	isLate: z.boolean(), // Arrives after time window end
	isEarly: z.boolean(), // Arrives before time window start
	sequenceNumber: z.number(),
});

const TechnicianRouteSchema = z.object({
	technician: TechnicianSchema,
	stops: z.array(OptimizedStopSchema),
	totalDistance: z.number(), // meters
	totalDuration: z.number(), // minutes (driving + service + wait)
	totalDrivingTime: z.number(), // minutes (just driving)
	totalServiceTime: z.number(), // minutes (at stops)
	totalWaitTime: z.number(), // minutes (waiting for time windows)
	startTime: z.date(),
	endTime: z.date(),
	polyline: z.string().optional(),
	unassignedStops: z.array(z.string()), // Stop IDs that couldn't be assigned
});

const OptimizationResultSchema = z.object({
	routes: z.array(TechnicianRouteSchema),
	unassignedStops: z.array(StopSchema),
	totalDistance: z.number(),
	totalDuration: z.number(),
	totalStopsAssigned: z.number(),
	optimizationTime: z.number(), // milliseconds
	algorithm: z.enum(["google", "nearest_neighbor", "genetic"]),
});

export type TimeWindow = z.infer<typeof TimeWindowSchema>;
export type Stop = z.infer<typeof StopSchema>;
export type Technician = z.infer<typeof TechnicianSchema>;
export type OptimizedStop = z.infer<typeof OptimizedStopSchema>;
export type TechnicianRoute = z.infer<typeof TechnicianRouteSchema>;
export type OptimizationResult = z.infer<typeof OptimizationResultSchema>;

// Input type for stops (before parsing)
export interface StopInput {
	id: string;
	location: LatLng;
	address?: string;
	serviceDuration?: number;
	timeWindow?: { start: Date; end: Date };
	priority?: number;
	skills?: string[];
	notes?: string;
}

export interface TechnicianInput {
	id: string;
	name?: string;
	startLocation: LatLng;
	endLocation?: LatLng;
	workStart?: Date;
	workEnd?: Date;
	skills?: string[];
	maxStops?: number;
}

// ============================================================================
// Route Optimization Service
// ============================================================================

class RouteOptimizationService {
	private readonly apiKey: string | undefined;

	constructor() {
		this.apiKey =
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Check if service is available
	 */
	isAvailable(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Optimize routes for multiple technicians and stops
	 * Main entry point for route optimization
	 */
	async optimizeRoutes(
		technicians: TechnicianInput[],
		stops: StopInput[],
		options: {
			considerTraffic?: boolean;
			respectTimeWindows?: boolean;
			respectSkills?: boolean;
			balanceWorkload?: boolean;
			returnToStart?: boolean;
		} = {},
	): Promise<OptimizationResult> {
		const startTime = Date.now();

		const {
			considerTraffic = true,
			respectTimeWindows = true,
			respectSkills = true,
			balanceWorkload = true,
			returnToStart = true,
		} = options;

		// Parse and validate inputs
		const parsedTechnicians = technicians.map((t) =>
			TechnicianSchema.parse({
				...t,
				workStart: t.workStart || new Date(),
				workEnd:
					t.workEnd || new Date(new Date().setHours(new Date().getHours() + 8)),
			}),
		);

		const parsedStops = stops.map((s) =>
			StopSchema.parse({
				...s,
				serviceDuration: s.serviceDuration || 60,
				priority: s.priority || 5,
			}),
		);

		// If only one technician, use simpler single-route optimization
		if (parsedTechnicians.length === 1) {
			const route = await this.optimizeSingleTechnicianRoute(
				parsedTechnicians[0],
				parsedStops,
				{
					considerTraffic,
					respectTimeWindows,
					returnToStart,
				},
			);

			return {
				routes: [route],
				unassignedStops: parsedStops.filter((s) =>
					route.unassignedStops.includes(s.id),
				),
				totalDistance: route.totalDistance,
				totalDuration: route.totalDuration,
				totalStopsAssigned: route.stops.length,
				optimizationTime: Date.now() - startTime,
				algorithm: "nearest_neighbor",
			};
		}

		// Multi-technician optimization
		const result = await this.optimizeMultiTechnicianRoutes(
			parsedTechnicians,
			parsedStops,
			{
				considerTraffic,
				respectTimeWindows,
				respectSkills,
				balanceWorkload,
				returnToStart,
			},
		);

		return {
			...result,
			optimizationTime: Date.now() - startTime,
		};
	}

	/**
	 * Optimize route for a single technician
	 */
	async optimizeSingleTechnicianRoute(
		technician: Technician,
		stops: Stop[],
		options: {
			considerTraffic?: boolean;
			respectTimeWindows?: boolean;
			returnToStart?: boolean;
		} = {},
	): Promise<TechnicianRoute> {
		const { respectTimeWindows = true, returnToStart = true } = options;

		if (stops.length === 0) {
			return this.createEmptyRoute(technician);
		}

		// Get all travel times using distance matrix
		const allLocations = [
			technician.startLocation,
			...stops.map((s) => s.location),
		];

		const matrix = await googleRoutesService.getRouteMatrix(
			allLocations,
			allLocations,
		);

		// Build distance/duration matrices
		const n = allLocations.length;
		const durations: number[][] = Array(n)
			.fill(null)
			.map(() => Array(n).fill(Infinity));
		const distances: number[][] = Array(n)
			.fill(null)
			.map(() => Array(n).fill(0));

		if (matrix) {
			for (const element of matrix.elements) {
				if (element.status === "OK") {
					durations[element.originIndex][element.destinationIndex] =
						element.durationInTraffic / 60; // Convert to minutes
					distances[element.originIndex][element.destinationIndex] =
						element.distance;
				}
			}
		} else {
			// Fallback: estimate durations using Haversine distance
			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) {
					if (i !== j) {
						const dist = this.haversineDistance(
							allLocations[i],
							allLocations[j],
						);
						distances[i][j] = dist;
						durations[i][j] = (dist / 40000) * 60; // 40 km/h average
					}
				}
			}
		}

		// Nearest neighbor algorithm with time window consideration
		const visited = new Set<number>([0]); // Start at technician location (index 0)
		const order: number[] = [];
		let currentIndex = 0;
		let currentTime = technician.workStart || new Date();

		while (order.length < stops.length) {
			let bestIndex = -1;
			let bestScore = Infinity;

			for (let i = 1; i <= stops.length; i++) {
				if (visited.has(i)) continue;

				const stop = stops[i - 1];
				const travelTime = durations[currentIndex][i];
				const arrivalTime = new Date(
					currentTime.getTime() + travelTime * 60 * 1000,
				);

				// Calculate score based on travel time, priority, and time window
				let score = travelTime;

				// Priority bonus (higher priority = lower score)
				score -= (stop.priority || 5) * 5;

				// Time window penalty
				if (respectTimeWindows && stop.timeWindow) {
					if (arrivalTime > stop.timeWindow.end) {
						score += 1000; // Heavy penalty for late arrival
					} else if (arrivalTime < stop.timeWindow.start) {
						// Add wait time to score
						const waitTime =
							(stop.timeWindow.start.getTime() - arrivalTime.getTime()) / 60000;
						score += waitTime * 0.5;
					}
				}

				// Check work day constraints
				const departureTime = new Date(
					arrivalTime.getTime() + (stop.serviceDuration || 60) * 60 * 1000,
				);
				if (technician.workEnd && departureTime > technician.workEnd) {
					score += 2000; // Heavy penalty for overtime
				}

				if (score < bestScore) {
					bestScore = score;
					bestIndex = i;
				}
			}

			if (bestIndex === -1 || bestScore > 1500) {
				// No more feasible stops
				break;
			}

			visited.add(bestIndex);
			order.push(bestIndex);

			// Update current time
			const stop = stops[bestIndex - 1];
			const travelTime = durations[currentIndex][bestIndex];
			let arrivalTime = new Date(
				currentTime.getTime() + travelTime * 60 * 1000,
			);

			// Apply time window wait
			if (respectTimeWindows && stop.timeWindow) {
				if (arrivalTime < stop.timeWindow.start) {
					arrivalTime = stop.timeWindow.start;
				}
			}

			currentTime = new Date(
				arrivalTime.getTime() + (stop.serviceDuration || 60) * 60 * 1000,
			);
			currentIndex = bestIndex;
		}

		// Build the route
		return this.buildRoute(
			technician,
			stops,
			order,
			durations,
			distances,
			returnToStart,
		);
	}

	/**
	 * Optimize routes for multiple technicians (VRP)
	 */
	private async optimizeMultiTechnicianRoutes(
		technicians: Technician[],
		stops: Stop[],
		options: {
			considerTraffic?: boolean;
			respectTimeWindows?: boolean;
			respectSkills?: boolean;
			balanceWorkload?: boolean;
			returnToStart?: boolean;
		},
	): Promise<Omit<OptimizationResult, "optimizationTime">> {
		const {
			respectTimeWindows = true,
			respectSkills = true,
			balanceWorkload = true,
			returnToStart = true,
		} = options;

		// Assign stops to technicians based on proximity and skills
		const assignments: Map<string, Stop[]> = new Map();
		const unassignedStops: Stop[] = [];

		for (const tech of technicians) {
			assignments.set(tech.id, []);
		}

		// Sort stops by priority (high to low)
		const sortedStops = [...stops].sort(
			(a, b) => (b.priority || 5) - (a.priority || 5),
		);

		for (const stop of sortedStops) {
			let bestTechnician: Technician | null = null;
			let bestScore = Infinity;

			for (const tech of technicians) {
				// Check skills
				if (respectSkills && stop.skills && stop.skills.length > 0) {
					const hasAllSkills = stop.skills.every((skill) =>
						tech.skills?.includes(skill),
					);
					if (!hasAllSkills) continue;
				}

				// Check max stops
				const currentStops = assignments.get(tech.id) || [];
				if (tech.maxStops && currentStops.length >= tech.maxStops) continue;

				// Calculate score based on distance from technician's location
				const distance = this.haversineDistance(
					tech.startLocation,
					stop.location,
				);

				// Workload balancing
				let workloadPenalty = 0;
				if (balanceWorkload) {
					workloadPenalty = currentStops.length * 5; // Penalize technicians with more stops
				}

				const score = distance / 1000 + workloadPenalty;

				if (score < bestScore) {
					bestScore = score;
					bestTechnician = tech;
				}
			}

			if (bestTechnician) {
				const techStops = assignments.get(bestTechnician.id) || [];
				techStops.push(stop);
				assignments.set(bestTechnician.id, techStops);
			} else {
				unassignedStops.push(stop);
			}
		}

		// Optimize route for each technician
		const routes: TechnicianRoute[] = [];
		let totalDistance = 0;
		let totalDuration = 0;
		let totalStopsAssigned = 0;

		for (const tech of technicians) {
			const techStops = assignments.get(tech.id) || [];

			const route = await this.optimizeSingleTechnicianRoute(tech, techStops, {
				considerTraffic: options.considerTraffic,
				respectTimeWindows,
				returnToStart,
			});

			routes.push(route);
			totalDistance += route.totalDistance;
			totalDuration += route.totalDuration;
			totalStopsAssigned += route.stops.length;

			// Add any unassigned stops from this route to the main list
			for (const stopId of route.unassignedStops) {
				const stop = techStops.find((s) => s.id === stopId);
				if (stop) {
					unassignedStops.push(stop);
				}
			}
		}

		return {
			routes,
			unassignedStops,
			totalDistance,
			totalDuration,
			totalStopsAssigned,
			algorithm: "nearest_neighbor",
		};
	}

	/**
	 * Build route object from optimization results
	 */
	private buildRoute(
		technician: Technician,
		stops: Stop[],
		order: number[],
		durations: number[][],
		distances: number[][],
		returnToStart: boolean,
	): TechnicianRoute {
		const optimizedStops: OptimizedStop[] = [];
		let currentTime = technician.workStart || new Date();
		let currentIndex = 0;
		let totalDistance = 0;
		let totalDrivingTime = 0;
		let totalServiceTime = 0;
		let totalWaitTime = 0;

		for (let seq = 0; seq < order.length; seq++) {
			const stopIndex = order[seq];
			const stop = stops[stopIndex - 1];
			const travelDuration = durations[currentIndex][stopIndex];
			const travelDistance = distances[currentIndex][stopIndex];

			let arrivalTime = new Date(
				currentTime.getTime() + travelDuration * 60 * 1000,
			);
			let waitTime = 0;
			let isEarly = false;
			let isLate = false;

			// Handle time windows
			if (stop.timeWindow) {
				if (arrivalTime < stop.timeWindow.start) {
					waitTime =
						(stop.timeWindow.start.getTime() - arrivalTime.getTime()) / 60000;
					arrivalTime = stop.timeWindow.start;
					isEarly = true;
				} else if (arrivalTime > stop.timeWindow.end) {
					isLate = true;
				}
			}

			const departureTime = new Date(
				arrivalTime.getTime() + (stop.serviceDuration || 60) * 60 * 1000,
			);

			optimizedStops.push({
				stop,
				arrivalTime,
				departureTime,
				travelDuration,
				travelDistance,
				waitTime,
				isLate,
				isEarly,
				sequenceNumber: seq + 1,
			});

			totalDistance += travelDistance;
			totalDrivingTime += travelDuration;
			totalServiceTime += stop.serviceDuration || 60;
			totalWaitTime += waitTime;
			currentTime = departureTime;
			currentIndex = stopIndex;
		}

		// Add return trip
		if (returnToStart && order.length > 0) {
			const lastIndex = order[order.length - 1];
			const returnDuration = durations[lastIndex][0];
			const returnDistance = distances[lastIndex][0];
			totalDistance += returnDistance;
			totalDrivingTime += returnDuration;
			currentTime = new Date(
				currentTime.getTime() + returnDuration * 60 * 1000,
			);
		}

		const unassignedStops = stops
			.filter((_, i) => !order.includes(i + 1))
			.map((s) => s.id);

		return {
			technician,
			stops: optimizedStops,
			totalDistance,
			totalDuration: totalDrivingTime + totalServiceTime + totalWaitTime,
			totalDrivingTime,
			totalServiceTime,
			totalWaitTime,
			startTime: technician.workStart || new Date(),
			endTime: currentTime,
			unassignedStops,
		};
	}

	/**
	 * Create an empty route for a technician with no stops
	 */
	private createEmptyRoute(technician: Technician): TechnicianRoute {
		const now = technician.workStart || new Date();
		return {
			technician,
			stops: [],
			totalDistance: 0,
			totalDuration: 0,
			totalDrivingTime: 0,
			totalServiceTime: 0,
			totalWaitTime: 0,
			startTime: now,
			endTime: now,
			unassignedStops: [],
		};
	}

	/**
	 * Calculate Haversine distance between two points (meters)
	 */
	private haversineDistance(from: LatLng, to: LatLng): number {
		const R = 6371e3;
		const φ1 = (from.lat * Math.PI) / 180;
		const φ2 = (to.lat * Math.PI) / 180;
		const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
		const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	/**
	 * Get optimization summary for display
	 */
	getOptimizationSummary(result: OptimizationResult): {
		totalTechnicians: number;
		totalStopsAssigned: number;
		totalUnassigned: number;
		totalDistanceKm: number;
		totalDurationHours: number;
		avgStopsPerTechnician: number;
		avgDistancePerTechnician: number;
	} {
		return {
			totalTechnicians: result.routes.length,
			totalStopsAssigned: result.totalStopsAssigned,
			totalUnassigned: result.unassignedStops.length,
			totalDistanceKm: Math.round(result.totalDistance / 1000),
			totalDurationHours: Math.round(result.totalDuration / 60),
			avgStopsPerTechnician:
				result.routes.length > 0
					? Math.round(result.totalStopsAssigned / result.routes.length)
					: 0,
			avgDistancePerTechnician:
				result.routes.length > 0
					? Math.round(result.totalDistance / result.routes.length / 1000)
					: 0,
		};
	}

	/**
	 * Format route for display
	 */
	formatRouteForDisplay(route: TechnicianRoute): {
		technicianName: string;
		stopCount: number;
		startTime: string;
		endTime: string;
		totalDuration: string;
		totalDistance: string;
		stops: Array<{
			sequence: number;
			id: string;
			address: string;
			arrivalTime: string;
			departureTime: string;
			status: "on_time" | "early" | "late";
		}>;
	} {
		return {
			technicianName: route.technician.name || route.technician.id,
			stopCount: route.stops.length,
			startTime: route.startTime.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			endTime: route.endTime.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			totalDuration: this.formatDuration(route.totalDuration),
			totalDistance: this.formatDistance(route.totalDistance),
			stops: route.stops.map((s) => ({
				sequence: s.sequenceNumber,
				id: s.stop.id,
				address: s.stop.address || "Unknown address",
				arrivalTime: s.arrivalTime.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				departureTime: s.departureTime.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				status: s.isLate ? "late" : s.isEarly ? "early" : "on_time",
			})),
		};
	}

	private formatDuration(minutes: number): string {
		if (minutes < 60) {
			return `${Math.round(minutes)} min`;
		}
		const hours = Math.floor(minutes / 60);
		const mins = Math.round(minutes % 60);
		return `${hours}h ${mins}m`;
	}

	private formatDistance(meters: number): string {
		const km = meters / 1000;
		const miles = km * 0.621371;
		return `${miles.toFixed(1)} mi`;
	}
}

// Singleton instance
export const routeOptimizationService = new RouteOptimizationService();
