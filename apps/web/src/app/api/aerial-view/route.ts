/**
 * Aerial View API Route
 *
 * Provides aerial (bird's eye) video of properties.
 *
 * POST /api/aerial-view
 * - action: "lookup" | "render" | "status" | "property"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleAerialViewService } from "@/lib/services/google-aerial-view-service";

const LocationSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	address: z.string().optional(),
});

const LookupRequestSchema = z.object({
	action: z.literal("lookup"),
	location: LocationSchema,
});

const RenderRequestSchema = z.object({
	action: z.literal("render"),
	location: LocationSchema,
});

const StatusRequestSchema = z.object({
	action: z.literal("status"),
	videoId: z.string(),
});

const PropertyRequestSchema = z.object({
	action: z.literal("property"),
	location: LocationSchema,
	renderIfMissing: z.boolean().optional(),
});

const BatchRequestSchema = z.object({
	action: z.literal("batch"),
	locations: z.array(LocationSchema).min(1).max(50),
});

const AerialViewRequestSchema = z.discriminatedUnion("action", [
	LookupRequestSchema,
	RenderRequestSchema,
	StatusRequestSchema,
	PropertyRequestSchema,
	BatchRequestSchema,
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

		if (!googleAerialViewService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Aerial View service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = AerialViewRequestSchema.parse(body);

		switch (validatedData.action) {
			case "lookup": {
				const result = await googleAerialViewService.lookupVideo(
					validatedData.location,
				);
				return NextResponse.json({ success: true, data: result });
			}

			case "render": {
				const result = await googleAerialViewService.renderVideo(
					validatedData.location,
				);
				return NextResponse.json({ success: true, data: result });
			}

			case "status": {
				const result = await googleAerialViewService.checkRenderStatus(
					validatedData.videoId,
				);
				return NextResponse.json({ success: true, data: result });
			}

			case "property": {
				const result = await googleAerialViewService.getPropertyAerialView(
					validatedData.location,
					{ renderIfMissing: validatedData.renderIfMissing },
				);
				return NextResponse.json({ success: true, data: result });
			}

			case "batch": {
				const results = await googleAerialViewService.batchLookup(
					validatedData.locations,
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
		console.error("Aerial View API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process aerial view request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
