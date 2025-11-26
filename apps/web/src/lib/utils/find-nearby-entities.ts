/**
 * Find Nearby Entities Utility
 *
 * Calculates distance between coordinates and finds nearby customers,
 * properties, or jobs based on proximity to a clicked map location.
 */

export type Coordinates = {
	lat: number;
	lng: number;
};

export type EntityWithLocation = {
	id: string;
	lat?: number | null;
	lng?: number | null;
	lon?: number | null; // Some entities use 'lon' instead of 'lng'
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
	point1: Coordinates,
	point2: Coordinates,
): number {
	const R = 3959; // Earth's radius in miles
	const dLat = toRadians(point2.lat - point1.lat);
	const dLng = toRadians(point2.lng - point1.lng);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(point1.lat)) *
			Math.cos(toRadians(point2.lat)) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

/**
 * Find entities within a specified radius of a location
 */
export function findNearbyEntities<T extends EntityWithLocation>(
	location: Coordinates,
	entities: T[],
	radiusMiles: number = 5,
): Array<T & { distance: number }> {
	const nearby: Array<T & { distance: number }> = [];

	for (const entity of entities) {
		// Handle both 'lng' and 'lon' coordinate naming
		const entityLng = entity.lng ?? entity.lon;

		if (entity.lat == null || entityLng == null) {
			continue;
		}

		const distance = calculateDistance(location, {
			lat: entity.lat,
			lng: entityLng,
		});

		if (distance <= radiusMiles) {
			nearby.push({
				...entity,
				distance,
			});
		}
	}

	// Sort by distance (closest first)
	return nearby.sort((a, b) => a.distance - b.distance);
}

/**
 * Find the closest entity to a location
 */
export function findClosestEntity<T extends EntityWithLocation>(
	location: Coordinates,
	entities: T[],
): (T & { distance: number }) | null {
	const nearby = findNearbyEntities(location, entities, Infinity);
	return nearby[0] || null;
}

/**
 * Group entities by distance ranges
 */
export function groupByDistance<T extends EntityWithLocation>(
	location: Coordinates,
	entities: T[],
): {
	veryClose: Array<T & { distance: number }>; // < 0.5 miles
	close: Array<T & { distance: number }>; // 0.5 - 2 miles
	nearby: Array<T & { distance: number }>; // 2 - 5 miles
	far: Array<T & { distance: number }>; // > 5 miles
} {
	const results = {
		veryClose: [] as Array<T & { distance: number }>,
		close: [] as Array<T & { distance: number }>,
		nearby: [] as Array<T & { distance: number }>,
		far: [] as Array<T & { distance: number }>,
	};

	for (const entity of entities) {
		const entityLng = entity.lng ?? entity.lon;

		if (entity.lat == null || entityLng == null) {
			continue;
		}

		const distance = calculateDistance(location, {
			lat: entity.lat,
			lng: entityLng,
		});

		const enriched = { ...entity, distance };

		if (distance < 0.5) {
			results.veryClose.push(enriched);
		} else if (distance < 2) {
			results.close.push(enriched);
		} else if (distance < 5) {
			results.nearby.push(enriched);
		} else {
			results.far.push(enriched);
		}
	}

	// Sort each group by distance
	results.veryClose.sort((a, b) => a.distance - b.distance);
	results.close.sort((a, b) => a.distance - b.distance);
	results.nearby.sort((a, b) => a.distance - b.distance);
	results.far.sort((a, b) => a.distance - b.distance);

	return results;
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
	if (miles < 0.1) {
		const feet = Math.round(miles * 5280);
		return `${feet} ft`;
	}
	if (miles < 1) {
		return `${(miles * 5280).toFixed(0)} ft`;
	}
	return `${miles.toFixed(1)} mi`;
}

/**
 * Reverse geocode coordinates to get address
 * Uses Google Maps Geocoding API if available
 */
export async function reverseGeocode(
	location: Coordinates,
): Promise<string | null> {
	// Check if Google Maps API is loaded
	if (typeof google === "undefined" || !google.maps) {
		return null;
	}

	return new Promise((resolve) => {
		const geocoder = new google.maps.Geocoder();

		geocoder.geocode(
			{
				location: {
					lat: location.lat,
					lng: location.lng,
				},
			},
			(results, status) => {
				if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
					resolve(results[0].formatted_address);
				} else {
					resolve(null);
				}
			},
		);
	});
}
