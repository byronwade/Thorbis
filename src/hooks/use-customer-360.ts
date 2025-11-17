/**
 * Customer 360° Data Hooks
 *
 * Progressive loading hooks for all Customer 360° view widgets.
 * Each hook loads data only when its corresponding widget becomes visible.
 *
 * Usage in ProgressiveWidget:
 * <ProgressiveWidget title="Recent Jobs">
 *   {({ isVisible }) => {
 *     const { data, isLoading } = useCustomerJobs(customerId, isVisible);
 *     return isLoading ? <Skeleton /> : <JobsList jobs={data} />;
 *   }}
 * </ProgressiveWidget>
 */

"use client";

import { createClient } from "@/lib/supabase/client";
import { useProgressiveData } from "./use-progressive-data";

/**
 * Load customer's properties
 */
export function useCustomerProperties(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-properties", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("properties")
				.select("*")
				.eq("primary_contact_id", customerId)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's jobs
 */
export function useCustomerJobs(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-jobs", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("jobs")
				.select("*")
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's invoices
 */
export function useCustomerInvoices(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-invoices", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("invoices")
				.select("*")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's estimates
 */
export function useCustomerEstimates(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-estimates", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("estimates")
				.select("*")
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's appointments
 */
export function useCustomerAppointments(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-appointments", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("schedules")
				.select(
					`
					*,
					job:jobs!job_id(id, job_number, title),
					property:properties!property_id(id, name, address)
				`
				)
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("scheduled_start", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's contracts
 */
export function useCustomerContracts(customerId: string, companyId: string, enabled = true) {
	return useProgressiveData(
		["customer-contracts", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("contracts")
				.select(
					`
					*,
					job:jobs!job_id(id, job_number),
					estimate:estimates!estimate_id(id, estimate_number),
					invoice:invoices!invoice_id(id, invoice_number)
				`
				)
				.eq("company_id", companyId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(50);
		},
		{ enabled }
	);
}

/**
 * Load customer's payments
 */
export function useCustomerPayments(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-payments", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("payments")
				.select("*")
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("processed_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's maintenance plans
 */
export function useCustomerMaintenancePlans(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-maintenance-plans", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("maintenance_plans")
				.select("*")
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's service agreements
 */
export function useCustomerServiceAgreements(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-service-agreements", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("service_plans")
				.select("*")
				.eq("customer_id", customerId)
				.eq("type", "contract")
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's equipment
 */
export function useCustomerEquipment(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-equipment", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("equipment")
				.select("*")
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}

/**
 * Load customer's payment methods
 */
export function useCustomerPaymentMethods(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-payment-methods", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("customer_payment_methods")
				.select("*")
				.eq("customer_id", customerId)
				.eq("is_active", true)
				.order("is_default", { ascending: false })
				.limit(5);
		},
		{ enabled }
	);
}

/**
 * Load customer activities (using custom table)
 */
export function useCustomerActivities(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-activities", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("customer_activities")
				.select("*")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(20);
		},
		{ enabled }
	);
}

/**
 * Load customer attachments (using custom table)
 */
export function useCustomerAttachments(customerId: string, enabled = true) {
	return useProgressiveData(
		["customer-attachments", customerId],
		async () => {
			const supabase = createClient();
			return await supabase
				.from("customer_attachments")
				.select("*")
				.eq("customer_id", customerId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(10);
		},
		{ enabled }
	);
}
