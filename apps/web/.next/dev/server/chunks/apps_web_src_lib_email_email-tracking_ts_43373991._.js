module.exports = [
"[project]/apps/web/src/lib/email/email-tracking.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Tracking Utilities
 * 
 * Adds tracking pixels and link tracking to all outgoing emails
 * to track opens, clicks, and delivery status.
 */ /**
 * Generate a tracking pixel URL for email opens
 */ __turbopack_context__.s([
    "addEmailTracking",
    ()=>addEmailTracking
]);
function generateTrackingPixelUrl(communicationId, baseUrl = ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000") {
    return `${baseUrl}/api/email/track/open?c=${encodeURIComponent(communicationId)}`;
}
/**
 * Generate a tracking URL for link clicks
 */ function generateTrackingClickUrl(communicationId, originalUrl, baseUrl = ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000") {
    return `${baseUrl}/api/email/track/click?c=${encodeURIComponent(communicationId)}&u=${encodeURIComponent(originalUrl)}`;
}
/**
 * Inject tracking pixel into HTML email
 * Adds a 1x1 transparent pixel at the end of the email body
 */ function injectTrackingPixel(html, communicationId, baseUrl) {
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
 */ function wrapLinksWithTracking(html, communicationId, baseUrl) {
    // Regex to find all href attributes in anchor tags
    const linkRegex = /<a\s+([^>]*\s+)?href=["']([^"']+)["']([^>]*)>/gi;
    return html.replace(linkRegex, (match, before, url, after)=>{
        // Skip if already a tracking URL or mailto/tel links
        if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#") || url.includes("/api/email/track/")) {
            return match;
        }
        // Generate tracking URL
        const trackingUrl = generateTrackingClickUrl(communicationId, url, baseUrl);
        // Replace href with tracking URL
        return `<a ${before || ""}href="${trackingUrl}"${after || ""}>`;
    });
}
function addEmailTracking(html, communicationId, baseUrl) {
    // First wrap links, then add tracking pixel
    let trackedHtml = wrapLinksWithTracking(html, communicationId, baseUrl);
    trackedHtml = injectTrackingPixel(trackedHtml, communicationId, baseUrl);
    return trackedHtml;
}
}),
];

//# sourceMappingURL=apps_web_src_lib_email_email-tracking_ts_43373991._.js.map