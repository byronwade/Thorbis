import { ImageResponse } from "next/og";
import { loadOGFonts, OG_CONFIG, KBTemplate } from "@/lib/og";

export const size = {
	width: OG_CONFIG.width,
	height: OG_CONFIG.height,
};
export const contentType = "image/png";
export const alt = "Thorbis Help Center";

export default async function Image({
	params,
}: {
	params: Promise<{ category: string; slug: string }>;
}) {
	const { category, slug } = await params;
	const fonts = await loadOGFonts();

	// Format slug to title
	const title = slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	// Format category
	const categoryName = category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return new ImageResponse(<KBTemplate title={title} category={categoryName} />, {
		...size,
		fonts,
	});
}
