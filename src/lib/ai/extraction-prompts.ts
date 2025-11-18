/**
 * AI Extraction Prompts for Call Transcripts
 *
 * Specialized prompts for field service industry to extract:
 * - Customer information
 * - Job details
 * - Appointment requirements
 *
 * Optimized for cost-effective models (Groq, Claude Haiku)
 */

export const SYSTEM_PROMPT = `You are an AI assistant specialized in extracting structured information from field service call transcripts.

Your job is to analyze conversations between customer service representatives (CSRs) and customers, then extract relevant information into a structured JSON format.

Focus on extracting:
1. Customer Information: name, email, phone, company, address
2. Job Details: title, description, urgency, job type, estimated duration
3. Appointment Needs: preferred date/time, duration, special requirements

IMPORTANT RULES:
- Only extract information explicitly mentioned in the conversation
- Assign confidence scores (0-100) based on clarity and completeness
- If information is unclear or partially mentioned, use lower confidence scores
- For addresses, try to extract full address components (street, city, state, zip)
- For dates/times, convert natural language to ISO format when possible
- Distinguish between urgent and non-urgent issues
- Identify the primary reason for the call (job type)

Return JSON with this exact structure:
{
  "customerInfo": {
    "name": string | null,
    "email": string | null,
    "phone": string | null,
    "company": string | null,
    "address": {
      "street": string | null,
      "city": string | null,
      "state": string | null,
      "zipCode": string | null,
      "full": string | null
    },
    "confidence": number
  },
  "jobDetails": {
    "title": string | null,
    "description": string | null,
    "urgency": "low" | "normal" | "high" | "emergency" | null,
    "type": string | null,
    "estimatedDuration": number | null,
    "confidence": number
  },
  "appointmentNeeds": {
    "preferredDate": string | null,
    "preferredTime": string | null,
    "timePreference": "morning" | "afternoon" | "evening" | "anytime" | null,
    "duration": number | null,
    "specialRequirements": string | null,
    "confidence": number
  },
  "callSummary": string,
  "sentiment": "positive" | "neutral" | "negative",
  "tags": string[]
}`;

export const EXTRACTION_PROMPT = `Analyze the following call transcript and extract all relevant information:

TRANSCRIPT:
{transcript}

Extract customer information, job details, and appointment needs. Be thorough but only include information that is clearly stated. Assign confidence scores based on how explicit and complete the information is.`;

export const UPDATE_PROMPT = `You previously extracted information from a call transcript. Here is the new portion of the conversation:

PREVIOUS EXTRACTION:
{previousExtraction}

NEW TRANSCRIPT PORTION:
{newTranscript}

Update the extraction with any new information found. Maintain or update confidence scores. Only change fields that have new or contradicting information.`;

export function formatTranscriptForExtraction(
	entries: Array<{ speaker: string; text: string; timestamp: Date }>,
): string {
	return entries
		.map((entry) => {
			const time = entry.timestamp.toLocaleTimeString();
			const speaker = entry.speaker === "csr" ? "CSR" : "Customer";
			return `[${time}] ${speaker}: ${entry.text}`;
		})
		.join("\n");
}

export function getJobTypeFromDescription(description: string): string {
	const lower = description.toLowerCase();

	// HVAC
	if (
		lower.includes("heat") ||
		lower.includes("furnace") ||
		lower.includes("hot")
	) {
		return "Heating Repair";
	}
	if (
		lower.includes("cool") ||
		lower.includes("ac") ||
		lower.includes("air condition") ||
		lower.includes("cold")
	) {
		return "Cooling Repair";
	}
	if (lower.includes("hvac") || lower.includes("install")) {
		return "HVAC Installation";
	}

	// Plumbing
	if (
		lower.includes("leak") ||
		lower.includes("pipe") ||
		lower.includes("water")
	) {
		return "Plumbing Repair";
	}
	if (lower.includes("drain") || lower.includes("clog")) {
		return "Drain Service";
	}

	// Electrical
	if (
		lower.includes("electric") ||
		lower.includes("outlet") ||
		lower.includes("wiring")
	) {
		return "Electrical Repair";
	}

	// General
	if (lower.includes("mainten")) {
		return "Maintenance";
	}
	if (lower.includes("inspect")) {
		return "Inspection";
	}
	if (lower.includes("emergen") || lower.includes("urgent")) {
		return "Emergency Service";
	}

	return "General Service";
}
