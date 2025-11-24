import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Thorbis Partner Program - Grow Together";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Partner Program"
			subtitle="Join our partner ecosystem and help contractors succeed"
		/>,
		{
			...size,
			fonts,
		}
	);
}
