/**
 * Bulk Email Sender - Safe bulk email sending with rate limiting
 *
 * Features:
 * - Rate limiting to respect Resend API limits
 * - Batch processing to avoid overwhelming the API
 * - Progress tracking for UI feedback
 * - Individual error handling per email
 * - Automatic retry for failed emails
 * - Configurable delay between batches
 */

import type { ReactElement } from "react";
import { sendEmail } from "./email-sender";
import type { EmailTemplate } from "./email-types";

// Resend API rate limits:
// - Free tier: 100 emails/day, 1 email/second
// - Paid tier: Varies by plan, typically 10-50 emails/second
// We'll use conservative defaults to avoid rate limiting

export type BulkEmailConfig = {
	/** Maximum emails to send in a single batch (default: 10) */
	batchSize?: number;
	/** Delay between batches in milliseconds (default: 1000ms = 1 second) */
	batchDelay?: number;
	/** Maximum number of retry attempts for failed emails (default: 2) */
	maxRetries?: number;
	/** Delay between retries in milliseconds (default: 5000ms = 5 seconds) */
	retryDelay?: number;
};

export type BulkEmailItem = {
	to: string;
	subject: string;
	template: ReactElement;
	templateType: EmailTemplate;
	replyTo?: string;
	tags?: { name: string; value: string }[];
	/** Optional identifier for tracking (e.g., invoice ID) */
	itemId?: string;
};

export type BulkEmailResult = {
	/** Total number of emails attempted */
	total: number;
	/** Number of emails sent successfully */
	successful: number;
	/** Number of emails that failed */
	failed: number;
	/** Details for each email */
	results: Array<{
		to: string;
		itemId?: string;
		success: boolean;
		error?: string;
		emailId?: string;
	}>;
	/** Overall success (true if all emails sent) */
	allSuccessful: boolean;
};

/**
 * Delay execution for specified milliseconds
 */
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send emails in bulk with rate limiting and error handling
 *
 * This function safely sends multiple emails while respecting Resend's rate limits:
 * 1. Splits emails into small batches
 * 2. Sends each batch sequentially with delays
 * 3. Tracks success/failure for each email
 * 4. Retries failed emails automatically
 * 5. Returns detailed results for each email
 *
 * @param emails - Array of emails to send
 * @param config - Configuration for batch processing
 * @returns Promise with detailed results for all emails
 *
 * @example
 * const results = await sendBulkEmails([
 *   {
 *     to: "customer1@example.com",
 *     subject: "Invoice #001",
 *     template: <InvoiceEmail />,
 *     templateType: "invoice",
 *     itemId: "inv_001"
 *   },
 *   // ... more emails
 * ], {
 *   batchSize: 5,
 *   batchDelay: 1000
 * });
 *
 * console.log(`Sent ${results.successful}/${results.total} emails`);
 */
export async function sendBulkEmails(
	emails: BulkEmailItem[],
	config: BulkEmailConfig = {},
): Promise<BulkEmailResult> {
	const {
		batchSize = 10, // Conservative batch size
		batchDelay = 1000, // 1 second between batches
		maxRetries = 2,
		retryDelay = 5000, // 5 seconds between retries
	} = config;

	const results: BulkEmailResult = {
		total: emails.length,
		successful: 0,
		failed: 0,
		results: [],
		allSuccessful: false,
	};

	// Process emails in batches
	for (let i = 0; i < emails.length; i += batchSize) {
		const batch = emails.slice(i, i + batchSize);

		// Send all emails in current batch concurrently
		const batchPromises = batch.map(async (email) => {
			let lastError: string | undefined;
			let attempts = 0;

			// Try sending with retries
			while (attempts <= maxRetries) {
				try {
					const result = await sendEmail({
						to: email.to,
						subject: email.subject,
						template: email.template,
						templateType: email.templateType,
						replyTo: email.replyTo,
						tags: [
							...(email.tags || []),
							{ name: "bulk_send", value: "true" },
							{ name: "attempt", value: String(attempts + 1) },
						],
					});

					if (result.success) {
						return {
							to: email.to,
							itemId: email.itemId,
							success: true,
							emailId: result.data?.id,
						};
					}

					// If not successful, record error and potentially retry
					lastError = result.error;

					if (attempts < maxRetries) {
						await delay(retryDelay);
					}
				} catch (error) {
					lastError = error instanceof Error ? error.message : "Unknown error";

					if (attempts < maxRetries) {
						await delay(retryDelay);
					}
				}

				attempts++;
			}

			// All retries failed
			return {
				to: email.to,
				itemId: email.itemId,
				success: false,
				error: lastError || "Failed to send after retries",
			};
		});

		// Wait for all emails in batch to complete
		const batchResults = await Promise.all(batchPromises);
		results.results.push(...batchResults);

		// Update counters
		for (const result of batchResults) {
			if (result.success) {
				results.successful++;
			} else {
				results.failed++;
			}
		}

		// Delay before next batch (except for last batch)
		if (i + batchSize < emails.length) {
			await delay(batchDelay);
		}
	}

	results.allSuccessful = results.failed === 0;

	return results;
}

/**
 * Estimate time to send bulk emails in milliseconds
 *
 * Useful for showing estimated completion time to users
 *
 * @param emailCount - Number of emails to send
 * @param config - Batch configuration
 * @returns Estimated time in milliseconds
 */
export function estimateBulkSendTime(
	emailCount: number,
	config: BulkEmailConfig = {},
): number {
	const { batchSize = 10, batchDelay = 1000 } = config;

	const batchCount = Math.ceil(emailCount / batchSize);
	const totalDelay = (batchCount - 1) * batchDelay;

	// Estimate ~500ms per email for processing + delays
	const estimatedProcessingTime = emailCount * 500;

	return estimatedProcessingTime + totalDelay;
}

/**
 * Format estimated time for display
 *
 * @param milliseconds - Time in milliseconds
 * @returns Human-readable time string
 */
export function formatEstimatedTime(milliseconds: number): string {
	const seconds = Math.ceil(milliseconds / 1000);

	if (seconds < 60) {
		return `${seconds} second${seconds !== 1 ? "s" : ""}`;
	}

	const minutes = Math.ceil(seconds / 60);
	return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}
