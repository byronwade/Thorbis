import { ImageResponse } from "next/og";
import {
	FeatureTemplate,
	getLogoDataUrl,
	loadOGFonts,
	OG_CONFIG,
} from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt =
	"Customer Portal - Self-Service Booking | +30% Online Bookings";
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
		<FeatureTemplate slug="customer-portal" logoDataUrl={logoDataUrl} />,
		{
			...size,
			fonts,
		},
	);
}
