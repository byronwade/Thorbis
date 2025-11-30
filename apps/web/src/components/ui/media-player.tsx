"use client";

/**
 * Unified Media Player Component
 * 
 * A modern, flat design media player that supports both audio and video.
 * Inspired by Linear's media player design with seamless controls.
 * 
 * Features:
 * - Play/pause controls
 * - Progress bar with seek
 * - Duration display
 * - Playback speed control
 * - Volume control
 * - Download button (for audio)
 * - Autoplay, loop, muted support (for video)
 */

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
    Download,
    Loader2,
    Pause,
    Play,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// YouTube IFrame Player API types
declare global {
	interface Window {
		YT: typeof YT;
		onYouTubeIframeAPIReady: () => void;
	}
}

declare namespace YT {
	interface PlayerEvent {
		target: Player;
		data: number;
	}

	interface OnStateChangeEvent {
		target: Player;
		data: number;
	}

	enum PlayerState {
		UNSTARTED = -1,
		ENDED = 0,
		PLAYING = 1,
		PAUSED = 2,
		BUFFERING = 3,
		CUED = 5,
	}

	interface PlayerVars {
		autoplay?: 0 | 1;
		mute?: 0 | 1;
		loop?: 0 | 1;
		playlist?: string;
		controls?: 0 | 1 | 2;
		modestbranding?: 0 | 1;
		rel?: 0 | 1;
		playsinline?: 0 | 1;
		iv_load_policy?: 1 | 3;
	}

	interface PlayerOptions {
		videoId?: string;
		playerVars?: PlayerVars;
		events?: {
			onReady?: (event: PlayerEvent) => void;
			onStateChange?: (event: OnStateChangeEvent) => void;
			onError?: (event: PlayerEvent) => void;
		};
	}

	class Player {
		constructor(containerId: string | HTMLElement, options: PlayerOptions);
		playVideo(): void;
		pauseVideo(): void;
		stopVideo(): void;
		seekTo(seconds: number, allowSeekAhead: boolean): void;
		getCurrentTime(): number;
		getDuration(): number;
		getVolume(): number;
		setVolume(volume: number): void;
		isMuted(): boolean;
		mute(): void;
		unMute(): void;
		setPlaybackRate(rate: number): void;
		getPlaybackRate(): number;
		destroy(): void;
	}
}

export interface MediaPlayerProps {
	/** Media source URL or YouTube video ID */
	src: string;
	/** Media type - 'audio', 'video', or 'youtube' */
	type?: "audio" | "video" | "youtube";
	/** Title/name of the media */
	title?: string;
	/** Custom className */
	className?: string;
	/** Compact mode for smaller displays */
	compact?: boolean;
	/** For video: autoplay */
	autoplay?: boolean;
	/** For video: loop */
	loop?: boolean;
	/** For video: muted */
	muted?: boolean;
	/** For video: plays inline on mobile */
	playsInline?: boolean;
	/** Poster image for video (before playback) */
	poster?: string;
	/** Hide all controls (for background/hero videos) */
	hideControls?: boolean;
	/** Callback when playback starts */
	onPlay?: () => void;
	/** Callback when playback pauses */
	onPause?: () => void;
	/** Callback when playback ends */
	onEnded?: () => void;
}

function formatTime(seconds: number): string {
	if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MediaPlayer({
	src,
	type = "audio",
	title,
	className,
	compact = false,
	autoplay = false,
	loop = false,
	muted = false,
	playsInline = true,
	poster,
	hideControls = false,
	onPlay,
	onPause,
	onEnded,
}: MediaPlayerProps) {
	const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
	const youtubePlayerRef = useRef<YT.Player | null>(null);
	const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(muted);
	const [error, setError] = useState<string | null>(null);
	const [youtubeReady, setYoutubeReady] = useState(false);

	// YouTube IFrame Player API setup
	useEffect(() => {
		if (type !== "youtube") return;

		// Extract video ID
		const getYouTubeVideoId = (urlOrId: string): string => {
			if (!urlOrId.includes("/") && !urlOrId.includes("?")) {
				return urlOrId;
			}
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
			return urlOrId;
		};

		const videoId = getYouTubeVideoId(src);
		if (!videoId || !youtubeContainerRef.current) return;

		// Load YouTube IFrame Player API if not already loaded
		if (!window.YT) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			const firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

			// Wait for API to load
			window.onYouTubeIframeAPIReady = () => {
				createYouTubePlayer(videoId);
			};
		} else if (window.YT.Player) {
			createYouTubePlayer(videoId);
		}

		function createYouTubePlayer(videoId: string) {
			if (!youtubeContainerRef.current) return;

			const player = new window.YT.Player(youtubeContainerRef.current, {
				videoId,
				playerVars: {
					autoplay: autoplay ? 1 : 0,
					mute: muted || isMuted ? 1 : 0,
					loop: loop ? 1 : 0,
					playlist: loop ? videoId : undefined,
					controls: 0, // Hide YouTube controls
					modestbranding: 1,
					rel: 0,
					playsinline: playsInline ? 1 : 0,
					iv_load_policy: 3, // Hide annotations
				},
				events: {
					onReady: (event: YT.PlayerEvent) => {
						const player = event.target;
						youtubePlayerRef.current = player;
						setYoutubeReady(true);
						setIsLoading(false);
						setDuration(player.getDuration());
						setVolume(player.getVolume() / 100);
						setIsMuted(player.isMuted());
						
						if (autoplay) {
							player.playVideo();
						}
					},
					onStateChange: (event: YT.OnStateChangeEvent) => {
						const player = event.target;
						if (event.data === YT.PlayerState.PLAYING) {
							setIsPlaying(true);
							onPlay?.();
						} else if (event.data === YT.PlayerState.PAUSED) {
							setIsPlaying(false);
							onPause?.();
						} else if (event.data === YT.PlayerState.ENDED) {
							setIsPlaying(false);
							setCurrentTime(0);
							if (loop) {
								player.playVideo();
							} else {
								onEnded?.();
							}
						} else if (event.data === YT.PlayerState.BUFFERING) {
							setIsLoading(true);
						} else if (event.data === YT.PlayerState.CUED) {
							setIsLoading(false);
						}
					},
					onError: () => {
						setError("Failed to load YouTube video");
						setIsLoading(false);
					},
				},
			});
		}

		// Update time periodically
		const timeInterval = setInterval(() => {
			if (youtubePlayerRef.current && isPlaying) {
				const current = youtubePlayerRef.current.getCurrentTime();
				setCurrentTime(current);
			}
		}, 100);

		return () => {
			clearInterval(timeInterval);
			if (youtubePlayerRef.current) {
				try {
					youtubePlayerRef.current.destroy();
				} catch (e) {
					// Player might already be destroyed
				}
				youtubePlayerRef.current = null;
			}
		};
	}, [type, src, autoplay, muted, isMuted, loop, playsInline, onPlay, onPause, onEnded]);

	// Handle media events (for non-YouTube)
	useEffect(() => {
		if (type === "youtube") return;
		const media = mediaRef.current;
		if (!media) return;

		const handleLoadedMetadata = () => {
			setDuration(media.duration);
			setIsLoading(false);
		};

		const handleTimeUpdate = () => {
			setCurrentTime(media.currentTime);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			if (!loop) {
				setCurrentTime(0);
			}
			onEnded?.();
		};

		const handlePlay = () => {
			setIsPlaying(true);
			onPlay?.();
		};

		const handlePause = () => {
			setIsPlaying(false);
			onPause?.();
		};

		const handleError = () => {
			setError("Failed to load media");
			setIsLoading(false);
		};

		const handleWaiting = () => {
			setIsLoading(true);
		};

		const handleCanPlay = () => {
			setIsLoading(false);
		};

		media.addEventListener("loadedmetadata", handleLoadedMetadata);
		media.addEventListener("timeupdate", handleTimeUpdate);
		media.addEventListener("ended", handleEnded);
		media.addEventListener("play", handlePlay);
		media.addEventListener("pause", handlePause);
		media.addEventListener("error", handleError);
		media.addEventListener("waiting", handleWaiting);
		media.addEventListener("canplay", handleCanPlay);

		return () => {
			media.removeEventListener("loadedmetadata", handleLoadedMetadata);
			media.removeEventListener("timeupdate", handleTimeUpdate);
			media.removeEventListener("ended", handleEnded);
			media.removeEventListener("play", handlePlay);
			media.removeEventListener("pause", handlePause);
			media.removeEventListener("error", handleError);
			media.removeEventListener("waiting", handleWaiting);
			media.removeEventListener("canplay", handleCanPlay);
		};
	}, [onPlay, onPause, onEnded, loop]);

	// Update playback rate when changed
	useEffect(() => {
		if (type === "youtube" && youtubePlayerRef.current) {
			// YouTube API doesn't support playback rate directly, but we can try
			// Note: This might not work for all videos
			try {
				youtubePlayerRef.current.setPlaybackRate(playbackRate);
			} catch (e) {
				// Playback rate might not be supported
			}
		} else if (mediaRef.current) {
			mediaRef.current.playbackRate = playbackRate;
		}
	}, [playbackRate, type]);

	// Update volume when changed
	useEffect(() => {
		if (type === "youtube" && youtubePlayerRef.current) {
			if (isMuted) {
				youtubePlayerRef.current.mute();
			} else {
				youtubePlayerRef.current.unMute();
				youtubePlayerRef.current.setVolume(volume * 100);
			}
		} else if (mediaRef.current) {
			mediaRef.current.volume = isMuted ? 0 : volume;
			if (type === "video") {
				(mediaRef.current as HTMLVideoElement).muted = isMuted;
			}
		}
	}, [volume, isMuted, type]);

	// Handle autoplay for video (non-YouTube)
	useEffect(() => {
		if (type === "video" && autoplay && mediaRef.current) {
			const playPromise = mediaRef.current.play();
			if (playPromise !== undefined) {
				playPromise.catch(() => {
					// Autoplay was prevented
					setError("Autoplay was prevented by browser");
				});
			}
		}
	}, [type, autoplay]);

	const togglePlay = useCallback(() => {
		if (type === "youtube" && youtubePlayerRef.current) {
			if (isPlaying) {
				youtubePlayerRef.current.pauseVideo();
			} else {
				youtubePlayerRef.current.playVideo();
			}
			return;
		}

		const media = mediaRef.current;
		if (!media) return;

		if (isPlaying) {
			media.pause();
		} else {
			media.play().catch(() => {
				setError("Failed to play media");
			});
		}
	}, [isPlaying, type]);

	const handleSeek = useCallback((value: number[]) => {
		if (type === "youtube" && youtubePlayerRef.current) {
			if (value[0] !== undefined) {
				youtubePlayerRef.current.seekTo(value[0], true);
				setCurrentTime(value[0]);
			}
			return;
		}

		const media = mediaRef.current;
		if (!media || !value[0]) return;
		media.currentTime = value[0];
		setCurrentTime(value[0]);
	}, [type]);

	const handleVolumeChange = useCallback((value: number[]) => {
		if (!value[0] && value[0] !== 0) return;
		setVolume(value[0]);
		setIsMuted(value[0] === 0);
	}, []);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => !prev);
	}, []);

	const handleDownload = useCallback(() => {
		const link = document.createElement("a");
		link.href = src;
		link.download = title || "media";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [src, title]);

	const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

	if (error) {
		return (
			<div
				className={cn(
					"flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive",
					className
				)}
			>
				<span>{error}</span>
			</div>
		);
	}

	// YouTube video player with custom controls
	if (type === "youtube") {
		const videoId = src.includes("/") || src.includes("?") 
			? src.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1] || src
			: src;
		const thumbnailUrl = poster || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

		// Hide controls mode (for hero/background videos)
		if (hideControls) {
			return (
				<div className={cn("relative w-full", className)}>
					<div ref={youtubeContainerRef} className="aspect-video w-full rounded-xl" />
					{!youtubeReady && (
						<div className="absolute inset-0 flex items-center justify-center bg-muted rounded-xl">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					)}
				</div>
			);
		}

		// Show custom controls UI for YouTube
		if (compact) {
			return (
				<div className={cn("flex items-center gap-2", className)}>
					<div ref={youtubeContainerRef} className="hidden" />
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={togglePlay}
						disabled={isLoading || !youtubeReady}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : isPlaying ? (
							<Pause className="h-4 w-4" />
						) : (
							<Play className="h-4 w-4" />
						)}
					</Button>
					<span className="text-xs text-muted-foreground">
						{formatTime(currentTime)} / {formatTime(duration)}
					</span>
				</div>
			);
		}

		return (
			<div className={cn("rounded-lg border bg-card p-4 shadow-sm", className)}>
				{/* YouTube iframe container - hidden controls */}
				<div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl">
					<div ref={youtubeContainerRef} className="h-full w-full" />
					{!youtubeReady && (
						<div className="absolute inset-0 flex items-center justify-center bg-muted">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					)}
				</div>

				{title && (
					<div className="mb-3 text-sm font-medium text-foreground">
						{title}
					</div>
				)}

				{/* Progress bar */}
				<div className="mb-3">
					<Slider
						value={[currentTime]}
						min={0}
						max={duration || 100}
						step={0.1}
						onValueChange={handleSeek}
						className="cursor-pointer"
						disabled={isLoading || !youtubeReady}
					/>
					<div className="mt-1 flex justify-between text-xs text-muted-foreground">
						<span>{formatTime(currentTime)}</span>
						<span>{formatTime(duration)}</span>
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{/* Play/Pause */}
						<Button
							variant="default"
							size="icon"
							className="h-10 w-10"
							onClick={togglePlay}
							disabled={isLoading || !youtubeReady}
						>
							{isLoading ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : isPlaying ? (
								<Pause className="h-5 w-5" />
							) : (
								<Play className="h-5 w-5 ml-0.5" />
							)}
						</Button>

						{/* Playback speed */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="w-14" disabled={!youtubeReady}>
									{playbackRate}x
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								{playbackSpeeds.map((speed) => (
									<DropdownMenuItem
										key={speed}
										onClick={() => setPlaybackRate(speed)}
										className={cn(
											playbackRate === speed && "bg-accent"
										)}
									>
										{speed}x
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center gap-2">
						{/* Volume */}
						<div className="hidden items-center gap-2 sm:flex">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={toggleMute}
								disabled={!youtubeReady}
							>
								{isMuted || volume === 0 ? (
									<VolumeX className="h-4 w-4" />
								) : (
									<Volume2 className="h-4 w-4" />
								)}
							</Button>
							<Slider
								value={[isMuted ? 0 : volume]}
								min={0}
								max={1}
								step={0.1}
								onValueChange={handleVolumeChange}
								className="w-20"
								disabled={!youtubeReady}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Video player with flat design
	if (type === "video") {
		return (
			<div className={cn("relative w-full", className)}>
				<video
					ref={mediaRef as React.RefObject<HTMLVideoElement>}
					src={src}
					poster={poster}
					className="w-full rounded-xl"
					autoPlay={autoplay}
					loop={loop}
					muted={muted || isMuted}
					playsInline={playsInline}
					preload="metadata"
				/>
				{/* Video controls overlay - only show on hover/interaction */}
				{!compact && !hideControls && (
					<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100 group">
						<Button
							variant="ghost"
							size="icon"
							className="h-16 w-16 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70"
							onClick={togglePlay}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="h-8 w-8 animate-spin text-white" />
							) : isPlaying ? (
								<Pause className="h-8 w-8 text-white" />
							) : (
								<Play className="h-8 w-8 ml-1 text-white" />
							)}
						</Button>
					</div>
				)}
			</div>
		);
	}

	// Audio player (compact mode)
	if (compact) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				{type === "audio" ? (
					<audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={src} preload="metadata" />
				) : null}
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={togglePlay}
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : isPlaying ? (
						<Pause className="h-4 w-4" />
					) : (
						<Play className="h-4 w-4" />
					)}
				</Button>
				<span className="text-xs text-muted-foreground">
					{formatTime(currentTime)} / {formatTime(duration)}
				</span>
			</div>
		);
	}

	// Full audio player
	return (
		<div
			className={cn(
				"rounded-lg border bg-card p-4 shadow-sm",
				className
			)}
		>
			{type === "audio" ? (
				<audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={src} preload="metadata" />
			) : null}

			{title && (
				<div className="mb-3 text-sm font-medium text-foreground">
					{title}
				</div>
			)}

			{/* Progress bar */}
			<div className="mb-3">
				<Slider
					value={[currentTime]}
					min={0}
					max={duration || 100}
					step={0.1}
					onValueChange={handleSeek}
					className="cursor-pointer"
					disabled={isLoading}
				/>
				<div className="mt-1 flex justify-between text-xs text-muted-foreground">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			{/* Controls */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{/* Play/Pause */}
					<Button
						variant="default"
						size="icon"
						className="h-10 w-10"
						onClick={togglePlay}
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : isPlaying ? (
							<Pause className="h-5 w-5" />
						) : (
							<Play className="h-5 w-5 ml-0.5" />
						)}
					</Button>

					{/* Playback speed */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="w-14">
								{playbackRate}x
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{playbackSpeeds.map((speed) => (
								<DropdownMenuItem
									key={speed}
									onClick={() => setPlaybackRate(speed)}
									className={cn(
										playbackRate === speed && "bg-accent"
									)}
								>
									{speed}x
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center gap-2">
					{/* Volume */}
					<div className="hidden items-center gap-2 sm:flex">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={toggleMute}
						>
							{isMuted || volume === 0 ? (
								<VolumeX className="h-4 w-4" />
							) : (
								<Volume2 className="h-4 w-4" />
							)}
						</Button>
						<Slider
							value={[isMuted ? 0 : volume]}
							min={0}
							max={1}
							step={0.1}
							onValueChange={handleVolumeChange}
							className="w-20"
						/>
					</div>

					{/* Download */}
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={handleDownload}
						title="Download recording"
					>
						<Download className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

