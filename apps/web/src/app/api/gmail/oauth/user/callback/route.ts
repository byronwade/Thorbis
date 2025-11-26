/**
 * Per-User Gmail OAuth Callback Handler
 *
 * This endpoint handles the OAuth callback from Google after a team member grants
 * Gmail access. It exchanges the authorization code for tokens and stores them
 * at the user level.
 *
 * Flow:
 * 1. Team member clicks "Connect Gmail" in personal settings
 * 2. Member is redirected to Google OAuth consent screen
 * 3. After granting access, Google redirects back to this endpoint
 * 4. We exchange the code for tokens
 * 5. Create user_email_accounts entry
 * 6. Store tokens in user_gmail_tokens table
 * 7. Redirect to personal settings with success/error status
 *
 * Required Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID from Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 * - NEXT_PUBLIC_APP_URL: Base URL of the app (for redirect URI)
 *
 * @see https://developers.google.com/identity/protocols/oauth2/web-server
 */

import { type NextRequest, NextResponse } from "next/server";
import { logAuditEvent, logGmailConnected } from "@/lib/email/audit-logger";
import { storeUserGmailTokens } from "@/lib/email/gmail-client";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Google OAuth token endpoint */
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/** Google userinfo endpoint to get email */
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

/** Where to redirect after callback */
const USER_SETTINGS_URL = "/dashboard/settings/personal/email";

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
 * Contains team member and company info for callback processing
 */
interface UserOAuthState {
	companyId: string;
	teamMemberId: string;
	userId: string;
	userName: string;
}

// =============================================================================
// CALLBACK HANDLER
// =============================================================================

/**
 * GET /api/gmail/oauth/user/callback
 *
 * Handles the OAuth callback from Google for per-user Gmail connection.
 * Exchanges authorization code for tokens and stores them at the user level.
 */
export async function GET(request: NextRequest) {
	console.log("[Gmail User OAuth] Callback received");

	try {
		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");
		const error = searchParams.get("error");
		const stateParam = searchParams.get("state");

		// Handle OAuth errors
		if (error) {
			console.error(`[Gmail User OAuth] Error from Google: ${error}`);
			return redirectWithError(`Google OAuth error: ${error}`);
		}

		// Validate authorization code
		if (!code) {
			console.error("[Gmail User OAuth] No authorization code received");
			return redirectWithError("No authorization code received");
		}

		// Validate state parameter
		if (!stateParam) {
			console.error("[Gmail User OAuth] No state parameter received");
			return redirectWithError("Invalid OAuth state");
		}

		// Parse state (contains team member and company info)
		let state: UserOAuthState;
		try {
			state = JSON.parse(Buffer.from(stateParam, "base64").toString());
		} catch {
			console.error("[Gmail User OAuth] Invalid state format");
			return redirectWithError("Invalid OAuth state format");
		}

		// Validate state has required fields
		if (!state.companyId || !state.teamMemberId || !state.userId) {
			console.error("[Gmail User OAuth] State missing required fields");
			return redirectWithError("Invalid OAuth state - missing data");
		}

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

		// Verify the logged-in user matches the state userId (CSRF protection)
		if (state.userId !== user.id) {
			console.error(
				"[Gmail User OAuth] User ID mismatch - potential CSRF attack",
			);
			return redirectWithError("Invalid OAuth state - please try again");
		}

		// Verify team member exists and belongs to user
		const { data: teamMember, error: memberError } = await supabase
			.from("team_members")
			.select("id, company_id")
			.eq("id", state.teamMemberId)
			.eq("user_id", user.id)
			.eq("company_id", state.companyId)
			.single();

		if (memberError || !teamMember) {
			console.error(
				"[Gmail User OAuth] Team member not found or doesn't belong to user",
			);
			return redirectWithError("Invalid team member - please try again");
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

		// Check for required scopes
		const hasReadonly = scopes.includes(
			"https://www.googleapis.com/auth/gmail.readonly",
		);
		const hasSend = scopes.includes(
			"https://www.googleapis.com/auth/gmail.send",
		);

		if (!hasReadonly && !hasSend) {
			console.error("[Gmail User OAuth] Missing required Gmail scopes");
			return redirectWithError(
				"Gmail permissions were not granted. Please try again and approve all permissions.",
			);
		}

		// Check if refresh token was provided
		if (!tokens.refresh_token) {
			console.warn(
				"[Gmail User OAuth] No refresh token received. User may need to revoke and re-grant access.",
			);
			return redirectWithError(
				"Unable to get refresh token. Please revoke Gmail access in your Google account settings and try again.",
			);
		}

		// Create or update user_email_accounts entry
		const supabaseService = await createServiceSupabaseClient();
		const { data: emailAccount, error: accountError } = await supabaseService
			.from("user_email_accounts")
			.upsert(
				{
					company_id: state.companyId,
					user_id: state.teamMemberId,
					email_address: googleUser.email,
					email_type: "gmail_oauth",
					provider: "google",
					is_primary: false, // Will be set to true if it's their first account
					status: "active",
				},
				{
					onConflict: "email_address",
					ignoreDuplicates: false,
				},
			)
			.select("id")
			.single();

		if (accountError || !emailAccount) {
			console.error(
				"[Gmail User OAuth] Failed to create email account:",
				accountError?.message,
			);
			return redirectWithError("Failed to save email account");
		}

		// Check if this is their first email account (make it primary)
		const { data: existingAccounts } = await supabaseService
			.from("user_email_accounts")
			.select("id")
			.eq("user_id", state.teamMemberId)
			.eq("is_primary", true)
			.maybeSingle();

		if (!existingAccounts) {
			// Set this as primary account
			await supabaseService
				.from("user_email_accounts")
				.update({ is_primary: true })
				.eq("id", emailAccount.id);
		}

		// Store tokens in user_gmail_tokens table
		const storeResult = await storeUserGmailTokens(
			state.teamMemberId,
			emailAccount.id,
			googleUser.email,
			tokens.access_token,
			tokens.refresh_token,
			tokens.expires_in,
			scopes,
		);

		if (!storeResult.success) {
			console.error(
				"[Gmail User OAuth] Failed to store tokens:",
				storeResult.error,
			);
			return redirectWithError("Failed to save Gmail connection");
		}

		console.log(
			`[Gmail User OAuth] Successfully connected Gmail for user ${state.userName} (${googleUser.email})`,
		);

		// Log Gmail connection for audit trail
		await logGmailConnected(
			state.teamMemberId,
			state.userName,
			googleUser.email,
			state.companyId,
		);

		// Redirect to personal settings with success message
		const redirectUrl = new URL(USER_SETTINGS_URL, request.nextUrl.origin);
		redirectUrl.searchParams.set("gmail", "connected");
		redirectUrl.searchParams.set("email", googleUser.email);

		return NextResponse.redirect(redirectUrl);
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
 * Exchange authorization code for access and refresh tokens
 */
async function exchangeCodeForTokens(
	code: string,
): Promise<GoogleTokenResponse | null> {
	try {
		const clientId = process.env.GOOGLE_CLIENT_ID;
		const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
		const appUrl = process.env.NEXT_PUBLIC_APP_URL;

		if (!clientId || !clientSecret) {
			console.error(
				"[Gmail User OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET",
			);
			return null;
		}

		if (!appUrl) {
			console.error("[Gmail User OAuth] Missing NEXT_PUBLIC_APP_URL");
			return null;
		}

		const redirectUri = `${appUrl}/api/gmail/oauth/user/callback`;

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
			console.error(
				`[Gmail User OAuth] Token exchange failed: ${response.status}`,
				errorText,
			);
			return null;
		}

		const tokens: GoogleTokenResponse = await response.json();
		return tokens;
	} catch (error) {
		console.error(
			"[Gmail User OAuth] Token exchange error:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return null;
	}
}

/**
 * Get user info from Google
 */
async function getGoogleUserInfo(
	accessToken: string,
): Promise<GoogleUserInfo | null> {
	try {
		const response = await fetch(GOOGLE_USERINFO_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`[Gmail User OAuth] Failed to get user info: ${response.status}`,
				errorText,
			);
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error(
			"[Gmail User OAuth] User info error:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return null;
	}
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
