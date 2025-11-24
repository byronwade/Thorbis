/**
 * Spam Filter Service
 * 
 * Provides AI-powered spam detection using Anthropic Claude,
 * with fallback to rule-based filtering.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export interface SpamCheckResult {
	isSpam: boolean;
	confidence: number; // 0-1, where 1 is most confident
	reason: string;
	method: "ai" | "rules" | "hybrid";
	score?: number; // Spam score (0-100)
}

interface EmailContent {
	subject: string | null;
	body: string | null;
	bodyHtml: string | null;
	fromAddress: string | null;
	fromName: string | null;
	toAddress: string | null;
}

/**
 * Rule-based spam detection (fast, no API calls)
 */
function ruleBasedSpamCheck(email: EmailContent): SpamCheckResult | null {
	const subject = (email.subject || "").toLowerCase();
	const body = (email.body || "").toLowerCase();
	const fromAddress = (email.fromAddress || "").toLowerCase();
	
	let score = 0;
	const reasons: string[] = [];
	
	// Subject-based checks
	const spamSubjectPatterns = [
		/\b(viagra|cialis|pharmacy|pills|medication)\b/i,
		/\b(winner|congratulations|you won|claim your prize)\b/i,
		/\b(urgent|act now|limited time|expires today)\b/i,
		/\b(free money|get rich|make \$|earn \$)\b/i,
		/\b(click here|click now|visit now)\b/i,
		/\b(nigerian prince|inheritance|lottery)\b/i,
	];
	
	for (const pattern of spamSubjectPatterns) {
		if (pattern.test(subject)) {
			score += 15;
			reasons.push(`Suspicious subject pattern: "${pattern.source}"`);
		}
	}
	
	// Body-based checks
	const spamBodyPatterns = [
		/\b(click here|click now|visit our website|unsubscribe)\b/i,
		/\b(guaranteed|risk-free|100% satisfaction)\b/i,
		/\b(act now|limited time|expires soon)\b/i,
		/\b(no credit check|bad credit ok|loan approval)\b/i,
	];
	
	for (const pattern of spamBodyPatterns) {
		if (pattern.test(body)) {
			score += 10;
			reasons.push(`Suspicious body pattern: "${pattern.source}"`);
		}
	}
	
	// Suspicious sender patterns
	if (fromAddress.includes("noreply") || fromAddress.includes("no-reply")) {
		score += 5;
		reasons.push("No-reply sender address");
	}
	
	// Excessive capitalization
	const capsRatio = (subject.match(/[A-Z]/g) || []).length / (subject.length || 1);
	if (capsRatio > 0.5 && subject.length > 10) {
		score += 10;
		reasons.push("Excessive capitalization in subject");
	}
	
	// Suspicious links (basic check)
	const linkCount = (body.match(/https?:\/\//g) || []).length;
	if (linkCount > 5) {
		score += 10;
		reasons.push(`Multiple suspicious links (${linkCount})`);
	}
	
	// Empty or very short body
	if (body.length < 20 && subject.length < 10) {
		score += 5;
		reasons.push("Very short or empty content");
	}
	
	// If score is high enough, mark as spam
	if (score >= 30) {
		return {
			isSpam: true,
			confidence: Math.min(score / 100, 0.9), // Cap at 90% for rules
			reason: reasons.join("; "),
			method: "rules",
			score,
		};
	}
	
	// If score is moderate, return null to defer to AI
	if (score >= 15) {
		return null; // Defer to AI for uncertain cases
	}
	
	// Low score, likely not spam
	return {
		isSpam: false,
		confidence: 0.7,
		reason: "No obvious spam indicators found",
		method: "rules",
		score,
	};
}

/**
 * AI-powered spam detection using Anthropic Claude
 */
async function aiSpamCheck(email: EmailContent): Promise<SpamCheckResult> {
	try {
		const prompt = `You are an email spam detection expert. Analyze the following email and determine if it is spam.

Email Subject: ${email.subject || "(no subject)"}
From: ${email.fromName || ""} <${email.fromAddress || ""}>
To: ${email.toAddress || ""}

Email Body (text):
${email.body || "(no body text)"}

${email.bodyHtml ? `\nEmail Body (HTML - extract text only):\n${email.bodyHtml.substring(0, 2000)}` : ""}

Analyze this email and respond with a JSON object containing:
{
  "isSpam": boolean,
  "confidence": number (0-1),
  "reason": string (brief explanation),
  "score": number (0-100, spam score)
}

Consider these factors:
- Suspicious subject lines (urgent, winner, free money, etc.)
- Suspicious content (phishing, scams, promotional spam)
- Suspicious sender patterns
- Excessive links or attachments
- Poor grammar or formatting (common in spam)
- Legitimate business communications should NOT be marked as spam

Respond ONLY with valid JSON, no other text.`;

		const { text } = await generateText({
			model: anthropic("claude-3-5-haiku-20241022"), // Fast and cost-effective
			prompt,
			maxTokens: 200,
			temperature: 0.1, // Low temperature for consistent classification
		});

		// Parse JSON response - try to extract JSON from text
		let jsonText = text.trim();
		
		// Remove markdown code blocks if present
		jsonText = jsonText.replace(/```json\s*/g, "").replace(/```\s*/g, "");
		
		// Try to find JSON object
		const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			console.error("No JSON found in AI response:", text);
			throw new Error("No JSON found in AI response");
		}

		let result: {
			isSpam: boolean;
			confidence: number;
			reason: string;
			score?: number;
		};
		
		try {
			result = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			console.error("Failed to parse AI response JSON:", jsonMatch[0], parseError);
			throw new Error("Invalid JSON in AI response");
		}

		return {
			isSpam: result.isSpam,
			confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
			reason: result.reason || "AI analysis",
			method: "ai",
			score: result.score || (result.isSpam ? 75 : 25),
		};
	} catch (error) {
		console.error("❌ AI spam check failed:", error);
		// Fallback to rule-based if AI fails
		return {
			isSpam: false,
			confidence: 0.5,
			reason: "AI check failed, using fallback",
			method: "rules",
		};
	}
}

/**
 * Main spam check function
 * Uses hybrid approach: rules first (fast), then AI for uncertain cases
 */
export async function checkSpam(email: EmailContent): Promise<SpamCheckResult> {
	// Check if Anthropic API is available
	const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
	
	// First, try rule-based (fast, no API calls)
	const ruleResult = ruleBasedSpamCheck(email);
	
	// If rules are confident, use that
	if (ruleResult && (ruleResult.confidence > 0.8 || ruleResult.isSpam)) {
		return ruleResult;
	}
	
	// If rules are uncertain and AI is available, use AI
	if (hasAnthropic && (!ruleResult || ruleResult.confidence < 0.7)) {
		const aiResult = await aiSpamCheck(email);
		
		// Combine results if we have both
		if (ruleResult) {
			// Hybrid approach: average confidence, use AI decision if rules uncertain
			return {
				isSpam: aiResult.isSpam || (ruleResult.isSpam && ruleResult.confidence > 0.6),
				confidence: (aiResult.confidence + ruleResult.confidence) / 2,
				reason: `${aiResult.reason} (AI); ${ruleResult.reason} (Rules)`,
				method: "hybrid",
				score: aiResult.score || ruleResult.score,
			};
		}
		
		return aiResult;
	}
	
	// Fallback to rule-based if no AI
	return ruleResult || {
		isSpam: false,
		confidence: 0.5,
		reason: "Insufficient data for spam detection",
		method: "rules",
	};
}

/**
 * Quick spam check (rules only, no AI)
 * Use this for high-volume scenarios where speed is critical
 */
export function quickSpamCheck(email: EmailContent): SpamCheckResult {
	const result = ruleBasedSpamCheck(email);
	return result || {
		isSpam: false,
		confidence: 0.5,
		reason: "No obvious spam indicators",
		method: "rules",
	};
}

