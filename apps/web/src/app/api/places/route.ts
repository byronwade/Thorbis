/**
 * Google Places API Route
 *
 * Provides address autocomplete and place details.
 *
 * GET /api/places?input=...&types=address
 * - Get autocomplete suggestions
 *
 * POST /api/places
 * - Get place details or parse address
 *
 * Request body (POST):
 * - action: "autocomplete" | "details" | "parse" | "suppliers"
 * - input: Search query (for autocomplete)
 * - placeId: Place ID (for details/parse)
 * - location: { lat, lon, radius } (for location bias)
 * - types: Array of place types
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googlePlacesService } from "@/lib/services/google-places-service";

// Request validation schemas
const AutocompleteRequestSchema = z.object({
	action: z.literal("autocomplete"),
	input: z.string().min(2),
	types: z.array(z.string()).optional(),
	locationBias: z
		.object({
			lat: z.number(),
			lon: z.number(),
			radius: z.number().optional(),
		})
		.optional(),
	components: z.string().optional(),
});

const DetailsRequestSchema = z.object({
	action: z.literal("details"),
	placeId: z.string(),
});

const ParseRequestSchema = z.object({
	action: z.literal("parse"),
	placeId: z.string(),
});

const AddressFromInputRequestSchema = z.object({
	action: z.literal("address"),
	input: z.string().min(2),
	types: z.array(z.string()).optional(),
	locationBias: z
		.object({
			lat: z.number(),
			lon: z.number(),
			radius: z.number().optional(),
		})
		.optional(),
	components: z.string().optional(),
});

const SuppliersRequestSchema = z.object({
	action: z.literal("suppliers"),
	lat: z.number(),
	lon: z.number(),
	radius: z.number().optional(),
});

const PlacesRequestSchema = z.discriminatedUnion("action", [
	AutocompleteRequestSchema,
	DetailsRequestSchema,
	ParseRequestSchema,
	AddressFromInputRequestSchema,
	SuppliersRequestSchema,
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
		if (!googlePlacesService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Places service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const input = searchParams.get("input");
		const types = searchParams.get("types")?.split(",");
		const lat = searchParams.get("lat");
		const lon = searchParams.get("lon");
		const radius = searchParams.get("radius");
		const components = searchParams.get("components");

		if (!input) {
			return NextResponse.json(
				{ error: "Input parameter required" },
				{ status: 400 },
			);
		}

		const options: {
			types?: string[];
			locationBias?: { lat: number; lon: number; radius?: number };
			components?: string;
		} = {};

		if (types && types.length > 0) {
			options.types = types;
		}

		if (lat && lon) {
			options.locationBias = {
				lat: Number.parseFloat(lat),
				lon: Number.parseFloat(lon),
				radius: radius ? Number.parseInt(radius) : undefined,
			};
		}

		if (components) {
			options.components = components;
		}

		const predictions = await googlePlacesService.getAutocomplete(
			input,
			options,
		);

		return NextResponse.json({
			success: true,
			data: {
				predictions,
				count: predictions.length,
			},
		});
	} catch (error) {
		console.error("Places autocomplete error:", error);

		return NextResponse.json(
			{
				error: "Failed to get autocomplete suggestions",
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
		if (!googlePlacesService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Places service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = PlacesRequestSchema.parse(body);

		switch (validatedData.action) {
			case "autocomplete": {
				const predictions = await googlePlacesService.getAutocomplete(
					validatedData.input,
					{
						types: validatedData.types,
						locationBias: validatedData.locationBias,
						components: validatedData.components,
					},
				);

				return NextResponse.json({
					success: true,
					data: {
						predictions,
						count: predictions.length,
					},
				});
			}

			case "details": {
				const details = await googlePlacesService.getPlaceDetails(
					validatedData.placeId,
				);

				if (!details) {
					return NextResponse.json(
						{ error: "Place not found or details unavailable" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: details,
				});
			}

			case "parse": {
				const details = await googlePlacesService.getPlaceDetails(
					validatedData.placeId,
				);

				if (!details) {
					return NextResponse.json(
						{ error: "Place not found or details unavailable" },
						{ status: 404 },
					);
				}

				const parsedAddress = googlePlacesService.parseAddress(details);

				return NextResponse.json({
					success: true,
					data: parsedAddress,
				});
			}

			case "address": {
				const address = await googlePlacesService.getAddressFromInput(
					validatedData.input,
					{
						types: validatedData.types,
						locationBias: validatedData.locationBias,
						components: validatedData.components,
					},
				);

				if (!address) {
					return NextResponse.json(
						{ error: "Could not resolve address" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: address,
				});
			}

			case "suppliers": {
				const suppliers = await googlePlacesService.findNearbySuppliers(
					validatedData.lat,
					validatedData.lon,
					validatedData.radius,
				);

				if (!suppliers) {
					return NextResponse.json(
						{ error: "Could not fetch nearby suppliers" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: suppliers,
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Places API error:", error);

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
				error: "Failed to process places request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
