/**
 * Google Calendar OAuth API Route
 *
 * Handles OAuth flow for Google Calendar integration
 * - Generate authorization URL
 * - Exchange code for tokens
 * - Refresh tokens
 */

import { createClient } from "@stratos/auth/server";
import { randomUUID } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { googleCalendarService } from "@/lib/services/google-calendar-service";

// Generate OAuth URL
export async function GET(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Check if service is configured
	if (!googleCalendarService.isConfigured()) {
		return NextResponse.json(
			{ error: "Google Calendar integration not configured" },
			{ status: 503 },
		);
	}

	try {
		// Generate state for CSRF protection
		const state = randomUUID();

		// Store state in user metadata or session for verification
		// In production, use a more secure state storage mechanism
		const authUrl = googleCalendarService.getAuthUrl(state, user.id);

		return NextResponse.json({
			authUrl,
			state,
		});
	} catch (error) {
		console.error("Calendar auth error:", error);
		return NextResponse.json(
			{ error: "Failed to generate auth URL" },
			{ status: 500 },
		);
	}
}

// Exchange code for tokens
export async function POST(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { code, state } = body;

		if (!code) {
			return NextResponse.json(
				{ error: "Authorization code is required" },
				{ status: 400 },
			);
		}

		// Exchange code for tokens
		const tokens = await googleCalendarService.exchangeCodeForTokens(code);

		if (!tokens) {
			return NextResponse.json(
				{ error: "Failed to exchange code for tokens" },
				{ status: 500 },
			);
		}

		// Store tokens in user's profile
		// Note: In production, store refresh token securely (encrypted)
		const { error: updateError } = await supabase
			.from("team_members")
			.update({
				google_calendar_connected: true,
				google_calendar_refresh_token: tokens.refreshToken,
				google_calendar_token_expires_at: tokens.expiresAt.toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("user_id", user.id);

		if (updateError) {
			console.error("Failed to store tokens:", updateError);
			return NextResponse.json(
				{ error: "Failed to store calendar connection" },
				{ status: 500 },
			);
		}

		// List user's calendars for selection
		const calendars = await googleCalendarService.listCalendars(
			tokens.accessToken,
		);

		return NextResponse.json({
			success: true,
			connected: true,
			calendars: calendars.map((cal) => ({
				id: cal.id,
				name: cal.summary,
				primary: cal.primary,
				accessRole: cal.accessRole,
			})),
		});
	} catch (error) {
		console.error("Calendar token exchange error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Disconnect calendar
export async function DELETE(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { error: updateError } = await supabase
			.from("team_members")
			.update({
				google_calendar_connected: false,
				google_calendar_refresh_token: null,
				google_calendar_token_expires_at: null,
				google_calendar_id: null,
				updated_at: new Date().toISOString(),
			})
			.eq("user_id", user.id);

		if (updateError) {
			console.error("Failed to disconnect calendar:", updateError);
			return NextResponse.json(
				{ error: "Failed to disconnect calendar" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			connected: false,
		});
	} catch (error) {
		console.error("Calendar disconnect error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
