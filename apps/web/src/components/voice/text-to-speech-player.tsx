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
    Play,
    RefreshCw,
    Volume2,
} from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MediaPlayer } from "@/components/ui/media-player";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

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
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Speech synthesis failed";
			setError(message);
			onError?.(message);
		} finally {
			setIsLoading(false);
		}
	}, [text, type, urgency, languageCode, voiceGender, autoPlay, onError]);

	const handlePlay = useCallback(async () => {
		if (!audioUrl) {
			await synthesizeSpeech();
		}
		onPlay?.();
	}, [audioUrl, synthesizeSpeech, onPlay]);

	const handleEnded = useCallback(() => {
		onEnd?.();
	}, [onEnd]);

	const refresh = () => {
		setAudioUrl(null);
		synthesizeSpeech();
	};

	if (compact) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				{audioUrl ? (
					<MediaPlayer
						src={audioUrl}
						type="audio"
						compact
						onPlay={handlePlay}
						onEnded={handleEnded}
					/>
				) : (
					<Button
						size="sm"
						variant="outline"
						onClick={async () => {
							await synthesizeSpeech();
						}}
						disabled={isLoading || !text.trim()}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Play className="h-4 w-4" />
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
				{/* Text preview */}
				<div className="p-3 rounded-lg bg-muted max-h-32 overflow-y-auto">
					<p className="text-sm">{text || "No text to speak"}</p>
				</div>

				{/* Media Player or Generate Button */}
				{audioUrl ? (
					<div className="space-y-2">
						<MediaPlayer
							src={audioUrl}
							type="audio"
							title="Text to Speech Audio"
							onPlay={handlePlay}
							onEnded={handleEnded}
						/>
						<div className="flex justify-center">
							<Button
								size="sm"
								variant="outline"
								onClick={refresh}
								disabled={isLoading}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Regenerate
							</Button>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center">
						<Button
							size="lg"
							variant="default"
							onClick={async () => {
								await synthesizeSpeech();
							}}
							disabled={isLoading || !text.trim()}
							className="h-14 w-14 rounded-full"
						>
							{isLoading ? (
								<Loader2 className="h-6 w-6 animate-spin" />
							) : (
								<Play className="h-6 w-6" />
							)}
						</Button>
					</div>
				)}

				{/* Error display */}
				{error && (
					<div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
						{error}
					</div>
				)}

				{/* Advanced controls - Note: Volume and playback speed are now handled by MediaPlayer */}
				{showControls && audioUrl && (
					<div className="space-y-4 pt-2 border-t">
						<p className="text-xs text-muted-foreground text-center">
							Volume and playback speed controls are available in the player above
						</p>

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
