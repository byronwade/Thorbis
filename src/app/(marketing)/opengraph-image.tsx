import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, HomepageTemplate } from "@/lib/og";

export const alt = "Thorbis - Field Service Management That Actually Works";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<HomepageTemplate />, {
		...size,
		fonts,
	});
}
