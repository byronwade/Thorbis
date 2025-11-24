import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, FeatureTemplate } from "@/lib/og";

export const alt = "Built-in CRM - Know Your Customers, Grow Your Business";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<FeatureTemplate slug="crm" />, {
		...size,
		fonts,
	});
}
