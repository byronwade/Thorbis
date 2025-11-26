/**
 * Maps Static API Route
 *
 * Generates static map images.
 *
 * POST /api/maps-static
 * - action: "generate" | "property" | "route" | "service-area" | "multi" | "thumbnail"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleMapsStaticService } from "@/lib/services/google-maps-static-service";

const LocationSchema = z.union([
	z.string(),
	z.object({ lat: z.number(), lng: z.number() }),
]);

const SizeSchema = z.object({
	width: z.number().min(1).max(640),
	height: z.number().min(1).max(640),
});

const MarkerSchema = z.object({
	location: LocationSchema,
	color: z.string().optional(),
	label: z.string().optional(),
	size: z.enum(["tiny", "small", "mid"]).optional(),
	icon: z.string().optional(),
});

const GenerateRequestSchema = z.object({
	action: z.literal("generate"),
	center: LocationSchema.optional(),
	zoom: z.number().min(0).max(21).optional(),
	size: SizeSchema,
	scale: z.union([z.literal(1), z.literal(2), z.literal(4)]).optional(),
	maptype: z.enum(["roadmap", "satellite", "terrain", "hybrid"]).optional(),
	markers: z.array(MarkerSchema).optional(),
});

const PropertyRequestSchema = z.object({
	action: z.literal("property"),
	address: z.string(),
	coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
	size: SizeSchema.optional(),
	zoom: z.number().optional(),
	maptype: z.enum(["roadmap", "satellite", "terrain", "hybrid"]).optional(),
	showMarker: z.boolean().optional(),
	markerColor: z.string().optional(),
});

const RouteRequestSchema = z.object({
	action: z.literal("route"),
	origin: LocationSchema,
	destination: LocationSchema,
	waypoints: z.array(LocationSchema).optional(),
	size: SizeSchema.optional(),
	pathColor: z.string().optional(),
	pathWeight: z.number().optional(),
	showMarkers: z.boolean().optional(),
});

const ServiceAreaRequestSchema = z.object({
	action: z.literal("service-area"),
	center: LocationSchema,
	radius: z.number().optional(),
	size: SizeSchema.optional(),
	fillColor: z.string().optional(),
	borderColor: z.string().optional(),
	zoom: z.number().optional(),
});

const MultiRequestSchema = z.object({
	action: z.literal("multi"),
	locations: z.array(
		z.object({
			location: LocationSchema,
			label: z.string().optional(),
			color: z.string().optional(),
		}),
	),
	size: SizeSchema.optional(),
	maptype: z.enum(["roadmap", "satellite", "terrain", "hybrid"]).optional(),
});

const ThumbnailRequestSchema = z.object({
	action: z.literal("thumbnail"),
	location: LocationSchema,
	size: SizeSchema.optional(),
	zoom: z.number().optional(),
});

const JobRouteRequestSchema = z.object({
	action: z.literal("job-route"),
	stops: z
		.array(
			z.object({
				address: z.string(),
				jobNumber: z.string().optional(),
			}),
		)
		.min(2),
	size: SizeSchema.optional(),
	pathColor: z.string().optional(),
});

const DarkModeRequestSchema = z.object({
	action: z.literal("dark-mode"),
	location: LocationSchema,
	size: SizeSchema.optional(),
	zoom: z.number().optional(),
});

const MapsStaticRequestSchema = z.discriminatedUnion("action", [
	GenerateRequestSchema,
	PropertyRequestSchema,
	RouteRequestSchema,
	ServiceAreaRequestSchema,
	MultiRequestSchema,
	ThumbnailRequestSchema,
	JobRouteRequestSchema,
	DarkModeRequestSchema,
]);

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!googleMapsStaticService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Maps Static service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = MapsStaticRequestSchema.parse(body);

		switch (validatedData.action) {
			case "generate": {
				const result = googleMapsStaticService.generateMapUrl({
					center: validatedData.center,
					zoom: validatedData.zoom,
					size: validatedData.size,
					scale: validatedData.scale,
					maptype: validatedData.maptype,
					markers: validatedData.markers,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate map URL" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "property": {
				const result = googleMapsStaticService.getPropertyMap({
					address: validatedData.address,
					coordinates: validatedData.coordinates,
					size: validatedData.size,
					zoom: validatedData.zoom,
					maptype: validatedData.maptype,
					showMarker: validatedData.showMarker,
					markerColor: validatedData.markerColor,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate property map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "route": {
				const result = googleMapsStaticService.getRouteMap({
					origin: validatedData.origin,
					destination: validatedData.destination,
					waypoints: validatedData.waypoints,
					size: validatedData.size,
					pathColor: validatedData.pathColor,
					pathWeight: validatedData.pathWeight,
					showMarkers: validatedData.showMarkers,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate route map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "service-area": {
				const result = googleMapsStaticService.getServiceAreaMap({
					center: validatedData.center,
					radius: validatedData.radius,
					size: validatedData.size,
					fillColor: validatedData.fillColor,
					borderColor: validatedData.borderColor,
					zoom: validatedData.zoom,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate service area map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "multi": {
				const result = googleMapsStaticService.getMultiLocationMap(
					validatedData.locations,
					{
						size: validatedData.size,
						maptype: validatedData.maptype,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate multi-location map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "thumbnail": {
				const result = googleMapsStaticService.getThumbnailMap(
					validatedData.location,
					{
						size: validatedData.size,
						zoom: validatedData.zoom,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate thumbnail map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "job-route": {
				const result = googleMapsStaticService.getJobRouteMap(
					validatedData.stops,
					{
						size: validatedData.size,
						pathColor: validatedData.pathColor,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate job route map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "dark-mode": {
				const result = googleMapsStaticService.getDarkModeMap(
					validatedData.location,
					{
						size: validatedData.size,
						zoom: validatedData.zoom,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate dark mode map" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Maps Static API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process maps static request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
