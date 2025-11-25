import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, FeatureTemplate, getLogoDataUrl } from "@/lib/og";
import type { FeatureSlug } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis Feature";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const [fonts, logoDataUrl] = await Promise.all([loadOGFonts(), getLogoDataUrl()]);

	return new ImageResponse(<FeatureTemplate slug={slug as FeatureSlug} logoDataUrl={logoDataUrl} />, {
		...size,
		fonts,
	});
}
