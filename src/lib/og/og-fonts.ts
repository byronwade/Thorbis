/**
 * OG Image Font Loading
 *
 * Loads Inter font for OG image generation.
 * Compatible with Edge Runtime (no Node.js APIs).
 */

// Font data cache to avoid repeated fetches
const fontCache = new Map<string, ArrayBuffer>();

// Font URLs (relative to public directory)
const FONT_URLS: Record<number, string> = {
	400: "/fonts/inter-400.woff",
	700: "/fonts/inter-700.woff",
};

/**
 * Load Inter font with specified weight
 */
export async function loadInterFont(
	weight: 400 | 700 = 700
): Promise<ArrayBuffer> {
	const cacheKey = `inter-${weight}`;

	if (fontCache.has(cacheKey)) {
		return fontCache.get(cacheKey)!;
	}

	const fontUrl = FONT_URLS[weight];
	if (!fontUrl) {
		throw new Error(`No font file for weight ${weight}`);
	}

	try {
		// Use fetch for Edge Runtime compatibility
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
		const response = await fetch(`${baseUrl}${fontUrl}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch font: ${response.statusText}`);
		}

		const fontData = await response.arrayBuffer();
		fontCache.set(cacheKey, fontData);
		return fontData;
	} catch (error) {
		console.error(`Failed to load Inter font (weight: ${weight}):`, error);
		throw error;
	}
}

/**
 * Load multiple font weights for OG images
 */
export async function loadOGFonts(): Promise<
	Array<{
		name: string;
		data: ArrayBuffer;
		weight: number;
		style: "normal";
	}>
> {
	// Only load the weights we actually need
	const weights = [400, 700] as const;

	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";

		const fonts = await Promise.all(
			weights.map(async (weight) => {
				const cacheKey = `inter-${weight}`;

				if (fontCache.has(cacheKey)) {
					return {
						name: "Inter",
						data: fontCache.get(cacheKey)!,
						weight,
						style: "normal" as const,
					};
				}

				const fontUrl = FONT_URLS[weight];
				const response = await fetch(`${baseUrl}${fontUrl}`);

				if (!response.ok) {
					throw new Error(`Failed to fetch font: ${response.statusText}`);
				}

				const fontData = await response.arrayBuffer();
				fontCache.set(cacheKey, fontData);
				return {
					name: "Inter",
					data: fontData,
					weight,
					style: "normal" as const,
				};
			})
		);

		return fonts;
	} catch (error) {
		console.error("Failed to load OG fonts:", error);
		throw error;
	}
}

/**
 * Load a single font weight (more efficient for simple use cases)
 */
export async function loadSingleFont(
	weight: 400 | 700 = 700
): Promise<{
	name: string;
	data: ArrayBuffer;
	weight: number;
	style: "normal";
}> {
	const cacheKey = `inter-${weight}`;

	if (fontCache.has(cacheKey)) {
		return {
			name: "Inter",
			data: fontCache.get(cacheKey)!,
			weight,
			style: "normal" as const,
		};
	}

	const fontUrl = FONT_URLS[weight];
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
	const response = await fetch(`${baseUrl}${fontUrl}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch font: ${response.statusText}`);
	}

	const fontData = await response.arrayBuffer();
	fontCache.set(cacheKey, fontData);

	return {
		name: "Inter",
		data: fontData,
		weight,
		style: "normal" as const,
	};
}
