/**
 * Address Validation API Route
 *
 * Validates and standardizes addresses using Google Address Validation API
 * - Replaces USPS API (sunset Jan 2026)
 * - Returns standardized address, geocode, and USPS data
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { googleAddressValidationService } from "@/lib/services/google-address-validation-service";

export async function POST(request: NextRequest) {
	// Verify authentication
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { address, structured, regionCode = "US" } = body;

		if (!address && !structured) {
			return NextResponse.json(
				{ error: "Either 'address' string or 'structured' object is required" },
				{ status: 400 },
			);
		}

		// Check service availability
		if (!googleAddressValidationService.isAvailable()) {
			return NextResponse.json(
				{ error: "Address validation service not configured" },
				{ status: 503 },
			);
		}

		let result;

		if (structured) {
			// Validate structured address
			result = await googleAddressValidationService.validateStructuredAddress({
				addressLines: structured.addressLines || [structured.address1],
				city: structured.city,
				state: structured.state,
				postalCode: structured.postalCode || structured.zip,
				regionCode,
			});
		} else {
			// Validate address string
			result = await googleAddressValidationService.validateAddress(
				address,
				regionCode,
			);
		}

		if (!result) {
			return NextResponse.json(
				{ error: "Failed to validate address" },
				{ status: 500 },
			);
		}

		// Return formatted response
		return NextResponse.json({
			// Validation status
			isValid: result.isValid,
			confidence: result.confidence,

			// Formatted addresses
			inputAddress: result.inputAddress,
			formattedAddress: result.formattedAddress,

			// Parsed components
			components: {
				addressLines: result.postalAddress.addressLines,
				city: result.postalAddress.locality,
				state: result.postalAddress.administrativeArea,
				postalCode: result.postalAddress.postalCode,
				country: result.postalAddress.regionCode,
			},

			// Geocode
			geocode: result.geocode
				? {
						lat: result.geocode.location.latitude,
						lng: result.geocode.location.longitude,
						placeId: result.geocode.placeId,
						plusCode: result.geocode.plusCode?.globalCode,
					}
				: null,

			// USPS data (US only)
			usps: result.uspsData
				? {
						standardized: result.uspsData.standardizedAddress,
						dpvConfirmation: result.uspsData.dpvConfirmation,
						deliveryPointCode: result.uspsData.deliveryPointCode,
						carrierRoute: result.uspsData.carrierRoute,
						county: result.uspsData.county,
						vacant: result.uspsData.dpvVacant === "Y",
					}
				: null,

			// Corrections and warnings
			corrections: result.corrections,
			warnings: result.warnings,

			// Full verdict for advanced use
			verdict: result.verdict,
		});
	} catch (error) {
		console.error("Address validation error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Quick validation endpoint
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const address = searchParams.get("address");
	const regionCode = searchParams.get("regionCode") || "US";

	if (!address) {
		return NextResponse.json(
			{ error: "Address parameter is required" },
			{ status: 400 },
		);
	}

	// Check service availability
	if (!googleAddressValidationService.isAvailable()) {
		return NextResponse.json(
			{ error: "Address validation service not configured" },
			{ status: 503 },
		);
	}

	const result = await googleAddressValidationService.quickValidate(
		address,
		regionCode,
	);

	return NextResponse.json(result);
}
