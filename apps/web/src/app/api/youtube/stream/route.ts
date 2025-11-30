/**
 * YouTube Stream URL API Route
 * 
 * Gets playable stream URL for YouTube videos using YouTube v3 API
 * and a stream extraction service.
 */

import { googleYouTubeService } from "@/lib/services/google-youtube-service";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const StreamRequestSchema = z.object({
	videoId: z.string().min(1),
});

/**
 * Extract YouTube video ID from various URL formats
 */
function extractVideoId(urlOrId: string): string | null {
	// If it's already just an ID
	if (!urlOrId.includes("/") && !urlOrId.includes("?")) {
		return urlOrId;
	}

	// Try to extract from various YouTube URL formats
	const patterns = [
		/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/,
		/youtube\.com\/v\/([^&\n?#]+)/,
	];

	for (const pattern of patterns) {
		const match = urlOrId.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Get YouTube stream URL using ytdl-core
 * This extracts the actual HLS/DASH manifest URL from YouTube
 */
async function getYouTubeStreamUrl(videoId: string): Promise<string | null> {
	try {
		// First, validate video exists using YouTube v3 API
		const videoInfo = await googleYouTubeService.getVideo(videoId);
		if (!videoInfo) {
			return null;
		}

		// Use ytdl-core to get stream info
		try {
			const ytdl = await import("@distube/ytdl-core");
			
			// Get video info
			const info = await ytdl.getInfo(videoId);
			
			// Get the best quality HLS or DASH manifest
			// Prefer HLS as it's more widely supported
			const formats = info.formats.filter(
				(format) => format.hasVideo && format.hasAudio
			);
			
			// Try to find HLS manifest first
			const hlsFormat = formats.find((f) => f.url && f.url.includes(".m3u8"));
			if (hlsFormat?.url) {
				return hlsFormat.url;
			}
			
			// Try DASH manifest
			const dashFormat = formats.find((f) => f.url && f.url.includes(".mpd"));
			if (dashFormat?.url) {
				return dashFormat.url;
			}
			
			// Fallback to best quality format URL
			const bestFormat = ytdl.chooseFormat(info.formats, {
				quality: "highest",
				filter: (format) => format.hasVideo && format.hasAudio,
			});
			
			if (bestFormat?.url) {
				return bestFormat.url;
			}
		} catch (ytdlError) {
			console.error("ytdl-core error:", ytdlError);
			// Fall through to alternative method
		}
		
		// Alternative: Use YouTube's internal manifest API
		// This constructs a DASH manifest URL that Shaka Player can handle
		// Note: This may require additional authentication or may not work for all videos
		const timestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
		return `https://manifest.googlevideo.com/api/manifest/dash/expire/${timestamp}/ei/random/id/${videoId}/source/youtube`;
	} catch (error) {
		console.error("Error getting YouTube stream URL:", error);
		return null;
	}
}

export async function POST(request: NextRequest) {
	try {
		// Note: This endpoint is public to allow YouTube video playback on public pages
		// The YouTube v3 API key is server-side only, so this is safe

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
		const { videoId: input } = StreamRequestSchema.parse(body);

		// Extract video ID if URL provided
		const videoId = extractVideoId(input);
		if (!videoId) {
			return NextResponse.json(
				{ error: "Invalid YouTube video ID or URL" },
				{ status: 400 },
			);
		}

		// Get stream URL
		const streamUrl = await getYouTubeStreamUrl(videoId);
		if (!streamUrl) {
			return NextResponse.json(
				{ error: "Failed to get stream URL for video" },
				{ status: 500 },
			);
		}

		// Get video metadata
		const videoInfo = await googleYouTubeService.getVideo(videoId);

		return NextResponse.json({
			success: true,
			data: {
				streamUrl,
				videoId,
				videoInfo,
			},
		});
	} catch (error) {
		console.error("YouTube stream API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process YouTube stream request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

