// @ts-nocheck
/**
 * Invoice Email Template Settings Actions
 *
 * Server actions for managing invoice email templates
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type InvoiceEmailTemplate = {
	subject: string;
	body: string;
	footer: string;
};

type ActionResult<T> = {
	success: boolean;
	data?: T;
	error?: string;
};

/**
 * Load the invoice email template for the current company
 */
export async function loadInvoiceEmailTemplate(): Promise<ActionResult<InvoiceEmailTemplate>> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Unable to connect to database",
			};
		}

		// Get authenticated user
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return {
				success: false,
				error: "Not authenticated",
			};
		}

		// Get company ID
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.limit(1)
			.single();

		if (!teamMember) {
			return {
				success: false,
				error: "No active company membership found",
			};
		}

		// Load template from communication_templates table
		const { data: template } = await supabase
			.from("communication_templates")
			.select("subject, body, metadata")
			.eq("company_id", teamMember.company_id)
			.eq("type", "email")
			.eq("category", "invoice")
			.eq("is_active", true)
			.maybeSingle();

		if (template) {
			return {
				success: true,
				data: {
					subject: template.subject || "",
					body: template.body || "",
					footer: template.metadata?.footer || "",
				},
			};
		}

		// Return default template if none exists
		return {
			success: true,
			data: {
				subject: "Invoice {{invoice_number}} from {{company_name}}",
				body: `Hi {{customer_name}},

Please find attached your invoice {{invoice_number}} for {{invoice_amount}}.

Payment is due by {{due_date}}.

You can securely pay your invoice online by clicking the link below:
{{payment_link}}

If you have any questions about this invoice, please contact us at {{company_email}} or {{company_phone}}.

Thank you for your business!

Best regards,
{{company_name}}`,
				footer: "This is an automated message. Please do not reply to this email.",
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to load template",
		};
	}
}

/**
 * Save the invoice email template for the current company
 */
export async function saveInvoiceEmailTemplate(template: InvoiceEmailTemplate): Promise<ActionResult<void>> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Unable to connect to database",
			};
		}

		// Get authenticated user
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return {
				success: false,
				error: "Not authenticated",
			};
		}

		// Get company ID
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.limit(1)
			.single();

		if (!teamMember) {
			return {
				success: false,
				error: "No active company membership found",
			};
		}

		// Check if template already exists
		const { data: existing } = await supabase
			.from("communication_templates")
			.select("id")
			.eq("company_id", teamMember.company_id)
			.eq("type", "email")
			.eq("category", "invoice")
			.maybeSingle();

		const templateData = {
			company_id: teamMember.company_id,
			name: "Invoice Email",
			type: "email",
			category: "invoice",
			subject: template.subject,
			body: template.body,
			metadata: {
				footer: template.footer,
			},
			is_active: true,
			is_default: true,
		};

		if (existing) {
			// Update existing template
			const { error } = await supabase
				.from("communication_templates")
				.update({
					subject: template.subject,
					body: template.body,
					metadata: {
						footer: template.footer,
					},
					updated_at: new Date().toISOString(),
				})
				.eq("id", existing.id);

			if (error) {
				return {
					success: false,
					error: "Failed to update template",
				};
			}
		} else {
			// Insert new template
			const { error } = await supabase.from("communication_templates").insert(templateData);

			if (error) {
				return {
					success: false,
					error: "Failed to save template",
				};
			}
		}

		// Revalidate settings page
		revalidatePath("/dashboard/settings/communications/invoice-email-template");

		return {
			success: true,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save template",
		};
	}
}
