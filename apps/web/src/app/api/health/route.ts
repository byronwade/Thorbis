/**
 * Health Check Endpoint
 *
 * Simple endpoint for load balancers and monitoring services.
 * Returns 200 if the app is running.
 */

import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || "1.0.0",
	});
}

export async function HEAD() {
	return new Response(null, { status: 200 });
}
