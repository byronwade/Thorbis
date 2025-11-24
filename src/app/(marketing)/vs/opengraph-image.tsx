import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis vs Competitors - See Why Contractors Are Switching";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Compare Thorbis"
			subtitle="See how we stack up against ServiceTitan, Housecall Pro, and more"
		/>,
		{
			...size,
			fonts,
		}
	);
}
