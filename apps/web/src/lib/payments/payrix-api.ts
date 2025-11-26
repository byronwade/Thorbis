/**
 * Payrix API Client
 *
 * Integration with Payrix payment processing for merchant boarding,
 * payment processing, and account management.
 *
 * Documentation: https://resource.payrix.com/
 * API Base: https://api.payrix.com
 */

const PAYRIX_API_BASE = process.env.PAYRIX_API_URL || "https://api.payrix.com";
const PAYRIX_API_KEY = process.env.PAYRIX_API_KEY;
const PAYRIX_PARTNER_ID = process.env.PAYRIX_PARTNER_ID;

type PayrixEntity = {
	type: 1 | 2 | 3; // 1 = Individual, 2 = Corporation, 3 = LLC
	name: string;
	dba?: string;
	email: string;
	phone: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zip: string;
	country: string;
	website?: string;
	ein?: string;
};

type PayrixMerchant = {
	status: 1 | 2 | 3; // 1 = Active, 2 = Inactive, 3 = Suspended
	mcc: string; // Merchant Category Code
	established: string; // YYYY-MM-DD
	annualVolume: number;
	averageTicket: number;
	highTicket: number;
	refundPolicy?: string;
};

type PayrixMember = {
	firstName: string;
	lastName: string;
	title: string;
	email: string;
	phone: string;
	dob: string; // YYYY-MM-DD
	ssn: string; // Last 4 digits or full (encrypted)
	ownership: number; // Percentage
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zip: string;
	country: string;
};

type PayrixAccount = {
	type: 1 | 2; // 1 = Checking, 2 = Savings
	number: string; // Account number
	routing: string; // Routing number
};

type PayrixBoardingRequest = {
	entity: PayrixEntity;
	merchant: PayrixMerchant;
	members: PayrixMember[];
	accounts: PayrixAccount[];
};

type PayrixBoardingResponse = {
	success: boolean;
	data?: {
		entityId: string;
		merchantId: string;
		memberId: string;
		status: string;
		boardingStatus: string;
	};
	error?: string;
	details?: any;
};

/**
 * Create headers for Payrix API requests
 */
function getPayrixHeaders(): HeadersInit {
	if (!PAYRIX_API_KEY) {
		throw new Error("Payrix API key not configured");
	}

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${PAYRIX_API_KEY}`,
		APIKEY: PAYRIX_API_KEY,
	};
}

/**
 * Submit merchant boarding application to Payrix
 *
 * @param request - Merchant boarding data
 * @returns Payrix boarding response
 */
export async function submitMerchantBoarding(
	request: PayrixBoardingRequest,
): Promise<PayrixBoardingResponse> {
	try {
		const response = await fetch(`${PAYRIX_API_BASE}/entities`, {
			method: "POST",
			headers: getPayrixHeaders(),
			body: JSON.stringify({
				type: request.entity.type,
				name: request.entity.name,
				dba: request.entity.dba,
				email: request.entity.email,
				phone: request.entity.phone,
				address: {
					line1: request.entity.address1,
					line2: request.entity.address2,
					city: request.entity.city,
					state: request.entity.state,
					zip: request.entity.zip,
					country: request.entity.country,
				},
				website: request.entity.website,
				ein: request.entity.ein,
				merchant: {
					status: request.merchant.status,
					mcc: request.merchant.mcc,
					established: request.merchant.established,
					annualVolume: request.merchant.annualVolume,
					averageTicket: request.merchant.averageTicket,
					highTicket: request.merchant.highTicket,
					refundPolicy: request.merchant.refundPolicy,
				},
				members: request.members.map((member) => ({
					first: member.firstName,
					last: member.lastName,
					title: member.title,
					email: member.email,
					phone: member.phone,
					dob: member.dob,
					ssn: member.ssn,
					ownership: member.ownership,
					address: {
						line1: member.address1,
						line2: member.address2,
						city: member.city,
						state: member.state,
						zip: member.zip,
						country: member.country,
					},
				})),
				accounts: request.accounts.map((account) => ({
					type: account.type,
					number: account.number,
					routing: account.routing,
				})),
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return {
				success: false,
				error: errorData.message || "Failed to submit merchant boarding",
				details: errorData,
			};
		}

		const data = await response.json();

		return {
			success: true,
			data: {
				entityId: data.response?.data?.[0]?.id,
				merchantId: data.response?.data?.[0]?.merchant?.[0]?.id,
				memberId: data.response?.data?.[0]?.members?.[0]?.id,
				status: data.response?.data?.[0]?.merchant?.[0]?.status,
				boardingStatus: data.response?.data?.[0]?.merchant?.[0]?.boardingStatus,
			},
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
 * Check merchant boarding status
 *
 * @param merchantId - Payrix merchant ID
 * @returns Merchant status information
 */
export async function getMerchantStatus(merchantId: string) {
	try {
		const response = await fetch(`${PAYRIX_API_BASE}/merchants/${merchantId}`, {
			method: "GET",
			headers: getPayrixHeaders(),
		});

		if (!response.ok) {
			throw new Error("Failed to fetch merchant status");
		}

		const data = await response.json();
		return {
			success: true,
			data: {
				status: data.response?.data?.[0]?.status,
				boardingStatus: data.response?.data?.[0]?.boardingStatus,
				boardingSubstatus: data.response?.data?.[0]?.boardingSubstatus,
				active: data.response?.data?.[0]?.status === 1,
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
 * Get merchant category codes (MCC)
 * Common codes for field service businesses
 */
export const MERCHANT_CATEGORY_CODES = {
	HVAC: "1711", // Heating, Plumbing, A/C
	PLUMBING: "1711",
	ELECTRICAL: "1731",
	PEST_CONTROL: "7342",
	LOCKSMITH: "7699",
	APPLIANCE_REPAIR: "7623",
	GARAGE_DOOR: "1799",
	LANDSCAPING: "0780",
	POOL_SERVICE: "7699",
	CLEANING: "7349",
	ROOFING: "1761",
	CARPENTRY: "1751",
	PAINTING: "1721",
	GENERAL_CONTRACTOR: "1520",
} as const;

/**
 * Get MCC code for industry
 */
export function getMCCForIndustry(industry: string): string {
	const industryUpper = industry.toUpperCase().replace(/[^A-Z]/g, "_");
	return (
		MERCHANT_CATEGORY_CODES[
			industryUpper as keyof typeof MERCHANT_CATEGORY_CODES
		] || MERCHANT_CATEGORY_CODES.GENERAL_CONTRACTOR
	);
}
