/**
 * Webhook Event Deduplication
 *
 * Prevents processing duplicate webhook events from providers like Stripe, SendGrid, etc.
 * Webhooks can be retried by the provider, so we need to track which events we've processed.
 *
 * Usage:
 * ```typescript
 * const isProcessed = await checkWebhookProcessed('stripe', event.id);
 * if (isProcessed) {
 *   return NextResponse.json({ received: true });
 * }
 *
 * // ... process webhook ...
 *
 * await markWebhookProcessed('stripe', event.id);
 * ```
 */

import { createClient } from "@/lib/supabase/server";

/**
 * Check if a webhook event has already been processed
 *
 * @param provider - Webhook provider (e.g., 'stripe', 'sendgrid', 'twilio')
 * @param eventId - Unique event ID from the provider
 * @returns true if already processed, false otherwise
 */
export async function checkWebhookProcessed(
	provider: string,
	eventId: string,
): Promise<boolean> {
	const supabase = await createClient();
	if (!supabase) {
		// If database is down, we should NOT process the webhook
		// Better to let the provider retry than to risk duplicates
		throw new Error("Database unavailable for webhook deduplication");
	}

	const { data, error } = await supabase
		.from("processed_webhooks")
		.select("id")
		.eq("provider", provider)
		.eq("event_id", eventId)
		.maybeSingle();

	if (error) {
		console.error("Error checking webhook deduplication:", error);
		// On error, assume not processed to avoid losing events
		// The insert will fail if it's a duplicate due to unique constraint
		return false;
	}

	return !!data;
}

/**
 * Mark a webhook event as processed
 *
 * @param provider - Webhook provider
 * @param eventId - Unique event ID
 * @param metadata - Optional metadata about the event
 */
export async function markWebhookProcessed(
	provider: string,
	eventId: string,
	metadata?: Record<string, unknown>,
): Promise<void> {
	const supabase = await createClient();
	if (!supabase) {
		console.error(
			"Database unavailable, cannot mark webhook as processed:",
			provider,
			eventId,
		);
		return;
	}

	const { error } = await supabase.from("processed_webhooks").insert({
		provider,
		event_id: eventId,
		processed_at: new Date().toISOString(),
		metadata,
	});

	if (error) {
		// If this is a unique constraint violation, that's actually fine
		// It means another request already processed this webhook
		if (error.code !== "23505") {
			// PostgreSQL unique violation code
			console.error("Error marking webhook as processed:", error);
		}
	}
}

/**
 * Process a webhook with automatic deduplication
 *
 * Wrapper that handles the deduplication check and marking for you
 *
 * @param provider - Webhook provider
 * @param eventId - Unique event ID
 * @param handler - Async function to process the webhook
 * @param metadata - Optional metadata to store
 * @returns Result of the handler, or null if already processed
 */
export async function withWebhookDeduplication<T>(
	provider: string,
	eventId: string,
	handler: () => Promise<T>,
	metadata?: Record<string, unknown>,
): Promise<T | null> {
	// Check if already processed
	const isProcessed = await checkWebhookProcessed(provider, eventId);
	if (isProcessed) {
		console.log(`Webhook ${provider}:${eventId} already processed, skipping`);
		return null;
	}

	// Process the webhook
	const result = await handler();

	// Mark as processed
	await markWebhookProcessed(provider, eventId, metadata);

	return result;
}

/**
 * Database Migration Required
 *
 * Run this migration to create the processed_webhooks table:
 *
 * ```sql
 * CREATE TABLE IF NOT EXISTS processed_webhooks (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   provider TEXT NOT NULL,
 *   event_id TEXT NOT NULL,
 *   processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   metadata JSONB,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *
 *   -- Ensure we never process the same event twice
 *   CONSTRAINT unique_webhook_event UNIQUE (provider, event_id)
 * );
 *
 * -- Index for fast lookups
 * CREATE INDEX IF NOT EXISTS idx_processed_webhooks_provider_event
 *   ON processed_webhooks(provider, event_id);
 *
 * -- Auto-cleanup old entries after 90 days (optional)
 * CREATE INDEX IF NOT EXISTS idx_processed_webhooks_processed_at
 *   ON processed_webhooks(processed_at);
 * ```
 *
 * Cleanup cron job (optional):
 * ```sql
 * DELETE FROM processed_webhooks
 * WHERE processed_at < NOW() - INTERVAL '90 days';
 * ```
 */
