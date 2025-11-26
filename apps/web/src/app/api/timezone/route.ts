/**
 * Time Zone API Route
 *
 * Gets timezone information for locations.
 *
 * GET /api/timezone?lat=...&lng=...
 * - Quick timezone lookup
 *
 * POST /api/timezone
 * - Get timezone details
 * - Convert times between timezones
 * - Check business hours
 *
 * Request body (POST):
 * - action: "lookup" | "convert" | "business_hours" | "multiple"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleTimeZoneService } from "@/lib/services/google-timezone-service";

// Request schemas
const LocationSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const LookupRequestSchema = z.object({
	action: z.literal("lookup"),
	location: LocationSchema,
	timestamp: z.string().optional(), // ISO string
});

const ConvertRequestSchema = z.object({
	action: z.literal("convert"),
	sourceTime: z.string(), // ISO string
	sourceLocation: LocationSchema,
	targetLocation: LocationSchema,
});

const BusinessHoursRequestSchema = z.object({
	action: z.literal("business_hours"),
	location: LocationSchema,
	openTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
	closeTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
});

const MultipleRequestSchema = z.object({
	action: z.literal("multiple"),
	locations: z
		.array(
			z.object({
				id: z.string(),
				location: LocationSchema,
			}),
		)
		.min(1)
		.max(50),
});

const ArrivalTimeRequestSchema = z.object({
	action: z.literal("arrival"),
	departureTime: z.string(), // ISO string
	departureLocation: LocationSchema,
	arrivalLocation: LocationSchema,
	travelDurationMinutes: z.number().min(0),
});

const TimeZoneRequestSchema = z.discriminatedUnion("action", [
	LookupRequestSchema,
	ConvertRequestSchema,
	BusinessHoursRequestSchema,
	MultipleRequestSchema,
	ArrivalTimeRequestSchema,
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
		if (!googleTimeZoneService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Time Zone service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const timestamp = searchParams.get("timestamp");

		if (!lat || !lng) {
			return NextResponse.json(
				{ error: "lat and lng parameters required" },
				{ status: 400 },
			);
		}

		const location = {
			latitude: Number.parseFloat(lat),
			longitude: Number.parseFloat(lng),
		};

		const tz = await googleTimeZoneService.getTimeZone(
			location,
			timestamp ? new Date(timestamp) : undefined,
		);

		if (!tz) {
			return NextResponse.json(
				{ error: "Could not determine timezone for location" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: {
				...tz,
				localTime: tz.localTime.toISOString(),
			},
		});
	} catch (error) {
		console.error("Time Zone GET error:", error);

		return NextResponse.json(
			{
				error: "Failed to get timezone",
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
		if (!googleTimeZoneService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Time Zone service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = TimeZoneRequestSchema.parse(body);

		switch (validatedData.action) {
			case "lookup": {
				const tz = await googleTimeZoneService.getTimeZone(
					validatedData.location,
					validatedData.timestamp
						? new Date(validatedData.timestamp)
						: undefined,
				);

				if (!tz) {
					return NextResponse.json(
						{ error: "Could not determine timezone for location" },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						...tz,
						localTime: tz.localTime.toISOString(),
					},
				});
			}

			case "convert": {
				const result = await googleTimeZoneService.convertTime(
					new Date(validatedData.sourceTime),
					validatedData.sourceLocation,
					validatedData.targetLocation,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Could not convert time between timezones" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						sourceTime: result.sourceTime.toISOString(),
						targetTime: result.targetTime.toISOString(),
						sourceTimezone: result.sourceTz.timeZoneId,
						targetTimezone: result.targetTz.timeZoneId,
						sourceOffset: result.sourceTz.utcOffsetString,
						targetOffset: result.targetTz.utcOffsetString,
					},
				});
			}

			case "business_hours": {
				const hours = await googleTimeZoneService.checkBusinessHours(
					validatedData.location,
					validatedData.openTime,
					validatedData.closeTime,
				);

				if (!hours) {
					return NextResponse.json(
						{ error: "Could not check business hours" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: hours,
				});
			}

			case "multiple": {
				const results = await googleTimeZoneService.getTimeAtLocations(
					validatedData.locations.map((l) => ({
						id: l.id,
						location: l.location,
					})),
				);

				return NextResponse.json({
					success: true,
					data: {
						timezones: results.map((r) => ({
							id: r.id,
							timezone: r.timezone
								? {
										...r.timezone,
										localTime: r.timezone.localTime.toISOString(),
									}
								: null,
						})),
						count: results.length,
					},
				});
			}

			case "arrival": {
				const result = await googleTimeZoneService.calculateArrivalTime(
					new Date(validatedData.departureTime),
					validatedData.departureLocation,
					validatedData.arrivalLocation,
					validatedData.travelDurationMinutes,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Could not calculate arrival time" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: {
						departureLocal: result.departureLocal.toISOString(),
						arrivalLocal: result.arrivalLocal.toISOString(),
						departureTimezone: result.departureTz,
						arrivalTimezone: result.arrivalTz,
					},
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Time Zone API error:", error);

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
				error: "Failed to process timezone request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
