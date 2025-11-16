/**
 * Travel Time API Route
 *
 * Fetches real-time travel time from shop to job address using Google Distance Matrix API
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const METERS_TO_MILES = 0.000_621_371;
const FALLBACK_SHOP_ADDRESS = {
	address: "121 E Marietta St",
	city: "Canton",
	state: "GA",
	zip_code: "30114",
};

function validateDestination(
	destinationAddress: string | null,
	destinationLat: string | null,
	destinationLon: string | null
): { valid: boolean; error?: string } {
	const hasAddress = Boolean(destinationAddress);
	const hasCoordinates = Boolean(destinationLat) && Boolean(destinationLon);
	const isValid = hasAddress || hasCoordinates;

	if (!isValid) {
		return {
			valid: false,
			error: "Destination address or coordinates required",
		};
	}

	return { valid: true };
}

async function getCompanySettings(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, companyId: string) {
	if (!supabase) {
		return null;
	}
	const { data: companySettings } = await supabase
		.from("company_settings")
		.select("address, city, state, zip_code")
		.eq("company_id", companyId)
		.single();

	return companySettings;
}

async function getAuthenticatedUser(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
}

async function getUserCompany(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, userId: string) {
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", userId)
		.eq("status", "active")
		.single();

	return teamMember;
}

async function resolveOriginAddress(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, userId: string) {
	const teamMember = await getUserCompany(supabase, userId);

	if (!teamMember?.company_id) {
		return buildOriginAddress(FALLBACK_SHOP_ADDRESS);
	}

	const companySettings = await getCompanySettings(supabase, teamMember.company_id);
	const hasShopAddress = companySettings?.address && companySettings?.city && companySettings?.state;

	if (!hasShopAddress) {
		return buildOriginAddress(FALLBACK_SHOP_ADDRESS);
	}

	return buildOriginAddress(companySettings);
}

type DistanceMatrixElement = {
	status: string;
	duration: { value: number; text: string };
	duration_in_traffic?: { value: number; text: string };
	distance: { value: number; text: string };
};

type DistanceMatrixResponse = {
	status: string;
	rows: Array<{
		elements: DistanceMatrixElement[];
	}>;
	error_message?: string;
};

function processDistanceMatrixResponse(data: DistanceMatrixResponse, originAddress: string, destAddress: string) {
	const element = data.rows[0].elements[0];

	if (element.status !== "OK") {
		return {
			error: `Route calculation failed: ${element.status}`,
			status: 400,
		};
	}

	const durationInSeconds = element.duration_in_traffic?.value || element.duration.value;
	const distanceInMeters = element.distance.value;
	const distanceInMiles = distanceInMeters * METERS_TO_MILES;

	return {
		data: {
			duration: durationInSeconds,
			durationText: element.duration_in_traffic?.text || element.duration.text,
			distance: distanceInMiles,
			distanceText: element.distance.text,
			origin: originAddress,
			destination: destAddress,
		},
	};
}

function buildOriginAddress(companySettings: {
	address: string;
	city: string;
	state: string;
	zip_code?: string | null;
}) {
	const zipPart = companySettings.zip_code ? ` ${companySettings.zip_code}` : "";
	return `${companySettings.address}, ${companySettings.city}, ${companySettings.state}${zipPart}`.trim();
}

async function fetchDistanceMatrix(originAddress: string, destAddress: string, apiKey: string) {
	const distanceMatrixUrl = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
	distanceMatrixUrl.searchParams.set("origins", originAddress);
	distanceMatrixUrl.searchParams.set("destinations", destAddress);
	distanceMatrixUrl.searchParams.set("units", "imperial");
	distanceMatrixUrl.searchParams.set("key", apiKey);
	distanceMatrixUrl.searchParams.set("departure_time", "now");

	const response = await fetch(distanceMatrixUrl.toString());
	return response;
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const destinationAddress = searchParams.get("destination");
		const destinationLat = searchParams.get("destinationLat");
		const destinationLon = searchParams.get("destinationLon");

		const validation = validateDestination(destinationAddress, destinationLat, destinationLon);
		if (!validation.valid) {
			return NextResponse.json({ error: validation.error }, { status: 400 });
		}

		// Get authenticated user and company
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
		}

		const user = await getAuthenticatedUser(supabase);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const originAddress = await resolveOriginAddress(supabase, user.id);
		const destAddress = destinationAddress || `${destinationLat},${destinationLon}`;
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{
					error: "Travel time calculation unavailable",
					message:
						"Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.",
				},
				{ status: 503 }
			);
		}

		const response = await fetchDistanceMatrix(originAddress, destAddress, apiKey);
		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch travel time" }, { status: response.status });
		}

		const data = await response.json();
		const hasValidData = data.status === "OK" && data.rows?.[0]?.elements?.[0];

		if (!hasValidData) {
			return NextResponse.json({ error: data.error_message || "Failed to calculate travel time" }, { status: 400 });
		}

		const result = processDistanceMatrixResponse(data, originAddress, destAddress);
		if (result.error) {
			return NextResponse.json({ error: result.error }, { status: result.status });
		}

		return NextResponse.json(result.data);
	} catch (error) {
    console.error("Error:", error);
		return NextResponse.json(
			{
				error: "Failed to calculate travel time",
				message: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}
