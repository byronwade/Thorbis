import { ImageResponse } from "next/og";
import {
	GenericTemplate,
	getLogoDataUrl,
	loadOGFonts,
	OG_CONFIG,
} from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis Case Studies - Real Results from Real Contractors";
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
			title="Case Studies"
			subtitle="Real results from contractors who switched to Thorbis"
			logoDataUrl={logoDataUrl}
		/>,
		{
			...size,
			fonts,
		},
	);
}
