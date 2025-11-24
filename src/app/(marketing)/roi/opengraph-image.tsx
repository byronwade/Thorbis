import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CalculatorTemplate } from "@/lib/og";

export const alt = "ROI Calculator - Calculate Your Thorbis Savings";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<CalculatorTemplate
			name="ROI Calculator"
			description="See how much time and money you'll save with Thorbis"
		/>,
		{
			...size,
			fonts,
		}
	);
}
