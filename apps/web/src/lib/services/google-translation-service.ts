/**
 * Google Cloud Translation Service
 *
 * Provides translation capabilities for Stratos field service platform:
 * - Translate customer communications
 * - Multilingual support for technicians
 * - Document translation
 * - Real-time chat translation
 *
 * API Documentation: https://cloud.google.com/translate/docs
 *
 * Features:
 * - 130+ languages supported
 * - Auto-detect source language
 * - Batch translation
 * - HTML and plain text support
 * - Glossary support for terminology
 * - Neural Machine Translation (NMT)
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Common language codes
 */
export type LanguageCode =
	| "en" // English
	| "es" // Spanish
	| "fr" // French
	| "de" // German
	| "it" // Italian
	| "pt" // Portuguese
	| "zh" // Chinese (Simplified)
	| "zh-TW" // Chinese (Traditional)
	| "ja" // Japanese
	| "ko" // Korean
	| "ar" // Arabic
	| "hi" // Hindi
	| "ru" // Russian
	| "vi" // Vietnamese
	| "tl" // Tagalog
	| "th" // Thai
	| "pl" // Polish
	| "uk" // Ukrainian
	| "nl" // Dutch
	| "sv" // Swedish
	| "da" // Danish
	| "no" // Norwegian
	| "fi" // Finnish
	| "el" // Greek
	| "he" // Hebrew
	| "tr" // Turkish
	| "id" // Indonesian
	| "ms" // Malay
	| "bn" // Bengali
	| "pa" // Punjabi
	| string; // Allow any language code

/**
 * Translation format
 */
export type TranslationFormat = "text" | "html";

/**
 * Translation request
 */
export interface TranslationRequest {
	text: string | string[];
	targetLanguage: LanguageCode;
	sourceLanguage?: LanguageCode;
	format?: TranslationFormat;
}

/**
 * Single translation result
 */
export interface Translation {
	translatedText: string;
	detectedSourceLanguage?: string;
	model?: string;
}

/**
 * Translation response
 */
export interface TranslationResponse {
	translations: Translation[];
}

/**
 * Language detection result
 */
export interface DetectedLanguage {
	language: string;
	confidence: number;
	isReliable: boolean;
}

/**
 * Supported language info
 */
export interface SupportedLanguage {
	language: string;
	name: string;
	nativeName?: string;
	supportSource: boolean;
	supportTarget: boolean;
}

// Zod schemas for validation
const TranslationSchema = z.object({
	translatedText: z.string(),
	detectedSourceLanguage: z.string().optional(),
	model: z.string().optional(),
});

const TranslationResponseSchema = z.object({
	data: z.object({
		translations: z.array(TranslationSchema),
	}),
});

const DetectResponseSchema = z.object({
	data: z.object({
		detections: z.array(
			z.array(
				z.object({
					language: z.string(),
					confidence: z.number(),
					isReliable: z.boolean().optional(),
				}),
			),
		),
	}),
});

const LanguagesResponseSchema = z.object({
	data: z.object({
		languages: z.array(
			z.object({
				language: z.string(),
				name: z.string().optional(),
			}),
		),
	}),
});

// ============================================================================
// Common Field Service Terms
// ============================================================================

/**
 * Field service terminology for better translations
 */
export const FIELD_SERVICE_GLOSSARY: Record<string, Record<string, string>> = {
	// English to Spanish
	es: {
		"work order": "orden de trabajo",
		estimate: "presupuesto",
		invoice: "factura",
		appointment: "cita",
		technician: "técnico",
		customer: "cliente",
		property: "propiedad",
		"service call": "llamada de servicio",
		warranty: "garantía",
		"parts and labor": "piezas y mano de obra",
		"air conditioning": "aire acondicionado",
		heating: "calefacción",
		plumbing: "plomería",
		electrical: "eléctrico",
		"water heater": "calentador de agua",
		thermostat: "termostato",
		compressor: "compresor",
		"circuit breaker": "disyuntor",
		"scheduled for": "programado para",
		"en route": "en camino",
		completed: "completado",
		pending: "pendiente",
	},
	// Add more languages as needed
};

// ============================================================================
// Service Class
// ============================================================================

/**
 * Google Cloud Translation Service
 *
 * Singleton service for translation operations.
 *
 * @example
 * ```typescript
 * const translationService = GoogleTranslationService.getInstance();
 *
 * // Simple translation
 * const result = await translationService.translate(
 *   'Your appointment is confirmed',
 *   'es'
 * );
 * console.log(result.translatedText); // "Su cita está confirmada"
 *
 * // Detect language
 * const detected = await translationService.detectLanguage('Bonjour');
 * console.log(detected.language); // "fr"
 * ```
 */
class GoogleTranslationService {
	private static instance: GoogleTranslationService;
	private apiKey: string | undefined;
	private baseUrl = "https://translation.googleapis.com/language/translate/v2";

	// Cache for translations
	private translationCache: Map<
		string,
		{ result: Translation; timestamp: number }
	> = new Map();
	private readonly TRANSLATION_CACHE_TTL = 1000 * 60 * 60; // 1 hour

	// Cache for supported languages
	private languagesCache: {
		languages: SupportedLanguage[];
		timestamp: number;
	} | null = null;
	private readonly LANGUAGES_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

	private constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;

		if (!this.apiKey) {
			console.warn(
				"GoogleTranslationService: No API key found. Set GOOGLE_API_KEY environment variable.",
			);
		}
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): GoogleTranslationService {
		if (!GoogleTranslationService.instance) {
			GoogleTranslationService.instance = new GoogleTranslationService();
		}
		return GoogleTranslationService.instance;
	}

	/**
	 * Check if the service is configured
	 */
	public isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Generate cache key for translation
	 */
	private getCacheKey(text: string, target: string, source?: string): string {
		return `${text}_${target}_${source || "auto"}`;
	}

	/**
	 * Clean expired cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.translationCache.entries()) {
			if (now - value.timestamp > this.TRANSLATION_CACHE_TTL) {
				this.translationCache.delete(key);
			}
		}
	}

	/**
	 * Translate text to target language
	 *
	 * @param text - Text to translate
	 * @param targetLanguage - Target language code
	 * @param sourceLanguage - Optional source language (auto-detect if not provided)
	 * @param format - Text format (text or html)
	 * @returns Translation result
	 */
	async translate(
		text: string,
		targetLanguage: LanguageCode,
		sourceLanguage?: LanguageCode,
		format: TranslationFormat = "text",
	): Promise<Translation> {
		if (!this.apiKey) {
			throw new Error("Translation API key not configured");
		}

		// Check cache
		const cacheKey = this.getCacheKey(text, targetLanguage, sourceLanguage);
		this.cleanCache();
		const cached = this.translationCache.get(cacheKey);
		if (cached) {
			return cached.result;
		}

		const params = new URLSearchParams({
			key: this.apiKey,
			q: text,
			target: targetLanguage,
			format,
		});

		if (sourceLanguage) {
			params.set("source", sourceLanguage);
		}

		const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
			method: "POST",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Translation API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = TranslationResponseSchema.parse(data);

		const result = validated.data.translations[0];

		// Cache result
		this.translationCache.set(cacheKey, { result, timestamp: Date.now() });

		return result;
	}

	/**
	 * Translate multiple texts in batch
	 *
	 * @param texts - Array of texts to translate
	 * @param targetLanguage - Target language code
	 * @param sourceLanguage - Optional source language
	 * @returns Array of translation results
	 */
	async translateBatch(
		texts: string[],
		targetLanguage: LanguageCode,
		sourceLanguage?: LanguageCode,
	): Promise<Translation[]> {
		if (!this.apiKey) {
			throw new Error("Translation API key not configured");
		}

		if (texts.length === 0) {
			return [];
		}

		// Build query string with multiple q parameters
		const params = new URLSearchParams({
			key: this.apiKey,
			target: targetLanguage,
			format: "text",
		});

		if (sourceLanguage) {
			params.set("source", sourceLanguage);
		}

		// Add each text as a separate q parameter
		const queryParts = [
			params.toString(),
			...texts.map((t) => `q=${encodeURIComponent(t)}`),
		];

		const response = await fetch(`${this.baseUrl}?${queryParts.join("&")}`, {
			method: "POST",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Translation API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = TranslationResponseSchema.parse(data);

		return validated.data.translations;
	}

	/**
	 * Detect the language of text
	 *
	 * @param text - Text to analyze
	 * @returns Detected language information
	 */
	async detectLanguage(text: string): Promise<DetectedLanguage> {
		if (!this.apiKey) {
			throw new Error("Translation API key not configured");
		}

		const params = new URLSearchParams({
			key: this.apiKey,
			q: text,
		});

		const response = await fetch(
			`${this.baseUrl}/detect?${params.toString()}`,
			{
				method: "POST",
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Language detection error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = DetectResponseSchema.parse(data);

		const detection = validated.data.detections[0][0];
		return {
			language: detection.language,
			confidence: detection.confidence,
			isReliable: detection.isReliable ?? detection.confidence > 0.5,
		};
	}

	/**
	 * Get list of supported languages
	 *
	 * @param displayLanguage - Language to use for names (default: en)
	 * @returns List of supported languages
	 */
	async getSupportedLanguages(
		displayLanguage: LanguageCode = "en",
	): Promise<SupportedLanguage[]> {
		if (!this.apiKey) {
			throw new Error("Translation API key not configured");
		}

		// Check cache
		if (
			this.languagesCache &&
			Date.now() - this.languagesCache.timestamp < this.LANGUAGES_CACHE_TTL
		) {
			return this.languagesCache.languages;
		}

		const params = new URLSearchParams({
			key: this.apiKey,
			target: displayLanguage,
		});

		const response = await fetch(
			`${this.baseUrl}/languages?${params.toString()}`,
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Get languages error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = LanguagesResponseSchema.parse(data);

		const languages: SupportedLanguage[] = validated.data.languages.map(
			(lang) => ({
				language: lang.language,
				name: lang.name || lang.language,
				supportSource: true,
				supportTarget: true,
			}),
		);

		// Cache result
		this.languagesCache = { languages, timestamp: Date.now() };

		return languages;
	}

	/**
	 * Translate customer message with field service context
	 *
	 * @param message - Customer message
	 * @param targetLanguage - Target language
	 * @returns Translated message with terminology preserved
	 */
	async translateCustomerMessage(
		message: string,
		targetLanguage: LanguageCode,
	): Promise<Translation> {
		// First detect the source language
		const detected = await this.detectLanguage(message);

		// Skip if already in target language
		if (detected.language === targetLanguage) {
			return {
				translatedText: message,
				detectedSourceLanguage: detected.language,
			};
		}

		return this.translate(
			message,
			targetLanguage,
			detected.language as LanguageCode,
		);
	}

	/**
	 * Translate notification for customer
	 *
	 * @param notification - Notification object with text
	 * @param customerLanguage - Customer's preferred language
	 * @returns Translated notification
	 */
	async translateNotification(
		notification: {
			title: string;
			body: string;
		},
		customerLanguage: LanguageCode,
	): Promise<{
		title: string;
		body: string;
	}> {
		if (customerLanguage === "en") {
			return notification;
		}

		const [titleResult, bodyResult] = await this.translateBatch(
			[notification.title, notification.body],
			customerLanguage,
			"en",
		);

		return {
			title: titleResult.translatedText,
			body: bodyResult.translatedText,
		};
	}

	/**
	 * Translate invoice/estimate for customer
	 *
	 * @param document - Document with translatable fields
	 * @param targetLanguage - Customer's language
	 * @returns Translated document fields
	 */
	async translateDocument(
		document: {
			description?: string;
			notes?: string;
			lineItems?: Array<{ description: string }>;
		},
		targetLanguage: LanguageCode,
	): Promise<{
		description?: string;
		notes?: string;
		lineItems?: Array<{ description: string }>;
	}> {
		if (targetLanguage === "en") {
			return document;
		}

		const textsToTranslate: string[] = [];
		const mapping: Array<{ field: string; index?: number }> = [];

		if (document.description) {
			textsToTranslate.push(document.description);
			mapping.push({ field: "description" });
		}

		if (document.notes) {
			textsToTranslate.push(document.notes);
			mapping.push({ field: "notes" });
		}

		if (document.lineItems) {
			document.lineItems.forEach((item, index) => {
				textsToTranslate.push(item.description);
				mapping.push({ field: "lineItem", index });
			});
		}

		if (textsToTranslate.length === 0) {
			return document;
		}

		const translations = await this.translateBatch(
			textsToTranslate,
			targetLanguage,
			"en",
		);

		const result: {
			description?: string;
			notes?: string;
			lineItems?: Array<{ description: string }>;
		} = {};

		const translatedLineItems: Array<{ description: string }> =
			document.lineItems ? [...document.lineItems] : [];

		translations.forEach((translation, i) => {
			const map = mapping[i];
			if (map.field === "description") {
				result.description = translation.translatedText;
			} else if (map.field === "notes") {
				result.notes = translation.translatedText;
			} else if (map.field === "lineItem" && map.index !== undefined) {
				translatedLineItems[map.index] = {
					description: translation.translatedText,
				};
			}
		});

		if (document.lineItems) {
			result.lineItems = translatedLineItems;
		}

		return result;
	}

	/**
	 * Get common field service phrase translations
	 *
	 * @param phrase - English phrase
	 * @param targetLanguage - Target language
	 * @returns Translated phrase (from glossary or API)
	 */
	async getFieldServicePhrase(
		phrase: string,
		targetLanguage: LanguageCode,
	): Promise<string> {
		// Check glossary first for common terms
		const glossary = FIELD_SERVICE_GLOSSARY[targetLanguage];
		if (glossary) {
			const lowerPhrase = phrase.toLowerCase();
			if (glossary[lowerPhrase]) {
				return glossary[lowerPhrase];
			}
		}

		// Fall back to API translation
		const result = await this.translate(phrase, targetLanguage, "en");
		return result.translatedText;
	}

	/**
	 * Translate chat message with auto-detection
	 *
	 * @param message - Chat message
	 * @param preferredLanguage - Preferred output language
	 * @returns Translated message with source info
	 */
	async translateChatMessage(
		message: string,
		preferredLanguage: LanguageCode,
	): Promise<{
		original: string;
		translated: string;
		sourceLanguage: string;
		targetLanguage: string;
		wasTranslated: boolean;
	}> {
		const detected = await this.detectLanguage(message);

		if (detected.language === preferredLanguage) {
			return {
				original: message,
				translated: message,
				sourceLanguage: detected.language,
				targetLanguage: preferredLanguage,
				wasTranslated: false,
			};
		}

		const translation = await this.translate(
			message,
			preferredLanguage,
			detected.language as LanguageCode,
		);

		return {
			original: message,
			translated: translation.translatedText,
			sourceLanguage: detected.language,
			targetLanguage: preferredLanguage,
			wasTranslated: true,
		};
	}

	/**
	 * Clear all caches
	 */
	clearCache(): void {
		this.translationCache.clear();
		this.languagesCache = null;
	}
}

// ============================================================================
// Exports
// ============================================================================

export const googleTranslationService = GoogleTranslationService.getInstance();
export default googleTranslationService;
