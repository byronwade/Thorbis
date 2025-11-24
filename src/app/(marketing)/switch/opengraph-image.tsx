import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Switch to Thorbis - Free Migration, Zero Downtime";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Switch to Thorbis"
			subtitle="Free migration, dedicated support, zero downtime"
		/>,
		{
			...size,
			fonts,
		}
	);
}
