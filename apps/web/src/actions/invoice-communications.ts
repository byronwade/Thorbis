"use server";

/**
 * Invoice Communications Server Actions
 *
 * Handles sending invoices and estimates via email:
 * - Send invoice to customer with PDF attachment
 * - Send estimate to customer with PDF attachment
 * - Track sent status and communication history
 */

import { revalidatePath } from "next/cache";
import InvoiceSentEmail from "@/emails/templates/billing/invoice-sent";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { createClient } from "@/lib/supabase/server";

/**
 * Format currency amount from cents to display string
 */
function formatCurrency(cents: number | null | undefined): string {
	const amount = (cents || 0) / 100;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

/**
 * Format date for display
 */
function formatDate(date: string | Date | null | undefined): string {
	if (!date) return "N/A";
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Parse line items from JSON to array format for email template
 */
function parseLineItems(
	lineItems: unknown,
): Array<{ description: string; quantity: number; amount: string }> {
	if (!lineItems) return [];

	try {
		const items = Array.isArray(lineItems) ? lineItems : [];
		return items.map((item: any) => ({
			description: item.description || item.name || "Item",
			quantity: item.quantity || 1,
			amount: formatCurrency(item.total || item.amount || item.unit_price || 0),
		}));
	} catch {
		return [];
	}
}

/**
 * Send invoice via email
 */
export async function sendInvoiceEmail(invoiceId: string) {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get invoice with customer and company details
		const { data: invoice, error } = await supabase
			.from("invoices")
			.select(
				`
				*,
				customer:customers!customer_id(
					id,
					first_name,
					last_name,
					email
				),
				company:companies!company_id(
					id,
					name
				)
			`,
			)
			.eq("id", invoiceId)
			.single();

		if (error || !invoice) {
			return { success: false, error: "Invoice not found" };
		}

		if (!invoice.customer?.email) {
			return { success: false, error: "Customer has no email address" };
		}

		// Build customer name
		const customerName =
			[invoice.customer.first_name, invoice.customer.last_name]
				.filter(Boolean)
				.join(" ") || "Valued Customer";

		// Build URLs
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const paymentUrl = `${siteUrl}/pay/${invoiceId}`;
		const downloadUrl = `${siteUrl}/api/invoices/${invoiceId}/pdf`;

		// Parse line items
		const items = parseLineItems(invoice.line_items);

		// Create email template
		const emailTemplate = InvoiceSentEmail({
			customerName,
			invoiceNumber: invoice.invoice_number || `INV-${invoiceId.slice(0, 8)}`,
			totalAmount: formatCurrency(invoice.total_amount),
			dueDate: formatDate(invoice.due_date),
			items:
				items.length > 0
					? items
					: [
							{
								description: invoice.title || "Services Rendered",
								quantity: 1,
								amount: formatCurrency(invoice.total_amount),
							},
						],
			paymentUrl,
			downloadUrl,
			previewText: `Invoice ${invoice.invoice_number || invoiceId.slice(0, 8)} for ${formatCurrency(invoice.total_amount)}`,
		});

		// Send the email
		const emailResult = await sendEmail({
			to: invoice.customer.email,
			subject: `Invoice ${invoice.invoice_number || `#${invoiceId.slice(0, 8)}`} from ${invoice.company?.name || "Your Service Provider"}`,
			template: emailTemplate,
			templateType: EmailTemplate.INVOICE_SENT,
			companyId: invoice.company_id,
			tags: [
				{ name: "invoice_id", value: invoiceId },
				{ name: "customer_id", value: invoice.customer_id },
			],
		});

		if (!emailResult.success) {
			return {
				success: false,
				error: emailResult.error || "Failed to send email",
			};
		}

		// Update sent_at timestamp and increment reminder count
		await supabase
			.from("invoices")
			.update({
				sent_at: new Date().toISOString(),
				reminder_count: (invoice.reminder_count || 0) + 1,
				last_reminder_sent_at: new Date().toISOString(),
			})
			.eq("id", invoiceId);

		revalidatePath(`/dashboard/customers/${invoice.customer_id}`);
		revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
		revalidatePath(`/dashboard/work/invoices`);

		return {
			success: true,
			message: `Invoice sent to ${invoice.customer.email}`,
			data: { emailId: emailResult.data?.id },
		};
	} catch (error) {
		console.error("[sendInvoiceEmail] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send invoice",
		};
	}
}

/**
 * Parse line items for estimate template (slightly different format)
 */
function parseEstimateLineItems(
	lineItems: unknown,
): Array<{ description: string; amount: string }> {
	if (!lineItems) return [];

	try {
		const items = Array.isArray(lineItems) ? lineItems : [];
		return items.map((item: any) => ({
			description: item.description || item.name || "Service",
			amount: formatCurrency(item.total || item.amount || item.unit_price || 0),
		}));
	} catch {
		return [];
	}
}

/**
 * Send estimate via email
 */
export async function sendEstimateEmail(estimateId: string) {
	// Dynamic import to avoid loading the template until needed
	const EstimateSentEmail = (
		await import("@/emails/templates/billing/estimate-sent")
	).default;

	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get estimate with customer and company details
		const { data: estimate, error } = await supabase
			.from("estimates")
			.select(
				`
				*,
				customer:customers!customer_id(
					id,
					first_name,
					last_name,
					email
				),
				company:companies!company_id(
					id,
					name
				)
			`,
			)
			.eq("id", estimateId)
			.single();

		if (error || !estimate) {
			return { success: false, error: "Estimate not found" };
		}

		if (!estimate.customer?.email) {
			return { success: false, error: "Customer has no email address" };
		}

		// Build customer name
		const customerName =
			[estimate.customer.first_name, estimate.customer.last_name]
				.filter(Boolean)
				.join(" ") || "Valued Customer";

		// Build URLs
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const viewUrl = `${siteUrl}/dashboard/work/estimates/${estimateId}`;
		const acceptUrl = `${siteUrl}/estimates/${estimateId}/accept`;

		// Parse line items
		const items = parseEstimateLineItems(estimate.line_items);

		// Create email template
		const emailTemplate = EstimateSentEmail({
			customerName,
			estimateNumber:
				estimate.estimate_number || `EST-${estimateId.slice(0, 8)}`,
			totalAmount: formatCurrency(estimate.total_amount),
			validUntil: formatDate(estimate.valid_until || estimate.expires_at),
			items:
				items.length > 0
					? items
					: [
							{
								description: estimate.title || "Proposed Services",
								amount: formatCurrency(estimate.total_amount),
							},
						],
			acceptUrl,
			viewUrl,
			previewText: `Estimate ${estimate.estimate_number || estimateId.slice(0, 8)} for ${formatCurrency(estimate.total_amount)}`,
		});

		// Send the email
		const emailResult = await sendEmail({
			to: estimate.customer.email,
			subject: `Estimate ${estimate.estimate_number || `#${estimateId.slice(0, 8)}`} from ${estimate.company?.name || "Your Service Provider"}`,
			template: emailTemplate,
			templateType: EmailTemplate.ESTIMATE_SENT,
			companyId: estimate.company_id,
			tags: [
				{ name: "estimate_id", value: estimateId },
				{ name: "customer_id", value: estimate.customer_id },
			],
		});

		if (!emailResult.success) {
			return {
				success: false,
				error: emailResult.error || "Failed to send email",
			};
		}

		// Update sent_at timestamp
		await supabase
			.from("estimates")
			.update({ sent_at: new Date().toISOString() })
			.eq("id", estimateId);

		revalidatePath(`/dashboard/customers/${estimate.customer_id}`);
		revalidatePath(`/dashboard/work/estimates/${estimateId}`);
		revalidatePath(`/dashboard/work/estimates`);

		return {
			success: true,
			message: `Estimate sent to ${estimate.customer.email}`,
			data: { emailId: emailResult.data?.id },
		};
	} catch (error) {
		console.error("[sendEstimateEmail] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send estimate",
		};
	}
}
