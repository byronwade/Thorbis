import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Book a Demo - See Thorbis in Action";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="See Thorbis in Action"
			subtitle="Book a personalized demo and discover how Thorbis can transform your field service business"
		/>,
		{
			...size,
			fonts,
		}
	);
}
