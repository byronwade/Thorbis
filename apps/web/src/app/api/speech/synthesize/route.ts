/**
 * Text-to-Speech API Route
 *
 * Synthesizes speech from text using Google Cloud Text-to-Speech API.
 *
 * POST /api/speech/synthesize
 * - Convert text to speech audio
 * - Supports notifications, instructions, IVR prompts, and appointment reminders
 *
 * Request body:
 * - text: Text to synthesize
 * - type: "notification" | "instructions" | "ivr" | "appointment_reminder" | "procedure" | "general"
 * - urgency: "low" | "normal" | "high" (for notification type)
 * - languageCode: Language code (default: "en-US")
 * - voiceGender: "MALE" | "FEMALE" | "NEUTRAL"
 * - appointment: { customerName, date, time, serviceType } (for appointment_reminder type)
 * - steps: string[] (for procedure type)
 *
 * GET /api/speech/synthesize/voices
 * - List available voices
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	googleTextToSpeechService,
	type TTSLanguageCode,
	type VoiceGender,
} from "@/lib/services/google-text-to-speech-service";

// Request validation schema
const synthesizeRequestSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required")
		.max(5000, "Text must be under 5000 characters"),
	type: z
		.enum([
			"notification",
			"instructions",
			"ivr",
			"appointment_reminder",
			"procedure",
			"general",
		])
		.default("general"),
	urgency: z.enum(["low", "normal", "high"]).optional(),
	languageCode: z
		.enum([
			"en-US",
			"en-GB",
			"en-AU",
			"es-ES",
			"es-MX",
			"es-US",
			"fr-FR",
			"fr-CA",
			"de-DE",
			"it-IT",
			"pt-BR",
			"pt-PT",
			"zh-CN",
			"ja-JP",
			"ko-KR",
			"hi-IN",
			"ar-XA",
		])
		.default("en-US")
		.transform((val) => val as TTSLanguageCode),
	voiceGender: z
		.enum(["MALE", "FEMALE", "NEUTRAL"])
		.optional()
		.transform((val) => val as VoiceGender | undefined),
	voiceName: z.string().optional(),
	speakingRate: z.number().min(0.25).max(4.0).optional(),
	pitch: z.number().min(-20).max(20).optional(),
	appointment: z
		.object({
			customerName: z.string(),
			date: z.string(),
			time: z.string(),
			serviceType: z.string(),
		})
		.optional(),
	steps: z.array(z.string()).optional(),
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
		if (!googleTextToSpeechService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Text-to-Speech service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		// Parse and validate request
		const body = await request.json();
		const validatedData = synthesizeRequestSchema.parse(body);

		let result;

		switch (validatedData.type) {
			case "notification":
				result = await googleTextToSpeechService.speakNotification(
					validatedData.text,
					validatedData.urgency ?? "normal",
				);
				break;

			case "instructions":
				result = await googleTextToSpeechService.speakInstructions(
					validatedData.text,
					validatedData.languageCode,
				);
				break;

			case "ivr":
				result = await googleTextToSpeechService.generateIVRPrompt(
					validatedData.text,
				);
				break;

			case "appointment_reminder":
				if (!validatedData.appointment) {
					return NextResponse.json(
						{
							error:
								"Appointment details required for appointment_reminder type",
						},
						{ status: 400 },
					);
				}
				result = await googleTextToSpeechService.createAppointmentReminder(
					validatedData.appointment.customerName,
					validatedData.appointment.date,
					validatedData.appointment.time,
					validatedData.appointment.serviceType,
				);
				break;

			case "procedure":
				if (!validatedData.steps || validatedData.steps.length === 0) {
					return NextResponse.json(
						{ error: "Steps array required for procedure type" },
						{ status: 400 },
					);
				}
				result = await googleTextToSpeechService.createProcedureAudio(
					validatedData.steps,
				);
				break;

			case "general":
			default:
				result = await googleTextToSpeechService.synthesize(
					validatedData.text,
					{
						voice: {
							languageCode: validatedData.languageCode,
							name: validatedData.voiceName,
							ssmlGender: validatedData.voiceGender,
						},
						audio: {
							audioEncoding: "MP3",
							speakingRate: validatedData.speakingRate,
							pitch: validatedData.pitch,
						},
					},
				);
				break;
		}

		return NextResponse.json({
			success: true,
			data: {
				audioContent: result.audioContent,
				audioUrl: result.audioUrl,
				mimeType: result.mimeType,
				duration: result.duration,
			},
		});
	} catch (error) {
		console.error("Speech synthesis error:", error);

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
				error: "Failed to synthesize speech",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

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
		if (!googleTextToSpeechService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Text-to-Speech service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const languageCode =
			(searchParams.get("languageCode") as TTSLanguageCode) || undefined;

		const voices = await googleTextToSpeechService.listVoices(languageCode);

		return NextResponse.json({
			success: true,
			data: {
				voices,
				count: voices.length,
			},
		});
	} catch (error) {
		console.error("List voices error:", error);

		return NextResponse.json(
			{
				error: "Failed to list voices",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
