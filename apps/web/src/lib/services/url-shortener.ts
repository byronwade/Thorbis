/**
 * URL Shortener Service
 *
 * Provides URL shortening functionality for SMS messages and other use cases.
 * Uses database-backed storage with optional external service fallback.
 */

import { createClient } from "@/lib/supabase/server";

const BASE_SHORT_URL = process.env.NEXT_PUBLIC_SHORT_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://app.stratos.io";

/**
 * Generate a random short code
 */
function generateShortCode(length = 6): string {
	const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let i = 0; i < length; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

/**
 * Create a shortened URL
 *
 * @param longUrl - The original URL to shorten
 * @param companyId - The company ID for tracking
 * @param options - Additional options
 * @returns The shortened URL
 */
export async function createShortUrl(
	longUrl: string,
	companyId: string,
	options: {
		customCode?: string;
		expiresAt?: Date;
		trackClicks?: boolean;
		metadata?: Record<string, unknown>;
	} = {}
): Promise<{ success: boolean; shortUrl?: string; code?: string; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database not available" };
		}

		// Check if URL already has a short code for this company
		const { data: existing } = await supabase
			.from("short_urls")
			.select("code")
			.eq("original_url", longUrl)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.maybeSingle();

		if (existing) {
			return {
				success: true,
				shortUrl: `${BASE_SHORT_URL}/s/${existing.code}`,
				code: existing.code,
			};
		}

		// Generate or use custom code
		let code = options.customCode || generateShortCode();

		// Check if custom code is already taken
		if (options.customCode) {
			const { data: codeExists } = await supabase
				.from("short_urls")
				.select("id")
				.eq("code", code)
				.maybeSingle();

			if (codeExists) {
				return { success: false, error: "Custom code already in use" };
			}
		} else {
			// Ensure generated code is unique
			let attempts = 0;
			const maxAttempts = 10;
			while (attempts < maxAttempts) {
				const { data: codeExists } = await supabase
					.from("short_urls")
					.select("id")
					.eq("code", code)
					.maybeSingle();

				if (!codeExists) break;
				code = generateShortCode();
				attempts++;
			}

			if (attempts >= maxAttempts) {
				return { success: false, error: "Failed to generate unique code" };
			}
		}

		// Create the short URL record
		const { error: insertError } = await supabase.from("short_urls").insert({
			code,
			original_url: longUrl,
			company_id: companyId,
			expires_at: options.expiresAt?.toISOString() || null,
			track_clicks: options.trackClicks !== false,
			click_count: 0,
			metadata: options.metadata || {},
		});

		if (insertError) {
			console.error("[URL Shortener] Insert error:", insertError);
			return { success: false, error: "Failed to create short URL" };
		}

		return {
			success: true,
			shortUrl: `${BASE_SHORT_URL}/s/${code}`,
			code,
		};
	} catch (error) {
		console.error("[URL Shortener] Error:", error);
		return { success: false, error: "URL shortening service unavailable" };
	}
}

/**
 * Resolve a short code to the original URL
 *
 * @param code - The short code
 * @param trackClick - Whether to increment the click counter
 * @returns The original URL
 */
export async function resolveShortUrl(
	code: string,
	trackClick = true
): Promise<{ success: boolean; originalUrl?: string; expired?: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database not available" };
		}

		const { data: shortUrl, error } = await supabase
			.from("short_urls")
			.select("*")
			.eq("code", code)
			.is("deleted_at", null)
			.single();

		if (error || !shortUrl) {
			return { success: false, error: "Short URL not found" };
		}

		// Check if expired
		if (shortUrl.expires_at && new Date(shortUrl.expires_at) < new Date()) {
			return { success: false, expired: true, error: "Short URL has expired" };
		}

		// Track click if enabled
		if (trackClick && shortUrl.track_clicks) {
			await supabase
				.from("short_urls")
				.update({
					click_count: (shortUrl.click_count || 0) + 1,
					last_clicked_at: new Date().toISOString(),
				})
				.eq("id", shortUrl.id);
		}

		return {
			success: true,
			originalUrl: shortUrl.original_url,
		};
	} catch (error) {
		console.error("[URL Shortener] Resolve error:", error);
		return { success: false, error: "Failed to resolve short URL" };
	}
}

/**
 * Get analytics for a short URL
 *
 * @param code - The short code
 * @param companyId - The company ID for authorization
 * @returns URL analytics
 */
export async function getShortUrlAnalytics(
	code: string,
	companyId: string
): Promise<{
	success: boolean;
	data?: {
		code: string;
		originalUrl: string;
		clickCount: number;
		createdAt: string;
		lastClickedAt?: string;
		expiresAt?: string;
	};
	error?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database not available" };
		}

		const { data: shortUrl, error } = await supabase
			.from("short_urls")
			.select("*")
			.eq("code", code)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.single();

		if (error || !shortUrl) {
			return { success: false, error: "Short URL not found" };
		}

		return {
			success: true,
			data: {
				code: shortUrl.code,
				originalUrl: shortUrl.original_url,
				clickCount: shortUrl.click_count || 0,
				createdAt: shortUrl.created_at,
				lastClickedAt: shortUrl.last_clicked_at,
				expiresAt: shortUrl.expires_at,
			},
		};
	} catch (error) {
		console.error("[URL Shortener] Analytics error:", error);
		return { success: false, error: "Failed to get analytics" };
	}
}

/**
 * Delete a short URL
 *
 * @param code - The short code
 * @param companyId - The company ID for authorization
 */
export async function deleteShortUrl(
	code: string,
	companyId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database not available" };
		}

		const { error } = await supabase
			.from("short_urls")
			.update({ deleted_at: new Date().toISOString() })
			.eq("code", code)
			.eq("company_id", companyId);

		if (error) {
			return { success: false, error: "Failed to delete short URL" };
		}

		return { success: true };
	} catch (error) {
		console.error("[URL Shortener] Delete error:", error);
		return { success: false, error: "Failed to delete short URL" };
	}
}

/**
 * Shorten URL for SMS messages
 * Simplified function for use in SMS templates
 *
 * @param longUrl - The URL to shorten
 * @param companyId - The company ID
 * @returns The shortened URL, or the original if shortening fails
 */
export async function shortenUrlForSms(
	longUrl: string,
	companyId: string
): Promise<string> {
	// Don't shorten already short URLs
	if (longUrl.length <= 30) {
		return longUrl;
	}

	const result = await createShortUrl(longUrl, companyId, {
		trackClicks: true,
		expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
	});

	return result.success && result.shortUrl ? result.shortUrl : longUrl;
}
