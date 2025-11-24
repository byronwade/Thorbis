import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, FeatureTemplate } from "@/lib/og";

export const alt = "AI Assistant - Your 24/7 Virtual Dispatcher";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<FeatureTemplate slug="ai-assistant" />, {
		...size,
		fonts,
	});
}
