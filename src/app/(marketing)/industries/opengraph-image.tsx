import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, GenericTemplate, getLogoDataUrl } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Field Service Software for Every Trade | $200/mo All Industries";
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
		<GenericTemplate
			title="Software for Every Trade"
			subtitle="HVAC, Plumbing, Electrical, Landscaping & 10+ More Industries"
			logoDataUrl={logoDataUrl}
		/>,
		{
			...size,
			fonts,
		}
	);
}
