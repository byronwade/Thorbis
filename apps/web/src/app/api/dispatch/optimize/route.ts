/**
 * Route Optimization API Route
 *
 * Optimizes routes for technicians using Google Cloud Route Optimization API.
 *
 * POST /api/dispatch/optimize
 * - Optimize routes for multiple jobs and technicians
 * - Returns optimized job sequences and travel times
 *
 * Request body:
 * - jobs: Array of jobs with id, name, location, duration, timeWindow
 * - technicians: Array of technicians with id, name, startLocation, workday
 * - options: { considerTraffic, includePolylines }
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	googleRouteOptimizationService,
	type OptimizationJob,
	type OptimizationTechnician,
} from "@/lib/services/google-route-optimization-service";

// Request validation schemas
const LocationSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const JobSchema = z.object({
	id: z.string(),
	name: z.string(),
	address: z.string().optional().default(""),
	location: LocationSchema,
	duration: z.number().min(1), // minutes
	timeWindowStart: z.string().datetime().optional(),
	timeWindowEnd: z.string().datetime().optional(),
	priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
	requiredSkills: z.array(z.string()).optional(),
	loadRequirements: z.record(z.number()).optional(),
});

const TechnicianSchema = z.object({
	id: z.string(),
	name: z.string(),
	startLocation: LocationSchema,
	endLocation: LocationSchema.optional(),
	workdayStart: z.string().datetime(),
	workdayEnd: z.string().datetime(),
	skills: z.array(z.string()).optional(),
	vehicleCapacity: z.record(z.number()).optional(),
	breakTime: z
		.object({
			earliestStart: z.string().datetime(),
			latestStart: z.string().datetime(),
			duration: z.number(), // minutes
		})
		.optional(),
});

const OptimizeRequestSchema = z.object({
	jobs: z.array(JobSchema).min(1),
	technicians: z.array(TechnicianSchema).min(1),
	options: z
		.object({
			considerTraffic: z.boolean().optional(),
			includePolylines: z.boolean().optional(),
			workdayStart: z.string().datetime().optional(),
			workdayEnd: z.string().datetime().optional(),
		})
		.optional(),
});

const SequenceRequestSchema = z.object({
	jobs: z.array(JobSchema).min(1),
	startLocation: LocationSchema,
	endLocation: LocationSchema.optional(),
});

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
		if (!googleRouteOptimizationService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Route Optimization service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const { searchParams } = new URL(request.url);
		const action = searchParams.get("action");

		// Handle sequence-only request
		if (action === "sequence") {
			const validatedData = SequenceRequestSchema.parse(body);

			const jobs: OptimizationJob[] = validatedData.jobs.map((job) => ({
				...job,
				timeWindowStart: job.timeWindowStart
					? new Date(job.timeWindowStart)
					: undefined,
				timeWindowEnd: job.timeWindowEnd
					? new Date(job.timeWindowEnd)
					: undefined,
			}));

			const result = await googleRouteOptimizationService.getOptimalJobSequence(
				jobs,
				validatedData.startLocation,
				validatedData.endLocation,
			);

			return NextResponse.json({
				success: true,
				data: result,
			});
		}

		// Handle savings calculation
		if (action === "savings") {
			const validatedData = SequenceRequestSchema.parse(body);

			const jobs: OptimizationJob[] = validatedData.jobs.map((job) => ({
				...job,
				timeWindowStart: job.timeWindowStart
					? new Date(job.timeWindowStart)
					: undefined,
				timeWindowEnd: job.timeWindowEnd
					? new Date(job.timeWindowEnd)
					: undefined,
			}));

			const result = await googleRouteOptimizationService.calculateSavings(
				jobs,
				validatedData.startLocation,
			);

			return NextResponse.json({
				success: true,
				data: result,
			});
		}

		// Full optimization
		const validatedData = OptimizeRequestSchema.parse(body);

		// Convert to service types
		const jobs: OptimizationJob[] = validatedData.jobs.map((job) => ({
			...job,
			timeWindowStart: job.timeWindowStart
				? new Date(job.timeWindowStart)
				: undefined,
			timeWindowEnd: job.timeWindowEnd
				? new Date(job.timeWindowEnd)
				: undefined,
		}));

		const technicians: OptimizationTechnician[] = validatedData.technicians.map(
			(tech) => ({
				...tech,
				workdayStart: new Date(tech.workdayStart),
				workdayEnd: new Date(tech.workdayEnd),
				breakTime: tech.breakTime
					? {
							earliestStart: new Date(tech.breakTime.earliestStart),
							latestStart: new Date(tech.breakTime.latestStart),
							duration: tech.breakTime.duration,
						}
					: undefined,
			}),
		);

		const options = validatedData.options
			? {
					...validatedData.options,
					workdayStart: validatedData.options.workdayStart
						? new Date(validatedData.options.workdayStart)
						: undefined,
					workdayEnd: validatedData.options.workdayEnd
						? new Date(validatedData.options.workdayEnd)
						: undefined,
				}
			: undefined;

		const result = await googleRouteOptimizationService.optimizeRoutes(
			jobs,
			technicians,
			options,
		);

		return NextResponse.json({
			success: true,
			data: {
				routes: result.routes.map((route) => ({
					...route,
					startTime: route.startTime.toISOString(),
					endTime: route.endTime.toISOString(),
					jobs: route.jobs.map((job) => ({
						...job,
						arrivalTime: job.arrivalTime.toISOString(),
						departureTime: job.departureTime.toISOString(),
					})),
					breaks: route.breaks?.map((b) => ({
						startTime: b.startTime.toISOString(),
						duration: b.duration,
					})),
				})),
				unassignedJobs: result.unassignedJobs,
				summary: {
					totalTravelTime: result.totalTravelTime,
					totalTravelDistance: result.totalTravelDistance,
					totalJobs: result.totalJobs,
					assignedJobs: result.assignedJobs,
				},
			},
		});
	} catch (error) {
		console.error("Route optimization error:", error);

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
				error: "Failed to optimize routes",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
