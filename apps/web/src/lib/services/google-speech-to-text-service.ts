/**
 * Google Cloud Speech-to-Text Service
 *
 * Provides speech recognition capabilities for Stratos field service platform:
 * - Voice notes transcription for technicians
 * - Call recording transcription
 * - Voice commands for hands-free operation
 * - Real-time speech recognition
 *
 * API Documentation: https://cloud.google.com/speech-to-text/docs
 *
 * Features:
 * - Automatic speech recognition (ASR)
 * - Multiple language support (120+ languages)
 * - Speaker diarization (identify different speakers)
 * - Punctuation and formatting
 * - Word-level timestamps
 * - Profanity filtering
 * - Audio channel recognition
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Supported audio encodings
 */
export type AudioEncoding =
	| "ENCODING_UNSPECIFIED"
	| "LINEAR16"
	| "FLAC"
	| "MULAW"
	| "AMR"
	| "AMR_WB"
	| "OGG_OPUS"
	| "SPEEX_WITH_HEADER_BYTE"
	| "WEBM_OPUS"
	| "MP3";

/**
 * Supported language codes for speech recognition
 */
export type SpeechLanguageCode =
	| "en-US"
	| "en-GB"
	| "es-ES"
	| "es-MX"
	| "fr-FR"
	| "de-DE"
	| "it-IT"
	| "pt-BR"
	| "zh-CN"
	| "ja-JP"
	| "ko-KR";

/**
 * Speech recognition configuration
 */
export interface RecognitionConfig {
	encoding?: AudioEncoding;
	sampleRateHertz?: number;
	languageCode: SpeechLanguageCode;
	alternativeLanguageCodes?: SpeechLanguageCode[];
	maxAlternatives?: number;
	profanityFilter?: boolean;
	enableAutomaticPunctuation?: boolean;
	enableWordTimeOffsets?: boolean;
	enableWordConfidence?: boolean;
	enableSpokenPunctuation?: boolean;
	enableSpokenEmojis?: boolean;
	diarizationConfig?: {
		enableSpeakerDiarization: boolean;
		minSpeakerCount?: number;
		maxSpeakerCount?: number;
	};
	speechContexts?: Array<{
		phrases: string[];
		boost?: number;
	}>;
	model?:
		| "default"
		| "phone_call"
		| "video"
		| "command_and_search"
		| "latest_short"
		| "latest_long"
		| "medical_dictation"
		| "medical_conversation";
	useEnhanced?: boolean;
}

/**
 * Word-level information from transcription
 */
export interface WordInfo {
	word: string;
	startTime: string;
	endTime: string;
	confidence?: number;
	speakerTag?: number;
}

/**
 * Speech recognition alternative
 */
export interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
	words?: WordInfo[];
}

/**
 * Speech recognition result
 */
export interface SpeechRecognitionResult {
	alternatives: SpeechRecognitionAlternative[];
	channelTag?: number;
	languageCode?: string;
}

/**
 * Full transcription response
 */
export interface TranscriptionResponse {
	results: SpeechRecognitionResult[];
	totalBilledTime?: string;
}

/**
 * Simplified transcription result for common use cases
 */
export interface SimpleTranscription {
	text: string;
	confidence: number;
	words?: WordInfo[];
	speakers?: Array<{
		speakerId: number;
		text: string;
	}>;
	duration?: number;
}

// Zod schemas for validation
const WordInfoSchema = z.object({
	word: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	confidence: z.number().optional(),
	speakerTag: z.number().optional(),
});

const SpeechRecognitionAlternativeSchema = z.object({
	transcript: z.string(),
	confidence: z.number(),
	words: z.array(WordInfoSchema).optional(),
});

const SpeechRecognitionResultSchema = z.object({
	alternatives: z.array(SpeechRecognitionAlternativeSchema),
	channelTag: z.number().optional(),
	languageCode: z.string().optional(),
});

const TranscriptionResponseSchema = z.object({
	results: z.array(SpeechRecognitionResultSchema).optional().default([]),
	totalBilledTime: z.string().optional(),
});

// ============================================================================
// Service Class
// ============================================================================

/**
 * Google Cloud Speech-to-Text Service
 *
 * Singleton service for speech recognition operations.
 *
 * @example
 * ```typescript
 * const speechService = GoogleSpeechToTextService.getInstance();
 *
 * // Transcribe audio from base64
 * const result = await speechService.transcribeAudio(audioBase64, {
 *   languageCode: 'en-US',
 *   enableAutomaticPunctuation: true,
 * });
 *
 * console.log(result.text);
 * ```
 */
class GoogleSpeechToTextService {
	private static instance: GoogleSpeechToTextService;
	private apiKey: string | undefined;
	private baseUrl = "https://speech.googleapis.com/v1";

	// Cache for recent transcriptions (by audio hash)
	private cache: Map<
		string,
		{ result: SimpleTranscription; timestamp: number }
	> = new Map();
	private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

	private constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;

		if (!this.apiKey) {
			console.warn(
				"GoogleSpeechToTextService: No API key found. Set GOOGLE_API_KEY environment variable.",
			);
		}
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): GoogleSpeechToTextService {
		if (!GoogleSpeechToTextService.instance) {
			GoogleSpeechToTextService.instance = new GoogleSpeechToTextService();
		}
		return GoogleSpeechToTextService.instance;
	}

	/**
	 * Check if the service is configured
	 */
	public isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Generate a simple hash for cache keys
	 */
	private hashAudio(audio: string): string {
		let hash = 0;
		for (let i = 0; i < Math.min(audio.length, 1000); i++) {
			const char = audio.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return hash.toString(36) + "_" + audio.length;
	}

	/**
	 * Clean expired cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > this.CACHE_TTL) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Transcribe audio content (base64 encoded)
	 *
	 * @param audioContent - Base64 encoded audio data
	 * @param config - Recognition configuration
	 * @returns Transcription result
	 */
	async transcribeAudio(
		audioContent: string,
		config: Partial<RecognitionConfig> = {},
	): Promise<SimpleTranscription> {
		if (!this.apiKey) {
			throw new Error("Speech-to-Text API key not configured");
		}

		// Check cache
		const cacheKey = this.hashAudio(audioContent) + JSON.stringify(config);
		this.cleanCache();
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached.result;
		}

		const fullConfig: RecognitionConfig = {
			languageCode: "en-US",
			enableAutomaticPunctuation: true,
			enableWordTimeOffsets: false,
			profanityFilter: false,
			model: "default",
			...config,
		};

		const response = await fetch(
			`${this.baseUrl}/speech:recognize?key=${this.apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					config: fullConfig,
					audio: {
						content: audioContent,
					},
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Speech-to-Text API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = TranscriptionResponseSchema.parse(data);
		const result = this.simplifyTranscription(validated);

		// Cache result
		this.cache.set(cacheKey, { result, timestamp: Date.now() });

		return result;
	}

	/**
	 * Transcribe audio from a URI (Google Cloud Storage)
	 *
	 * @param audioUri - URI to audio file (gs://bucket/file)
	 * @param config - Recognition configuration
	 * @returns Transcription result
	 */
	async transcribeFromUri(
		audioUri: string,
		config: Partial<RecognitionConfig> = {},
	): Promise<SimpleTranscription> {
		if (!this.apiKey) {
			throw new Error("Speech-to-Text API key not configured");
		}

		const fullConfig: RecognitionConfig = {
			languageCode: "en-US",
			enableAutomaticPunctuation: true,
			enableWordTimeOffsets: false,
			profanityFilter: false,
			model: "default",
			...config,
		};

		const response = await fetch(
			`${this.baseUrl}/speech:recognize?key=${this.apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					config: fullConfig,
					audio: {
						uri: audioUri,
					},
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Speech-to-Text API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = TranscriptionResponseSchema.parse(data);

		return this.simplifyTranscription(validated);
	}

	/**
	 * Long-running transcription for files over 1 minute
	 * Returns operation name for polling
	 *
	 * @param audioUri - URI to audio file (gs://bucket/file)
	 * @param config - Recognition configuration
	 * @returns Operation name for status checking
	 */
	async startLongRunningTranscription(
		audioUri: string,
		config: Partial<RecognitionConfig> = {},
	): Promise<string> {
		if (!this.apiKey) {
			throw new Error("Speech-to-Text API key not configured");
		}

		const fullConfig: RecognitionConfig = {
			languageCode: "en-US",
			enableAutomaticPunctuation: true,
			enableWordTimeOffsets: true,
			profanityFilter: false,
			model: "latest_long",
			diarizationConfig: {
				enableSpeakerDiarization: true,
				minSpeakerCount: 1,
				maxSpeakerCount: 6,
			},
			...config,
		};

		const response = await fetch(
			`${this.baseUrl}/speech:longrunningrecognize?key=${this.apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					config: fullConfig,
					audio: {
						uri: audioUri,
					},
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Speech-to-Text API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		return data.name;
	}

	/**
	 * Check status of long-running operation
	 *
	 * @param operationName - Operation name from startLongRunningTranscription
	 * @returns Operation status and result if complete
	 */
	async checkOperationStatus(operationName: string): Promise<{
		done: boolean;
		result?: SimpleTranscription;
		error?: string;
		progress?: number;
	}> {
		if (!this.apiKey) {
			throw new Error("Speech-to-Text API key not configured");
		}

		const response = await fetch(
			`https://speech.googleapis.com/v1/operations/${operationName}?key=${this.apiKey}`,
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Operation status check error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();

		if (data.error) {
			return {
				done: true,
				error: data.error.message,
			};
		}

		if (data.done) {
			const validated = TranscriptionResponseSchema.parse(data.response);
			return {
				done: true,
				result: this.simplifyTranscription(validated),
			};
		}

		return {
			done: false,
			progress: data.metadata?.progressPercent || 0,
		};
	}

	/**
	 * Transcribe voice note (optimized for short recordings)
	 *
	 * @param audioContent - Base64 encoded audio
	 * @param languageCode - Language code
	 * @returns Simplified transcription
	 */
	async transcribeVoiceNote(
		audioContent: string,
		languageCode: SpeechLanguageCode = "en-US",
	): Promise<SimpleTranscription> {
		return this.transcribeAudio(audioContent, {
			languageCode,
			enableAutomaticPunctuation: true,
			model: "latest_short",
			useEnhanced: true,
		});
	}

	/**
	 * Transcribe phone call recording (optimized for telephony audio)
	 *
	 * @param audioContent - Base64 encoded audio
	 * @param options - Additional options
	 * @returns Transcription with speaker diarization
	 */
	async transcribePhoneCall(
		audioContent: string,
		options: {
			languageCode?: SpeechLanguageCode;
			enableSpeakerDiarization?: boolean;
			maxSpeakers?: number;
		} = {},
	): Promise<SimpleTranscription> {
		const {
			languageCode = "en-US",
			enableSpeakerDiarization = true,
			maxSpeakers = 2,
		} = options;

		return this.transcribeAudio(audioContent, {
			languageCode,
			enableAutomaticPunctuation: true,
			enableWordTimeOffsets: true,
			model: "phone_call",
			useEnhanced: true,
			encoding: "MULAW",
			sampleRateHertz: 8000,
			diarizationConfig: enableSpeakerDiarization
				? {
						enableSpeakerDiarization: true,
						minSpeakerCount: 2,
						maxSpeakerCount: maxSpeakers,
					}
				: undefined,
		});
	}

	/**
	 * Transcribe with field service context
	 * Adds industry-specific vocabulary for better accuracy
	 *
	 * @param audioContent - Base64 encoded audio
	 * @param serviceType - Type of field service
	 * @returns Transcription with boosted terminology
	 */
	async transcribeFieldServiceNote(
		audioContent: string,
		serviceType: "hvac" | "plumbing" | "electrical" | "general" = "general",
	): Promise<SimpleTranscription> {
		const contextPhrases: Record<string, string[]> = {
			hvac: [
				"HVAC",
				"compressor",
				"condenser",
				"evaporator",
				"refrigerant",
				"R-410A",
				"R-22",
				"thermostat",
				"ductwork",
				"BTU",
				"tonnage",
				"SEER",
				"MERV",
				"air handler",
				"blower motor",
				"capacitor",
				"contactor",
				"heat pump",
				"furnace",
				"coil",
			],
			plumbing: [
				"PVC",
				"copper pipe",
				"water heater",
				"sump pump",
				"garbage disposal",
				"faucet",
				"toilet",
				"drain",
				"sewer line",
				"water pressure",
				"shut-off valve",
				"P-trap",
				"backflow",
				"tankless",
				"gallon per minute",
				"GPM",
			],
			electrical: [
				"circuit breaker",
				"outlet",
				"GFCI",
				"AFCI",
				"wire gauge",
				"amperage",
				"voltage",
				"panel",
				"conduit",
				"junction box",
				"ground fault",
				"meter base",
				"disconnect",
				"240 volt",
				"120 volt",
			],
			general: [
				"estimate",
				"invoice",
				"work order",
				"customer",
				"property",
				"scheduled",
				"completed",
				"parts",
				"labor",
				"warranty",
				"follow-up",
				"callback",
			],
		};

		const phrases = [
			...(contextPhrases[serviceType] || []),
			...contextPhrases.general,
		];

		return this.transcribeAudio(audioContent, {
			languageCode: "en-US",
			enableAutomaticPunctuation: true,
			model: "latest_short",
			useEnhanced: true,
			speechContexts: [
				{
					phrases,
					boost: 10,
				},
			],
		});
	}

	/**
	 * Convert transcription response to simplified format
	 */
	private simplifyTranscription(
		response: TranscriptionResponse,
	): SimpleTranscription {
		if (!response.results || response.results.length === 0) {
			return {
				text: "",
				confidence: 0,
			};
		}

		// Combine all transcripts
		const texts: string[] = [];
		const allWords: WordInfo[] = [];
		let totalConfidence = 0;
		let confidenceCount = 0;

		for (const result of response.results) {
			if (result.alternatives && result.alternatives.length > 0) {
				const best = result.alternatives[0];
				texts.push(best.transcript);
				totalConfidence += best.confidence;
				confidenceCount++;

				if (best.words) {
					allWords.push(...best.words);
				}
			}
		}

		// Group words by speaker if diarization was enabled
		const speakers: Array<{ speakerId: number; text: string }> = [];
		if (allWords.some((w) => w.speakerTag !== undefined)) {
			const speakerMap = new Map<number, string[]>();
			for (const word of allWords) {
				const tag = word.speakerTag || 0;
				if (!speakerMap.has(tag)) {
					speakerMap.set(tag, []);
				}
				speakerMap.get(tag)!.push(word.word);
			}
			for (const [speakerId, words] of speakerMap.entries()) {
				speakers.push({
					speakerId,
					text: words.join(" "),
				});
			}
		}

		// Calculate duration from word timestamps
		let duration: number | undefined;
		if (allWords.length > 0) {
			const lastWord = allWords[allWords.length - 1];
			if (lastWord.endTime) {
				duration = parseFloat(lastWord.endTime.replace("s", ""));
			}
		}

		return {
			text: texts.join(" "),
			confidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
			words: allWords.length > 0 ? allWords : undefined,
			speakers: speakers.length > 0 ? speakers : undefined,
			duration,
		};
	}

	/**
	 * Clear the transcription cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// ============================================================================
// Exports
// ============================================================================

export const googleSpeechToTextService =
	GoogleSpeechToTextService.getInstance();
export default googleSpeechToTextService;
