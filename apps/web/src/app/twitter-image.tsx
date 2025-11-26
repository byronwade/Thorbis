import { ImageResponse } from "next/og";
import { HomepageTemplate, loadOGFonts, OG_CONFIG } from "@/lib/og";

/**
 * Default Twitter Image - Root Level Fallback
 *
 * This serves as the fallback Twitter card for any pages
 * that don't have their own twitter-image.tsx file.
 */

export const runtime = "edge";
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
