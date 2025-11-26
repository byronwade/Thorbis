/**
 * Translation API Route
 *
 * Translates text using Google Cloud Translation API.
 *
 * POST /api/translate
 * - Translate text or batch of texts
 * - Supports customer messages, notifications, documents, and chat
 *
 * Request body:
 * - text: Text or array of texts to translate
 * - targetLanguage: Target language code
 * - sourceLanguage: Source language code (optional, auto-detect if not provided)
 * - type: "general" | "customer_message" | "notification" | "document" | "chat"
 * - notification: { title, body } (for notification type)
 * - document: { description?, notes?, lineItems? } (for document type)
 *
 * GET /api/translate/detect
 * - Detect language of text
 *
 * GET /api/translate/languages
 * - List supported languages
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	googleTranslationService,
	type LanguageCode,
} from "@/lib/services/google-translation-service";

// Request validation schema
const translateRequestSchema = z.object({
	text: z.union([
		z.string().min(1, "Text is required"),
		z.array(z.string().min(1)),
	]),
	targetLanguage: z.string().min(2, "Target language is required"),
	sourceLanguage: z.string().optional(),
	type: z
		.enum([
			"general",
			"customer_message",
			"notification",
			"document",
			"chat",
			"field_service_phrase",
		])
		.default("general"),
	notification: z
		.object({
			title: z.string(),
			body: z.string(),
		})
		.optional(),
	document: z
		.object({
			description: z.string().optional(),
			notes: z.string().optional(),
			lineItems: z.array(z.object({ description: z.string() })).optional(),
		})
		.optional(),
	preferredLanguage: z.string().optional(),
});

export async function POST(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if service is configured
		if (!googleTranslationService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Translation service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		// Parse and validate request
		const body = await request.json();
		const validatedData = translateRequestSchema.parse(body);

		const targetLanguage = validatedData.targetLanguage as LanguageCode;
		const sourceLanguage = validatedData.sourceLanguage as
			| LanguageCode
			| undefined;

		let result;

		switch (validatedData.type) {
			case "customer_message": {
				if (typeof validatedData.text !== "string") {
					return NextResponse.json(
						{ error: "Single text string required for customer_message type" },
						{ status: 400 },
					);
				}
				const customerResult =
					await googleTranslationService.translateCustomerMessage(
						validatedData.text,
						targetLanguage,
					);
				result = {
					translatedText: customerResult.translatedText,
					detectedSourceLanguage: customerResult.detectedSourceLanguage,
				};
				break;
			}

			case "notification": {
				if (!validatedData.notification) {
					return NextResponse.json(
						{ error: "Notification object required for notification type" },
						{ status: 400 },
					);
				}
				const notificationResult =
					await googleTranslationService.translateNotification(
						validatedData.notification,
						targetLanguage,
					);
				result = {
					notification: notificationResult,
				};
				break;
			}

			case "document": {
				if (!validatedData.document) {
					return NextResponse.json(
						{ error: "Document object required for document type" },
						{ status: 400 },
					);
				}
				const documentResult = await googleTranslationService.translateDocument(
					validatedData.document,
					targetLanguage,
				);
				result = {
					document: documentResult,
				};
				break;
			}

			case "chat": {
				if (typeof validatedData.text !== "string") {
					return NextResponse.json(
						{ error: "Single text string required for chat type" },
						{ status: 400 },
					);
				}
				const preferredLanguage = (validatedData.preferredLanguage ||
					targetLanguage) as LanguageCode;
				const chatResult = await googleTranslationService.translateChatMessage(
					validatedData.text,
					preferredLanguage,
				);
				result = {
					original: chatResult.original,
					translated: chatResult.translated,
					sourceLanguage: chatResult.sourceLanguage,
					targetLanguage: chatResult.targetLanguage,
					wasTranslated: chatResult.wasTranslated,
				};
				break;
			}

			case "field_service_phrase": {
				if (typeof validatedData.text !== "string") {
					return NextResponse.json(
						{
							error:
								"Single text string required for field_service_phrase type",
						},
						{ status: 400 },
					);
				}
				const phrase = await googleTranslationService.getFieldServicePhrase(
					validatedData.text,
					targetLanguage,
				);
				result = {
					translatedText: phrase,
					sourceLanguage: "en",
					targetLanguage,
				};
				break;
			}

			case "general":
			default:
				if (Array.isArray(validatedData.text)) {
					const batchResults = await googleTranslationService.translateBatch(
						validatedData.text,
						targetLanguage,
						sourceLanguage,
					);
					result = {
						translations: batchResults.map((t) => ({
							translatedText: t.translatedText,
							detectedSourceLanguage: t.detectedSourceLanguage,
						})),
					};
				} else {
					const singleResult = await googleTranslationService.translate(
						validatedData.text,
						targetLanguage,
						sourceLanguage,
					);
					result = {
						translatedText: singleResult.translatedText,
						detectedSourceLanguage: singleResult.detectedSourceLanguage,
					};
				}
				break;
		}

		return NextResponse.json({
			success: true,
			data: result,
		});
	} catch (error) {
		console.error("Translation error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Invalid request data",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to translate",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

// Language detection endpoint
export async function GET(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if service is configured
		if (!googleTranslationService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Translation service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const action = searchParams.get("action");

		if (action === "detect") {
			const text = searchParams.get("text");
			if (!text) {
				return NextResponse.json(
					{ error: "Text parameter required" },
					{ status: 400 },
				);
			}

			const detected = await googleTranslationService.detectLanguage(text);

			return NextResponse.json({
				success: true,
				data: {
					language: detected.language,
					confidence: detected.confidence,
					isReliable: detected.isReliable,
				},
			});
		}

		if (action === "languages") {
			const displayLanguage = (searchParams.get("displayLanguage") ||
				"en") as LanguageCode;
			const languages =
				await googleTranslationService.getSupportedLanguages(displayLanguage);

			return NextResponse.json({
				success: true,
				data: {
					languages,
					count: languages.length,
				},
			});
		}

		return NextResponse.json(
			{
				error: 'Invalid action. Use "detect" or "languages"',
			},
			{ status: 400 },
		);
	} catch (error) {
		console.error("Translation GET error:", error);

		return NextResponse.json(
			{
				error: "Failed to process request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
