import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CompetitorTemplate } from "@/lib/og";

export const alt = "Thorbis vs FieldEdge - Modern UX, Actual Support";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<CompetitorTemplate slug="fieldedge" competitorName="FieldEdge" />,
		{
			...size,
			fonts,
		}
	);
}
