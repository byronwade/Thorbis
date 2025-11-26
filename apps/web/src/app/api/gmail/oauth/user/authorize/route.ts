/**
 * Per-User Gmail OAuth Authorization Initiation
 *
 * This endpoint initiates the OAuth flow for individual team members to connect
 * their personal Gmail accounts for inbox synchronization.
 *
 * Flow:
 * 1. Team member clicks "Connect Gmail" in their personal email settings
 * 2. This endpoint generates OAuth URL with appropriate scopes
 * 3. User is redirected to Google OAuth consent screen
 * 4. After granting access, Google redirects to /api/gmail/oauth/user/callback
 *
 * Key Differences from Company-Level OAuth:
 * - Scopes: gmail.readonly + gmail.send (not just gmail.send)
 * - Any team member can connect (not just admins)
 * - Tokens stored per-user in user_gmail_tokens table
 * - Creates user_email_accounts entry for tracking
 *
 * Required Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID from Google Cloud Console
 * - NEXT_PUBLIC_APP_URL: Base URL of the app (for redirect URI)
 *
 * @see https://developers.google.com/identity/protocols/oauth2/web-server
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Google OAuth authorization endpoint */
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

/** OAuth scopes for per-user Gmail access */
const USER_GMAIL_SCOPES = [
	"https://www.googleapis.com/auth/gmail.readonly", // Read inbox
	"https://www.googleapis.com/auth/gmail.send", // Send emails
	"https://www.googleapis.com/auth/userinfo.email", // Get email address
	"https://www.googleapis.com/auth/userinfo.profile", // Get name
];

/** Where to redirect after callback */
const USER_SETTINGS_URL = "/dashboard/settings/personal/email";

// =============================================================================
// TYPES
// =============================================================================

/**
 * State object encoded in OAuth state parameter
 * Contains team member and company info for callback processing
 */
interface UserOAuthState {
	companyId: string;
	teamMemberId: string;
	userId: string; // auth.uid for CSRF protection
	userName: string; // for audit trail
}

// =============================================================================
// AUTHORIZATION HANDLER
// =============================================================================

/**
 * GET /api/gmail/oauth/user/authorize
 *
 * Initiates OAuth flow for a team member to connect their personal Gmail.
 * Requires authenticated user with team membership.
 */
export async function GET(request: NextRequest) {
	console.log("[Gmail User OAuth] Authorization request received");

	try {
		// Get current user from Supabase session
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			console.error(
				"[Gmail User OAuth] User not authenticated:",
				authError?.message,
			);
			return redirectWithError("You must be logged in to connect Gmail");
		}

		// Get team member info
		const { data: teamMember, error: memberError } = await supabase
			.from("team_members")
			.select("id, company_id, first_name, last_name")
			.eq("user_id", user.id)
			.single();

		if (memberError || !teamMember) {
			console.error(
				"[Gmail User OAuth] Team member not found:",
				memberError?.message,
			);
			return redirectWithError("You must be a team member to connect Gmail");
		}

		// Check if user already has a Gmail connection
		const { data: existingToken } = await supabase
			.from("user_gmail_tokens")
			.select("id")
			.eq("team_member_id", teamMember.id)
			.maybeSingle();

		if (existingToken) {
			console.log("[Gmail User OAuth] User already has Gmail connected");
			// Allow re-connection (will revoke old tokens)
		}

		// Generate OAuth URL
		const authUrl = generateUserOAuthUrl({
			companyId: teamMember.company_id,
			teamMemberId: teamMember.id,
			userId: user.id,
			userName: `${teamMember.first_name} ${teamMember.last_name}`,
		});

		console.log(
			`[Gmail User OAuth] Redirecting ${teamMember.first_name} ${teamMember.last_name} to Google OAuth`,
		);

		// Redirect to Google OAuth consent screen
		return NextResponse.redirect(authUrl);
	} catch (error) {
		console.error(
			"[Gmail User OAuth] Unexpected error:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return redirectWithError("An unexpected error occurred");
	}
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate Google OAuth URL for per-user Gmail connection
 */
function generateUserOAuthUrl(state: UserOAuthState): string {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const appUrl = process.env.NEXT_PUBLIC_APP_URL;

	if (!clientId || !appUrl) {
		throw new Error("Missing GOOGLE_CLIENT_ID or NEXT_PUBLIC_APP_URL");
	}

	const redirectUri = `${appUrl}/api/gmail/oauth/user/callback`;

	// Encode state as base64 JSON (includes team member and company info)
	const encodedState = Buffer.from(JSON.stringify(state)).toString("base64");

	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: "code",
		scope: USER_GMAIL_SCOPES.join(" "),
		access_type: "offline", // Required to get refresh token
		prompt: "consent", // Force consent to ensure refresh token
		state: encodedState, // CSRF protection + user context
	});

	return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Redirect to user settings page with error message
 */
function redirectWithError(message: string): NextResponse {
	const redirectUrl = new URL(
		USER_SETTINGS_URL,
		process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	);
	redirectUrl.searchParams.set("gmail", "error");
	redirectUrl.searchParams.set("message", message);

	return NextResponse.redirect(redirectUrl);
}
