/**
 * Geolocation API Route
 *
 * Provides device location capabilities using Google Geolocation API.
 *
 * POST /api/location
 * - Get location from cell towers, WiFi, or IP
 * - Verify technician location at job site
 *
 * Request body:
 * - type: "ip" | "wifi" | "cell" | "hybrid" | "verify"
 * - wifiAccessPoints: Array of WiFi networks (for wifi/hybrid)
 * - cellTowers: Array of cell towers (for cell/hybrid)
 * - technicianLocation: { latitude, longitude } (for verify)
 * - jobLocation: { latitude, longitude } (for verify)
 * - toleranceMeters: number (for verify, default 100)
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	type CellTower,
	googleGeolocationService,
	type WifiAccessPoint,
} from "@/lib/services/google-geolocation-service";

// Request validation schemas
const WifiAccessPointSchema = z.object({
	macAddress: z.string(),
	signalStrength: z.number().optional(),
	age: z.number().optional(),
	channel: z.number().optional(),
	signalToNoiseRatio: z.number().optional(),
});

const CellTowerSchema = z.object({
	cellId: z.number(),
	locationAreaCode: z.number(),
	mobileCountryCode: z.number(),
	mobileNetworkCode: z.number(),
	age: z.number().optional(),
	signalStrength: z.number().optional(),
	timingAdvance: z.number().optional(),
});

const LocationSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const GeolocationRequestSchema = z.object({
	type: z.enum(["ip", "wifi", "cell", "hybrid", "verify"]),
	wifiAccessPoints: z.array(WifiAccessPointSchema).optional(),
	cellTowers: z.array(CellTowerSchema).optional(),
	radioType: z.enum(["lte", "gsm", "cdma", "wcdma", "nr"]).optional(),
	technicianLocation: LocationSchema.optional(),
	jobLocation: LocationSchema.optional(),
	toleranceMeters: z.number().min(1).max(1000).optional(),
	includeAddress: z.boolean().optional(),
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
		if (!googleGeolocationService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Geolocation service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = GeolocationRequestSchema.parse(body);

		switch (validatedData.type) {
			case "ip": {
				const location = await googleGeolocationService.getLocationFromIP();

				if (validatedData.includeAddress) {
					const locationWithAddress =
						await googleGeolocationService.reverseGeocode(location);
					return NextResponse.json({
						success: true,
						data: {
							...locationWithAddress,
							timestamp: locationWithAddress.timestamp.toISOString(),
						},
					});
				}

				return NextResponse.json({
					success: true,
					data: {
						...location,
						timestamp: location.timestamp.toISOString(),
					},
				});
			}

			case "wifi": {
				if (
					!validatedData.wifiAccessPoints ||
					validatedData.wifiAccessPoints.length === 0
				) {
					return NextResponse.json(
						{ error: "WiFi access points required for wifi location" },
						{ status: 400 },
					);
				}

				const location = await googleGeolocationService.getLocationFromWifi(
					validatedData.wifiAccessPoints as WifiAccessPoint[],
				);

				if (validatedData.includeAddress) {
					const locationWithAddress =
						await googleGeolocationService.reverseGeocode(location);
					return NextResponse.json({
						success: true,
						data: {
							...locationWithAddress,
							timestamp: locationWithAddress.timestamp.toISOString(),
						},
					});
				}

				return NextResponse.json({
					success: true,
					data: {
						...location,
						timestamp: location.timestamp.toISOString(),
					},
				});
			}

			case "cell": {
				if (
					!validatedData.cellTowers ||
					validatedData.cellTowers.length === 0
				) {
					return NextResponse.json(
						{ error: "Cell towers required for cell location" },
						{ status: 400 },
					);
				}

				const location =
					await googleGeolocationService.getLocationFromCellTowers(
						validatedData.cellTowers as CellTower[],
						validatedData.radioType,
					);

				if (validatedData.includeAddress) {
					const locationWithAddress =
						await googleGeolocationService.reverseGeocode(location);
					return NextResponse.json({
						success: true,
						data: {
							...locationWithAddress,
							timestamp: locationWithAddress.timestamp.toISOString(),
						},
					});
				}

				return NextResponse.json({
					success: true,
					data: {
						...location,
						timestamp: location.timestamp.toISOString(),
					},
				});
			}

			case "hybrid": {
				const location = await googleGeolocationService.getHybridLocation(
					validatedData.cellTowers as CellTower[] | undefined,
					validatedData.wifiAccessPoints as WifiAccessPoint[] | undefined,
					validatedData.radioType,
				);

				if (validatedData.includeAddress) {
					const locationWithAddress =
						await googleGeolocationService.reverseGeocode(location);
					return NextResponse.json({
						success: true,
						data: {
							...locationWithAddress,
							timestamp: locationWithAddress.timestamp.toISOString(),
						},
					});
				}

				return NextResponse.json({
					success: true,
					data: {
						...location,
						timestamp: location.timestamp.toISOString(),
					},
				});
			}

			case "verify": {
				if (!validatedData.technicianLocation || !validatedData.jobLocation) {
					return NextResponse.json(
						{ error: "Technician and job locations required for verification" },
						{ status: 400 },
					);
				}

				const verification = googleGeolocationService.verifyLocationProximity(
					validatedData.technicianLocation,
					validatedData.jobLocation,
					validatedData.toleranceMeters,
				);

				return NextResponse.json({
					success: true,
					data: verification,
				});
			}

			default:
				return NextResponse.json(
					{ error: "Invalid location type" },
					{ status: 400 },
				);
		}
	} catch (error) {
		console.error("Geolocation error:", error);

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
				error: "Failed to get location",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
