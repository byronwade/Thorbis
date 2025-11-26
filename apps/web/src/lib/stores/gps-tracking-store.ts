/**
 * GPS Tracking Store
 *
 * Real-time GPS tracking for technicians in the field
 * Integrates with Supabase real-time for live location updates
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Coordinates } from "@/lib/schedule/route-optimization";

// ============================================================================
// Types
// ============================================================================

export type TechnicianLocation = {
	technicianId: string;
	coordinates: Coordinates;
	accuracy: number; // meters
	heading?: number; // degrees
	speed?: number; // m/s
	timestamp: Date;
	status: "active" | "stale" | "offline";
	lastJobId?: string;
	batteryLevel?: number;
};

export type MapBounds = {
	north: number;
	south: number;
	east: number;
	west: number;
};

export type MapViewState = {
	center: Coordinates;
	zoom: number;
	bounds?: MapBounds;
};

type GPSTrackingState = {
	// Technician locations
	locations: Map<string, TechnicianLocation>;
	lastUpdate: Date | null;
	isTracking: boolean;
	error: string | null;

	// Map view state
	mapView: MapViewState;
	selectedTechnicianId: string | null;
	selectedJobId: string | null;
	showTraffic: boolean;
	showRoutes: boolean;

	// Actions - Locations
	setLocation: (techId: string, location: TechnicianLocation) => void;
	setLocations: (locations: TechnicianLocation[]) => void;
	removeLocation: (techId: string) => void;
	clearLocations: () => void;

	// Actions - Tracking
	startTracking: () => void;
	stopTracking: () => void;
	setError: (error: string | null) => void;

	// Actions - Map View
	setMapView: (view: Partial<MapViewState>) => void;
	setSelectedTechnician: (techId: string | null) => void;
	setSelectedJob: (jobId: string | null) => void;
	toggleTraffic: () => void;
	toggleRoutes: () => void;
	fitBoundsToLocations: () => void;

	// Helpers
	getLocation: (techId: string) => TechnicianLocation | undefined;
	getActiveLocations: () => TechnicianLocation[];
	getNearestTechnician: (target: Coordinates) => TechnicianLocation | undefined;
};

// ============================================================================
// Constants
// ============================================================================

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CENTER: Coordinates = { lat: 34.0522, lng: -118.2437 }; // LA
const DEFAULT_ZOOM = 12;

// ============================================================================
// Store
// ============================================================================

export const useGPSTrackingStore = create<GPSTrackingState>()(
	devtools(
		(set, get) => ({
			// Initial state
			locations: new Map(),
			lastUpdate: null,
			isTracking: false,
			error: null,

			mapView: {
				center: DEFAULT_CENTER,
				zoom: DEFAULT_ZOOM,
			},
			selectedTechnicianId: null,
			selectedJobId: null,
			showTraffic: false,
			showRoutes: true,

			// Location actions
			setLocation: (techId, location) => {
				set((state) => {
					const newLocations = new Map(state.locations);
					newLocations.set(techId, location);
					return {
						locations: newLocations,
						lastUpdate: new Date(),
					};
				});
			},

			setLocations: (locations) => {
				set((state) => {
					const newLocations = new Map(state.locations);
					for (const loc of locations) {
						newLocations.set(loc.technicianId, loc);
					}
					return {
						locations: newLocations,
						lastUpdate: new Date(),
					};
				});
			},

			removeLocation: (techId) => {
				set((state) => {
					const newLocations = new Map(state.locations);
					newLocations.delete(techId);
					return { locations: newLocations };
				});
			},

			clearLocations: () => {
				set({ locations: new Map(), lastUpdate: null });
			},

			// Tracking actions
			startTracking: () => {
				set({ isTracking: true, error: null });
			},

			stopTracking: () => {
				set({ isTracking: false });
			},

			setError: (error) => {
				set({ error });
			},

			// Map view actions
			setMapView: (view) => {
				set((state) => ({
					mapView: { ...state.mapView, ...view },
				}));
			},

			setSelectedTechnician: (techId) => {
				set({ selectedTechnicianId: techId });

				// Center map on technician if selected
				if (techId) {
					const location = get().locations.get(techId);
					if (location) {
						set((state) => ({
							mapView: {
								...state.mapView,
								center: location.coordinates,
								zoom: 15,
							},
						}));
					}
				}
			},

			setSelectedJob: (jobId) => {
				set({ selectedJobId: jobId });
			},

			toggleTraffic: () => {
				set((state) => ({ showTraffic: !state.showTraffic }));
			},

			toggleRoutes: () => {
				set((state) => ({ showRoutes: !state.showRoutes }));
			},

			fitBoundsToLocations: () => {
				const locations = Array.from(get().locations.values());
				if (locations.length === 0) return;

				// Calculate bounds
				let minLat = Infinity;
				let maxLat = -Infinity;
				let minLng = Infinity;
				let maxLng = -Infinity;

				for (const loc of locations) {
					minLat = Math.min(minLat, loc.coordinates.lat);
					maxLat = Math.max(maxLat, loc.coordinates.lat);
					minLng = Math.min(minLng, loc.coordinates.lng);
					maxLng = Math.max(maxLng, loc.coordinates.lng);
				}

				// Add padding
				const latPadding = (maxLat - minLat) * 0.1;
				const lngPadding = (maxLng - minLng) * 0.1;

				const bounds: MapBounds = {
					north: maxLat + latPadding,
					south: minLat - latPadding,
					east: maxLng + lngPadding,
					west: minLng - lngPadding,
				};

				// Calculate center
				const center: Coordinates = {
					lat: (minLat + maxLat) / 2,
					lng: (minLng + maxLng) / 2,
				};

				// Estimate zoom based on bounds size
				const latDiff = maxLat - minLat;
				const lngDiff = maxLng - minLng;
				const maxDiff = Math.max(latDiff, lngDiff);

				let zoom = 12;
				if (maxDiff > 1) zoom = 8;
				else if (maxDiff > 0.5) zoom = 9;
				else if (maxDiff > 0.2) zoom = 10;
				else if (maxDiff > 0.1) zoom = 11;
				else if (maxDiff > 0.05) zoom = 12;
				else if (maxDiff > 0.02) zoom = 13;
				else zoom = 14;

				set({
					mapView: { center, zoom, bounds },
				});
			},

			// Helpers
			getLocation: (techId) => get().locations.get(techId),

			getActiveLocations: () => {
				const now = Date.now();
				return Array.from(get().locations.values()).filter((loc) => {
					const age = now - loc.timestamp.getTime();
					return age < STALE_THRESHOLD_MS && loc.status !== "offline";
				});
			},

			getNearestTechnician: (target) => {
				const locations = get().getActiveLocations();
				if (locations.length === 0) return undefined;

				let nearest: TechnicianLocation | undefined;
				let nearestDistance = Infinity;

				for (const loc of locations) {
					const distance = calculateDistance(loc.coordinates, target);
					if (distance < nearestDistance) {
						nearestDistance = distance;
						nearest = loc;
					}
				}

				return nearest;
			},
		}),
		{ name: "gps-tracking-store" },
	),
);

// ============================================================================
// Utility Functions
// ============================================================================

function calculateDistance(a: Coordinates, b: Coordinates): number {
	const lat1 = (a.lat * Math.PI) / 180;
	const lat2 = (b.lat * Math.PI) / 180;
	const deltaLat = ((b.lat - a.lat) * Math.PI) / 180;
	const deltaLng = ((b.lng - a.lng) * Math.PI) / 180;

	const x =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(lat1) *
			Math.cos(lat2) *
			Math.sin(deltaLng / 2) *
			Math.sin(deltaLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

	return 6371000 * c; // Distance in meters
}

/**
 * Update location status based on timestamp
 */
export function updateLocationStatus(
	location: TechnicianLocation,
): TechnicianLocation {
	const age = Date.now() - location.timestamp.getTime();

	let status: TechnicianLocation["status"] = "active";
	if (age > STALE_THRESHOLD_MS) {
		status = "stale";
	}
	if (age > STALE_THRESHOLD_MS * 2) {
		status = "offline";
	}

	return { ...location, status };
}

/**
 * Format location for display
 */
export function formatLocationAge(timestamp: Date): string {
	const age = Date.now() - timestamp.getTime();
	const seconds = Math.floor(age / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) return `${hours}h ago`;
	if (minutes > 0) return `${minutes}m ago`;
	if (seconds > 30) return `${seconds}s ago`;
	return "Just now";
}
