import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Solutions - Thorbis Field Service Management";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Solutions"
			subtitle="Complete field service management for every business size"
		/>,
		{
			...size,
			fonts,
		}
	);
}
