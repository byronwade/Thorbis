import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, HomepageTemplate } from "@/lib/og";

/**
 * Default OG Image - Root Level Fallback
 *
 * This serves as the fallback for any pages that don't have
 * their own opengraph-image.tsx file. In Next.js, OG images
 * cascade from parent to child routes.
 */

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis - Field Service Management Software | $200/mo";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<HomepageTemplate />, {
		...size,
		fonts,
	});
}
