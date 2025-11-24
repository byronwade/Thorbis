import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Thorbis Case Studies - Real Results from Real Contractors";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Case Studies"
			subtitle="Real results from contractors who switched to Thorbis"
		/>,
		{
			...size,
			fonts,
		}
	);
}
