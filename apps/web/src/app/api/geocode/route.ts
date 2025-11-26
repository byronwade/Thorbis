/**
 * Geocoding API Route
 *
 * Converts addresses to coordinates and vice versa.
 *
 * GET /api/geocode?address=... or ?lat=...&lng=...
 * - Quick geocode/reverse geocode
 *
 * POST /api/geocode
 * - Forward geocoding with options
 * - Reverse geocoding with options
 * - Batch geocoding
 *
 * Request body (POST):
 * - action: "geocode" | "reverse" | "batch" | "coordinates" | "address"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleGeocodingService } from "@/lib/services/google-geocoding-service";

// Options schemas
const BoundsSchema = z
	.object({
		northeast: z.object({ lat: z.number(), lng: z.number() }),
		southwest: z.object({ lat: z.number(), lng: z.number() }),
	})
	.optional();

const ComponentsSchema = z
	.object({
		country: z.string().optional(),
		postalCode: z.string().optional(),
		administrativeArea: z.string().optional(),
		locality: z.string().optional(),
		route: z.string().optional(),
	})
	.optional();

const GeocodingOptionsSchema = z
	.object({
		bounds: BoundsSchema,
		region: z.string().optional(),
		components: ComponentsSchema,
		language: z.string().optional(),
	})
	.optional();

const ReverseOptionsSchema = z
	.object({
		resultTypes: z.array(z.string()).optional(),
		locationTypes: z
			.array(
				z.enum([
					"ROOFTOP",
					"RANGE_INTERPOLATED",
					"GEOMETRIC_CENTER",
					"APPROXIMATE",
				]),
			)
			.optional(),
		language: z.string().optional(),
	})
	.optional();

// Request schemas
const GeocodeRequestSchema = z.object({
	action: z.literal("geocode"),
	address: z.string().min(1),
	options: GeocodingOptionsSchema,
});

const ReverseRequestSchema = z.object({
	action: z.literal("reverse"),
	latitude: z.number(),
	longitude: z.number(),
	options: ReverseOptionsSchema,
});

const BatchRequestSchema = z.object({
	action: z.literal("batch"),
	addresses: z.array(z.string().min(1)).min(1).max(100),
	options: GeocodingOptionsSchema,
});

const CoordinatesRequestSchema = z.object({
	action: z.literal("coordinates"),
	address: z.string().min(1),
	options: GeocodingOptionsSchema,
});

const AddressRequestSchema = z.object({
	action: z.literal("address"),
	latitude: z.number(),
	longitude: z.number(),
	options: ReverseOptionsSchema,
});

const ParseRequestSchema = z.object({
	action: z.literal("parse"),
	address: z.string().min(1),
	options: GeocodingOptionsSchema,
});

const GeocodingRequestSchema = z.discriminatedUnion("action", [
	GeocodeRequestSchema,
	ReverseRequestSchema,
	BatchRequestSchema,
	CoordinatesRequestSchema,
	AddressRequestSchema,
	ParseRequestSchema,
]);

export async function GET(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if service is configured
		if (!googleGeocodingService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Geocoding service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const address = searchParams.get("address");
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const region = searchParams.get("region");

		// Forward geocoding
		if (address) {
			const result = await googleGeocodingService.geocodeSingle(address, {
				region: region || undefined,
			});

			if (!result) {
				return NextResponse.json(
					{ error: "Could not geocode address" },
					{ status: 404 },
				);
			}

			return NextResponse.json({
				success: true,
				data: result,
			});
		}

		// Reverse geocoding
		if (lat && lng) {
			const result = await googleGeocodingService.reverseGeocodeSingle(
				Number.parseFloat(lat),
				Number.parseFloat(lng),
			);

			if (!result) {
				return NextResponse.json(
					{ error: "Could not reverse geocode location" },
					{ status: 404 },
				);
			}

			return NextResponse.json({
				success: true,
				data: result,
			});
		}

		return NextResponse.json(
			{ error: "Either address or lat/lng parameters required" },
			{ status: 400 },
		);
	} catch (error) {
		console.error("Geocoding GET error:", error);

		return NextResponse.json(
			{
				error: "Failed to geocode",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if service is configured
		if (!googleGeocodingService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Geocoding service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = GeocodingRequestSchema.parse(body);

		switch (validatedData.action) {
			case "geocode": {
				const results = await googleGeocodingService.geocode(
					validatedData.address,
					validatedData.options || {},
				);

				if (!results) {
					return NextResponse.json(
						{ error: "Geocoding failed" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						results,
						count: results.length,
					},
				});
			}

			case "reverse": {
				const results = await googleGeocodingService.reverseGeocode(
					validatedData.latitude,
					validatedData.longitude,
					validatedData.options || {},
				);

				if (!results) {
					return NextResponse.json(
						{ error: "Reverse geocoding failed" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						results,
						count: results.length,
					},
				});
			}

			case "batch": {
				const results = await googleGeocodingService.batchGeocode(
					validatedData.addresses,
					validatedData.options || {},
				);

				const output: Record<string, unknown> = {};
				results.forEach((result, address) => {
					output[address] = result;
				});

				return NextResponse.json({
					success: true,
					data: {
						results: output,
						count: results.size,
						successful: Array.from(results.values()).filter((v) => v !== null)
							.length,
					},
				});
			}

			case "coordinates": {
				const coords = await googleGeocodingService.getCoordinates(
					validatedData.address,
					validatedData.options || {},
				);

				if (!coords) {
					return NextResponse.json(
						{ error: "Could not get coordinates for address" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: coords,
				});
			}

			case "address": {
				const address = await googleGeocodingService.getAddress(
					validatedData.latitude,
					validatedData.longitude,
					validatedData.options || {},
				);

				if (!address) {
					return NextResponse.json(
						{ error: "Could not get address for coordinates" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { address },
				});
			}

			case "parse": {
				const parsed = await googleGeocodingService.geocodeAndParse(
					validatedData.address,
					validatedData.options || {},
				);

				if (!parsed) {
					return NextResponse.json(
						{ error: "Could not geocode and parse address" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: parsed,
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Geocoding API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Invalid request data",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process geocoding request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
