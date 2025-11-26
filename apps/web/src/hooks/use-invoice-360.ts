/**
 * Invoice 360° Hooks - Progressive Loading
 *
 * Specialized hooks for loading invoice-related data on-demand.
 * Each hook only fetches when enabled=true (when widget becomes visible).
 *
 * Performance:
 * - Viewport-based loading (100px before visible)
 * - React Query caching (5min stale, 10min cache)
 * - Automatic deduplication
 */

import { createClient } from "@/lib/supabase/client";
import { useProgressiveData } from "./use-progressive-data";

/**
 * Load job details for invoice
 */
export function useInvoiceJob(jobId: string | null, enabled = true) {
	return useProgressiveData(
		["invoice-job", jobId],
		async () => {
			if (!jobId) return { data: null, error: null };

			const supabase = createClient();
			return await supabase
				.from("jobs")
				.select("id, job_number, title, property_id")
				.eq("id", jobId)
				.single();
		},
		{ enabled: enabled && !!jobId },
	);
}

/**
 * Load property details for invoice job
 */
export function useInvoiceProperty(propertyId: string | null, enabled = true) {
	return useProgressiveData(
		["invoice-property", propertyId],
		async () => {
			if (!propertyId) return { data: null, error: null };

			const supabase = createClient();
			return await supabase
				.from("properties")
				.select("*")
				.eq("id", propertyId)
				.single();
		},
		{ enabled: enabled && !!propertyId },
	);
}

/**
 * Load estimate that generated this invoice (workflow timeline)
 */
export function useInvoiceEstimate(estimateId: string | null, enabled = true) {
	return useProgressiveData(
		["invoice-estimate", estimateId],
		async () => {
			if (!estimateId) return { data: null, error: null };

			const supabase = createClient();
			return await supabase
				.from("estimates")
				.select("id, estimate_number, created_at, status")
				.eq("id", estimateId)
				.maybeSingle();
		},
		{ enabled: enabled && !!estimateId },
	);
}

/**
 * Load contract related to invoice (workflow timeline)
 */
export function useInvoiceContract(invoiceId: string, enabled = true) {
	return useProgressiveData(
		["invoice-contract", invoiceId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("contracts")
				.select("id, contract_number, created_at, status, signed_at")
				.eq("invoice_id", invoiceId)
				.is("deleted_at", null)
				.maybeSingle();
		},
		{ enabled },
	);
}

/**
 * Load customer payment methods
 */
export function useInvoicePaymentMethods(customerId: string, enabled = true) {
	return useProgressiveData(
		["invoice-payment-methods", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("customer_payment_methods")
				.select("*")
				.eq("customer_id", customerId)
				.eq("is_active", true)
				.order("is_default", { ascending: false });
		},
		{ enabled },
	);
}

/**
 * Load payments applied to invoice
 */
export function useInvoicePayments(invoiceId: string, enabled = true) {
	return useProgressiveData(
		["invoice-payments", invoiceId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("invoice_payments")
				.select(
					`
					id,
					amount_applied,
					applied_at,
					notes,
					payment:payments!payment_id (
						id,
						payment_number,
						amount,
						payment_method,
						payment_type,
						status,
						card_brand,
						card_last4,
						check_number,
						reference_number,
						processor_name,
						receipt_url,
						receipt_number,
						refunded_amount,
						refund_reason,
						processed_at,
						completed_at,
						notes
					)
				`,
				)
				.eq("invoice_id", invoiceId)
				.order("applied_at", { ascending: false });
		},
		{ enabled },
	);
}

/**
 * Load communications for invoice (uses entity hooks already)
 * This is a specialized query that filters by multiple criteria
 */
export function useInvoiceCommunications(
	invoiceId: string,
	customerId: string | null,
	jobId: string | null,
	companyId: string,
	enabled = true,
) {
	return useProgressiveData(
		["invoice-communications", invoiceId, customerId, jobId],
		async () => {
			const supabase = createClient();

			// Build filter array
			const filters: string[] = [`invoice_id.eq.${invoiceId}`];
			if (customerId) {
				filters.push(`customer_id.eq.${customerId}`);
			}
			if (jobId) {
				filters.push(`job_id.eq.${jobId}`);
			}

			let query = supabase
				.from("communications")
				.select(
					`
					*,
					customer:customers!customer_id(id, first_name, last_name)
				`,
				)
				.eq("company_id", companyId)
				.order("created_at", { ascending: false })
				.limit(50);

			// Apply OR filter if multiple criteria
			if (filters.length > 1) {
				query = query.or(filters.join(","));
			} else {
				query = query.eq("invoice_id", invoiceId);
			}

			const result = await query;

			// Deduplicate communications by ID
			const uniqueCommunications =
				(result.data || []).filter((record, index, self) => {
					if (!record?.id) return false;
					return self.findIndex((entry) => entry.id === record.id) === index;
				}) ?? [];

			return { data: uniqueCommunications, error: result.error };
		},
		{ enabled },
	);
}
