import { ImageResponse } from "next/og";
import {
	CompetitorTemplate,
	getLogoDataUrl,
	loadOGFonts,
	OG_CONFIG,
} from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt =
	"Thorbis vs Housecall Pro - Save $4,800/Year | No Per-User Fees";
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
		<CompetitorTemplate slug="housecall-pro" logoDataUrl={logoDataUrl} />,
		{
			...size,
			fonts,
		},
	);
}
