/**
 * Google Custom Search Service
 *
 * Provides web search capabilities for the AI agent:
 * - General web search
 * - News search
 * - Image search
 * - Site-specific search
 *
 * API: Google Custom Search JSON API
 * Free Tier: 100 queries/day free, then $5/1000 queries
 * Docs: https://developers.google.com/custom-search/v1/overview
 *
 * Setup:
 * 1. Enable Custom Search API in Google Cloud Console
 * 2. Create a Programmable Search Engine at https://programmablesearchengine.google.com/
 * 3. Get your Search Engine ID (cx parameter)
 * 4. Set GOOGLE_SEARCH_ENGINE_ID in environment
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

// Zod schemas for type safety
const SearchResultSchema = z.object({
	title: z.string(),
	link: z.string().url(),
	snippet: z.string(),
	displayLink: z.string(),
	formattedUrl: z.string().optional(),
	pagemap: z
		.object({
			cse_thumbnail: z
				.array(
					z.object({
						src: z.string(),
						width: z.string().optional(),
						height: z.string().optional(),
					}),
				)
				.optional(),
			metatags: z.array(z.record(z.string())).optional(),
		})
		.optional(),
});

const SearchResponseSchema = z.object({
	results: z.array(SearchResultSchema),
	totalResults: z.number(),
	searchTime: z.number(),
	query: z.string(),
	searchType: z.enum(["web", "news", "image"]),
	nextPageToken: z.string().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

/**
 * Search options
 */
export interface SearchOptions {
	/** Number of results to return (max 10 per request) */
	num?: number;
	/** Starting index for pagination (1-based) */
	start?: number;
	/** Restrict to specific site (e.g., "reddit.com") */
	siteSearch?: string;
	/** Exclude results from site */
	siteSearchExclude?: string;
	/** Date restriction: d[number], w[number], m[number], y[number] */
	dateRestrict?: string;
	/** Safe search level */
	safe?: "off" | "medium" | "high";
	/** Filter adult content */
	filter?: "0" | "1";
	/** Country to search from (ISO 3166-1 alpha-2) */
	gl?: string;
	/** Language of results (ISO 639-1) */
	lr?: string;
	/** Sort by date (if supported) */
	sort?: "date" | "relevance";
}

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleCustomSearchService {
	private readonly apiKey: string | undefined;
	private readonly searchEngineId: string | undefined;
	private readonly cache: Map<
		string,
		{ data: SearchResponse; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;
		this.searchEngineId =
			process.env.GOOGLE_SEARCH_ENGINE_ID ||
			process.env.GOOGLE_CSE_ID ||
			process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID;
	}

	/**
	 * Perform a web search
	 */
	async search(
		query: string,
		options: SearchOptions = {},
	): Promise<SearchResponse | null> {
		if (!this.apiKey || !this.searchEngineId) {
			console.warn(
				"Google Custom Search not configured: missing API key or Search Engine ID",
			);
			return null;
		}

		const cacheKey = this.getCacheKey(query, options, "web");
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			const params = this.buildParams(query, options);
			const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;

			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				const error = await response.json();
				console.error("Google Custom Search error:", error);
				return null;
			}

			const data = await response.json();
			const searchResponse = this.parseResponse(data, query, "web");

			this.cache.set(cacheKey, { data: searchResponse, timestamp: Date.now() });
			return searchResponse;
		} catch (error) {
			console.error("Google Custom Search failed:", error);
			return null;
		}
	}

	/**
	 * Search for news articles
	 * Uses date restriction to get recent results
	 */
	async searchNews(
		query: string,
		options: SearchOptions & { daysBack?: number } = {},
	): Promise<SearchResponse | null> {
		const { daysBack = 7, ...searchOptions } = options;

		// Add date restriction for recent news
		const newsOptions: SearchOptions = {
			...searchOptions,
			dateRestrict: `d${daysBack}`,
			sort: "date",
		};

		const cacheKey = this.getCacheKey(query, newsOptions, "news");
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		const result = await this.search(query, newsOptions);
		if (result) {
			result.searchType = "news";
			this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
		}
		return result;
	}

	/**
	 * Search for images
	 */
	async searchImages(
		query: string,
		options: SearchOptions = {},
	): Promise<SearchResponse | null> {
		if (!this.apiKey || !this.searchEngineId) {
			console.warn("Google Custom Search not configured");
			return null;
		}

		const cacheKey = this.getCacheKey(query, options, "image");
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data;
		}

		try {
			const params = this.buildParams(query, options);
			params.set("searchType", "image");

			const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;

			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				const error = await response.json();
				console.error("Google Image Search error:", error);
				return null;
			}

			const data = await response.json();
			const searchResponse = this.parseImageResponse(data, query);

			this.cache.set(cacheKey, { data: searchResponse, timestamp: Date.now() });
			return searchResponse;
		} catch (error) {
			console.error("Google Image Search failed:", error);
			return null;
		}
	}

	/**
	 * Search within a specific site
	 */
	async searchSite(
		query: string,
		site: string,
		options: SearchOptions = {},
	): Promise<SearchResponse | null> {
		return this.search(query, {
			...options,
			siteSearch: site,
		});
	}

	/**
	 * Search for technical/documentation content
	 * Focuses on official docs, Stack Overflow, GitHub
	 */
	async searchTechnical(
		query: string,
		options: SearchOptions = {},
	): Promise<SearchResponse | null> {
		// Append technical terms to improve results
		const technicalQuery = `${query} documentation OR tutorial OR guide`;
		return this.search(technicalQuery, options);
	}

	/**
	 * Build URL params for API request
	 */
	private buildParams(query: string, options: SearchOptions): URLSearchParams {
		const params = new URLSearchParams({
			key: this.apiKey!,
			cx: this.searchEngineId!,
			q: query,
		});

		if (options.num) params.set("num", String(Math.min(options.num, 10)));
		if (options.start) params.set("start", String(options.start));
		if (options.siteSearch) params.set("siteSearch", options.siteSearch);
		if (options.siteSearchExclude) {
			params.set("siteSearch", options.siteSearchExclude);
			params.set("siteSearchFilter", "e");
		}
		if (options.dateRestrict) params.set("dateRestrict", options.dateRestrict);
		if (options.safe) params.set("safe", options.safe);
		if (options.filter) params.set("filter", options.filter);
		if (options.gl) params.set("gl", options.gl);
		if (options.lr) params.set("lr", options.lr);
		if (options.sort === "date") params.set("sort", "date");

		return params;
	}

	/**
	 * Parse API response into our schema
	 */
	private parseResponse(
		data: Record<string, unknown>,
		query: string,
		searchType: "web" | "news" | "image",
	): SearchResponse {
		const items = (data.items as Array<Record<string, unknown>>) || [];
		const searchInfo = data.searchInformation as
			| { totalResults?: string; searchTime?: number }
			| undefined;

		return {
			results: items.map((item) => ({
				title: (item.title as string) || "",
				link: (item.link as string) || "",
				snippet: (item.snippet as string) || "",
				displayLink: (item.displayLink as string) || "",
				formattedUrl: item.formattedUrl as string | undefined,
				pagemap: item.pagemap as SearchResult["pagemap"],
			})),
			totalResults: Number.parseInt(searchInfo?.totalResults || "0", 10),
			searchTime: searchInfo?.searchTime || 0,
			query,
			searchType,
			nextPageToken: data.queries
				? (
						data.queries as Record<string, Array<{ startIndex: number }>>
					).nextPage?.[0]?.startIndex?.toString()
				: undefined,
		};
	}

	/**
	 * Parse image search response
	 */
	private parseImageResponse(
		data: Record<string, unknown>,
		query: string,
	): SearchResponse {
		const items = (data.items as Array<Record<string, unknown>>) || [];
		const searchInfo = data.searchInformation as
			| { totalResults?: string; searchTime?: number }
			| undefined;

		return {
			results: items.map((item) => ({
				title: (item.title as string) || "",
				link: (item.link as string) || "",
				snippet: (item.snippet as string) || "",
				displayLink: (item.displayLink as string) || "",
				formattedUrl: (item.image as { contextLink?: string })?.contextLink,
				pagemap: {
					cse_thumbnail: [
						{
							src:
								(item.image as { thumbnailLink?: string })?.thumbnailLink ||
								(item.link as string),
							width: String(
								(item.image as { thumbnailWidth?: number })?.thumbnailWidth ||
									"",
							),
							height: String(
								(item.image as { thumbnailHeight?: number })?.thumbnailHeight ||
									"",
							),
						},
					],
				},
			})),
			totalResults: Number.parseInt(searchInfo?.totalResults || "0", 10),
			searchTime: searchInfo?.searchTime || 0,
			query,
			searchType: "image",
		};
	}

	/**
	 * Generate cache key
	 */
	private getCacheKey(
		query: string,
		options: SearchOptions,
		type: string,
	): string {
		return `search:${type}:${query}:${JSON.stringify(options)}`;
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey && !!this.searchEngineId;
	}

	/**
	 * Get configuration status details
	 */
	getConfigStatus(): {
		configured: boolean;
		hasApiKey: boolean;
		hasSearchEngineId: boolean;
	} {
		return {
			configured: this.isConfigured(),
			hasApiKey: !!this.apiKey,
			hasSearchEngineId: !!this.searchEngineId,
		};
	}

	/**
	 * Clear the cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

export const googleCustomSearchService = new GoogleCustomSearchService();
