"use client";

/**
 * Audio Player Component
 *
 * A reusable audio player for call recordings and voicemails.
 * Features:
 * - Play/pause controls
 * - Progress bar with seek
 * - Duration display
 * - Playback speed control (0.5x, 1x, 1.5x, 2x)
 * - Volume control
 * - Download button
 */

import {
	Download,
	Loader2,
	Pause,
	Play,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
	src: string;
	title?: string;
	className?: string;
	compact?: boolean;
	onPlay?: () => void;
	onPause?: () => void;
	onEnded?: () => void;
}

function formatTime(seconds: number): string {
	if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
	src,
	title,
	className,
	compact = false,
	onPlay,
	onPause,
	onEnded,
}: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Handle audio events
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
			setIsLoading(false);
		};

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
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
			setError("Failed to load audio");
			setIsLoading(false);
		};

		const handleWaiting = () => {
			setIsLoading(true);
		};

		const handleCanPlay = () => {
			setIsLoading(false);
		};

		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("error", handleError);
		audio.addEventListener("waiting", handleWaiting);
		audio.addEventListener("canplay", handleCanPlay);

		return () => {
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("error", handleError);
			audio.removeEventListener("waiting", handleWaiting);
			audio.removeEventListener("canplay", handleCanPlay);
		};
	}, [onPlay, onPause, onEnded]);

	// Update playback rate when changed
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.playbackRate = playbackRate;
		}
	}, [playbackRate]);

	// Update volume when changed
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = isMuted ? 0 : volume;
		}
	}, [volume, isMuted]);

	const togglePlay = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play().catch(() => {
				setError("Failed to play audio");
			});
		}
	}, [isPlaying]);

	const handleSeek = useCallback((value: number[]) => {
		const audio = audioRef.current;
		if (!audio || !value[0]) return;
		audio.currentTime = value[0];
		setCurrentTime(value[0]);
	}, []);

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
		link.download = title || "recording.mp3";
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

	if (compact) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<audio ref={audioRef} src={src} preload="metadata" />
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

	return (
		<div
			className={cn(
				"rounded-lg border bg-card p-4 shadow-sm",
				className
			)}
		>
			<audio ref={audioRef} src={src} preload="metadata" />

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
