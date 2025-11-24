import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, PricingTemplate, getLogoDataUrl } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Save $34,600/Year vs ServiceTitan | Thorbis $200/mo = $2,400/year";
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

	return new ImageResponse(<PricingTemplate logoDataUrl={logoDataUrl} />, {
		...size,
		fonts,
	});
}
