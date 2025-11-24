import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, BlogTemplate } from "@/lib/og";

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis Blog";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const fonts = await loadOGFonts();

	// Format slug to title
	const title = slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return new ImageResponse(<BlogTemplate title={title} category="Blog" />, {
		...size,
		fonts,
	});
}
