import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, IndustryTemplate } from "@/lib/og";

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export const alt = "Thorbis Field Service Management";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const fonts = await loadOGFonts();

	return new ImageResponse(<IndustryTemplate slug={slug} />, {
		...size,
		fonts,
	});
}
