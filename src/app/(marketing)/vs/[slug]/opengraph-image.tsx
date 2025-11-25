import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CompetitorTemplate, getLogoDataUrl } from "@/lib/og";
import type { CompetitorSlug } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis vs Competitors - Compare Field Service Software";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const [fonts, logoDataUrl] = await Promise.all([loadOGFonts(), getLogoDataUrl()]);

	return new ImageResponse(
		<CompetitorTemplate slug={slug as CompetitorSlug} logoDataUrl={logoDataUrl} />,
		{
			...size,
			fonts,
		}
	);
}
