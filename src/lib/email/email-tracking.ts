/**
 * Email Tracking Utilities
 * 
 * Adds tracking pixels and link tracking to all outgoing emails
 * to track opens, clicks, and delivery status.
 */

/**
 * Generate a tracking pixel URL for email opens
 */
function generateTrackingPixelUrl(
	communicationId: string,
	baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
): string {
	return `${baseUrl}/api/email/track/open?c=${encodeURIComponent(communicationId)}`;
}

/**
 * Generate a tracking URL for link clicks
 */
function generateTrackingClickUrl(
	communicationId: string,
	originalUrl: string,
	baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
): string {
	return `${baseUrl}/api/email/track/click?c=${encodeURIComponent(communicationId)}&u=${encodeURIComponent(originalUrl)}`;
}

/**
 * Inject tracking pixel into HTML email
 * Adds a 1x1 transparent pixel at the end of the email body
 */
function injectTrackingPixel(
	html: string,
	communicationId: string,
	baseUrl?: string
): string {
	const trackingUrl = generateTrackingPixelUrl(communicationId, baseUrl);
	
	// Create tracking pixel
	const trackingPixel = `<img src="${trackingUrl}" width="1" height="1" style="display:none;width:1px;height:1px;border:0;" alt="" />`;
	
	// Try to inject before closing body tag, otherwise append to end
	if (html.includes("</body>")) {
		return html.replace("</body>", `${trackingPixel}</body>`);
	}
	
	// If no body tag, append to end
	return `${html}${trackingPixel}`;
}

/**
 * Wrap all links in HTML with tracking URLs
 * Preserves original link behavior while tracking clicks
 */
function wrapLinksWithTracking(
	html: string,
	communicationId: string,
	baseUrl?: string
): string {
	// Regex to find all href attributes in anchor tags
	const linkRegex = /<a\s+([^>]*\s+)?href=["']([^"']+)["']([^>]*)>/gi;
	
	return html.replace(linkRegex, (match, before, url, after) => {
		// Skip if already a tracking URL or mailto/tel links
		if (
			url.startsWith("mailto:") ||
			url.startsWith("tel:") ||
			url.startsWith("#") ||
			url.includes("/api/email/track/")
		) {
			return match;
		}
		
		// Generate tracking URL
		const trackingUrl = generateTrackingClickUrl(communicationId, url, baseUrl);
		
		// Replace href with tracking URL
		return `<a ${before || ""}href="${trackingUrl}"${after || ""}>`;
	});
}

/**
 * Add complete tracking to email HTML
 * - Injects tracking pixel for opens
 * - Wraps all links for click tracking
 */
export function addEmailTracking(
	html: string,
	communicationId: string,
	baseUrl?: string
): string {
	// First wrap links, then add tracking pixel
	let trackedHtml = wrapLinksWithTracking(html, communicationId, baseUrl);
	trackedHtml = injectTrackingPixel(trackedHtml, communicationId, baseUrl);
	
	return trackedHtml;
}

