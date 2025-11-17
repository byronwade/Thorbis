/**
 * Finance Settings Server Actions
 *
 * Handles all finance-related settings including accounting, bookkeeping,
 * bank accounts, financing, cards, and virtual buckets
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCompanyId(supabase: any, userId: string): Promise<string> {
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", userId)
		.eq("status", "active")
		.single();

	if (!teamMember?.company_id) {
		throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
	}

	return teamMember.company_id;
}

// ============================================================================
// ACCOUNTING SETTINGS
// ============================================================================

const accountingSettingsSchema = z.object({
	provider: z.enum(["quickbooks", "xero", "sage", "freshbooks", "manual", "none"]).optional(),
	providerEnabled: z.boolean().default(false),
	apiKey: z.string().optional(),
	apiSecret: z.string().optional(),
	autoSyncEnabled: z.boolean().default(false),
	syncFrequency: z.enum(["realtime", "hourly", "daily", "weekly", "manual"]).default("daily"),
	incomeAccount: z.string().optional(),
	expenseAccount: z.string().optional(),
	assetAccount: z.string().optional(),
	liabilityAccount: z.string().optional(),
	syncInvoices: z.boolean().default(true),
	syncPayments: z.boolean().default(true),
	syncExpenses: z.boolean().default(true),
	syncCustomers: z.boolean().default(true),
});

export async function updateAccountingSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = accountingSettingsSchema.parse({
			provider: formData.get("provider") || undefined,
			providerEnabled: formData.get("providerEnabled") === "true",
			apiKey: formData.get("apiKey") || undefined,
			apiSecret: formData.get("apiSecret") || undefined,
			autoSyncEnabled: formData.get("autoSyncEnabled") === "true",
			syncFrequency: formData.get("syncFrequency") || "daily",
			incomeAccount: formData.get("incomeAccount") || undefined,
			expenseAccount: formData.get("expenseAccount") || undefined,
			assetAccount: formData.get("assetAccount") || undefined,
			liabilityAccount: formData.get("liabilityAccount") || undefined,
			syncInvoices: formData.get("syncInvoices") !== "false",
			syncPayments: formData.get("syncPayments") !== "false",
			syncExpenses: formData.get("syncExpenses") !== "false",
			syncCustomers: formData.get("syncCustomers") !== "false",
		});

		// Encrypt API credentials
		const encryptedApiKey = data.apiKey ? Buffer.from(data.apiKey).toString("base64") : null;
		const encryptedApiSecret = data.apiSecret
			? Buffer.from(data.apiSecret).toString("base64")
			: null;

		const { error } = await supabase.from("finance_accounting_settings").upsert({
			company_id: companyId,
			provider: data.provider,
			provider_enabled: data.providerEnabled,
			api_key_encrypted: encryptedApiKey,
			api_secret_encrypted: encryptedApiSecret,
			auto_sync_enabled: data.autoSyncEnabled,
			sync_frequency: data.syncFrequency,
			income_account: data.incomeAccount,
			expense_account: data.expenseAccount,
			asset_account: data.assetAccount,
			liability_account: data.liabilityAccount,
			sync_invoices: data.syncInvoices,
			sync_payments: data.syncPayments,
			sync_expenses: data.syncExpenses,
			sync_customers: data.syncCustomers,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update accounting settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/accounting");
	});
}

export async function getAccountingSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_accounting_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch accounting settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// BOOKKEEPING SETTINGS
// ============================================================================

const bookkeepingSettingsSchema = z.object({
	autoCategorizeTransactions: z.boolean().default(true),
	autoReconcilePayments: z.boolean().default(false),
	autoGenerateReports: z.boolean().default(false),
	defaultIncomeCategory: z.string().default("Service Revenue"),
	defaultExpenseCategory: z.string().default("Operating Expenses"),
	defaultTaxCategory: z.string().default("Sales Tax"),
	reportFrequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]).default("monthly"),
	emailReports: z.boolean().default(false),
	reportRecipients: z.string().optional(),
	fiscalYearStartMonth: z.coerce.number().min(1).max(12).default(1),
	fiscalYearStartDay: z.coerce.number().min(1).max(31).default(1),
	requireReceiptAttachment: z.boolean().default(false),
	allowManualJournalEntries: z.boolean().default(false),
});

export async function updateBookkeepingSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const reportRecipientsStr = formData.get("reportRecipients") as string;
		const reportRecipients = reportRecipientsStr
			? reportRecipientsStr.split(",").map((email) => email.trim())
			: [];

		const data = bookkeepingSettingsSchema.parse({
			autoCategorizeTransactions: formData.get("autoCategorizeTransactions") !== "false",
			autoReconcilePayments: formData.get("autoReconcilePayments") === "true",
			autoGenerateReports: formData.get("autoGenerateReports") === "true",
			defaultIncomeCategory: formData.get("defaultIncomeCategory") || "Service Revenue",
			defaultExpenseCategory: formData.get("defaultExpenseCategory") || "Operating Expenses",
			defaultTaxCategory: formData.get("defaultTaxCategory") || "Sales Tax",
			reportFrequency: formData.get("reportFrequency") || "monthly",
			emailReports: formData.get("emailReports") === "true",
			fiscalYearStartMonth: formData.get("fiscalYearStartMonth") || "1",
			fiscalYearStartDay: formData.get("fiscalYearStartDay") || "1",
			requireReceiptAttachment: formData.get("requireReceiptAttachment") === "true",
			allowManualJournalEntries: formData.get("allowManualJournalEntries") === "true",
		});

		const { error } = await supabase.from("finance_bookkeeping_settings").upsert({
			company_id: companyId,
			auto_categorize_transactions: data.autoCategorizeTransactions,
			auto_reconcile_payments: data.autoReconcilePayments,
			auto_generate_reports: data.autoGenerateReports,
			default_income_category: data.defaultIncomeCategory,
			default_expense_category: data.defaultExpenseCategory,
			default_tax_category: data.defaultTaxCategory,
			report_frequency: data.reportFrequency,
			email_reports: data.emailReports,
			report_recipients: reportRecipients,
			fiscal_year_start_month: data.fiscalYearStartMonth,
			fiscal_year_start_day: data.fiscalYearStartDay,
			require_receipt_attachment: data.requireReceiptAttachment,
			allow_manual_journal_entries: data.allowManualJournalEntries,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update bookkeeping settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/bookkeeping");
	});
}

export async function getBookkeepingSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_bookkeeping_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch bookkeeping settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// BANK ACCOUNTS
// ============================================================================

const bankAccountSchema = z.object({
	accountName: z.string().min(1, "Account name is required"),
	bankName: z.string().min(1, "Bank name is required"),
	accountType: z
		.enum(["checking", "savings", "business_checking", "credit_card"])
		.default("checking"),
	accountNumberLast4: z.string().max(4).optional(),
	currentBalance: z.coerce.number().default(0),
	availableBalance: z.coerce.number().default(0),
	autoImportTransactions: z.boolean().default(false),
	isActive: z.boolean().default(true),
	isPrimary: z.boolean().default(false),
});

export async function createBankAccount(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = bankAccountSchema.parse({
			accountName: formData.get("accountName"),
			bankName: formData.get("bankName"),
			accountType: formData.get("accountType") || "checking",
			accountNumberLast4: formData.get("accountNumberLast4") || undefined,
			currentBalance: formData.get("currentBalance") || "0",
			availableBalance: formData.get("availableBalance") || "0",
			autoImportTransactions: formData.get("autoImportTransactions") === "true",
			isActive: formData.get("isActive") !== "false",
			isPrimary: formData.get("isPrimary") === "true",
		});

		const { error } = await supabase.from("finance_bank_accounts").insert({
			company_id: companyId,
			account_name: data.accountName,
			bank_name: data.bankName,
			account_type: data.accountType,
			account_number_last4: data.accountNumberLast4,
			current_balance: data.currentBalance,
			available_balance: data.availableBalance,
			auto_import_transactions: data.autoImportTransactions,
			is_active: data.isActive,
			is_primary: data.isPrimary,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create bank account"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/bank-accounts");
	});
}

export async function updateBankAccount(
	accountId: string,
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = bankAccountSchema.parse({
			accountName: formData.get("accountName"),
			bankName: formData.get("bankName"),
			accountType: formData.get("accountType") || "checking",
			accountNumberLast4: formData.get("accountNumberLast4") || undefined,
			currentBalance: formData.get("currentBalance") || "0",
			availableBalance: formData.get("availableBalance") || "0",
			autoImportTransactions: formData.get("autoImportTransactions") === "true",
			isActive: formData.get("isActive") !== "false",
			isPrimary: formData.get("isPrimary") === "true",
		});

		const { error } = await supabase
			.from("finance_bank_accounts")
			.update({
				account_name: data.accountName,
				bank_name: data.bankName,
				account_type: data.accountType,
				account_number_last4: data.accountNumberLast4,
				current_balance: data.currentBalance,
				available_balance: data.availableBalance,
				auto_import_transactions: data.autoImportTransactions,
				is_active: data.isActive,
				is_primary: data.isPrimary,
			})
			.eq("id", accountId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update bank account"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/bank-accounts");
	});
}

export async function deleteBankAccount(accountId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { error } = await supabase
			.from("finance_bank_accounts")
			.delete()
			.eq("id", accountId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("delete bank account"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/bank-accounts");
	});
}

/**
 * Get the current user's company ID
 */
export async function getUserCompanyId(): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);
		return companyId;
	});
}

export async function getBankAccounts(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		// Get bank accounts with payment processor connections
		const { data, error } = await supabase
			.from("finance_bank_accounts")
			.select(
				`
        *,
        payment_processors:company_payment_processors!bank_account_id(
          id,
          processor_type,
          status
        )
      `
			)
			.eq("company_id", companyId)
			.order("is_primary", { ascending: false })
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch bank accounts"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

/**
 * Get the primary bank account for a company
 */
export async function getPrimaryBankAccount(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		// First try to get primary account
		const { data: primaryAccount } = await supabase
			.from("finance_bank_accounts")
			.select("*")
			.eq("company_id", companyId)
			.eq("is_primary", true)
			.eq("is_active", true)
			.single();

		if (primaryAccount) {
			return primaryAccount;
		}

		// If no primary, get first active account
		const { data: activeAccount } = await supabase
			.from("finance_bank_accounts")
			.select("*")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		return activeAccount || null;
	});
}

// ============================================================================
// BUSINESS FINANCING SETTINGS
// ============================================================================

const businessFinancingSchema = z.object({
	enableBusinessLoans: z.boolean().default(false),
	enableLineOfCredit: z.boolean().default(false),
	enableEquipmentFinancing: z.boolean().default(false),
	financingProvider: z.string().optional(),
	providerApiKey: z.string().optional(),
	autoCalculateEligibility: z.boolean().default(false),
	showOffersInDashboard: z.boolean().default(true),
	annualRevenue: z.coerce.number().optional(),
	yearsInBusiness: z.coerce.number().optional(),
	businessCreditScore: z.coerce.number().min(300).max(850).optional(),
	preferredLoanAmount: z.coerce.number().optional(),
	preferredTermMonths: z.coerce.number().optional(),
	maxAcceptableApr: z.coerce.number().optional(),
});

export async function updateBusinessFinancingSettings(
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = businessFinancingSchema.parse({
			enableBusinessLoans: formData.get("enableBusinessLoans") === "true",
			enableLineOfCredit: formData.get("enableLineOfCredit") === "true",
			enableEquipmentFinancing: formData.get("enableEquipmentFinancing") === "true",
			financingProvider: formData.get("financingProvider") || undefined,
			providerApiKey: formData.get("providerApiKey") || undefined,
			autoCalculateEligibility: formData.get("autoCalculateEligibility") === "true",
			showOffersInDashboard: formData.get("showOffersInDashboard") !== "false",
			annualRevenue: formData.get("annualRevenue") || undefined,
			yearsInBusiness: formData.get("yearsInBusiness") || undefined,
			businessCreditScore: formData.get("businessCreditScore") || undefined,
			preferredLoanAmount: formData.get("preferredLoanAmount") || undefined,
			preferredTermMonths: formData.get("preferredTermMonths") || undefined,
			maxAcceptableApr: formData.get("maxAcceptableApr") || undefined,
		});

		const encryptedApiKey = data.providerApiKey
			? Buffer.from(data.providerApiKey).toString("base64")
			: null;

		const { error } = await supabase.from("finance_business_financing_settings").upsert({
			company_id: companyId,
			enable_business_loans: data.enableBusinessLoans,
			enable_line_of_credit: data.enableLineOfCredit,
			enable_equipment_financing: data.enableEquipmentFinancing,
			financing_provider: data.financingProvider,
			provider_api_key_encrypted: encryptedApiKey,
			auto_calculate_eligibility: data.autoCalculateEligibility,
			show_offers_in_dashboard: data.showOffersInDashboard,
			annual_revenue: data.annualRevenue,
			years_in_business: data.yearsInBusiness,
			business_credit_score: data.businessCreditScore,
			preferred_loan_amount: data.preferredLoanAmount,
			preferred_term_months: data.preferredTermMonths,
			max_acceptable_apr: data.maxAcceptableApr,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update business financing settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/business-financing");
	});
}

export async function getBusinessFinancingSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_business_financing_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch business financing settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// CONSUMER FINANCING SETTINGS
// ============================================================================

const consumerFinancingSchema = z.object({
	financingEnabled: z.boolean().default(false),
	provider: z.enum(["affirm", "wisetack", "greensky", "servicefinance", "other"]).optional(),
	providerApiKey: z.string().optional(),
	providerMerchantId: z.string().optional(),
	minAmount: z.coerce.number().default(500),
	maxAmount: z.coerce.number().default(25_000),
	availableTerms: z.string().optional(), // Comma-separated numbers
	showInEstimates: z.boolean().default(true),
	showInInvoices: z.boolean().default(true),
	showMonthlyPayment: z.boolean().default(true),
	promoteFinancing: z.boolean().default(true),
	allowInstantApproval: z.boolean().default(true),
	requireCreditCheck: z.boolean().default(true),
	collectSsn: z.boolean().default(false),
	marketingMessage: z.string().default("Finance your service with flexible payment plans"),
});

export async function updateConsumerFinancingSettings(
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const termsStr = formData.get("availableTerms") as string;
		const availableTerms = termsStr
			? termsStr.split(",").map((term) => Number.parseInt(term.trim(), 10))
			: [6, 12, 24, 36, 48, 60];

		const data = consumerFinancingSchema.parse({
			financingEnabled: formData.get("financingEnabled") === "true",
			provider: formData.get("provider") || undefined,
			providerApiKey: formData.get("providerApiKey") || undefined,
			providerMerchantId: formData.get("providerMerchantId") || undefined,
			minAmount: formData.get("minAmount") || "500",
			maxAmount: formData.get("maxAmount") || "25000",
			showInEstimates: formData.get("showInEstimates") !== "false",
			showInInvoices: formData.get("showInInvoices") !== "false",
			showMonthlyPayment: formData.get("showMonthlyPayment") !== "false",
			promoteFinancing: formData.get("promoteFinancing") !== "false",
			allowInstantApproval: formData.get("allowInstantApproval") !== "false",
			requireCreditCheck: formData.get("requireCreditCheck") !== "false",
			collectSsn: formData.get("collectSsn") === "true",
			marketingMessage:
				formData.get("marketingMessage") || "Finance your service with flexible payment plans",
		});

		const encryptedApiKey = data.providerApiKey
			? Buffer.from(data.providerApiKey).toString("base64")
			: null;

		const { error } = await supabase.from("finance_consumer_financing_settings").upsert({
			company_id: companyId,
			financing_enabled: data.financingEnabled,
			provider: data.provider,
			provider_api_key_encrypted: encryptedApiKey,
			provider_merchant_id: data.providerMerchantId,
			min_amount: data.minAmount,
			max_amount: data.maxAmount,
			available_terms: availableTerms,
			show_in_estimates: data.showInEstimates,
			show_in_invoices: data.showInInvoices,
			show_monthly_payment: data.showMonthlyPayment,
			promote_financing: data.promoteFinancing,
			allow_instant_approval: data.allowInstantApproval,
			require_credit_check: data.requireCreditCheck,
			collect_ssn: data.collectSsn,
			marketing_message: data.marketingMessage,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update consumer financing settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/consumer-financing");
	});
}

export async function getConsumerFinancingSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_consumer_financing_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch consumer financing settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// DEBIT CARD SETTINGS
// ============================================================================

export async function getDebitCards(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_debit_cards")
			.select("*, team_members(name, email)")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch debit cards"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// ============================================================================
// GAS CARD SETTINGS
// ============================================================================

export async function getGasCards(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_gas_cards")
			.select("*, team_members(name, email)")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch gas cards"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// ============================================================================
// GIFT CARD SETTINGS
// ============================================================================

const giftCardSettingsSchema = z.object({
	giftCardsEnabled: z.boolean().default(false),
	programName: z.string().default("Gift Cards"),
	fixedDenominations: z.boolean().default(true),
	availableAmounts: z.string().optional(), // Comma-separated numbers
	minCustomAmount: z.coerce.number().default(10),
	maxCustomAmount: z.coerce.number().default(1000),
	allowOnlinePurchase: z.boolean().default(true),
	allowInPersonPurchase: z.boolean().default(true),
	requireRecipientEmail: z.boolean().default(false),
	cardsExpire: z.boolean().default(false),
	expirationMonths: z.coerce.number().default(24),
	sendExpirationReminder: z.boolean().default(true),
	reminderDaysBefore: z.coerce.number().default(30),
	allowPartialRedemption: z.boolean().default(true),
	allowMultipleCardsPerTransaction: z.boolean().default(true),
	combineWithOtherDiscounts: z.boolean().default(false),
	allowCustomMessage: z.boolean().default(true),
	maxMessageLength: z.coerce.number().default(200),
	trackRedemptionAnalytics: z.boolean().default(true),
});

export async function updateGiftCardSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const amountsStr = formData.get("availableAmounts") as string;
		const availableAmounts = amountsStr
			? amountsStr.split(",").map((amount) => Number.parseFloat(amount.trim()))
			: [25, 50, 100, 250, 500];

		const data = giftCardSettingsSchema.parse({
			giftCardsEnabled: formData.get("giftCardsEnabled") === "true",
			programName: formData.get("programName") || "Gift Cards",
			fixedDenominations: formData.get("fixedDenominations") !== "false",
			minCustomAmount: formData.get("minCustomAmount") || "10",
			maxCustomAmount: formData.get("maxCustomAmount") || "1000",
			allowOnlinePurchase: formData.get("allowOnlinePurchase") !== "false",
			allowInPersonPurchase: formData.get("allowInPersonPurchase") !== "false",
			requireRecipientEmail: formData.get("requireRecipientEmail") === "true",
			cardsExpire: formData.get("cardsExpire") === "true",
			expirationMonths: formData.get("expirationMonths") || "24",
			sendExpirationReminder: formData.get("sendExpirationReminder") !== "false",
			reminderDaysBefore: formData.get("reminderDaysBefore") || "30",
			allowPartialRedemption: formData.get("allowPartialRedemption") !== "false",
			allowMultipleCardsPerTransaction:
				formData.get("allowMultipleCardsPerTransaction") !== "false",
			combineWithOtherDiscounts: formData.get("combineWithOtherDiscounts") === "true",
			allowCustomMessage: formData.get("allowCustomMessage") !== "false",
			maxMessageLength: formData.get("maxMessageLength") || "200",
			trackRedemptionAnalytics: formData.get("trackRedemptionAnalytics") !== "false",
		});

		const { error } = await supabase.from("finance_gift_card_settings").upsert({
			company_id: companyId,
			gift_cards_enabled: data.giftCardsEnabled,
			program_name: data.programName,
			fixed_denominations: data.fixedDenominations,
			available_amounts: availableAmounts,
			min_custom_amount: data.minCustomAmount,
			max_custom_amount: data.maxCustomAmount,
			allow_online_purchase: data.allowOnlinePurchase,
			allow_in_person_purchase: data.allowInPersonPurchase,
			require_recipient_email: data.requireRecipientEmail,
			cards_expire: data.cardsExpire,
			expiration_months: data.expirationMonths,
			send_expiration_reminder: data.sendExpirationReminder,
			reminder_days_before: data.reminderDaysBefore,
			allow_partial_redemption: data.allowPartialRedemption,
			allow_multiple_cards_per_transaction: data.allowMultipleCardsPerTransaction,
			combine_with_other_discounts: data.combineWithOtherDiscounts,
			allow_custom_message: data.allowCustomMessage,
			max_message_length: data.maxMessageLength,
			track_redemption_analytics: data.trackRedemptionAnalytics,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update gift card settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/gift-cards");
	});
}

export async function getGiftCardSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_gift_card_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch gift card settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// VIRTUAL BUCKET SETTINGS
// ============================================================================

const virtualBucketSettingsSchema = z.object({
	virtualBucketsEnabled: z.boolean().default(false),
	autoAllocateFunds: z.boolean().default(false),
	allocationFrequency: z.enum(["daily", "weekly", "biweekly", "monthly"]).default("weekly"),
	operatingExpensesPercentage: z.coerce.number().default(50),
	taxReservePercentage: z.coerce.number().default(25),
	profitPercentage: z.coerce.number().default(15),
	emergencyFundPercentage: z.coerce.number().default(10),
	minOperatingBalance: z.coerce.number().default(5000),
	emergencyFundTarget: z.coerce.number().default(10_000),
	notifyLowBalance: z.boolean().default(true),
	lowBalanceThreshold: z.coerce.number().default(1000),
	notifyBucketGoalsMet: z.boolean().default(true),
});

export async function updateVirtualBucketSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = virtualBucketSettingsSchema.parse({
			virtualBucketsEnabled: formData.get("virtualBucketsEnabled") === "true",
			autoAllocateFunds: formData.get("autoAllocateFunds") === "true",
			allocationFrequency: formData.get("allocationFrequency") || "weekly",
			operatingExpensesPercentage: formData.get("operatingExpensesPercentage") || "50",
			taxReservePercentage: formData.get("taxReservePercentage") || "25",
			profitPercentage: formData.get("profitPercentage") || "15",
			emergencyFundPercentage: formData.get("emergencyFundPercentage") || "10",
			minOperatingBalance: formData.get("minOperatingBalance") || "5000",
			emergencyFundTarget: formData.get("emergencyFundTarget") || "10000",
			notifyLowBalance: formData.get("notifyLowBalance") !== "false",
			lowBalanceThreshold: formData.get("lowBalanceThreshold") || "1000",
			notifyBucketGoalsMet: formData.get("notifyBucketGoalsMet") !== "false",
		});

		const { error } = await supabase.from("finance_virtual_bucket_settings").upsert({
			company_id: companyId,
			virtual_buckets_enabled: data.virtualBucketsEnabled,
			auto_allocate_funds: data.autoAllocateFunds,
			allocation_frequency: data.allocationFrequency,
			operating_expenses_percentage: data.operatingExpensesPercentage,
			tax_reserve_percentage: data.taxReservePercentage,
			profit_percentage: data.profitPercentage,
			emergency_fund_percentage: data.emergencyFundPercentage,
			min_operating_balance: data.minOperatingBalance,
			emergency_fund_target: data.emergencyFundTarget,
			notify_low_balance: data.notifyLowBalance,
			low_balance_threshold: data.lowBalanceThreshold,
			notify_bucket_goals_met: data.notifyBucketGoalsMet,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update virtual bucket settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/finance/virtual-buckets");
	});
}

export async function getVirtualBucketSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_virtual_bucket_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch virtual bucket settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

export async function getVirtualBuckets(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("finance_virtual_buckets")
			.select("*")
			.eq("company_id", companyId)
			.order("display_order", { ascending: true });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch virtual buckets"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}
