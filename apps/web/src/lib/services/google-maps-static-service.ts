/**
 * Google Maps Static API Service
 *
 * Generates static map images for embedding.
 * - Property location maps
 * - Route visualization
 * - Service area maps
 * - Custom markers and paths
 *
 * API: Google Maps Static API
 * Docs: https://developers.google.com/maps/documentation/maps-static
 */

import { z } from "zod";

/**
 * Map type options
 */
export type MapType = "roadmap" | "satellite" | "terrain" | "hybrid";

/**
 * Image format options
 */
export type ImageFormat =
	| "png"
	| "png8"
	| "png32"
	| "gif"
	| "jpg"
	| "jpg-baseline";

/**
 * Marker size options
 */
export type MarkerSize = "tiny" | "small" | "mid";

/**
 * Marker configuration
 */
export interface MapMarker {
	location: string | { lat: number; lng: number };
	color?: string;
	label?: string;
	size?: MarkerSize;
	icon?: string;
}

/**
 * Path configuration
 */
export interface MapPath {
	points: (string | { lat: number; lng: number })[];
	color?: string;
	weight?: number;
	fillcolor?: string;
	geodesic?: boolean;
}

/**
 * Style configuration
 */
export interface MapStyle {
	feature?: string;
	element?: string;
	rules: {
		color?: string;
		visibility?: "on" | "off" | "simplified";
		weight?: number;
		saturation?: number;
		lightness?: number;
		gamma?: number;
	};
}

/**
 * Static map options
 */
export interface StaticMapOptions {
	center?: string | { lat: number; lng: number };
	zoom?: number;
	size: { width: number; height: number };
	scale?: 1 | 2 | 4;
	format?: ImageFormat;
	maptype?: MapType;
	markers?: MapMarker[];
	path?: MapPath;
	styles?: MapStyle[];
	visible?: string[];
	language?: string;
	region?: string;
}

/**
 * Static map result
 */
export interface StaticMapResult {
	url: string;
	width: number;
	height: number;
	scale: number;
}

/**
 * Property map options
 */
export interface PropertyMapOptions {
	address: string;
	coordinates?: { lat: number; lng: number };
	size?: { width: number; height: number };
	zoom?: number;
	maptype?: MapType;
	showMarker?: boolean;
	markerColor?: string;
}

/**
 * Route map options
 */
export interface RouteMapOptions {
	origin: string | { lat: number; lng: number };
	destination: string | { lat: number; lng: number };
	waypoints?: (string | { lat: number; lng: number })[];
	size?: { width: number; height: number };
	pathColor?: string;
	pathWeight?: number;
	showMarkers?: boolean;
}

/**
 * Service area map options
 */
export interface ServiceAreaMapOptions {
	center: string | { lat: number; lng: number };
	radius?: number; // in miles
	size?: { width: number; height: number };
	fillColor?: string;
	borderColor?: string;
	zoom?: number;
}

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleMapsStaticService {
	private readonly apiKey: string | undefined;
	private readonly baseUrl = "https://maps.googleapis.com/maps/api/staticmap";

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Format location for URL
	 */
	private formatLocation(
		location: string | { lat: number; lng: number },
	): string {
		if (typeof location === "string") {
			return encodeURIComponent(location);
		}
		return `${location.lat},${location.lng}`;
	}

	/**
	 * Generate static map URL
	 */
	generateMapUrl(options: StaticMapOptions): StaticMapResult | null {
		if (!this.apiKey) {
			console.warn("Google Maps Static API key not configured");
			return null;
		}

		const params = new URLSearchParams();
		params.append("key", this.apiKey);

		// Size (required)
		params.append("size", `${options.size.width}x${options.size.height}`);

		// Center and zoom (required unless markers or path provided)
		if (options.center) {
			params.append("center", this.formatLocation(options.center));
		}
		if (options.zoom !== undefined) {
			params.append("zoom", options.zoom.toString());
		}

		// Optional parameters
		if (options.scale) {
			params.append("scale", options.scale.toString());
		}
		if (options.format) {
			params.append("format", options.format);
		}
		if (options.maptype) {
			params.append("maptype", options.maptype);
		}
		if (options.language) {
			params.append("language", options.language);
		}
		if (options.region) {
			params.append("region", options.region);
		}

		// Markers
		if (options.markers && options.markers.length > 0) {
			for (const marker of options.markers) {
				const markerParts: string[] = [];

				if (marker.color) markerParts.push(`color:${marker.color}`);
				if (marker.size) markerParts.push(`size:${marker.size}`);
				if (marker.label) markerParts.push(`label:${marker.label}`);
				if (marker.icon)
					markerParts.push(`icon:${encodeURIComponent(marker.icon)}`);

				markerParts.push(this.formatLocation(marker.location));
				params.append("markers", markerParts.join("|"));
			}
		}

		// Path
		if (options.path) {
			const pathParts: string[] = [];

			if (options.path.color) pathParts.push(`color:${options.path.color}`);
			if (options.path.weight) pathParts.push(`weight:${options.path.weight}`);
			if (options.path.fillcolor)
				pathParts.push(`fillcolor:${options.path.fillcolor}`);
			if (options.path.geodesic) pathParts.push("geodesic:true");

			for (const point of options.path.points) {
				pathParts.push(this.formatLocation(point));
			}

			params.append("path", pathParts.join("|"));
		}

		// Visible locations (auto-fit bounds)
		if (options.visible && options.visible.length > 0) {
			params.append(
				"visible",
				options.visible.map((v) => encodeURIComponent(v)).join("|"),
			);
		}

		// Styles
		if (options.styles && options.styles.length > 0) {
			for (const style of options.styles) {
				const styleParts: string[] = [];

				if (style.feature) styleParts.push(`feature:${style.feature}`);
				if (style.element) styleParts.push(`element:${style.element}`);

				for (const [key, value] of Object.entries(style.rules)) {
					if (value !== undefined) {
						styleParts.push(`${key}:${value}`);
					}
				}

				params.append("style", styleParts.join("|"));
			}
		}

		const url = `${this.baseUrl}?${params.toString()}`;

		return {
			url,
			width: options.size.width * (options.scale || 1),
			height: options.size.height * (options.scale || 1),
			scale: options.scale || 1,
		};
	}

	/**
	 * Generate property location map
	 */
	getPropertyMap(options: PropertyMapOptions): StaticMapResult | null {
		const center = options.coordinates ? options.coordinates : options.address;

		const mapOptions: StaticMapOptions = {
			center,
			zoom: options.zoom || 17,
			size: options.size || { width: 600, height: 400 },
			maptype: options.maptype || "hybrid",
			scale: 2,
		};

		if (options.showMarker !== false) {
			mapOptions.markers = [
				{
					location: center,
					color: options.markerColor || "red",
				},
			];
		}

		return this.generateMapUrl(mapOptions);
	}

	/**
	 * Generate route map with path
	 */
	getRouteMap(options: RouteMapOptions): StaticMapResult | null {
		const points: (string | { lat: number; lng: number })[] = [
			options.origin,
			...(options.waypoints || []),
			options.destination,
		];

		const mapOptions: StaticMapOptions = {
			size: options.size || { width: 600, height: 400 },
			scale: 2,
			path: {
				points,
				color: options.pathColor || "0x4285F4",
				weight: options.pathWeight || 4,
			},
		};

		if (options.showMarkers !== false) {
			mapOptions.markers = [
				{
					location: options.origin,
					color: "green",
					label: "A",
				},
				{
					location: options.destination,
					color: "red",
					label: "B",
				},
			];

			// Add waypoint markers
			if (options.waypoints) {
				options.waypoints.forEach((waypoint, index) => {
					mapOptions.markers?.push({
						location: waypoint,
						color: "blue",
						label: String.fromCharCode(67 + index), // C, D, E, etc.
					});
				});
			}
		}

		return this.generateMapUrl(mapOptions);
	}

	/**
	 * Generate service area map with circle overlay
	 */
	getServiceAreaMap(options: ServiceAreaMapOptions): StaticMapResult | null {
		const radiusMiles = options.radius || 25;
		const radiusKm = radiusMiles * 1.60934;

		// Generate circle points (approximation)
		const circlePoints: { lat: number; lng: number }[] = [];
		const centerLat =
			typeof options.center === "string" ? 0 : options.center.lat;
		const centerLng =
			typeof options.center === "string" ? 0 : options.center.lng;

		if (typeof options.center !== "string") {
			const numPoints = 36;
			for (let i = 0; i <= numPoints; i++) {
				const angle = (i / numPoints) * 2 * Math.PI;
				const lat = centerLat + (radiusKm / 111) * Math.cos(angle);
				const lng =
					centerLng +
					(radiusKm / (111 * Math.cos(centerLat * (Math.PI / 180)))) *
						Math.sin(angle);
				circlePoints.push({ lat, lng });
			}
		}

		const mapOptions: StaticMapOptions = {
			center: options.center,
			zoom: options.zoom || 10,
			size: options.size || { width: 600, height: 400 },
			scale: 2,
			maptype: "roadmap",
		};

		if (circlePoints.length > 0) {
			mapOptions.path = {
				points: circlePoints,
				color: options.borderColor || "0x4285F4",
				weight: 2,
				fillcolor: options.fillColor || "0x4285F440",
			};
		}

		// Center marker
		mapOptions.markers = [
			{
				location: options.center,
				color: "red",
			},
		];

		return this.generateMapUrl(mapOptions);
	}

	/**
	 * Generate multi-location map
	 */
	getMultiLocationMap(
		locations: {
			location: string | { lat: number; lng: number };
			label?: string;
			color?: string;
		}[],
		options: {
			size?: { width: number; height: number };
			maptype?: MapType;
		} = {},
	): StaticMapResult | null {
		const mapOptions: StaticMapOptions = {
			size: options.size || { width: 600, height: 400 },
			scale: 2,
			maptype: options.maptype || "roadmap",
			markers: locations.map((loc, index) => ({
				location: loc.location,
				label: loc.label || String.fromCharCode(65 + index),
				color: loc.color || "red",
			})),
		};

		return this.generateMapUrl(mapOptions);
	}

	/**
	 * Generate job route map with multiple stops
	 */
	getJobRouteMap(
		stops: { address: string; jobNumber?: string }[],
		options: {
			size?: { width: number; height: number };
			pathColor?: string;
		} = {},
	): StaticMapResult | null {
		if (stops.length < 2) {
			return null;
		}

		const mapOptions: StaticMapOptions = {
			size: options.size || { width: 800, height: 500 },
			scale: 2,
			path: {
				points: stops.map((s) => s.address),
				color: options.pathColor || "0x4285F4",
				weight: 4,
			},
			markers: stops.map((stop, index) => ({
				location: stop.address,
				label: stop.jobNumber
					? stop.jobNumber.slice(-1)
					: String.fromCharCode(65 + index),
				color:
					index === 0 ? "green" : index === stops.length - 1 ? "red" : "blue",
			})),
		};

		return this.generateMapUrl(mapOptions);
	}

	/**
	 * Generate thumbnail map for list views
	 */
	getThumbnailMap(
		location: string | { lat: number; lng: number },
		options: { size?: { width: number; height: number }; zoom?: number } = {},
	): StaticMapResult | null {
		return this.generateMapUrl({
			center: location,
			zoom: options.zoom || 15,
			size: options.size || { width: 150, height: 150 },
			scale: 2,
			maptype: "roadmap",
			markers: [{ location, size: "small" }],
		});
	}

	/**
	 * Generate dark mode styled map
	 */
	getDarkModeMap(
		location: string | { lat: number; lng: number },
		options: { size?: { width: number; height: number }; zoom?: number } = {},
	): StaticMapResult | null {
		const darkStyles: MapStyle[] = [
			{ feature: "all", element: "geometry", rules: { color: "#242f3e" } },
			{
				feature: "all",
				element: "labels.text.stroke",
				rules: { color: "#242f3e" },
			},
			{
				feature: "all",
				element: "labels.text.fill",
				rules: { color: "#746855" },
			},
			{
				feature: "administrative.locality",
				element: "labels.text.fill",
				rules: { color: "#d59563" },
			},
			{ feature: "road", element: "geometry", rules: { color: "#38414e" } },
			{
				feature: "road",
				element: "geometry.stroke",
				rules: { color: "#212a37" },
			},
			{
				feature: "road",
				element: "labels.text.fill",
				rules: { color: "#9ca5b3" },
			},
			{
				feature: "road.highway",
				element: "geometry",
				rules: { color: "#746855" },
			},
			{
				feature: "road.highway",
				element: "geometry.stroke",
				rules: { color: "#1f2835" },
			},
			{ feature: "water", element: "geometry", rules: { color: "#17263c" } },
			{
				feature: "water",
				element: "labels.text.fill",
				rules: { color: "#515c6d" },
			},
		];

		return this.generateMapUrl({
			center: location,
			zoom: options.zoom || 15,
			size: options.size || { width: 600, height: 400 },
			scale: 2,
			maptype: "roadmap",
			styles: darkStyles,
			markers: [{ location, color: "0xFF5722" }],
		});
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}
}

export const googleMapsStaticService = new GoogleMapsStaticService();
