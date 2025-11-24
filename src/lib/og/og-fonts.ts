/**
 * OG Image Font Loading
 *
 * Loads Inter font for OG image generation.
 * Uses direct GitHub raw URLs for TTF fonts (next/og doesn't support WOFF2).
 */

// Font data cache to avoid repeated fetches
const fontCache = new Map<string, ArrayBuffer>();

// Direct URLs to Inter TTF fonts from GitHub
// Using fontsource which provides reliable TTF files
const FONT_URLS: Record<number, string> = {
	400: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff",
	500: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-500-normal.woff",
	600: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-600-normal.woff",
	700: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff",
	800: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-800-normal.woff",
};

/**
 * Load Inter font with specified weight
 */
export async function loadInterFont(
	weight: 400 | 500 | 600 | 700 | 800 = 700
): Promise<ArrayBuffer> {
	const cacheKey = `inter-${weight}`;

	if (fontCache.has(cacheKey)) {
		return fontCache.get(cacheKey)!;
	}

	const fontUrl = FONT_URLS[weight];
	if (!fontUrl) {
		throw new Error(`No font URL for weight ${weight}`);
	}

	try {
		const response = await fetch(fontUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch font: ${response.status}`);
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
				const response = await fetch(fontUrl);
				if (!response.ok) {
					throw new Error(`Failed to fetch font: ${response.status}`);
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
	weight: 400 | 500 | 600 | 700 | 800 = 700
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
	const response = await fetch(fontUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch font: ${response.status}`);
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
