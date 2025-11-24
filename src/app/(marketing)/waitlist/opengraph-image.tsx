import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Join the Waitlist - Be First to Experience Thorbis";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Join the Waitlist"
			subtitle="Be among the first to experience the future of field service management"
		/>,
		{
			...size,
			fonts,
		}
	);
}
