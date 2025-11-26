/**
 * Google Cloud Text-to-Speech Service
 *
 * Provides speech synthesis capabilities for Stratos field service platform:
 * - Read notifications aloud for technicians
 * - Accessibility features for visually impaired users
 * - Voice responses for IVR systems
 * - Audio instructions for complex procedures
 *
 * API Documentation: https://cloud.google.com/text-to-speech/docs
 *
 * Features:
 * - 380+ voices across 50+ languages
 * - WaveNet and Neural2 high-quality voices
 * - SSML support for fine-grained control
 * - Adjustable speaking rate, pitch, volume
 * - Multiple audio formats (MP3, WAV, OGG)
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Supported audio encodings for output
 */
export type AudioEncoding = "LINEAR16" | "MP3" | "OGG_OPUS" | "MULAW" | "ALAW";

/**
 * Voice gender options
 */
export type VoiceGender =
	| "SSML_VOICE_GENDER_UNSPECIFIED"
	| "MALE"
	| "FEMALE"
	| "NEUTRAL";

/**
 * Supported language codes for text-to-speech
 */
export type TTSLanguageCode =
	| "en-US"
	| "en-GB"
	| "en-AU"
	| "es-ES"
	| "es-MX"
	| "es-US"
	| "fr-FR"
	| "fr-CA"
	| "de-DE"
	| "it-IT"
	| "pt-BR"
	| "pt-PT"
	| "zh-CN"
	| "ja-JP"
	| "ko-KR"
	| "hi-IN"
	| "ar-XA";

/**
 * Voice selection parameters
 */
export interface VoiceSelectionParams {
	languageCode: TTSLanguageCode;
	name?: string;
	ssmlGender?: VoiceGender;
}

/**
 * Audio configuration
 */
export interface AudioConfig {
	audioEncoding: AudioEncoding;
	speakingRate?: number; // 0.25 to 4.0, default 1.0
	pitch?: number; // -20.0 to 20.0, default 0.0
	volumeGainDb?: number; // -96.0 to 16.0
	sampleRateHertz?: number;
	effectsProfileId?: string[];
}

/**
 * Synthesis input (text or SSML)
 */
export interface SynthesisInput {
	text?: string;
	ssml?: string;
}

/**
 * Voice information from list voices API
 */
export interface Voice {
	languageCodes: string[];
	name: string;
	ssmlGender: VoiceGender;
	naturalSampleRateHertz: number;
}

/**
 * Text-to-Speech response
 */
export interface SynthesizeResponse {
	audioContent: string; // Base64 encoded audio
}

/**
 * Simplified synthesis result
 */
export interface SynthesisResult {
	audioContent: string; // Base64 encoded audio
	audioUrl?: string; // Data URL for direct playback
	mimeType: string;
	duration?: number;
}

// Zod schemas for validation
const VoiceSchema = z.object({
	languageCodes: z.array(z.string()),
	name: z.string(),
	ssmlGender: z.enum([
		"SSML_VOICE_GENDER_UNSPECIFIED",
		"MALE",
		"FEMALE",
		"NEUTRAL",
	]),
	naturalSampleRateHertz: z.number(),
});

const ListVoicesResponseSchema = z.object({
	voices: z.array(VoiceSchema).optional().default([]),
});

const SynthesizeResponseSchema = z.object({
	audioContent: z.string(),
});

// ============================================================================
// Predefined Voice Profiles
// ============================================================================

/**
 * Curated voice profiles for common use cases
 */
export const VOICE_PROFILES = {
	// Professional voices for notifications
	professional: {
		male: { languageCode: "en-US" as TTSLanguageCode, name: "en-US-Neural2-D" },
		female: {
			languageCode: "en-US" as TTSLanguageCode,
			name: "en-US-Neural2-F",
		},
	},
	// Friendly voices for customer-facing
	friendly: {
		male: { languageCode: "en-US" as TTSLanguageCode, name: "en-US-Neural2-J" },
		female: {
			languageCode: "en-US" as TTSLanguageCode,
			name: "en-US-Neural2-H",
		},
	},
	// Clear voices for instructions
	instructional: {
		male: { languageCode: "en-US" as TTSLanguageCode, name: "en-US-Wavenet-B" },
		female: {
			languageCode: "en-US" as TTSLanguageCode,
			name: "en-US-Wavenet-C",
		},
	},
	// Spanish voices
	spanish: {
		male: { languageCode: "es-US" as TTSLanguageCode, name: "es-US-Neural2-B" },
		female: {
			languageCode: "es-US" as TTSLanguageCode,
			name: "es-US-Neural2-A",
		},
	},
} as const;

// ============================================================================
// Service Class
// ============================================================================

/**
 * Google Cloud Text-to-Speech Service
 *
 * Singleton service for speech synthesis operations.
 *
 * @example
 * ```typescript
 * const ttsService = GoogleTextToSpeechService.getInstance();
 *
 * // Simple text-to-speech
 * const result = await ttsService.synthesize('Hello, your appointment is confirmed.');
 *
 * // Play in browser
 * const audio = new Audio(result.audioUrl);
 * audio.play();
 * ```
 */
class GoogleTextToSpeechService {
	private static instance: GoogleTextToSpeechService;
	private apiKey: string | undefined;
	private baseUrl = "https://texttospeech.googleapis.com/v1";

	// Cache for voices list
	private voicesCache: { voices: Voice[]; timestamp: number } | null = null;
	private readonly VOICES_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

	// Cache for synthesized audio (by text hash)
	private audioCache: Map<
		string,
		{ result: SynthesisResult; timestamp: number }
	> = new Map();
	private readonly AUDIO_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

	private constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;

		if (!this.apiKey) {
			console.warn(
				"GoogleTextToSpeechService: No API key found. Set GOOGLE_API_KEY environment variable.",
			);
		}
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): GoogleTextToSpeechService {
		if (!GoogleTextToSpeechService.instance) {
			GoogleTextToSpeechService.instance = new GoogleTextToSpeechService();
		}
		return GoogleTextToSpeechService.instance;
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
	private hashText(text: string, config: object): string {
		const combined = text + JSON.stringify(config);
		let hash = 0;
		for (let i = 0; i < combined.length; i++) {
			const char = combined.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return hash.toString(36);
	}

	/**
	 * Clean expired cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.audioCache.entries()) {
			if (now - value.timestamp > this.AUDIO_CACHE_TTL) {
				this.audioCache.delete(key);
			}
		}
	}

	/**
	 * List available voices
	 *
	 * @param languageCode - Optional language code to filter by
	 * @returns List of available voices
	 */
	async listVoices(languageCode?: TTSLanguageCode): Promise<Voice[]> {
		if (!this.apiKey) {
			throw new Error("Text-to-Speech API key not configured");
		}

		// Check cache
		if (
			this.voicesCache &&
			Date.now() - this.voicesCache.timestamp < this.VOICES_CACHE_TTL
		) {
			const voices = this.voicesCache.voices;
			if (languageCode) {
				return voices.filter((v) => v.languageCodes.includes(languageCode));
			}
			return voices;
		}

		const url = new URL(`${this.baseUrl}/voices`);
		url.searchParams.set("key", this.apiKey);
		if (languageCode) {
			url.searchParams.set("languageCode", languageCode);
		}

		const response = await fetch(url.toString());

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Text-to-Speech API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = ListVoicesResponseSchema.parse(data);

		// Cache full list
		this.voicesCache = { voices: validated.voices, timestamp: Date.now() };

		return validated.voices;
	}

	/**
	 * Synthesize speech from text
	 *
	 * @param text - Text to synthesize
	 * @param options - Voice and audio configuration
	 * @returns Synthesized audio
	 */
	async synthesize(
		text: string,
		options: {
			voice?: Partial<VoiceSelectionParams>;
			audio?: Partial<AudioConfig>;
		} = {},
	): Promise<SynthesisResult> {
		if (!this.apiKey) {
			throw new Error("Text-to-Speech API key not configured");
		}

		// Check cache
		const cacheKey = this.hashText(text, options);
		this.cleanCache();
		const cached = this.audioCache.get(cacheKey);
		if (cached) {
			return cached.result;
		}

		const voice: VoiceSelectionParams = {
			languageCode: "en-US",
			...options.voice,
		};

		const audioConfig: AudioConfig = {
			audioEncoding: "MP3",
			speakingRate: 1.0,
			pitch: 0.0,
			...options.audio,
		};

		const response = await fetch(
			`${this.baseUrl}/text:synthesize?key=${this.apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { text },
					voice,
					audioConfig,
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Text-to-Speech API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = SynthesizeResponseSchema.parse(data);

		const mimeType = this.getMimeType(audioConfig.audioEncoding);
		const result: SynthesisResult = {
			audioContent: validated.audioContent,
			audioUrl: `data:${mimeType};base64,${validated.audioContent}`,
			mimeType,
		};

		// Cache result
		this.audioCache.set(cacheKey, { result, timestamp: Date.now() });

		return result;
	}

	/**
	 * Synthesize speech from SSML
	 *
	 * @param ssml - SSML markup
	 * @param options - Voice and audio configuration
	 * @returns Synthesized audio
	 */
	async synthesizeSSML(
		ssml: string,
		options: {
			voice?: Partial<VoiceSelectionParams>;
			audio?: Partial<AudioConfig>;
		} = {},
	): Promise<SynthesisResult> {
		if (!this.apiKey) {
			throw new Error("Text-to-Speech API key not configured");
		}

		const voice: VoiceSelectionParams = {
			languageCode: "en-US",
			...options.voice,
		};

		const audioConfig: AudioConfig = {
			audioEncoding: "MP3",
			speakingRate: 1.0,
			pitch: 0.0,
			...options.audio,
		};

		const response = await fetch(
			`${this.baseUrl}/text:synthesize?key=${this.apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: { ssml },
					voice,
					audioConfig,
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Text-to-Speech API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = SynthesizeResponseSchema.parse(data);

		const mimeType = this.getMimeType(audioConfig.audioEncoding);
		return {
			audioContent: validated.audioContent,
			audioUrl: `data:${mimeType};base64,${validated.audioContent}`,
			mimeType,
		};
	}

	/**
	 * Speak notification text (optimized for alerts)
	 *
	 * @param text - Notification text
	 * @param urgency - Urgency level affects speaking rate
	 * @returns Synthesized audio
	 */
	async speakNotification(
		text: string,
		urgency: "low" | "normal" | "high" = "normal",
	): Promise<SynthesisResult> {
		const speakingRates = {
			low: 0.9,
			normal: 1.0,
			high: 1.15,
		};

		return this.synthesize(text, {
			voice: VOICE_PROFILES.professional.female,
			audio: {
				audioEncoding: "MP3",
				speakingRate: speakingRates[urgency],
			},
		});
	}

	/**
	 * Speak instructions (clear and slow)
	 *
	 * @param text - Instruction text
	 * @param languageCode - Language for instructions
	 * @returns Synthesized audio
	 */
	async speakInstructions(
		text: string,
		languageCode: TTSLanguageCode = "en-US",
	): Promise<SynthesisResult> {
		const voice = languageCode.startsWith("es")
			? VOICE_PROFILES.spanish.female
			: VOICE_PROFILES.instructional.female;

		return this.synthesize(text, {
			voice: { ...voice, languageCode },
			audio: {
				audioEncoding: "MP3",
				speakingRate: 0.85, // Slower for clarity
				pitch: -1.0, // Slightly lower pitch
			},
		});
	}

	/**
	 * Generate IVR prompt audio
	 *
	 * @param text - IVR prompt text
	 * @returns Synthesized audio optimized for phone
	 */
	async generateIVRPrompt(text: string): Promise<SynthesisResult> {
		return this.synthesize(text, {
			voice: VOICE_PROFILES.professional.female,
			audio: {
				audioEncoding: "MULAW", // Standard for telephony
				sampleRateHertz: 8000,
				speakingRate: 0.95,
			},
		});
	}

	/**
	 * Create appointment reminder audio
	 *
	 * @param customerName - Customer's name
	 * @param date - Appointment date
	 * @param time - Appointment time
	 * @param serviceType - Type of service
	 * @returns Synthesized audio
	 */
	async createAppointmentReminder(
		customerName: string,
		date: string,
		time: string,
		serviceType: string,
	): Promise<SynthesisResult> {
		const text = `Hello ${customerName}. This is a reminder about your ${serviceType} appointment scheduled for ${date} at ${time}. If you need to reschedule, please call us back. Thank you for choosing our services.`;

		return this.synthesize(text, {
			voice: VOICE_PROFILES.friendly.female,
			audio: {
				audioEncoding: "MP3",
				speakingRate: 0.95,
			},
		});
	}

	/**
	 * Create step-by-step procedure audio
	 *
	 * @param steps - Array of step descriptions
	 * @returns Synthesized audio with pauses between steps
	 */
	async createProcedureAudio(steps: string[]): Promise<SynthesisResult> {
		const ssmlSteps = steps
			.map((step, i) => `<p>Step ${i + 1}: ${step}</p><break time="1s"/>`)
			.join("");

		const ssml = `<speak>
      <prosody rate="slow">
        ${ssmlSteps}
        <p>Procedure complete.</p>
      </prosody>
    </speak>`;

		return this.synthesizeSSML(ssml, {
			voice: VOICE_PROFILES.instructional.female,
			audio: {
				audioEncoding: "MP3",
			},
		});
	}

	/**
	 * Get MIME type for audio encoding
	 */
	private getMimeType(encoding: AudioEncoding): string {
		const mimeTypes: Record<AudioEncoding, string> = {
			LINEAR16: "audio/wav",
			MP3: "audio/mpeg",
			OGG_OPUS: "audio/ogg",
			MULAW: "audio/basic",
			ALAW: "audio/basic",
		};
		return mimeTypes[encoding] || "audio/mpeg";
	}

	/**
	 * Clear all caches
	 */
	clearCache(): void {
		this.audioCache.clear();
		this.voicesCache = null;
	}
}

// ============================================================================
// Exports
// ============================================================================

export const googleTextToSpeechService =
	GoogleTextToSpeechService.getInstance();
export default googleTextToSpeechService;
