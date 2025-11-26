"use client";

/**
 * Text-to-Speech Player Component
 *
 * Converts text to speech using Google Text-to-Speech API.
 * Useful for:
 * - Reading notifications aloud
 * - Accessibility features
 * - Audio instructions
 */

import {
	Loader2,
	Pause,
	Play,
	RefreshCw,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface TextToSpeechPlayerProps {
	/** Text to convert to speech */
	text: string;
	/** Type of speech synthesis */
	type?: "notification" | "instructions" | "ivr" | "general";
	/** Urgency level (for notification type) */
	urgency?: "low" | "normal" | "high";
	/** Language code */
	languageCode?: "en-US" | "en-GB" | "es-US" | "es-MX" | "fr-FR" | "de-DE";
	/** Voice gender preference */
	voiceGender?: "MALE" | "FEMALE" | "NEUTRAL";
	/** Auto-play when text changes */
	autoPlay?: boolean;
	/** Show controls */
	showControls?: boolean;
	/** Custom className */
	className?: string;
	/** Compact mode */
	compact?: boolean;
	/** Callback when playback starts */
	onPlay?: () => void;
	/** Callback when playback ends */
	onEnd?: () => void;
	/** Callback on error */
	onError?: (error: string) => void;
}

export function TextToSpeechPlayer({
	text,
	type = "general",
	urgency = "normal",
	languageCode = "en-US",
	voiceGender = "FEMALE",
	autoPlay = false,
	showControls = true,
	className,
	compact = false,
	onPlay,
	onEnd,
	onError,
}: TextToSpeechPlayerProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [volume, setVolume] = useState(1);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [error, setError] = useState<string | null>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const synthesizeSpeech = useCallback(async () => {
		if (!text.trim()) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/speech/synthesize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text,
					type,
					urgency,
					languageCode,
					voiceGender,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Speech synthesis failed");
			}

			setAudioUrl(data.data.audioUrl);

			// Auto-play if enabled
			if (autoPlay && audioRef.current) {
				audioRef.current.src = data.data.audioUrl;
				audioRef.current.play();
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Speech synthesis failed";
			setError(message);
			onError?.(message);
		} finally {
			setIsLoading(false);
		}
	}, [text, type, urgency, languageCode, voiceGender, autoPlay, onError]);

	const play = useCallback(async () => {
		if (!audioUrl) {
			await synthesizeSpeech();
		}

		if (audioRef.current && audioUrl) {
			audioRef.current.src = audioUrl;
			audioRef.current.volume = volume;
			audioRef.current.playbackRate = playbackRate;
			audioRef.current.play();
			setIsPlaying(true);
			onPlay?.();
		}
	}, [audioUrl, synthesizeSpeech, volume, playbackRate, onPlay]);

	const pause = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	};

	const togglePlay = () => {
		if (isPlaying) {
			pause();
		} else {
			play();
		}
	};

	const handleEnded = () => {
		setIsPlaying(false);
		onEnd?.();
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const refresh = () => {
		setAudioUrl(null);
		synthesizeSpeech();
	};

	if (compact) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<audio ref={audioRef} onEnded={handleEnded} className="hidden" />
				<Button
					size="sm"
					variant="outline"
					onClick={togglePlay}
					disabled={isLoading || !text.trim()}
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : isPlaying ? (
						<Pause className="h-4 w-4" />
					) : (
						<Play className="h-4 w-4" />
					)}
				</Button>
				{showControls && (
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setVolume(volume === 0 ? 1 : 0)}
					>
						{volume === 0 ? (
							<VolumeX className="h-4 w-4" />
						) : (
							<Volume2 className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg flex items-center gap-2">
					<Volume2 className="h-5 w-5" />
					Text to Speech
				</CardTitle>
				<CardDescription>Listen to text spoken aloud</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Hidden audio element */}
				<audio ref={audioRef} onEnded={handleEnded} className="hidden" />

				{/* Text preview */}
				<div className="p-3 rounded-lg bg-muted max-h-32 overflow-y-auto">
					<p className="text-sm">{text || "No text to speak"}</p>
				</div>

				{/* Main controls */}
				<div className="flex items-center justify-center gap-4">
					<Button
						size="lg"
						variant="default"
						onClick={togglePlay}
						disabled={isLoading || !text.trim()}
						className="h-14 w-14 rounded-full"
					>
						{isLoading ? (
							<Loader2 className="h-6 w-6 animate-spin" />
						) : isPlaying ? (
							<Pause className="h-6 w-6" />
						) : (
							<Play className="h-6 w-6" />
						)}
					</Button>
					{audioUrl && (
						<Button
							size="sm"
							variant="outline"
							onClick={refresh}
							disabled={isLoading}
						>
							<RefreshCw className="h-4 w-4" />
						</Button>
					)}
				</div>

				{/* Error display */}
				{error && (
					<div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
						{error}
					</div>
				)}

				{/* Advanced controls */}
				{showControls && (
					<div className="space-y-4 pt-2 border-t">
						{/* Volume control */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Volume</span>
								<span className="text-sm text-muted-foreground">
									{Math.round(volume * 100)}%
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])}
								>
									{volume === 0 ? (
										<VolumeX className="h-4 w-4" />
									) : (
										<Volume2 className="h-4 w-4" />
									)}
								</Button>
								<Slider
									value={[volume]}
									min={0}
									max={1}
									step={0.1}
									onValueChange={handleVolumeChange}
									className="flex-1"
								/>
							</div>
						</div>

						{/* Playback speed */}
						<div className="space-y-2">
							<span className="text-sm font-medium">Playback Speed</span>
							<Select
								value={playbackRate.toString()}
								onValueChange={(v) => setPlaybackRate(parseFloat(v))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0.5">0.5x (Slow)</SelectItem>
									<SelectItem value="0.75">0.75x</SelectItem>
									<SelectItem value="1">1x (Normal)</SelectItem>
									<SelectItem value="1.25">1.25x</SelectItem>
									<SelectItem value="1.5">1.5x (Fast)</SelectItem>
									<SelectItem value="2">2x</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Voice settings */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<span className="text-sm font-medium">Language</span>
								<Select value={languageCode} disabled>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en-US">English (US)</SelectItem>
										<SelectItem value="en-GB">English (UK)</SelectItem>
										<SelectItem value="es-US">Spanish (US)</SelectItem>
										<SelectItem value="es-MX">Spanish (MX)</SelectItem>
										<SelectItem value="fr-FR">French</SelectItem>
										<SelectItem value="de-DE">German</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<span className="text-sm font-medium">Voice</span>
								<Select value={voiceGender} disabled>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="FEMALE">Female</SelectItem>
										<SelectItem value="MALE">Male</SelectItem>
										<SelectItem value="NEUTRAL">Neutral</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default TextToSpeechPlayer;
