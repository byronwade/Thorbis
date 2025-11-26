/**
 * Admin Troubleshooting Utilities
 *
 * Helper functions for common admin troubleshooting tasks on the web database.
 * All functions use the web database client with service role access.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { logAdminAction, ADMIN_ACTIONS } from "./audit";

/**
 * Get complete customer information including all related data
 */
export async function getCustomerFullProfile(customerId: string, adminUserId: string, adminEmail: string) {
	const supabase = createWebClient();

	// Get customer data
	const { data: customer, error: customerError } = await supabase.from("customers").select("*").eq("id", customerId).single();

	if (customerError) {
		throw new Error(`Failed to fetch customer: ${customerError.message}`);
	}

	// Get related data in parallel
	const [jobs, invoices, payments, properties, contacts] = await Promise.all([
		supabase.from("jobs").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(10),
		supabase.from("invoices").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(10),
		supabase.from("payments").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(10),
		supabase.from("properties").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
		supabase.from("customer_contacts").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
	]);

	// Log the action
	await logAdminAction({
		adminUserId,
		adminEmail,
		action: ADMIN_ACTIONS.CUSTOMER_VIEWED,
		resourceType: "customer",
		resourceId: customerId,
		details: {
			timestamp: new Date().toISOString(),
		},
	});

	return {
		customer,
		jobs: jobs.data || [],
		invoices: invoices.data || [],
		payments: payments.data || [],
		properties: properties.data || [],
		contacts: contacts.data || [],
	};
}

/**
 * Issue a refund for a payment
 */
export async function issuePaymentRefund(
	paymentId: string,
	refundAmount: number,
	reason: string,
	adminUserId: string,
	adminEmail: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = createWebClient();

	// Get payment details
	const { data: payment, error: fetchError } = await supabase.from("payments").select("*").eq("id", paymentId).single();

	if (fetchError || !payment) {
		return { success: false, error: "Payment not found" };
	}

	// Validate refund amount
	if (refundAmount > payment.amount) {
		return { success: false, error: "Refund amount exceeds payment amount" };
	}

	// Update payment with refund
	const { error: updateError } = await supabase
		.from("payments")
		.update({
			status: "refunded",
			refund_amount: refundAmount,
			refund_reason: reason,
			refunded_at: new Date().toISOString(),
			refunded_by: adminUserId,
		})
		.eq("id", paymentId);

	if (updateError) {
		return { success: false, error: updateError.message };
	}

	// Log the action
	await logAdminAction({
		adminUserId,
		adminEmail,
		action: ADMIN_ACTIONS.PAYMENT_REFUNDED,
		resourceType: "payment",
		resourceId: paymentId,
		details: {
			original_amount: payment.amount,
			refund_amount: refundAmount,
			reason,
			customer_id: payment.customer_id,
			timestamp: new Date().toISOString(),
		},
	});

	return { success: true };
}

/**
 * Update invoice status (void, mark as paid, etc.)
 */
export async function updateInvoiceStatus(invoiceId: string, status: string, notes: string, adminUserId: string, adminEmail: string): Promise<{ success: boolean; error?: string }> {
	const supabase = createWebClient();

	const { error } = await supabase
		.from("invoices")
		.update({
			status,
			admin_notes: notes,
			updated_at: new Date().toISOString(),
		})
		.eq("id", invoiceId);

	if (error) {
		return { success: false, error: error.message };
	}

	// Log the action
	await logAdminAction({
		adminUserId,
		adminEmail,
		action: ADMIN_ACTIONS.INVOICE_EDITED,
		resourceType: "invoice",
		resourceId: invoiceId,
		details: {
			new_status: status,
			notes,
			timestamp: new Date().toISOString(),
		},
	});

	return { success: true };
}

/**
 * Search for a customer by email, phone, or name
 */
export async function searchCustomers(query: string, companyId?: string, limit: number = 25) {
	const supabase = createWebClient();

	let queryBuilder = supabase
		.from("customers")
		.select("id, first_name, last_name, email, phone, company_id, created_at, status")
		.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (companyId) {
		queryBuilder = queryBuilder.eq("company_id", companyId);
	}

	const { data, error } = await queryBuilder;

	if (error) {
		throw new Error(`Search failed: ${error.message}`);
	}

	return data;
}

/**
 * Get company overview with stats
 */
export async function getCompanyOverview(companyId: string, adminUserId: string, adminEmail: string) {
	const supabase = createWebClient();

	// Get company data
	const { data: company, error: companyError } = await supabase.from("companies").select("*").eq("id", companyId).single();

	if (companyError) {
		throw new Error(`Failed to fetch company: ${companyError.message}`);
	}

	// Get stats in parallel
	const [customersCount, jobsCount, invoicesCount, paymentsSum, activeSubscriptions] = await Promise.all([
		supabase.from("customers").select("id", { count: "exact", head: true }).eq("company_id", companyId),
		supabase.from("jobs").select("id", { count: "exact", head: true }).eq("company_id", companyId),
		supabase.from("invoices").select("id", { count: "exact", head: true }).eq("company_id", companyId),
		supabase.from("payments").select("amount").eq("company_id", companyId).eq("status", "completed"),
		supabase.from("subscriptions").select("*").eq("company_id", companyId).in("status", ["active", "trialing"]),
	]);

	// Calculate total revenue
	const totalRevenue = paymentsSum.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

	// Log the action
	await logAdminAction({
		adminUserId,
		adminEmail,
		action: ADMIN_ACTIONS.COMPANY_VIEWED,
		resourceType: "company",
		resourceId: companyId,
		details: {
			timestamp: new Date().toISOString(),
		},
	});

	return {
		company,
		stats: {
			customers: customersCount.count || 0,
			jobs: jobsCount.count || 0,
			invoices: invoicesCount.count || 0,
			totalRevenue,
			activeSubscriptions: activeSubscriptions.data || [],
		},
	};
}

/**
 * Suspend or reactivate a company
 */
export async function updateCompanyStatus(companyId: string, status: "active" | "suspended", reason: string, adminUserId: string, adminEmail: string): Promise<{ success: boolean; error?: string }> {
	const supabase = createWebClient();

	const { error } = await supabase
		.from("companies")
		.update({
			status,
			status_reason: reason,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId);

	if (error) {
		return { success: false, error: error.message };
	}

	// Log the action
	await logAdminAction({
		adminUserId,
		adminEmail,
		action: status === "suspended" ? ADMIN_ACTIONS.COMPANY_SUSPENDED : ADMIN_ACTIONS.COMPANY_REACTIVATED,
		resourceType: "company",
		resourceId: companyId,
		details: {
			new_status: status,
			reason,
			timestamp: new Date().toISOString(),
		},
	});

	return { success: true };
}

/**
 * Get recent activity across all companies (for dashboard)
 */
export async function getRecentActivity(limit: number = 50) {
	const supabase = createWebClient();

	const [recentJobs, recentInvoices, recentPayments] = await Promise.all([
		supabase
			.from("jobs")
			.select("id, job_number, status, company_id, customer_id, created_at")
			.order("created_at", { ascending: false })
			.limit(limit / 3),
		supabase
			.from("invoices")
			.select("id, invoice_number, status, total, company_id, customer_id, created_at")
			.order("created_at", { ascending: false })
			.limit(limit / 3),
		supabase
			.from("payments")
			.select("id, amount, status, company_id, customer_id, created_at")
			.order("created_at", { ascending: false })
			.limit(limit / 3),
	]);

	return {
		jobs: recentJobs.data || [],
		invoices: recentInvoices.data || [],
		payments: recentPayments.data || [],
	};
}
