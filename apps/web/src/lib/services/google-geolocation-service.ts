/**
 * Google Geolocation Service
 *
 * Provides device location capabilities for Stratos field service platform:
 * - Locate technicians without GPS
 * - Track vehicle locations via cell towers/WiFi
 * - Indoor positioning for large facilities
 * - Location verification for job check-ins
 *
 * API Documentation: https://developers.google.com/maps/documentation/geolocation
 *
 * Features:
 * - Cell tower triangulation
 * - WiFi access point positioning
 * - Hybrid location (cell + WiFi)
 * - Accuracy estimation
 * - Works when GPS is unavailable
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Cell tower information
 */
export interface CellTower {
	cellId: number;
	locationAreaCode: number;
	mobileCountryCode: number;
	mobileNetworkCode: number;
	age?: number;
	signalStrength?: number;
	timingAdvance?: number;
}

/**
 * WiFi access point information
 */
export interface WifiAccessPoint {
	macAddress: string;
	signalStrength?: number;
	age?: number;
	channel?: number;
	signalToNoiseRatio?: number;
}

/**
 * Geolocation request
 */
export interface GeolocationRequest {
	homeMobileCountryCode?: number;
	homeMobileNetworkCode?: number;
	radioType?: "lte" | "gsm" | "cdma" | "wcdma" | "nr";
	carrier?: string;
	considerIp?: boolean;
	cellTowers?: CellTower[];
	wifiAccessPoints?: WifiAccessPoint[];
}

/**
 * Geolocation response
 */
export interface GeolocationResponse {
	location: {
		lat: number;
		lng: number;
	};
	accuracy: number; // meters
}

/**
 * Simplified location result
 */
export interface LocationResult {
	latitude: number;
	longitude: number;
	accuracy: number; // meters
	source: "cell" | "wifi" | "hybrid" | "ip";
	timestamp: Date;
}

/**
 * Location with address (geocoded)
 */
export interface LocationWithAddress extends LocationResult {
	address?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
}

// Zod schemas for validation
const GeolocationResponseSchema = z.object({
	location: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	accuracy: z.number(),
});

// ============================================================================
// Service Class
// ============================================================================

/**
 * Google Geolocation Service
 *
 * Singleton service for device location operations.
 *
 * @example
 * ```typescript
 * const geolocationService = GoogleGeolocationService.getInstance();
 *
 * // Get location from WiFi access points
 * const location = await geolocationService.getLocationFromWifi([
 *   { macAddress: '00:25:9c:cf:1c:ac', signalStrength: -65 },
 *   { macAddress: '00:25:9c:cf:1c:ad', signalStrength: -70 },
 * ]);
 *
 * console.log(location.latitude, location.longitude);
 * ```
 */
class GoogleGeolocationService {
	private static instance: GoogleGeolocationService;
	private apiKey: string | undefined;
	private baseUrl = "https://www.googleapis.com/geolocation/v1/geolocate";

	// Cache for recent locations (by request hash)
	private cache: Map<string, { result: LocationResult; timestamp: number }> =
		new Map();
	private readonly CACHE_TTL = 1000 * 60 * 5; // 5 minutes

	private constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;

		if (!this.apiKey) {
			console.warn(
				"GoogleGeolocationService: No API key found. Set GOOGLE_API_KEY environment variable.",
			);
		}
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): GoogleGeolocationService {
		if (!GoogleGeolocationService.instance) {
			GoogleGeolocationService.instance = new GoogleGeolocationService();
		}
		return GoogleGeolocationService.instance;
	}

	/**
	 * Check if the service is configured
	 */
	public isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Generate cache key from request
	 */
	private getCacheKey(request: GeolocationRequest): string {
		const cellKey =
			request.cellTowers?.map((c) => `${c.cellId}`).join(",") || "";
		const wifiKey =
			request.wifiAccessPoints?.map((w) => w.macAddress).join(",") || "";
		return `${cellKey}_${wifiKey}_${request.considerIp}`;
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
	 * Get location from cell towers and/or WiFi access points
	 *
	 * @param request - Geolocation request with cell/wifi data
	 * @returns Location result
	 */
	async getLocation(request: GeolocationRequest): Promise<LocationResult> {
		if (!this.apiKey) {
			throw new Error("Geolocation API key not configured");
		}

		// Check cache
		const cacheKey = this.getCacheKey(request);
		this.cleanCache();
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached.result;
		}

		const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Geolocation API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = GeolocationResponseSchema.parse(data);

		// Determine source based on request
		let source: LocationResult["source"] = "ip";
		if (
			request.cellTowers &&
			request.cellTowers.length > 0 &&
			request.wifiAccessPoints &&
			request.wifiAccessPoints.length > 0
		) {
			source = "hybrid";
		} else if (request.cellTowers && request.cellTowers.length > 0) {
			source = "cell";
		} else if (
			request.wifiAccessPoints &&
			request.wifiAccessPoints.length > 0
		) {
			source = "wifi";
		}

		const result: LocationResult = {
			latitude: validated.location.lat,
			longitude: validated.location.lng,
			accuracy: validated.accuracy,
			source,
			timestamp: new Date(),
		};

		// Cache result
		this.cache.set(cacheKey, { result, timestamp: Date.now() });

		return result;
	}

	/**
	 * Get location from IP address only
	 * Less accurate but works without any device data
	 *
	 * @returns Location result based on IP
	 */
	async getLocationFromIP(): Promise<LocationResult> {
		return this.getLocation({
			considerIp: true,
		});
	}

	/**
	 * Get location from WiFi access points
	 *
	 * @param wifiAccessPoints - List of visible WiFi networks
	 * @returns Location result
	 */
	async getLocationFromWifi(
		wifiAccessPoints: WifiAccessPoint[],
	): Promise<LocationResult> {
		if (wifiAccessPoints.length === 0) {
			throw new Error("At least one WiFi access point is required");
		}

		return this.getLocation({
			wifiAccessPoints,
			considerIp: true, // Fallback to IP if WiFi positioning fails
		});
	}

	/**
	 * Get location from cell towers
	 *
	 * @param cellTowers - List of visible cell towers
	 * @param radioType - Radio type (lte, gsm, etc.)
	 * @returns Location result
	 */
	async getLocationFromCellTowers(
		cellTowers: CellTower[],
		radioType?: GeolocationRequest["radioType"],
	): Promise<LocationResult> {
		if (cellTowers.length === 0) {
			throw new Error("At least one cell tower is required");
		}

		return this.getLocation({
			cellTowers,
			radioType,
			considerIp: true,
		});
	}

	/**
	 * Get location using all available data (hybrid)
	 *
	 * @param cellTowers - List of visible cell towers
	 * @param wifiAccessPoints - List of visible WiFi networks
	 * @param radioType - Radio type
	 * @returns Location result with best accuracy
	 */
	async getHybridLocation(
		cellTowers?: CellTower[],
		wifiAccessPoints?: WifiAccessPoint[],
		radioType?: GeolocationRequest["radioType"],
	): Promise<LocationResult> {
		return this.getLocation({
			cellTowers,
			wifiAccessPoints,
			radioType,
			considerIp: true,
		});
	}

	/**
	 * Verify if a technician is at a job location
	 *
	 * @param technicianLocation - Technician's current location
	 * @param jobLocation - Expected job location
	 * @param toleranceMeters - Acceptable distance (default 100m)
	 * @returns Verification result
	 */
	verifyLocationProximity(
		technicianLocation: { latitude: number; longitude: number },
		jobLocation: { latitude: number; longitude: number },
		toleranceMeters: number = 100,
	): {
		isAtLocation: boolean;
		distanceMeters: number;
		withinAccuracy: boolean;
	} {
		const distance = this.haversineDistance(technicianLocation, jobLocation);

		return {
			isAtLocation: distance <= toleranceMeters,
			distanceMeters: Math.round(distance),
			withinAccuracy: distance <= toleranceMeters * 1.5, // Some buffer for GPS drift
		};
	}

	/**
	 * Calculate distance between two points using Haversine formula
	 */
	private haversineDistance(
		point1: { latitude: number; longitude: number },
		point2: { latitude: number; longitude: number },
	): number {
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
	 * Get address from coordinates (reverse geocode)
	 * Uses Google Geocoding API
	 *
	 * @param location - Location to geocode
	 * @returns Location with address
	 */
	async reverseGeocode(location: LocationResult): Promise<LocationWithAddress> {
		if (!this.apiKey) {
			throw new Error("Geolocation API key not configured");
		}

		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${this.apiKey}`,
		);

		if (!response.ok) {
			// Return location without address on geocoding failure
			return location;
		}

		const data = await response.json();

		if (data.status !== "OK" || !data.results || data.results.length === 0) {
			return location;
		}

		const result = data.results[0];
		const components = result.address_components || [];

		// Extract address components
		const getComponent = (type: string): string | undefined => {
			const component = components.find((c: { types: string[] }) =>
				c.types.includes(type),
			);
			return component?.long_name;
		};

		return {
			...location,
			address: result.formatted_address,
			city: getComponent("locality") || getComponent("sublocality"),
			state: getComponent("administrative_area_level_1"),
			postalCode: getComponent("postal_code"),
			country: getComponent("country"),
		};
	}

	/**
	 * Track technician location over time
	 * Returns a function to stop tracking
	 *
	 * @param callback - Function called with each location update
	 * @param intervalMs - Update interval in milliseconds
	 * @param wifiAccessPoints - Optional WiFi data provider
	 * @returns Stop function
	 */
	startTracking(
		callback: (location: LocationResult) => void,
		intervalMs: number = 30000,
		wifiAccessPoints?: () => Promise<WifiAccessPoint[]>,
	): () => void {
		let isTracking = true;

		const track = async () => {
			if (!isTracking) return;

			try {
				let location: LocationResult;

				if (wifiAccessPoints) {
					const wifi = await wifiAccessPoints();
					location = await this.getLocationFromWifi(wifi);
				} else {
					location = await this.getLocationFromIP();
				}

				callback(location);
			} catch (error) {
				console.error("Location tracking error:", error);
			}

			if (isTracking) {
				setTimeout(track, intervalMs);
			}
		};

		// Start tracking
		track();

		// Return stop function
		return () => {
			isTracking = false;
		};
	}

	/**
	 * Clear the location cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// ============================================================================
// Exports
// ============================================================================

export const googleGeolocationService = GoogleGeolocationService.getInstance();
export default googleGeolocationService;
