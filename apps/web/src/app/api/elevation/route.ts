/**
 * Elevation API Route
 *
 * Gets elevation data for locations.
 *
 * GET /api/elevation?lat=...&lng=...
 * - Quick elevation lookup
 *
 * POST /api/elevation
 * - Multiple point elevations
 * - Elevation profiles along paths
 * - Property elevation analysis
 *
 * Request body (POST):
 * - action: "single" | "multiple" | "profile" | "property"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleElevationService } from "@/lib/services/google-elevation-service";

// Location schema
const LocationSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

// Request schemas
const SingleRequestSchema = z.object({
	action: z.literal("single"),
	location: LocationSchema,
});

const MultipleRequestSchema = z.object({
	action: z.literal("multiple"),
	locations: z.array(LocationSchema).min(1).max(512),
});

const ProfileRequestSchema = z.object({
	action: z.literal("profile"),
	path: z.array(LocationSchema).min(2).max(512),
	samples: z.number().min(2).max(512).optional(),
});

const PropertyRequestSchema = z.object({
	action: z.literal("property"),
	location: LocationSchema,
	radiusMeters: z.number().min(10).max(500).optional(),
});

const ElevationRequestSchema = z.discriminatedUnion("action", [
	SingleRequestSchema,
	MultipleRequestSchema,
	ProfileRequestSchema,
	PropertyRequestSchema,
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
		if (!googleElevationService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Elevation service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");

		if (!lat || !lng) {
			return NextResponse.json(
				{ error: "lat and lng parameters required" },
				{ status: 400 },
			);
		}

		const elevation = await googleElevationService.getElevation({
			latitude: Number.parseFloat(lat),
			longitude: Number.parseFloat(lng),
		});

		if (!elevation) {
			return NextResponse.json(
				{ error: "Could not get elevation for location" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: elevation,
		});
	} catch (error) {
		console.error("Elevation GET error:", error);

		return NextResponse.json(
			{
				error: "Failed to get elevation",
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
		if (!googleElevationService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Elevation service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = ElevationRequestSchema.parse(body);

		switch (validatedData.action) {
			case "single": {
				const elevation = await googleElevationService.getElevation(
					validatedData.location,
				);

				if (!elevation) {
					return NextResponse.json(
						{ error: "Could not get elevation for location" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: elevation,
				});
			}

			case "multiple": {
				const elevations = await googleElevationService.getElevations(
					validatedData.locations,
				);

				if (!elevations) {
					return NextResponse.json(
						{ error: "Could not get elevations for locations" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						elevations,
						count: elevations.length,
					},
				});
			}

			case "profile": {
				const profile = await googleElevationService.getElevationProfile(
					validatedData.path,
					validatedData.samples,
				);

				if (!profile) {
					return NextResponse.json(
						{ error: "Could not get elevation profile" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: profile,
				});
			}

			case "property": {
				const analysis = await googleElevationService.analyzePropertyElevation(
					validatedData.location,
					validatedData.radiusMeters,
				);

				if (!analysis) {
					return NextResponse.json(
						{ error: "Could not analyze property elevation" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: analysis,
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Elevation API error:", error);

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
				error: "Failed to process elevation request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
