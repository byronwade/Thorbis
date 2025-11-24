import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis Features - Everything You Need to Run Your Field Service Business";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="All Features"
			subtitle="Scheduling, invoicing, CRM, and AI - everything in one platform"
		/>,
		{
			...size,
			fonts,
		}
	);
}
