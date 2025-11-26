/**
 * Google YouTube Data API Service
 *
 * Provides YouTube video and channel operations.
 * - Search videos
 * - Get video details
 * - Manage playlists
 * - Get channel information
 * - Retrieve comments
 *
 * API: YouTube Data API v3
 * Docs: https://developers.google.com/youtube/v3
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Video resource
 */
export interface YouTubeVideo {
	id: string;
	title: string;
	description: string;
	publishedAt: string;
	channelId: string;
	channelTitle: string;
	thumbnails: {
		default?: { url: string; width: number; height: number };
		medium?: { url: string; width: number; height: number };
		high?: { url: string; width: number; height: number };
		standard?: { url: string; width: number; height: number };
		maxres?: { url: string; width: number; height: number };
	};
	tags?: string[];
	categoryId?: string;
	duration?: string;
	viewCount?: number;
	likeCount?: number;
	commentCount?: number;
	embedHtml?: string;
}

/**
 * Channel resource
 */
export interface YouTubeChannel {
	id: string;
	title: string;
	description: string;
	customUrl?: string;
	publishedAt: string;
	thumbnails: {
		default?: { url: string; width: number; height: number };
		medium?: { url: string; width: number; height: number };
		high?: { url: string; width: number; height: number };
	};
	subscriberCount?: number;
	videoCount?: number;
	viewCount?: number;
}

/**
 * Playlist resource
 */
export interface YouTubePlaylist {
	id: string;
	title: string;
	description: string;
	publishedAt: string;
	channelId: string;
	channelTitle: string;
	thumbnails: {
		default?: { url: string; width: number; height: number };
		medium?: { url: string; width: number; height: number };
		high?: { url: string; width: number; height: number };
	};
	itemCount: number;
}

/**
 * Playlist item
 */
export interface YouTubePlaylistItem {
	id: string;
	playlistId: string;
	position: number;
	videoId: string;
	title: string;
	description: string;
	thumbnails: {
		default?: { url: string; width: number; height: number };
		medium?: { url: string; width: number; height: number };
		high?: { url: string; width: number; height: number };
	};
	channelId: string;
	channelTitle: string;
}

/**
 * Comment resource
 */
export interface YouTubeComment {
	id: string;
	videoId: string;
	authorDisplayName: string;
	authorProfileImageUrl: string;
	authorChannelId: string;
	textDisplay: string;
	textOriginal: string;
	likeCount: number;
	publishedAt: string;
	updatedAt: string;
	parentId?: string;
	totalReplyCount?: number;
}

/**
 * Search result
 */
export interface YouTubeSearchResult {
	id: string;
	type: "video" | "channel" | "playlist";
	title: string;
	description: string;
	publishedAt: string;
	channelId: string;
	channelTitle: string;
	thumbnails: {
		default?: { url: string; width: number; height: number };
		medium?: { url: string; width: number; height: number };
		high?: { url: string; width: number; height: number };
	};
}

/**
 * Search options
 */
export interface YouTubeSearchOptions {
	maxResults?: number;
	pageToken?: string;
	order?:
		| "date"
		| "rating"
		| "relevance"
		| "title"
		| "videoCount"
		| "viewCount";
	type?: ("video" | "channel" | "playlist")[];
	publishedAfter?: string;
	publishedBefore?: string;
	regionCode?: string;
	videoDuration?: "any" | "short" | "medium" | "long";
	videoDefinition?: "any" | "high" | "standard";
	videoType?: "any" | "episode" | "movie";
	channelId?: string;
	relatedToVideoId?: string;
	safeSearch?: "moderate" | "none" | "strict";
}

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleYouTubeService {
	private readonly apiKey: string | undefined;
	private readonly baseUrl = "https://www.googleapis.com/youtube/v3";
	private readonly cache: Map<string, { data: unknown; timestamp: number }> =
		new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey =
			process.env.GOOGLE_YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY;
	}

	/**
	 * Generate cache key
	 */
	private generateCacheKey(method: string, params: unknown): string {
		return `youtube:${method}:${JSON.stringify(params)}`;
	}

	/**
	 * Get from cache
	 */
	private getFromCache<T>(key: string): T | null {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data as T;
		}
		return null;
	}

	/**
	 * Set in cache
	 */
	private setInCache(key: string, data: unknown): void {
		this.cache.set(key, { data, timestamp: Date.now() });
	}

	/**
	 * Parse duration string (PT1H2M3S) to seconds
	 */
	private parseDuration(duration: string): number {
		const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
		if (!match) return 0;
		const hours = Number.parseInt(match[1] || "0", 10);
		const minutes = Number.parseInt(match[2] || "0", 10);
		const seconds = Number.parseInt(match[3] || "0", 10);
		return hours * 3600 + minutes * 60 + seconds;
	}

	/**
	 * Search YouTube
	 */
	async search(
		query: string,
		options: YouTubeSearchOptions = {},
	): Promise<{
		results: YouTubeSearchResult[];
		nextPageToken?: string;
		totalResults: number;
	} | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey("search", { query, options });
		const cached = this.getFromCache<{
			results: YouTubeSearchResult[];
			nextPageToken?: string;
			totalResults: number;
		}>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet",
				q: query,
				maxResults: (options.maxResults || 25).toString(),
			});

			if (options.pageToken) params.append("pageToken", options.pageToken);
			if (options.order) params.append("order", options.order);
			if (options.type) params.append("type", options.type.join(","));
			if (options.publishedAfter)
				params.append("publishedAfter", options.publishedAfter);
			if (options.publishedBefore)
				params.append("publishedBefore", options.publishedBefore);
			if (options.regionCode) params.append("regionCode", options.regionCode);
			if (options.videoDuration)
				params.append("videoDuration", options.videoDuration);
			if (options.videoDefinition)
				params.append("videoDefinition", options.videoDefinition);
			if (options.videoType) params.append("videoType", options.videoType);
			if (options.channelId) params.append("channelId", options.channelId);
			if (options.relatedToVideoId)
				params.append("relatedToVideoId", options.relatedToVideoId);
			if (options.safeSearch) params.append("safeSearch", options.safeSearch);

			const url = `${this.baseUrl}/search?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube search error:", response.status);
				return null;
			}

			const data = await response.json();

			const results: YouTubeSearchResult[] = (data.items || []).map(
				(item: Record<string, unknown>) => {
					const snippet = item.snippet as Record<string, unknown>;
					const id = item.id as Record<string, string>;
					return {
						id: id.videoId || id.channelId || id.playlistId || "",
						type: id.videoId ? "video" : id.channelId ? "channel" : "playlist",
						title: snippet.title as string,
						description: snippet.description as string,
						publishedAt: snippet.publishedAt as string,
						channelId: snippet.channelId as string,
						channelTitle: snippet.channelTitle as string,
						thumbnails: snippet.thumbnails as YouTubeSearchResult["thumbnails"],
					};
				},
			);

			const result = {
				results,
				nextPageToken: data.nextPageToken,
				totalResults: data.pageInfo?.totalResults || 0,
			};

			this.setInCache(cacheKey, result);
			return result;
		} catch (error) {
			console.error("YouTube search error:", error);
			return null;
		}
	}

	/**
	 * Get video details
	 */
	async getVideo(videoId: string): Promise<YouTubeVideo | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey("video", { videoId });
		const cached = this.getFromCache<YouTubeVideo>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet,contentDetails,statistics,player",
				id: videoId,
			});

			const url = `${this.baseUrl}/videos?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube get video error:", response.status);
				return null;
			}

			const data = await response.json();

			if (!data.items || data.items.length === 0) {
				return null;
			}

			const item = data.items[0];
			const video: YouTubeVideo = {
				id: item.id,
				title: item.snippet.title,
				description: item.snippet.description,
				publishedAt: item.snippet.publishedAt,
				channelId: item.snippet.channelId,
				channelTitle: item.snippet.channelTitle,
				thumbnails: item.snippet.thumbnails,
				tags: item.snippet.tags,
				categoryId: item.snippet.categoryId,
				duration: item.contentDetails?.duration,
				viewCount: Number.parseInt(item.statistics?.viewCount || "0", 10),
				likeCount: Number.parseInt(item.statistics?.likeCount || "0", 10),
				commentCount: Number.parseInt(item.statistics?.commentCount || "0", 10),
				embedHtml: item.player?.embedHtml,
			};

			this.setInCache(cacheKey, video);
			return video;
		} catch (error) {
			console.error("YouTube get video error:", error);
			return null;
		}
	}

	/**
	 * Get multiple videos
	 */
	async getVideos(videoIds: string[]): Promise<YouTubeVideo[] | null> {
		if (!this.apiKey || videoIds.length === 0) {
			return null;
		}

		// Process in batches of 50 (API limit)
		const batchSize = 50;
		const videos: YouTubeVideo[] = [];

		for (let i = 0; i < videoIds.length; i += batchSize) {
			const batch = videoIds.slice(i, i + batchSize);

			try {
				const params = new URLSearchParams({
					key: this.apiKey,
					part: "snippet,contentDetails,statistics",
					id: batch.join(","),
				});

				const url = `${this.baseUrl}/videos?${params.toString()}`;
				const response = await fetch(url, {
					headers: { "User-Agent": USER_AGENT },
				});

				if (!response.ok) {
					continue;
				}

				const data = await response.json();

				for (const item of data.items || []) {
					videos.push({
						id: item.id,
						title: item.snippet.title,
						description: item.snippet.description,
						publishedAt: item.snippet.publishedAt,
						channelId: item.snippet.channelId,
						channelTitle: item.snippet.channelTitle,
						thumbnails: item.snippet.thumbnails,
						tags: item.snippet.tags,
						categoryId: item.snippet.categoryId,
						duration: item.contentDetails?.duration,
						viewCount: Number.parseInt(item.statistics?.viewCount || "0", 10),
						likeCount: Number.parseInt(item.statistics?.likeCount || "0", 10),
						commentCount: Number.parseInt(
							item.statistics?.commentCount || "0",
							10,
						),
					});
				}
			} catch (error) {
				console.error("YouTube batch get videos error:", error);
			}
		}

		return videos;
	}

	/**
	 * Get channel details
	 */
	async getChannel(channelId: string): Promise<YouTubeChannel | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey("channel", { channelId });
		const cached = this.getFromCache<YouTubeChannel>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet,statistics",
				id: channelId,
			});

			const url = `${this.baseUrl}/channels?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube get channel error:", response.status);
				return null;
			}

			const data = await response.json();

			if (!data.items || data.items.length === 0) {
				return null;
			}

			const item = data.items[0];
			const channel: YouTubeChannel = {
				id: item.id,
				title: item.snippet.title,
				description: item.snippet.description,
				customUrl: item.snippet.customUrl,
				publishedAt: item.snippet.publishedAt,
				thumbnails: item.snippet.thumbnails,
				subscriberCount: Number.parseInt(
					item.statistics?.subscriberCount || "0",
					10,
				),
				videoCount: Number.parseInt(item.statistics?.videoCount || "0", 10),
				viewCount: Number.parseInt(item.statistics?.viewCount || "0", 10),
			};

			this.setInCache(cacheKey, channel);
			return channel;
		} catch (error) {
			console.error("YouTube get channel error:", error);
			return null;
		}
	}

	/**
	 * Get playlist details
	 */
	async getPlaylist(playlistId: string): Promise<YouTubePlaylist | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey("playlist", { playlistId });
		const cached = this.getFromCache<YouTubePlaylist>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet,contentDetails",
				id: playlistId,
			});

			const url = `${this.baseUrl}/playlists?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube get playlist error:", response.status);
				return null;
			}

			const data = await response.json();

			if (!data.items || data.items.length === 0) {
				return null;
			}

			const item = data.items[0];
			const playlist: YouTubePlaylist = {
				id: item.id,
				title: item.snippet.title,
				description: item.snippet.description,
				publishedAt: item.snippet.publishedAt,
				channelId: item.snippet.channelId,
				channelTitle: item.snippet.channelTitle,
				thumbnails: item.snippet.thumbnails,
				itemCount: item.contentDetails?.itemCount || 0,
			};

			this.setInCache(cacheKey, playlist);
			return playlist;
		} catch (error) {
			console.error("YouTube get playlist error:", error);
			return null;
		}
	}

	/**
	 * Get playlist items
	 */
	async getPlaylistItems(
		playlistId: string,
		options: { maxResults?: number; pageToken?: string } = {},
	): Promise<{
		items: YouTubePlaylistItem[];
		nextPageToken?: string;
		totalResults: number;
	} | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet,contentDetails",
				playlistId,
				maxResults: (options.maxResults || 50).toString(),
			});

			if (options.pageToken) params.append("pageToken", options.pageToken);

			const url = `${this.baseUrl}/playlistItems?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube get playlist items error:", response.status);
				return null;
			}

			const data = await response.json();

			const items: YouTubePlaylistItem[] = (data.items || []).map(
				(item: Record<string, unknown>) => {
					const snippet = item.snippet as Record<string, unknown>;
					return {
						id: item.id as string,
						playlistId: snippet.playlistId as string,
						position: snippet.position as number,
						videoId: (snippet.resourceId as { videoId: string })?.videoId || "",
						title: snippet.title as string,
						description: snippet.description as string,
						thumbnails: snippet.thumbnails as YouTubePlaylistItem["thumbnails"],
						channelId: snippet.channelId as string,
						channelTitle: snippet.channelTitle as string,
					};
				},
			);

			return {
				items,
				nextPageToken: data.nextPageToken,
				totalResults: data.pageInfo?.totalResults || 0,
			};
		} catch (error) {
			console.error("YouTube get playlist items error:", error);
			return null;
		}
	}

	/**
	 * Get video comments
	 */
	async getComments(
		videoId: string,
		options: {
			maxResults?: number;
			pageToken?: string;
			order?: "time" | "relevance";
		} = {},
	): Promise<{
		comments: YouTubeComment[];
		nextPageToken?: string;
		totalResults: number;
	} | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet",
				videoId,
				maxResults: (options.maxResults || 100).toString(),
				order: options.order || "relevance",
			});

			if (options.pageToken) params.append("pageToken", options.pageToken);

			const url = `${this.baseUrl}/commentThreads?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube get comments error:", response.status);
				return null;
			}

			const data = await response.json();

			const comments: YouTubeComment[] = (data.items || []).map(
				(item: Record<string, unknown>) => {
					const snippet = (
						item.snippet as {
							topLevelComment: { snippet: Record<string, unknown> };
						}
					).topLevelComment.snippet;
					return {
						id: item.id as string,
						videoId: snippet.videoId as string,
						authorDisplayName: snippet.authorDisplayName as string,
						authorProfileImageUrl: snippet.authorProfileImageUrl as string,
						authorChannelId:
							(snippet.authorChannelId as { value: string })?.value || "",
						textDisplay: snippet.textDisplay as string,
						textOriginal: snippet.textOriginal as string,
						likeCount: snippet.likeCount as number,
						publishedAt: snippet.publishedAt as string,
						updatedAt: snippet.updatedAt as string,
						totalReplyCount: (item.snippet as { totalReplyCount: number })
							?.totalReplyCount,
					};
				},
			);

			return {
				comments,
				nextPageToken: data.nextPageToken,
				totalResults: data.pageInfo?.totalResults || 0,
			};
		} catch (error) {
			console.error("YouTube get comments error:", error);
			return null;
		}
	}

	/**
	 * Get video categories
	 */
	async getCategories(
		regionCode = "US",
	): Promise<{ id: string; title: string }[] | null> {
		if (!this.apiKey) {
			console.warn("YouTube API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey("categories", { regionCode });
		const cached = this.getFromCache<{ id: string; title: string }[]>(cacheKey);
		if (cached) return cached;

		try {
			const params = new URLSearchParams({
				key: this.apiKey,
				part: "snippet",
				regionCode,
			});

			const url = `${this.baseUrl}/videoCategories?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("YouTube get categories error:", response.status);
				return null;
			}

			const data = await response.json();

			const categories = (data.items || []).map(
				(item: { id: string; snippet: { title: string } }) => ({
					id: item.id,
					title: item.snippet.title,
				}),
			);

			this.setInCache(cacheKey, categories);
			return categories;
		} catch (error) {
			console.error("YouTube get categories error:", error);
			return null;
		}
	}

	/**
	 * Search for how-to/tutorial videos related to field service
	 */
	async searchTutorials(
		topic: string,
		options: { maxResults?: number } = {},
	): Promise<YouTubeSearchResult[] | null> {
		const query = `${topic} tutorial how to field service HVAC plumbing electrical`;

		const result = await this.search(query, {
			maxResults: options.maxResults || 10,
			type: ["video"],
			order: "relevance",
			videoDuration: "medium",
			safeSearch: "strict",
		});

		return result?.results || null;
	}

	/**
	 * Get embed URL for a video
	 */
	getEmbedUrl(
		videoId: string,
		options: { autoplay?: boolean; mute?: boolean; loop?: boolean } = {},
	): string {
		const params = new URLSearchParams();
		if (options.autoplay) params.append("autoplay", "1");
		if (options.mute) params.append("mute", "1");
		if (options.loop) params.append("loop", "1");

		const queryString = params.toString();
		return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`;
	}

	/**
	 * Get video thumbnail URL
	 */
	getThumbnailUrl(
		videoId: string,
		quality: "default" | "medium" | "high" | "standard" | "maxres" = "high",
	): string {
		const qualityMap: Record<string, string> = {
			default: "default",
			medium: "mqdefault",
			high: "hqdefault",
			standard: "sddefault",
			maxres: "maxresdefault",
		};
		return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

export const googleYouTubeService = new GoogleYouTubeService();
