/**
 * View-As Query Utilities
 *
 * Helper functions for fetching customer data in view-as mode.
 * These wrap web app queries and pass the impersonated company ID.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getImpersonatedCompanyId } from "@/lib/admin-context";

const ITEMS_PER_PAGE = 50;

/**
 * Generic query function for fetching paginated data
 */
async function getViewAsPageData<T>(
	table: string,
	selectQuery: string,
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
	searchQuery: string = "",
): Promise<{ data: T[]; totalCount: number }> {
	const companyId = await getImpersonatedCompanyId();
	if (!companyId) {
		return { data: [], totalCount: 0 };
	}

	const supabase = createWebClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	let query = supabase
		.from(table)
		.select(selectQuery, { count: "exact" })
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false });

	// Add search if provided
	if (searchQuery) {
		query = query.or(
			`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
		);
	}

	const { data, error, count } = await query.range(start, end);

	if (error) {
		throw new Error(`Failed to load ${table}: ${error.message}`);
	}

	return {
		data: (data as T[]) ?? [],
		totalCount: count ?? 0,
	};
}

/**
 * Get invoices for the impersonated company
 */
export async function getViewAsInvoices(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"invoices",
		`
      id,
      invoice_number,
      status,
      total_amount,
      paid_amount,
      balance_amount,
      created_at,
      due_date,
      archived_at,
      customers!invoices_customer_id_customers_id_fk (
        display_name,
        first_name,
        last_name
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get payments for the impersonated company
 */
export async function getViewAsPayments(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"payments",
		`
      id,
      payment_number,
      amount,
      payment_method,
      status,
      created_at,
      customers!payments_customer_id_customers_id_fk (
        display_name
      ),
      invoices!payments_invoice_id_invoices_id_fk (
        invoice_number
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get estimates for the impersonated company
 */
export async function getViewAsEstimates(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"estimates",
		`
      id,
      estimate_number,
      title,
      status,
      total_amount,
      created_at,
      valid_until,
      customers!estimates_customer_id_customers_id_fk (
        display_name
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get contracts for the impersonated company
 */
export async function getViewAsContracts(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"contracts",
		`
      id,
      contract_number,
      title,
      status,
      total_value,
      start_date,
      end_date,
      created_at,
      customers!contracts_customer_id_customers_id_fk (
        display_name
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get appointments for the impersonated company
 */
export async function getViewAsAppointments(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"appointments",
		`
      id,
      title,
      status,
      scheduled_start,
      scheduled_end,
      created_at,
      customers!appointments_customer_id_customers_id_fk (
        display_name
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get team members for the impersonated company
 */
export async function getViewAsTeamMembers(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	const companyId = await getImpersonatedCompanyId();
	if (!companyId) {
		return { data: [], totalCount: 0 };
	}

	const supabase = createWebClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	const { data, error, count } = await supabase
		.from("team_members")
		.select(
			`
        id,
        display_name,
        email,
        phone,
        role,
        status,
        created_at,
        users!team_members_user_id_users_id_fk (
          email,
          phone
        )
      `,
			{ count: "exact" },
		)
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.range(start, end);

	if (error) {
		throw new Error(`Failed to load team members: ${error.message}`);
	}

	return {
		data: data ?? [],
		totalCount: count ?? 0,
	};
}

/**
 * Get equipment for the impersonated company
 */
export async function getViewAsEquipment(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"equipment",
		`
      id,
      name,
      type,
      status,
      serial_number,
      purchase_date,
      created_at
    `,
		page,
		pageSize,
	);
}

/**
 * Get materials for the impersonated company
 */
export async function getViewAsMaterials(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"materials",
		`
      id,
      name,
      sku,
      category,
      quantity_on_hand,
      unit_cost,
      created_at
    `,
		page,
		pageSize,
	);
}

/**
 * Get purchase orders for the impersonated company
 */
async function getViewAsPurchaseOrders(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"purchase_orders",
		`
      id,
      po_number,
      status,
      total_amount,
      order_date,
      created_at,
      vendors!purchase_orders_vendor_id_vendors_id_fk (
        company_name
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get maintenance plans for the impersonated company
 */
async function getViewAsMaintenancePlans(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"maintenance_plans",
		`
      id,
      title,
      status,
      frequency,
      next_service_date,
      created_at,
      customers!maintenance_plans_customer_id_customers_id_fk (
        display_name
      )
    `,
		page,
		pageSize,
	);
}

/**
 * Get service agreements for the impersonated company
 */
async function getViewAsServiceAgreements(
	page: number = 1,
	pageSize: number = ITEMS_PER_PAGE,
) {
	return getViewAsPageData(
		"service_agreements",
		`
      id,
      agreement_number,
      title,
      status,
      total_value,
      start_date,
      end_date,
      created_at,
      customers!service_agreements_customer_id_customers_id_fk (
        display_name
      )
    `,
		page,
		pageSize,
	);
}
