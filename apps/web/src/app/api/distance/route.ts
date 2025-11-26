/**
 * Distance Matrix API Route
 *
 * Calculates travel distances and times between locations.
 *
 * POST /api/distance
 * - Calculate distance matrix
 * - Find nearest location
 * - Get ETA
 * - Technician-job assignment matrix
 *
 * Request body:
 * - action: "matrix" | "single" | "nearest" | "eta" | "rank" | "assignment"
 * - origins: Array of locations
 * - destinations: Array of locations
 * - options: Travel mode, traffic, etc.
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	type DistanceMatrixOptions,
	googleDistanceMatrixService,
	type Location,
} from "@/lib/services/google-distance-matrix-service";

// Location schema
const LocationSchema = z
	.object({
		address: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		placeId: z.string().optional(),
	})
	.refine(
		(loc) =>
			loc.address ||
			(loc.latitude !== undefined && loc.longitude !== undefined) ||
			loc.placeId,
		{ message: "Location must have address, coordinates, or placeId" },
	);

// Options schema
const OptionsSchema = z
	.object({
		mode: z.enum(["driving", "walking", "bicycling", "transit"]).optional(),
		departureTime: z.string().optional(), // ISO string or "now"
		arrivalTime: z.string().optional(),
		trafficModel: z
			.enum(["best_guess", "pessimistic", "optimistic"])
			.optional(),
		avoidTolls: z.boolean().optional(),
		avoidHighways: z.boolean().optional(),
		avoidFerries: z.boolean().optional(),
		units: z.enum(["metric", "imperial"]).optional(),
	})
	.optional();

// Request schemas
const MatrixRequestSchema = z.object({
	action: z.literal("matrix"),
	origins: z.array(LocationSchema).min(1).max(25),
	destinations: z.array(LocationSchema).min(1).max(25),
	options: OptionsSchema,
});

const SingleRequestSchema = z.object({
	action: z.literal("single"),
	origin: LocationSchema,
	destination: LocationSchema,
	options: OptionsSchema,
});

const NearestDestinationSchema = z.object({
	action: z.literal("nearest_destination"),
	origin: LocationSchema,
	destinations: z.array(LocationSchema).min(1).max(25),
	options: OptionsSchema,
});

const NearestOriginSchema = z.object({
	action: z.literal("nearest_origin"),
	origins: z.array(LocationSchema).min(1).max(25),
	destination: LocationSchema,
	options: OptionsSchema,
});

const ETARequestSchema = z.object({
	action: z.literal("eta"),
	origin: LocationSchema,
	destination: LocationSchema,
	options: OptionsSchema,
});

const RankRequestSchema = z.object({
	action: z.literal("rank"),
	origin: LocationSchema,
	destinations: z.array(LocationSchema).min(1).max(25),
	options: OptionsSchema,
});

const AssignmentRequestSchema = z.object({
	action: z.literal("assignment"),
	technicians: z
		.array(
			z.object({
				id: z.string(),
				location: LocationSchema,
			}),
		)
		.min(1)
		.max(25),
	jobs: z
		.array(
			z.object({
				id: z.string(),
				location: LocationSchema,
			}),
		)
		.min(1)
		.max(25),
	options: OptionsSchema,
});

const DistanceRequestSchema = z.discriminatedUnion("action", [
	MatrixRequestSchema,
	SingleRequestSchema,
	NearestDestinationSchema,
	NearestOriginSchema,
	ETARequestSchema,
	RankRequestSchema,
	AssignmentRequestSchema,
]);

/**
 * Parse options from request
 */
function parseOptions(
	options?: z.infer<typeof OptionsSchema>,
): DistanceMatrixOptions {
	if (!options) return {};

	const parsed: DistanceMatrixOptions = {
		mode: options.mode,
		trafficModel: options.trafficModel,
		avoidTolls: options.avoidTolls,
		avoidHighways: options.avoidHighways,
		avoidFerries: options.avoidFerries,
		units: options.units,
	};

	if (options.departureTime) {
		parsed.departureTime =
			options.departureTime === "now" ? "now" : new Date(options.departureTime);
	}

	if (options.arrivalTime) {
		parsed.arrivalTime = new Date(options.arrivalTime);
	}

	return parsed;
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
		if (!googleDistanceMatrixService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Distance Matrix service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = DistanceRequestSchema.parse(body);

		switch (validatedData.action) {
			case "matrix": {
				const result = await googleDistanceMatrixService.getDistanceMatrix(
					validatedData.origins as Location[],
					validatedData.destinations as Location[],
					parseOptions(validatedData.options),
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to calculate distance matrix" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						...result,
						fetchedAt: result.fetchedAt.toISOString(),
					},
				});
			}

			case "single": {
				const result = await googleDistanceMatrixService.getDistance(
					validatedData.origin as Location,
					validatedData.destination as Location,
					parseOptions(validatedData.options),
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to calculate distance" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: result,
				});
			}

			case "nearest_destination": {
				const result = await googleDistanceMatrixService.findNearestDestination(
					validatedData.origin as Location,
					validatedData.destinations as Location[],
					parseOptions(validatedData.options),
				);

				if (!result) {
					return NextResponse.json(
						{ error: "No reachable destinations found" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: result,
				});
			}

			case "nearest_origin": {
				const result = await googleDistanceMatrixService.findNearestOrigin(
					validatedData.origins as Location[],
					validatedData.destination as Location,
					parseOptions(validatedData.options),
				);

				if (!result) {
					return NextResponse.json(
						{ error: "No reachable origins found" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: result,
				});
			}

			case "eta": {
				const result = await googleDistanceMatrixService.calculateETA(
					validatedData.origin as Location,
					validatedData.destination as Location,
					parseOptions(validatedData.options),
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to calculate ETA" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						...result,
						eta: result.eta.toISOString(),
					},
				});
			}

			case "rank": {
				const result = await googleDistanceMatrixService.rankDestinationsByTime(
					validatedData.origin as Location,
					validatedData.destinations as Location[],
					parseOptions(validatedData.options),
				);

				return NextResponse.json({
					success: true,
					data: {
						ranked: result,
						count: result.length,
					},
				});
			}

			case "assignment": {
				const result = await googleDistanceMatrixService.getTechnicianJobMatrix(
					validatedData.technicians.map((t) => ({
						id: t.id,
						location: t.location as Location,
					})),
					validatedData.jobs.map((j) => ({
						id: j.id,
						location: j.location as Location,
					})),
					parseOptions(validatedData.options),
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to calculate assignment matrix" },
						{ status: 500 },
					);
				}

				// Also find optimal assignments (greedy approach)
				const assignments: Array<{
					technicianId: string;
					jobId: string;
					durationSeconds: number;
				}> = [];
				const assignedJobs = new Set<number>();
				const assignedTechs = new Set<number>();

				// Simple greedy assignment - assign closest pairs first
				const allPairs: Array<{
					techIdx: number;
					jobIdx: number;
					duration: number;
				}> = [];
				for (let t = 0; t < result.durations.length; t++) {
					for (let j = 0; j < result.durations[t].length; j++) {
						allPairs.push({
							techIdx: t,
							jobIdx: j,
							duration: result.durations[t][j],
						});
					}
				}
				allPairs.sort((a, b) => a.duration - b.duration);

				for (const pair of allPairs) {
					if (
						!assignedTechs.has(pair.techIdx) &&
						!assignedJobs.has(pair.jobIdx)
					) {
						assignments.push({
							technicianId: result.technicianIds[pair.techIdx],
							jobId: result.jobIds[pair.jobIdx],
							durationSeconds: pair.duration,
						});
						assignedTechs.add(pair.techIdx);
						assignedJobs.add(pair.jobIdx);
					}
				}

				return NextResponse.json({
					success: true,
					data: {
						matrix: result,
						suggestedAssignments: assignments,
						unassignedJobs: result.jobIds.filter(
							(_, idx) => !assignedJobs.has(idx),
						),
						unassignedTechnicians: result.technicianIds.filter(
							(_, idx) => !assignedTechs.has(idx),
						),
					},
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Distance Matrix API error:", error);

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
				error: "Failed to process distance request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
