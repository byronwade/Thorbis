/**
 * Payrix Server Actions
 *
 * Server-side actions for Payrix merchant boarding and payment processing
 */

"use server";

import { revalidatePath } from "next/cache";
import {
	getMCCForIndustry,
	getMerchantStatus,
	submitMerchantBoarding,
} from "@/lib/payrix/api";
import { createClient } from "@/lib/supabase/server";

type MerchantBoardingData = {
	companyId: string;
	// Business Information
	yearsInBusiness: number;
	businessDescription: string;
	averageTicketAmount: number;
	highestTicketAmount: number;
	estimatedMonthlyVolume: number;
	// Owner Information
	ownerFullName: string;
	ownerSSN: string; // Will be encrypted before storage
	ownerDOB: string; // YYYY-MM-DD
	ownerHomeAddress: string;
	ownerCity: string;
	ownerState: string;
	ownerZip: string;
	ownerOwnershipPercentage: number;
	ownerTitle: string;
	// Payment Methods
	acceptsCreditCards: boolean;
	acceptsDebitCards: boolean;
	acceptsACH: boolean;
	acceptsRecurring: boolean;
	// Bank Account (from Plaid)
	bankAccountNumber: string;
	bankRoutingNumber: string;
	bankAccountType: "checking" | "savings";
};

/**
 * Submit merchant boarding application to Payrix
 */
export async function submitPayrixMerchantBoarding(data: MerchantBoardingData) {
	try {
		const supabase = await createClient();

		// Get company information
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("*")
			.eq("id", data.companyId)
			.single();

		if (companyError || !company) {
			return {
				success: false,
				error: "Company not found",
			};
		}

		// Parse company address
		const addressParts = company.address?.split(",").map((s) => s.trim()) || [];
		const [street, city, state, zip] = addressParts;

		// Determine entity type based on company structure
		const entityType =
			company.company_size === "individual" || company.company_size === "1-5"
				? 1
				: company.legal_name?.includes("LLC")
					? 3
					: 2;

		// Get MCC code for industry
		const mccCode = getMCCForIndustry(company.industry || "general");

		// Calculate annual volume from monthly estimate
		const annualVolume = data.estimatedMonthlyVolume * 12;

		// Parse owner name
		const [firstName, ...lastNameParts] = data.ownerFullName.split(" ");
		const lastName = lastNameParts.join(" ");

		// Prepare Payrix boarding request
		const boardingRequest = {
			entity: {
				type: entityType as 1 | 2 | 3,
				name: company.legal_name || company.name,
				dba: company.doing_business_as || company.name,
				email: company.email || "",
				phone: company.phone || "",
				address1: street || "",
				city: city || "",
				state: state || "",
				zip: zip || "",
				country: "US",
				website: company.website || data.businessDescription,
				ein: company.ein || undefined,
			},
			merchant: {
				status: 1 as const, // Active
				mcc: mccCode,
				established: new Date(
					new Date().getFullYear() - data.yearsInBusiness,
					0,
					1,
				)
					.toISOString()
					.split("T")[0],
				annualVolume,
				averageTicket: data.averageTicketAmount,
				highTicket: data.highestTicketAmount,
				refundPolicy: "30 days",
			},
			members: [
				{
					firstName,
					lastName,
					title: data.ownerTitle,
					email: company.email || "",
					phone: company.phone || "",
					dob: data.ownerDOB,
					ssn: data.ownerSSN, // Payrix will encrypt this
					ownership: data.ownerOwnershipPercentage,
					address1: data.ownerHomeAddress,
					city: data.ownerCity,
					state: data.ownerState,
					zip: data.ownerZip,
					country: "US",
				},
			],
			accounts: [
				{
					type: (data.bankAccountType === "checking" ? 1 : 2) as 1 | 2,
					number: data.bankAccountNumber,
					routing: data.bankRoutingNumber,
				},
			],
		};

		// Submit to Payrix
		const payrixResponse = await submitMerchantBoarding(boardingRequest);

		if (!payrixResponse.success) {
			return {
				success: false,
				error: payrixResponse.error || "Failed to submit merchant application",
			};
		}

		// Save merchant account to database
		const { error: insertError } = await supabase
			.from("payrix_merchant_accounts")
			.insert({
				company_id: data.companyId,
				payrix_entity_id: payrixResponse.data?.entityId,
				payrix_merchant_id: payrixResponse.data?.merchantId,
				payrix_member_id: payrixResponse.data?.memberId,
				status: "submitted",
				boarding_status: payrixResponse.data?.boardingStatus,
				years_in_business: data.yearsInBusiness,
				business_description: data.businessDescription,
				business_website: company.website,
				average_ticket_amount: data.averageTicketAmount,
				highest_ticket_amount: data.highestTicketAmount,
				estimated_monthly_volume: data.estimatedMonthlyVolume,
				estimated_annual_volume: annualVolume,
				accepts_credit_cards: data.acceptsCreditCards,
				accepts_debit_cards: data.acceptsDebitCards,
				accepts_ach: data.acceptsACH,
				accepts_recurring: data.acceptsRecurring,
				owner_full_name: data.ownerFullName,
				owner_ssn_encrypted: "***-**-****", // Store masked version
				owner_dob: new Date(data.ownerDOB),
				owner_home_address: data.ownerHomeAddress,
				owner_city: data.ownerCity,
				owner_state: data.ownerState,
				owner_zip: data.ownerZip,
				owner_ownership_percentage: data.ownerOwnershipPercentage,
				owner_title: data.ownerTitle,
				mcc_code: mccCode,
				payrix_response: payrixResponse.data,
				submitted_at: new Date().toISOString(),
			});

		if (insertError) {
			console.error("Failed to save merchant account:", insertError);
			return {
				success: false,
				error: "Failed to save merchant account to database",
			};
		}

		revalidatePath("/dashboard/welcome");

		return {
			success: true,
			merchantId: payrixResponse.data?.merchantId,
			status: payrixResponse.data?.status,
		};
	} catch (error) {
		console.error("Payrix boarding error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * Check Payrix merchant account status
 */
export async function checkPayrixMerchantStatus(companyId: string) {
	try {
		const supabase = await createClient();

		// Get merchant account from database
		const { data: merchantAccount, error } = await supabase
			.from("payrix_merchant_accounts")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error || !merchantAccount) {
			return {
				success: false,
				error: "Merchant account not found",
			};
		}

		// If we have a Payrix merchant ID, check status
		if (merchantAccount.payrix_merchant_id) {
			const statusResponse = await getMerchantStatus(
				merchantAccount.payrix_merchant_id,
			);

			if (statusResponse.success && statusResponse.data) {
				// Update database with latest status
				await supabase
					.from("payrix_merchant_accounts")
					.update({
						status: statusResponse.data.active ? "approved" : "under_review",
						boarding_status: statusResponse.data.boardingStatus,
						boarding_substatus: statusResponse.data.boardingSubstatus,
						last_sync_at: new Date().toISOString(),
						approved_at: statusResponse.data.active
							? new Date().toISOString()
							: null,
					})
					.eq("id", merchantAccount.id);

				revalidatePath("/dashboard/welcome");
			}

			return statusResponse;
		}

		return {
			success: true,
			data: {
				status: merchantAccount.status,
				boardingStatus: merchantAccount.boarding_status,
				active: merchantAccount.status === "approved",
			},
		};
	} catch (error) {
		console.error("Payrix status check error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * Get Payrix merchant account for company
 */
export async function getPayrixMerchantAccount(companyId: string) {
	try {
		const supabase = await createClient();

		const { data: merchantAccount, error } = await supabase
			.from("payrix_merchant_accounts")
			.select("*")
			.eq("company_id", companyId)
			.maybeSingle();

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: true,
			data: merchantAccount,
		};
	} catch (error) {
		console.error("Get merchant account error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
