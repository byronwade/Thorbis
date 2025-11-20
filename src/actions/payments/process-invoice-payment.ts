/**
 * Process Invoice Payment Server Action
 *
 * Handles payment processing for invoices through the payment portal
 *
 * Features:
 * - Token validation
 * - Payment processing via company's processor
 * - Invoice status update
 * - Payment confirmation email
 * - Transaction logging
 */

"use server";

import { revalidatePath } from "next/cache";
import { sendCompanyBrandedEmail } from "@/lib/email/email-router";
import { EmailTemplate } from "@/lib/email/email-types";
import {
	markTokenAsUsed,
	validatePaymentToken,
} from "@/lib/payments/payment-tokens";
import { createClient } from "@/lib/supabase/server";

type PaymentResult = {
	success: boolean;
	error?: string;
	transactionId?: string;
};

type ProcessPaymentParams = {
	invoiceId: string;
	token: string;
	paymentMethod: "card" | "ach";
	amount: number;
	paymentDetails: {
		cardNumber?: string;
		cardExpiry?: string;
		cardCvc?: string;
		cardName?: string;
		accountNumber?: string;
		routingNumber?: string;
		accountName?: string;
	};
};

export async function processInvoicePayment(
	params: ProcessPaymentParams,
): Promise<PaymentResult> {
	try {
		const {
			invoiceId,
			token,
			paymentMethod,
			amount,
			paymentDetails: _paymentDetails,
		} = params;

		// Validate token
		const validation = await validatePaymentToken(token);

		if (!validation.isValid || validation.invoiceId !== invoiceId) {
			return {
				success: false,
				error: validation.message || "Invalid payment token",
			};
		}

		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Unable to connect to database",
			};
		}

		// Fetch invoice with customer and company details
		const { data: invoice, error: invoiceError } = await supabase
			.from("invoices")
			.select(
				`
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          display_name,
          email
        ),
        company:companies!company_id(
          id,
          name,
          email
        )
      `,
			)
			.eq("id", invoiceId)
			.single();

		if (invoiceError || !invoice) {
			return {
				success: false,
				error: "Invoice not found",
			};
		}

		// Check if invoice is already paid
		if (invoice.status === "paid") {
			return {
				success: false,
				error: "Invoice has already been paid",
			};
		}

		// Verify amount matches
		if (amount !== invoice.total_amount) {
			return {
				success: false,
				error: "Payment amount does not match invoice total",
			};
		}

		// TODO: Integrate with actual payment processor (Adyen/Plaid)
		// For now, we'll simulate a successful payment in development
		const isDevelopment = process.env.NODE_ENV === "development";

		let transactionId: string;
		let processorResponse: any;

		if (isDevelopment) {
			// Development mode - simulate payment
			transactionId = `dev_txn_${Date.now()}`;
			processorResponse = {
				status: "success",
				message: "Development mode - payment simulated",
			};
		} else {
			// Production mode - process real payment
			// TODO: Implement actual payment processor integration
			// This would call Adyen/Plaid APIs based on paymentMethod
			return {
				success: false,
				error:
					"Payment processing is not yet fully implemented. Please contact support.",
			};
		}

		// Update invoice status to paid
		const { error: updateError } = await supabase
			.from("invoices")
			.update({
				status: "paid",
				paid_at: new Date().toISOString(),
				payment_method: paymentMethod,
				updated_at: new Date().toISOString(),
			})
			.eq("id", invoiceId);

		if (updateError) {
			return {
				success: false,
				error:
					"Payment processed but failed to update invoice. Please contact support.",
			};
		}

		// Log payment transaction
		await supabase.from("payment_processor_transactions").insert({
			company_id: invoice.company_id,
			invoice_id: invoiceId,
			processor_type: paymentMethod === "card" ? "adyen" : "plaid",
			transaction_id: transactionId,
			amount,
			currency: "USD",
			status: "success",
			channel: "online",
			metadata: {
				payment_method: paymentMethod,
				processor_response: processorResponse,
			},
		});

		// Mark token as used
		await markTokenAsUsed(token);

		// Send payment confirmation email to customer
		const customer = Array.isArray(invoice.customer)
			? invoice.customer[0]
			: invoice.customer;
		const company = Array.isArray(invoice.company)
			? invoice.company[0]
			: invoice.company;

		if (customer?.email && company) {
			try {
				// Import the payment received template
				const PaymentReceivedEmail = (
					await import("../../../emails/templates/billing/payment-received")
				).default;

				// Format payment details
				const customerName =
					customer.display_name ||
					`${customer.first_name} ${customer.last_name}`.trim() ||
					"Customer";
				const paymentAmountFormatted = `$${(amount / 100).toFixed(2)}`;
				const paymentMethodFormatted =
					paymentMethod === "card" ? "Credit Card" : "ACH Bank Transfer";
				const paymentDateFormatted = new Date().toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});

				await sendCompanyBrandedEmail({
					companyId: company.id,
					companyName: company.name,
					to: customer.email,
					subject: `Payment Received - Invoice ${invoice.invoice_number}`,
					template: PaymentReceivedEmail({
						customerName,
						invoiceNumber: invoice.invoice_number,
						paymentAmount: paymentAmountFormatted,
						paymentMethod: paymentMethodFormatted,
						paymentDate: paymentDateFormatted,
						receiptUrl: `${process.env.NEXT_PUBLIC_APP_URL}/portal/invoices/${invoiceId}/receipt?token=${token}`,
						company: {
							companyName: company.name,
							supportEmail: company.email,
						},
					}),
					templateType: EmailTemplate.PAYMENT_RECEIVED,
					emailType: "notification",
					tags: [
						{ name: "invoice_id", value: invoiceId },
						{ name: "transaction_id", value: transactionId },
					],
				});
			} catch (_emailError) {
				// Don't fail the payment if email fails
				console.error(
					"Failed to send payment confirmation email:",
					_emailError,
				);
			}
		}

		// Revalidate invoice pages
		revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
		revalidatePath("/dashboard/work/invoices");

		return {
			success: true,
			transactionId,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Payment processing failed",
		};
	}
}
