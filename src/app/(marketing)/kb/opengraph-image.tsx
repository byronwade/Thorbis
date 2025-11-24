import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Thorbis Knowledge Base - Help Center & Documentation";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Help Center"
			subtitle="Guides, tutorials, and answers to get the most from Thorbis"
		/>,
		{
			...size,
			fonts,
		}
	);
}
