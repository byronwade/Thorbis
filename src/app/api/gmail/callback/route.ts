/**
 * Gmail OAuth Callback Handler (Company-Level)
 *
 * This endpoint handles the OAuth callback from Google after a company admin grants
 * Gmail access. It exchanges the authorization code for tokens and stores
 * them at the company level.
 *
 * Flow:
 * 1. Company admin clicks "Connect Gmail" in settings
 * 2. Admin is redirected to Google OAuth consent screen
 * 3. After granting access, Google redirects back to this endpoint
 * 4. We exchange the code for tokens
 * 5. Store tokens in company_gmail_tokens table
 * 6. Redirect to settings with success/error status
 *
 * Required Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID from Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 * - NEXT_PUBLIC_APP_URL: Base URL of the app (for redirect URI)
 *
 * Google Cloud Console Setup:
 * 1. Create a project at console.cloud.google.com
 * 2. Enable Gmail API
 * 3. Create OAuth 2.0 credentials (Web application)
 * 4. Add authorized redirect URI: https://yourdomain.com/api/gmail/callback
 * 5. Copy client ID and secret to environment variables
 *
 * @see https://developers.google.com/identity/protocols/oauth2/web-server
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { storeCompanyGmailTokens, setCompanyEmailProvider } from "@/lib/email/gmail-client";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Google OAuth token endpoint */
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/** Google userinfo endpoint to get email */
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

/** Where to redirect after callback */
const SETTINGS_URL = "/dashboard/settings/email";

// =============================================================================
// TYPES
// =============================================================================

interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
	token_type: string;
	id_token?: string;
}

interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name?: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
}

/**
 * State object encoded in OAuth state parameter
 * Contains company and user info for callback processing
 */
interface OAuthState {
	companyId: string;
	userId: string;
	userName: string;
}

// =============================================================================
// CALLBACK HANDLER
// =============================================================================

/**
 * GET /api/gmail/callback
 *
 * Handles the OAuth callback from Google.
 * Exchanges authorization code for tokens and stores them at the company level.
 */
export async function GET(request: NextRequest) {
	console.log("[Gmail OAuth] Callback received");

	try {
		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");
		const error = searchParams.get("error");
		const stateParam = searchParams.get("state");

		// Handle OAuth errors
		if (error) {
			console.error(`[Gmail OAuth] Error from Google: ${error}`);
			return redirectWithError(`Google OAuth error: ${error}`);
		}

		// Validate authorization code
		if (!code) {
			console.error("[Gmail OAuth] No authorization code received");
			return redirectWithError("No authorization code received");
		}

		// Validate state parameter
		if (!stateParam) {
			console.error("[Gmail OAuth] No state parameter received");
			return redirectWithError("Invalid OAuth state");
		}

		// Parse state (contains company and user info)
		let state: OAuthState;
		try {
			state = JSON.parse(Buffer.from(stateParam, "base64").toString());
		} catch {
			console.error("[Gmail OAuth] Invalid state format");
			return redirectWithError("Invalid OAuth state format");
		}

		// Validate state has required fields
		if (!state.companyId || !state.userId) {
			console.error("[Gmail OAuth] State missing required fields");
			return redirectWithError("Invalid OAuth state - missing data");
		}

		// Get current user from Supabase session
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			console.error("[Gmail OAuth] User not authenticated:", authError?.message);
			return redirectWithError("You must be logged in to connect Gmail");
		}

		// Verify the logged-in user matches the state userId (CSRF protection)
		if (state.userId !== user.id) {
			console.error("[Gmail OAuth] User ID mismatch - potential CSRF attack");
			return redirectWithError("Invalid OAuth state - please try again");
		}

		// Verify user is admin/owner of the company
		const { data: membership, error: membershipError } = await supabase
			.from("team_members")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", state.companyId)
			.in("role", ["owner", "admin"])
			.single();

		if (membershipError || !membership) {
			console.error("[Gmail OAuth] User is not admin/owner of company");
			return redirectWithError("You must be a company admin or owner to connect Gmail");
		}

		// Exchange authorization code for tokens
		const tokens = await exchangeCodeForTokens(code);
		if (!tokens) {
			return redirectWithError("Failed to exchange authorization code");
		}

		// Get user info from Google to get their Gmail email
		const googleUser = await getGoogleUserInfo(tokens.access_token);
		if (!googleUser) {
			return redirectWithError("Failed to get Google user info");
		}

		// Verify email is verified
		if (!googleUser.verified_email) {
			return redirectWithError("Gmail account email is not verified");
		}

		// Parse scopes
		const scopes = tokens.scope.split(" ");

		// Check for gmail.send scope
		if (!scopes.includes("https://www.googleapis.com/auth/gmail.send")) {
			console.error("[Gmail OAuth] Missing gmail.send scope");
			return redirectWithError(
				"Gmail send permission was not granted. Please try again and approve all permissions."
			);
		}

		// Store tokens in database at company level
		const storeResult = await storeCompanyGmailTokens(
			state.companyId,
			googleUser.email,
			googleUser.name || null,
			tokens.access_token,
			tokens.refresh_token || "",
			tokens.expires_in,
			scopes,
			state.userId,
			state.userName
		);

		if (!storeResult.success) {
			console.error("[Gmail OAuth] Failed to store tokens:", storeResult.error);
			return redirectWithError("Failed to save Gmail connection");
		}

		// Update company email provider preference to Gmail
		await setCompanyEmailProvider(state.companyId, "gmail", state.userId);

		console.log(
			`[Gmail OAuth] Successfully connected Gmail for company ${state.companyId} (${googleUser.email}) by ${state.userName}`
		);

		// Redirect to settings with success message
		const redirectUrl = new URL(SETTINGS_URL, request.nextUrl.origin);
		redirectUrl.searchParams.set("gmail", "connected");
		redirectUrl.searchParams.set("email", googleUser.email);

		return NextResponse.redirect(redirectUrl);
	} catch (error) {
		console.error(
			"[Gmail OAuth] Unexpected error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return redirectWithError("An unexpected error occurred");
	}
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Exchange authorization code for access and refresh tokens
 */
async function exchangeCodeForTokens(
	code: string
): Promise<GoogleTokenResponse | null> {
	try {
		const clientId = process.env.GOOGLE_CLIENT_ID;
		const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
		const appUrl = process.env.NEXT_PUBLIC_APP_URL;

		if (!clientId || !clientSecret) {
			console.error("[Gmail OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
			return null;
		}

		if (!appUrl) {
			console.error("[Gmail OAuth] Missing NEXT_PUBLIC_APP_URL");
			return null;
		}

		const redirectUri = `${appUrl}/api/gmail/callback`;

		const response = await fetch(GOOGLE_TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				code,
				grant_type: "authorization_code",
				redirect_uri: redirectUri,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[Gmail OAuth] Token exchange failed: ${response.status}`, errorText);
			return null;
		}

		const tokens: GoogleTokenResponse = await response.json();

		// Warn if no refresh token (happens when user has already granted access)
		if (!tokens.refresh_token) {
			console.warn(
				"[Gmail OAuth] No refresh token received. User may need to revoke and re-grant access."
			);
		}

		return tokens;
	} catch (error) {
		console.error(
			"[Gmail OAuth] Token exchange error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return null;
	}
}

/**
 * Get user info from Google
 */
async function getGoogleUserInfo(
	accessToken: string
): Promise<GoogleUserInfo | null> {
	try {
		const response = await fetch(GOOGLE_USERINFO_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[Gmail OAuth] Failed to get user info: ${response.status}`, errorText);
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error(
			"[Gmail OAuth] User info error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return null;
	}
}

/**
 * Redirect to settings page with error message
 */
function redirectWithError(message: string): NextResponse {
	const redirectUrl = new URL(SETTINGS_URL, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
	redirectUrl.searchParams.set("gmail", "error");
	redirectUrl.searchParams.set("message", message);

	return NextResponse.redirect(redirectUrl);
}

// =============================================================================
// INITIATE OAUTH FLOW
// =============================================================================

/**
 * Helper to generate the Google OAuth URL for company Gmail connection
 *
 * Use this URL to redirect admins to Google's consent screen.
 *
 * @param companyId - Company ID to connect Gmail for
 * @param userId - Admin user's ID (for audit trail)
 * @param userName - Admin user's name (for audit trail)
 * @returns OAuth URL to redirect to
 *
 * @example
 * const authUrl = getGmailOAuthUrl(companyId, userId, userName);
 * // Redirect user to authUrl
 */
export function getGmailOAuthUrl(companyId: string, userId: string, userName: string): string {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const appUrl = process.env.NEXT_PUBLIC_APP_URL;

	if (!clientId || !appUrl) {
		throw new Error("Missing GOOGLE_CLIENT_ID or NEXT_PUBLIC_APP_URL");
	}

	const redirectUri = `${appUrl}/api/gmail/callback`;

	// Encode state as base64 JSON (includes company and user info)
	const state: OAuthState = {
		companyId,
		userId,
		userName,
	};
	const encodedState = Buffer.from(JSON.stringify(state)).toString("base64");

	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: "code",
		scope: [
			"https://www.googleapis.com/auth/gmail.send",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		].join(" "),
		access_type: "offline", // Required to get refresh token
		prompt: "consent", // Force consent to ensure refresh token
		state: encodedState, // CSRF protection + company context
	});

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
