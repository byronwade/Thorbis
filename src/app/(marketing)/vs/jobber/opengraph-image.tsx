import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CompetitorTemplate } from "@/lib/og";

export const alt = "Thorbis vs Jobber - AI-Powered, Not AI-Washed";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<CompetitorTemplate slug="jobber" competitorName="Jobber" />,
		{
			...size,
			fonts,
		}
	);
}
