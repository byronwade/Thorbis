/**
 * Street View API Route
 *
 * Provides street-level imagery for properties and job locations.
 *
 * GET /api/street-view?address=...
 * - Quick image URL for an address
 *
 * POST /api/street-view
 * - Check availability
 * - Get image with options
 * - Get property imagery with multiple angles
 *
 * Request body (POST):
 * - action: "check" | "image" | "property" | "batch"
 * - location: { address?, latitude?, longitude?, panoId? }
 * - options: { size, camera, radius, source }
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	googleStreetViewService,
	type StreetViewLocation,
} from "@/lib/services/google-street-view-service";

// Location schema
const LocationSchema = z
	.object({
		address: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		panoId: z.string().optional(),
	})
	.refine(
		(loc) =>
			loc.address ||
			(loc.latitude !== undefined && loc.longitude !== undefined) ||
			loc.panoId,
		{ message: "Location must have address, coordinates, or panoId" },
	);

// Image size schema
const SizeSchema = z
	.object({
		width: z.number().min(1).max(2048).default(640),
		height: z.number().min(1).max(2048).default(480),
	})
	.optional();

// Camera options schema
const CameraSchema = z
	.object({
		heading: z.number().min(0).max(360).optional(),
		pitch: z.number().min(-90).max(90).optional(),
		fov: z.number().min(10).max(120).optional(),
	})
	.optional();

// Request schemas
const CheckRequestSchema = z.object({
	action: z.literal("check"),
	location: LocationSchema,
});

const ImageRequestSchema = z.object({
	action: z.literal("image"),
	location: LocationSchema,
	size: SizeSchema,
	camera: CameraSchema,
	radius: z.number().optional(),
	source: z.enum(["default", "outdoor"]).optional(),
});

const PropertyRequestSchema = z.object({
	action: z.literal("property"),
	address: z.string(),
	size: SizeSchema,
	includeAngles: z.boolean().optional(),
});

const PropertyWithHeadingRequestSchema = z.object({
	action: z.literal("property_heading"),
	latitude: z.number(),
	longitude: z.number(),
	size: SizeSchema,
	searchRadius: z.number().optional(),
});

const BatchCheckRequestSchema = z.object({
	action: z.literal("batch"),
	locations: z.array(LocationSchema).min(1).max(50),
});

const StreetViewRequestSchema = z.discriminatedUnion("action", [
	CheckRequestSchema,
	ImageRequestSchema,
	PropertyRequestSchema,
	PropertyWithHeadingRequestSchema,
	BatchCheckRequestSchema,
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
		if (!googleStreetViewService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Street View service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const address = searchParams.get("address");
		const lat = searchParams.get("lat");
		const lon = searchParams.get("lon");
		const panoId = searchParams.get("panoId");
		const width = searchParams.get("width");
		const height = searchParams.get("height");
		const heading = searchParams.get("heading");
		const thumbnail = searchParams.get("thumbnail");

		// Build location
		const location: StreetViewLocation = {};
		if (panoId) {
			location.panoId = panoId;
		} else if (lat && lon) {
			location.latitude = Number.parseFloat(lat);
			location.longitude = Number.parseFloat(lon);
		} else if (address) {
			location.address = address;
		} else {
			return NextResponse.json(
				{ error: "Address, coordinates (lat/lon), or panoId required" },
				{ status: 400 },
			);
		}

		// Check availability first
		const metadata = await googleStreetViewService.checkAvailability(location);

		if (!metadata || metadata.status !== "OK") {
			return NextResponse.json({
				success: true,
				data: {
					available: false,
					status: metadata?.status || "NOT_FOUND",
				},
			});
		}

		// Generate appropriate URL
		let imageUrl: string;
		if (thumbnail === "true") {
			imageUrl = googleStreetViewService.getThumbnailUrl(location);
		} else {
			imageUrl = googleStreetViewService.getImageUrl(location, {
				size:
					width && height
						? { width: Number.parseInt(width), height: Number.parseInt(height) }
						: undefined,
				camera: heading ? { heading: Number.parseInt(heading) } : undefined,
			});
		}

		const interactiveUrl =
			googleStreetViewService.getMapsStreetViewUrl(location);

		return NextResponse.json({
			success: true,
			data: {
				available: true,
				imageUrl,
				interactiveUrl,
				captureDate: metadata.date,
				panoId: metadata.panoId,
				location: metadata.location,
			},
		});
	} catch (error) {
		console.error("Street View GET error:", error);

		return NextResponse.json(
			{
				error: "Failed to get Street View image",
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
		if (!googleStreetViewService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Street View service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = StreetViewRequestSchema.parse(body);

		switch (validatedData.action) {
			case "check": {
				const metadata = await googleStreetViewService.checkAvailability(
					validatedData.location as StreetViewLocation,
				);

				return NextResponse.json({
					success: true,
					data: {
						available: metadata?.status === "OK",
						metadata,
					},
				});
			}

			case "image": {
				const result = await googleStreetViewService.getImage(
					validatedData.location as StreetViewLocation,
					{
						size: validatedData.size,
						camera: validatedData.camera,
						radius: validatedData.radius,
						source: validatedData.source,
					},
				);

				if (!result.available) {
					return NextResponse.json({
						success: true,
						data: {
							available: false,
							status: result.metadata?.status || "NOT_FOUND",
						},
					});
				}

				// Also generate interactive and thumbnail URLs
				const location = validatedData.location as StreetViewLocation;
				const interactiveUrl =
					googleStreetViewService.getMapsStreetViewUrl(location);
				const thumbnailUrl = googleStreetViewService.getThumbnailUrl(location);
				const highResUrl = googleStreetViewService.getHighResUrl(location);

				return NextResponse.json({
					success: true,
					data: {
						available: true,
						imageUrl: result.url,
						thumbnailUrl,
						highResUrl,
						interactiveUrl,
						metadata: result.metadata,
					},
				});
			}

			case "property": {
				const result = await googleStreetViewService.getPropertyImagery(
					validatedData.address,
					{
						size: validatedData.size,
						includeAngles: validatedData.includeAngles,
					},
				);

				return NextResponse.json({
					success: true,
					data: result,
				});
			}

			case "property_heading": {
				const result =
					await googleStreetViewService.getPropertyImageryWithHeading(
						validatedData.latitude,
						validatedData.longitude,
						{
							size: validatedData.size,
							searchRadius: validatedData.searchRadius,
						},
					);

				if (!result) {
					return NextResponse.json({
						success: true,
						data: {
							available: false,
						},
					});
				}

				return NextResponse.json({
					success: true,
					data: result,
				});
			}

			case "batch": {
				const results = await googleStreetViewService.batchCheckAvailability(
					validatedData.locations as StreetViewLocation[],
				);

				const availability: Record<string, boolean> = {};
				results.forEach((available, key) => {
					availability[key] = available;
				});

				return NextResponse.json({
					success: true,
					data: {
						availability,
						totalChecked: validatedData.locations.length,
						availableCount: Array.from(results.values()).filter((v) => v)
							.length,
					},
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Street View API error:", error);

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
				error: "Failed to process Street View request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
