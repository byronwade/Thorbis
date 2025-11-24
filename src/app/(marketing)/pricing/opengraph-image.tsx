import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, PricingTemplate } from "@/lib/og";

export const alt = "Thorbis Pricing - $200/mo, All Features Included, No Per-User Fees";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<PricingTemplate />, {
		...size,
		fonts,
	});
}
