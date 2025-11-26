import { ImageResponse } from "next/og";
import {
	getLogoDataUrl,
	HomepageTemplate,
	loadOGFonts,
	OG_CONFIG,
} from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis - Run Your Entire Business For $200/month";
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

	return new ImageResponse(<HomepageTemplate logoDataUrl={logoDataUrl} />, {
		...size,
		fonts,
	});
}
