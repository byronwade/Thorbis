import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CompetitorTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis vs ServiceTitan - Same Power, 75% Less Cost";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<CompetitorTemplate slug="servicetitan" competitorName="ServiceTitan" />,
		{
			...size,
			fonts,
		}
	);
}
