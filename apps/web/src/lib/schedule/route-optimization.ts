/**
 * Route Optimization Service
 *
 * Provides intelligent route optimization for field service scheduling:
 * - Calculate optimal job order based on proximity
 * - Estimate travel times between jobs
 * - Support for multiple technicians
 * - Integration with Google Distance Matrix API
 */

import type {
	Job,
	Location,
	Technician,
} from "@/components/schedule/schedule-types";

// ============================================================================
// Types
// ============================================================================

export type Coordinates = {
	lat: number;
	lng: number;
};

export type TravelSegment = {
	fromJobId: string | "start" | "end";
	toJobId: string | "start" | "end";
	durationSeconds: number;
	durationText: string;
	distanceMeters: number;
	distanceText: string;
	trafficDelaySeconds?: number;
};

export type OptimizedRoute = {
	technicianId: string;
	jobs: Job[];
	segments: TravelSegment[];
	totalTravelTime: number; // seconds
	totalDistance: number; // meters
	startLocation: Coordinates;
	estimatedEndTime: Date;
	savingsVsOriginal: {
		timeSeconds: number;
		distanceMeters: number;
		percentImprovement: number;
	};
};

export type RouteOptimizationResult = {
	routes: OptimizedRoute[];
	totalTravelTime: number;
	totalDistance: number;
	optimizedAt: Date;
	algorithm: "nearest-neighbor" | "2-opt" | "google-routes";
};

export type SmartDispatchRecommendation = {
	technicianId: string;
	technician: Technician;
	score: number; // 0-100
	reasons: string[];
	estimatedArrival: Date;
	travelTime: number; // seconds
	travelDistance: number; // meters
	currentWorkload: number; // number of jobs today
	skillMatch: number; // 0-100
	proximityScore: number; // 0-100
};

export type CapacityInfo = {
	technicianId: string;
	date: Date;
	totalMinutes: number; // available working minutes
	scheduledMinutes: number; // minutes already booked
	travelMinutes: number; // estimated travel time
	availableMinutes: number; // remaining capacity
	utilizationPercent: number; // 0-100
	jobCount: number;
	status: "available" | "busy" | "overbooked";
};

export type TimeSlot = {
	start: Date;
	end: Date;
	technicianId: string;
	technician: Technician;
	score: number; // 0-100, higher is better
	reasons: string[];
	travelFromPrevious?: number; // seconds
	travelToNext?: number; // seconds
};

// ============================================================================
// Constants
// ============================================================================

const EARTH_RADIUS_KM = 6371;
const METERS_PER_KM = 1000;
const AVERAGE_SPEED_KPH = 40; // Average urban driving speed

// ============================================================================
// Distance Calculations (Haversine formula for fallback)
// ============================================================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateHaversineDistance(
	from: Coordinates,
	to: Coordinates,
): number {
	const lat1Rad = (from.lat * Math.PI) / 180;
	const lat2Rad = (to.lat * Math.PI) / 180;
	const deltaLat = ((to.lat - from.lat) * Math.PI) / 180;
	const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;

	const a =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(lat1Rad) *
			Math.cos(lat2Rad) *
			Math.sin(deltaLng / 2) *
			Math.sin(deltaLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return EARTH_RADIUS_KM * c * METERS_PER_KM;
}

/**
 * Estimate travel time based on distance (fallback when API unavailable)
 * Returns time in seconds
 */
export function estimateTravelTime(distanceMeters: number): number {
	const distanceKm = distanceMeters / METERS_PER_KM;
	const hours = distanceKm / AVERAGE_SPEED_KPH;
	return Math.round(hours * 3600);
}

/**
 * Get coordinates from a Job's location
 */
export function getJobCoordinates(job: Job): Coordinates | null {
	if (job.location?.coordinates?.lat && job.location?.coordinates?.lng) {
		return {
			lat: job.location.coordinates.lat,
			lng: job.location.coordinates.lng,
		};
	}
	return null;
}

/**
 * Get coordinates from a Technician's current location
 */
function getTechnicianCoordinates(tech: Technician): Coordinates | null {
	if (
		tech.currentLocation?.coordinates?.lat &&
		tech.currentLocation?.coordinates?.lng
	) {
		return {
			lat: tech.currentLocation.coordinates.lat,
			lng: tech.currentLocation.coordinates.lng,
		};
	}
	return null;
}

// ============================================================================
// Route Optimization Algorithms
// ============================================================================

/**
 * Nearest Neighbor Algorithm
 * Simple greedy algorithm that always visits the nearest unvisited job
 */
function optimizeRouteNearestNeighbor(
	jobs: Job[],
	startLocation: Coordinates,
): Job[] {
	if (jobs.length <= 1) return jobs;

	const result: Job[] = [];
	const remaining = [...jobs];
	let currentLocation = startLocation;

	while (remaining.length > 0) {
		let nearestIndex = 0;
		let nearestDistance = Infinity;

		for (let i = 0; i < remaining.length; i++) {
			const jobCoords = getJobCoordinates(remaining[i]);
			if (!jobCoords) continue;

			const distance = calculateHaversineDistance(currentLocation, jobCoords);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = i;
			}
		}

		const nearest = remaining.splice(nearestIndex, 1)[0];
		result.push(nearest);

		const nearestCoords = getJobCoordinates(nearest);
		if (nearestCoords) {
			currentLocation = nearestCoords;
		}
	}

	return result;
}

/**
 * Calculate total route distance for a sequence of jobs
 */
export function calculateTotalRouteDistance(
	jobs: Job[],
	startLocation: Coordinates,
): number {
	if (jobs.length === 0) return 0;

	let total = 0;
	let currentLocation = startLocation;

	for (const job of jobs) {
		const jobCoords = getJobCoordinates(job);
		if (jobCoords) {
			total += calculateHaversineDistance(currentLocation, jobCoords);
			currentLocation = jobCoords;
		}
	}

	return total;
}

/**
 * 2-opt improvement algorithm
 * Iteratively improves the route by reversing segments
 */
export function improveRoute2Opt(
	jobs: Job[],
	startLocation: Coordinates,
): Job[] {
	if (jobs.length <= 2) return jobs;

	let improved = true;
	let route = [...jobs];
	let bestDistance = calculateTotalRouteDistance(route, startLocation);

	while (improved) {
		improved = false;

		for (let i = 0; i < route.length - 1; i++) {
			for (let j = i + 2; j < route.length; j++) {
				// Reverse the segment between i and j
				const newRoute = [
					...route.slice(0, i + 1),
					...route.slice(i + 1, j + 1).reverse(),
					...route.slice(j + 1),
				];

				const newDistance = calculateTotalRouteDistance(
					newRoute,
					startLocation,
				);

				if (newDistance < bestDistance) {
					route = newRoute;
					bestDistance = newDistance;
					improved = true;
				}
			}
		}
	}

	return route;
}

// ============================================================================
// Main Optimization Functions
// ============================================================================

/**
 * Optimize route for a single technician
 */
export async function optimizeTechnicianRoute(
	technician: Technician,
	jobs: Job[],
	options: {
		startLocation?: Coordinates;
		useGoogleApi?: boolean;
	} = {},
): Promise<OptimizedRoute> {
	const startLocation = options.startLocation ||
		getTechnicianCoordinates(technician) || {
			lat: 34.0522, // Default to LA if no location
			lng: -118.2437,
		};

	// Filter jobs that have valid coordinates
	const validJobs = jobs.filter((job) => getJobCoordinates(job) !== null);

	// Calculate original distance for comparison
	const originalDistance = calculateTotalRouteDistance(
		validJobs,
		startLocation,
	);

	// Apply nearest neighbor first
	let optimizedJobs = optimizeRouteNearestNeighbor(validJobs, startLocation);

	// Then improve with 2-opt
	optimizedJobs = improveRoute2Opt(optimizedJobs, startLocation);

	// Calculate optimized metrics
	const optimizedDistance = calculateTotalRouteDistance(
		optimizedJobs,
		startLocation,
	);
	const totalTravelTime = estimateTravelTime(optimizedDistance);

	// Build segments
	const segments: TravelSegment[] = [];
	let currentLocation = startLocation;

	for (let i = 0; i < optimizedJobs.length; i++) {
		const job = optimizedJobs[i];
		const jobCoords = getJobCoordinates(job);

		if (jobCoords) {
			const distance = calculateHaversineDistance(currentLocation, jobCoords);
			const duration = estimateTravelTime(distance);

			segments.push({
				fromJobId: i === 0 ? "start" : optimizedJobs[i - 1].id,
				toJobId: job.id,
				durationSeconds: duration,
				durationText: formatDuration(duration),
				distanceMeters: distance,
				distanceText: formatDistance(distance),
			});

			currentLocation = jobCoords;
		}
	}

	// Calculate estimated end time
	let estimatedEndTime = new Date();
	if (optimizedJobs.length > 0) {
		const lastJob = optimizedJobs[optimizedJobs.length - 1];
		estimatedEndTime = new Date(lastJob.endTime);
	}

	return {
		technicianId: technician.id,
		jobs: optimizedJobs,
		segments,
		totalTravelTime,
		totalDistance: optimizedDistance,
		startLocation,
		estimatedEndTime,
		savingsVsOriginal: {
			timeSeconds: estimateTravelTime(originalDistance) - totalTravelTime,
			distanceMeters: originalDistance - optimizedDistance,
			percentImprovement:
				originalDistance > 0
					? Math.round(
							((originalDistance - optimizedDistance) / originalDistance) * 100,
						)
					: 0,
		},
	};
}

/**
 * Optimize routes for multiple technicians
 */
export async function optimizeAllRoutes(
	technicians: Technician[],
	jobsByTechnician: Map<string, Job[]>,
	options: {
		shopLocation?: Coordinates;
	} = {},
): Promise<RouteOptimizationResult> {
	const routes: OptimizedRoute[] = [];

	for (const tech of technicians) {
		const jobs = jobsByTechnician.get(tech.id) || [];
		if (jobs.length > 0) {
			const route = await optimizeTechnicianRoute(tech, jobs, {
				startLocation: options.shopLocation,
			});
			routes.push(route);
		}
	}

	const totalTravelTime = routes.reduce((sum, r) => sum + r.totalTravelTime, 0);
	const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);

	return {
		routes,
		totalTravelTime,
		totalDistance,
		optimizedAt: new Date(),
		algorithm: "2-opt",
	};
}

// ============================================================================
// Smart Dispatch
// ============================================================================

/**
 * Get smart dispatch recommendations for a job
 */
export function getSmartDispatchRecommendations(
	job: Job,
	technicians: Technician[],
	existingJobs: Map<string, Job[]>,
	options: {
		requiredSkills?: string[];
		prioritizeProximity?: boolean;
		maxRecommendations?: number;
	} = {},
): SmartDispatchRecommendation[] {
	const jobCoords = getJobCoordinates(job);
	const recommendations: SmartDispatchRecommendation[] = [];

	for (const tech of technicians) {
		if (tech.status === "offline") continue;

		const techCoords = getTechnicianCoordinates(tech);
		const techJobs = existingJobs.get(tech.id) || [];
		const workload = techJobs.length;

		// Calculate proximity score
		let proximityScore = 50;
		let travelTime = 0;
		let travelDistance = 0;

		if (jobCoords && techCoords) {
			travelDistance = calculateHaversineDistance(techCoords, jobCoords);
			travelTime = estimateTravelTime(travelDistance);

			// Score based on distance (closer = higher score)
			// 0-5km = 100, 5-15km = 70, 15-30km = 40, 30km+ = 20
			if (travelDistance < 5000) proximityScore = 100;
			else if (travelDistance < 15000) proximityScore = 70;
			else if (travelDistance < 30000) proximityScore = 40;
			else proximityScore = 20;
		}

		// Calculate skill match score
		let skillMatch = 100;
		if (options.requiredSkills && options.requiredSkills.length > 0) {
			const techSkills = tech.skills || [];
			const matchedSkills = options.requiredSkills.filter((s) =>
				techSkills.includes(s),
			);
			skillMatch = Math.round(
				(matchedSkills.length / options.requiredSkills.length) * 100,
			);
		}

		// Calculate workload penalty (fewer jobs = higher score)
		const workloadScore = Math.max(0, 100 - workload * 15);

		// Calculate overall score
		const weights = {
			proximity: options.prioritizeProximity ? 0.5 : 0.3,
			skill: 0.3,
			workload: options.prioritizeProximity ? 0.2 : 0.4,
		};

		const score = Math.round(
			proximityScore * weights.proximity +
				skillMatch * weights.skill +
				workloadScore * weights.workload,
		);

		// Build reasons
		const reasons: string[] = [];
		if (proximityScore >= 70) reasons.push("Nearby location");
		if (skillMatch === 100 && options.requiredSkills?.length) {
			reasons.push("All required skills");
		}
		if (workload === 0) reasons.push("No current jobs");
		else if (workload <= 2) reasons.push("Light workload");
		if (tech.status === "available") reasons.push("Currently available");

		// Estimate arrival time
		const estimatedArrival = new Date(Date.now() + travelTime * 1000);

		recommendations.push({
			technicianId: tech.id,
			technician: tech,
			score,
			reasons,
			estimatedArrival,
			travelTime,
			travelDistance,
			currentWorkload: workload,
			skillMatch,
			proximityScore,
		});
	}

	// Sort by score (highest first) and limit results
	const sorted = recommendations.sort((a, b) => b.score - a.score);
	const max = options.maxRecommendations || 5;

	return sorted.slice(0, max);
}

// ============================================================================
// Capacity Planning
// ============================================================================

/**
 * Calculate capacity info for a technician on a given date
 */
export function calculateTechnicianCapacity(
	technician: Technician,
	jobs: Job[],
	date: Date,
): CapacityInfo {
	// Get working hours from technician schedule
	const schedule = technician.schedule || {
		availableHours: { start: 8, end: 17 },
	};

	const totalMinutes =
		(schedule.availableHours.end - schedule.availableHours.start) * 60;

	// Calculate scheduled minutes
	const dayJobs = jobs.filter((job) => {
		const jobDate = new Date(job.startTime);
		return (
			jobDate.getFullYear() === date.getFullYear() &&
			jobDate.getMonth() === date.getMonth() &&
			jobDate.getDate() === date.getDate()
		);
	});

	const scheduledMinutes = dayJobs.reduce((sum, job) => {
		const duration =
			(job.endTime.getTime() - job.startTime.getTime()) / (1000 * 60);
		return sum + duration;
	}, 0);

	// Estimate travel time between jobs
	let travelMinutes = 0;
	if (dayJobs.length > 1) {
		const sortedJobs = [...dayJobs].sort(
			(a, b) => a.startTime.getTime() - b.startTime.getTime(),
		);

		for (let i = 0; i < sortedJobs.length - 1; i++) {
			const fromCoords = getJobCoordinates(sortedJobs[i]);
			const toCoords = getJobCoordinates(sortedJobs[i + 1]);

			if (fromCoords && toCoords) {
				const distance = calculateHaversineDistance(fromCoords, toCoords);
				travelMinutes += estimateTravelTime(distance) / 60;
			}
		}
	}

	const availableMinutes = Math.max(
		0,
		totalMinutes - scheduledMinutes - travelMinutes,
	);
	const utilizationPercent = Math.round(
		((scheduledMinutes + travelMinutes) / totalMinutes) * 100,
	);

	let status: CapacityInfo["status"] = "available";
	if (utilizationPercent > 100) status = "overbooked";
	else if (utilizationPercent > 80) status = "busy";

	return {
		technicianId: technician.id,
		date,
		totalMinutes,
		scheduledMinutes,
		travelMinutes: Math.round(travelMinutes),
		availableMinutes: Math.round(availableMinutes),
		utilizationPercent: Math.min(utilizationPercent, 100),
		jobCount: dayJobs.length,
		status,
	};
}

// ============================================================================
// Find Available Time Slots
// ============================================================================

/**
 * Find available time slots for scheduling a job
 */
export function findAvailableTimeSlots(
	technicians: Technician[],
	existingJobs: Map<string, Job[]>,
	duration: number, // minutes
	dateRange: { start: Date; end: Date },
	options: {
		preferredTechnicianId?: string;
		jobLocation?: Location;
		maxSlots?: number;
	} = {},
): TimeSlot[] {
	const slots: TimeSlot[] = [];
	const maxSlots = options.maxSlots || 10;

	// Generate slots for each day in range
	const current = new Date(dateRange.start);
	while (current <= dateRange.end && slots.length < maxSlots) {
		for (const tech of technicians) {
			if (tech.status === "offline") continue;

			const schedule = tech.schedule || {
				availableHours: { start: 8, end: 17 },
			};

			const dayStart = new Date(current);
			dayStart.setHours(schedule.availableHours.start, 0, 0, 0);

			const dayEnd = new Date(current);
			dayEnd.setHours(schedule.availableHours.end, 0, 0, 0);

			const techJobs = (existingJobs.get(tech.id) || [])
				.filter((job) => {
					const jobDate = new Date(job.startTime);
					return (
						jobDate.getFullYear() === current.getFullYear() &&
						jobDate.getMonth() === current.getMonth() &&
						jobDate.getDate() === current.getDate()
					);
				})
				.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

			// Find gaps between jobs
			let slotStart = dayStart;

			for (const job of techJobs) {
				const gapMinutes =
					(job.startTime.getTime() - slotStart.getTime()) / (1000 * 60);

				if (gapMinutes >= duration) {
					const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

					// Calculate score
					let score = 50;
					const reasons: string[] = [];

					if (options.preferredTechnicianId === tech.id) {
						score += 20;
						reasons.push("Preferred technician");
					}

					// Morning slots get bonus
					if (slotStart.getHours() < 12) {
						score += 10;
						reasons.push("Morning slot");
					}

					slots.push({
						start: new Date(slotStart),
						end: slotEnd,
						technicianId: tech.id,
						technician: tech,
						score,
						reasons,
					});
				}

				slotStart = new Date(job.endTime);
			}

			// Check remaining time after last job
			const remainingMinutes =
				(dayEnd.getTime() - slotStart.getTime()) / (1000 * 60);

			if (remainingMinutes >= duration) {
				const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

				slots.push({
					start: new Date(slotStart),
					end: slotEnd,
					technicianId: tech.id,
					technician: tech,
					score: 50,
					reasons: [],
				});
			}
		}

		current.setDate(current.getDate() + 1);
	}

	// Sort by score and return top slots
	return slots.sort((a, b) => b.score - a.score).slice(0, maxSlots);
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes} min`;
}

function formatDistance(meters: number): string {
	const miles = meters / 1609.34;
	if (miles < 0.1) {
		return `${Math.round(meters)} m`;
	}
	return `${miles.toFixed(1)} mi`;
}
