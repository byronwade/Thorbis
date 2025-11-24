import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Cookie Policy - Thorbis";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Cookie Policy"
			subtitle="How we use cookies to improve your experience"
		/>,
		{
			...size,
			fonts,
		}
	);
}
