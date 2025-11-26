/**
 * Speech-to-Text API Route
 *
 * Transcribes audio content using Google Cloud Speech-to-Text API.
 *
 * POST /api/speech/transcribe
 * - Transcribe audio from base64 content
 * - Supports voice notes, phone calls, and field service context
 *
 * Request body:
 * - audioContent: Base64 encoded audio data
 * - type: "voice_note" | "phone_call" | "field_service" | "general"
 * - languageCode: Language code (default: "en-US")
 * - serviceType: "hvac" | "plumbing" | "electrical" | "general" (for field_service type)
 * - enableSpeakerDiarization: boolean (for phone_call type)
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	googleSpeechToTextService,
	type SpeechLanguageCode,
} from "@/lib/services/google-speech-to-text-service";

// Request validation schema
const transcribeRequestSchema = z.object({
	audioContent: z.string().min(1, "Audio content is required"),
	type: z
		.enum(["voice_note", "phone_call", "field_service", "general"])
		.default("general"),
	languageCode: z
		.enum([
			"en-US",
			"en-GB",
			"es-ES",
			"es-MX",
			"fr-FR",
			"de-DE",
			"it-IT",
			"pt-BR",
			"zh-CN",
			"ja-JP",
			"ko-KR",
		])
		.default("en-US")
		.transform((val) => val as SpeechLanguageCode),
	serviceType: z.enum(["hvac", "plumbing", "electrical", "general"]).optional(),
	enableSpeakerDiarization: z.boolean().optional(),
	maxSpeakers: z.number().min(2).max(6).optional(),
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
		if (!googleSpeechToTextService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Speech-to-Text service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		// Parse and validate request
		const body = await request.json();
		const validatedData = transcribeRequestSchema.parse(body);

		let result;

		switch (validatedData.type) {
			case "voice_note":
				result = await googleSpeechToTextService.transcribeVoiceNote(
					validatedData.audioContent,
					validatedData.languageCode,
				);
				break;

			case "phone_call":
				result = await googleSpeechToTextService.transcribePhoneCall(
					validatedData.audioContent,
					{
						languageCode: validatedData.languageCode,
						enableSpeakerDiarization:
							validatedData.enableSpeakerDiarization ?? true,
						maxSpeakers: validatedData.maxSpeakers ?? 2,
					},
				);
				break;

			case "field_service":
				result = await googleSpeechToTextService.transcribeFieldServiceNote(
					validatedData.audioContent,
					validatedData.serviceType ?? "general",
				);
				break;

			case "general":
			default:
				result = await googleSpeechToTextService.transcribeAudio(
					validatedData.audioContent,
					{
						languageCode: validatedData.languageCode,
						enableAutomaticPunctuation: true,
					},
				);
				break;
		}

		return NextResponse.json({
			success: true,
			data: {
				text: result.text,
				confidence: result.confidence,
				words: result.words,
				speakers: result.speakers,
				duration: result.duration,
			},
		});
	} catch (error) {
		console.error("Speech transcription error:", error);

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
				error: "Failed to transcribe audio",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
