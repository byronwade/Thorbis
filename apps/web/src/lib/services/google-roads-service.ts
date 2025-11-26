/**
 * Google Roads API Service
 *
 * Provides road-following and speed limit data.
 * - Snap GPS coordinates to roads
 * - Get speed limits along paths
 * - Interpolate points along roads
 * - Track vehicle routes accurately
 *
 * API: Google Roads API
 * Docs: https://developers.google.com/maps/documentation/roads
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * GPS coordinate
 */
export interface LatLng {
	latitude: number;
	longitude: number;
}

/**
 * Snapped point result
 */
export interface SnappedPoint {
	location: {
		latitude: number;
		longitude: number;
	};
	originalIndex?: number;
	placeId: string;
}

/**
 * Speed limit result
 */
export interface SpeedLimit {
	placeId: string;
	speedLimit: number;
	units: "KPH" | "MPH";
}

/**
 * Snap to roads result
 */
export interface SnapToRoadsResult {
	snappedPoints: SnappedPoint[];
	warningMessage?: string;
}

/**
 * Speed limits result
 */
export interface SpeedLimitsResult {
	snappedPoints: SnappedPoint[];
	speedLimits: SpeedLimit[];
}

/**
 * Nearest road result
 */
export interface NearestRoadResult {
	snappedPoint: SnappedPoint | null;
	distanceMeters?: number;
}

/**
 * Route analysis result
 */
export interface RouteAnalysis {
	totalDistanceMeters: number;
	snappedPath: SnappedPoint[];
	speedLimits: SpeedLimit[];
	averageSpeedLimit?: number;
	maxSpeedLimit?: number;
	minSpeedLimit?: number;
}

/**
 * Technician GPS tracking result
 */
export interface TechnicianTrackingResult {
	technicianId: string;
	snappedPath: SnappedPoint[];
	speedLimits: SpeedLimit[];
	totalDistanceMeters: number;
	estimatedDuration?: number; // seconds
	potentialSpeedingPoints?: {
		location: LatLng;
		speedLimit: number;
		timestamp?: string;
	}[];
}

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleRoadsService {
	private readonly apiKey: string | undefined;
	private readonly baseUrl = "https://roads.googleapis.com/v1";
	private readonly cache: Map<string, { data: unknown; timestamp: number }> =
		new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Generate cache key
	 */
	private generateCacheKey(method: string, params: unknown): string {
		return `roads:${method}:${JSON.stringify(params)}`;
	}

	/**
	 * Get from cache
	 */
	private getFromCache<T>(key: string): T | null {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data as T;
		}
		return null;
	}

	/**
	 * Set in cache
	 */
	private setInCache(key: string, data: unknown): void {
		this.cache.set(key, { data, timestamp: Date.now() });
	}

	/**
	 * Format path for API
	 */
	private formatPath(points: LatLng[]): string {
		return points.map((p) => `${p.latitude},${p.longitude}`).join("|");
	}

	/**
	 * Snap GPS coordinates to roads
	 */
	async snapToRoads(
		path: LatLng[],
		options: { interpolate?: boolean } = {},
	): Promise<SnapToRoadsResult | null> {
		if (!this.apiKey) {
			console.warn("Google Roads API key not configured");
			return null;
		}

		if (path.length === 0 || path.length > 100) {
			console.error("Path must have between 1 and 100 points");
			return null;
		}

		const cacheKey = this.generateCacheKey("snap", { path, options });
		const cached = this.getFromCache<SnapToRoadsResult>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				path: this.formatPath(path),
			});

			if (options.interpolate) {
				params.append("interpolate", "true");
			}

			const url = `${this.baseUrl}/snapToRoads?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Roads API error:", response.status);
				return null;
			}

			const data = await response.json();
			const result: SnapToRoadsResult = {
				snappedPoints: data.snappedPoints || [],
				warningMessage: data.warningMessage,
			};

			this.setInCache(cacheKey, result);
			return result;
		} catch (error) {
			console.error("Roads API error:", error);
			return null;
		}
	}

	/**
	 * Get speed limits along a path
	 */
	async getSpeedLimits(path: LatLng[]): Promise<SpeedLimitsResult | null> {
		if (!this.apiKey) {
			console.warn("Google Roads API key not configured");
			return null;
		}

		if (path.length === 0 || path.length > 100) {
			console.error("Path must have between 1 and 100 points");
			return null;
		}

		const cacheKey = this.generateCacheKey("speedLimits", { path });
		const cached = this.getFromCache<SpeedLimitsResult>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				path: this.formatPath(path),
			});

			const url = `${this.baseUrl}/speedLimits?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Roads API speed limits error:", response.status);
				return null;
			}

			const data = await response.json();
			const result: SpeedLimitsResult = {
				snappedPoints: data.snappedPoints || [],
				speedLimits: data.speedLimits || [],
			};

			this.setInCache(cacheKey, result);
			return result;
		} catch (error) {
			console.error("Roads API speed limits error:", error);
			return null;
		}
	}

	/**
	 * Get speed limits by place IDs
	 */
	async getSpeedLimitsByPlaceIds(
		placeIds: string[],
	): Promise<SpeedLimit[] | null> {
		if (!this.apiKey) {
			console.warn("Google Roads API key not configured");
			return null;
		}

		if (placeIds.length === 0 || placeIds.length > 100) {
			console.error("Must provide between 1 and 100 place IDs");
			return null;
		}

		const cacheKey = this.generateCacheKey("speedLimitsByPlace", { placeIds });
		const cached = this.getFromCache<SpeedLimit[]>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({ key: this.apiKey });
			for (const placeId of placeIds) {
				params.append("placeId", placeId);
			}

			const url = `${this.baseUrl}/speedLimits?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error(
					"Roads API speed limits by place error:",
					response.status,
				);
				return null;
			}

			const data = await response.json();
			const result = data.speedLimits || [];

			this.setInCache(cacheKey, result);
			return result;
		} catch (error) {
			console.error("Roads API speed limits by place error:", error);
			return null;
		}
	}

	/**
	 * Find nearest road to a point
	 */
	async getNearestRoad(point: LatLng): Promise<NearestRoadResult | null> {
		if (!this.apiKey) {
			console.warn("Google Roads API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey("nearest", { point });
		const cached = this.getFromCache<NearestRoadResult>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				points: `${point.latitude},${point.longitude}`,
			});

			const url = `${this.baseUrl}/nearestRoads?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Roads API nearest road error:", response.status);
				return null;
			}

			const data = await response.json();

			let result: NearestRoadResult;
			if (data.snappedPoints && data.snappedPoints.length > 0) {
				const snapped = data.snappedPoints[0];
				// Calculate approximate distance
				const distanceMeters = this.calculateDistance(point, snapped.location);
				result = {
					snappedPoint: snapped,
					distanceMeters,
				};
			} else {
				result = { snappedPoint: null };
			}

			this.setInCache(cacheKey, result);
			return result;
		} catch (error) {
			console.error("Roads API nearest road error:", error);
			return null;
		}
	}

	/**
	 * Calculate distance between two points (Haversine formula)
	 */
	private calculateDistance(
		point1: LatLng,
		point2: { latitude: number; longitude: number },
	): number {
		const R = 6371000; // Earth's radius in meters
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
	 * Calculate total distance of snapped path
	 */
	private calculatePathDistance(points: SnappedPoint[]): number {
		let total = 0;
		for (let i = 1; i < points.length; i++) {
			total += this.calculateDistance(
				{
					latitude: points[i - 1].location.latitude,
					longitude: points[i - 1].location.longitude,
				},
				points[i].location,
			);
		}
		return total;
	}

	/**
	 * Analyze a route with snapping and speed limits
	 */
	async analyzeRoute(path: LatLng[]): Promise<RouteAnalysis | null> {
		if (!this.apiKey) {
			console.warn("Google Roads API key not configured");
			return null;
		}

		// Snap to roads with interpolation
		const snapped = await this.snapToRoads(path, { interpolate: true });
		if (!snapped || snapped.snappedPoints.length === 0) {
			return null;
		}

		// Get speed limits
		const speedLimitsResult = await this.getSpeedLimits(path);

		const totalDistance = this.calculatePathDistance(snapped.snappedPoints);

		const speedLimits = speedLimitsResult?.speedLimits || [];
		const speedValues = speedLimits.map((sl) => sl.speedLimit);

		return {
			totalDistanceMeters: totalDistance,
			snappedPath: snapped.snappedPoints,
			speedLimits,
			averageSpeedLimit:
				speedValues.length > 0
					? speedValues.reduce((a, b) => a + b, 0) / speedValues.length
					: undefined,
			maxSpeedLimit:
				speedValues.length > 0 ? Math.max(...speedValues) : undefined,
			minSpeedLimit:
				speedValues.length > 0 ? Math.min(...speedValues) : undefined,
		};
	}

	/**
	 * Track technician route and analyze for fleet management
	 */
	async trackTechnicianRoute(
		technicianId: string,
		gpsPoints: (LatLng & { timestamp?: string; speed?: number })[],
	): Promise<TechnicianTrackingResult | null> {
		if (!this.apiKey) {
			console.warn("Google Roads API key not configured");
			return null;
		}

		// Process in batches of 100
		const batchSize = 100;
		const allSnappedPoints: SnappedPoint[] = [];
		const allSpeedLimits: SpeedLimit[] = [];

		for (let i = 0; i < gpsPoints.length; i += batchSize) {
			const batch = gpsPoints.slice(i, i + batchSize);
			const batchPath = batch.map((p) => ({
				latitude: p.latitude,
				longitude: p.longitude,
			}));

			const snapped = await this.snapToRoads(batchPath, { interpolate: true });
			if (snapped) {
				allSnappedPoints.push(...snapped.snappedPoints);
			}

			const speedLimits = await this.getSpeedLimits(batchPath);
			if (speedLimits) {
				allSpeedLimits.push(...speedLimits.speedLimits);
			}
		}

		const totalDistance = this.calculatePathDistance(allSnappedPoints);

		// Detect potential speeding (if speed data provided)
		const potentialSpeedingPoints: TechnicianTrackingResult["potentialSpeedingPoints"] =
			[];

		for (const point of gpsPoints) {
			if (point.speed !== undefined) {
				// Find nearest speed limit
				const nearestLimit = allSpeedLimits.find((sl) => {
					const snapped = allSnappedPoints.find(
						(sp) => sp.placeId === sl.placeId,
					);
					if (!snapped) return false;

					const distance = this.calculateDistance(point, snapped.location);
					return distance < 100; // Within 100 meters
				});

				if (nearestLimit && point.speed > nearestLimit.speedLimit) {
					potentialSpeedingPoints.push({
						location: { latitude: point.latitude, longitude: point.longitude },
						speedLimit: nearestLimit.speedLimit,
						timestamp: point.timestamp,
					});
				}
			}
		}

		// Estimate duration based on average speed limit
		const avgSpeedLimit =
			allSpeedLimits.length > 0
				? allSpeedLimits.reduce((sum, sl) => sum + sl.speedLimit, 0) /
					allSpeedLimits.length
				: 30; // Default 30 mph

		// Convert speed to m/s and calculate duration
		const avgSpeedMs = (avgSpeedLimit * 1609.34) / 3600;
		const estimatedDuration = totalDistance / avgSpeedMs;

		return {
			technicianId,
			snappedPath: allSnappedPoints,
			speedLimits: allSpeedLimits,
			totalDistanceMeters: totalDistance,
			estimatedDuration: Math.round(estimatedDuration),
			potentialSpeedingPoints:
				potentialSpeedingPoints.length > 0
					? potentialSpeedingPoints
					: undefined,
		};
	}

	/**
	 * Batch snap multiple routes
	 */
	async batchSnapRoutes(
		routes: { id: string; path: LatLng[] }[],
	): Promise<Map<string, SnapToRoadsResult>> {
		const results = new Map<string, SnapToRoadsResult>();

		// Process concurrently with limit
		const BATCH_SIZE = 5;
		for (let i = 0; i < routes.length; i += BATCH_SIZE) {
			const batch = routes.slice(i, i + BATCH_SIZE);
			const promises = batch.map(async (route) => {
				const result = await this.snapToRoads(route.path);
				if (result) {
					results.set(route.id, result);
				}
			});
			await Promise.all(promises);
		}

		return results;
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

export const googleRoadsService = new GoogleRoadsService();
