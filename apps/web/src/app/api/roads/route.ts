/**
 * Roads API Route
 *
 * Provides road-following and speed limit data.
 *
 * POST /api/roads
 * - action: "snap" | "speed-limits" | "nearest" | "analyze" | "track"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleRoadsService } from "@/lib/services/google-roads-service";

const LatLngSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const SnapRequestSchema = z.object({
	action: z.literal("snap"),
	path: z.array(LatLngSchema).min(1).max(100),
	interpolate: z.boolean().optional(),
});

const SpeedLimitsRequestSchema = z.object({
	action: z.literal("speed-limits"),
	path: z.array(LatLngSchema).min(1).max(100),
});

const SpeedLimitsByPlaceRequestSchema = z.object({
	action: z.literal("speed-limits-by-place"),
	placeIds: z.array(z.string()).min(1).max(100),
});

const NearestRequestSchema = z.object({
	action: z.literal("nearest"),
	point: LatLngSchema,
});

const AnalyzeRequestSchema = z.object({
	action: z.literal("analyze"),
	path: z.array(LatLngSchema).min(2).max(100),
});

const TrackRequestSchema = z.object({
	action: z.literal("track"),
	technicianId: z.string(),
	gpsPoints: z
		.array(
			LatLngSchema.extend({
				timestamp: z.string().optional(),
				speed: z.number().optional(),
			}),
		)
		.min(1)
		.max(500),
});

const BatchSnapRequestSchema = z.object({
	action: z.literal("batch-snap"),
	routes: z
		.array(
			z.object({
				id: z.string(),
				path: z.array(LatLngSchema).min(1).max(100),
			}),
		)
		.min(1)
		.max(10),
});

const RoadsRequestSchema = z.discriminatedUnion("action", [
	SnapRequestSchema,
	SpeedLimitsRequestSchema,
	SpeedLimitsByPlaceRequestSchema,
	NearestRequestSchema,
	AnalyzeRequestSchema,
	TrackRequestSchema,
	BatchSnapRequestSchema,
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

		if (!googleRoadsService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Roads service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = RoadsRequestSchema.parse(body);

		switch (validatedData.action) {
			case "snap": {
				const result = await googleRoadsService.snapToRoads(
					validatedData.path,
					{ interpolate: validatedData.interpolate },
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to snap to roads" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "speed-limits": {
				const result = await googleRoadsService.getSpeedLimits(
					validatedData.path,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to get speed limits" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "speed-limits-by-place": {
				const result = await googleRoadsService.getSpeedLimitsByPlaceIds(
					validatedData.placeIds,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to get speed limits by place" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "nearest": {
				const result = await googleRoadsService.getNearestRoad(
					validatedData.point,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to find nearest road" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "analyze": {
				const result = await googleRoadsService.analyzeRoute(
					validatedData.path,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to analyze route" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "track": {
				const result = await googleRoadsService.trackTechnicianRoute(
					validatedData.technicianId,
					validatedData.gpsPoints,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to track technician route" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "batch-snap": {
				const results = await googleRoadsService.batchSnapRoutes(
					validatedData.routes,
				);
				const output: Record<string, unknown> = {};
				results.forEach((value, key) => {
					output[key] = value;
				});

				return NextResponse.json({
					success: true,
					data: {
						results: output,
						count: results.size,
					},
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Roads API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process roads request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
