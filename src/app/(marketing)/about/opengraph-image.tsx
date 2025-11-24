import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "About Thorbis - Built by Contractors, for Contractors";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="About Thorbis"
			subtitle="Built by contractors, for contractors. We understand your business."
		/>,
		{
			...size,
			fonts,
		}
	);
}
