/**
 * EXAMPLE: Using Idempotency in Payment Endpoints
 *
 * This file demonstrates how to add idempotency to your API routes.
 * Copy and adapt these patterns to your actual endpoint files.
 */

import { withIdempotency } from "@/lib/api/idempotency";
import {
    addRateLimitHeaders,
    createRateLimitResponse,
} from "@/lib/api/rate-limit-headers";
import { apiRateLimiter } from "@/lib/security/rate-limit";
import { type NextRequest, NextResponse } from "next/server";

// EXAMPLE 1: Payment Processing with Idempotency
export async function POST_PAYMENT_EXAMPLE(request: NextRequest) {
	try {
		// Step 1: Rate limiting
		const ip = request.headers.get("x-forwarded-for") || "unknown";
		const rateLimitResult = await apiRateLimiter.limit(ip);

		if (!rateLimitResult.success) {
			return createRateLimitResponse(rateLimitResult);
		}

		// Step 2: Process request with idempotency protection
		const { response: result, wasIdempotent } = await withIdempotency(
			request,
			"payments", // Scope
			async () => {
				// Your actual payment processing logic here
				const payment = await processPayment({
					/* ... */
				});
				return {
					success: true,
					transactionId: payment.id,
					amount: payment.amount,
				};
			},
		);

		// Step 3: Add rate limit headers to response
		return addRateLimitHeaders(
			NextResponse.json({
				...result,
				idempotent: wasIdempotent, // Optional: let client know if this was cached
			}),
			rateLimitResult,
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// EXAMPLE 2: Email Sending with Idempotency
export async function POST_EMAIL_EXAMPLE(request: NextRequest) {
	const { response: result } = await withIdempotency(
		request,
		"emails", // Different scope for emails
		async () => {
			// Send email only once
			const email = await sendEmail({
				/* ... */
			});
			return { success: true, emailId: email.id };
		},
	);

	return NextResponse.json(result);
}

// EXAMPLE 3: Customer Creation with Idempotency
export async function POST_CUSTOMER_EXAMPLE(request: NextRequest) {
	const { response: result, wasIdempotent } = await withIdempotency(
		request,
		"customers",
		async () => {
			const customer = await createCustomer({
				/* ... */
			});
			return { success: true, customerId: customer.id };
		},
	);

	return NextResponse.json(result, {
		// Return 200 for idempotent requests, 201 for new creations
		status: wasIdempotent ? 200 : 201,
	});
}

// How to use in your code:
// ========================
// 1. Import the utilities at the top of your route file
// 2. Wrap your mutation logic in withIdempotency()
// 3. Add rate limiting at the start of the handler
// 4. Add rate limit headers to all responses

// API consumers use it like this:
// ================================
// POST /api/payments/process-offline
// Headers:
//   Idempotency-Key: unique-request-id-123
// Body:
//   { amount: 1000, ... }
//
// If the same request is sent again with the same Idempotency-Key,
// it will return the cached response without reprocessing.

async function processPayment(data: unknown): Promise<{ id: string; amount: number }> {
	// Mock implementation
	return { id: "payment_123", amount: 1000 };
}

async function sendEmail(data: unknown): Promise<{ id: string }> {
	// Mock implementation
	return { id: "email_12" };
}

async function createCustomer(data: unknown): Promise<{ id: string }> {
	// Mock implementation
	return { id: "customer_123" };
}
