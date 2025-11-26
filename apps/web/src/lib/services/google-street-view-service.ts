/**
 * Google Street View Service
 *
 * Provides street-level imagery for properties and job locations.
 * - Static Street View images
 * - Metadata about available imagery
 * - Interactive viewer URLs
 * - Useful for property verification and tech arrival
 *
 * API: Google Street View Static API
 * Free Tier: $200/month credit = ~28,000 requests
 * Docs: https://developers.google.com/maps/documentation/streetview
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Street View metadata schema
 */
const StreetViewMetadataSchema = z.object({
	status: z.enum([
		"OK",
		"ZERO_RESULTS",
		"NOT_FOUND",
		"OVER_QUERY_LIMIT",
		"REQUEST_DENIED",
		"INVALID_REQUEST",
		"UNKNOWN_ERROR",
	]),
	copyright: z.string().optional(),
	date: z.string().optional(), // YYYY-MM format
	location: z
		.object({
			lat: z.number(),
			lng: z.number(),
		})
		.optional(),
	panoId: z.string().optional(),
});

export type StreetViewMetadata = z.infer<typeof StreetViewMetadataSchema>;

/**
 * Location input for Street View requests
 */
export interface StreetViewLocation {
	latitude?: number;
	longitude?: number;
	address?: string;
	panoId?: string;
}

/**
 * Image size options
 */
export interface ImageSize {
	width: number;
	height: number;
}

/**
 * Camera orientation options
 */
export interface CameraOptions {
	heading?: number; // 0-360 degrees (0=North, 90=East, 180=South, 270=West)
	pitch?: number; // -90 to 90 degrees (0=horizontal, 90=up, -90=down)
	fov?: number; // 10-120 degrees (default 90, smaller = more zoom)
}

/**
 * Options for Street View image requests
 */
export interface StreetViewImageOptions {
	size?: ImageSize;
	camera?: CameraOptions;
	radius?: number; // Search radius in meters (default 50)
	source?: "default" | "outdoor"; // Prefer outdoor imagery
	returnErrorCode?: boolean;
}

/**
 * Street View image result
 */
export interface StreetViewImageResult {
	url: string;
	signedUrl?: string;
	available: boolean;
	metadata?: StreetViewMetadata;
}

/**
 * Property imagery result
 */
export interface PropertyImageryResult {
	address: string;
	available: boolean;
	imageUrl?: string;
	interactiveUrl?: string;
	captureDate?: string;
	location?: {
		latitude: number;
		longitude: number;
	};
	panoId?: string;
	views?: {
		front: string;
		left: string;
		right: string;
	};
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days (imagery rarely changes)

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleStreetViewService {
	private readonly apiKey: string | undefined;
	private readonly metadataCache: Map<
		string,
		{ data: StreetViewMetadata; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Format location for API request
	 */
	private formatLocation(location: StreetViewLocation): string {
		if (location.panoId) {
			return `pano:${location.panoId}`;
		}
		if (location.latitude !== undefined && location.longitude !== undefined) {
			return `${location.latitude},${location.longitude}`;
		}
		if (location.address) {
			return location.address;
		}
		throw new Error("Location must have address, coordinates, or panoId");
	}

	/**
	 * Generate cache key
	 */
	private generateCacheKey(location: StreetViewLocation): string {
		return `sv:${this.formatLocation(location)}`;
	}

	/**
	 * Check if Street View imagery is available at a location
	 */
	async checkAvailability(
		location: StreetViewLocation,
	): Promise<StreetViewMetadata | null> {
		if (!this.apiKey) {
			console.warn("Google Street View API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey(location);
		const cached = this.metadataCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
			});

			if (location.panoId) {
				params.set("pano", location.panoId);
			} else if (
				location.latitude !== undefined &&
				location.longitude !== undefined
			) {
				params.set("location", `${location.latitude},${location.longitude}`);
			} else if (location.address) {
				params.set("location", location.address);
			}

			const url = `https://maps.googleapis.com/maps/api/streetview/metadata?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Street View metadata error:", response.status);
				return null;
			}

			const data = await response.json();
			const metadata: StreetViewMetadata = {
				status: data.status,
				copyright: data.copyright,
				date: data.date,
				location: data.location,
				panoId: data.pano_id,
			};

			this.metadataCache.set(cacheKey, {
				data: metadata,
				timestamp: Date.now(),
			});

			return metadata;
		} catch (error) {
			console.error("Street View metadata error:", error);
			return null;
		}
	}

	/**
	 * Get Street View image URL for a location
	 */
	getImageUrl(
		location: StreetViewLocation,
		options: StreetViewImageOptions = {},
	): string {
		if (!this.apiKey) {
			throw new Error("Google Street View API key not configured");
		}

		const params = new URLSearchParams({
			key: this.apiKey,
		});

		// Location
		if (location.panoId) {
			params.set("pano", location.panoId);
		} else if (
			location.latitude !== undefined &&
			location.longitude !== undefined
		) {
			params.set("location", `${location.latitude},${location.longitude}`);
		} else if (location.address) {
			params.set("location", location.address);
		}

		// Size (default 640x480)
		const size = options.size || { width: 640, height: 480 };
		params.set("size", `${size.width}x${size.height}`);

		// Camera options
		if (options.camera?.heading !== undefined) {
			params.set("heading", String(options.camera.heading));
		}
		if (options.camera?.pitch !== undefined) {
			params.set("pitch", String(options.camera.pitch));
		}
		if (options.camera?.fov !== undefined) {
			params.set("fov", String(options.camera.fov));
		}

		// Search radius
		if (options.radius !== undefined) {
			params.set("radius", String(options.radius));
		}

		// Source preference
		if (options.source) {
			params.set("source", options.source);
		}

		// Error handling
		if (options.returnErrorCode) {
			params.set("return_error_code", "true");
		}

		return `https://maps.googleapis.com/maps/api/streetview?${params.toString()}`;
	}

	/**
	 * Get Street View image with availability check
	 */
	async getImage(
		location: StreetViewLocation,
		options: StreetViewImageOptions = {},
	): Promise<StreetViewImageResult> {
		const metadata = await this.checkAvailability(location);

		if (!metadata || metadata.status !== "OK") {
			return {
				url: "",
				available: false,
				metadata: metadata || undefined,
			};
		}

		const url = this.getImageUrl(location, options);

		return {
			url,
			available: true,
			metadata,
		};
	}

	/**
	 * Get interactive Street View URL for embedding or linking
	 */
	getInteractiveUrl(
		location: StreetViewLocation,
		options: CameraOptions = {},
	): string {
		const params = new URLSearchParams();

		if (location.panoId) {
			params.set("pano", location.panoId);
		} else if (
			location.latitude !== undefined &&
			location.longitude !== undefined
		) {
			params.set("cbll", `${location.latitude},${location.longitude}`);
		}

		// Camera orientation
		const heading = options.heading ?? 0;
		const pitch = options.pitch ?? 0;
		const fov = options.fov ?? 90;
		params.set("cbp", `0,${heading},0,0,${pitch}`);

		return `https://www.google.com/maps/@?api=1&map_action=pano&${params.toString()}`;
	}

	/**
	 * Get Google Maps URL with Street View
	 */
	getMapsStreetViewUrl(location: StreetViewLocation): string {
		if (location.latitude !== undefined && location.longitude !== undefined) {
			return `https://www.google.com/maps?q=&layer=c&cbll=${location.latitude},${location.longitude}`;
		}
		if (location.address) {
			return `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&layer=c`;
		}
		throw new Error("Location must have address or coordinates");
	}

	/**
	 * Get property imagery with multiple angles
	 */
	async getPropertyImagery(
		address: string,
		options: { size?: ImageSize; includeAngles?: boolean } = {},
	): Promise<PropertyImageryResult> {
		const metadata = await this.checkAvailability({ address });

		if (!metadata || metadata.status !== "OK") {
			return {
				address,
				available: false,
			};
		}

		const size = options.size || { width: 640, height: 480 };
		const location: StreetViewLocation = metadata.panoId
			? { panoId: metadata.panoId }
			: { address };

		const result: PropertyImageryResult = {
			address,
			available: true,
			imageUrl: this.getImageUrl(location, { size }),
			interactiveUrl: this.getMapsStreetViewUrl({ address }),
			captureDate: metadata.date,
			panoId: metadata.panoId,
		};

		if (metadata.location) {
			result.location = {
				latitude: metadata.location.lat,
				longitude: metadata.location.lng,
			};
		}

		// Generate multiple angles if requested
		if (options.includeAngles) {
			// Try to determine street-facing direction
			// Default to 0 (North-facing), with left and right views
			result.views = {
				front: this.getImageUrl(location, { size, camera: { heading: 0 } }),
				left: this.getImageUrl(location, { size, camera: { heading: 270 } }),
				right: this.getImageUrl(location, { size, camera: { heading: 90 } }),
			};
		}

		return result;
	}

	/**
	 * Get property imagery with heading toward property
	 * Uses property coordinates to calculate optimal viewing angle
	 */
	async getPropertyImageryWithHeading(
		propertyLat: number,
		propertyLng: number,
		options: { size?: ImageSize; searchRadius?: number } = {},
	): Promise<PropertyImageryResult | null> {
		// First check what Street View coverage exists near the property
		const metadata = await this.checkAvailability({
			latitude: propertyLat,
			longitude: propertyLng,
		});

		if (!metadata || metadata.status !== "OK" || !metadata.location) {
			return null;
		}

		// Calculate heading from Street View location to property
		const svLat = metadata.location.lat;
		const svLng = metadata.location.lng;
		const heading = this.calculateHeading(
			svLat,
			svLng,
			propertyLat,
			propertyLng,
		);

		const size = options.size || { width: 640, height: 480 };
		const location: StreetViewLocation = metadata.panoId
			? { panoId: metadata.panoId }
			: { latitude: svLat, longitude: svLng };

		return {
			address: `${propertyLat},${propertyLng}`,
			available: true,
			imageUrl: this.getImageUrl(location, {
				size,
				camera: { heading, pitch: 0 },
				radius: options.searchRadius,
			}),
			interactiveUrl: this.getInteractiveUrl(location, { heading }),
			captureDate: metadata.date,
			panoId: metadata.panoId,
			location: {
				latitude: svLat,
				longitude: svLng,
			},
		};
	}

	/**
	 * Calculate heading from one point to another
	 */
	private calculateHeading(
		fromLat: number,
		fromLng: number,
		toLat: number,
		toLng: number,
	): number {
		const φ1 = (fromLat * Math.PI) / 180;
		const φ2 = (toLat * Math.PI) / 180;
		const Δλ = ((toLng - fromLng) * Math.PI) / 180;

		const y = Math.sin(Δλ) * Math.cos(φ2);
		const x =
			Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

		let heading = (Math.atan2(y, x) * 180) / Math.PI;
		heading = (heading + 360) % 360; // Normalize to 0-360

		return Math.round(heading);
	}

	/**
	 * Generate thumbnail URL (smaller image for lists/previews)
	 */
	getThumbnailUrl(location: StreetViewLocation): string {
		return this.getImageUrl(location, {
			size: { width: 200, height: 150 },
		});
	}

	/**
	 * Generate high-resolution URL
	 */
	getHighResUrl(location: StreetViewLocation): string {
		return this.getImageUrl(location, {
			size: { width: 1280, height: 960 },
		});
	}

	/**
	 * Batch check availability for multiple locations
	 */
	async batchCheckAvailability(
		locations: StreetViewLocation[],
	): Promise<Map<string, boolean>> {
		const results = new Map<string, boolean>();

		// Process in parallel with concurrency limit
		const BATCH_SIZE = 10;
		for (let i = 0; i < locations.length; i += BATCH_SIZE) {
			const batch = locations.slice(i, i + BATCH_SIZE);
			const promises = batch.map(async (loc) => {
				const key = this.formatLocation(loc);
				const metadata = await this.checkAvailability(loc);
				results.set(key, metadata?.status === "OK");
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
		this.metadataCache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats(): { size: number; ttlMs: number } {
		return {
			size: this.metadataCache.size,
			ttlMs: this.cacheTTL,
		};
	}
}

export const googleStreetViewService = new GoogleStreetViewService();
