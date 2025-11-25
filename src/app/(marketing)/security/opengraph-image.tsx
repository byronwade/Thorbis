import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, GenericTemplate, getLogoDataUrl } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Security - Thorbis";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const [fonts, logoDataUrl] = await Promise.all([loadOGFonts(), getLogoDataUrl()]);

	return new ImageResponse(
		<GenericTemplate
			title="Security"
			subtitle="Enterprise-grade security for your business data"
			logoDataUrl={logoDataUrl}
		/>,
		{
			...size,
			fonts,
		}
	);
}
