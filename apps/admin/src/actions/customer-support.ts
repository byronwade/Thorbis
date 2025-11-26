/**
 * Customer Support Actions
 *
 * Example Server Actions showing how to use both admin and web databases together
 * for common support/troubleshooting tasks.
 */

"use server";

import { createAdminClient } from "@/lib/supabase/admin-client";
import { createWebClient } from "@/lib/supabase/web-client";
import { logAdminAction, ADMIN_ACTIONS } from "@/lib/admin/audit";
import { getAdminSession } from "@/lib/auth/session";

/**
 * View customer details from web database and log to admin database
 */
export async function viewCustomerDetails(customerId: string) {
	// 1. Verify admin is logged in
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	// 2. Get customer data from web database
	const webDb = createWebClient();
	const { data: customer, error: fetchError } = await webDb.from("customers").select("*").eq("id", customerId).single();

	if (fetchError || !customer) {
		return { error: "Customer not found" };
	}

	// 3. Log to admin database
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: ADMIN_ACTIONS.CUSTOMER_VIEWED,
		resourceType: "customer",
		resourceId: customerId,
		details: {
			customer_email: customer.email,
			company_id: customer.company_id,
		},
	});

	return { data: customer };
}

/**
 * Process a refund and create support ticket
 */
export async function processRefundWithTicket(
	paymentId: string,
	refundAmount: number,
	reason: string,
	createTicket: boolean = true
) {
	// 1. Verify admin session
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();
	const adminDb = createAdminClient();

	// 2. Get payment from web database
	const { data: payment, error: fetchError } = await webDb.from("payments").select("*, customer:customers(*)").eq("id", paymentId).single();

	if (fetchError || !payment) {
		return { error: "Payment not found" };
	}

	// 3. Validate refund
	if (refundAmount > payment.amount) {
		return { error: "Refund amount exceeds payment amount" };
	}

	// 4. Process refund in web database
	const { error: refundError } = await webDb
		.from("payments")
		.update({
			status: "refunded",
			refund_amount: refundAmount,
			refund_reason: reason,
			refunded_at: new Date().toISOString(),
			refunded_by: session.userId,
		})
		.eq("id", paymentId);

	if (refundError) {
		return { error: refundError.message };
	}

	// 5. Create support ticket in admin database (optional)
	let ticketId = null;
	if (createTicket && payment.customer) {
		const { data: ticket } = await adminDb
			.from("support_tickets")
			.insert({
				company_id: payment.company_id,
				requester_email: payment.customer.email,
				requester_name: `${payment.customer.first_name} ${payment.customer.last_name}`,
				subject: `Refund processed - Payment ${paymentId}`,
				description: `Refund of $${refundAmount} processed. Reason: ${reason}`,
				status: "resolved",
				priority: "normal",
				category: "billing",
			})
			.select()
			.single();

		ticketId = ticket?.id;
	}

	// 6. Log to audit trail in admin database
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: ADMIN_ACTIONS.PAYMENT_REFUNDED,
		resourceType: "payment",
		resourceId: paymentId,
		details: {
			original_amount: payment.amount,
			refund_amount: refundAmount,
			reason,
			customer_id: payment.customer_id,
			ticket_id: ticketId,
		},
	});

	return {
		success: true,
		ticketId,
	};
}

/**
 * Search for customer and get their support ticket history
 */
export async function searchCustomerWithTickets(email: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();
	const adminDb = createAdminClient();

	// 1. Search customer in web database
	const { data: customers } = await webDb.from("customers").select("*").ilike("email", `%${email}%`).limit(10);

	if (!customers || customers.length === 0) {
		return { error: "No customers found" };
	}

	// 2. Get support tickets from admin database
	const { data: tickets } = await adminDb.from("support_tickets").select("*").ilike("requester_email", `%${email}%`).order("created_at", { ascending: false }).limit(20);

	return {
		data: {
			customers,
			tickets: tickets || [],
		},
	};
}

/**
 * Update company status and notify via email campaign
 */
export async function updateCompanyStatusWithNotification(companyId: string, status: "active" | "suspended", reason: string, sendEmail: boolean = true) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();
	const adminDb = createAdminClient();

	// 1. Update company status in web database
	const { data: company, error: updateError } = await webDb
		.from("companies")
		.update({
			status,
			status_reason: reason,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId)
		.select()
		.single();

	if (updateError) {
		return { error: updateError.message };
	}

	// 2. Create email campaign in admin database (optional)
	let campaignId = null;
	if (sendEmail && company) {
		const subject = status === "suspended" ? `Account Suspended - ${company.name}` : `Account Reactivated - ${company.name}`;

		const { data: campaign } = await adminDb
			.from("email_campaigns")
			.insert({
				name: `Company Status Update - ${company.name}`,
				subject,
				from_name: "Thorbis Support",
				from_email: "support@thorbis.com",
				html_content: `<p>Your account status has been updated to: ${status}</p><p>Reason: ${reason}</p>`,
				status: "draft",
				campaign_type: "announcement",
				created_by: session.userId,
			})
			.select()
			.single();

		campaignId = campaign?.id;
	}

	// 3. Log to audit trail
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: status === "suspended" ? ADMIN_ACTIONS.COMPANY_SUSPENDED : ADMIN_ACTIONS.COMPANY_REACTIVATED,
		resourceType: "company",
		resourceId: companyId,
		details: {
			new_status: status,
			reason,
			campaign_id: campaignId,
		},
	});

	return {
		success: true,
		company,
		campaignId,
	};
}
