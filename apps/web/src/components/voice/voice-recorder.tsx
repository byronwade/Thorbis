"use client";

/**
 * Voice Recorder Component
 *
 * Captures audio and transcribes it using Google Speech-to-Text API.
 * Useful for:
 * - Voice notes for technicians
 * - Hands-free job updates
 * - Voice commands
 */

import { Check, Loader2, Mic, MicOff, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface VoiceRecorderProps {
	/** Callback when transcription is complete */
	onTranscription?: (text: string, confidence: number) => void;
	/** Callback when recording error occurs */
	onError?: (error: string) => void;
	/** Type of transcription to perform */
	transcriptionType?: "voice_note" | "phone_call" | "field_service" | "general";
	/** Service type for field_service transcriptions */
	serviceType?: "hvac" | "plumbing" | "electrical" | "general";
	/** Language code for transcription */
	languageCode?: "en-US" | "en-GB" | "es-ES" | "es-MX" | "fr-FR" | "de-DE";
	/** Maximum recording duration in seconds */
	maxDuration?: number;
	/** Show transcription result inline */
	showResult?: boolean;
	/** Custom className */
	className?: string;
	/** Compact mode for inline usage */
	compact?: boolean;
}

export function VoiceRecorder({
	onTranscription,
	onError,
	transcriptionType = "voice_note",
	serviceType = "general",
	languageCode = "en-US",
	maxDuration = 60,
	showResult = true,
	className,
	compact = false,
}: VoiceRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [transcription, setTranscription] = useState<string | null>(null);
	const [confidence, setConfidence] = useState<number | null>(null);
	const [duration, setDuration] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const startRecording = useCallback(async () => {
		try {
			setError(null);
			setTranscription(null);
			setConfidence(null);
			chunksRef.current = [];

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm;codecs=opus",
			});

			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				// Stop all tracks
				stream.getTracks().forEach((track) => track.stop());

				// Convert to base64
				const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
				const reader = new FileReader();
				reader.readAsDataURL(audioBlob);
				reader.onloadend = async () => {
					const base64Audio = (reader.result as string).split(",")[1];
					await transcribeAudio(base64Audio);
				};
			};

			mediaRecorder.start(1000); // Collect in 1-second chunks
			setIsRecording(true);
			setDuration(0);

			// Start duration timer
			timerRef.current = setInterval(() => {
				setDuration((d) => {
					if (d >= maxDuration - 1) {
						stopRecording();
						return d;
					}
					return d + 1;
				});
			}, 1000);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to access microphone";
			setError(message);
			onError?.(message);
		}
	}, [maxDuration, onError]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);

			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
	}, [isRecording]);

	const transcribeAudio = async (base64Audio: string) => {
		setIsTranscribing(true);

		try {
			const response = await fetch("/api/speech/transcribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					audioContent: base64Audio,
					type: transcriptionType,
					serviceType,
					languageCode,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Transcription failed");
			}

			setTranscription(data.data.text);
			setConfidence(data.data.confidence);
			onTranscription?.(data.data.text, data.data.confidence);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Transcription failed";
			setError(message);
			onError?.(message);
		} finally {
			setIsTranscribing(false);
		}
	};

	const clearResult = () => {
		setTranscription(null);
		setConfidence(null);
		setError(null);
	};

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (compact) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<Button
					size="sm"
					variant={isRecording ? "destructive" : "outline"}
					onClick={isRecording ? stopRecording : startRecording}
					disabled={isTranscribing}
				>
					{isTranscribing ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : isRecording ? (
						<MicOff className="h-4 w-4" />
					) : (
						<Mic className="h-4 w-4" />
					)}
				</Button>
				{isRecording && (
					<span className="text-sm text-muted-foreground">
						{formatDuration(duration)}
					</span>
				)}
				{transcription && showResult && (
					<span className="text-sm truncate max-w-[200px]">
						{transcription}
					</span>
				)}
			</div>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg flex items-center gap-2">
					<Mic className="h-5 w-5" />
					Voice Recorder
				</CardTitle>
				<CardDescription>Record audio to transcribe to text</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Recording controls */}
				<div className="flex items-center justify-center gap-4">
					<Button
						size="lg"
						variant={isRecording ? "destructive" : "default"}
						onClick={isRecording ? stopRecording : startRecording}
						disabled={isTranscribing}
						className="h-16 w-16 rounded-full"
					>
						{isTranscribing ? (
							<Loader2 className="h-6 w-6 animate-spin" />
						) : isRecording ? (
							<MicOff className="h-6 w-6" />
						) : (
							<Mic className="h-6 w-6" />
						)}
					</Button>
				</div>

				{/* Recording status */}
				{isRecording && (
					<div className="text-center space-y-1">
						<div className="flex items-center justify-center gap-2">
							<span className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
							</span>
							<span className="text-sm font-medium">Recording...</span>
						</div>
						<p className="text-2xl font-mono">{formatDuration(duration)}</p>
						<p className="text-xs text-muted-foreground">
							Max: {formatDuration(maxDuration)}
						</p>
					</div>
				)}

				{/* Transcribing status */}
				{isTranscribing && (
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Transcribing audio...
						</p>
					</div>
				)}

				{/* Error display */}
				{error && (
					<div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center justify-between">
						<span>{error}</span>
						<Button size="sm" variant="ghost" onClick={clearResult}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				)}

				{/* Transcription result */}
				{showResult && transcription && (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Transcription</span>
							<div className="flex items-center gap-2">
								{confidence !== null && (
									<Badge
										variant={
											confidence > 0.8
												? "default"
												: confidence > 0.6
													? "secondary"
													: "outline"
										}
									>
										{(confidence * 100).toFixed(0)}% confidence
									</Badge>
								)}
								<Button size="sm" variant="ghost" onClick={clearResult}>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div className="p-3 rounded-lg bg-muted">
							<p className="text-sm">{transcription}</p>
						</div>
						{onTranscription && (
							<Button
								size="sm"
								variant="outline"
								className="w-full"
								onClick={() => onTranscription(transcription, confidence || 0)}
							>
								<Check className="h-4 w-4 mr-2" />
								Use Transcription
							</Button>
						)}
					</div>
				)}

				{/* Settings display */}
				<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
					<Badge variant="outline">{languageCode}</Badge>
					<Badge variant="outline">{transcriptionType.replace("_", " ")}</Badge>
					{transcriptionType === "field_service" && (
						<Badge variant="outline">{serviceType}</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default VoiceRecorder;
