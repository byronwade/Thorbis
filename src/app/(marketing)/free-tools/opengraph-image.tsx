import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CalculatorTemplate } from "@/lib/og";

export const alt = "Free Tools for Contractors - Thorbis";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<CalculatorTemplate
			name="Free Tools"
			description="Calculators, templates, and resources for contractors"
		/>,
		{
			...size,
			fonts,
		}
	);
}
