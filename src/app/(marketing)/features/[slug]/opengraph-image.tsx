import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, FeatureTemplate } from "@/lib/og";

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis Feature";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const fonts = await loadOGFonts();

	return new ImageResponse(<FeatureTemplate slug={slug} />, {
		...size,
		fonts,
	});
}
