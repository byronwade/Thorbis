import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CalculatorTemplate, getLogoDataUrl } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "ROI Calculator - Calculate Your Thorbis Savings";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const [fonts, logoDataUrl] = await Promise.all([loadOGFonts(), getLogoDataUrl()]);

	return new ImageResponse(
		<CalculatorTemplate
			title="ROI Calculator"
			subtitle="See how much time and money you'll save with Thorbis"
			logoDataUrl={logoDataUrl}
		/>,
		{
			...size,
			fonts,
		}
	);
}
