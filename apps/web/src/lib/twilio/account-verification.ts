/**
 * Twilio Account Verification API
 *
 * Functions for verifying business accounts and regulatory compliance.
 * See: https://www.twilio.com/docs/trust-hub
 */

import twilio from "twilio";

// Initialize Twilio client
function getTwilioClient() {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;

	if (!accountSid || !authToken) {
		return null;
	}

	return twilio(accountSid, authToken);
}

export type VerificationData = {
	businessName: string;
	businessType: "sole_proprietorship" | "partnership" | "llc" | "corporation" | "non_profit";
	ein?: string;
	country: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	website?: string;
	// Additional fields for Trust Hub
	businessRegistrationNumber?: string;
	businessRegistrationAuthority?: string;
	businessIndustry?: string;
};

export type VerificationResult = {
	success: boolean;
	data?: {
		id: string;
		status: string;
		verificationScore?: number;
		trustProductSid?: string;
	};
	error?: string;
};

/**
 * Get business verification status from Twilio Trust Hub
 */
export async function getBusinessVerificationStatus(
	companyId: string
): Promise<VerificationResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
		};
	}

	try {
		// Search for existing Trust Products for this company
		const trustProducts = await client.trusthub.v1.trustProducts.list({
			limit: 20,
		});

		// Find the trust product associated with this company
		const companyProduct = trustProducts.find(
			(product) => product.friendlyName?.includes(companyId)
		);

		if (!companyProduct) {
			return {
				success: true,
				data: {
					id: "",
					status: "not_started",
				},
			};
		}

		return {
			success: true,
			data: {
				id: companyProduct.sid,
				status: companyProduct.status,
				trustProductSid: companyProduct.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio Verification] Error getting status:", error);
		return {
			success: false,
			error: error.message || "Failed to get verification status",
		};
	}
}

/**
 * Submit business verification to Twilio Trust Hub
 */
export async function submitBusinessVerification(
	companyId: string,
	data: VerificationData
): Promise<VerificationResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Step 1: Create End User of type "customer_profile_business_information"
		const endUser = await client.trusthub.v1.endUsers.create({
			friendlyName: `${data.businessName} - ${companyId}`,
			type: "customer_profile_business_information",
			attributes: {
				business_name: data.businessName,
				business_type: data.businessType,
				business_registration_number: data.ein || data.businessRegistrationNumber,
				business_registration_identifier: data.businessRegistrationAuthority || "IRS",
				business_industry: data.businessIndustry || "Other",
			},
		});

		// Step 2: Create Supporting Document for address
		const addressDocument = await client.trusthub.v1.supportingDocuments.create({
			friendlyName: `Address Proof - ${data.businessName}`,
			type: "customer_profile_address",
			attributes: {
				address_sids: [], // Will be populated when address is created
				street: data.street,
				city: data.city,
				region: data.state,
				postal_code: data.postalCode,
				iso_country: data.country,
			},
		});

		// Step 3: Create Trust Product (Customer Profile)
		const trustProduct = await client.trusthub.v1.trustProducts.create({
			friendlyName: `Business Profile - ${companyId}`,
			policySid: "RN806dd6cd175f314e1f96a9727ee271f4", // Customer Profile policy SID
			email: data.email,
		});

		// Step 4: Assign End User to Trust Product
		await client.trusthub.v1
			.trustProducts(trustProduct.sid)
			.trustProductsEntityAssignments.create({
				objectSid: endUser.sid,
			});

		// Step 5: Assign Supporting Document to Trust Product
		await client.trusthub.v1
			.trustProducts(trustProduct.sid)
			.trustProductsEntityAssignments.create({
				objectSid: addressDocument.sid,
			});

		// Step 6: Evaluate and submit for review
		const evaluation = await client.trusthub.v1
			.trustProducts(trustProduct.sid)
			.trustProductsEvaluations.create({
				policySid: "RN806dd6cd175f314e1f96a9727ee271f4",
			});

		return {
			success: true,
			data: {
				id: trustProduct.sid,
				status: evaluation.status,
				trustProductSid: trustProduct.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio Verification] Error submitting verification:", error);
		return {
			success: false,
			error: error.message || "Failed to submit business verification",
		};
	}
}

/**
 * Get EIN verification status
 */
export async function getEinVerificationStatus(
	einId: string
): Promise<VerificationResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Fetch the end user document by SID
		const endUser = await client.trusthub.v1.endUsers(einId).fetch();

		return {
			success: true,
			data: {
				id: endUser.sid,
				status: "completed", // End users don't have a status, they're either valid or not
			},
		};
	} catch (error: any) {
		console.error("[Twilio Verification] Error getting EIN status:", error);
		return {
			success: false,
			error: error.message || "Failed to get EIN verification status",
		};
	}
}

/**
 * Submit EIN for verification
 */
export async function submitEinVerification(
	companyId: string,
	ein: string,
	businessName: string
): Promise<VerificationResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Create an End User with EIN information
		const endUser = await client.trusthub.v1.endUsers.create({
			friendlyName: `EIN Verification - ${businessName} - ${companyId}`,
			type: "customer_profile_business_information",
			attributes: {
				business_name: businessName,
				business_registration_number: ein,
				business_registration_identifier: "EIN",
			},
		});

		return {
			success: true,
			data: {
				id: endUser.sid,
				status: "submitted",
			},
		};
	} catch (error: any) {
		console.error("[Twilio Verification] Error submitting EIN:", error);
		return {
			success: false,
			error: error.message || "Failed to submit EIN verification",
		};
	}
}

/**
 * Submit Stock Exchange Info for Public Companies
 */
export async function submitStockInfo(
	companyId: string,
	stockSymbol: string,
	stockExchange: string
): Promise<VerificationResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Create supporting document for publicly traded company
		const stockDocument = await client.trusthub.v1.supportingDocuments.create({
			friendlyName: `Stock Info - ${stockSymbol} - ${companyId}`,
			type: "customer_profile_business_information",
			attributes: {
				stock_ticker: stockSymbol,
				stock_exchange: stockExchange,
				company_type: "publicly_traded",
			},
		});

		return {
			success: true,
			data: {
				id: stockDocument.sid,
				status: "submitted",
			},
		};
	} catch (error: any) {
		console.error("[Twilio Verification] Error submitting stock info:", error);
		return {
			success: false,
			error: error.message || "Failed to submit stock information",
		};
	}
}

/**
 * Get all verification documents for a company
 */
export async function getVerificationDocuments(
	companyId: string
): Promise<{
	success: boolean;
	data?: {
		trustProducts: any[];
		endUsers: any[];
		supportingDocuments: any[];
	};
	error?: string;
}> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Get all trust products
		const trustProducts = await client.trusthub.v1.trustProducts.list({ limit: 50 });
		const companyProducts = trustProducts.filter((p) =>
			p.friendlyName?.includes(companyId)
		);

		// Get all end users
		const endUsers = await client.trusthub.v1.endUsers.list({ limit: 50 });
		const companyEndUsers = endUsers.filter((u) =>
			u.friendlyName?.includes(companyId)
		);

		// Get all supporting documents
		const supportingDocs = await client.trusthub.v1.supportingDocuments.list({
			limit: 50,
		});
		const companyDocs = supportingDocs.filter((d) =>
			d.friendlyName?.includes(companyId)
		);

		return {
			success: true,
			data: {
				trustProducts: companyProducts,
				endUsers: companyEndUsers,
				supportingDocuments: companyDocs,
			},
		};
	} catch (error: any) {
		console.error("[Twilio Verification] Error getting documents:", error);
		return {
			success: false,
			error: error.message || "Failed to get verification documents",
		};
	}
}
