/**
 * AI Extraction API Route
 *
 * Streams AI-extracted data from call transcripts using Vercel AI SDK
 * Supports multiple providers: Groq (fast/cheap), Anthropic Claude Haiku
 */

import { createAnthropic } from "@ai-sdk/anthropic";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import {
  EXTRACTION_PROMPT,
  formatTranscriptForExtraction,
  SYSTEM_PROMPT,
  UPDATE_PROMPT,
} from "@/lib/ai/extraction-prompts";

// Initialize AI providers
const groq = process.env.GROQ_API_KEY
  ? createGroq({ apiKey: process.env.GROQ_API_KEY })
  : null;
const anthropic = process.env.ANTHROPIC_API_KEY
  ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Choose provider based on availability (prefer Groq for speed/cost)
function getModel() {
  if (groq) {
    return groq("llama-3.3-70b-versatile"); // Fast and cost-effective
  }
  if (anthropic) {
    return anthropic("claude-3-5-haiku-20241022"); // Good balance
  }
  throw new Error(
    "No AI provider configured. Please set GROQ_API_KEY or ANTHROPIC_API_KEY"
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, previousExtraction, mode = "full" } = body;

    if (!(transcript && Array.isArray(transcript))) {
      return NextResponse.json(
        { error: "Invalid transcript format" },
        { status: 400 }
      );
    }

    // Format transcript
    const formattedTranscript = formatTranscriptForExtraction(transcript);

    // Choose prompt based on mode
    let prompt: string;
    if (mode === "update" && previousExtraction) {
      prompt = UPDATE_PROMPT.replace(
        "{previousExtraction}",
        JSON.stringify(previousExtraction)
      ).replace("{newTranscript}", formattedTranscript);
    } else {
      prompt = EXTRACTION_PROMPT.replace("{transcript}", formattedTranscript);
    }

    // Stream extraction
    const result = streamText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.3, // Lower temperature for more consistent extraction
    });

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI extraction error:", error);
    return NextResponse.json(
      {
        error: "Failed to extract data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

  return NextResponse.json({
    status: "ok",
    providers: {
      groq: hasGroq,
      anthropic: hasAnthropic,
    },
    activeProvider: hasGroq ? "groq" : hasAnthropic ? "anthropic" : "none",
  });
}
