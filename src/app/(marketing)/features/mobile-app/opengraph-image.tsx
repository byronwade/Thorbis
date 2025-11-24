import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, FeatureTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Mobile App - Run Your Business From Anywhere";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<FeatureTemplate slug="mobile-app" />, {
		...size,
		fonts,
	});
}
