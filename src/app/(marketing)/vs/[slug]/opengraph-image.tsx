import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, CompetitorTemplate } from "@/lib/og";

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis vs Competitors - Compare Field Service Software";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const fonts = await loadOGFonts();

	const competitorNames: Record<string, string> = {
		servicetitan: "ServiceTitan",
		"housecall-pro": "Housecall Pro",
		jobber: "Jobber",
		fieldedge: "FieldEdge",
		servicem8: "ServiceM8",
		workiz: "Workiz",
	};

	const competitorName = competitorNames[slug] || slug;

	return new ImageResponse(
		<CompetitorTemplate slug={slug} competitorName={competitorName} />,
		{
			...size,
			fonts,
		}
	);
}
