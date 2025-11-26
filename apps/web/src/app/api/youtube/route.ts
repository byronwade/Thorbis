/**
 * YouTube Data API Route
 *
 * Provides YouTube video and channel operations.
 *
 * POST /api/youtube
 * - action: "search" | "video" | "videos" | "channel" | "playlist" | "playlist-items" | "comments" | "categories" | "tutorials"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleYouTubeService } from "@/lib/services/google-youtube-service";

const SearchOptionsSchema = z
	.object({
		maxResults: z.number().min(1).max(50).optional(),
		pageToken: z.string().optional(),
		order: z
			.enum(["date", "rating", "relevance", "title", "videoCount", "viewCount"])
			.optional(),
		type: z.array(z.enum(["video", "channel", "playlist"])).optional(),
		publishedAfter: z.string().optional(),
		publishedBefore: z.string().optional(),
		regionCode: z.string().optional(),
		videoDuration: z.enum(["any", "short", "medium", "long"]).optional(),
		videoDefinition: z.enum(["any", "high", "standard"]).optional(),
		videoType: z.enum(["any", "episode", "movie"]).optional(),
		channelId: z.string().optional(),
		relatedToVideoId: z.string().optional(),
		safeSearch: z.enum(["moderate", "none", "strict"]).optional(),
	})
	.optional();

const SearchRequestSchema = z.object({
	action: z.literal("search"),
	query: z.string().min(1),
	options: SearchOptionsSchema,
});

const VideoRequestSchema = z.object({
	action: z.literal("video"),
	videoId: z.string(),
});

const VideosRequestSchema = z.object({
	action: z.literal("videos"),
	videoIds: z.array(z.string()).min(1).max(50),
});

const ChannelRequestSchema = z.object({
	action: z.literal("channel"),
	channelId: z.string(),
});

const PlaylistRequestSchema = z.object({
	action: z.literal("playlist"),
	playlistId: z.string(),
});

const PlaylistItemsRequestSchema = z.object({
	action: z.literal("playlist-items"),
	playlistId: z.string(),
	maxResults: z.number().min(1).max(50).optional(),
	pageToken: z.string().optional(),
});

const CommentsRequestSchema = z.object({
	action: z.literal("comments"),
	videoId: z.string(),
	maxResults: z.number().min(1).max(100).optional(),
	pageToken: z.string().optional(),
	order: z.enum(["time", "relevance"]).optional(),
});

const CategoriesRequestSchema = z.object({
	action: z.literal("categories"),
	regionCode: z.string().optional(),
});

const TutorialsRequestSchema = z.object({
	action: z.literal("tutorials"),
	topic: z.string(),
	maxResults: z.number().min(1).max(25).optional(),
});

const EmbedUrlRequestSchema = z.object({
	action: z.literal("embed-url"),
	videoId: z.string(),
	autoplay: z.boolean().optional(),
	mute: z.boolean().optional(),
	loop: z.boolean().optional(),
});

const ThumbnailUrlRequestSchema = z.object({
	action: z.literal("thumbnail-url"),
	videoId: z.string(),
	quality: z
		.enum(["default", "medium", "high", "standard", "maxres"])
		.optional(),
});

const YouTubeRequestSchema = z.discriminatedUnion("action", [
	SearchRequestSchema,
	VideoRequestSchema,
	VideosRequestSchema,
	ChannelRequestSchema,
	PlaylistRequestSchema,
	PlaylistItemsRequestSchema,
	CommentsRequestSchema,
	CategoriesRequestSchema,
	TutorialsRequestSchema,
	EmbedUrlRequestSchema,
	ThumbnailUrlRequestSchema,
]);

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!googleYouTubeService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"YouTube service is not configured. Set GOOGLE_YOUTUBE_API_KEY or GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = YouTubeRequestSchema.parse(body);

		switch (validatedData.action) {
			case "search": {
				const result = await googleYouTubeService.search(
					validatedData.query,
					validatedData.options || {},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to search YouTube" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "video": {
				const result = await googleYouTubeService.getVideo(
					validatedData.videoId,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Video not found" },
						{ status: 404 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "videos": {
				const result = await googleYouTubeService.getVideos(
					validatedData.videoIds,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to get videos" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { videos: result, count: result.length },
				});
			}

			case "channel": {
				const result = await googleYouTubeService.getChannel(
					validatedData.channelId,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Channel not found" },
						{ status: 404 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "playlist": {
				const result = await googleYouTubeService.getPlaylist(
					validatedData.playlistId,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Playlist not found" },
						{ status: 404 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "playlist-items": {
				const result = await googleYouTubeService.getPlaylistItems(
					validatedData.playlistId,
					{
						maxResults: validatedData.maxResults,
						pageToken: validatedData.pageToken,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to get playlist items" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "comments": {
				const result = await googleYouTubeService.getComments(
					validatedData.videoId,
					{
						maxResults: validatedData.maxResults,
						pageToken: validatedData.pageToken,
						order: validatedData.order,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to get comments" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "categories": {
				const result = await googleYouTubeService.getCategories(
					validatedData.regionCode,
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to get categories" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { categories: result },
				});
			}

			case "tutorials": {
				const result = await googleYouTubeService.searchTutorials(
					validatedData.topic,
					{ maxResults: validatedData.maxResults },
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to search tutorials" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { tutorials: result, count: result.length },
				});
			}

			case "embed-url": {
				const url = googleYouTubeService.getEmbedUrl(validatedData.videoId, {
					autoplay: validatedData.autoplay,
					mute: validatedData.mute,
					loop: validatedData.loop,
				});

				return NextResponse.json({ success: true, data: { url } });
			}

			case "thumbnail-url": {
				const url = googleYouTubeService.getThumbnailUrl(
					validatedData.videoId,
					validatedData.quality,
				);

				return NextResponse.json({ success: true, data: { url } });
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("YouTube API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process YouTube request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
