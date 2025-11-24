import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, DefaultTemplate } from "@/lib/og";

export const alt = "Thorbis Integrations - Connect Your Favorite Tools";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(
		<DefaultTemplate
			title="Integrations"
			subtitle="Connect QuickBooks, Stripe, Google Calendar, and more"
		/>,
		{
			...size,
			fonts,
		}
	);
}
