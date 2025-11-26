/**
 * Plaid Verification Status API Route
 *
 * Checks bank account connection and verification status via Plaid.
 * Used by PlaidVerificationTracker component to show real-time status.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const companyId = searchParams.get("companyId");
		const itemId = searchParams.get("itemId");

		if (!companyId) {
			return NextResponse.json(
				{ success: false, error: "Company ID is required" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// Query bank accounts for this company
		const { data: bankAccounts, error } = await supabase
			.from("finance_bank_accounts")
			.select("*")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Failed to fetch bank accounts:", error);
			return NextResponse.json(
				{ success: false, error: "Failed to fetch bank accounts" },
				{ status: 500 },
			);
		}

		// If itemId is provided, filter to that specific Plaid connection
		const filteredAccounts = itemId
			? bankAccounts?.filter((account) => account.plaid_item_id === itemId)
			: bankAccounts;

		if (!filteredAccounts || filteredAccounts.length === 0) {
			return NextResponse.json({
				success: true,
				status: "connecting",
				accounts: [],
				allVerified: false,
			});
		}

		// Map accounts to tracker format
		const accounts = filteredAccounts.map((account) => ({
			id: account.id,
			name: account.account_name || account.institution_name || "Bank Account",
			mask: account.account_last4 || "****",
			type: account.account_type || "checking",
			subtype: account.account_subtype || "",
			verified: account.verification_status === "verified",
			verificationStatus: account.verification_status || "pending",
		}));

		const verifiedCount = accounts.filter((a) => a.verified).length;
		const allVerified = verifiedCount === accounts.length;
		const hasFailed = accounts.some((a) => a.verificationStatus === "failed");

		// Determine overall status
		let status = "verifying";
		if (allVerified) {
			status = "verified";
		} else if (hasFailed) {
			status = "failed";
		} else if (accounts.length === 0) {
			status = "connecting";
		}

		return NextResponse.json({
			success: true,
			status,
			accounts,
			allVerified,
			verifiedCount,
			totalCount: accounts.length,
		});
	} catch (error) {
		console.error("Plaid status API error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
