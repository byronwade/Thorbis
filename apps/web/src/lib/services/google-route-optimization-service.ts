/**
 * Google Cloud Route Optimization Service
 *
 * Provides route optimization capabilities for Stratos field service platform:
 * - Multi-stop route optimization for technicians
 * - Vehicle Routing Problem (VRP) solver
 * - Time window constraints for appointments
 * - Capacity constraints for equipment/parts
 * - Break time scheduling
 *
 * API Documentation: https://cloud.google.com/optimization/docs
 *
 * Features:
 * - Optimize routes for multiple technicians
 * - Consider traffic conditions
 * - Handle time windows for appointments
 * - Support vehicle capacity constraints
 * - Calculate optimal job sequencing
 * - Minimize total travel time/distance
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Geographic location with coordinates
 */
export interface LatLng {
	latitude: number;
	longitude: number;
}

/**
 * Time window for job scheduling
 */
export interface TimeWindow {
	startTime: string; // ISO 8601 format
	endTime: string; // ISO 8601 format
}

/**
 * Duration in seconds
 */
export interface Duration {
	seconds: string;
}

/**
 * Shipment (job/appointment) to be scheduled
 */
export interface Shipment {
	pickups?: Array<{
		arrivalLocation: LatLng;
		duration?: Duration;
		timeWindows?: TimeWindow[];
		label?: string;
	}>;
	deliveries: Array<{
		arrivalLocation: LatLng;
		duration: Duration;
		timeWindows?: TimeWindow[];
		label?: string;
	}>;
	label?: string;
	penaltyCost?: number;
	loadDemands?: Record<
		string,
		{
			amount: string;
		}
	>;
}

/**
 * Vehicle (technician) configuration
 */
export interface Vehicle {
	startLocation: LatLng;
	endLocation?: LatLng;
	startTimeWindows?: TimeWindow[];
	endTimeWindows?: TimeWindow[];
	travelMode?: "DRIVING" | "WALKING";
	travelDurationMultiple?: number;
	costPerHour?: number;
	costPerKilometer?: number;
	fixedCost?: number;
	loadLimits?: Record<
		string,
		{
			maxLoad: string;
		}
	>;
	breakRule?: {
		breakRequests: Array<{
			earliestStartTime: string;
			latestStartTime: string;
			minDuration: Duration;
		}>;
	};
	label?: string;
}

/**
 * Optimization request model
 */
export interface OptimizationRequest {
	model: {
		shipments: Shipment[];
		vehicles: Vehicle[];
		globalStartTime: string;
		globalEndTime: string;
	};
	solvingMode?:
		| "DEFAULT_SOLVE"
		| "VALIDATE_ONLY"
		| "DETECT_SOME_INFEASIBLE_SHIPMENTS";
	searchMode?: "RETURN_FAST" | "CONSUME_ALL_AVAILABLE_TIME";
	considerRoadTraffic?: boolean;
	populatePolylines?: boolean;
	populateTransitionPolylines?: boolean;
	allowLargeDeadlineDespiteInterruptionRisk?: boolean;
	useGeodesicDistances?: boolean;
	geodesicMetersPerSecond?: number;
	label?: string;
}

/**
 * Visit in an optimized route
 */
export interface Visit {
	shipmentIndex: number;
	isPickup: boolean;
	visitRequestIndex: number;
	startTime: string;
	detour?: Duration;
	shipmentLabel?: string;
	visitLabel?: string;
}

/**
 * Transition between visits
 */
export interface Transition {
	travelDuration: Duration;
	travelDistanceMeters: number;
	trafficInfoUnavailable?: boolean;
	waitDuration?: Duration;
	totalDuration?: Duration;
	startTime?: string;
	routePolyline?: {
		points: string;
	};
}

/**
 * Break in a route
 */
export interface Break {
	startTime: string;
	duration: Duration;
}

/**
 * Optimized route for a vehicle
 */
export interface ShipmentRoute {
	vehicleIndex: number;
	vehicleLabel?: string;
	vehicleStartTime: string;
	vehicleEndTime: string;
	visits: Visit[];
	transitions: Transition[];
	breaks?: Break[];
	metrics?: {
		performedShipmentCount: number;
		travelDuration: Duration;
		waitDuration?: Duration;
		delayDuration?: Duration;
		breakDuration?: Duration;
		visitDuration: Duration;
		totalDuration: Duration;
		travelDistanceMeters: number;
	};
	routeTotalCost?: number;
}

/**
 * Skipped shipment information
 */
export interface SkippedShipment {
	index: number;
	label?: string;
	reasons?: Array<{
		code: string;
		exampleVehicleIndex?: number;
	}>;
}

/**
 * Optimization response
 */
export interface OptimizationResponse {
	routes: ShipmentRoute[];
	skippedShipments?: SkippedShipment[];
	metrics?: {
		aggregatedRouteMetrics?: {
			performedShipmentCount: number;
			travelDuration: Duration;
			waitDuration?: Duration;
			delayDuration?: Duration;
			breakDuration?: Duration;
			visitDuration: Duration;
			totalDuration: Duration;
			travelDistanceMeters: number;
		};
		skippedMandatoryShipmentCount?: number;
		usedVehicleCount?: number;
		earliestVehicleStartTime?: string;
		latestVehicleEndTime?: string;
		costs?: Record<string, number>;
		totalCost?: number;
	};
}

/**
 * Simplified job for optimization
 */
export interface OptimizationJob {
	id: string;
	name: string;
	address: string;
	location: LatLng;
	duration: number; // in minutes
	timeWindowStart?: Date;
	timeWindowEnd?: Date;
	priority?: "low" | "normal" | "high" | "urgent";
	requiredSkills?: string[];
	loadRequirements?: Record<string, number>;
}

/**
 * Simplified technician for optimization
 */
export interface OptimizationTechnician {
	id: string;
	name: string;
	startLocation: LatLng;
	endLocation?: LatLng;
	workdayStart: Date;
	workdayEnd: Date;
	skills?: string[];
	vehicleCapacity?: Record<string, number>;
	breakTime?: {
		earliestStart: Date;
		latestStart: Date;
		duration: number; // in minutes
	};
}

/**
 * Optimized route result
 */
export interface OptimizedRoute {
	technicianId: string;
	technicianName: string;
	jobs: Array<{
		jobId: string;
		jobName: string;
		arrivalTime: Date;
		departureTime: Date;
		travelTimeFromPrevious: number; // in minutes
		travelDistanceFromPrevious: number; // in meters
	}>;
	totalTravelTime: number; // in minutes
	totalTravelDistance: number; // in meters
	totalWorkTime: number; // in minutes
	startTime: Date;
	endTime: Date;
	breaks?: Array<{
		startTime: Date;
		duration: number;
	}>;
}

/**
 * Optimization result
 */
export interface OptimizationResult {
	routes: OptimizedRoute[];
	unassignedJobs: Array<{
		jobId: string;
		jobName: string;
		reason: string;
	}>;
	totalTravelTime: number;
	totalTravelDistance: number;
	totalJobs: number;
	assignedJobs: number;
}

// Zod schemas for validation
const LatLngSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const DurationSchema = z.object({
	seconds: z.string(),
});

const VisitSchema = z.object({
	shipmentIndex: z.number(),
	isPickup: z.boolean(),
	visitRequestIndex: z.number(),
	startTime: z.string(),
	detour: DurationSchema.optional(),
	shipmentLabel: z.string().optional(),
	visitLabel: z.string().optional(),
});

const TransitionSchema = z.object({
	travelDuration: DurationSchema,
	travelDistanceMeters: z.number(),
	trafficInfoUnavailable: z.boolean().optional(),
	waitDuration: DurationSchema.optional(),
	totalDuration: DurationSchema.optional(),
	startTime: z.string().optional(),
	routePolyline: z
		.object({
			points: z.string(),
		})
		.optional(),
});

const ShipmentRouteSchema = z.object({
	vehicleIndex: z.number(),
	vehicleLabel: z.string().optional(),
	vehicleStartTime: z.string(),
	vehicleEndTime: z.string(),
	visits: z.array(VisitSchema),
	transitions: z.array(TransitionSchema),
	breaks: z
		.array(
			z.object({
				startTime: z.string(),
				duration: DurationSchema,
			}),
		)
		.optional(),
	metrics: z
		.object({
			performedShipmentCount: z.number(),
			travelDuration: DurationSchema,
			waitDuration: DurationSchema.optional(),
			delayDuration: DurationSchema.optional(),
			breakDuration: DurationSchema.optional(),
			visitDuration: DurationSchema,
			totalDuration: DurationSchema,
			travelDistanceMeters: z.number(),
		})
		.optional(),
	routeTotalCost: z.number().optional(),
});

const OptimizationResponseSchema = z.object({
	routes: z.array(ShipmentRouteSchema).optional().default([]),
	skippedShipments: z
		.array(
			z.object({
				index: z.number(),
				label: z.string().optional(),
				reasons: z
					.array(
						z.object({
							code: z.string(),
							exampleVehicleIndex: z.number().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	metrics: z
		.object({
			aggregatedRouteMetrics: z
				.object({
					performedShipmentCount: z.number(),
					travelDuration: DurationSchema,
					waitDuration: DurationSchema.optional(),
					delayDuration: DurationSchema.optional(),
					breakDuration: DurationSchema.optional(),
					visitDuration: DurationSchema,
					totalDuration: DurationSchema,
					travelDistanceMeters: z.number(),
				})
				.optional(),
			skippedMandatoryShipmentCount: z.number().optional(),
			usedVehicleCount: z.number().optional(),
			earliestVehicleStartTime: z.string().optional(),
			latestVehicleEndTime: z.string().optional(),
			costs: z.record(z.number()).optional(),
			totalCost: z.number().optional(),
		})
		.optional(),
});

// ============================================================================
// Service Class
// ============================================================================

/**
 * Google Cloud Route Optimization Service
 *
 * Singleton service for route optimization operations.
 *
 * @example
 * ```typescript
 * const optimizationService = GoogleRouteOptimizationService.getInstance();
 *
 * const result = await optimizationService.optimizeRoutes({
 *   jobs: [
 *     { id: '1', name: 'HVAC Repair', location: { lat: 37.7749, lng: -122.4194 }, duration: 60 },
 *     { id: '2', name: 'Plumbing Install', location: { lat: 37.7849, lng: -122.4094 }, duration: 90 },
 *   ],
 *   technicians: [
 *     { id: 'tech1', name: 'John', startLocation: { lat: 37.7649, lng: -122.4294 }, ... },
 *   ],
 * });
 * ```
 */
class GoogleRouteOptimizationService {
	private static instance: GoogleRouteOptimizationService;
	private apiKey: string | undefined;
	private baseUrl = "https://routeoptimization.googleapis.com/v1";

	// Cache for optimization results
	private cache: Map<
		string,
		{ result: OptimizationResult; timestamp: number }
	> = new Map();
	private readonly CACHE_TTL = 1000 * 60 * 5; // 5 minutes

	private constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;

		if (!this.apiKey) {
			console.warn(
				"GoogleRouteOptimizationService: No API key found. Set GOOGLE_API_KEY environment variable.",
			);
		}
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): GoogleRouteOptimizationService {
		if (!GoogleRouteOptimizationService.instance) {
			GoogleRouteOptimizationService.instance =
				new GoogleRouteOptimizationService();
		}
		return GoogleRouteOptimizationService.instance;
	}

	/**
	 * Check if the service is configured
	 */
	public isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Generate cache key
	 */
	private getCacheKey(
		jobs: OptimizationJob[],
		technicians: OptimizationTechnician[],
	): string {
		const jobIds = jobs.map((j) => j.id).join(",");
		const techIds = technicians.map((t) => t.id).join(",");
		return `${jobIds}_${techIds}`;
	}

	/**
	 * Clean expired cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > this.CACHE_TTL) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Convert minutes to Duration object
	 */
	private minutesToDuration(minutes: number): Duration {
		return { seconds: String(minutes * 60) };
	}

	/**
	 * Convert Duration to minutes
	 */
	private durationToMinutes(duration: Duration): number {
		return Math.round(parseInt(duration.seconds, 10) / 60);
	}

	/**
	 * Convert Date to ISO string
	 */
	private dateToIso(date: Date): string {
		return date.toISOString();
	}

	/**
	 * Optimize routes for multiple jobs and technicians
	 *
	 * @param jobs - Jobs to be scheduled
	 * @param technicians - Available technicians
	 * @param options - Optimization options
	 * @returns Optimized routes
	 */
	async optimizeRoutes(
		jobs: OptimizationJob[],
		technicians: OptimizationTechnician[],
		options: {
			considerTraffic?: boolean;
			includePolylines?: boolean;
			workdayStart?: Date;
			workdayEnd?: Date;
		} = {},
	): Promise<OptimizationResult> {
		if (!this.apiKey) {
			throw new Error("Route Optimization API key not configured");
		}

		if (jobs.length === 0) {
			return {
				routes: [],
				unassignedJobs: [],
				totalTravelTime: 0,
				totalTravelDistance: 0,
				totalJobs: 0,
				assignedJobs: 0,
			};
		}

		if (technicians.length === 0) {
			return {
				routes: [],
				unassignedJobs: jobs.map((j) => ({
					jobId: j.id,
					jobName: j.name,
					reason: "No technicians available",
				})),
				totalTravelTime: 0,
				totalTravelDistance: 0,
				totalJobs: jobs.length,
				assignedJobs: 0,
			};
		}

		// Check cache
		const cacheKey = this.getCacheKey(jobs, technicians);
		this.cleanCache();
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached.result;
		}

		// Determine global time window
		const now = new Date();
		const globalStart =
			options.workdayStart || new Date(now.setHours(8, 0, 0, 0));
		const globalEnd = options.workdayEnd || new Date(now.setHours(18, 0, 0, 0));

		// Build shipments from jobs
		const shipments: Shipment[] = jobs.map((job) => ({
			deliveries: [
				{
					arrivalLocation: job.location,
					duration: this.minutesToDuration(job.duration),
					timeWindows:
						job.timeWindowStart && job.timeWindowEnd
							? [
									{
										startTime: this.dateToIso(job.timeWindowStart),
										endTime: this.dateToIso(job.timeWindowEnd),
									},
								]
							: undefined,
					label: job.name,
				},
			],
			label: job.id,
			penaltyCost:
				job.priority === "urgent"
					? 10000
					: job.priority === "high"
						? 5000
						: job.priority === "low"
							? 100
							: 1000,
			loadDemands: job.loadRequirements
				? Object.fromEntries(
						Object.entries(job.loadRequirements).map(([key, value]) => [
							key,
							{ amount: String(value) },
						]),
					)
				: undefined,
		}));

		// Build vehicles from technicians
		const vehicles: Vehicle[] = technicians.map((tech) => ({
			startLocation: tech.startLocation,
			endLocation: tech.endLocation || tech.startLocation,
			startTimeWindows: [
				{
					startTime: this.dateToIso(tech.workdayStart),
					endTime: this.dateToIso(tech.workdayStart), // Start exactly at workday start
				},
			],
			endTimeWindows: [
				{
					startTime: this.dateToIso(tech.workdayStart),
					endTime: this.dateToIso(tech.workdayEnd),
				},
			],
			travelMode: "DRIVING",
			loadLimits: tech.vehicleCapacity
				? Object.fromEntries(
						Object.entries(tech.vehicleCapacity).map(([key, value]) => [
							key,
							{ maxLoad: String(value) },
						]),
					)
				: undefined,
			breakRule: tech.breakTime
				? {
						breakRequests: [
							{
								earliestStartTime: this.dateToIso(tech.breakTime.earliestStart),
								latestStartTime: this.dateToIso(tech.breakTime.latestStart),
								minDuration: this.minutesToDuration(tech.breakTime.duration),
							},
						],
					}
				: undefined,
			label: tech.id,
		}));

		// Build optimization request
		const request: OptimizationRequest = {
			model: {
				shipments,
				vehicles,
				globalStartTime: this.dateToIso(globalStart),
				globalEndTime: this.dateToIso(globalEnd),
			},
			considerRoadTraffic: options.considerTraffic ?? true,
			populatePolylines: options.includePolylines ?? false,
			populateTransitionPolylines: options.includePolylines ?? false,
		};

		const response = await fetch(
			`${this.baseUrl}/projects/-:optimizeTours?key=${this.apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Route Optimization API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = OptimizationResponseSchema.parse(data);

		// Convert response to simplified format
		const result = this.convertToOptimizationResult(
			validated,
			jobs,
			technicians,
		);

		// Cache result
		this.cache.set(cacheKey, { result, timestamp: Date.now() });

		return result;
	}

	/**
	 * Optimize a single technician's route for the day
	 *
	 * @param jobs - Jobs assigned to the technician
	 * @param technician - Technician details
	 * @param options - Optimization options
	 * @returns Optimized route
	 */
	async optimizeSingleTechnicianRoute(
		jobs: OptimizationJob[],
		technician: OptimizationTechnician,
		options: {
			considerTraffic?: boolean;
			returnToBase?: boolean;
		} = {},
	): Promise<OptimizedRoute | null> {
		const result = await this.optimizeRoutes(jobs, [technician], options);

		if (result.routes.length === 0) {
			return null;
		}

		return result.routes[0];
	}

	/**
	 * Get optimal job sequence for a list of jobs
	 * Simpler interface for basic route ordering
	 *
	 * @param jobs - Jobs to sequence
	 * @param startLocation - Starting location
	 * @param endLocation - Optional ending location
	 * @returns Ordered list of job IDs
	 */
	async getOptimalJobSequence(
		jobs: OptimizationJob[],
		startLocation: LatLng,
		endLocation?: LatLng,
	): Promise<{
		sequence: string[];
		totalTravelTime: number;
		totalTravelDistance: number;
	}> {
		const now = new Date();
		const technician: OptimizationTechnician = {
			id: "temp",
			name: "Temporary",
			startLocation,
			endLocation: endLocation || startLocation,
			workdayStart: new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				0,
				0,
				0,
			),
			workdayEnd: new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				23,
				59,
				59,
			),
		};

		const result = await this.optimizeRoutes(jobs, [technician], {
			considerTraffic: true,
		});

		if (result.routes.length === 0) {
			return {
				sequence: jobs.map((j) => j.id),
				totalTravelTime: 0,
				totalTravelDistance: 0,
			};
		}

		const route = result.routes[0];
		return {
			sequence: route.jobs.map((j) => j.jobId),
			totalTravelTime: route.totalTravelTime,
			totalTravelDistance: route.totalTravelDistance,
		};
	}

	/**
	 * Calculate time savings from optimization
	 *
	 * @param jobs - Jobs in original order
	 * @param optimizedSequence - Optimized job sequence
	 * @returns Time and distance savings
	 */
	async calculateSavings(
		jobs: OptimizationJob[],
		startLocation: LatLng,
	): Promise<{
		originalTime: number;
		optimizedTime: number;
		timeSaved: number;
		percentSaved: number;
	}> {
		// Get optimized route
		const optimized = await this.getOptimalJobSequence(jobs, startLocation);

		// Estimate original time (simple sequential order)
		// This is a rough estimate based on straight-line distances
		let originalDistance = 0;
		let prevLocation = startLocation;

		for (const job of jobs) {
			const distance = this.haversineDistance(prevLocation, job.location);
			originalDistance += distance;
			prevLocation = job.location;
		}

		// Estimate time at 40 km/h average speed
		const originalTime = Math.round((originalDistance / 1000 / 40) * 60);
		const optimizedTime = optimized.totalTravelTime;
		const timeSaved = Math.max(0, originalTime - optimizedTime);

		return {
			originalTime,
			optimizedTime,
			timeSaved,
			percentSaved:
				originalTime > 0 ? Math.round((timeSaved / originalTime) * 100) : 0,
		};
	}

	/**
	 * Calculate haversine distance between two points
	 */
	private haversineDistance(point1: LatLng, point2: LatLng): number {
		const R = 6371e3; // Earth's radius in meters
		const lat1 = (point1.latitude * Math.PI) / 180;
		const lat2 = (point2.latitude * Math.PI) / 180;
		const deltaLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
		const deltaLng = ((point2.longitude - point1.longitude) * Math.PI) / 180;

		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(lat1) *
				Math.cos(lat2) *
				Math.sin(deltaLng / 2) *
				Math.sin(deltaLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	/**
	 * Convert API response to simplified format
	 */
	private convertToOptimizationResult(
		response: OptimizationResponse,
		jobs: OptimizationJob[],
		technicians: OptimizationTechnician[],
	): OptimizationResult {
		const routes: OptimizedRoute[] = [];

		for (const route of response.routes) {
			const technician = technicians[route.vehicleIndex];
			if (!technician) continue;

			const optimizedJobs: OptimizedRoute["jobs"] = [];

			for (let i = 0; i < route.visits.length; i++) {
				const visit = route.visits[i];
				const transition = route.transitions[i + 1]; // Transition after arrival
				const job = jobs[visit.shipmentIndex];

				if (!job) continue;

				const arrivalTime = new Date(visit.startTime);
				const departureTime = new Date(
					arrivalTime.getTime() + job.duration * 60 * 1000,
				);

				optimizedJobs.push({
					jobId: job.id,
					jobName: job.name,
					arrivalTime,
					departureTime,
					travelTimeFromPrevious:
						i > 0
							? this.durationToMinutes(route.transitions[i].travelDuration)
							: 0,
					travelDistanceFromPrevious:
						i > 0 ? route.transitions[i].travelDistanceMeters : 0,
				});
			}

			const breaks: OptimizedRoute["breaks"] = route.breaks?.map((b) => ({
				startTime: new Date(b.startTime),
				duration: this.durationToMinutes(b.duration),
			}));

			routes.push({
				technicianId: technician.id,
				technicianName: technician.name,
				jobs: optimizedJobs,
				totalTravelTime: route.metrics
					? this.durationToMinutes(route.metrics.travelDuration)
					: 0,
				totalTravelDistance: route.metrics?.travelDistanceMeters || 0,
				totalWorkTime: route.metrics
					? this.durationToMinutes(route.metrics.totalDuration)
					: 0,
				startTime: new Date(route.vehicleStartTime),
				endTime: new Date(route.vehicleEndTime),
				breaks,
			});
		}

		// Handle unassigned jobs
		const unassignedJobs: OptimizationResult["unassignedJobs"] =
			response.skippedShipments?.map((skipped) => {
				const job = jobs[skipped.index];
				const reasonCode = skipped.reasons?.[0]?.code || "UNKNOWN";
				const reasonMap: Record<string, string> = {
					DEMAND_EXCEEDS_VEHICLE_CAPACITY:
						"Job requirements exceed vehicle capacity",
					CANNOT_BE_PERFORMED_WITHIN_VEHICLE_DISTANCE_LIMIT:
						"Job is too far from technician's route",
					CANNOT_BE_PERFORMED_WITHIN_VEHICLE_DURATION_LIMIT:
						"Not enough time in technician's schedule",
					CANNOT_BE_PERFORMED_WITHIN_VEHICLE_TRAVEL_DURATION_LIMIT:
						"Travel time exceeds limit",
					CANNOT_BE_PERFORMED_WITHIN_VEHICLE_TIME_WINDOWS:
						"Job time window conflicts with technician schedule",
					UNKNOWN: "Unable to schedule job",
				};

				return {
					jobId: job?.id || String(skipped.index),
					jobName: job?.name || `Job ${skipped.index}`,
					reason: reasonMap[reasonCode] || reasonCode,
				};
			}) || [];

		const assignedJobs = routes.reduce((sum, r) => sum + r.jobs.length, 0);

		return {
			routes,
			unassignedJobs,
			totalTravelTime: routes.reduce((sum, r) => sum + r.totalTravelTime, 0),
			totalTravelDistance: routes.reduce(
				(sum, r) => sum + r.totalTravelDistance,
				0,
			),
			totalJobs: jobs.length,
			assignedJobs,
		};
	}

	/**
	 * Clear the optimization cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// ============================================================================
// Exports
// ============================================================================

export const googleRouteOptimizationService =
	GoogleRouteOptimizationService.getInstance();
export default googleRouteOptimizationService;
