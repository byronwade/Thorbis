/**
 * Google Geocoding API Utility
 *
 * Automatically acquires GPS coordinates (lat/lon) from addresses
 * Used during customer creation, property creation, and company onboarding
 */

type GeocodeResult = {
	lat: number;
	lon: number;
	formattedAddress?: string;
};

type GeocodeResponse = {
	success: boolean;
	coordinates?: GeocodeResult;
	error?: string;
};

/**
 * Geocode an address to get GPS coordinates
 *
 * @param address - Street address
 * @param city - City
 * @param state - State
 * @param zipCode - ZIP code
 * @param country - Country (defaults to "USA")
 * @returns Coordinates {lat, lon} or null if geocoding fails
 */
export async function geocodeAddress(
	address: string,
	city: string,
	state: string,
	zipCode: string,
	country = "USA"
): Promise<GeocodeResponse> {
	try {
		// Build full address string
		const fullAddress = `${address}, ${city}, ${state} ${zipCode}, ${country}`;

		// Get API key from environment
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

		if (!apiKey) {
			return {
				success: false,
				error: "Geocoding API key not configured",
			};
		}

		// Call Google Geocoding API
		const encodedAddress = encodeURIComponent(fullAddress);
		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

		const response = await fetch(url);

		if (!response.ok) {
			return {
				success: false,
				error: `Geocoding failed with status ${response.status}`,
			};
		}

		const data = await response.json();

		// Check if we got results
		if (data.status === "OK" && data.results && data.results.length > 0) {
			const location = data.results[0].geometry.location;
			const formattedAddress = data.results[0].formatted_address;

			return {
				success: true,
				coordinates: {
					lat: location.lat,
					lon: location.lng,
					formattedAddress,
				},
			};
		}
		if (data.status === "ZERO_RESULTS") {
			return {
				success: false,
				error: "Address not found",
			};
		}
		return {
			success: false,
			error: data.error_message || `Geocoding failed: ${data.status}`,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown geocoding error",
		};
	}
}

/**
 * Geocode an address silently in the background
 * Does not throw errors - returns null on failure
 *
 * Useful for non-critical geocoding where we don't want to block
 * the main operation if geocoding fails
 */
export async function geocodeAddressSilent(
	address: string,
	city: string,
	state: string,
	zipCode: string,
	country = "USA"
): Promise<GeocodeResult | null> {
	try {
		const result = await geocodeAddress(address, city, state, zipCode, country);
		return result.success && result.coordinates ? result.coordinates : null;
	} catch (_error) {
		return null;
	}
}
