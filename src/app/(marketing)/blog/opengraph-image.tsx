import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Thorbis Blog - Insights for Field Service Professionals";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Thorbis Blog"
			subtitle="Tips, trends, and insights for growing your field service business"
		/>,
		{
			...size,
			fonts,
		}
	);
}
