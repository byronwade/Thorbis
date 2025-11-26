import { ImageResponse } from "next/og";
import type { IndustrySlug } from "@/lib/og";
import {
	getLogoDataUrl,
	IndustryTemplate,
	loadOGFonts,
	OG_CONFIG,
} from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";

export const alt = "Thorbis Field Service Management";

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const [fonts, logoDataUrl] = await Promise.all([
		loadOGFonts(),
		getLogoDataUrl(),
	]);

	return new ImageResponse(
		<IndustryTemplate slug={slug as IndustrySlug} logoDataUrl={logoDataUrl} />,
		{
			...size,
			fonts,
		},
	);
}
