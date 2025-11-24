import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, KBTemplate } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 86400; // 24 hours

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis Help Center";

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params;
	const fonts = await loadOGFonts();

	const categoryName = category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return new ImageResponse(
		<KBTemplate title={categoryName} category="Help Center" />,
		{
			...size,
			fonts,
		}
	);
}
