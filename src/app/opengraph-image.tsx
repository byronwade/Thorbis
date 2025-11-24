import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, HomepageTemplate, getLogoDataUrl } from "@/lib/og";

/**
 * Default OG Image - Root Level Fallback
 *
 * REDESIGNED: Aggressive pain-first approach with huge pricing and social proof.
 * Stops contractors scrolling with "$50K/Year" pain points and massive "$200/mo" pricing.
 */

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Field Service Management That Contractors Actually Use | Thorbis $200/mo";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const [fonts, logoDataUrl] = await Promise.all([
		loadOGFonts(),
		getLogoDataUrl(),
	]);

	return new ImageResponse(<HomepageTemplate logoDataUrl={logoDataUrl} />, {
		...size,
		fonts,
	});
}
