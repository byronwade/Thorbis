import { ImageResponse } from "next/og";
import {
	GenericTemplate,
	getLogoDataUrl,
	loadOGFonts,
	OG_CONFIG,
} from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Thorbis Integrations - Connect Your Favorite Tools";
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
			title="Integrations"
			subtitle="Connect QuickBooks, Stripe, Google Calendar, and more"
			logoDataUrl={logoDataUrl}
		/>,
		{
			...size,
			fonts,
		},
	);
}
