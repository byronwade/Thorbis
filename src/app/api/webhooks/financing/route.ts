/**
 * Financing Webhooks API Route
 *
 * Handles webhooks from Affirm, Klarna, and WiseTack.
 * Updates offer status and creates payment records when funded.
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import {
	handleFinancingWebhook,
	type FinancingProvider,
} from "@/lib/payments/financing/financing-service";

// Provider webhook signatures
const WEBHOOK_SECRETS = {
	affirm: process.env.AFFIRM_WEBHOOK_SECRET,
	klarna: process.env.KLARNA_WEBHOOK_SECRET,
	wisetack: process.env.WISETACK_WEBHOOK_SECRET,
};

/**
 * Verify webhook signature
 */
function verifySignature(
	provider: FinancingProvider,
	payload: string,
	signature: string
): boolean {
	const secret = WEBHOOK_SECRETS[provider];
	if (!secret) return false;

	const expectedSignature = crypto
		.createHmac("sha256", secret)
		.update(payload)
		.digest("hex");

	return crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature)
	);
}

/**
 * Parse Affirm webhook event
 */
function parseAffirmEvent(body: Record<string, unknown>): {
	type: string;
	offerId: string;
	providerOfferId?: string;
	fundedAmount?: number;
	term?: number;
	apr?: number;
} {
	const eventType = body.event as string;
	const checkout = body.checkout as Record<string, unknown>;
	const loan = body.loan as Record<string, unknown>;

	let type = "unknown";
	switch (eventType) {
		case "checkout:completed":
			type = "application_started";
			break;
		case "loan:confirmed":
			type = "approved";
			break;
		case "loan:captured":
			type = "funded";
			break;
		case "loan:voided":
			type = "cancelled";
			break;
		case "refund:created":
			type = "refunded";
			break;
	}

	return {
		type,
		offerId: checkout?.merchant_external_reference as string || "",
		providerOfferId: loan?.id as string,
		fundedAmount: loan?.amount as number,
		term: loan?.term_months as number,
		apr: loan?.apr as number,
	};
}

/**
 * Parse Klarna webhook event
 */
function parseKlarnaEvent(body: Record<string, unknown>): {
	type: string;
	offerId: string;
	providerOfferId?: string;
	fundedAmount?: number;
	term?: number;
	apr?: number;
} {
	const eventType = body.event_type as string;
	const orderData = body.order as Record<string, unknown>;

	let type = "unknown";
	switch (eventType) {
		case "ORDER_AUTHORIZED":
			type = "approved";
			break;
		case "ORDER_CAPTURED":
			type = "funded";
			break;
		case "ORDER_CANCELLED":
			type = "cancelled";
			break;
		case "REFUND_INITIATED":
			type = "refunded";
			break;
	}

	return {
		type,
		offerId: orderData?.merchant_reference1 as string || "",
		providerOfferId: orderData?.order_id as string,
		fundedAmount: orderData?.captured_amount as number,
	};
}

/**
 * Parse WiseTack webhook event
 */
function parseWiseTackEvent(body: Record<string, unknown>): {
	type: string;
	offerId: string;
	providerOfferId?: string;
	fundedAmount?: number;
	term?: number;
	apr?: number;
} {
	const eventType = body.event as string;
	const transaction = body.transaction as Record<string, unknown>;

	let type = "unknown";
	switch (eventType) {
		case "application.started":
			type = "application_started";
			break;
		case "application.approved":
			type = "approved";
			break;
		case "application.declined":
			type = "declined";
			break;
		case "loan.funded":
			type = "funded";
			break;
		case "loan.cancelled":
			type = "cancelled";
			break;
	}

	return {
		type,
		offerId: transaction?.external_id as string || "",
		providerOfferId: transaction?.id as string,
		fundedAmount: transaction?.funded_amount as number,
		term: transaction?.term_months as number,
		apr: transaction?.apr as number,
	};
}

export async function POST(request: NextRequest) {
	try {
		const headersList = await headers();
		const rawBody = await request.text();
		const body = JSON.parse(rawBody);

		// Determine provider from headers or body
		let provider: FinancingProvider | null = null;
		let signature: string | null = null;

		// Check for Affirm
		if (headersList.get("x-affirm-signature")) {
			provider = "affirm";
			signature = headersList.get("x-affirm-signature");
		}
		// Check for Klarna
		else if (headersList.get("klarna-idempotency-key")) {
			provider = "klarna";
			signature = headersList.get("klarna-signature");
		}
		// Check for WiseTack
		else if (headersList.get("x-wisetack-signature")) {
			provider = "wisetack";
			signature = headersList.get("x-wisetack-signature");
		}

		if (!provider) {
			return NextResponse.json(
				{ error: "Unknown webhook provider" },
				{ status: 400 }
			);
		}

		// Verify signature in production
		if (process.env.NODE_ENV === "production" && signature) {
			if (!verifySignature(provider, rawBody, signature)) {
				console.error(`[Financing] Invalid ${provider} webhook signature`);
				return NextResponse.json(
					{ error: "Invalid signature" },
					{ status: 401 }
				);
			}
		}

		// Parse event based on provider
		let event: ReturnType<typeof parseAffirmEvent>;

		switch (provider) {
			case "affirm":
				event = parseAffirmEvent(body);
				break;
			case "klarna":
				event = parseKlarnaEvent(body);
				break;
			case "wisetack":
				event = parseWiseTackEvent(body);
				break;
		}

		console.log(`[Financing] Received ${provider} webhook:`, event.type, event.offerId);

		// Handle the webhook
		const result = await handleFinancingWebhook(provider, event);

		if (!result.success) {
			console.error(`[Financing] Webhook handling failed:`, result.error);
			return NextResponse.json(
				{ error: result.error },
				{ status: 500 }
			);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("[Financing] Webhook error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}
