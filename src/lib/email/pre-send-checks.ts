import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Pre-Send Email Deliverability Checks
 *
 * Comprehensive checks before sending any email:
 * 1. Suppression list check (bounces, complaints, unsubscribes)
 * 2. Domain verification status
 * 3. Content spam score analysis
 * 4. Reputation check
 * 5. Rate/volume considerations for warm-up
 */

export interface PreSendCheckResult {
	allowed: boolean;
	warnings: string[];
	errors: string[];
	suggestions: string[];
	spamScore?: number;
	recipientStatus?: {
		email: string;
		suppressed: boolean;
		reason?: string;
	}[];
}

// Spam trigger words and patterns
const SPAM_TRIGGERS = {
	urgency: [
		"act now",
		"limited time",
		"urgent",
		"immediate",
		"expires",
		"hurry",
		"don't miss",
		"last chance",
		"final notice",
		"deadline",
	],
	money: [
		"free",
		"$$$",
		"cash",
		"discount",
		"save big",
		"best price",
		"cheap",
		"bargain",
		"bonus",
		"prize",
		"winner",
		"congratulations",
	],
	suspicious: [
		"click here",
		"click below",
		"buy now",
		"order now",
		"subscribe now",
		"sign up free",
		"no obligation",
		"risk free",
		"100% free",
		"act immediately",
	],
	formatting: [
		"ALL CAPS WORDS",
		"!!!",
		"???",
		"$$$",
		"***",
		"###",
	],
};

// Weight multipliers for spam scoring
const SPAM_WEIGHTS = {
	urgency: 2,
	money: 3,
	suspicious: 4,
	formatting: 1.5,
	excessiveLinks: 5,
	noUnsubscribe: 3,
	shortContent: 2,
	imageHeavy: 3,
};

/**
 * Check if recipient is on suppression list (bounces, complaints, unsubscribes)
 */
export async function checkSuppressionList(
	companyId: string,
	recipientEmails: string[]
): Promise<Map<string, { suppressed: boolean; reason?: string; suppressedAt?: string }>> {
	const supabase = await createServiceSupabaseClient();
	const results = new Map<string, { suppressed: boolean; reason?: string; suppressedAt?: string }>();

	// Initialize all as not suppressed
	for (const email of recipientEmails) {
		results.set(email.toLowerCase(), { suppressed: false });
	}

	// Check suppression list
	const { data: suppressions } = await supabase
		.from("email_suppressions")
		.select("email, reason, created_at")
		.eq("company_id", companyId)
		.in("email", recipientEmails.map((e) => e.toLowerCase()));

	if (suppressions) {
		for (const suppression of suppressions) {
			results.set(suppression.email, {
				suppressed: true,
				reason: suppression.reason,
				suppressedAt: suppression.created_at,
			});
		}
	}

	// Also check global hard bounces (cross-company)
	const { data: globalBounces } = await supabase
		.from("email_global_bounces")
		.select("email, bounce_type, created_at")
		.in("email", recipientEmails.map((e) => e.toLowerCase()))
		.eq("bounce_type", "hard");

	if (globalBounces) {
		for (const bounce of globalBounces) {
			const existing = results.get(bounce.email);
			if (!existing?.suppressed) {
				results.set(bounce.email, {
					suppressed: true,
					reason: `Global hard bounce: ${bounce.bounce_type}`,
					suppressedAt: bounce.created_at,
				});
			}
		}
	}

	return results;
}

/**
 * Calculate spam score for email content
 * Lower is better: 0-30 = good, 30-60 = warning, 60+ = likely spam
 */
export function calculateSpamScore(
	subject: string,
	htmlContent: string,
	textContent: string,
	hasUnsubscribeLink: boolean
): { score: number; issues: string[] } {
	let score = 0;
	const issues: string[] = [];

	const fullText = `${subject} ${textContent}`.toLowerCase();
	const htmlLower = htmlContent.toLowerCase();

	// Check spam trigger words
	for (const [category, words] of Object.entries(SPAM_TRIGGERS)) {
		const weight = SPAM_WEIGHTS[category as keyof typeof SPAM_WEIGHTS] || 1;
		for (const word of words) {
			const regex = new RegExp(word.toLowerCase(), "gi");
			const matches = fullText.match(regex);
			if (matches) {
				score += matches.length * weight;
				if (matches.length > 1) {
					issues.push(`Contains "${word}" ${matches.length} times`);
				}
			}
		}
	}

	// Check for ALL CAPS in subject
	const capsWords = subject.split(" ").filter((w) => w.length > 3 && w === w.toUpperCase());
	if (capsWords.length > 0) {
		score += capsWords.length * 3;
		issues.push(`Subject contains ${capsWords.length} ALL CAPS words`);
	}

	// Check excessive punctuation
	const exclamations = (subject.match(/!/g) || []).length;
	if (exclamations > 1) {
		score += exclamations * 2;
		issues.push(`Excessive exclamation marks in subject (${exclamations})`);
	}

	// Check link density
	const links = (htmlLower.match(/<a\s/gi) || []).length;
	const wordCount = textContent.split(/\s+/).length;
	if (wordCount > 0 && links / wordCount > 0.1) {
		score += SPAM_WEIGHTS.excessiveLinks;
		issues.push(`High link density (${links} links in ${wordCount} words)`);
	}

	// Check image-to-text ratio
	const images = (htmlLower.match(/<img\s/gi) || []).length;
	if (images > 0 && textContent.length < 200) {
		score += SPAM_WEIGHTS.imageHeavy;
		issues.push("Image-heavy email with little text");
	}

	// Check for unsubscribe link
	if (!hasUnsubscribeLink) {
		score += SPAM_WEIGHTS.noUnsubscribe;
		issues.push("Missing unsubscribe link (required for marketing emails)");
	}

	// Check content length (very short emails look suspicious)
	if (textContent.length < 50) {
		score += SPAM_WEIGHTS.shortContent;
		issues.push("Very short email content");
	}

	// Check for suspicious patterns
	if (htmlLower.includes("display:none") || htmlLower.includes("font-size:0")) {
		score += 10;
		issues.push("Contains hidden text (spam technique)");
	}

	// Check for deceptive link text
	const deceptiveLinkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
	let match;
	while ((match = deceptiveLinkPattern.exec(htmlContent)) !== null) {
		const href = match[1].toLowerCase();
		const text = match[2].toLowerCase();
		if (
			text.includes("click here") ||
			text.includes("click this") ||
			(text.startsWith("http") && !text.includes(new URL(href).hostname))
		) {
			score += 5;
			issues.push("Contains deceptive or vague link text");
			break;
		}
	}

	return { score: Math.min(score, 100), issues };
}

/**
 * Check domain warm-up status and recommend volume
 */
export async function checkDomainWarmup(
	domainId: string
): Promise<{
	inWarmup: boolean;
	daysSinceCreation: number;
	recommendedDailyLimit: number;
	currentDaySent: number;
	suggestions: string[];
}> {
	const supabase = await createServiceSupabaseClient();

	const { data: domain } = await supabase
		.from("company_email_domains")
		.select("created_at, emails_sent_today, total_emails_sent, warmup_completed")
		.eq("id", domainId)
		.single();

	if (!domain) {
		return {
			inWarmup: true,
			daysSinceCreation: 0,
			recommendedDailyLimit: 10,
			currentDaySent: 0,
			suggestions: ["Domain not found"],
		};
	}

	const createdAt = new Date(domain.created_at);
	const now = new Date();
	const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

	// Warm-up schedule (days -> max emails per day)
	// Gradual increase over 4-6 weeks for best deliverability
	const warmupSchedule: Record<number, number> = {
		0: 20, // Day 0-1: 20 emails
		2: 50, // Day 2-3: 50 emails
		4: 100, // Day 4-6: 100 emails
		7: 200, // Week 2: 200 emails
		14: 500, // Week 3: 500 emails
		21: 1000, // Week 4: 1000 emails
		28: 2500, // Week 5: 2500 emails
		35: 5000, // Week 6: 5000 emails
		42: 10000, // Week 7+: 10000 emails
	};

	let recommendedLimit = 20;
	for (const [day, limit] of Object.entries(warmupSchedule)) {
		if (daysSinceCreation >= parseInt(day)) {
			recommendedLimit = limit;
		}
	}

	const inWarmup = daysSinceCreation < 42 && !domain.warmup_completed;
	const suggestions: string[] = [];

	if (inWarmup) {
		suggestions.push(
			`Domain is in warm-up period (day ${daysSinceCreation}/42). Recommended daily limit: ${recommendedLimit} emails.`
		);

		if (domain.emails_sent_today >= recommendedLimit * 0.8) {
			suggestions.push(
				"Approaching daily warm-up limit. Consider spreading sends across multiple days."
			);
		}
	}

	return {
		inWarmup,
		daysSinceCreation,
		recommendedDailyLimit: recommendedLimit,
		currentDaySent: domain.emails_sent_today || 0,
		suggestions,
	};
}

/**
 * Verify domain is properly configured for sending
 */
export async function verifyDomainStatus(
	domainId: string
): Promise<{
	canSend: boolean;
	issues: string[];
	dnsStatus: {
		spf: boolean;
		dkim: boolean;
		dmarc: boolean;
	};
}> {
	const supabase = await createServiceSupabaseClient();

	const { data: domain } = await supabase
		.from("company_email_domains")
		.select("status, is_suspended, sending_enabled, spf_verified, dkim_verified, dmarc_verified")
		.eq("id", domainId)
		.single();

	if (!domain) {
		return {
			canSend: false,
			issues: ["Domain not found"],
			dnsStatus: { spf: false, dkim: false, dmarc: false },
		};
	}

	const issues: string[] = [];

	if (domain.status !== "verified") {
		issues.push(`Domain not verified (status: ${domain.status})`);
	}

	if (domain.is_suspended) {
		issues.push("Domain is suspended");
	}

	if (!domain.sending_enabled) {
		issues.push("Sending is disabled for this domain");
	}

	if (!domain.spf_verified) {
		issues.push("SPF record not verified - emails may fail authentication");
	}

	if (!domain.dkim_verified) {
		issues.push("DKIM not verified - emails may fail authentication");
	}

	if (!domain.dmarc_verified) {
		issues.push("DMARC not configured - reduces deliverability");
	}

	return {
		canSend: issues.length === 0,
		issues,
		dnsStatus: {
			spf: domain.spf_verified || false,
			dkim: domain.dkim_verified || false,
			dmarc: domain.dmarc_verified || false,
		},
	};
}

/**
 * Comprehensive pre-send check combining all validations
 */
export async function runPreSendChecks(
	companyId: string,
	domainId: string,
	recipientEmails: string[],
	subject: string,
	htmlContent: string,
	textContent: string,
	isMarketingEmail: boolean = false
): Promise<PreSendCheckResult> {
	const warnings: string[] = [];
	const errors: string[] = [];
	const suggestions: string[] = [];

	// 1. Check domain status
	const domainStatus = await verifyDomainStatus(domainId);
	if (!domainStatus.canSend) {
		errors.push(...domainStatus.issues);
	} else {
		// Add warnings for missing DNS records
		if (!domainStatus.dnsStatus.dmarc) {
			warnings.push("DMARC not configured - consider adding for better deliverability");
		}
	}

	// 2. Check suppression list
	const suppressions = await checkSuppressionList(companyId, recipientEmails);
	const recipientStatus: PreSendCheckResult["recipientStatus"] = [];
	let suppressedCount = 0;

	for (const [email, status] of suppressions) {
		recipientStatus.push({
			email,
			suppressed: status.suppressed,
			reason: status.reason,
		});
		if (status.suppressed) {
			suppressedCount++;
		}
	}

	if (suppressedCount > 0) {
		warnings.push(
			`${suppressedCount} recipient(s) on suppression list and will be skipped`
		);
	}

	if (suppressedCount === recipientEmails.length) {
		errors.push("All recipients are on suppression list - no emails will be sent");
	}

	// 3. Calculate spam score
	const hasUnsubscribe =
		htmlContent.includes("unsubscribe") ||
		htmlContent.includes("List-Unsubscribe");
	const spamAnalysis = calculateSpamScore(
		subject,
		htmlContent,
		textContent,
		hasUnsubscribe || !isMarketingEmail
	);

	if (spamAnalysis.score >= 60) {
		errors.push(
			`High spam score (${spamAnalysis.score}/100) - email likely to be filtered`
		);
		errors.push(...spamAnalysis.issues);
	} else if (spamAnalysis.score >= 30) {
		warnings.push(
			`Moderate spam score (${spamAnalysis.score}/100) - consider improvements`
		);
		warnings.push(...spamAnalysis.issues);
	}

	// 4. Check warm-up status
	const warmupStatus = await checkDomainWarmup(domainId);
	if (warmupStatus.inWarmup) {
		suggestions.push(...warmupStatus.suggestions);

		const activeRecipients = recipientEmails.length - suppressedCount;
		const remainingCapacity =
			warmupStatus.recommendedDailyLimit - warmupStatus.currentDaySent;

		if (activeRecipients > remainingCapacity) {
			warnings.push(
				`Sending ${activeRecipients} emails exceeds warm-up limit (${remainingCapacity} remaining today). ` +
					`Consider sending over multiple days.`
			);
		}
	}

	// 5. Content-specific suggestions
	if (!htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
		suggestions.push(
			"Consider using proper HTML structure with DOCTYPE for better rendering"
		);
	}

	if (textContent.length < 100) {
		suggestions.push(
			"Consider adding more text content - very short emails may look suspicious"
		);
	}

	if (isMarketingEmail && !hasUnsubscribe) {
		errors.push(
			"Marketing emails MUST include an unsubscribe link (CAN-SPAM requirement)"
		);
	}

	// Check for personalization
	if (
		!htmlContent.includes("{{") &&
		!htmlContent.includes("{name}") &&
		!subject.includes("{{")
	) {
		suggestions.push(
			"Consider adding personalization (recipient name, company) for better engagement"
		);
	}

	return {
		allowed: errors.length === 0,
		warnings,
		errors,
		suggestions,
		spamScore: spamAnalysis.score,
		recipientStatus,
	};
}

/**
 * Add email to suppression list
 */
export async function addToSuppressionList(
	companyId: string,
	email: string,
	reason: "bounce" | "complaint" | "unsubscribe" | "manual",
	details?: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase.from("email_suppressions").upsert(
		{
			company_id: companyId,
			email: email.toLowerCase(),
			reason,
			details,
			created_at: new Date().toISOString(),
		},
		{
			onConflict: "company_id,email",
		}
	);

	if (error) {
		console.error("Error adding to suppression list:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

/**
 * Add email to global bounce list (cross-company hard bounces)
 */
export async function addToGlobalBounceList(
	email: string,
	bounceType: "hard" | "soft",
	bounceReason?: string
): Promise<{ success: boolean; error?: string }> {
	// Only track hard bounces globally
	if (bounceType !== "hard") {
		return { success: true };
	}

	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase.from("email_global_bounces").upsert(
		{
			email: email.toLowerCase(),
			bounce_type: bounceType,
			bounce_reason: bounceReason,
			bounce_count: 1,
			last_bounce_at: new Date().toISOString(),
			created_at: new Date().toISOString(),
		},
		{
			onConflict: "email",
		}
	);

	if (error) {
		console.error("Error adding to global bounce list:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

/**
 * Remove email from suppression list (for manual review cases)
 */
export async function removeFromSuppressionList(
	companyId: string,
	email: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase
		.from("email_suppressions")
		.delete()
		.eq("company_id", companyId)
		.eq("email", email.toLowerCase());

	if (error) {
		console.error("Error removing from suppression list:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

/**
 * Get suppression list for a company
 */
export async function getSuppressionList(
	companyId: string,
	limit: number = 100,
	offset: number = 0
): Promise<{
	data: Array<{
		email: string;
		reason: string;
		details?: string;
		created_at: string;
	}>;
	total: number;
}> {
	const supabase = await createServiceSupabaseClient();

	const { data, count, error } = await supabase
		.from("email_suppressions")
		.select("email, reason, details, created_at", { count: "exact" })
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		console.error("Error fetching suppression list:", error);
		return { data: [], total: 0 };
	}

	return { data: data || [], total: count || 0 };
}
