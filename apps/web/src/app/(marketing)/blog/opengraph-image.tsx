import { ImageResponse } from "next/og";
import { BlogTemplate, getLogoDataUrl, loadOGFonts, OG_CONFIG } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis Blog - Field Service Insights & Growth Tips";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const [fonts, logoDataUrl] = await Promise.all([
		loadOGFonts(),
		getLogoDataUrl(),
	]);

	return new ImageResponse(
		<BlogTemplate
			title="Field Service Insights"
			category="Blog"
			logoDataUrl={logoDataUrl}
		/>,
		{
			...size,
			fonts,
		},
	);
}
