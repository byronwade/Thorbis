/**
 * Process Offline Payment API Route
 *
 * Receives queued offline payments and processes them through
 * the appropriate payment processor (Adyen, Plaid, ProfitStars).
 */

import { type NextRequest, NextResponse } from "next/server";
import { getPaymentProcessor } from "@/lib/payments/processor";
import type { PaymentChannel } from "@/lib/payments/processor-types";
import { createClient } from "@/lib/supabase/server";

interface OfflinePaymentRequest {
	clientId: string;
	companyId: string;
	customerId?: string;
	invoiceId?: string;
	jobId?: string;
	amount: number;
	currency: string;
	paymentMethod: "card" | "ach" | "check" | "cash" | "financing";
	paymentData: Record<string, unknown>;
	collectedAt: string;
	collectedBy?: string;
	deviceId?: string;
	notes?: string;
	metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ success: false, error: "Database unavailable" },
				{ status: 503 },
			);
		}

		// Verify authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body: OfflinePaymentRequest = await request.json();

		// Validate required fields
		if (!body.clientId || !body.companyId || !body.amount) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Verify user has access to this company
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", body.companyId)
			.eq("status", "active")
			.single();

		if (!membership) {
			return NextResponse.json(
				{ success: false, error: "Access denied to this company" },
				{ status: 403 },
			);
		}

		// Check for duplicate (idempotency via clientId)
		const { data: existingQueueEntry } = await supabase
			.from("payment_offline_queue")
			.select("id, sync_status, payment_id, processor_transaction_id")
			.eq("company_id", body.companyId)
			.eq("client_id", body.clientId)
			.single();

		if (existingQueueEntry) {
			// Already processed - return existing result
			if (existingQueueEntry.sync_status === "succeeded") {
				return NextResponse.json({
					success: true,
					transactionId: existingQueueEntry.processor_transaction_id,
					paymentId: existingQueueEntry.payment_id,
					deduplicated: true,
				});
			}
			// Still processing or failed - let it retry
		}

		// Map payment method to channel
		const channelMap: Record<string, PaymentChannel> = {
			card: "online",
			ach: "ach",
			check: "check",
			cash: "online", // Cash is recorded, not processed
			financing: "online",
		};
		const channel = channelMap[body.paymentMethod] || "online";

		// Handle cash payments (record only, no processing)
		if (body.paymentMethod === "cash") {
			// Create payment record directly
			const { data: payment, error: paymentError } = await supabase
				.from("payments")
				.insert({
					company_id: body.companyId,
					customer_id: body.customerId,
					invoice_id: body.invoiceId,
					job_id: body.jobId,
					amount: body.amount,
					payment_method: "cash",
					status: "completed",
					notes: body.notes,
					metadata: {
						...body.metadata,
						offline_client_id: body.clientId,
						collected_at: body.collectedAt,
						collected_by: body.collectedBy,
						device_id: body.deviceId,
					},
				})
				.select("id")
				.single();

			if (paymentError) {
				return NextResponse.json(
					{ success: false, error: paymentError.message },
					{ status: 500 },
				);
			}

			// Update offline queue
			await supabase.from("payment_offline_queue").upsert({
				company_id: body.companyId,
				client_id: body.clientId,
				customer_id: body.customerId,
				invoice_id: body.invoiceId,
				job_id: body.jobId,
				amount: body.amount,
				currency: body.currency,
				payment_method: body.paymentMethod,
				payment_data: body.paymentData,
				sync_status: "succeeded",
				payment_id: payment.id,
				processed_at: new Date().toISOString(),
				collected_at: body.collectedAt,
				collected_by: body.collectedBy,
				device_id: body.deviceId,
			});

			return NextResponse.json({
				success: true,
				transactionId: `cash-${payment.id}`,
				paymentId: payment.id,
			});
		}

		// Get the appropriate payment processor
		const processor = await getPaymentProcessor(body.companyId, {
			amount: body.amount,
			channel,
		});

		if (!processor) {
			return NextResponse.json(
				{
					success: false,
					error: "No payment processor configured for this company",
				},
				{ status: 400 },
			);
		}

		// Process the payment
		const result = await processor.processPayment({
			amount: body.amount,
			currency: body.currency,
			customerId: body.customerId || "",
			invoiceId: body.invoiceId,
			paymentMethodId: body.paymentData.paymentMethodId as string | undefined,
			channel,
			metadata: {
				...body.metadata,
				offline_client_id: body.clientId,
				collected_at: body.collectedAt,
				device_id: body.deviceId,
			},
			description: body.notes,
		});

		if (result.success && result.transactionId) {
			// Create payment record
			const { data: payment } = await supabase
				.from("payments")
				.insert({
					company_id: body.companyId,
					customer_id: body.customerId,
					invoice_id: body.invoiceId,
					job_id: body.jobId,
					amount: body.amount,
					payment_method: body.paymentMethod,
					status: result.status === "succeeded" ? "completed" : "pending",
					processor_id: result.transactionId,
					processor_transaction_id: result.processorTransactionId,
					notes: body.notes,
					metadata: {
						...body.metadata,
						offline_client_id: body.clientId,
						processor_response: result.processorMetadata,
					},
				})
				.select("id")
				.single();

			// Update offline queue
			await supabase.from("payment_offline_queue").upsert({
				company_id: body.companyId,
				client_id: body.clientId,
				customer_id: body.customerId,
				invoice_id: body.invoiceId,
				job_id: body.jobId,
				amount: body.amount,
				currency: body.currency,
				payment_method: body.paymentMethod,
				payment_data: body.paymentData,
				sync_status: "succeeded",
				processor_type: "adyen", // Or determine from processor
				processor_transaction_id: result.transactionId,
				payment_id: payment?.id,
				processed_at: new Date().toISOString(),
				collected_at: body.collectedAt,
				collected_by: body.collectedBy,
				device_id: body.deviceId,
			});

			return NextResponse.json({
				success: true,
				transactionId: result.transactionId,
				paymentId: payment?.id,
			});
		}

		// Payment failed
		await supabase.from("payment_offline_queue").upsert({
			company_id: body.companyId,
			client_id: body.clientId,
			customer_id: body.customerId,
			invoice_id: body.invoiceId,
			amount: body.amount,
			currency: body.currency,
			payment_method: body.paymentMethod,
			payment_data: body.paymentData,
			sync_status: "failed",
			last_error: result.error,
			last_error_code: result.failureCode,
			collected_at: body.collectedAt,
			collected_by: body.collectedBy,
		});

		return NextResponse.json(
			{
				success: false,
				error: result.error || "Payment processing failed",
				failureCode: result.failureCode,
			},
			{ status: 400 },
		);
	} catch (error) {
		console.error("[ProcessOfflinePayment] Error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 },
		);
	}
}
