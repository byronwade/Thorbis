import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Privacy Policy - Thorbis";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Privacy Policy"
			subtitle="How we protect and handle your data"
		/>,
		{
			...size,
			fonts,
		}
	);
}
