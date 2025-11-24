/**
 * AI Agent Tools - Comprehensive tool definitions for the AI Manager
 * Integrates with database, Resend, Telnyx, and financial systems
 */

import { tool } from "ai";
import { z } from "zod";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	searchCustomersFullText,
	searchJobsFullText,
	searchAllEntities,
} from "@/lib/search/full-text-search";

// Tool categories for permission checking
export type ToolCategory = "communication" | "financial" | "scheduling" | "customer" | "reporting" | "system" | "team" | "vendor" | "notification" | "property" | "equipment";

// ============================================================================
// UNIVERSAL DATABASE ACCESS TOOLS
// ============================================================================

export const listDatabaseTablesTool = tool({
	description: "List all available database tables and their purposes. Use this to understand what data is available.",
	parameters: z.object({}),
	execute: async () => {
		return {
			success: true,
			tables: [
				{ name: "customers", description: "Customer records with contact info, revenue, and status" },
				{ name: "team_members", description: "Employee/staff records with roles, contact info, and assignments" },
				{ name: "vendors", description: "Supplier/vendor records with contact and payment info" },
				{ name: "jobs", description: "Work orders and service jobs with status, scheduling, and costs" },
				{ name: "appointments", description: "Scheduled appointments and service calls" },
				{ name: "invoices", description: "Customer invoices with line items and payment status" },
				{ name: "estimates", description: "Price estimates/quotes for customers" },
				{ name: "contracts", description: "Service contracts and agreements" },
				{ name: "payments", description: "Payment records and transactions" },
				{ name: "properties", description: "Customer properties/service locations" },
				{ name: "equipment", description: "Equipment and assets at properties" },
				{ name: "communications", description: "Email, SMS, and call history" },
				{ name: "price_book_items", description: "Service and product pricing catalog" },
				{ name: "materials", description: "Materials and parts inventory" },
				{ name: "purchase_orders", description: "Orders placed with vendors" },
				{ name: "time_entries", description: "Time tracking for jobs and employees" },
				{ name: "expenses", description: "Business expenses and costs" },
				{ name: "service_agreements", description: "Recurring service agreements" },
				{ name: "maintenance_plans", description: "Equipment maintenance schedules" },
				{ name: "notes", description: "Notes attached to various records" },
				{ name: "tags", description: "Tags/labels for organizing records" },
				{ name: "finance_virtual_buckets", description: "Financial savings goals and allocations" },
				{ name: "scheduled_notifications", description: "Scheduled reminders and notifications" },
			],
		};
	},
});

export const queryDatabaseTool = tool({
	description: "Query any database table to retrieve records. Use this for flexible data access when specific tools don't cover your needs.",
	parameters: z.object({
		table: z.string().describe("Table name to query (e.g., 'customers', 'jobs', 'invoices')"),
		select: z.string().optional().default("*").describe("Columns to select (comma-separated or * for all)"),
		filters: z.array(z.object({
			column: z.string(),
			operator: z.enum(["eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike", "in", "is"]),
			value: z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string())]),
		})).optional().describe("Filters to apply"),
		orderBy: z.object({
			column: z.string(),
			ascending: z.boolean().default(false),
		}).optional().describe("Sort order"),
		limit: z.number().optional().default(50).describe("Max records to return"),
		offset: z.number().optional().default(0).describe("Records to skip for pagination"),
	}),
	execute: async ({ table, select, filters, orderBy, limit, offset }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Security: Only allow access to business tables
		const allowedTables = [
			"customers", "team_members", "vendors", "jobs", "appointments", "invoices",
			"estimates", "contracts", "payments", "properties", "equipment", "communications",
			"price_book_items", "materials", "purchase_orders", "time_entries", "expenses",
			"service_agreements", "maintenance_plans", "notes", "tags", "finance_virtual_buckets",
			"scheduled_notifications", "job_line_items", "invoice_line_items", "estimate_line_items",
		];

		if (!allowedTables.includes(table)) {
			return { success: false, error: `Table '${table}' is not accessible. Available: ${allowedTables.join(", ")}` };
		}

		let query = supabase.from(table).select(select);

		// Always filter by company_id for security
		query = query.eq("company_id", companyId);

		// Apply filters
		if (filters) {
			for (const filter of filters) {
				switch (filter.operator) {
					case "eq": query = query.eq(filter.column, filter.value); break;
					case "neq": query = query.neq(filter.column, filter.value); break;
					case "gt": query = query.gt(filter.column, filter.value); break;
					case "gte": query = query.gte(filter.column, filter.value); break;
					case "lt": query = query.lt(filter.column, filter.value); break;
					case "lte": query = query.lte(filter.column, filter.value); break;
					case "like": query = query.like(filter.column, filter.value as string); break;
					case "ilike": query = query.ilike(filter.column, filter.value as string); break;
					case "in": query = query.in(filter.column, filter.value as string[]); break;
					case "is": query = query.is(filter.column, filter.value); break;
				}
			}
		}

		// Apply ordering
		if (orderBy) {
			query = query.order(orderBy.column, { ascending: orderBy.ascending });
		}

		// Apply pagination
		query = query.range(offset, offset + limit - 1);

		const { data, error, count } = await query;

		if (error) return { success: false, error: error.message };
		return { success: true, data, count: data?.length || 0, table };
	},
});

export const getRecordByIdTool = tool({
	description: "Get a specific record by its ID from any table. Use when you need full details of a known record.",
	parameters: z.object({
		table: z.string().describe("Table name"),
		id: z.string().uuid().describe("Record UUID"),
		select: z.string().optional().default("*").describe("Columns to select"),
	}),
	execute: async ({ table, id, select }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const allowedTables = [
			"customers", "team_members", "vendors", "jobs", "appointments", "invoices",
			"estimates", "contracts", "payments", "properties", "equipment", "communications",
			"price_book_items", "materials", "purchase_orders", "time_entries", "expenses",
			"service_agreements", "maintenance_plans", "notes", "finance_virtual_buckets",
		];

		if (!allowedTables.includes(table)) {
			return { success: false, error: `Table '${table}' is not accessible` };
		}

		const { data, error } = await supabase
			.from(table)
			.select(select)
			.eq("id", id)
			.eq("company_id", companyId)
			.single();

		if (error) return { success: false, error: error.message };
		return { success: true, record: data, table };
	},
});

export const getRelatedRecordsTool = tool({
	description: "Get records related to a specific entity (e.g., all jobs for a customer, all invoices for a job).",
	parameters: z.object({
		parentTable: z.string().describe("Parent table (e.g., 'customers')"),
		parentId: z.string().uuid().describe("Parent record ID"),
		childTable: z.string().describe("Related table to query (e.g., 'jobs')"),
		foreignKey: z.string().describe("Foreign key column in child table (e.g., 'customer_id')"),
		select: z.string().optional().default("*"),
		limit: z.number().optional().default(50),
	}),
	execute: async ({ parentTable, parentId, childTable, foreignKey, select, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const { data, error } = await supabase
			.from(childTable)
			.select(select)
			.eq(foreignKey, parentId)
			.eq("company_id", companyId)
			.limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, data, count: data?.length || 0, parentTable, childTable };
	},
});

export const getCompanyOverviewTool = tool({
	description: "Get a comprehensive overview of the entire company including counts and summaries from all major tables.",
	parameters: z.object({}),
	execute: async (_params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const [
			customersResult,
			teamResult,
			vendorsResult,
			jobsResult,
			invoicesResult,
			estimatesResult,
			contractsResult,
			propertiesResult,
			equipmentResult,
			appointmentsResult,
		] = await Promise.all([
			supabase.from("customers").select("id, status", { count: "exact" }).eq("company_id", companyId),
			supabase.from("team_members").select("id, status, role", { count: "exact" }).eq("company_id", companyId),
			supabase.from("vendors").select("id, status", { count: "exact" }).eq("company_id", companyId),
			supabase.from("jobs").select("id, status, total_amount", { count: "exact" }).eq("company_id", companyId),
			supabase.from("invoices").select("id, status, total_amount, balance_amount", { count: "exact" }).eq("company_id", companyId),
			supabase.from("estimates").select("id, status, total_amount", { count: "exact" }).eq("company_id", companyId),
			supabase.from("contracts").select("id, status, total_value", { count: "exact" }).eq("company_id", companyId),
			supabase.from("properties").select("id", { count: "exact" }).eq("company_id", companyId),
			supabase.from("equipment").select("id", { count: "exact" }).eq("company_id", companyId),
			supabase.from("appointments").select("id, status", { count: "exact" }).eq("company_id", companyId),
		]);

		// Calculate summaries
		const activeCustomers = customersResult.data?.filter(c => c.status === "active").length || 0;
		const activeTeam = teamResult.data?.filter(t => t.status === "active").length || 0;
		const openJobs = jobsResult.data?.filter(j => ["pending", "scheduled", "in_progress"].includes(j.status)).length || 0;
		const completedJobs = jobsResult.data?.filter(j => j.status === "completed").length || 0;
		const pendingInvoices = invoicesResult.data?.filter(i => ["sent", "viewed"].includes(i.status)).length || 0;
		const overdueBalance = invoicesResult.data?.filter(i => i.balance_amount > 0).reduce((s, i) => s + i.balance_amount, 0) || 0;
		const pendingEstimates = estimatesResult.data?.filter(e => ["sent", "viewed"].includes(e.status)).length || 0;
		const activeContracts = contractsResult.data?.filter(c => c.status === "active").length || 0;

		// Team role breakdown
		const roleBreakdown: Record<string, number> = {};
		teamResult.data?.forEach(t => {
			roleBreakdown[t.role || "unassigned"] = (roleBreakdown[t.role || "unassigned"] || 0) + 1;
		});

		return {
			success: true,
			overview: {
				customers: {
					total: customersResult.count || 0,
					active: activeCustomers,
				},
				team: {
					total: teamResult.count || 0,
					active: activeTeam,
					byRole: roleBreakdown,
				},
				vendors: {
					total: vendorsResult.count || 0,
				},
				jobs: {
					total: jobsResult.count || 0,
					open: openJobs,
					completed: completedJobs,
				},
				invoices: {
					total: invoicesResult.count || 0,
					pending: pendingInvoices,
					outstandingBalance: overdueBalance / 100,
				},
				estimates: {
					total: estimatesResult.count || 0,
					pending: pendingEstimates,
				},
				contracts: {
					total: contractsResult.count || 0,
					active: activeContracts,
				},
				properties: {
					total: propertiesResult.count || 0,
				},
				equipment: {
					total: equipmentResult.count || 0,
				},
				appointments: {
					total: appointmentsResult.count || 0,
				},
			},
		};
	},
});

export const searchAllEntitesTool = tool({
	description: "Search across multiple tables simultaneously using full-text search with relevance ranking. Use for broad searches when you don't know which entity type contains the information.",
	parameters: z.object({
		query: z.string().describe("Search term - supports multi-word queries and typo tolerance"),
		limit: z.number().optional().default(10).describe("Results per table"),
	}),
	execute: async ({ query, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Use unified full-text search for better performance and relevance
		const searchResults = await searchAllEntities(supabase, companyId, query, { limit });

		// Format results for AI consumption
		const results: Record<string, unknown[]> = {};
		if (searchResults.customers.length > 0) results.customers = searchResults.customers;
		if (searchResults.jobs.length > 0) results.jobs = searchResults.jobs;
		if (searchResults.properties.length > 0) results.properties = searchResults.properties;
		if (searchResults.equipment.length > 0) results.equipment = searchResults.equipment;
		if (searchResults.priceBookItems.length > 0) results.priceBookItems = searchResults.priceBookItems;

		const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

		return { success: true, results, totalResults, query };
	},
});

// ============================================================================
// CUSTOMER TOOLS
// ============================================================================

export const searchCustomersTool = tool({
	description: "Search for customers by name, email, phone, or address using full-text search with relevance ranking. Supports multi-word queries and typo tolerance.",
	parameters: z.object({
		query: z.string().describe("Search query - can be name, email, phone, or address"),
		limit: z.number().optional().default(10).describe("Maximum results to return"),
	}),
	execute: async ({ query, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Use full-text search for better performance and relevance
		const customers = await searchCustomersFullText(supabase, companyId, query, { limit });

		return { success: true, customers, count: customers.length };
	},
});

export const getCustomerDetailsTool = tool({
	description: "Get detailed information about a specific customer including their jobs, invoices, and communication history",
	parameters: z.object({
		customerId: z.string().uuid().describe("The UUID of the customer"),
	}),
	execute: async ({ customerId }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const [customerResult, jobsResult, invoicesResult] = await Promise.all([
			supabase
				.from("customers")
				.select("*")
				.eq("id", customerId)
				.eq("company_id", companyId)
				.single(),
			supabase
				.from("jobs")
				.select("id, title, status, total_amount, scheduled_start")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(5),
			supabase
				.from("invoices")
				.select("id, invoice_number, status, total_amount, balance_amount, due_date")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(5),
		]);

		if (customerResult.error) return { success: false, error: customerResult.error.message };

		return {
			success: true,
			customer: customerResult.data,
			recentJobs: jobsResult.data || [],
			recentInvoices: invoicesResult.data || [],
		};
	},
});

export const createCustomerTool = tool({
	description: "Create a new customer in the system. Use this when a new customer contacts the business.",
	parameters: z.object({
		firstName: z.string().describe("Customer's first name"),
		lastName: z.string().describe("Customer's last name"),
		email: z.string().email().describe("Customer's email address"),
		phone: z.string().describe("Customer's phone number"),
		address: z.string().optional().describe("Street address"),
		city: z.string().optional().describe("City"),
		state: z.string().optional().describe("State"),
		zipCode: z.string().optional().describe("ZIP code"),
		source: z.string().optional().describe("How the customer found us (referral, google, etc.)"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const { data, error } = await supabase
			.from("customers")
			.insert({
				company_id: companyId,
				first_name: params.firstName,
				last_name: params.lastName,
				display_name: `${params.firstName} ${params.lastName}`,
				email: params.email,
				phone: params.phone,
				address: params.address,
				city: params.city,
				state: params.state,
				zip_code: params.zipCode,
				source: params.source,
				status: "active",
			})
			.select()
			.single();

		if (error) return { success: false, error: error.message };
		return { success: true, customer: data, message: `Created customer ${data.display_name}` };
	},
});

export const updateCustomerTool = tool({
	description: "Update customer information",
	parameters: z.object({
		customerId: z.string().uuid().describe("Customer ID to update"),
		updates: z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			email: z.string().email().optional(),
			phone: z.string().optional(),
			address: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			zipCode: z.string().optional(),
			notes: z.string().optional(),
		}).describe("Fields to update"),
	}),
	execute: async ({ customerId, updates }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const updateData: Record<string, unknown> = {};
		if (updates.firstName) updateData.first_name = updates.firstName;
		if (updates.lastName) updateData.last_name = updates.lastName;
		if (updates.email) updateData.email = updates.email;
		if (updates.phone) updateData.phone = updates.phone;
		if (updates.address) updateData.address = updates.address;
		if (updates.city) updateData.city = updates.city;
		if (updates.state) updateData.state = updates.state;
		if (updates.zipCode) updateData.zip_code = updates.zipCode;
		if (updates.notes) updateData.notes = updates.notes;

		if (updates.firstName || updates.lastName) {
			updateData.display_name = `${updates.firstName || ""} ${updates.lastName || ""}`.trim();
		}

		const { data, error } = await supabase
			.from("customers")
			.update(updateData)
			.eq("id", customerId)
			.eq("company_id", companyId)
			.select()
			.single();

		if (error) return { success: false, error: error.message };
		return { success: true, customer: data };
	},
});

// ============================================================================
// TEAM MEMBER TOOLS
// ============================================================================

export const searchTeamMembersTool = tool({
	description: "Search for team members by name, role, or department. Use this to find employees to assign or contact.",
	parameters: z.object({
		query: z.string().optional().describe("Search query - name or email"),
		role: z.string().optional().describe("Filter by role (technician, admin, manager, etc.)"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ query, role, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("team_members")
			.select("id, first_name, last_name, email, phone, role, department, status, hire_date, avatar_url")
			.eq("company_id", companyId)
			.eq("status", "active");

		if (query) {
			queryBuilder = queryBuilder.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
		}
		if (role) queryBuilder = queryBuilder.eq("role", role);

		const { data, error } = await queryBuilder.limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, teamMembers: data, count: data?.length || 0 };
	},
});

export const getTeamMemberDetailsTool = tool({
	description: "Get detailed information about a team member including their schedule and performance",
	parameters: z.object({
		teamMemberId: z.string().uuid().describe("The team member's ID"),
	}),
	execute: async ({ teamMemberId }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const [memberResult, jobsResult] = await Promise.all([
			supabase
				.from("team_members")
				.select("*")
				.eq("id", teamMemberId)
				.eq("company_id", companyId)
				.single(),
			supabase
				.from("jobs")
				.select("id, title, status, scheduled_start, total_amount")
				.eq("assigned_to", teamMemberId)
				.order("scheduled_start", { ascending: false })
				.limit(10),
		]);

		if (memberResult.error) return { success: false, error: memberResult.error.message };

		return {
			success: true,
			teamMember: memberResult.data,
			recentJobs: jobsResult.data || [],
		};
	},
});

export const sendTeamEmailTool = tool({
	description: "Send an email to a team member for internal communication, assignments, or updates.",
	parameters: z.object({
		teamMemberId: z.string().uuid().describe("Team member ID to send email to"),
		subject: z.string().describe("Email subject"),
		body: z.string().describe("Email body (HTML supported)"),
	}),
	execute: async ({ teamMemberId, subject, body }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Get team member email
		const { data: member } = await supabase
			.from("team_members")
			.select("email, first_name, last_name")
			.eq("id", teamMemberId)
			.eq("company_id", companyId)
			.single();

		if (!member?.email) return { success: false, error: "Team member email not found" };

		const { resend } = await import("@/lib/email/resend-client");
		if (!resend) return { success: false, error: "Email service not configured" };

		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
			to: member.email,
			subject,
			html: body,
		});

		if (error) return { success: false, error: error.message };

		return { success: true, messageId: data?.id, message: `Email sent to ${member.first_name} ${member.last_name}` };
	},
});

export const sendTeamSmsTool = tool({
	description: "Send an SMS to a team member for urgent updates or assignments.",
	parameters: z.object({
		teamMemberId: z.string().uuid().describe("Team member ID"),
		message: z.string().max(160).describe("SMS message (max 160 chars)"),
	}),
	execute: async ({ teamMemberId, message }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const { data: member } = await supabase
			.from("team_members")
			.select("phone, first_name, last_name")
			.eq("id", teamMemberId)
			.eq("company_id", companyId)
			.single();

		if (!member?.phone) return { success: false, error: "Team member phone not found" };

		const { data: phoneNumber } = await supabase
			.from("phone_numbers")
			.select("phone_number")
			.eq("company_id", companyId)
			.eq("is_primary", true)
			.single();

		if (!phoneNumber) return { success: false, error: "No company phone configured" };

		const { sendSMS } = await import("@/lib/telnyx/messaging");
		const result = await sendSMS({
			from: phoneNumber.phone_number,
			to: member.phone,
			text: message,
		});

		if (!result.success) return { success: false, error: result.error };

		return { success: true, messageId: result.messageId, message: `SMS sent to ${member.first_name} ${member.last_name}` };
	},
});

// ============================================================================
// VENDOR TOOLS
// ============================================================================

export const searchVendorsTool = tool({
	description: "Search for vendors/suppliers by name, category, or status",
	parameters: z.object({
		query: z.string().optional().describe("Search query - name or contact"),
		category: z.string().optional().describe("Vendor category (supplies, equipment, parts, etc.)"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ query, category, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("vendors")
			.select("id, name, contact_name, email, phone, category, status, account_number, payment_terms")
			.eq("company_id", companyId);

		if (query) queryBuilder = queryBuilder.or(`name.ilike.%${query}%,contact_name.ilike.%${query}%`);
		if (category) queryBuilder = queryBuilder.eq("category", category);

		const { data, error } = await queryBuilder.limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, vendors: data, count: data?.length || 0 };
	},
});

export const getVendorDetailsTool = tool({
	description: "Get detailed information about a vendor including purchase history",
	parameters: z.object({
		vendorId: z.string().uuid().describe("Vendor ID"),
	}),
	execute: async ({ vendorId }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const [vendorResult, purchasesResult] = await Promise.all([
			supabase
				.from("vendors")
				.select("*")
				.eq("id", vendorId)
				.eq("company_id", companyId)
				.single(),
			supabase
				.from("purchase_orders")
				.select("id, po_number, status, total_amount, order_date")
				.eq("vendor_id", vendorId)
				.order("order_date", { ascending: false })
				.limit(10),
		]);

		if (vendorResult.error) return { success: false, error: vendorResult.error.message };

		return {
			success: true,
			vendor: vendorResult.data,
			recentPurchases: purchasesResult.data || [],
		};
	},
});

export const sendVendorEmailTool = tool({
	description: "Send an email to a vendor for orders, inquiries, or communication.",
	parameters: z.object({
		vendorId: z.string().uuid().describe("Vendor ID"),
		subject: z.string().describe("Email subject"),
		body: z.string().describe("Email body"),
	}),
	execute: async ({ vendorId, subject, body }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const { data: vendor } = await supabase
			.from("vendors")
			.select("email, name, contact_name")
			.eq("id", vendorId)
			.eq("company_id", companyId)
			.single();

		if (!vendor?.email) return { success: false, error: "Vendor email not found" };

		const { resend } = await import("@/lib/email/resend-client");
		if (!resend) return { success: false, error: "Email service not configured" };

		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
			to: vendor.email,
			subject,
			html: body,
		});

		if (error) return { success: false, error: error.message };

		return { success: true, messageId: data?.id, message: `Email sent to ${vendor.name}` };
	},
});

export const sendVendorSmsTool = tool({
	description: "Send an SMS to a vendor contact for urgent communication.",
	parameters: z.object({
		vendorId: z.string().uuid().describe("Vendor ID"),
		message: z.string().max(160).describe("SMS message"),
	}),
	execute: async ({ vendorId, message }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const { data: vendor } = await supabase
			.from("vendors")
			.select("phone, name")
			.eq("id", vendorId)
			.eq("company_id", companyId)
			.single();

		if (!vendor?.phone) return { success: false, error: "Vendor phone not found" };

		const { data: phoneNumber } = await supabase
			.from("phone_numbers")
			.select("phone_number")
			.eq("company_id", companyId)
			.eq("is_primary", true)
			.single();

		if (!phoneNumber) return { success: false, error: "No company phone configured" };

		const { sendSMS } = await import("@/lib/telnyx/messaging");
		const result = await sendSMS({
			from: phoneNumber.phone_number,
			to: vendor.phone,
			text: message,
		});

		if (!result.success) return { success: false, error: result.error };

		return { success: true, messageId: result.messageId, message: `SMS sent to ${vendor.name}` };
	},
});

// ============================================================================
// PROPERTY & EQUIPMENT TOOLS
// ============================================================================

export const searchPropertiesTool = tool({
	description: "Search for service properties by address, customer, or type",
	parameters: z.object({
		query: z.string().optional().describe("Address or property name search"),
		customerId: z.string().uuid().optional().describe("Filter by customer"),
		propertyType: z.string().optional().describe("Property type (residential, commercial, etc.)"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ query, customerId, propertyType, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("properties")
			.select("id, name, address, city, state, zip_code, property_type, customer:customers(display_name)")
			.eq("company_id", companyId);

		if (query) queryBuilder = queryBuilder.or(`address.ilike.%${query}%,name.ilike.%${query}%`);
		if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);
		if (propertyType) queryBuilder = queryBuilder.eq("property_type", propertyType);

		const { data, error } = await queryBuilder.limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, properties: data, count: data?.length || 0 };
	},
});

export const getPropertyDetailsTool = tool({
	description: "Get detailed property information including equipment and service history",
	parameters: z.object({
		propertyId: z.string().uuid().describe("Property ID"),
	}),
	execute: async ({ propertyId }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const [propertyResult, equipmentResult, jobsResult] = await Promise.all([
			supabase
				.from("properties")
				.select("*, customer:customers(display_name, phone, email)")
				.eq("id", propertyId)
				.eq("company_id", companyId)
				.single(),
			supabase
				.from("equipment")
				.select("id, name, model, serial_number, install_date, warranty_expiry, last_service_date")
				.eq("property_id", propertyId)
				.limit(20),
			supabase
				.from("jobs")
				.select("id, title, status, scheduled_start, completed_at")
				.eq("property_id", propertyId)
				.order("scheduled_start", { ascending: false })
				.limit(10),
		]);

		if (propertyResult.error) return { success: false, error: propertyResult.error.message };

		return {
			success: true,
			property: propertyResult.data,
			equipment: equipmentResult.data || [],
			serviceHistory: jobsResult.data || [],
		};
	},
});

export const searchEquipmentTool = tool({
	description: "Search for equipment/assets by type, customer, or model",
	parameters: z.object({
		query: z.string().optional().describe("Equipment name, model, or serial number"),
		customerId: z.string().uuid().optional(),
		equipmentType: z.string().optional().describe("Equipment type (HVAC, plumbing, electrical, etc.)"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ query, customerId, equipmentType, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("equipment")
			.select("id, name, model, serial_number, equipment_type, install_date, warranty_expiry, last_service_date, property:properties(address, customer:customers(display_name))")
			.eq("company_id", companyId);

		if (query) queryBuilder = queryBuilder.or(`name.ilike.%${query}%,model.ilike.%${query}%,serial_number.ilike.%${query}%`);
		if (equipmentType) queryBuilder = queryBuilder.eq("equipment_type", equipmentType);

		const { data, error } = await queryBuilder.limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, equipment: data, count: data?.length || 0 };
	},
});

export const getMaintenanceDueTool = tool({
	description: "Get equipment that is due or overdue for maintenance service",
	parameters: z.object({
		daysAhead: z.number().optional().default(30).describe("Look ahead days for upcoming maintenance"),
	}),
	execute: async ({ daysAhead }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

		const { data, error } = await supabase
			.from("equipment")
			.select("id, name, model, last_service_date, next_service_date, property:properties(address, customer:customers(display_name, phone, email))")
			.eq("company_id", companyId)
			.lte("next_service_date", futureDate.toISOString())
			.order("next_service_date", { ascending: true })
			.limit(50);

		if (error) return { success: false, error: error.message };

		const overdue = data?.filter((e) => new Date(e.next_service_date) < new Date()) || [];
		const upcoming = data?.filter((e) => new Date(e.next_service_date) >= new Date()) || [];

		return {
			success: true,
			overdue,
			upcoming,
			overdueCount: overdue.length,
			upcomingCount: upcoming.length,
		};
	},
});

// ============================================================================
// JOB/SCHEDULING TOOLS
// ============================================================================

export const searchJobsTool = tool({
	description: "Search for jobs by title, job number, description, or status using full-text search with relevance ranking. Supports multi-word queries and typo tolerance.",
	parameters: z.object({
		query: z.string().optional().describe("Search query - searches job number, title, description"),
		status: z.enum(["pending", "scheduled", "in_progress", "completed", "cancelled"]).optional(),
		customerId: z.string().uuid().optional(),
		limit: z.number().optional().default(10),
	}),
	execute: async ({ query, status, customerId, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Use full-text search if there's a query
		if (query && !status && !customerId) {
			const jobs = await searchJobsFullText(supabase, companyId, query, { limit });
			return { success: true, jobs, count: jobs.length };
		}

		// Fall back to filtered query when status/customerId filters are used
		let queryBuilder = supabase
			.from("jobs")
			.select("id, job_number, title, status, total_amount, scheduled_start, scheduled_end, customer:customers(display_name, phone)")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (query) queryBuilder = queryBuilder.or(`title.ilike.%${query}%,job_number.ilike.%${query}%`);
		if (status) queryBuilder = queryBuilder.eq("status", status);
		if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);

		const { data, error } = await queryBuilder.order("scheduled_start", { ascending: false }).limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, jobs: data, count: data?.length || 0 };
	},
});

export const createAppointmentTool = tool({
	description: "Schedule a new appointment for a customer. Use this to book service calls or consultations.",
	parameters: z.object({
		customerId: z.string().uuid().describe("Customer to schedule for"),
		propertyId: z.string().uuid().describe("Property where service will be performed"),
		title: z.string().describe("Appointment title/description"),
		startTime: z.string().describe("Start time in ISO format (YYYY-MM-DDTHH:mm:ss)"),
		duration: z.number().describe("Duration in minutes"),
		type: z.enum(["service", "consultation", "estimate", "follow_up"]).default("service"),
		notes: z.string().optional().describe("Additional notes for the technician"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const startDate = new Date(params.startTime);
		const endDate = new Date(startDate.getTime() + params.duration * 60000);

		const { data, error } = await supabase
			.from("appointments")
			.insert({
				company_id: companyId,
				customer_id: params.customerId,
				property_id: params.propertyId,
				title: params.title,
				start_time: startDate.toISOString(),
				end_time: endDate.toISOString(),
				duration: params.duration,
				type: params.type,
				notes: params.notes,
				status: "scheduled",
			})
			.select()
			.single();

		if (error) return { success: false, error: error.message };
		return { success: true, appointment: data, message: `Scheduled appointment for ${startDate.toLocaleString()}` };
	},
});

export const getAvailableSlotsTool = tool({
	description: "Find available appointment slots for scheduling. Returns available time windows.",
	parameters: z.object({
		date: z.string().describe("Date to check (YYYY-MM-DD)"),
		duration: z.number().default(60).describe("Required duration in minutes"),
	}),
	execute: async ({ date, duration }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const targetDate = new Date(date);
		const dayStart = new Date(targetDate.setHours(8, 0, 0, 0));
		const dayEnd = new Date(targetDate.setHours(18, 0, 0, 0));

		// Get existing appointments for that day
		const { data: appointments } = await supabase
			.from("appointments")
			.select("start_time, end_time")
			.eq("company_id", companyId)
			.gte("start_time", dayStart.toISOString())
			.lte("start_time", dayEnd.toISOString())
			.neq("status", "cancelled");

		// Calculate available slots (simplified)
		const availableSlots = [];
		let currentTime = dayStart;

		while (currentTime < dayEnd) {
			const slotEnd = new Date(currentTime.getTime() + duration * 60000);
			const hasConflict = appointments?.some((apt) => {
				const aptStart = new Date(apt.start_time);
				const aptEnd = new Date(apt.end_time);
				return currentTime < aptEnd && slotEnd > aptStart;
			});

			if (!hasConflict && slotEnd <= dayEnd) {
				availableSlots.push({
					start: currentTime.toISOString(),
					end: slotEnd.toISOString(),
				});
			}
			currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute increments
		}

		return { success: true, availableSlots, date };
	},
});

// ============================================================================
// INVOICE/FINANCIAL TOOLS
// ============================================================================

export const searchInvoicesTool = tool({
	description: "Search for invoices by number, customer, or status",
	parameters: z.object({
		query: z.string().optional(),
		status: z.enum(["draft", "sent", "viewed", "paid", "overdue", "cancelled"]).optional(),
		customerId: z.string().uuid().optional(),
		limit: z.number().optional().default(10),
	}),
	execute: async ({ query, status, customerId, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("invoices")
			.select("id, invoice_number, title, status, total_amount, balance_amount, due_date, customer:customers(display_name)")
			.eq("company_id", companyId);

		if (query) queryBuilder = queryBuilder.ilike("invoice_number", `%${query}%`);
		if (status) queryBuilder = queryBuilder.eq("status", status);
		if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);

		const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, invoices: data, count: data?.length || 0 };
	},
});

export const createInvoiceTool = tool({
	description: "Create a new invoice for a customer",
	parameters: z.object({
		customerId: z.string().uuid().describe("Customer to invoice"),
		title: z.string().describe("Invoice title/description"),
		lineItems: z.array(z.object({
			description: z.string(),
			quantity: z.number(),
			unitPrice: z.number().describe("Price in cents"),
		})).describe("Line items for the invoice"),
		dueDate: z.string().optional().describe("Due date (YYYY-MM-DD)"),
		notes: z.string().optional(),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Calculate totals
		const subtotal = params.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
		const taxAmount = Math.round(subtotal * 0.08); // 8% tax example
		const totalAmount = subtotal + taxAmount;

		// Generate invoice number
		const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

		const { data, error } = await supabase
			.from("invoices")
			.insert({
				company_id: companyId,
				customer_id: params.customerId,
				invoice_number: invoiceNumber,
				title: params.title,
				line_items: params.lineItems,
				subtotal,
				tax_amount: taxAmount,
				total_amount: totalAmount,
				balance_amount: totalAmount,
				due_date: params.dueDate ? new Date(params.dueDate).toISOString() : null,
				notes: params.notes,
				status: "draft",
			})
			.select()
			.single();

		if (error) return { success: false, error: error.message };
		return {
			success: true,
			invoice: data,
			message: `Created invoice ${invoiceNumber} for $${(totalAmount / 100).toFixed(2)}`,
		};
	},
});

export const getFinancialSummaryTool = tool({
	description: "Get a financial summary including revenue, outstanding balances, and trends. Use this to provide business advice.",
	parameters: z.object({
		period: z.enum(["today", "week", "month", "quarter", "year"]).default("month"),
	}),
	execute: async ({ period }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const now = new Date();
		let startDate: Date;

		switch (period) {
			case "today":
				startDate = new Date(now.setHours(0, 0, 0, 0));
				break;
			case "week":
				startDate = new Date(now.setDate(now.getDate() - 7));
				break;
			case "month":
				startDate = new Date(now.setMonth(now.getMonth() - 1));
				break;
			case "quarter":
				startDate = new Date(now.setMonth(now.getMonth() - 3));
				break;
			case "year":
				startDate = new Date(now.setFullYear(now.getFullYear() - 1));
				break;
		}

		const [invoicesResult, paymentsResult, overdueResult] = await Promise.all([
			supabase
				.from("invoices")
				.select("total_amount, paid_amount, balance_amount, status")
				.eq("company_id", companyId)
				.gte("created_at", startDate.toISOString()),
			supabase
				.from("payments")
				.select("amount")
				.eq("company_id", companyId)
				.eq("status", "completed")
				.gte("created_at", startDate.toISOString()),
			supabase
				.from("invoices")
				.select("id, invoice_number, balance_amount, due_date, customer:customers(display_name)")
				.eq("company_id", companyId)
				.eq("status", "sent")
				.lt("due_date", new Date().toISOString())
				.gt("balance_amount", 0),
		]);

		const totalInvoiced = invoicesResult.data?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
		const totalCollected = paymentsResult.data?.reduce((sum, pay) => sum + pay.amount, 0) || 0;
		const totalOutstanding = invoicesResult.data?.reduce((sum, inv) => sum + inv.balance_amount, 0) || 0;

		return {
			success: true,
			period,
			summary: {
				totalInvoiced: totalInvoiced / 100,
				totalCollected: totalCollected / 100,
				totalOutstanding: totalOutstanding / 100,
				invoiceCount: invoicesResult.data?.length || 0,
				collectionRate: totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : 0,
			},
			overdueInvoices: overdueResult.data || [],
		};
	},
});

export const getVirtualBucketsTool = tool({
	description: "Get virtual financial buckets for the company. These are savings goals and fund allocations.",
	parameters: z.object({}),
	execute: async (_params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const { data, error } = await supabase
			.from("finance_virtual_buckets")
			.select("*")
			.eq("company_id", companyId)
			.eq("is_active", true);

		if (error) return { success: false, error: error.message };
		return { success: true, buckets: data };
	},
});

export const transferToBucketTool = tool({
	description: "Transfer funds to a virtual bucket for savings goals. This is for financial planning.",
	parameters: z.object({
		bucketId: z.string().uuid().describe("Target bucket ID"),
		amount: z.number().describe("Amount to transfer in cents"),
		note: z.string().optional().describe("Note for the transfer"),
	}),
	execute: async ({ bucketId, amount, note }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Update bucket balance
		const { data: bucket, error: fetchError } = await supabase
			.from("finance_virtual_buckets")
			.select("*")
			.eq("id", bucketId)
			.eq("company_id", companyId)
			.single();

		if (fetchError || !bucket) return { success: false, error: "Bucket not found" };

		const newBalance = (bucket.current_balance || 0) + amount;
		const { error: updateError } = await supabase
			.from("finance_virtual_buckets")
			.update({
				current_balance: newBalance,
				updated_at: new Date().toISOString(),
			})
			.eq("id", bucketId);

		if (updateError) return { success: false, error: updateError.message };

		return {
			success: true,
			message: `Transferred $${(amount / 100).toFixed(2)} to ${bucket.name}. New balance: $${(newBalance / 100).toFixed(2)}`,
			bucket: { ...bucket, current_balance: newBalance },
		};
	},
});

// ============================================================================
// COMMUNICATION TOOLS
// ============================================================================

export const sendEmailTool = tool({
	description: "Send an email to a customer. Use this for follow-ups, reminders, or responding to inquiries.",
	parameters: z.object({
		to: z.string().email().describe("Recipient email address"),
		subject: z.string().describe("Email subject line"),
		body: z.string().describe("Email body content (HTML supported)"),
		customerId: z.string().uuid().optional().describe("Associated customer ID for tracking"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		// Import Resend dynamically to avoid issues
		const { resend } = await import("@/lib/email/resend-client");

		if (!resend) {
			return { success: false, error: "Email service not configured" };
		}

		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
			to: params.to,
			subject: params.subject,
			html: params.body,
		});

		if (error) return { success: false, error: error.message };

		// Log communication
		const supabase = createServiceSupabaseClient();
		await supabase.from("communications").insert({
			company_id: companyId,
			customer_id: params.customerId,
			type: "email",
			direction: "outbound",
			to_address: params.to,
			subject: params.subject,
			body: params.body,
			body_html: params.body,
			status: "sent",
			sent_at: new Date().toISOString(),
			provider_message_id: data?.id,
		});

		return { success: true, messageId: data?.id, message: `Email sent to ${params.to}` };
	},
});

export const sendSmsTool = tool({
	description: "Send an SMS text message to a customer. Use for appointment reminders or quick updates.",
	parameters: z.object({
		to: z.string().describe("Phone number (format: +1XXXXXXXXXX)"),
		message: z.string().max(160).describe("Message content (max 160 characters)"),
		customerId: z.string().uuid().optional().describe("Associated customer ID"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		// Get company phone number
		const supabase = createServiceSupabaseClient();
		const { data: phoneNumber } = await supabase
			.from("phone_numbers")
			.select("phone_number, telnyx_connection_id")
			.eq("company_id", companyId)
			.eq("is_primary", true)
			.single();

		if (!phoneNumber) {
			return { success: false, error: "No phone number configured for company" };
		}

		// Send via Telnyx
		const { sendSMS } = await import("@/lib/telnyx/messaging");
		const result = await sendSMS({
			from: phoneNumber.phone_number,
			to: params.to,
			text: params.message,
		});

		if (!result.success) return { success: false, error: result.error };

		// Log communication
		await supabase.from("communications").insert({
			company_id: companyId,
			customer_id: params.customerId,
			type: "sms",
			direction: "outbound",
			to_address: params.to,
			body: params.message,
			status: "sent",
			sent_at: new Date().toISOString(),
			telnyx_message_id: result.messageId,
		});

		return { success: true, messageId: result.messageId, message: `SMS sent to ${params.to}` };
	},
});

export const initiateCallTool = tool({
	description: "Initiate a phone call to a customer. The call will be connected through the business phone system.",
	parameters: z.object({
		to: z.string().describe("Phone number to call (format: +1XXXXXXXXXX)"),
		customerId: z.string().uuid().optional().describe("Associated customer ID"),
		reason: z.string().optional().describe("Reason for the call (for logging)"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Get company phone configuration
		const { data: phoneNumber } = await supabase
			.from("phone_numbers")
			.select("phone_number, telnyx_connection_id")
			.eq("company_id", companyId)
			.eq("is_primary", true)
			.single();

		if (!phoneNumber) {
			return { success: false, error: "No phone number configured" };
		}

		// Initiate call via Telnyx
		const { initiateCall } = await import("@/lib/telnyx/calls");
		const result = await initiateCall({
			connectionId: phoneNumber.telnyx_connection_id,
			from: phoneNumber.phone_number,
			to: params.to,
		});

		if (!result.success) return { success: false, error: result.error };

		// Log communication
		await supabase.from("communications").insert({
			company_id: companyId,
			customer_id: params.customerId,
			type: "call",
			direction: "outbound",
			to_address: params.to,
			from_address: phoneNumber.phone_number,
			body: params.reason || "Outbound call",
			status: "pending",
			telnyx_call_control_id: result.callControlId,
		});

		return {
			success: true,
			callControlId: result.callControlId,
			message: `Call initiated to ${params.to}`,
		};
	},
});

export const getCommunicationHistoryTool = tool({
	description: "Get communication history with a customer (calls, texts, emails)",
	parameters: z.object({
		customerId: z.string().uuid().describe("Customer ID to get history for"),
		type: z.enum(["all", "email", "sms", "call"]).optional().default("all"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ customerId, type, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("communications")
			.select("*")
			.eq("company_id", companyId)
			.eq("customer_id", customerId);

		if (type !== "all") queryBuilder = queryBuilder.eq("type", type);

		const { data, error } = await queryBuilder
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, communications: data };
	},
});

// ============================================================================
// REPORTING/ANALYTICS TOOLS
// ============================================================================

export const getDashboardMetricsTool = tool({
	description: "Get key business metrics for the dashboard. Use this to provide business insights and recommendations.",
	parameters: z.object({}),
	execute: async (_params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const now = new Date();
		const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

		const [customersResult, jobsResult, invoicesResult] = await Promise.all([
			supabase
				.from("customers")
				.select("id", { count: "exact", head: true })
				.eq("company_id", companyId)
				.eq("status", "active"),
			supabase
				.from("jobs")
				.select("id, status, total_amount")
				.eq("company_id", companyId)
				.gte("created_at", thirtyDaysAgo.toISOString()),
			supabase
				.from("invoices")
				.select("id, total_amount, balance_amount, status")
				.eq("company_id", companyId)
				.gte("created_at", thirtyDaysAgo.toISOString()),
		]);

		const completedJobs = jobsResult.data?.filter((j) => j.status === "completed") || [];
		const overdueInvoices = invoicesResult.data?.filter((i) => i.status === "sent" && i.balance_amount > 0) || [];

		return {
			success: true,
			metrics: {
				activeCustomers: customersResult.count || 0,
				jobsLast30Days: jobsResult.data?.length || 0,
				completedJobsLast30Days: completedJobs.length,
				jobCompletionRate: jobsResult.data?.length
					? ((completedJobs.length / jobsResult.data.length) * 100).toFixed(1)
					: 0,
				invoicesLast30Days: invoicesResult.data?.length || 0,
				overdueInvoiceCount: overdueInvoices.length,
				totalOutstanding: overdueInvoices.reduce((sum, i) => sum + i.balance_amount, 0) / 100,
			},
		};
	},
});

export const getProactiveInsightsTool = tool({
	description: "Get proactive business insights and recommendations. Use this to help owners make decisions.",
	parameters: z.object({}),
	execute: async (_params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Get various insights
		const [overdueResult, inactiveCustomersResult, upcomingAppointmentsResult] = await Promise.all([
			// Overdue invoices
			supabase
				.from("invoices")
				.select("id, invoice_number, balance_amount, due_date, customer:customers(display_name, phone, email)")
				.eq("company_id", companyId)
				.eq("status", "sent")
				.lt("due_date", new Date().toISOString())
				.gt("balance_amount", 0)
				.limit(5),
			// Customers inactive for 90+ days
			supabase
				.from("customers")
				.select("id, display_name, phone, email, last_job_date")
				.eq("company_id", companyId)
				.eq("status", "active")
				.lt("last_job_date", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
				.limit(5),
			// Tomorrow's appointments
			supabase
				.from("appointments")
				.select("id, title, start_time, customer:customers(display_name, phone)")
				.eq("company_id", companyId)
				.eq("status", "scheduled")
				.gte("start_time", new Date().toISOString())
				.lt("start_time", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
				.limit(10),
		]);

		const insights = [];

		if (overdueResult.data && overdueResult.data.length > 0) {
			const totalOverdue = overdueResult.data.reduce((sum, inv) => sum + inv.balance_amount, 0);
			insights.push({
				type: "overdue_invoices",
				severity: "high",
				title: `${overdueResult.data.length} overdue invoices totaling $${(totalOverdue / 100).toFixed(2)}`,
				recommendation: "Consider sending payment reminders or initiating collection calls",
				data: overdueResult.data,
			});
		}

		if (inactiveCustomersResult.data && inactiveCustomersResult.data.length > 0) {
			insights.push({
				type: "inactive_customers",
				severity: "medium",
				title: `${inactiveCustomersResult.data.length} customers haven't had service in 90+ days`,
				recommendation: "Send re-engagement emails or offer maintenance service promotions",
				data: inactiveCustomersResult.data,
			});
		}

		if (upcomingAppointmentsResult.data && upcomingAppointmentsResult.data.length > 0) {
			insights.push({
				type: "upcoming_appointments",
				severity: "info",
				title: `${upcomingAppointmentsResult.data.length} appointments scheduled for tomorrow`,
				recommendation: "Consider sending reminder messages to customers",
				data: upcomingAppointmentsResult.data,
			});
		}

		return { success: true, insights };
	},
});

// ============================================================================
// REMINDER/NOTIFICATION TOOLS
// ============================================================================

export const scheduleReminderTool = tool({
	description: "Schedule a reminder email or SMS to be sent at a specific time. Use for appointment reminders, payment reminders, or follow-ups.",
	parameters: z.object({
		recipientType: z.enum(["customer", "team_member", "vendor"]).describe("Type of recipient"),
		recipientId: z.string().uuid().describe("ID of the recipient"),
		channel: z.enum(["email", "sms", "both"]).describe("Communication channel"),
		subject: z.string().optional().describe("Email subject (for email channel)"),
		message: z.string().describe("Message content"),
		sendAt: z.string().describe("When to send (ISO format)"),
		relatedTo: z.object({
			type: z.enum(["job", "invoice", "appointment", "estimate"]).optional(),
			id: z.string().uuid().optional(),
		}).optional().describe("Related entity"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		// Get recipient details based on type
		let recipientEmail: string | null = null;
		let recipientPhone: string | null = null;
		let recipientName = "";

		if (params.recipientType === "customer") {
			const { data } = await supabase
				.from("customers")
				.select("email, phone, display_name")
				.eq("id", params.recipientId)
				.eq("company_id", companyId)
				.single();
			if (data) {
				recipientEmail = data.email;
				recipientPhone = data.phone;
				recipientName = data.display_name;
			}
		} else if (params.recipientType === "team_member") {
			const { data } = await supabase
				.from("team_members")
				.select("email, phone, first_name, last_name")
				.eq("id", params.recipientId)
				.eq("company_id", companyId)
				.single();
			if (data) {
				recipientEmail = data.email;
				recipientPhone = data.phone;
				recipientName = `${data.first_name} ${data.last_name}`;
			}
		} else if (params.recipientType === "vendor") {
			const { data } = await supabase
				.from("vendors")
				.select("email, phone, name")
				.eq("id", params.recipientId)
				.eq("company_id", companyId)
				.single();
			if (data) {
				recipientEmail = data.email;
				recipientPhone = data.phone;
				recipientName = data.name;
			}
		}

		if (!recipientEmail && !recipientPhone) {
			return { success: false, error: "Recipient contact information not found" };
		}

		// Create scheduled notification
		const { data, error } = await supabase
			.from("scheduled_notifications")
			.insert({
				company_id: companyId,
				recipient_type: params.recipientType,
				recipient_id: params.recipientId,
				recipient_name: recipientName,
				recipient_email: recipientEmail,
				recipient_phone: recipientPhone,
				channel: params.channel,
				subject: params.subject,
				message: params.message,
				scheduled_at: params.sendAt,
				related_type: params.relatedTo?.type,
				related_id: params.relatedTo?.id,
				status: "scheduled",
			})
			.select()
			.single();

		if (error) return { success: false, error: error.message };

		return {
			success: true,
			reminder: data,
			message: `Reminder scheduled for ${recipientName} at ${new Date(params.sendAt).toLocaleString()}`,
		};
	},
});

export const cancelReminderTool = tool({
	description: "Cancel a scheduled reminder",
	parameters: z.object({
		reminderId: z.string().uuid().describe("ID of the reminder to cancel"),
	}),
	execute: async ({ reminderId }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const { error } = await supabase
			.from("scheduled_notifications")
			.update({ status: "cancelled" })
			.eq("id", reminderId)
			.eq("company_id", companyId);

		if (error) return { success: false, error: error.message };
		return { success: true, message: "Reminder cancelled successfully" };
	},
});

export const getScheduledRemindersTool = tool({
	description: "Get list of scheduled reminders for a customer, job, or entity",
	parameters: z.object({
		recipientType: z.enum(["customer", "team_member", "vendor"]).optional(),
		recipientId: z.string().uuid().optional(),
		relatedType: z.enum(["job", "invoice", "appointment", "estimate"]).optional(),
		relatedId: z.string().uuid().optional(),
		status: z.enum(["scheduled", "sent", "cancelled", "failed"]).optional().default("scheduled"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("scheduled_notifications")
			.select("*")
			.eq("company_id", companyId);

		if (params.recipientType) queryBuilder = queryBuilder.eq("recipient_type", params.recipientType);
		if (params.recipientId) queryBuilder = queryBuilder.eq("recipient_id", params.recipientId);
		if (params.relatedType) queryBuilder = queryBuilder.eq("related_type", params.relatedType);
		if (params.relatedId) queryBuilder = queryBuilder.eq("related_id", params.relatedId);
		if (params.status) queryBuilder = queryBuilder.eq("status", params.status);

		const { data, error } = await queryBuilder.order("scheduled_at", { ascending: true });

		if (error) return { success: false, error: error.message };
		return { success: true, reminders: data, count: data?.length || 0 };
	},
});

export const sendImmediateNotificationTool = tool({
	description: "Send an immediate notification to a customer, team member, or vendor. Use for urgent updates.",
	parameters: z.object({
		recipientType: z.enum(["customer", "team_member", "vendor"]).describe("Type of recipient"),
		recipientId: z.string().uuid().describe("ID of the recipient"),
		channel: z.enum(["email", "sms", "both"]).describe("Communication channel"),
		subject: z.string().optional().describe("Email subject"),
		message: z.string().describe("Message content"),
		priority: z.enum(["normal", "high", "urgent"]).optional().default("normal"),
	}),
	execute: async (params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const results: { email?: { success: boolean; messageId?: string; error?: string }; sms?: { success: boolean; messageId?: string; error?: string } } = {};

		// Get recipient details
		let recipientEmail: string | null = null;
		let recipientPhone: string | null = null;
		let recipientName = "";

		if (params.recipientType === "customer") {
			const { data } = await supabase.from("customers").select("email, phone, display_name").eq("id", params.recipientId).single();
			if (data) { recipientEmail = data.email; recipientPhone = data.phone; recipientName = data.display_name; }
		} else if (params.recipientType === "team_member") {
			const { data } = await supabase.from("team_members").select("email, phone, first_name, last_name").eq("id", params.recipientId).single();
			if (data) { recipientEmail = data.email; recipientPhone = data.phone; recipientName = `${data.first_name} ${data.last_name}`; }
		} else if (params.recipientType === "vendor") {
			const { data } = await supabase.from("vendors").select("email, phone, name").eq("id", params.recipientId).single();
			if (data) { recipientEmail = data.email; recipientPhone = data.phone; recipientName = data.name; }
		}

		// Send email if requested
		if ((params.channel === "email" || params.channel === "both") && recipientEmail) {
			const { resend } = await import("@/lib/email/resend-client");
			if (resend) {
				const { data, error } = await resend.emails.send({
					from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
					to: recipientEmail,
					subject: params.subject || "Notification",
					html: params.message,
				});
				results.email = error ? { success: false, error: error.message } : { success: true, messageId: data?.id };
			}
		}

		// Send SMS if requested
		if ((params.channel === "sms" || params.channel === "both") && recipientPhone) {
			const { data: phoneNumber } = await supabase.from("phone_numbers").select("phone_number").eq("company_id", companyId).eq("is_primary", true).single();
			if (phoneNumber) {
				const { sendSMS } = await import("@/lib/telnyx/messaging");
				const result = await sendSMS({ from: phoneNumber.phone_number, to: recipientPhone, text: params.message.slice(0, 160) });
				results.sms = result.success ? { success: true, messageId: result.messageId } : { success: false, error: result.error };
			}
		}

		return { success: true, results, message: `Notification sent to ${recipientName}` };
	},
});

// ============================================================================
// ENHANCED REPORTING TOOLS
// ============================================================================

export const getJobCostingReportTool = tool({
	description: "Get detailed job costing report including labor, materials, and profit margins",
	parameters: z.object({
		jobId: z.string().uuid().optional().describe("Specific job ID, or omit for summary"),
		period: z.enum(["week", "month", "quarter", "year"]).optional().default("month"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ jobId, period, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		if (jobId) {
			// Single job costing
			const { data: job, error } = await supabase
				.from("jobs")
				.select("*, customer:customers(display_name), line_items, labor_cost, material_cost, total_amount")
				.eq("id", jobId)
				.eq("company_id", companyId)
				.single();

			if (error) return { success: false, error: error.message };

			const laborCost = job?.labor_cost || 0;
			const materialCost = job?.material_cost || 0;
			const totalRevenue = job?.total_amount || 0;
			const profit = totalRevenue - laborCost - materialCost;
			const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

			return {
				success: true,
				job: {
					...job,
					costing: {
						laborCost: laborCost / 100,
						materialCost: materialCost / 100,
						totalCost: (laborCost + materialCost) / 100,
						revenue: totalRevenue / 100,
						profit: profit / 100,
						marginPercent: margin.toFixed(1),
					},
				},
			};
		}

		// Period summary
		const now = new Date();
		let startDate: Date;
		switch (period) {
			case "week": startDate = new Date(now.setDate(now.getDate() - 7)); break;
			case "month": startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
			case "quarter": startDate = new Date(now.setMonth(now.getMonth() - 3)); break;
			case "year": startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
		}

		const { data: jobs } = await supabase
			.from("jobs")
			.select("id, title, labor_cost, material_cost, total_amount, status, completed_at, customer:customers(display_name)")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("completed_at", startDate.toISOString())
			.order("completed_at", { ascending: false })
			.limit(limit);

		const summary = {
			totalJobs: jobs?.length || 0,
			totalRevenue: (jobs?.reduce((s, j) => s + (j.total_amount || 0), 0) || 0) / 100,
			totalLaborCost: (jobs?.reduce((s, j) => s + (j.labor_cost || 0), 0) || 0) / 100,
			totalMaterialCost: (jobs?.reduce((s, j) => s + (j.material_cost || 0), 0) || 0) / 100,
			totalProfit: 0,
			averageMargin: 0,
		};
		summary.totalProfit = summary.totalRevenue - summary.totalLaborCost - summary.totalMaterialCost;
		summary.averageMargin = summary.totalRevenue > 0 ? (summary.totalProfit / summary.totalRevenue) * 100 : 0;

		return { success: true, period, summary, jobs };
	},
});

export const getRevenueBreakdownTool = tool({
	description: "Get revenue breakdown by customer, service type, or time period",
	parameters: z.object({
		groupBy: z.enum(["customer", "service_type", "month", "week"]).default("month"),
		period: z.enum(["month", "quarter", "year"]).default("quarter"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ groupBy, period, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const now = new Date();
		let startDate: Date;
		switch (period) {
			case "month": startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
			case "quarter": startDate = new Date(now.setMonth(now.getMonth() - 3)); break;
			case "year": startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
		}

		const { data: invoices } = await supabase
			.from("invoices")
			.select("id, total_amount, paid_amount, created_at, customer:customers(id, display_name), job:jobs(service_type)")
			.eq("company_id", companyId)
			.eq("status", "paid")
			.gte("created_at", startDate.toISOString());

		// Group data
		const breakdown: Record<string, { label: string; revenue: number; count: number }> = {};

		invoices?.forEach((inv) => {
			let key = "";
			let label = "";

			if (groupBy === "customer") {
				key = inv.customer?.id || "unknown";
				label = inv.customer?.display_name || "Unknown";
			} else if (groupBy === "service_type") {
				key = inv.job?.service_type || "general";
				label = inv.job?.service_type || "General";
			} else if (groupBy === "month") {
				const date = new Date(inv.created_at);
				key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
				label = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
			} else if (groupBy === "week") {
				const date = new Date(inv.created_at);
				const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
				key = weekStart.toISOString().split("T")[0];
				label = `Week of ${weekStart.toLocaleDateString()}`;
			}

			if (!breakdown[key]) breakdown[key] = { label, revenue: 0, count: 0 };
			breakdown[key].revenue += (inv.paid_amount || 0) / 100;
			breakdown[key].count += 1;
		});

		const results = Object.values(breakdown).sort((a, b) => b.revenue - a.revenue).slice(0, limit);
		const totalRevenue = results.reduce((s, r) => s + r.revenue, 0);

		return { success: true, groupBy, period, breakdown: results, totalRevenue };
	},
});

export const getARAgingReportTool = tool({
	description: "Get accounts receivable aging report showing outstanding invoices by age (30/60/90+ days)",
	parameters: z.object({}),
	execute: async (_params, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const now = new Date();

		const { data: invoices } = await supabase
			.from("invoices")
			.select("id, invoice_number, balance_amount, due_date, created_at, customer:customers(display_name, phone, email)")
			.eq("company_id", companyId)
			.in("status", ["sent", "viewed"])
			.gt("balance_amount", 0);

		const aging = {
			current: { amount: 0, count: 0, invoices: [] as typeof invoices },
			days30: { amount: 0, count: 0, invoices: [] as typeof invoices },
			days60: { amount: 0, count: 0, invoices: [] as typeof invoices },
			days90Plus: { amount: 0, count: 0, invoices: [] as typeof invoices },
		};

		invoices?.forEach((inv) => {
			const dueDate = new Date(inv.due_date);
			const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

			if (daysOverdue <= 0) {
				aging.current.amount += inv.balance_amount;
				aging.current.count += 1;
				aging.current.invoices?.push(inv);
			} else if (daysOverdue <= 30) {
				aging.days30.amount += inv.balance_amount;
				aging.days30.count += 1;
				aging.days30.invoices?.push(inv);
			} else if (daysOverdue <= 60) {
				aging.days60.amount += inv.balance_amount;
				aging.days60.count += 1;
				aging.days60.invoices?.push(inv);
			} else {
				aging.days90Plus.amount += inv.balance_amount;
				aging.days90Plus.count += 1;
				aging.days90Plus.invoices?.push(inv);
			}
		});

		// Convert to dollars
		Object.keys(aging).forEach((key) => {
			aging[key as keyof typeof aging].amount = aging[key as keyof typeof aging].amount / 100;
		});

		const totalOutstanding = aging.current.amount + aging.days30.amount + aging.days60.amount + aging.days90Plus.amount;

		return { success: true, aging, totalOutstanding, totalInvoices: invoices?.length || 0 };
	},
});

export const getTeamPerformanceReportTool = tool({
	description: "Get team member performance metrics including jobs completed, revenue generated, and ratings",
	parameters: z.object({
		teamMemberId: z.string().uuid().optional().describe("Specific team member, or omit for all"),
		period: z.enum(["week", "month", "quarter", "year"]).default("month"),
	}),
	execute: async ({ teamMemberId, period }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const now = new Date();
		let startDate: Date;
		switch (period) {
			case "week": startDate = new Date(now.setDate(now.getDate() - 7)); break;
			case "month": startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
			case "quarter": startDate = new Date(now.setMonth(now.getMonth() - 3)); break;
			case "year": startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
		}

		let queryBuilder = supabase
			.from("jobs")
			.select("id, assigned_to, status, total_amount, completed_at")
			.eq("company_id", companyId)
			.gte("created_at", startDate.toISOString());

		if (teamMemberId) queryBuilder = queryBuilder.eq("assigned_to", teamMemberId);

		const { data: jobs } = await queryBuilder;
		const { data: teamMembers } = await supabase
			.from("team_members")
			.select("id, first_name, last_name, role")
			.eq("company_id", companyId)
			.eq("status", "active");

		// Aggregate by team member
		const performance: Record<string, {
			name: string;
			role: string;
			jobsAssigned: number;
			jobsCompleted: number;
			completionRate: number;
			revenue: number;
		}> = {};

		teamMembers?.forEach((tm) => {
			performance[tm.id] = {
				name: `${tm.first_name} ${tm.last_name}`,
				role: tm.role,
				jobsAssigned: 0,
				jobsCompleted: 0,
				completionRate: 0,
				revenue: 0,
			};
		});

		jobs?.forEach((job) => {
			if (job.assigned_to && performance[job.assigned_to]) {
				performance[job.assigned_to].jobsAssigned += 1;
				if (job.status === "completed") {
					performance[job.assigned_to].jobsCompleted += 1;
					performance[job.assigned_to].revenue += (job.total_amount || 0) / 100;
				}
			}
		});

		// Calculate completion rates
		Object.values(performance).forEach((p) => {
			p.completionRate = p.jobsAssigned > 0 ? (p.jobsCompleted / p.jobsAssigned) * 100 : 0;
		});

		const results = Object.values(performance).sort((a, b) => b.revenue - a.revenue);

		return { success: true, period, performance: results };
	},
});

export const getCustomerLifetimeValueTool = tool({
	description: "Get customer lifetime value (CLV) analysis showing total revenue and engagement per customer",
	parameters: z.object({
		customerId: z.string().uuid().optional().describe("Specific customer, or omit for top customers"),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ customerId, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		if (customerId) {
			// Single customer CLV
			const [customerResult, invoicesResult, jobsResult] = await Promise.all([
				supabase.from("customers").select("*").eq("id", customerId).eq("company_id", companyId).single(),
				supabase.from("invoices").select("total_amount, paid_amount, status, created_at").eq("customer_id", customerId),
				supabase.from("jobs").select("id, status, completed_at").eq("customer_id", customerId),
			]);

			if (customerResult.error) return { success: false, error: customerResult.error.message };

			const totalRevenue = (invoicesResult.data?.filter((i) => i.status === "paid").reduce((s, i) => s + (i.paid_amount || 0), 0) || 0) / 100;
			const jobCount = jobsResult.data?.length || 0;
			const firstInvoice = invoicesResult.data?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
			const customerSince = firstInvoice ? new Date(firstInvoice.created_at) : new Date(customerResult.data.created_at);
			const monthsAsCustomer = Math.max(1, Math.floor((Date.now() - customerSince.getTime()) / (1000 * 60 * 60 * 24 * 30)));

			return {
				success: true,
				customer: customerResult.data,
				clv: {
					totalRevenue,
					jobCount,
					averageJobValue: jobCount > 0 ? totalRevenue / jobCount : 0,
					customerSince: customerSince.toISOString(),
					monthsAsCustomer,
					monthlyAverageRevenue: totalRevenue / monthsAsCustomer,
				},
			};
		}

		// Top customers by CLV
		const { data: customers } = await supabase
			.from("customers")
			.select("id, display_name, total_revenue, job_count, created_at")
			.eq("company_id", companyId)
			.eq("status", "active")
			.order("total_revenue", { ascending: false })
			.limit(limit);

		const clvData = customers?.map((c) => ({
			...c,
			totalRevenue: (c.total_revenue || 0) / 100,
			averageJobValue: c.job_count > 0 ? (c.total_revenue || 0) / 100 / c.job_count : 0,
		}));

		return { success: true, topCustomers: clvData };
	},
});

// ============================================================================
// ESTIMATE & CONTRACT TOOLS
// ============================================================================

export const searchEstimatesTool = tool({
	description: "Search for estimates by customer, status, or amount",
	parameters: z.object({
		query: z.string().optional(),
		status: z.enum(["draft", "sent", "viewed", "approved", "rejected", "expired"]).optional(),
		customerId: z.string().uuid().optional(),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ query, status, customerId, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("estimates")
			.select("id, estimate_number, title, status, total_amount, valid_until, customer:customers(display_name)")
			.eq("company_id", companyId);

		if (query) queryBuilder = queryBuilder.ilike("estimate_number", `%${query}%`);
		if (status) queryBuilder = queryBuilder.eq("status", status);
		if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);

		const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, estimates: data, count: data?.length || 0 };
	},
});

export const searchContractsTool = tool({
	description: "Search for contracts by customer, status, or type",
	parameters: z.object({
		query: z.string().optional(),
		status: z.enum(["draft", "sent", "active", "expired", "cancelled"]).optional(),
		customerId: z.string().uuid().optional(),
		limit: z.number().optional().default(20),
	}),
	execute: async ({ query, status, customerId, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		let queryBuilder = supabase
			.from("contracts")
			.select("id, contract_number, title, status, total_value, start_date, end_date, customer:customers(display_name)")
			.eq("company_id", companyId);

		if (query) queryBuilder = queryBuilder.ilike("contract_number", `%${query}%`);
		if (status) queryBuilder = queryBuilder.eq("status", status);
		if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);

		const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(limit);

		if (error) return { success: false, error: error.message };
		return { success: true, contracts: data, count: data?.length || 0 };
	},
});

// ============================================================================
// EXPORT ALL TOOLS
// ============================================================================

export const aiAgentTools = {
	// Universal Database Access tools
	listDatabaseTables: listDatabaseTablesTool,
	queryDatabase: queryDatabaseTool,
	getRecordById: getRecordByIdTool,
	getRelatedRecords: getRelatedRecordsTool,
	getCompanyOverview: getCompanyOverviewTool,
	searchAllEntities: searchAllEntitesTool,

	// Customer tools
	searchCustomers: searchCustomersTool,
	getCustomerDetails: getCustomerDetailsTool,
	createCustomer: createCustomerTool,
	updateCustomer: updateCustomerTool,

	// Team Member tools
	searchTeamMembers: searchTeamMembersTool,
	getTeamMemberDetails: getTeamMemberDetailsTool,
	sendTeamEmail: sendTeamEmailTool,
	sendTeamSms: sendTeamSmsTool,

	// Vendor tools
	searchVendors: searchVendorsTool,
	getVendorDetails: getVendorDetailsTool,
	sendVendorEmail: sendVendorEmailTool,
	sendVendorSms: sendVendorSmsTool,

	// Property & Equipment tools
	searchProperties: searchPropertiesTool,
	getPropertyDetails: getPropertyDetailsTool,
	searchEquipment: searchEquipmentTool,
	getMaintenanceDue: getMaintenanceDueTool,

	// Job/Scheduling tools
	searchJobs: searchJobsTool,
	createAppointment: createAppointmentTool,
	getAvailableSlots: getAvailableSlotsTool,

	// Invoice/Financial tools
	searchInvoices: searchInvoicesTool,
	createInvoice: createInvoiceTool,
	getFinancialSummary: getFinancialSummaryTool,
	getVirtualBuckets: getVirtualBucketsTool,
	transferToBucket: transferToBucketTool,

	// Communication tools
	sendEmail: sendEmailTool,
	sendSms: sendSmsTool,
	initiateCall: initiateCallTool,
	getCommunicationHistory: getCommunicationHistoryTool,

	// Reminder/Notification tools
	scheduleReminder: scheduleReminderTool,
	cancelReminder: cancelReminderTool,
	getScheduledReminders: getScheduledRemindersTool,
	sendImmediateNotification: sendImmediateNotificationTool,

	// Enhanced Reporting tools
	getJobCostingReport: getJobCostingReportTool,
	getRevenueBreakdown: getRevenueBreakdownTool,
	getARAgingReport: getARAgingReportTool,
	getTeamPerformanceReport: getTeamPerformanceReportTool,
	getCustomerLifetimeValue: getCustomerLifetimeValueTool,
	getDashboardMetrics: getDashboardMetricsTool,
	getProactiveInsights: getProactiveInsightsTool,

	// Estimate & Contract tools
	searchEstimates: searchEstimatesTool,
	searchContracts: searchContractsTool,
};

// Tool category mapping for permission checking
export const toolCategories: Record<string, ToolCategory> = {
	// Universal Database Access (read-only, reporting category)
	listDatabaseTables: "reporting",
	queryDatabase: "reporting",
	getRecordById: "reporting",
	getRelatedRecords: "reporting",
	getCompanyOverview: "reporting",
	searchAllEntities: "reporting",

	// Customer
	searchCustomers: "customer",
	getCustomerDetails: "customer",
	createCustomer: "customer",
	updateCustomer: "customer",

	// Team
	searchTeamMembers: "team",
	getTeamMemberDetails: "team",
	sendTeamEmail: "team",
	sendTeamSms: "team",

	// Vendor
	searchVendors: "vendor",
	getVendorDetails: "vendor",
	sendVendorEmail: "vendor",
	sendVendorSms: "vendor",

	// Property & Equipment
	searchProperties: "property",
	getPropertyDetails: "property",
	searchEquipment: "equipment",
	getMaintenanceDue: "equipment",

	// Scheduling
	searchJobs: "scheduling",
	createAppointment: "scheduling",
	getAvailableSlots: "scheduling",

	// Financial
	searchInvoices: "financial",
	createInvoice: "financial",
	getFinancialSummary: "reporting",
	getVirtualBuckets: "financial",
	transferToBucket: "financial",

	// Communication
	sendEmail: "communication",
	sendSms: "communication",
	initiateCall: "communication",
	getCommunicationHistory: "communication",

	// Notifications
	scheduleReminder: "notification",
	cancelReminder: "notification",
	getScheduledReminders: "notification",
	sendImmediateNotification: "notification",

	// Reporting
	getJobCostingReport: "reporting",
	getRevenueBreakdown: "reporting",
	getARAgingReport: "reporting",
	getTeamPerformanceReport: "reporting",
	getCustomerLifetimeValue: "reporting",
	getDashboardMetrics: "reporting",
	getProactiveInsights: "reporting",

	// Estimates & Contracts
	searchEstimates: "financial",
	searchContracts: "financial",
};

// ============================================================================
// DESTRUCTIVE TOOLS - Require Owner Approval
// These tools perform actions that cannot be easily undone or have significant impact
// ============================================================================

export type DestructiveActionType =
	| "delete"
	| "bulk_update"
	| "bulk_delete"
	| "archive"
	| "financial"
	| "send_communication";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface DestructiveToolMetadata {
	isDestructive: true;
	actionType: DestructiveActionType;
	riskLevel: RiskLevel;
	requiresOwnerApproval: boolean;
	description: string;
	affectedEntityType: string;
}

// ============================================================================
// SEMANTIC MEMORY TOOLS
// ============================================================================

/**
 * Store a fact or preference about an entity (customer, job, property, etc.)
 * This enables long-term semantic memory across conversations.
 */
export const storeMemoryTool = tool({
	description: "Store a fact, preference, or important information about an entity (customer, job, property, etc.) for future reference. Use this to remember important details that should persist across conversations.",
	parameters: z.object({
		content: z.string().describe("The fact or information to remember"),
		memoryType: z.enum(["fact", "preference", "interaction", "context", "entity", "procedure", "feedback"]).describe("Type of memory"),
		entityType: z.enum(["customer", "job", "property", "equipment", "invoice", "estimate", "team_member"]).optional().describe("Type of entity this memory relates to"),
		entityId: z.string().uuid().optional().describe("ID of the related entity"),
		importance: z.enum(["low", "medium", "high"]).default("medium").describe("How important is this memory"),
		tags: z.array(z.string()).optional().describe("Tags to categorize the memory"),
	}),
	execute: async ({ content, memoryType, entityType, entityId, importance, tags }, { companyId, userId }: { companyId: string; userId?: string }) => {
		const { storeMemory } = await import("./memory-service");

		const importanceScore = { low: 0.3, medium: 0.6, high: 0.9 }[importance];

		const memoryId = await storeMemory(companyId, userId || "system", {
			content,
			memoryType,
			entityType,
			entityId,
			importance: importanceScore,
			tags,
			sourceType: "agent",
		});

		return {
			success: true,
			message: `Memory stored successfully`,
			memoryId,
			summary: `Remembered: "${content.substring(0, 50)}..."`,
		};
	},
});

/**
 * Search semantic memories using natural language
 */
export const searchMemoriesTool = tool({
	description: "Search through stored memories using natural language. Use this to recall facts, preferences, or context about customers, jobs, or other entities.",
	parameters: z.object({
		query: z.string().describe("Natural language search query (e.g., 'customer preferences for Johnson family')"),
		entityType: z.enum(["customer", "job", "property", "equipment", "invoice", "estimate", "team_member"]).optional().describe("Filter to specific entity type"),
		entityId: z.string().uuid().optional().describe("Filter to specific entity"),
		memoryTypes: z.array(z.enum(["fact", "preference", "interaction", "context", "entity", "procedure", "feedback"])).optional().describe("Filter by memory types"),
		limit: z.number().optional().default(5).describe("Max memories to return"),
	}),
	execute: async ({ query, entityType, entityId, memoryTypes, limit }, { companyId }: { companyId: string }) => {
		const { searchMemories } = await import("./memory-service");

		const results = await searchMemories(companyId, query, {
			entityType,
			entityId,
			memoryTypes,
			limit,
			minSimilarity: 0.5,
		});

		if (results.length === 0) {
			return {
				success: true,
				message: "No relevant memories found",
				memories: [],
			};
		}

		return {
			success: true,
			message: `Found ${results.length} relevant memories`,
			memories: results.map(m => ({
				content: m.content,
				type: m.memoryType,
				relevance: Math.round(m.similarity * 100) + "%",
				entityType: m.entityType,
				createdAt: m.createdAt,
			})),
		};
	},
});

/**
 * Get all memories for a specific entity
 */
export const getEntityMemoriesTool = tool({
	description: "Retrieve all stored memories about a specific entity (customer, job, property, etc.). Use this before interacting with a customer or job to get full context.",
	parameters: z.object({
		entityType: z.enum(["customer", "job", "property", "equipment", "invoice", "estimate", "team_member"]).describe("Type of entity"),
		entityId: z.string().uuid().describe("Entity ID"),
		memoryTypes: z.array(z.enum(["fact", "preference", "interaction", "context", "entity", "procedure", "feedback"])).optional().describe("Filter by memory types"),
		limit: z.number().optional().default(20).describe("Max memories to return"),
	}),
	execute: async ({ entityType, entityId, memoryTypes, limit }, { companyId }: { companyId: string }) => {
		const { getEntityMemories } = await import("./memory-service");

		const memories = await getEntityMemories(companyId, entityType, entityId, {
			types: memoryTypes,
			limit,
		});

		if (memories.length === 0) {
			return {
				success: true,
				message: `No memories stored for this ${entityType}`,
				memories: [],
			};
		}

		// Group by type for better presentation
		const grouped: Record<string, Array<{ content: string; importance: number }>> = {};
		for (const m of memories) {
			if (!grouped[m.memory_type]) grouped[m.memory_type] = [];
			grouped[m.memory_type].push({
				content: m.content,
				importance: m.importance,
			});
		}

		return {
			success: true,
			message: `Found ${memories.length} memories for ${entityType}`,
			memoriesByType: grouped,
			totalCount: memories.length,
		};
	},
});

/**
 * Recall relevant context for current conversation
 */
export const recallContextTool = tool({
	description: "Automatically recall relevant memories and context based on what's being discussed. Use this at the start of conversations or when switching topics to get background information.",
	parameters: z.object({
		topic: z.string().describe("The current topic or context (e.g., 'scheduling job for Smith residence', 'invoice payment issue')"),
		customerName: z.string().optional().describe("Customer name if known"),
		jobId: z.string().uuid().optional().describe("Job ID if discussing a specific job"),
	}),
	execute: async ({ topic, customerName, jobId }, { companyId }: { companyId: string }) => {
		const { searchMemories } = await import("./memory-service");
		const supabase = createServiceSupabaseClient();

		const context: {
			memories: Array<{ content: string; type: string; relevance: string }>;
			customer?: { id: string; name: string; notes?: string };
			job?: { id: string; title: string; status: string };
		} = {
			memories: [],
		};

		// Search for relevant memories
		const memories = await searchMemories(companyId, topic, {
			limit: 5,
			minSimilarity: 0.4,
		});

		context.memories = memories.map(m => ({
			content: m.content,
			type: m.memoryType,
			relevance: Math.round(m.similarity * 100) + "%",
		}));

		// If customer name provided, try to find them
		if (customerName) {
			const { data: customer } = await supabase
				.from("customers")
				.select("id, name, notes")
				.eq("company_id", companyId)
				.ilike("name", `%${customerName}%`)
				.limit(1)
				.single();

			if (customer) {
				context.customer = customer;

				// Get customer-specific memories
				const customerMemories = await searchMemories(companyId, `${customerName} customer preferences`, {
					entityType: "customer",
					entityId: customer.id,
					limit: 3,
				});

				for (const m of customerMemories) {
					if (!context.memories.some(cm => cm.content === m.content)) {
						context.memories.push({
							content: m.content,
							type: m.memoryType,
							relevance: Math.round(m.similarity * 100) + "%",
						});
					}
				}
			}
		}

		// If job ID provided, get job details
		if (jobId) {
			const { data: job } = await supabase
				.from("jobs")
				.select("id, title, status, description")
				.eq("id", jobId)
				.eq("company_id", companyId)
				.single();

			if (job) {
				context.job = { id: job.id, title: job.title, status: job.status };
			}
		}

		return {
			success: true,
			topic,
			context,
			summary: context.memories.length > 0
				? `Found ${context.memories.length} relevant memories for context`
				: "No specific memories found, but retrieved available entity info",
		};
	},
});

// ============================================================================
// COMMUNICATION LEARNING TOOLS
// ============================================================================

/**
 * Search across all communications (calls, emails, SMS) using full-text search
 */
export const searchCommunicationsFullTextTool = tool({
	description: "Search across all customer communications (calls, emails, SMS) to find specific conversations, topics, or issues discussed. Great for finding 'what did the customer say about...'",
	parameters: z.object({
		query: z.string().describe("Search query (e.g., 'water heater issue', 'preferred time morning')"),
		channel: z.enum(["email", "sms", "call", "all"]).optional().default("all").describe("Filter by communication channel"),
		customerId: z.string().uuid().optional().describe("Filter to specific customer"),
		direction: z.enum(["inbound", "outbound", "all"]).optional().default("all").describe("Filter by direction"),
		limit: z.number().optional().default(10).describe("Max results"),
	}),
	execute: async ({ query, channel, customerId, direction, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		let dbQuery = supabase
			.from("communications")
			.select(`
				id, type, channel, direction, subject, body_plain,
				call_transcript, call_sentiment, from_name, to_name,
				customer_id, created_at,
				customer:customers(id, name)
			`)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(limit);

		// Apply filters
		if (channel !== "all") {
			dbQuery = dbQuery.eq("channel", channel);
		}
		if (customerId) {
			dbQuery = dbQuery.eq("customer_id", customerId);
		}
		if (direction !== "all") {
			dbQuery = dbQuery.eq("direction", direction);
		}

		// Full-text search on body and transcript
		dbQuery = dbQuery.or(`body_plain.ilike.%${query}%,call_transcript.ilike.%${query}%,subject.ilike.%${query}%`);

		const { data, error } = await dbQuery;

		if (error) return { success: false, error: error.message };

		return {
			success: true,
			message: `Found ${data?.length || 0} communications matching "${query}"`,
			results: data?.map(c => ({
				id: c.id,
				channel: c.channel,
				direction: c.direction,
				subject: c.subject,
				preview: (c.body_plain || c.call_transcript || "").substring(0, 200),
				sentiment: c.call_sentiment,
				customerName: c.customer?.name,
				date: c.created_at,
			})),
		};
	},
});

/**
 * Get call transcript with AI-extracted insights
 */
export const getCallTranscriptTool = tool({
	description: "Get the full transcript of a phone call along with extracted insights. Use when you need to review what was discussed in a specific call.",
	parameters: z.object({
		communicationId: z.string().uuid().describe("The communication ID of the call"),
	}),
	execute: async ({ communicationId }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		const { data, error } = await supabase
			.from("communications")
			.select(`
				id, type, channel, direction, call_duration, call_transcript,
				call_sentiment, call_recording_url, from_name, to_name,
				customer_id, created_at,
				customer:customers(id, name, email, phone)
			`)
			.eq("id", communicationId)
			.eq("company_id", companyId)
			.single();

		if (error) return { success: false, error: error.message };
		if (!data?.call_transcript) {
			return { success: false, error: "No transcript available for this communication" };
		}

		return {
			success: true,
			call: {
				id: data.id,
				direction: data.direction,
				duration: data.call_duration ? `${Math.floor(data.call_duration / 60)}m ${data.call_duration % 60}s` : "Unknown",
				sentiment: data.call_sentiment,
				customerName: data.customer?.name,
				date: data.created_at,
				transcript: data.call_transcript,
				hasRecording: !!data.call_recording_url,
			},
		};
	},
});

/**
 * Search voicemail transcriptions
 */
export const searchVoicemailTranscriptsTool = tool({
	description: "Search through voicemail transcriptions to find messages about specific topics or from specific customers.",
	parameters: z.object({
		query: z.string().optional().describe("Search query for transcription content"),
		customerId: z.string().uuid().optional().describe("Filter to specific customer"),
		urgentOnly: z.boolean().optional().default(false).describe("Only show urgent voicemails"),
		unreadOnly: z.boolean().optional().default(false).describe("Only show unread voicemails"),
		limit: z.number().optional().default(10).describe("Max results"),
	}),
	execute: async ({ query, customerId, urgentOnly, unreadOnly, limit }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();

		let dbQuery = supabase
			.from("voicemails")
			.select(`
				id, from_number, duration, transcription, transcription_confidence,
				is_read, is_urgent, received_at, customer_id,
				customer:customers(id, name)
			`)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("received_at", { ascending: false })
			.limit(limit);

		if (customerId) {
			dbQuery = dbQuery.eq("customer_id", customerId);
		}
		if (urgentOnly) {
			dbQuery = dbQuery.eq("is_urgent", true);
		}
		if (unreadOnly) {
			dbQuery = dbQuery.eq("is_read", false);
		}
		if (query) {
			dbQuery = dbQuery.ilike("transcription", `%${query}%`);
		}

		const { data, error } = await dbQuery;

		if (error) return { success: false, error: error.message };

		return {
			success: true,
			message: `Found ${data?.length || 0} voicemails`,
			voicemails: data?.map(v => ({
				id: v.id,
				from: v.from_number,
				customerName: v.customer?.name,
				duration: v.duration ? `${Math.floor(v.duration / 60)}m ${v.duration % 60}s` : "Unknown",
				transcription: v.transcription,
				confidence: v.transcription_confidence,
				isUrgent: v.is_urgent,
				isRead: v.is_read,
				receivedAt: v.received_at,
			})),
		};
	},
});

/**
 * Get all recent communications for a customer
 */
export const getCustomerCommunicationHistoryTool = tool({
	description: "Get the complete communication history for a customer including calls, emails, SMS, and voicemails. Use this to understand the full context of a customer relationship.",
	parameters: z.object({
		customerId: z.string().uuid().describe("Customer UUID"),
		days: z.number().optional().default(90).describe("Look back this many days"),
		includeTranscripts: z.boolean().optional().default(false).describe("Include full call transcripts"),
	}),
	execute: async ({ customerId, days, includeTranscripts }, { companyId }: { companyId: string }) => {
		const supabase = createServiceSupabaseClient();
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		// Get communications
		const { data: comms, error: commsError } = await supabase
			.from("communications")
			.select(`
				id, type, channel, direction, subject, body_plain,
				call_transcript, call_sentiment, call_duration,
				from_name, to_name, created_at, status
			`)
			.eq("company_id", companyId)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.gte("created_at", cutoffDate.toISOString())
			.order("created_at", { ascending: false });

		// Get voicemails
		const { data: voicemails, error: vmError } = await supabase
			.from("voicemails")
			.select("id, from_number, duration, transcription, is_urgent, received_at")
			.eq("company_id", companyId)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.gte("received_at", cutoffDate.toISOString())
			.order("received_at", { ascending: false });

		if (commsError) return { success: false, error: commsError.message };

		// Summarize by channel
		const summary = {
			emails: comms?.filter(c => c.channel === "email").length || 0,
			calls: comms?.filter(c => c.channel === "call").length || 0,
			sms: comms?.filter(c => c.channel === "sms").length || 0,
			voicemails: voicemails?.length || 0,
		};

		return {
			success: true,
			customerId,
			period: `Last ${days} days`,
			summary,
			communications: comms?.map(c => ({
				id: c.id,
				channel: c.channel,
				direction: c.direction,
				subject: c.subject,
				preview: includeTranscripts
					? (c.body_plain || c.call_transcript || "").substring(0, 500)
					: (c.body_plain || c.call_transcript || "").substring(0, 100),
				sentiment: c.call_sentiment,
				date: c.created_at,
			})),
			voicemails: voicemails?.map(v => ({
				id: v.id,
				duration: v.duration,
				transcription: v.transcription?.substring(0, 200),
				isUrgent: v.is_urgent,
				date: v.received_at,
			})),
		};
	},
});

/**
 * Extract and store insights from a communication
 */
export const extractCommunicationInsightsTool = tool({
	description: "Analyze a communication (call, email, SMS) and extract key insights like customer preferences, issues, sentiment. Automatically stores insights in memory for future reference.",
	parameters: z.object({
		communicationId: z.string().uuid().describe("Communication ID to analyze"),
		insightTypes: z.array(z.enum(["preference", "issue", "sentiment", "action_item", "feedback"])).optional().describe("Types of insights to extract"),
	}),
	execute: async ({ communicationId, insightTypes }, { companyId, userId }: { companyId: string; userId?: string }) => {
		const supabase = createServiceSupabaseClient();

		// Get the communication
		const { data: comm, error } = await supabase
			.from("communications")
			.select(`
				id, channel, direction, subject, body_plain, call_transcript,
				call_sentiment, customer_id,
				customer:customers(id, name)
			`)
			.eq("id", communicationId)
			.eq("company_id", companyId)
			.single();

		if (error || !comm) {
			return { success: false, error: "Communication not found" };
		}

		const content = comm.body_plain || comm.call_transcript || "";
		if (!content) {
			return { success: false, error: "No content to analyze" };
		}

		// Extract insights using pattern matching (basic implementation)
		const insights: Array<{ type: string; content: string; importance: string }> = [];

		// Look for preferences (morning, afternoon, specific days, etc.)
		const preferencePatterns = [
			/prefer[s]?\s+(morning|afternoon|evening|weekend|monday|tuesday|wednesday|thursday|friday)/gi,
			/best\s+time[s]?\s+(?:is|are|would be)\s+([^.]+)/gi,
			/don'?t\s+(?:like|want|prefer)\s+([^.]+)/gi,
		];

		for (const pattern of preferencePatterns) {
			const matches = content.matchAll(pattern);
			for (const match of matches) {
				insights.push({
					type: "preference",
					content: `Customer prefers: ${match[0]}`,
					importance: "medium",
				});
			}
		}

		// Look for issues/complaints
		const issuePatterns = [
			/problem[s]?\s+with\s+([^.]+)/gi,
			/issue[s]?\s+with\s+([^.]+)/gi,
			/not\s+working\s+([^.]+)/gi,
			/broken\s+([^.]+)/gi,
		];

		for (const pattern of issuePatterns) {
			const matches = content.matchAll(pattern);
			for (const match of matches) {
				insights.push({
					type: "issue",
					content: `Reported issue: ${match[0]}`,
					importance: "high",
				});
			}
		}

		// Store insights in memory if customer is linked
		if (comm.customer_id && insights.length > 0) {
			const { storeMemory } = await import("./memory-service");

			for (const insight of insights) {
				await storeMemory(companyId, userId || "system", {
					content: insight.content,
					memoryType: insight.type as "preference" | "feedback",
					entityType: "customer",
					entityId: comm.customer_id,
					importance: insight.importance === "high" ? 0.9 : 0.6,
					sourceType: "communication",
					sourceChatId: communicationId,
				});
			}
		}

		return {
			success: true,
			communicationId,
			channel: comm.channel,
			customerName: comm.customer?.name,
			extractedInsights: insights,
			storedToMemory: insights.length > 0 && !!comm.customer_id,
			sentiment: comm.call_sentiment,
		};
	},
});

// =============================================================================
// EXTERNAL DATA TOOLS - Weather, Traffic, GPS, Maps
// =============================================================================

/**
 * Get weather forecast and alerts for a location
 *
 * Uses the NWS (National Weather Service) API to get:
 * - 7-day forecast
 * - Hourly forecast
 * - Active weather alerts
 * - Severe weather warnings
 */
export const getWeatherForLocationTool = tool({
	description: `Get weather forecast and alerts for a specific location. Provides 7-day forecast, hourly conditions, and any active weather alerts. Use this when:
- Scheduling outdoor jobs
- Checking if weather is suitable for work
- Planning technician routes
- Informing customers about weather delays

Returns forecast periods, temperature, wind, precipitation chances, and any severe weather alerts.`,
	parameters: z.object({
		lat: z.number().describe("Latitude of the location"),
		lon: z.number().describe("Longitude of the location"),
		includeHourly: z
			.boolean()
			.optional()
			.default(true)
			.describe("Include hourly forecast for next 24 hours"),
	}),
	execute: async ({ lat, lon, includeHourly }) => {
		const { weatherService } = await import("../services/weather-service");

		const weather = await weatherService.getWeatherData(lat, lon);

		if (!weather) {
			return {
				success: false,
				error: "Unable to fetch weather data for this location",
			};
		}

		return {
			success: true,
			location: weather.location,
			currentConditions: weather.hourly?.periods?.[0] || null,
			forecast: weather.forecast?.periods?.slice(0, 7) || [],
			hourly: includeHourly
				? weather.hourly?.periods?.slice(0, 12) || []
				: [],
			alerts: weather.alerts,
			hasActiveAlerts: weather.hasActiveAlerts,
			highestSeverity: weather.highestSeverity,
			enrichedAt: weather.enrichedAt,
		};
	},
});

/**
 * Check if weather is suitable for outdoor work
 *
 * Analyzes weather conditions and alerts to determine if
 * it's safe and practical to do outdoor work
 */
export const checkWeatherForJobTool = tool({
	description: `Check if weather conditions are suitable for outdoor field service work at a specific location. Considers:
- Severe weather alerts
- Precipitation (rain, snow, storms)
- Extreme temperatures (freezing or excessive heat)
- Wind conditions

Returns a clear recommendation on whether to proceed with outdoor work.`,
	parameters: z.object({
		lat: z.number().describe("Latitude of the job location"),
		lon: z.number().describe("Longitude of the job location"),
		jobType: z
			.string()
			.optional()
			.describe("Type of job (e.g., 'roofing', 'HVAC outdoor', 'landscaping')"),
	}),
	execute: async ({ lat, lon, jobType }) => {
		const { weatherService } = await import("../services/weather-service");

		const weather = await weatherService.getWeatherData(lat, lon);

		if (!weather) {
			return {
				success: false,
				suitable: null,
				error: "Unable to fetch weather data",
			};
		}

		const suitability = weatherService.isSuitableForOutdoorWork(weather);

		return {
			success: true,
			suitable: suitability.suitable,
			reason: suitability.reason || "Weather conditions are acceptable for outdoor work",
			currentConditions: weather.hourly?.periods?.[0]
				? {
						temperature: weather.hourly.periods[0].temperature,
						temperatureUnit: weather.hourly.periods[0].temperatureUnit,
						shortForecast: weather.hourly.periods[0].shortForecast,
						windSpeed: weather.hourly.periods[0].windSpeed,
					}
				: null,
			alerts: weather.alerts.map((a) => ({
				event: a.event,
				severity: a.severity,
				headline: a.headline,
			})),
			jobType,
			recommendation: suitability.suitable
				? "Proceed with outdoor work"
				: `Consider rescheduling: ${suitability.reason}`,
		};
	},
});

/**
 * Get active weather alerts only (faster than full forecast)
 */
export const getWeatherAlertsTool = tool({
	description: `Quickly check for active weather alerts at a location without fetching the full forecast. Use this for:
- Quick safety checks
- Emergency notifications
- Batch checking multiple job sites

Returns only alert information (faster than full weather data).`,
	parameters: z.object({
		lat: z.number().describe("Latitude"),
		lon: z.number().describe("Longitude"),
	}),
	execute: async ({ lat, lon }) => {
		const { weatherService } = await import("../services/weather-service");

		const alerts = await weatherService.getActiveAlerts(lat, lon);

		return {
			success: true,
			hasAlerts: alerts.length > 0,
			alertCount: alerts.length,
			alerts: alerts.map((a) => ({
				event: a.event,
				severity: a.severity,
				urgency: a.urgency,
				headline: a.headline,
				instruction: a.instruction,
				expires: a.expires,
			})),
		};
	},
});

/**
 * Get traffic conditions and incidents along a route
 *
 * Uses Google Maps API to check for traffic incidents,
 * construction, accidents, and congestion
 */
export const getTrafficConditionsTool = tool({
	description: `Get real-time traffic conditions and incidents near a job location or along a route. Detects:
- Traffic accidents/crashes
- Road construction
- Road closures
- Police activity
- Congestion levels

Useful for:
- Planning technician dispatch
- Estimating arrival times
- Routing around incidents
- Notifying customers of delays`,
	parameters: z.object({
		destinationLat: z.number().describe("Latitude of the destination/job site"),
		destinationLon: z.number().describe("Longitude of the destination/job site"),
		originLat: z
			.number()
			.optional()
			.describe("Latitude of origin (e.g., shop/office) to check route"),
		originLon: z
			.number()
			.optional()
			.describe("Longitude of origin to check route"),
	}),
	execute: async ({ destinationLat, destinationLon, originLat, originLon }) => {
		const { trafficService } = await import("../services/traffic-service");

		const traffic = await trafficService.getTrafficIncidents(
			destinationLat,
			destinationLon,
			originLat,
			originLon
		);

		if (!traffic) {
			return {
				success: false,
				error: "Unable to fetch traffic data. Check Google Maps API configuration.",
			};
		}

		return {
			success: true,
			totalIncidents: traffic.totalIncidents,
			nearbyIncidents: traffic.nearbyIncidents,
			routeAffectingIncidents: traffic.routeAffectingIncidents,
			incidents: traffic.incidents.map((i) => ({
				type: i.type,
				severity: i.severity,
				description: i.description,
				distance: i.distance,
				affectsRoute: i.affectsRoute,
			})),
			recommendation:
				traffic.routeAffectingIncidents > 0
					? `${traffic.routeAffectingIncidents} incident(s) may affect travel time`
					: "No significant traffic issues detected",
			enrichedAt: traffic.enrichedAt,
		};
	},
});

/**
 * Geocode an address to GPS coordinates
 *
 * Converts a street address to latitude/longitude coordinates
 */
export const geocodeAddressTool = tool({
	description: `Convert a street address to GPS coordinates (latitude/longitude). Use this when:
- You have an address but need coordinates for weather/traffic lookup
- Verifying an address is valid
- Getting standardized/formatted address

Returns coordinates and Google's formatted version of the address.`,
	parameters: z.object({
		address: z.string().describe("Street address (e.g., '123 Main St')"),
		city: z.string().describe("City name"),
		state: z.string().describe("State (e.g., 'CA' or 'California')"),
		zipCode: z.string().describe("ZIP code"),
		country: z.string().optional().default("USA").describe("Country (defaults to USA)"),
	}),
	execute: async ({ address, city, state, zipCode, country }) => {
		const { geocodeAddressSilent } = await import("../maps/geocoding");

		const result = await geocodeAddressSilent(address, city, state, zipCode, country);

		if (!result) {
			return {
				success: false,
				error: "Unable to geocode address. The address may be invalid or geocoding service unavailable.",
			};
		}

		return {
			success: true,
			coordinates: {
				lat: result.lat,
				lon: result.lon,
			},
			formattedAddress: result.formattedAddress,
		};
	},
});

/**
 * Get property weather and conditions summary
 *
 * Combines multiple data sources to give a complete picture
 * of conditions at a property/job site
 */
export const getPropertyConditionsTool = tool({
	description: `Get a comprehensive conditions summary for a property/job site including weather, traffic, and alerts. This is the "one-stop" tool for checking all external conditions before dispatching or scheduling.

Combines:
- Current and forecast weather
- Weather alerts
- Traffic conditions (if shop coordinates provided)
- Work suitability assessment`,
	parameters: z.object({
		propertyLat: z.number().describe("Latitude of the property"),
		propertyLon: z.number().describe("Longitude of the property"),
		shopLat: z.number().optional().describe("Shop/office latitude for traffic routing"),
		shopLon: z.number().optional().describe("Shop/office longitude for traffic routing"),
		jobType: z
			.string()
			.optional()
			.describe("Type of job being performed (for work suitability)"),
	}),
	execute: async ({ propertyLat, propertyLon, shopLat, shopLon, jobType }) => {
		const { weatherService } = await import("../services/weather-service");
		const { trafficService } = await import("../services/traffic-service");

		// Fetch weather and traffic in parallel
		const [weather, traffic] = await Promise.all([
			weatherService.getWeatherData(propertyLat, propertyLon),
			shopLat && shopLon
				? trafficService.getTrafficIncidents(propertyLat, propertyLon, shopLat, shopLon)
				: Promise.resolve(null),
		]);

		const result: Record<string, unknown> = {
			success: true,
			propertyLocation: { lat: propertyLat, lon: propertyLon },
		};

		// Weather conditions
		if (weather) {
			const suitability = weatherService.isSuitableForOutdoorWork(weather);
			result.weather = {
				current: weather.hourly?.periods?.[0]
					? {
							temperature: weather.hourly.periods[0].temperature,
							temperatureUnit: weather.hourly.periods[0].temperatureUnit,
							conditions: weather.hourly.periods[0].shortForecast,
							wind: weather.hourly.periods[0].windSpeed,
						}
					: null,
				forecast: weather.forecast?.periods?.slice(0, 3).map((p) => ({
					name: p.name,
					temperature: p.temperature,
					shortForecast: p.shortForecast,
				})),
				alerts: weather.alerts.map((a) => ({
					event: a.event,
					severity: a.severity,
					headline: a.headline,
				})),
				hasAlerts: weather.hasActiveAlerts,
				highestAlertSeverity: weather.highestSeverity,
			};
			result.workSuitability = {
				suitable: suitability.suitable,
				reason: suitability.reason || "Conditions acceptable",
				jobType,
			};
		} else {
			result.weather = { error: "Weather data unavailable" };
			result.workSuitability = { suitable: null, reason: "Unable to assess" };
		}

		// Traffic conditions
		if (traffic) {
			result.traffic = {
				totalIncidents: traffic.totalIncidents,
				routeAffecting: traffic.routeAffectingIncidents,
				incidents: traffic.incidents.slice(0, 5).map((i) => ({
					type: i.type,
					severity: i.severity,
					description: i.description,
				})),
			};
		} else if (shopLat && shopLon) {
			result.traffic = { error: "Traffic data unavailable" };
		}

		// Overall recommendation
		const issues: string[] = [];
		if (weather?.hasActiveAlerts) {
			issues.push(`Weather alert: ${weather.highestSeverity}`);
		}
		if (weather && !weatherService.isSuitableForOutdoorWork(weather).suitable) {
			issues.push("Weather not suitable for outdoor work");
		}
		if (traffic && traffic.routeAffectingIncidents > 0) {
			issues.push(`${traffic.routeAffectingIncidents} traffic incident(s) on route`);
		}

		result.overallStatus = issues.length === 0 ? "good" : "caution";
		result.issues = issues;
		result.recommendation =
			issues.length === 0
				? "Conditions look good for this job"
				: `Review before proceeding: ${issues.join("; ")}`;

		return result;
	},
});

// =============================================================================
// CODE SEARCH TOOLS - Building, Plumbing, Electrical Codes
// =============================================================================

/**
 * Common building code references by trade type
 * This is a knowledge base that can be enhanced with actual API integrations
 */
const codeReferences = {
	plumbing: {
		name: "Uniform Plumbing Code (UPC) / International Plumbing Code (IPC)",
		commonRequirements: [
			"Drain pipe slope: 1/4 inch per foot minimum",
			"Vent pipes must extend through roof",
			"P-traps required on all fixtures",
			"Water heater T&P relief valve required",
			"Backflow prevention on potable water",
			"Minimum fixture unit calculations for pipe sizing",
			"Air gap requirements for indirect waste",
		],
		permitTriggers: [
			"New water heater installation",
			"Moving or adding fixtures",
			"New water/sewer line connections",
			"Gas line work",
			"Sewer line replacement",
		],
	},
	electrical: {
		name: "National Electrical Code (NEC)",
		commonRequirements: [
			"GFCI required in kitchens, bathrooms, garages, outdoors",
			"AFCI required in bedrooms and living areas",
			"Smoke detectors on every floor and bedroom",
			"Panel accessibility clearance: 36 inches",
			"Wire sizing based on amperage load",
			"Grounding requirements for all circuits",
			"Box fill calculations for junction boxes",
		],
		permitTriggers: [
			"New circuits or subpanels",
			"Service upgrade",
			"Adding outlets or switches",
			"Electric vehicle charger installation",
			"Generator installation",
		],
	},
	hvac: {
		name: "International Mechanical Code (IMC)",
		commonRequirements: [
			"Proper equipment sizing (Manual J calculation)",
			"Ductwork sizing (Manual D calculation)",
			"Combustion air requirements for gas appliances",
			"Clearances from combustible materials",
			"Condensate drain requirements",
			"Refrigerant line sizing and insulation",
			"Energy efficiency minimums (SEER ratings)",
		],
		permitTriggers: [
			"New HVAC system installation",
			"Equipment replacement (like-for-like may be exempt)",
			"Ductwork modifications",
			"Gas line work",
			"Mini-split installation",
		],
	},
	general: {
		name: "International Building Code (IBC) / International Residential Code (IRC)",
		commonRequirements: [
			"Egress window requirements for bedrooms",
			"Stair rise/run specifications (7.75 in max rise, 10 in min run)",
			"Handrail requirements (34-38 inches height)",
			"Smoke and CO detector placement",
			"Fire-rated assemblies where required",
			"Structural load calculations",
		],
		permitTriggers: [
			"Structural modifications",
			"Adding/removing walls",
			"Roof replacement (varies by jurisdiction)",
			"Window/door changes",
			"Additions or conversions",
		],
	},
	roofing: {
		name: "International Building Code (IBC) - Roofing Section",
		commonRequirements: [
			"Minimum roof slope requirements by material",
			"Underlayment requirements",
			"Ice and water shield in cold climates",
			"Flashing requirements at penetrations",
			"Ventilation requirements (1:150 or 1:300 ratio)",
			"Fire-rated materials in certain zones",
		],
		permitTriggers: [
			"Complete re-roof (varies by jurisdiction)",
			"Structural repairs",
			"Adding skylights or vents",
			"Changing roofing material type",
		],
	},
};

/**
 * Search building codes by trade type and work description
 */
export const searchBuildingCodesTool = tool({
	description: `Search for relevant building code requirements based on the type of work being performed. Returns common code requirements, permit triggers, and best practices for:
- Plumbing (UPC/IPC)
- Electrical (NEC)
- HVAC (IMC)
- General construction (IBC/IRC)
- Roofing

Use this to help technicians understand code requirements before starting work.`,
	parameters: z.object({
		tradeType: z
			.enum(["plumbing", "electrical", "hvac", "general", "roofing"])
			.describe("The trade or type of work"),
		workDescription: z
			.string()
			.optional()
			.describe("Specific description of the work being performed"),
		state: z
			.string()
			.optional()
			.describe("State abbreviation (codes vary by jurisdiction)"),
	}),
	execute: async ({ tradeType, workDescription, state }) => {
		const codeInfo = codeReferences[tradeType];

		// Build relevance context
		const relevantRequirements: string[] = [];
		if (workDescription) {
			const desc = workDescription.toLowerCase();

			// Filter requirements based on work description keywords
			for (const req of codeInfo.commonRequirements) {
				const reqLower = req.toLowerCase();
				// Simple relevance matching
				const keywords = desc.split(/\s+/);
				if (keywords.some((kw) => kw.length > 3 && reqLower.includes(kw))) {
					relevantRequirements.push(req);
				}
			}
		}

		return {
			success: true,
			tradeType,
			codeName: codeInfo.name,
			commonRequirements: codeInfo.commonRequirements,
			relevantToWork:
				relevantRequirements.length > 0 ? relevantRequirements : null,
			permitTriggers: codeInfo.permitTriggers,
			jurisdictionNote: state
				? `Note: Requirements may vary in ${state}. Always verify with local building department.`
				: "Requirements vary by jurisdiction. Always verify with local building department.",
			disclaimer:
				"This is general guidance only. Consult actual code books and local jurisdiction for specific requirements.",
		};
	},
});

/**
 * Get permit requirements for a specific type of work
 */
export const getPermitRequirementsTool = tool({
	description: `Determine if a permit is likely required for specific work and what type of permit. Helps field service companies understand when to pull permits and advise customers.

Returns:
- Whether permit is typically required
- Type of permit needed
- Common exceptions
- Inspection requirements`,
	parameters: z.object({
		workType: z.string().describe("Type of work being performed (e.g., 'water heater replacement', 'outlet installation')"),
		propertyType: z
			.enum(["residential", "commercial"])
			.optional()
			.default("residential"),
		city: z.string().optional().describe("City for jurisdiction-specific guidance"),
		state: z.string().optional().describe("State abbreviation"),
	}),
	execute: async ({ workType, propertyType, city, state }) => {
		const workLower = workType.toLowerCase();

		// Analyze work type to determine permit requirements
		let permitRequired = false;
		let permitType = "unknown";
		let confidence = "medium";
		const notes: string[] = [];
		const inspections: string[] = [];

		// Electrical work
		if (
			workLower.includes("outlet") ||
			workLower.includes("circuit") ||
			workLower.includes("panel") ||
			workLower.includes("electrical") ||
			workLower.includes("wire") ||
			workLower.includes("ev charger")
		) {
			permitRequired = true;
			permitType = "electrical";
			inspections.push("Rough-in inspection", "Final inspection");
			if (workLower.includes("panel") || workLower.includes("service")) {
				notes.push("Service upgrades typically require utility coordination");
			}
		}

		// Plumbing work
		if (
			workLower.includes("water heater") ||
			workLower.includes("plumbing") ||
			workLower.includes("sewer") ||
			workLower.includes("drain") ||
			workLower.includes("fixture")
		) {
			permitRequired = true;
			permitType = "plumbing";
			inspections.push("Rough-in inspection", "Final inspection");
			if (workLower.includes("water heater")) {
				notes.push("Water heater permits often include gas and electrical inspections");
				confidence = "high";
			}
		}

		// HVAC work
		if (
			workLower.includes("hvac") ||
			workLower.includes("furnace") ||
			workLower.includes("air condition") ||
			workLower.includes("ac ") ||
			workLower.includes("heat pump") ||
			workLower.includes("mini-split")
		) {
			permitRequired = true;
			permitType = "mechanical";
			inspections.push("Final inspection");
			notes.push("EPA certification required for refrigerant handling");
		}

		// Roofing
		if (workLower.includes("roof") || workLower.includes("re-roof")) {
			permitRequired = true;
			permitType = "building/roofing";
			inspections.push("Final inspection");
			notes.push("Requirements vary significantly by jurisdiction - some exempt repairs under certain square footage");
			confidence = "low";
		}

		// Gas work
		if (
			workLower.includes("gas line") ||
			workLower.includes("gas pipe")
		) {
			permitRequired = true;
			permitType = "gas/plumbing";
			inspections.push("Pressure test inspection", "Final inspection");
			notes.push("Gas work requires licensed gas fitter in most jurisdictions");
			confidence = "high";
		}

		// Minor repairs generally don't require permits
		if (
			workLower.includes("repair") &&
			!workLower.includes("replace") &&
			!workLower.includes("install")
		) {
			permitRequired = false;
			notes.push("Minor repairs typically exempt, but verify with local jurisdiction");
			confidence = "low";
		}

		// Like-for-like replacements
		if (workLower.includes("like for like") || workLower.includes("same location")) {
			notes.push("Like-for-like replacements may be exempt in some jurisdictions");
			confidence = "low";
		}

		return {
			success: true,
			workType,
			propertyType,
			location: city && state ? `${city}, ${state}` : state || "Not specified",
			permitRequired,
			permitType: permitRequired ? permitType : null,
			confidence,
			typicalInspections: permitRequired ? inspections : [],
			notes,
			recommendations: permitRequired
				? [
						"Contact local building department for specific requirements",
						"Have contractor license number ready",
						"Allow 1-3 business days for permit processing",
						"Schedule inspections in advance",
					]
				: [
						"Document work performed for records",
						"When in doubt, contact local building department",
					],
			disclaimer:
				"Permit requirements vary by jurisdiction. Always verify with local building department.",
		};
	},
});

/**
 * Get safety and code compliance checklist for a job type
 */
export const getCodeComplianceChecklistTool = tool({
	description: `Generate a code compliance and safety checklist for a specific type of job. Helps technicians ensure they're meeting code requirements during installation or repair.

Returns a checklist of items to verify for code compliance.`,
	parameters: z.object({
		jobType: z.string().describe("Type of job (e.g., 'water heater installation', 'panel upgrade', 'AC replacement')"),
		includesSafety: z
			.boolean()
			.optional()
			.default(true)
			.describe("Include safety checklist items"),
	}),
	execute: async ({ jobType, includesSafety }) => {
		const jobLower = jobType.toLowerCase();
		const checklist: Array<{ category: string; items: string[] }> = [];

		// Water heater specific
		if (
			jobLower.includes("water heater") ||
			jobLower.includes("hot water")
		) {
			checklist.push({
				category: "Temperature & Pressure Relief",
				items: [
					"T&P relief valve installed in top 6 inches of tank",
					"Discharge pipe routes to within 6 inches of floor",
					"Discharge pipe same size as valve outlet",
					"No valves or restrictions in discharge line",
				],
			});
			checklist.push({
				category: "Seismic & Stability",
				items: [
					"Seismic straps installed (required in seismic zones)",
					"Unit stable and level",
					"Proper clearances maintained",
				],
			});
			checklist.push({
				category: "Connections",
				items: [
					"Proper venting for gas units (draft hood, flue)",
					"Gas shutoff valve accessible",
					"Sediment trap on gas line",
					"Dielectric unions on water connections",
					"Expansion tank installed if closed system",
				],
			});
		}

		// Electrical panel/service
		if (
			jobLower.includes("panel") ||
			jobLower.includes("electrical") ||
			jobLower.includes("breaker")
		) {
			checklist.push({
				category: "Panel Requirements",
				items: [
					"36-inch clearance in front of panel",
					"30-inch width clearance",
					"78-inch height clearance",
					"Panel cover intact and secured",
					"All breakers labeled",
					"No exposed conductors",
				],
			});
			checklist.push({
				category: "Grounding & Bonding",
				items: [
					"Ground rod(s) installed",
					"Bonding jumper at water heater",
					"CSST gas line bonded (if applicable)",
					"Grounding electrode conductor sized properly",
				],
			});
		}

		// HVAC
		if (
			jobLower.includes("hvac") ||
			jobLower.includes("furnace") ||
			jobLower.includes("ac") ||
			jobLower.includes("heat pump")
		) {
			checklist.push({
				category: "Equipment Installation",
				items: [
					"Clearances from combustibles maintained",
					"Condensate drain properly routed",
					"Secondary drain pan with float switch (if in attic)",
					"Filter access provided",
					"Disconnect within sight of unit",
				],
			});
			checklist.push({
				category: "Ductwork & Airflow",
				items: [
					"Supply and return balanced",
					"Duct connections sealed",
					"No kinks in flex duct",
					"Adequate return air",
				],
			});
			if (jobLower.includes("gas") || jobLower.includes("furnace")) {
				checklist.push({
					category: "Gas & Combustion",
					items: [
						"Combustion air adequate",
						"Gas pressure verified",
						"CO testing performed",
						"Heat exchanger inspected",
					],
				});
			}
		}

		// Safety checklist
		if (includesSafety) {
			checklist.push({
				category: "General Safety",
				items: [
					"Work area secured and clean",
					"PPE used appropriately",
					"All utilities verified off before work",
					"Test equipment calibrated",
					"Customer informed of work",
				],
			});
		}

		// If no specific checklist matched, provide general
		if (checklist.length === (includesSafety ? 1 : 0)) {
			checklist.unshift({
				category: "General Code Compliance",
				items: [
					"Work matches permit scope (if applicable)",
					"Materials meet code requirements",
					"Manufacturer installation instructions followed",
					"All connections secure",
					"System tested and operational",
					"Area cleaned up",
				],
			});
		}

		return {
			success: true,
			jobType,
			checklist,
			totalItems: checklist.reduce((sum, cat) => sum + cat.items.length, 0),
			reminder:
				"Document completion of each item. Photos recommended for permit inspections.",
			disclaimer:
				"This checklist is general guidance. Refer to local codes and manufacturer instructions.",
		};
	},
});

// =============================================================================
// PROACTIVE LEARNING SYSTEM - Auto-learn from customer interactions
// =============================================================================

/**
 * Analyze recent communications to extract learnings
 *
 * Scans recent communications and extracts insights that can be stored
 * to memory for future reference
 */
export const analyzeRecentCommunicationsTool = tool({
	description: `Proactively analyze recent customer communications to extract insights and learnings. Scans the last N days of communications and identifies:
- Customer preferences mentioned in calls/emails
- Common issues or complaints
- Positive feedback and compliments
- Service requests patterns
- Emergency situations or urgent needs

Use this for periodic learning runs to build customer knowledge.`,
	parameters: z.object({
		companyId: z.string().describe("Company ID"),
		daysBack: z
			.number()
			.optional()
			.default(7)
			.describe("Number of days to look back"),
		limit: z
			.number()
			.optional()
			.default(50)
			.describe("Maximum communications to analyze"),
		focusArea: z
			.enum(["all", "preferences", "issues", "feedback", "urgent"])
			.optional()
			.default("all")
			.describe("Focus on specific type of insights"),
	}),
	execute: async ({ companyId, daysBack, limit, focusArea }) => {
		const { createServiceSupabaseClient } = await import(
			"../supabase/service-client"
		);
		const supabase = createServiceSupabaseClient();

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - daysBack);

		// Get recent communications with transcripts
		const { data: comms, error } = await supabase
			.from("communications")
			.select(
				`
				id,
				channel,
				direction,
				call_transcript,
				call_sentiment,
				body_plain,
				customer_id,
				created_at,
				customer:customers!customer_id(id, name)
			`
			)
			.eq("company_id", companyId)
			.gte("created_at", startDate.toISOString())
			.not("call_transcript", "is", null)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error || !comms) {
			return { success: false, error: error?.message || "No communications found" };
		}

		const insights: Array<{
			customerId: string | null;
			customerName: string | null;
			type: string;
			content: string;
			source: string;
			importance: "low" | "medium" | "high";
		}> = [];

		// Pattern matching for different insight types
		const patterns = {
			preferences: [
				/prefer[s]?\s+([^.]+)/gi,
				/like[s]?\s+([^.]+)/gi,
				/want[s]?\s+([^.]+)/gi,
				/always\s+([^.]+)/gi,
				/please\s+([^.]+)/gi,
			],
			issues: [
				/problem[s]?\s+with\s+([^.]+)/gi,
				/issue[s]?\s+with\s+([^.]+)/gi,
				/not\s+working\s+([^.]+)/gi,
				/broken\s+([^.]+)/gi,
				/complaint[s]?\s+about\s+([^.]+)/gi,
				/frustrated\s+([^.]+)/gi,
			],
			feedback: [
				/great\s+([^.]+)/gi,
				/excellent\s+([^.]+)/gi,
				/thank\s+you\s+for\s+([^.]+)/gi,
				/appreciate\s+([^.]+)/gi,
				/happy\s+with\s+([^.]+)/gi,
			],
			urgent: [
				/emergency\s+([^.]+)/gi,
				/urgent\s+([^.]+)/gi,
				/asap\s+([^.]+)/gi,
				/right\s+away\s+([^.]+)/gi,
				/immediately\s+([^.]+)/gi,
			],
		};

		for (const comm of comms) {
			const content = comm.call_transcript || comm.body_plain || "";
			if (!content) continue;

			const customer = comm.customer as { id: string; name: string } | null;

			// Extract insights based on focus area
			const areasToScan =
				focusArea === "all"
					? (Object.keys(patterns) as Array<keyof typeof patterns>)
					: [focusArea as keyof typeof patterns];

			for (const area of areasToScan) {
				for (const pattern of patterns[area] || []) {
					const matches = content.matchAll(pattern);
					for (const match of matches) {
						insights.push({
							customerId: comm.customer_id,
							customerName: customer?.name || null,
							type: area,
							content: match[0],
							source: `${comm.channel} on ${new Date(comm.created_at).toLocaleDateString()}`,
							importance: area === "urgent" || area === "issues" ? "high" : "medium",
						});
					}
				}
			}

			// Also flag negative sentiment calls
			if (
				comm.call_sentiment &&
				["negative", "very_negative"].includes(comm.call_sentiment)
			) {
				insights.push({
					customerId: comm.customer_id,
					customerName: customer?.name || null,
					type: "sentiment",
					content: `Negative sentiment detected in ${comm.channel} communication`,
					source: `${comm.channel} on ${new Date(comm.created_at).toLocaleDateString()}`,
					importance: "high",
				});
			}
		}

		return {
			success: true,
			communicationsAnalyzed: comms.length,
			daysBack,
			focusArea,
			insightsFound: insights.length,
			insights: insights.slice(0, 100), // Limit response size
			summary: {
				byType: {
					preferences: insights.filter((i) => i.type === "preferences").length,
					issues: insights.filter((i) => i.type === "issues").length,
					feedback: insights.filter((i) => i.type === "feedback").length,
					urgent: insights.filter((i) => i.type === "urgent").length,
					sentiment: insights.filter((i) => i.type === "sentiment").length,
				},
				highImportance: insights.filter((i) => i.importance === "high").length,
			},
		};
	},
});

/**
 * Learn from completed jobs to improve future recommendations
 */
export const learnFromCompletedJobsTool = tool({
	description: `Analyze completed jobs to learn patterns about:
- Common job durations by type
- Frequently used materials
- Customer satisfaction indicators
- Technician performance patterns
- Seasonal job patterns

Helps improve scheduling and resource allocation.`,
	parameters: z.object({
		companyId: z.string().describe("Company ID"),
		daysBack: z
			.number()
			.optional()
			.default(30)
			.describe("Days to look back"),
		jobType: z
			.string()
			.optional()
			.describe("Filter by job type"),
	}),
	execute: async ({ companyId, daysBack, jobType }) => {
		const { createServiceSupabaseClient } = await import(
			"../supabase/service-client"
		);
		const supabase = createServiceSupabaseClient();

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - daysBack);

		let query = supabase
			.from("jobs")
			.select(
				`
				id,
				title,
				job_type,
				status,
				scheduled_start,
				scheduled_end,
				actual_start,
				actual_end,
				total_amount,
				customer:customers!customer_id(name),
				property:properties!property_id(address_line1, city)
			`
			)
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString())
			.order("created_at", { ascending: false })
			.limit(100);

		if (jobType) {
			query = query.eq("job_type", jobType);
		}

		const { data: jobs, error } = await query;

		if (error || !jobs) {
			return { success: false, error: error?.message || "No jobs found" };
		}

		// Analyze job patterns
		const durationAnalysis: Record<string, number[]> = {};
		const revenueAnalysis: Record<string, number[]> = {};
		const accuracyAnalysis: Array<{
			jobType: string;
			scheduledMinutes: number;
			actualMinutes: number;
			accuracy: number;
		}> = [];

		for (const job of jobs) {
			const type = job.job_type || "unknown";

			// Duration analysis
			if (job.actual_start && job.actual_end) {
				const actualMinutes =
					(new Date(job.actual_end).getTime() -
						new Date(job.actual_start).getTime()) /
					60000;
				if (!durationAnalysis[type]) durationAnalysis[type] = [];
				durationAnalysis[type].push(actualMinutes);

				// Scheduling accuracy
				if (job.scheduled_start && job.scheduled_end) {
					const scheduledMinutes =
						(new Date(job.scheduled_end).getTime() -
							new Date(job.scheduled_start).getTime()) /
						60000;
					accuracyAnalysis.push({
						jobType: type,
						scheduledMinutes,
						actualMinutes,
						accuracy: Math.min(scheduledMinutes / actualMinutes, actualMinutes / scheduledMinutes) * 100,
					});
				}
			}

			// Revenue analysis
			if (job.total_amount) {
				if (!revenueAnalysis[type]) revenueAnalysis[type] = [];
				revenueAnalysis[type].push(job.total_amount);
			}
		}

		// Calculate averages
		const durationSummary: Record<
			string,
			{ avg: number; min: number; max: number; count: number }
		> = {};
		for (const [type, durations] of Object.entries(durationAnalysis)) {
			const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
			durationSummary[type] = {
				avg: Math.round(avg),
				min: Math.round(Math.min(...durations)),
				max: Math.round(Math.max(...durations)),
				count: durations.length,
			};
		}

		const revenueSummary: Record<
			string,
			{ avg: number; min: number; max: number; count: number }
		> = {};
		for (const [type, amounts] of Object.entries(revenueAnalysis)) {
			const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
			revenueSummary[type] = {
				avg: Math.round(avg * 100) / 100,
				min: Math.min(...amounts),
				max: Math.max(...amounts),
				count: amounts.length,
			};
		}

		// Scheduling accuracy summary
		const avgAccuracy =
			accuracyAnalysis.length > 0
				? accuracyAnalysis.reduce((sum, a) => sum + a.accuracy, 0) /
					accuracyAnalysis.length
				: null;

		return {
			success: true,
			jobsAnalyzed: jobs.length,
			daysBack,
			insights: {
				durationByType: durationSummary,
				revenueByType: revenueSummary,
				schedulingAccuracy: avgAccuracy
					? `${Math.round(avgAccuracy)}% average accuracy`
					: "Insufficient data",
			},
			recommendations: Object.entries(durationSummary).map(([type, stats]) => ({
				jobType: type,
				recommendedDuration: stats.avg,
				note:
					stats.max > stats.avg * 1.5
						? `Consider allocating buffer time - some ${type} jobs take up to ${stats.max} minutes`
						: null,
			})),
		};
	},
});

/**
 * Build customer profile from all available data
 */
export const buildCustomerProfileTool = tool({
	description: `Build a comprehensive customer profile by aggregating all available data:
- Communication history and sentiment
- Job history and preferences
- Payment history
- Property information
- Stored memories and notes

Use this to prepare for customer interactions or to understand customer value.`,
	parameters: z.object({
		customerId: z.string().describe("Customer UUID"),
		companyId: z.string().describe("Company ID"),
	}),
	execute: async ({ customerId, companyId }) => {
		const { createServiceSupabaseClient } = await import(
			"../supabase/service-client"
		);
		const supabase = createServiceSupabaseClient();

		// Fetch all customer data in parallel
		const [
			customerResult,
			jobsResult,
			commsResult,
			invoicesResult,
			memoriesResult,
		] = await Promise.all([
			supabase
				.from("customers")
				.select("*")
				.eq("id", customerId)
				.eq("company_id", companyId)
				.single(),
			supabase
				.from("jobs")
				.select("id, title, job_type, status, total_amount, created_at")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(20),
			supabase
				.from("communications")
				.select("id, channel, direction, call_sentiment, created_at")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(50),
			supabase
				.from("invoices")
				.select("id, status, total, paid_amount, created_at")
				.eq("customer_id", customerId)
				.order("created_at", { ascending: false })
				.limit(20),
			supabase
				.from("ai_memory")
				.select("content, memory_type, importance, created_at")
				.eq("company_id", companyId)
				.eq("entity_id", customerId)
				.eq("entity_type", "customer")
				.order("importance", { ascending: false })
				.limit(20),
		]);

		const customer = customerResult.data;
		const jobs = jobsResult.data || [];
		const comms = commsResult.data || [];
		const invoices = invoicesResult.data || [];
		const memories = memoriesResult.data || [];

		if (!customer) {
			return { success: false, error: "Customer not found" };
		}

		// Analyze job history
		const completedJobs = jobs.filter((j) => j.status === "completed");
		const totalRevenue = jobs.reduce((sum, j) => sum + (j.total_amount || 0), 0);
		const jobTypes = [...new Set(jobs.map((j) => j.job_type).filter(Boolean))];

		// Analyze communication sentiment
		const sentiments = comms
			.map((c) => c.call_sentiment)
			.filter(Boolean);
		const negativeSentiments = sentiments.filter(
			(s) => s === "negative" || s === "very_negative"
		).length;
		const positiveSentiments = sentiments.filter(
			(s) => s === "positive" || s === "very_positive"
		).length;

		// Analyze payment behavior
		const paidInvoices = invoices.filter((i) => i.status === "paid");
		const overdueInvoices = invoices.filter((i) => i.status === "overdue");
		const totalOwed = invoices
			.filter((i) => i.status !== "paid")
			.reduce((sum, i) => sum + ((i.total || 0) - (i.paid_amount || 0)), 0);

		// Customer tier based on revenue and history
		let tier: "new" | "regular" | "vip" | "at_risk" = "new";
		if (completedJobs.length >= 5 && totalRevenue > 5000) {
			tier = "vip";
		} else if (completedJobs.length >= 2) {
			tier = "regular";
		}
		if (negativeSentiments > positiveSentiments || overdueInvoices.length > 2) {
			tier = "at_risk";
		}

		return {
			success: true,
			customer: {
				id: customer.id,
				name: customer.name,
				email: customer.email,
				phone: customer.phone,
				createdAt: customer.created_at,
			},
			tier,
			jobHistory: {
				totalJobs: jobs.length,
				completedJobs: completedJobs.length,
				totalRevenue,
				commonJobTypes: jobTypes,
				recentJobs: jobs.slice(0, 5).map((j) => ({
					title: j.title,
					type: j.job_type,
					status: j.status,
					amount: j.total_amount,
				})),
			},
			communicationHistory: {
				totalInteractions: comms.length,
				channelBreakdown: {
					calls: comms.filter((c) => c.channel === "phone").length,
					emails: comms.filter((c) => c.channel === "email").length,
					sms: comms.filter((c) => c.channel === "sms").length,
				},
				sentimentSummary: {
					positive: positiveSentiments,
					negative: negativeSentiments,
					neutral: sentiments.length - positiveSentiments - negativeSentiments,
				},
			},
			financials: {
				totalInvoices: invoices.length,
				paidInvoices: paidInvoices.length,
				overdueInvoices: overdueInvoices.length,
				currentBalance: totalOwed,
				paymentHealth:
					overdueInvoices.length === 0
						? "good"
						: overdueInvoices.length < 3
							? "fair"
							: "poor",
			},
			memories: memories.map((m) => ({
				content: m.content,
				type: m.memory_type,
				importance: m.importance,
			})),
			recommendations:
				tier === "at_risk"
					? [
							"Review recent negative interactions",
							"Consider follow-up call to address concerns",
							"Check for outstanding payment issues",
						]
					: tier === "vip"
						? [
								"Prioritize this customer's requests",
								"Consider loyalty discount or perks",
								"Proactive maintenance reminders",
							]
						: ["Standard service approach", "Opportunity to build relationship"],
		};
	},
});

// ============================================================================
// ROUTE OPTIMIZATION TOOLS
// Integration with routing-service.ts for directions and supplier finding
// ============================================================================

/**
 * Get driving route between two or more locations
 */
export const getRouteTool = tool({
	description:
		"Calculate optimal driving route between locations with distance and duration",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		waypoints: z
			.array(
				z.object({
					address: z.string().describe("Full address"),
					lat: z.number().optional().describe("Latitude if known"),
					lng: z.number().optional().describe("Longitude if known"),
				})
			)
			.min(2)
			.describe("Array of waypoints (minimum 2: origin and destination)"),
		optimizeOrder: z
			.boolean()
			.optional()
			.default(false)
			.describe("Whether to optimize waypoint order for shortest route"),
	}),
	execute: async ({ waypoints }) => {
		// Geocode any waypoints without coordinates
		const geocodedWaypoints = await Promise.all(
			waypoints.map(async (wp) => {
				if (wp.lat && wp.lng) {
					return { ...wp, coordinates: [wp.lng, wp.lat] as [number, number] };
				}
				// Use geocoding service (Nominatim requires User-Agent per ToS)
				const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(wp.address)}&limit=1`;
				try {
					const response = await fetch(geocodeUrl, {
						headers: {
							"User-Agent": "Stratos-FSM/1.0 (https://stratos.app; support@stratos.app)",
							"Accept": "application/json",
						},
					});
					if (!response.ok) {
						console.warn(`Geocoding failed for ${wp.address}: ${response.status}`);
						return { ...wp, coordinates: null };
					}
					const data = await response.json();
					if (data.length > 0) {
						return {
							...wp,
							coordinates: [
								parseFloat(data[0].lon),
								parseFloat(data[0].lat),
							] as [number, number],
						};
					}
				} catch (error) {
					console.warn(`Geocoding error for ${wp.address}:`, error);
				}
				return { ...wp, coordinates: null };
			})
		);

		const validWaypoints = geocodedWaypoints.filter((wp) => wp.coordinates);
		if (validWaypoints.length < 2) {
			return { error: "Could not geocode enough waypoints for routing" };
		}

		// Get route from OpenRouteService (if API key available)
		const apiKey = process.env.OPENROUTESERVICE_API_KEY;
		if (apiKey) {
			try {
				const coordinates = validWaypoints.map((wp) => wp.coordinates);
				const response = await fetch(
					"https://api.openrouteservice.org/v2/directions/driving-car/geojson",
					{
						method: "POST",
						headers: {
							Authorization: apiKey,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ coordinates, instructions: true }),
					}
				);
				const routeData = await response.json();

				if (routeData.features?.[0]) {
					const feature = routeData.features[0];
					return {
						distance_km: (feature.properties.summary.distance / 1000).toFixed(1),
						duration_minutes: Math.round(feature.properties.summary.duration / 60),
						waypoints: validWaypoints.map((wp) => wp.address),
						geometry: feature.geometry,
					};
				}
			} catch {
				// Fall through to estimate
			}
		}

		// Fallback: Calculate straight-line distance estimate
		const coords = validWaypoints.map((wp) => wp.coordinates!);
		let totalDistance = 0;
		for (let i = 0; i < coords.length - 1; i++) {
			const [lon1, lat1] = coords[i];
			const [lon2, lat2] = coords[i + 1];
			const R = 6371;
			const dLat = ((lat2 - lat1) * Math.PI) / 180;
			const dLon = ((lon2 - lon1) * Math.PI) / 180;
			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos((lat1 * Math.PI) / 180) *
					Math.cos((lat2 * Math.PI) / 180) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			totalDistance += R * c;
		}

		const drivingDistance = totalDistance * 1.3;
		const durationMinutes = Math.round((drivingDistance / 50) * 60);

		return {
			distance_km: drivingDistance.toFixed(1),
			duration_minutes: durationMinutes,
			waypoints: validWaypoints.map((wp) => wp.address),
			note: "Estimated based on straight-line distance",
		};
	},
});

/**
 * Find nearby suppliers (plumbing supply, electrical supply, etc.)
 */
export const findNearbySuppliersTool = tool({
	description: "Find nearby supply stores for parts (plumbing, electrical, HVAC, hardware)",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		location: z.object({
			lat: z.number().describe("Latitude"),
			lng: z.number().describe("Longitude"),
		}),
		supplyType: z
			.enum(["plumbing", "electrical", "hvac", "hardware", "all"])
			.default("all"),
		radiusKm: z.number().optional().default(10),
	}),
	execute: async ({ location, supplyType, radiusKm }) => {
		const typeFilters: Record<string, string> = {
			plumbing: '["shop"="trade"]["trade"~"plumbing|bathroom"]',
			electrical: '["shop"="trade"]["trade"~"electrical"]',
			hvac: '["shop"="trade"]["trade"~"hvac|air_conditioning"]',
			hardware: '["shop"="doityourself"]',
			all: '["shop"~"trade|doityourself|hardware"]',
		};

		const filter = typeFilters[supplyType];
		const query = `[out:json][timeout:25];(node${filter}(around:${radiusKm * 1000},${location.lat},${location.lng});way${filter}(around:${radiusKm * 1000},${location.lat},${location.lng}););out center;`;

		try {
			const response = await fetch("https://overpass-api.de/api/interpreter", {
				method: "POST",
				body: query,
			});
			const data = await response.json();

			const suppliers = data.elements
				.map((el: { tags?: { name?: string; phone?: string; website?: string }; lat?: number; lon?: number; center?: { lat: number; lon: number } }) => ({
					name: el.tags?.name || "Unknown Supplier",
					phone: el.tags?.phone,
					website: el.tags?.website,
					lat: el.lat || el.center?.lat,
					lng: el.lon || el.center?.lon,
				}))
				.filter((s: { name: string }) => s.name !== "Unknown Supplier")
				.slice(0, 10);

			return { suppliers, searchRadius: radiusKm, supplyType };
		} catch {
			return { error: "Failed to search for suppliers" };
		}
	},
});

// ============================================================================
// INVENTORY & PARTS TOOLS
// ============================================================================

/**
 * Search inventory for parts
 */
export const searchInventoryTool = tool({
	description: "Search company inventory for parts by name, SKU, or category",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		query: z.string().describe("Search query"),
		category: z.string().optional(),
		inStockOnly: z.boolean().optional().default(false),
	}),
	execute: async ({ companyId, query, category, inStockOnly }) => {
		const supabase = await createClient();

		let dbQuery = supabase
			.from("inventory")
			.select("id, sku, name, description, category, quantity_on_hand, quantity_reserved, reorder_point, unit_cost, unit_price, location")
			.eq("company_id", companyId)
			.or(`name.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`);

		if (category) dbQuery = dbQuery.eq("category", category);
		if (inStockOnly) dbQuery = dbQuery.gt("quantity_on_hand", 0);

		const { data, error } = await dbQuery.order("name").limit(20);
		if (error) return { error: error.message };

		return {
			items: data.map((item) => ({
				...item,
				available: item.quantity_on_hand - (item.quantity_reserved || 0),
				needsReorder: item.quantity_on_hand <= (item.reorder_point || 0),
			})),
			total: data.length,
		};
	},
});

/**
 * Check parts availability for a job
 */
export const checkPartsAvailabilityTool = tool({
	description: "Check if required parts are available in inventory for a job",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		parts: z.array(
			z.object({
				itemId: z.string().optional(),
				sku: z.string().optional(),
				name: z.string().optional(),
				quantity: z.number(),
			})
		),
	}),
	execute: async ({ companyId, parts }) => {
		if (!parts.length) {
			return { error: "At least one part is required" };
		}

		const supabase = await createClient();

		// Batch lookup: collect IDs and SKUs for a single query
		const itemIds = parts.filter((p) => p.itemId).map((p) => p.itemId!);
		const skus = parts.filter((p) => p.sku && !p.itemId).map((p) => p.sku!);

		// Fetch all matching inventory items in one query
		let inventoryQuery = supabase
			.from("inventory")
			.select("id, sku, name, quantity_on_hand, quantity_reserved, unit_cost, unit_price")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		// Build OR conditions for batch lookup
		const orConditions: string[] = [];
		if (itemIds.length > 0) {
			orConditions.push(`id.in.(${itemIds.join(",")})`);
		}
		if (skus.length > 0) {
			orConditions.push(`sku.in.(${skus.join(",")})`);
		}

		let inventoryItems: { id: string; sku: string | null; name: string; quantity_on_hand: number; quantity_reserved: number | null; unit_cost: number | null; unit_price: number | null }[] = [];

		if (orConditions.length > 0) {
			const { data } = await inventoryQuery.or(orConditions.join(","));
			inventoryItems = data || [];
		}

		// For name-based lookups, we still need individual queries (fuzzy match)
		const nameOnlyParts = parts.filter((p) => !p.itemId && !p.sku && p.name);
		if (nameOnlyParts.length > 0) {
			const nameResults = await Promise.all(
				nameOnlyParts.map(async (part) => {
					const { data } = await supabase
						.from("inventory")
						.select("id, sku, name, quantity_on_hand, quantity_reserved, unit_cost, unit_price")
						.eq("company_id", companyId)
						.is("deleted_at", null)
						.ilike("name", `%${part.name}%`)
						.limit(1)
						.single();
					return data;
				})
			);
			inventoryItems.push(...nameResults.filter((r): r is NonNullable<typeof r> => r !== null));
		}

		// Map results to parts
		const results = parts.map((part) => {
			const item = inventoryItems.find(
				(inv) =>
					(part.itemId && inv.id === part.itemId) ||
					(part.sku && inv.sku === part.sku) ||
					(part.name && inv.name.toLowerCase().includes(part.name.toLowerCase()))
			);

			if (!item) {
				return { ...part, found: false, available: 0, canFulfill: false };
			}

			const available = item.quantity_on_hand - (item.quantity_reserved || 0);
			return {
				itemId: item.id,
				sku: item.sku,
				name: item.name,
				found: true,
				available,
				needed: part.quantity,
				canFulfill: available >= part.quantity,
				unitPrice: item.unit_price,
				totalPrice: (item.unit_price || 0) * part.quantity,
			};
		});

		return {
			allPartsAvailable: results.every((r) => r.canFulfill),
			parts: results,
			missingParts: results.filter((r) => !r.canFulfill),
			totalEstimatedPrice: results.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
		};
	},
});

/**
 * Get low stock alerts
 */
export const getLowStockAlertsTool = tool({
	description: "Get inventory items at or below reorder point",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		category: z.string().optional(),
		limit: z.number().optional().default(50).describe("Max items to return"),
	}),
	execute: async ({ companyId, category, limit }) => {
		const supabase = await createClient();

		// Use a raw filter to get only items where quantity <= reorder_point
		let query = supabase
			.from("inventory")
			.select("id, sku, name, category, quantity_on_hand, reorder_point, reorder_quantity, unit_cost")
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.not("reorder_point", "is", null);

		if (category) query = query.eq("category", category);

		const { data, error } = await query.order("quantity_on_hand", { ascending: true }).limit(limit * 2);
		if (error) return { error: error.message };

		// Filter for items at or below reorder point and limit
		const lowStockItems = data
			.filter((item) => item.quantity_on_hand <= (item.reorder_point || 0))
			.slice(0, limit)
			.map((item) => ({
				...item,
				shortfall: (item.reorder_point || 0) - item.quantity_on_hand,
				suggestedOrderQty: item.reorder_quantity || 10,
				urgency: item.quantity_on_hand === 0 ? "critical" : item.quantity_on_hand <= (item.reorder_point || 0) / 2 ? "high" : "normal",
			}));

		return {
			lowStockCount: lowStockItems.length,
			items: lowStockItems,
			criticalCount: lowStockItems.filter((i) => i.urgency === "critical").length,
		};
	},
});

// ============================================================================
// EQUIPMENT HISTORY TOOLS
// ============================================================================

/**
 * Get equipment at a property
 */
export const getPropertyEquipmentTool = tool({
	description: "Get list of equipment installed at a customer's property",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		propertyId: z.string().optional(),
		customerId: z.string().optional(),
	}),
	execute: async ({ companyId, propertyId, customerId }) => {
		// Validate: at least one filter is required
		if (!propertyId && !customerId) {
			return { error: "Either propertyId or customerId is required" };
		}

		const supabase = await createClient();

		let query = supabase
			.from("equipment")
			.select("id, name, model_number, serial_number, manufacturer, install_date, warranty_expiry, last_service_date, next_service_due, status, notes")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (propertyId) {
			query = query.eq("property_id", propertyId);
		} else if (customerId) {
			const { data: properties } = await supabase
				.from("properties")
				.select("id")
				.eq("customer_id", customerId)
				.is("deleted_at", null);
			if (!properties?.length) {
				return { equipment: [], total: 0, message: "No properties found for this customer" };
			}
			query = query.in("property_id", properties.map((p) => p.id));
		}

		const { data, error } = await query.order("name").limit(100);
		if (error) return { error: error.message };

		const now = new Date();
		return {
			equipment: data.map((eq) => ({
				...eq,
				warrantyStatus: eq.warranty_expiry
					? new Date(eq.warranty_expiry) > now ? "active" : "expired"
					: "unknown",
				serviceDue: eq.next_service_due ? new Date(eq.next_service_due) <= now : false,
			})),
			total: data.length,
		};
	},
});

/**
 * Get service history for specific equipment
 */
export const getEquipmentServiceHistoryTool = tool({
	description: "Get service history for a specific piece of equipment",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		equipmentId: z.string().describe("Equipment UUID"),
		limit: z.number().optional().default(10),
	}),
	execute: async ({ companyId, equipmentId, limit }) => {
		const supabase = await createClient();

		const { data: equipment } = await supabase
			.from("equipment")
			.select("*")
			.eq("id", equipmentId)
			.eq("company_id", companyId)
			.single();

		if (!equipment) return { error: "Equipment not found" };

		const { data: serviceHistory } = await supabase
			.from("job_equipment")
			.select("job:jobs(id, title, status, completed_at), notes, work_performed, created_at")
			.eq("equipment_id", equipmentId)
			.order("created_at", { ascending: false })
			.limit(limit);

		return {
			equipment: {
				id: equipment.id,
				name: equipment.name,
				model: equipment.model_number,
				serial: equipment.serial_number,
			},
			serviceHistory: serviceHistory || [],
			totalServices: serviceHistory?.length || 0,
		};
	},
});

/**
 * Check equipment warranty status
 */
export const checkEquipmentWarrantyTool = tool({
	description: "Check warranty status for equipment",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		equipmentId: z.string().describe("Equipment UUID"),
	}),
	execute: async ({ companyId, equipmentId }) => {
		const supabase = await createClient();

		const { data: equipment, error } = await supabase
			.from("equipment")
			.select("id, name, model_number, serial_number, warranty_expiry, warranty_type, warranty_notes")
			.eq("id", equipmentId)
			.eq("company_id", companyId)
			.single();

		if (error || !equipment) return { error: "Equipment not found" };

		const now = new Date();
		const warrantyEnd = equipment.warranty_expiry ? new Date(equipment.warranty_expiry) : null;
		let status: "active" | "expired" | "expiring_soon" | "unknown" = "unknown";
		let daysRemaining = null;

		if (warrantyEnd) {
			daysRemaining = Math.ceil((warrantyEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
			status = daysRemaining < 0 ? "expired" : daysRemaining <= 30 ? "expiring_soon" : "active";
		}

		return {
			equipment: { name: equipment.name, model: equipment.model_number, serial: equipment.serial_number },
			warranty: {
				status,
				expiryDate: equipment.warranty_expiry,
				daysRemaining: daysRemaining && daysRemaining > 0 ? daysRemaining : 0,
				type: equipment.warranty_type,
			},
		};
	},
});

// ============================================================================
// TECHNICIAN MATCHING TOOLS
// ============================================================================

/**
 * Find technicians by skills
 */
export const findTechniciansBySkillsTool = tool({
	description: "Find available technicians with specific skills or certifications",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		skills: z.array(z.string()).optional(),
		certifications: z.array(z.string()).optional(),
		date: z.string().optional().describe("Date to check availability"),
	}),
	execute: async ({ companyId, skills, certifications, date }) => {
		try {
			const supabase = await createClient();

			const { data: members, error } = await supabase
				.from("company_memberships")
				.select("id, role, skills, certifications, service_areas, user:users(id, first_name, last_name, email)")
				.eq("company_id", companyId)
				.eq("role", "technician");

			if (error) return { error: error.message };

			let filtered = members;
			if (skills?.length) {
				filtered = filtered.filter((m) =>
					skills.some((skill) =>
						((m.skills as string[]) || []).map((s) => s.toLowerCase()).includes(skill.toLowerCase())
					)
				);
			}
			if (certifications?.length) {
				filtered = filtered.filter((m) =>
					certifications.some((cert) =>
						((m.certifications as string[]) || []).map((c) => c.toLowerCase()).includes(cert.toLowerCase())
					)
				);
			}

			if (date) {
				const dayStart = new Date(date);
				dayStart.setHours(0, 0, 0, 0);
				const dayEnd = new Date(date);
				dayEnd.setHours(23, 59, 59, 999);

				const { data: assignments } = await supabase
					.from("jobs")
					.select("assigned_to")
					.is("deleted_at", null)
					.in("assigned_to", filtered.map((m) => m.id))
					.gte("scheduled_start", dayStart.toISOString())
					.lte("scheduled_start", dayEnd.toISOString());

				const jobCounts: Record<string, number> = {};
				assignments?.forEach((a) => {
					if (a.assigned_to) jobCounts[a.assigned_to] = (jobCounts[a.assigned_to] || 0) + 1;
				});

				filtered = filtered.map((m) => ({
					...m,
					jobsOnDate: jobCounts[m.id] || 0,
					availability: (jobCounts[m.id] || 0) === 0 ? "available" : (jobCounts[m.id] || 0) < 4 ? "partially_booked" : "fully_booked",
				}));
			}

			return {
				technicians: filtered.map((m) => ({
					id: m.id,
					name: `${(m.user as { first_name: string; last_name: string })?.first_name} ${(m.user as { first_name: string; last_name: string })?.last_name}`,
					skills: m.skills,
					certifications: m.certifications,
					availability: (m as { availability?: string }).availability,
				})),
				total: filtered.length,
			};
		} catch (err) {
			return { error: err instanceof Error ? err.message : "Failed to find technicians" };
		}
	},
});

/**
 * Get technician workload
 */
export const getTechnicianWorkloadTool = tool({
	description: "Get a technician's current workload and schedule",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		technicianId: z.string().describe("Technician membership UUID"),
		startDate: z.string(),
		endDate: z.string(),
	}),
	execute: async ({ companyId, technicianId, startDate, endDate }) => {
		try {
			const supabase = await createClient();

			const { data: tech } = await supabase
				.from("company_memberships")
				.select("id, user:users(first_name, last_name)")
				.eq("id", technicianId)
				.eq("company_id", companyId)
				.single();

			if (!tech) return { error: "Technician not found" };

			const { data: jobs } = await supabase
				.from("jobs")
				.select("id, title, status, scheduled_start, scheduled_end, customer:customers(name)")
				.eq("assigned_to", technicianId)
				.is("deleted_at", null)
				.gte("scheduled_start", startDate)
				.lte("scheduled_start", endDate)
				.order("scheduled_start");

			return {
				technician: { id: tech.id, name: `${(tech.user as { first_name: string; last_name: string })?.first_name} ${(tech.user as { first_name: string; last_name: string })?.last_name}` },
				summary: {
					totalJobs: jobs?.length || 0,
					completed: jobs?.filter((j) => j.status === "completed").length || 0,
					scheduled: jobs?.filter((j) => j.status === "scheduled").length || 0,
				},
				jobs: jobs?.map((j) => ({
					id: j.id,
					title: j.title,
					status: j.status,
					scheduledStart: j.scheduled_start,
					customer: (j.customer as { name: string })?.name,
				})) || [],
			};
		} catch (err) {
			return { error: err instanceof Error ? err.message : "Failed to get technician workload" };
		}
	},
});

// ============================================================================
// PRICING & ESTIMATION TOOLS
// ============================================================================

/**
 * Search price book for services
 */
export const searchPriceBookTool = tool({
	description: "Search price book for services, parts, and flat-rate pricing",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		query: z.string(),
		category: z.string().optional(),
	}),
	execute: async ({ companyId, query, category }) => {
		const supabase = await createClient();

		let dbQuery = supabase
			.from("price_book_items")
			.select("id, name, description, category, sku, unit_price, cost, is_active")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`);

		if (category) dbQuery = dbQuery.eq("category", category);
		const { data, error } = await dbQuery.order("name").limit(20);
		if (error) return { error: error.message };

		return {
			items: data.map((item) => ({
				...item,
				profit: item.unit_price - (item.cost || 0),
			})),
			total: data.length,
		};
	},
});

/**
 * Calculate estimate from price book items
 */
export const calculateEstimateTool = tool({
	description: "Calculate an estimate total from price book items",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		items: z.array(
			z.object({
				priceBookItemId: z.string().optional(),
				name: z.string().optional(),
				quantity: z.number().default(1),
				customPrice: z.number().optional(),
			})
		),
		discount: z.object({ type: z.enum(["percentage", "fixed"]), value: z.number() }).optional(),
		taxRate: z.number().optional(),
	}),
	execute: async ({ companyId, items, discount, taxRate }) => {
		const supabase = await createClient();

		const priceBookIds = items.filter((i) => i.priceBookItemId).map((i) => i.priceBookItemId);
		let priceBookItems: { id: string; name: string; unit_price: number; cost: number | null }[] = [];
		if (priceBookIds.length > 0) {
			const { data } = await supabase.from("price_book_items").select("id, name, unit_price, cost").in("id", priceBookIds);
			priceBookItems = data || [];
		}

		const lineItems = items.map((item) => {
			const pbItem = priceBookItems.find((p) => p.id === item.priceBookItemId);
			const unitPrice = item.customPrice || pbItem?.unit_price || 0;
			return {
				name: item.name || pbItem?.name || "Unknown Item",
				quantity: item.quantity,
				unitPrice,
				lineTotal: unitPrice * item.quantity,
			};
		});

		const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
		let discountAmount = 0;
		if (discount) {
			discountAmount = discount.type === "percentage" ? subtotal * (discount.value / 100) : discount.value;
		}
		const afterDiscount = subtotal - discountAmount;
		const taxAmount = afterDiscount * ((taxRate || 0) / 100);

		return {
			lineItems,
			subtotal,
			discount: discountAmount > 0 ? { ...discount, amount: discountAmount } : null,
			tax: { rate: taxRate || 0, amount: taxAmount },
			grandTotal: afterDiscount + taxAmount,
		};
	},
});

// ============================================================================
// SMART SCHEDULING TOOLS
// ============================================================================

/**
 * Suggest best technician for a job
 */
export const suggestTechnicianForJobTool = tool({
	description: "Suggest the best technician for a job based on skills, location, and availability",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		jobType: z.string(),
		requiredSkills: z.array(z.string()).optional(),
		preferredDate: z.string(),
	}),
	execute: async ({ companyId, jobType, requiredSkills, preferredDate }) => {
		try {
			const supabase = await createClient();

			const { data: technicians } = await supabase
				.from("company_memberships")
				.select("id, skills, preferred_job_types, user:users(first_name, last_name)")
				.eq("company_id", companyId)
				.eq("role", "technician");

			if (!technicians?.length) return { error: "No technicians found" };

			const dayStart = new Date(preferredDate);
			dayStart.setHours(0, 0, 0, 0);
			const dayEnd = new Date(preferredDate);
			dayEnd.setHours(23, 59, 59, 999);

			const { data: existingJobs } = await supabase
				.from("jobs")
				.select("assigned_to")
				.is("deleted_at", null)
				.in("assigned_to", technicians.map((t) => t.id))
				.gte("scheduled_start", dayStart.toISOString())
				.lte("scheduled_start", dayEnd.toISOString());

			const jobCounts: Record<string, number> = {};
			existingJobs?.forEach((j) => {
				if (j.assigned_to) jobCounts[j.assigned_to] = (jobCounts[j.assigned_to] || 0) + 1;
			});

			const scored = technicians.map((tech) => {
				let score = 0;
				const reasons: string[] = [];

				const techSkills = ((tech.skills as string[]) || []).map((s) => s.toLowerCase());
				const matchedSkills = (requiredSkills || []).filter((s) => techSkills.includes(s.toLowerCase()));
				if (matchedSkills.length > 0) {
					score += 40 * (matchedSkills.length / (requiredSkills?.length || 1));
					reasons.push(`Matches ${matchedSkills.length} skills`);
				}

				const preferredTypes = ((tech.preferred_job_types as string[]) || []).map((t) => t.toLowerCase());
				if (preferredTypes.includes(jobType.toLowerCase())) {
					score += 20;
					reasons.push("Prefers this job type");
				}

				const techJobs = jobCounts[tech.id] || 0;
				if (techJobs === 0) { score += 30; reasons.push("Fully available"); }
				else if (techJobs < 3) { score += 15; reasons.push(`${techJobs} jobs scheduled`); }

				return {
					id: tech.id,
					name: `${(tech.user as { first_name: string; last_name: string })?.first_name} ${(tech.user as { first_name: string; last_name: string })?.last_name}`,
					score: Math.round(score),
					reasons,
					jobsOnDate: techJobs,
				};
			});

			scored.sort((a, b) => b.score - a.score);
			return { recommendations: scored.slice(0, 5), bestMatch: scored[0] };
		} catch (err) {
			return { error: err instanceof Error ? err.message : "Failed to suggest technician" };
		}
	},
});

/**
 * Optimize job order for a technician's day
 */
export const optimizeJobOrderTool = tool({
	description: "Optimize the order of jobs for a technician to minimize travel time",
	parameters: z.object({
		companyId: z.string().describe("Company UUID"),
		technicianId: z.string(),
		date: z.string(),
	}),
	execute: async ({ technicianId, date }) => {
		try {
			const supabase = await createClient();

			const dayStart = new Date(date);
			dayStart.setHours(0, 0, 0, 0);
			const dayEnd = new Date(date);
			dayEnd.setHours(23, 59, 59, 999);

			const { data: jobs } = await supabase
				.from("jobs")
				.select("id, title, scheduled_start, priority, property:properties(address, city, latitude, longitude)")
				.eq("assigned_to", technicianId)
				.is("deleted_at", null)
				.gte("scheduled_start", dayStart.toISOString())
				.lte("scheduled_start", dayEnd.toISOString())
				.order("scheduled_start");

			if (!jobs || jobs.length < 2) return { message: "Not enough jobs to optimize", jobs: jobs || [] };

			const jobsWithCoords = jobs
				.filter((j) => (j.property as { latitude: number; longitude: number })?.latitude)
				.map((j) => ({
					...j,
					lat: (j.property as { latitude: number })?.latitude,
					lng: (j.property as { longitude: number })?.longitude,
				}));

			if (jobsWithCoords.length < 2) return { message: "Not enough jobs with location data", jobs };

			// Simple nearest-neighbor optimization
			const optimized: typeof jobsWithCoords = [];
			const remaining = [...jobsWithCoords];
			let current = { lat: jobsWithCoords[0].lat, lng: jobsWithCoords[0].lng };

			while (remaining.length > 0) {
				let nearestIdx = 0;
				let nearestDist = Infinity;
				remaining.forEach((job, idx) => {
					const dist = Math.sqrt(Math.pow(job.lat - current.lat, 2) + Math.pow(job.lng - current.lng, 2));
					const priorityBonus = job.priority === "high" ? 0.8 : 1;
					if (dist * priorityBonus < nearestDist) {
						nearestDist = dist * priorityBonus;
						nearestIdx = idx;
					}
				});
				const next = remaining.splice(nearestIdx, 1)[0];
				optimized.push(next);
				current = { lat: next.lat, lng: next.lng };
			}

			return {
				optimizedOrder: optimized.map((j, idx) => ({
					order: idx + 1,
					jobId: j.id,
					title: j.title,
					address: `${(j.property as { address: string; city: string })?.address}, ${(j.property as { address: string; city: string })?.city}`,
				})),
				jobCount: optimized.length,
			};
		} catch (err) {
			return { error: err instanceof Error ? err.message : "Failed to optimize job order" };
		}
	},
});

/**
 * Maps tool names to their destructive metadata.
 * Tools marked as destructive will be intercepted and require owner approval.
 */
export const destructiveTools: Record<string, DestructiveToolMetadata> = {
	// Communication tools - sending messages to external parties
	sendEmail: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Sends an email to a customer on behalf of your company",
		affectedEntityType: "customer",
	},
	sendSms: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Sends an SMS message to a customer on behalf of your company",
		affectedEntityType: "customer",
	},
	initiateCall: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "critical",
		requiresOwnerApproval: true,
		description: "Initiates a phone call to a customer",
		affectedEntityType: "customer",
	},
	sendTeamEmail: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "medium",
		requiresOwnerApproval: true,
		description: "Sends an internal email to a team member",
		affectedEntityType: "team_member",
	},
	sendTeamSms: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "medium",
		requiresOwnerApproval: true,
		description: "Sends an SMS to a team member",
		affectedEntityType: "team_member",
	},
	sendVendorEmail: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Sends an email to a vendor on behalf of your company",
		affectedEntityType: "vendor",
	},
	sendVendorSms: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Sends an SMS to a vendor on behalf of your company",
		affectedEntityType: "vendor",
	},
	sendImmediateNotification: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Sends an immediate notification to a recipient",
		affectedEntityType: "notification",
	},

	// Financial tools - money movement and financial records
	createInvoice: {
		isDestructive: true,
		actionType: "financial",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Creates a new invoice that will be sent to a customer",
		affectedEntityType: "invoice",
	},
	transferToBucket: {
		isDestructive: true,
		actionType: "financial",
		riskLevel: "critical",
		requiresOwnerApproval: true,
		description: "Transfers funds between financial buckets",
		affectedEntityType: "finance_bucket",
	},

	// Scheduling tools - affects customer commitments
	createAppointment: {
		isDestructive: true,
		actionType: "bulk_update",
		riskLevel: "medium",
		requiresOwnerApproval: true,
		description: "Creates a new appointment which commits company resources",
		affectedEntityType: "appointment",
	},
	cancelReminder: {
		isDestructive: true,
		actionType: "delete",
		riskLevel: "low",
		requiresOwnerApproval: true,
		description: "Cancels a scheduled reminder",
		affectedEntityType: "reminder",
	},

	// Data modification tools
	updateCustomer: {
		isDestructive: true,
		actionType: "bulk_update",
		riskLevel: "medium",
		requiresOwnerApproval: true,
		description: "Modifies customer record information",
		affectedEntityType: "customer",
	},
};

/**
 * Check if a tool is destructive and requires owner approval
 */
export function isDestructiveTool(toolName: string): boolean {
	return toolName in destructiveTools;
}

/**
 * Get the metadata for a destructive tool
 */
export function getDestructiveToolMetadata(toolName: string): DestructiveToolMetadata | null {
	return destructiveTools[toolName] || null;
}

/**
 * Get all destructive tool names
 */
export function getDestructiveToolNames(): string[] {
	return Object.keys(destructiveTools);
}
