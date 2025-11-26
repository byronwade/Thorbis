"use client";

/**
 * Translation Input Component
 *
 * Translates text between languages using Google Translation API.
 * Useful for:
 * - Customer communication
 * - Multilingual support
 * - Document translation
 */

import {
	ArrowRightLeft,
	Check,
	Copy,
	Languages,
	Loader2,
	Volume2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Common languages for field service
const LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "zh", name: "Chinese" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "vi", name: "Vietnamese" },
	{ code: "tl", name: "Tagalog" },
	{ code: "ar", name: "Arabic" },
	{ code: "hi", name: "Hindi" },
	{ code: "ru", name: "Russian" },
] as const;

export interface TranslationInputProps {
	/** Initial text to translate */
	initialText?: string;
	/** Default source language */
	defaultSourceLanguage?: string;
	/** Default target language */
	defaultTargetLanguage?: string;
	/** Auto-detect source language */
	autoDetect?: boolean;
	/** Callback when translation is complete */
	onTranslation?: (
		translation: string,
		sourceLanguage: string,
		targetLanguage: string,
	) => void;
	/** Callback on error */
	onError?: (error: string) => void;
	/** Show text-to-speech button */
	showSpeakButton?: boolean;
	/** Custom className */
	className?: string;
	/** Compact mode */
	compact?: boolean;
}

export function TranslationInput({
	initialText = "",
	defaultSourceLanguage = "auto",
	defaultTargetLanguage = "es",
	autoDetect = true,
	onTranslation,
	onError,
	showSpeakButton = true,
	className,
	compact = false,
}: TranslationInputProps) {
	const [sourceText, setSourceText] = useState(initialText);
	const [translatedText, setTranslatedText] = useState("");
	const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
	const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
	const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
	const [isTranslating, setIsTranslating] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Debounced translation
	useEffect(() => {
		if (!sourceText.trim() || !targetLanguage) {
			setTranslatedText("");
			return;
		}

		const timeoutId = setTimeout(() => {
			translateText();
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [sourceText, sourceLanguage, targetLanguage]);

	const translateText = useCallback(async () => {
		if (!sourceText.trim()) return;

		setIsTranslating(true);
		setError(null);

		try {
			const response = await fetch("/api/translate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: sourceText,
					targetLanguage,
					sourceLanguage:
						sourceLanguage === "auto" ? undefined : sourceLanguage,
					type: "general",
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Translation failed");
			}

			setTranslatedText(data.data.translatedText);

			if (data.data.detectedSourceLanguage) {
				setDetectedLanguage(data.data.detectedSourceLanguage);
			}

			onTranslation?.(
				data.data.translatedText,
				data.data.detectedSourceLanguage || sourceLanguage,
				targetLanguage,
			);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Translation failed";
			setError(message);
			onError?.(message);
		} finally {
			setIsTranslating(false);
		}
	}, [sourceText, sourceLanguage, targetLanguage, onTranslation, onError]);

	const swapLanguages = () => {
		if (sourceLanguage === "auto") return;

		const tempSource = sourceLanguage;
		const tempText = sourceText;

		setSourceLanguage(targetLanguage);
		setTargetLanguage(tempSource);
		setSourceText(translatedText);
		setTranslatedText(tempText);
		setDetectedLanguage(null);
	};

	const copyToClipboard = async () => {
		if (!translatedText) return;

		try {
			await navigator.clipboard.writeText(translatedText);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("Copy failed:", err);
		}
	};

	const speakText = async (text: string, language: string) => {
		try {
			const response = await fetch("/api/speech/synthesize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text,
					type: "general",
					languageCode:
						language === "es" ? "es-US" : language === "fr" ? "fr-FR" : "en-US",
				}),
			});

			const data = await response.json();

			if (response.ok && data.data.audioUrl) {
				const audio = new Audio(data.data.audioUrl);
				audio.play();
			}
		} catch (err) {
			console.error("Speech synthesis failed:", err);
		}
	};

	const getLanguageName = (code: string) => {
		if (code === "auto") return "Auto-detect";
		return LANGUAGES.find((l) => l.code === code)?.name || code;
	};

	if (compact) {
		return (
			<div className={cn("space-y-2", className)}>
				<div className="flex items-center gap-2">
					<Select value={sourceLanguage} onValueChange={setSourceLanguage}>
						<SelectTrigger className="w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{autoDetect && <SelectItem value="auto">Auto-detect</SelectItem>}
							{LANGUAGES.map((lang) => (
								<SelectItem key={lang.code} value={lang.code}>
									{lang.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						variant="ghost"
						onClick={swapLanguages}
						disabled={sourceLanguage === "auto"}
					>
						<ArrowRightLeft className="h-4 w-4" />
					</Button>
					<Select value={targetLanguage} onValueChange={setTargetLanguage}>
						<SelectTrigger className="w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{LANGUAGES.map((lang) => (
								<SelectItem key={lang.code} value={lang.code}>
									{lang.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Textarea
						value={sourceText}
						onChange={(e) => setSourceText(e.target.value)}
						placeholder="Enter text..."
						className="min-h-[80px]"
					/>
					<div className="relative">
						<Textarea
							value={translatedText}
							readOnly
							placeholder="Translation..."
							className="min-h-[80px] bg-muted"
						/>
						{isTranslating && (
							<div className="absolute inset-0 flex items-center justify-center bg-background/50">
								<Loader2 className="h-4 w-4 animate-spin" />
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg flex items-center gap-2">
					<Languages className="h-5 w-5" />
					Translation
				</CardTitle>
				<CardDescription>Translate text between languages</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Language selectors */}
				<div className="flex items-center gap-2">
					<Select value={sourceLanguage} onValueChange={setSourceLanguage}>
						<SelectTrigger className="flex-1">
							<SelectValue placeholder="Source language" />
						</SelectTrigger>
						<SelectContent>
							{autoDetect && <SelectItem value="auto">Auto-detect</SelectItem>}
							{LANGUAGES.map((lang) => (
								<SelectItem key={lang.code} value={lang.code}>
									{lang.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						size="icon"
						variant="outline"
						onClick={swapLanguages}
						disabled={sourceLanguage === "auto"}
					>
						<ArrowRightLeft className="h-4 w-4" />
					</Button>

					<Select value={targetLanguage} onValueChange={setTargetLanguage}>
						<SelectTrigger className="flex-1">
							<SelectValue placeholder="Target language" />
						</SelectTrigger>
						<SelectContent>
							{LANGUAGES.map((lang) => (
								<SelectItem key={lang.code} value={lang.code}>
									{lang.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Source text input */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Source Text</span>
						{detectedLanguage && sourceLanguage === "auto" && (
							<Badge variant="secondary">
								Detected: {getLanguageName(detectedLanguage)}
							</Badge>
						)}
					</div>
					<div className="relative">
						<Textarea
							value={sourceText}
							onChange={(e) => setSourceText(e.target.value)}
							placeholder="Enter text to translate..."
							className="min-h-[100px]"
						/>
						{showSpeakButton && sourceText && (
							<Button
								size="sm"
								variant="ghost"
								className="absolute bottom-2 right-2"
								onClick={() =>
									speakText(sourceText, detectedLanguage || sourceLanguage)
								}
							>
								<Volume2 className="h-4 w-4" />
							</Button>
						)}
					</div>
					<p className="text-xs text-muted-foreground text-right">
						{sourceText.length} characters
					</p>
				</div>

				{/* Translation output */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Translation ({getLanguageName(targetLanguage)})
						</span>
						<div className="flex items-center gap-1">
							{isTranslating && <Loader2 className="h-4 w-4 animate-spin" />}
							{translatedText && (
								<>
									<Button size="sm" variant="ghost" onClick={copyToClipboard}>
										{isCopied ? (
											<Check className="h-4 w-4" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
									{showSpeakButton && (
										<Button
											size="sm"
											variant="ghost"
											onClick={() => speakText(translatedText, targetLanguage)}
										>
											<Volume2 className="h-4 w-4" />
										</Button>
									)}
								</>
							)}
						</div>
					</div>
					<div className="relative">
						<Textarea
							value={translatedText}
							readOnly
							placeholder="Translation will appear here..."
							className="min-h-[100px] bg-muted"
						/>
						{isTranslating && !translatedText && (
							<div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
								<Loader2 className="h-6 w-6 animate-spin" />
							</div>
						)}
					</div>
				</div>

				{/* Error display */}
				{error && (
					<div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
						{error}
					</div>
				)}

				{/* Manual translate button (optional, since we auto-translate) */}
				<Button
					variant="outline"
					className="w-full"
					onClick={translateText}
					disabled={isTranslating || !sourceText.trim()}
				>
					{isTranslating ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Translating...
						</>
					) : (
						<>
							<Languages className="h-4 w-4 mr-2" />
							Translate
						</>
					)}
				</Button>
			</CardContent>
		</Card>
	);
}

export default TranslationInput;
