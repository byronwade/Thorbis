import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, FeatureTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const alt = "Customer Portal - Self-Service Booking That Customers Love";
export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export default async function Image() {
	const fonts = await loadOGFonts();

	return new ImageResponse(<FeatureTemplate slug="customer-portal" />, {
		...size,
		fonts,
	});
}
