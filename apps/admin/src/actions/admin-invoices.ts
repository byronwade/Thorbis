"use server";

/**
 * Admin Invoice Management Actions
 *
 * Server actions for managing invoices in view-as mode.
 */

import {
	executeAdminAction,
	getBeforeData,
	logDetailedAction,
	validateCompanyOwnership,
	type ActionResult,
} from "@/lib/admin-actions/framework";
import { getImpersonatedCompanyId } from "@/lib/admin-context";
import { revalidatePath } from "next/cache";

/**
 * Update Invoice Status
 *
 * Changes an invoice's status (draft, sent, paid, overdue, cancelled).
 */
export async function updateInvoiceStatus(
	invoiceId: string,
	newStatus: string,
	reason?: string,
): Promise<ActionResult<{ statusUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "update_invoice_status",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: reason || `Changed status to ${newStatus}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData("invoices", invoiceId, "id, status");

			// Update status
			const { error } = await supabase
				.from("invoices")
				.update({
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			if (error) {
				throw new Error(`Failed to update invoice status: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_invoice_status",
				"invoice",
				invoiceId,
				beforeData,
				{ status: newStatus },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/invoices`);

			return { statusUpdated: true };
		},
	);
}

/**
 * Void Invoice
 *
 * Voids an invoice (marks as cancelled and creates audit trail).
 */
export async function voidInvoice(
	invoiceId: string,
	reason: string,
): Promise<ActionResult<{ invoiceVoided: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "void_invoice",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: `Voided invoice: ${reason}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"invoices",
				invoiceId,
				"id, status, total_amount",
			);

			if (!beforeData) {
				throw new Error("Invoice not found");
			}

			// Check if invoice can be voided
			if (beforeData.status === "paid") {
				throw new Error(
					"Cannot void a paid invoice. Issue a refund instead.",
				);
			}

			// Void invoice
			const { error } = await supabase
				.from("invoices")
				.update({
					status: "cancelled",
					updated_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			if (error) {
				throw new Error(`Failed to void invoice: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"void_invoice",
				"invoice",
				invoiceId,
				beforeData,
				{ status: "cancelled", voided: true },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/invoices`);

			return { invoiceVoided: true };
		},
	);
}

/**
 * Update Invoice Due Date
 *
 * Changes the due date for an invoice.
 */
export async function updateInvoiceDueDate(
	invoiceId: string,
	newDueDate: string,
	reason?: string,
): Promise<ActionResult<{ dueDateUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "update_invoice_due_date",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: reason || `Changed due date to ${newDueDate}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"invoices",
				invoiceId,
				"id, due_date",
			);

			// Update due date
			const { error } = await supabase
				.from("invoices")
				.update({
					due_date: newDueDate,
					updated_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			if (error) {
				throw new Error(`Failed to update due date: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_invoice_due_date",
				"invoice",
				invoiceId,
				beforeData,
				{ due_date: newDueDate },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/invoices`);

			return { dueDateUpdated: true };
		},
	);
}

/**
 * Send Invoice Reminder
 *
 * Manually triggers sending an invoice reminder email using SendGrid.
 * Uses the company's configured email settings to send reminders.
 */
export async function sendInvoiceReminder(
	invoiceId: string,
	reason?: string,
): Promise<ActionResult<{ reminderSent: boolean; sentTo?: string; messageId?: string }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "send_invoice_reminder",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: reason || "Sent invoice reminder",
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get invoice with customer and company info
			const { data: invoice, error: fetchError } = await supabase
				.from("invoices")
				.select(
					`
					id,
					invoice_number,
					title,
					status,
					total_amount,
					due_date,
					line_items,
					reminder_count,
					customer:customers!invoices_customer_id_customers_id_fk (
						id,
						email,
						first_name,
						last_name,
						display_name
					),
					company:companies!invoices_company_id_companies_id_fk (
						id,
						name
					)
				`,
				)
				.eq("id", invoiceId)
				.single();

			if (fetchError || !invoice) {
				throw new Error("Invoice not found");
			}

			const customer = Array.isArray(invoice.customer)
				? invoice.customer[0]
				: invoice.customer;

			if (!customer?.email) {
				throw new Error("Customer has no email address");
			}

			const company = Array.isArray(invoice.company)
				? invoice.company[0]
				: invoice.company;

			// Format currency from cents
			const formatCurrency = (cents: number | null | undefined): string => {
				const amount = (cents || 0) / 100;
				return new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(amount);
			};

			// Format date
			const formatDate = (date: string | Date | null | undefined): string => {
				if (!date) return "N/A";
				return new Date(date).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});
			};

			// Build customer name
			const customerName =
				customer.display_name ||
				[customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
				"Valued Customer";

			const companyName = company?.name || "Your Service Provider";
			const invoiceNumber = invoice.invoice_number || `INV-${invoiceId.slice(0, 8)}`;
			const totalAmount = formatCurrency(invoice.total_amount);
			const dueDate = formatDate(invoice.due_date);

			// Calculate if overdue
			const now = new Date();
			const dueDateObj = invoice.due_date ? new Date(invoice.due_date) : null;
			const isOverdue = dueDateObj && dueDateObj < now;
			const daysOverdue = dueDateObj
				? Math.ceil((now.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24))
				: 0;

			// Build URLs
			const siteUrl = process.env.WEB_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://app.thorbis.com";
			const paymentUrl = `${siteUrl}/pay/${invoiceId}`;
			const downloadUrl = `${siteUrl}/api/invoices/${invoiceId}/pdf`;

			// Build reminder HTML email
			const overdueNotice = isOverdue
				? `<p style="color: #dc2626; font-weight: 600; margin: 16px 0;">
						This invoice is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} past due. Please make a payment as soon as possible.
					</p>`
				: '';

			const html = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
				</head>
				<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Payment Reminder</h1>

					<p>Hi ${customerName},</p>

					<p>This is a friendly reminder about your outstanding invoice from ${companyName}.</p>

					${overdueNotice}

					<div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin: 24px 0;">
						<table style="width: 100%; border-collapse: collapse;">
							<tr>
								<td style="padding: 8px 0; color: #666;">Invoice Number:</td>
								<td style="padding: 8px 0; text-align: right; font-weight: 600;">${invoiceNumber}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #666;">Amount Due:</td>
								<td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 20px; color: #1a1a1a;">${totalAmount}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #666;">Due Date:</td>
								<td style="padding: 8px 0; text-align: right; ${isOverdue ? 'color: #dc2626; font-weight: 600;' : ''}">${dueDate}</td>
							</tr>
						</table>
					</div>

					<div style="text-align: center; margin: 32px 0;">
						<a href="${paymentUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600;">Pay Now</a>
					</div>

					<p style="font-size: 14px; color: #666; margin-top: 24px;">
						<a href="${downloadUrl}" style="color: #2563eb;">Download PDF Invoice</a>
					</p>

					<p style="font-size: 14px; color: #666; margin-top: 32px;">
						If you have already made a payment, please disregard this reminder. If you have any questions about this invoice, please don't hesitate to contact us.
					</p>

					<p style="margin-top: 24px;">Thank you for your business!</p>
					<p style="color: #666;">${companyName}</p>
				</body>
				</html>
			`;

			// Plain text version
			const textContent = `
Payment Reminder

Hi ${customerName},

This is a friendly reminder about your outstanding invoice from ${companyName}.

${isOverdue ? `This invoice is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} past due. Please make a payment as soon as possible.` : ''}

Invoice Number: ${invoiceNumber}
Amount Due: ${totalAmount}
Due Date: ${dueDate}

Pay now: ${paymentUrl}

Download PDF: ${downloadUrl}

If you have already made a payment, please disregard this reminder. If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!
${companyName}
			`.trim();

			// Send email using SendGrid via the web database's email infrastructure
			// Import and use SendGrid directly since we're in the admin app
			const emailResult = await sendInvoiceReminderEmail({
				companyId,
				to: customer.email,
				customerName,
				invoiceNumber,
				totalAmount,
				dueDate,
				paymentUrl,
				html,
				text: textContent,
				isOverdue,
			});

			if (!emailResult.success) {
				throw new Error(emailResult.error || "Failed to send email");
			}

			// Update invoice reminder tracking
			await supabase
				.from("invoices")
				.update({
					reminder_count: (invoice.reminder_count || 0) + 1,
					last_reminder_sent_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			// Log action with email details
			await logDetailedAction(
				"send_invoice_reminder",
				"invoice",
				invoiceId,
				{ invoice_number: invoiceNumber, reminder_count: invoice.reminder_count || 0 },
				{
					reminder_sent: true,
					sent_to: customer.email,
					message_id: emailResult.messageId,
					is_overdue: isOverdue,
					days_overdue: isOverdue ? daysOverdue : 0,
				},
				reason,
			);

			return {
				reminderSent: true,
				sentTo: customer.email,
				messageId: emailResult.messageId,
			};
		},
	);
}

/**
 * Helper to send invoice reminder email via SendGrid
 */
async function sendInvoiceReminderEmail(params: {
	companyId: string;
	to: string;
	customerName: string;
	invoiceNumber: string;
	totalAmount: string;
	dueDate: string;
	paymentUrl: string;
	html: string;
	text: string;
	isOverdue: boolean;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
	const { companyId, to, invoiceNumber, html, text, isOverdue } = params;

	try {
		// Use the web database to get SendGrid settings for the company
		const { createWebClient } = await import("@/lib/supabase/web-client");
		const webDb = createWebClient();

		// Get company SendGrid settings
		const { data: settings, error: settingsError } = await webDb
			.from("company_twilio_settings")
			.select("sendgrid_api_key, sendgrid_from_email, sendgrid_from_name")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.single();

		if (settingsError || !settings?.sendgrid_api_key) {
			// Fallback: Check if there's a verified email domain
			const { data: domain } = await webDb
				.from("company_email_domains")
				.select("domain_name, subdomain")
				.eq("company_id", companyId)
				.eq("status", "verified")
				.eq("sending_enabled", true)
				.order("is_platform_subdomain", { ascending: true })
				.limit(1)
				.maybeSingle();

			if (!domain) {
				return {
					success: false,
					error: "Email service not configured for this company. Please configure SendGrid in Settings > Communications > Email Provider.",
				};
			}
		}

		// Get company name for From header
		const { data: company } = await webDb
			.from("companies")
			.select("name")
			.eq("id", companyId)
			.single();

		const companyName = company?.name || "Thorbis";

		// Build from email
		let fromEmail = settings?.sendgrid_from_email;
		if (!fromEmail) {
			const { data: domain } = await webDb
				.from("company_email_domains")
				.select("domain_name, subdomain")
				.eq("company_id", companyId)
				.eq("status", "verified")
				.eq("sending_enabled", true)
				.order("is_platform_subdomain", { ascending: true })
				.limit(1)
				.maybeSingle();

			if (domain) {
				fromEmail = `notifications@${domain.subdomain}.${domain.domain_name}`;
			}
		}
		fromEmail = fromEmail || "noreply@thorbis.com";

		const fromAddress = `${companyName} <${fromEmail}>`;
		const subject = isOverdue
			? `Payment Reminder: Invoice ${invoiceNumber} is past due`
			: `Payment Reminder: Invoice ${invoiceNumber}`;

		// Dynamically import SendGrid
		const { MailService } = await import("@sendgrid/mail");
		const client = new MailService();

		// Use company's SendGrid key or fall back to admin key
		const apiKey = settings?.sendgrid_api_key || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
		if (!apiKey) {
			return {
				success: false,
				error: "Email service not configured. Please add SendGrid API key.",
			};
		}

		client.setApiKey(apiKey);

		const [response] = await client.send({
			to,
			from: fromAddress,
			subject,
			html,
			text,
			customArgs: {
				invoice_reminder: "true",
				company_id: companyId,
			},
		});

		const messageId = response.headers["x-message-id"] as string | undefined;

		return {
			success: true,
			messageId: messageId || `sg-${Date.now()}`,
		};
	} catch (error: any) {
		console.error("[sendInvoiceReminderEmail] Error:", error);

		const errorMessage = error?.response?.body?.errors?.[0]?.message
			|| error?.message
			|| "Failed to send email";

		return {
			success: false,
			error: errorMessage,
		};
	}
}
