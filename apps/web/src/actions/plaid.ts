/**
 * Plaid Server Actions
 *
 * Handle bank account linking, token exchange, and transaction synchronization
 * via Plaid's API. All actions validate company ownership and handle errors.
 */

"use server";

import { revalidatePath } from "next/cache";
import {
	decryptTokenSafe,
	encryptTokenSafe,
} from "@/lib/email/token-encryption";
import {
	ActionError,
	type ActionResult,
	assertAuthenticated,
	assertSupabase,
	ERROR_CODES,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { plaidClient } from "@/lib/payments/plaid-client";
import { createClient } from "@/lib/supabase/server";

function formatAccountName(account: any): string {
	const base =
		account.official_name?.trim() ||
		account.name?.trim() ||
		account.subtype?.replace(/_/g, " ").trim() ||
		"Bank Account";

	if (account.mask) {
		// Mask is typically last 4 digits
		return `${base} ••••${account.mask}`;
	}

	return base;
}

/**
 * Create a Plaid Link token for initiating bank account connection
 */
async function createPlaidLinkToken(
	companyId: string,
): Promise<ActionResult<{ linkToken: string }>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		assertSupabase(supabase);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Verify user belongs to company
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("*")
			.eq("company_id", companyId)
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership) {
			throw new ActionError(
				"You do not have access to this company",
				ERROR_CODES.UNAUTHORIZED,
			);
		}

		// Get company details
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("name")
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			throw new ActionError(
				`Company not found: ${companyError?.message}`,
				ERROR_CODES.NOT_FOUND,
			);
		}

		// Create Plaid Link token
		try {
			const linkTokenConfig: any = {
				user: { client_user_id: companyId },
				client_name: company.name || "Thorbis",
				products: ["auth", "transactions"],
				country_codes: ["US"],
				language: "en",
			};

			// Note: redirect_uri is optional for hosted Plaid Link flow
			// If you want to use OAuth redirect, add the URI to your Plaid dashboard first
			// Then uncomment below:
			// if (process.env.NEXT_PUBLIC_SITE_URL) {
			//   linkTokenConfig.redirect_uri = `${process.env.NEXT_PUBLIC_SITE_URL}/settings/finance/bank-accounts`;
			// }

			const response = await plaidClient.linkTokenCreate(linkTokenConfig);

			return { linkToken: response.data.link_token };
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error_message ||
				error.message ||
				"Failed to create Plaid Link token";

			throw new ActionError(errorMessage, ERROR_CODES.EXTERNAL_API_ERROR);
		}
	});
}

/**
 * Exchange Plaid public token for access token and fetch account data
 */
async function exchangePlaidToken(
	publicToken: string,
	companyId: string,
	metadata: any,
): Promise<ActionResult<{ accountsLinked: number }>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		assertSupabase(supabase);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Verify user belongs to company
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("*")
			.eq("company_id", companyId)
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership) {
			throw new ActionError(
				"You do not have access to this company",
				ERROR_CODES.UNAUTHORIZED,
			);
		}

		try {
			// Exchange public token for access token
			const tokenResponse = await plaidClient.itemPublicTokenExchange({
				public_token: publicToken,
			});

			const accessToken = tokenResponse.data.access_token;
			const itemId = tokenResponse.data.item_id;

			// Fetch account details
			const accountsResponse = await plaidClient.accountsGet({
				access_token: accessToken,
			});
			const accounts = accountsResponse.data.accounts;

			// Fetch auth details (routing/account numbers)
			const authResponse = await plaidClient.authGet({
				access_token: accessToken,
			});

			// Store each account in database
			for (const account of accounts) {
				const authData = authResponse.data.numbers.ach?.find(
					(a) => a.account_id === account.account_id,
				);
				const accountName = formatAccountName(account);
				const bankName =
					metadata?.institution?.name ||
					account.official_name ||
					account.name ||
					"Unknown Bank";

				const { error: insertError } = await supabase
					.from("finance_bank_accounts")
					.insert({
						company_id: companyId,
						account_name: accountName,
						bank_name: bankName,
						account_type: account.subtype || "checking",
						account_number_last4: account.mask || null,
						routing_number_encrypted: authData?.routing
							? encryptTokenSafe(authData.routing)
							: null,
						current_balance: account.balances.current,
						available_balance: account.balances.available,
						plaid_access_token_encrypted: encryptTokenSafe(accessToken),
						plaid_item_id: itemId,
						plaid_account_id: account.account_id,
						auto_import_transactions: true,
						is_active: true,
					});

				if (insertError) {
					if (insertError.code === "23505") {
						const { error: updateError } = await supabase
							.from("finance_bank_accounts")
							.update({
								bank_name: bankName,
								account_type: account.subtype || "checking",
								account_number_last4: account.mask || null,
								routing_number_encrypted: authData?.routing
									? encryptTokenSafe(authData.routing)
									: null,
								current_balance: account.balances.current,
								available_balance: account.balances.available,
								plaid_access_token_encrypted: encryptTokenSafe(accessToken),
								plaid_item_id: itemId,
								plaid_account_id: account.account_id,
								auto_import_transactions: true,
								is_active: true,
								updated_at: new Date().toISOString(),
							})
							.eq("company_id", companyId)
							.eq("account_name", accountName);

						if (updateError) {
							throw new ActionError(
								`Failed to update bank account: ${updateError.message}`,
								ERROR_CODES.DB_UPDATE_ERROR,
							);
						}
					} else {
						throw new ActionError(
							`Failed to save bank account: ${insertError.message}`,
							ERROR_CODES.DB_INSERT_ERROR,
						);
					}
				}
			}

			// Trigger initial transaction sync
			await syncTransactions(companyId, accessToken);

			revalidatePath("/dashboard/settings/finance/bank-accounts");
			revalidatePath("/welcome");

			return { accountsLinked: accounts.length };
		} catch (error: any) {
			throw new ActionError(
				error.message || "Failed to link bank account",
				ERROR_CODES.EXTERNAL_API_ERROR,
			);
		}
	});
}

/**
 * Sync transactions from Plaid for a company's bank accounts
 */
export async function syncTransactions(
	companyId: string,
	accessToken?: string,
): Promise<ActionResult<{ synced: number }>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		assertSupabase(supabase);

		// If called from server, skip auth check
		// If called from client, verify user belongs to company
		if (!accessToken) {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			assertAuthenticated(user?.id);

			const { data: membership } = await supabase
				.from("company_memberships")
				.select("*")
				.eq("company_id", companyId)
				.eq("user_id", user.id)
				.eq("status", "active")
				.single();

			if (!membership) {
				throw new ActionError(
					"You do not have access to this company",
					ERROR_CODES.UNAUTHORIZED,
				);
			}
		}

		// Get all accounts for company with Plaid access tokens
		const { data: accounts, error: accountsError } = await supabase
			.from("finance_bank_accounts")
			.select("*")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.not("plaid_access_token_encrypted", "is", null);

		if (accountsError) {
			throw new ActionError(
				`Failed to fetch bank accounts: ${accountsError.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		if (!accounts || accounts.length === 0) {
			return { synced: 0 };
		}

		let totalSynced = 0;

		for (const account of accounts) {
			try {
				// Decrypt the stored access token (or use provided one if available)
				const token =
					accessToken || decryptTokenSafe(account.plaid_access_token_encrypted);

				// Determine start date (last synced or 90 days ago)
				const startDate = account.last_synced_at
					? new Date(account.last_synced_at).toISOString().split("T")[0]
					: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
							.toISOString()
							.split("T")[0];

				const endDate = new Date().toISOString().split("T")[0];

				// Fetch transactions from Plaid
				const response = await plaidClient.transactionsGet({
					access_token: token,
					start_date: startDate,
					end_date: endDate,
					options: { account_ids: [account.plaid_account_id] },
				});

				// Upsert transactions
				for (const txn of response.data.transactions) {
					await supabase.from("finance_bank_transactions").upsert(
						{
							bank_account_id: account.id,
							company_id: companyId,
							plaid_transaction_id: txn.transaction_id,
							date: txn.date,
							amount: txn.amount,
							description: txn.name,
							merchant_name: txn.merchant_name || null,
							category_id: txn.category_id || null,
							category_name: txn.category?.[0] || null,
							pending: txn.pending,
							iso_currency_code: txn.iso_currency_code || "USD",
						},
						{ onConflict: "plaid_transaction_id" },
					);
				}

				totalSynced += response.data.transactions.length;

				// Update last synced time and balances
				const balancesResponse = await plaidClient.accountsBalanceGet({
					access_token: token,
					options: { account_ids: [account.plaid_account_id] },
				});

				const updatedAccount = balancesResponse.data.accounts[0];
				if (updatedAccount) {
					await supabase
						.from("finance_bank_accounts")
						.update({
							last_synced_at: new Date().toISOString(),
							current_balance: updatedAccount.balances.current,
							available_balance: updatedAccount.balances.available,
						})
						.eq("id", account.id);
				}
			} catch (_error: any) {
				// Continue with other accounts even if one fails
			}
		}

		revalidatePath("/dashboard/settings/finance/bank-accounts");

		return { synced: totalSynced };
	});
}

/**
 * Get transactions for a specific bank account
 */
async function getTransactions(
	bankAccountId: string,
	options?: {
		startDate?: string;
		endDate?: string;
		search?: string;
		limit?: number;
	},
): Promise<
	ActionResult<{
		transactions: any[];
		total: number;
	}>
> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		assertSupabase(supabase);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Verify user has access to this bank account
		const { data: account } = await supabase
			.from("finance_bank_accounts")
			.select("company_id")
			.eq("id", bankAccountId)
			.single();

		if (!account) {
			throw new ActionError("Bank account not found", ERROR_CODES.NOT_FOUND);
		}

		const { data: membership } = await supabase
			.from("company_memberships")
			.select("*")
			.eq("company_id", account.company_id)
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership) {
			throw new ActionError(
				"You do not have access to this bank account",
				ERROR_CODES.UNAUTHORIZED,
			);
		}

		// Build query
		let query = supabase
			.from("finance_bank_transactions")
			.select("*", { count: "exact" })
			.eq("bank_account_id", bankAccountId)
			.order("date", { ascending: false });

		if (options?.startDate) {
			query = query.gte("date", options.startDate);
		}

		if (options?.endDate) {
			query = query.lte("date", options.endDate);
		}

		if (options?.search) {
			query = query.or(
				`description.ilike.%${options.search}%,merchant_name.ilike.%${options.search}%`,
			);
		}

		if (options?.limit) {
			query = query.limit(options.limit);
		} else {
			query = query.limit(100); // Default limit
		}

		const { data: transactions, error, count } = await query;

		if (error) {
			throw new ActionError(
				`Failed to fetch transactions: ${error.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		return {
			transactions: transactions || [],
			total: count || 0,
		};
	});
}
