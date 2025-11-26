/**
 * Google Aerial View API Service
 *
 * Provides aerial (bird's eye) imagery of locations.
 * - High-resolution aerial photos
 * - Multiple zoom levels
 * - Property assessment views
 * - Roof inspection imagery
 *
 * API: Google Aerial View API
 * Docs: https://developers.google.com/maps/documentation/aerial-view
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Aerial view state
 */
export type AerialViewState =
	| "PROCESSING"
	| "ACTIVE"
	| "IMAGERY_NOT_FOUND"
	| "UNKNOWN";

/**
 * Video format options
 */
export type VideoFormat = "MP4_HIGH" | "MP4_MEDIUM" | "MP4_LOW" | "HLS";

/**
 * Aerial view metadata
 */
export interface AerialViewMetadata {
	state: AerialViewState;
	videoUri?: string;
	captureDate?: string;
	duration?: number; // seconds
}

/**
 * Aerial view video result
 */
export interface AerialViewResult {
	available: boolean;
	state: AerialViewState;
	videoUri?: string;
	videoFormats?: {
		format: VideoFormat;
		uri: string;
	}[];
	metadata?: {
		captureDate?: string;
		duration?: number;
		resolution?: string;
	};
}

/**
 * Location input
 */
export interface AerialViewLocation {
	latitude: number;
	longitude: number;
	address?: string;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleAerialViewService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: AerialViewResult; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Generate cache key
	 */
	private generateCacheKey(lat: number, lng: number): string {
		return `aerial:${lat.toFixed(5)},${lng.toFixed(5)}`;
	}

	/**
	 * Look up aerial view video for a location
	 */
	async lookupVideo(location: AerialViewLocation): Promise<AerialViewResult> {
		if (!this.apiKey) {
			console.warn("Google Aerial View API key not configured");
			return { available: false, state: "UNKNOWN" };
		}

		const cacheKey = this.generateCacheKey(
			location.latitude,
			location.longitude,
		);
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			// Use the Aerial View API lookup endpoint
			const params = new URLSearchParams({
				key: this.apiKey,
			});

			// Build the request body for video lookup
			const requestBody = {
				address:
					location.address || `${location.latitude},${location.longitude}`,
			};

			const url = `https://aerialview.googleapis.com/v1/videos:lookupVideo?${params.toString()}`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"User-Agent": USER_AGENT,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				// Check if it's a 404 (no imagery available)
				if (response.status === 404) {
					const result: AerialViewResult = {
						available: false,
						state: "IMAGERY_NOT_FOUND",
					};
					this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
					return result;
				}
				console.error("Aerial View API error:", response.status);
				return { available: false, state: "UNKNOWN" };
			}

			const data = await response.json();

			const result: AerialViewResult = {
				available: data.state === "ACTIVE",
				state: data.state || "UNKNOWN",
				videoUri: data.uris?.MP4_HIGH || data.uris?.MP4_MEDIUM,
				videoFormats: data.uris
					? Object.entries(data.uris).map(([format, uri]) => ({
							format: format as VideoFormat,
							uri: uri as string,
						}))
					: undefined,
				metadata: {
					captureDate: data.metadata?.captureDate,
					duration: data.metadata?.duration,
				},
			};

			this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
			return result;
		} catch (error) {
			console.error("Aerial View API error:", error);
			return { available: false, state: "UNKNOWN" };
		}
	}

	/**
	 * Render a new aerial view video for a location (async operation)
	 */
	async renderVideo(
		location: AerialViewLocation,
	): Promise<{ videoId?: string; state: AerialViewState }> {
		if (!this.apiKey) {
			console.warn("Google Aerial View API key not configured");
			return { state: "UNKNOWN" };
		}

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
			});

			const requestBody = {
				address:
					location.address || `${location.latitude},${location.longitude}`,
			};

			const url = `https://aerialview.googleapis.com/v1/videos:renderVideo?${params.toString()}`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"User-Agent": USER_AGENT,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				console.error("Aerial View render error:", response.status);
				return { state: "UNKNOWN" };
			}

			const data = await response.json();

			return {
				videoId: data.name,
				state: data.state || "PROCESSING",
			};
		} catch (error) {
			console.error("Aerial View render error:", error);
			return { state: "UNKNOWN" };
		}
	}

	/**
	 * Check the status of a rendering video
	 */
	async checkRenderStatus(videoId: string): Promise<AerialViewResult> {
		if (!this.apiKey) {
			return { available: false, state: "UNKNOWN" };
		}

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
			});

			const url = `https://aerialview.googleapis.com/v1/${videoId}?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				return { available: false, state: "UNKNOWN" };
			}

			const data = await response.json();

			return {
				available: data.state === "ACTIVE",
				state: data.state || "UNKNOWN",
				videoUri: data.uris?.MP4_HIGH || data.uris?.MP4_MEDIUM,
				videoFormats: data.uris
					? Object.entries(data.uris).map(([format, uri]) => ({
							format: format as VideoFormat,
							uri: uri as string,
						}))
					: undefined,
			};
		} catch (error) {
			console.error("Aerial View status check error:", error);
			return { available: false, state: "UNKNOWN" };
		}
	}

	/**
	 * Get aerial view for a property (lookup first, render if not available)
	 */
	async getPropertyAerialView(
		location: AerialViewLocation,
		options: { renderIfMissing?: boolean } = {},
	): Promise<AerialViewResult & { renderInitiated?: boolean }> {
		// First try to lookup existing video
		const existing = await this.lookupVideo(location);

		if (existing.available) {
			return existing;
		}

		// If not available and rendering requested, initiate render
		if (options.renderIfMissing && existing.state === "IMAGERY_NOT_FOUND") {
			const renderResult = await this.renderVideo(location);
			return {
				...existing,
				state: renderResult.state,
				renderInitiated: true,
			};
		}

		return existing;
	}

	/**
	 * Batch lookup aerial views for multiple properties
	 */
	async batchLookup(
		locations: AerialViewLocation[],
	): Promise<Map<string, AerialViewResult>> {
		const results = new Map<string, AerialViewResult>();

		// Process in parallel with concurrency limit
		const BATCH_SIZE = 5;
		for (let i = 0; i < locations.length; i += BATCH_SIZE) {
			const batch = locations.slice(i, i + BATCH_SIZE);
			const promises = batch.map(async (loc) => {
				const key = loc.address || `${loc.latitude},${loc.longitude}`;
				const result = await this.lookupVideo(loc);
				results.set(key, result);
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

export const googleAerialViewService = new GoogleAerialViewService();
