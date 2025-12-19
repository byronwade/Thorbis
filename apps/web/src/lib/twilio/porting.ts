/**
 * Twilio Number Porting API
 *
 * Functions for porting phone numbers to Twilio.
 * See: https://www.twilio.com/docs/phone-numbers/porting
 *
 * Note: Number porting requires regulatory API access and may need
 * additional setup with Twilio support.
 */

import "server-only";

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

export type PortingOrderRequest = {
	phoneNumbers: string[];
	currentCarrierName: string;
	currentAccountNumber: string;
	currentPinPassword?: string;
	businessName: string;
	businessAddress: string;
	businessCity: string;
	businessState: string;
	businessZip: string;
	businessContactName: string;
	businessContactEmail: string;
	businessContactPhone: string;
	requestedFocDate?: string;
	// Letter of Authorization details
	authorizedName: string;
	authorizedTitle?: string;
};

export type PortingOrderResult = {
	success: boolean;
	data?: {
		id: string;
		status: string;
		focDate?: string;
		portingOrderSid?: string;
	};
	error?: string;
};

/**
 * Check if a phone number is portable to Twilio
 */
export async function checkNumberPortability(
	phoneNumber: string
): Promise<{ portable: boolean; carrier?: string; reason?: string }> {
	const client = getTwilioClient();

	if (!client) {
		return {
			portable: false,
			reason: "Twilio client not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
		};
	}

	try {
		// Use Twilio Lookup API to get carrier information
		const lookup = await client.lookups.v2.phoneNumbers(phoneNumber).fetch({
			fields: "line_type_intelligence",
		});

		// Check if the number is a mobile or landline (both can be ported)
		const lineType = lookup.lineTypeIntelligence?.type;
		const carrierName = lookup.lineTypeIntelligence?.carrier_name;

		// Most numbers are portable, but VoIP numbers have limitations
		const isPortable = lineType !== "voip" && lineType !== "tollfree";

		return {
			portable: isPortable,
			carrier: carrierName || undefined,
			reason: isPortable
				? undefined
				: `${lineType} numbers may have porting restrictions`,
		};
	} catch (error: any) {
		console.error("[Twilio Porting] Error checking portability:", error);
		return {
			portable: false,
			reason: error.message || "Failed to check number portability",
		};
	}
}

/**
 * Create a porting order
 *
 * Note: This creates the regulatory bundle and supporting documents
 * required for porting. The actual porting order is submitted via
 * Twilio Console or API after bundle approval.
 */
export async function createPortingOrder(
	request: PortingOrderRequest
): Promise<PortingOrderResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Step 1: Create End User with authorized signer information
		const endUser = await client.trusthub.v1.endUsers.create({
			friendlyName: `Port Request - ${request.businessName}`,
			type: "authorized_representative_1",
			attributes: {
				first_name: request.authorizedName.split(" ")[0],
				last_name: request.authorizedName.split(" ").slice(1).join(" ") || request.authorizedName,
				title: request.authorizedTitle || "Owner",
				email: request.businessContactEmail,
				phone_number: request.businessContactPhone,
			},
		});

		// Step 2: Create address supporting document
		const addressDoc = await client.trusthub.v1.supportingDocuments.create({
			friendlyName: `Port Address - ${request.businessName}`,
			type: "customer_profile_address",
			attributes: {
				street: request.businessAddress,
				city: request.businessCity,
				region: request.businessState,
				postal_code: request.businessZip,
				iso_country: "US",
			},
		});

		// Step 3: Create Regulatory Bundle for porting
		const bundle = await client.numbers.v2.regulatoryCompliance.bundles.create({
			friendlyName: `Port Bundle - ${request.phoneNumbers[0]}`,
			email: request.businessContactEmail,
			regulationSid: "RN806dd6cd175f314e1f96a9727ee271f4", // US Local number regulation
			isoCountry: "US",
			numberType: "local",
		});

		// Step 4: Assign end user and address to bundle
		await client.numbers.v2.regulatoryCompliance
			.bundles(bundle.sid)
			.itemAssignments.create({
				objectSid: endUser.sid,
			});

		await client.numbers.v2.regulatoryCompliance
			.bundles(bundle.sid)
			.itemAssignments.create({
				objectSid: addressDoc.sid,
			});

		// Step 5: Submit bundle for review
		await client.numbers.v2.regulatoryCompliance
			.bundles(bundle.sid)
			.update({
				status: "pending-review",
			});

		// Calculate estimated FOC date (typically 7-10 business days)
		const focDate = getEstimatedFocDate(request.phoneNumbers);

		return {
			success: true,
			data: {
				id: bundle.sid,
				status: "pending_review",
				focDate: focDate.toISOString(),
				portingOrderSid: bundle.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio Porting] Error creating porting order:", error);
		return {
			success: false,
			error: error.message || "Failed to create porting order",
		};
	}
}

/**
 * Get porting order status
 */
export async function getPortingOrderStatus(
	orderId: string
): Promise<{
	success: boolean;
	data?: {
		id: string;
		status: string;
		focDate?: string;
		numbers?: Array<{ number: string; status: string }>;
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
		// Fetch the regulatory bundle status
		const bundle = await client.numbers.v2.regulatoryCompliance
			.bundles(orderId)
			.fetch();

		// Map bundle status to porting status
		const statusMap: Record<string, string> = {
			"draft": "pending",
			"pending-review": "submitted",
			"in-review": "in_progress",
			"twilio-rejected": "rejected",
			"twilio-approved": "approved",
			"provisionally-approved": "approved",
		};

		return {
			success: true,
			data: {
				id: bundle.sid,
				status: statusMap[bundle.status] || bundle.status,
				focDate: bundle.dateUpdated?.toISOString(),
			},
		};
	} catch (error: any) {
		console.error("[Twilio Porting] Error getting order status:", error);
		return {
			success: false,
			error: error.message || "Failed to get porting order status",
		};
	}
}

/**
 * Cancel a porting order
 */
export async function cancelPortingOrder(
	orderId: string
): Promise<{ success: boolean; error?: string }> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// Delete the regulatory bundle (only works for draft/pending bundles)
		await client.numbers.v2.regulatoryCompliance.bundles(orderId).remove();

		return { success: true };
	} catch (error: any) {
		console.error("[Twilio Porting] Error canceling order:", error);
		return {
			success: false,
			error: error.message || "Failed to cancel porting order",
		};
	}
}

/**
 * List all porting orders/bundles
 */
export async function listPortingOrders(): Promise<{
	success: boolean;
	data?: Array<{
		id: string;
		status: string;
		friendlyName: string;
		dateCreated: string;
	}>;
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
		const bundles = await client.numbers.v2.regulatoryCompliance.bundles.list({
			limit: 50,
		});

		// Filter to only show porting-related bundles
		const portingBundles = bundles.filter((b) =>
			b.friendlyName?.includes("Port")
		);

		return {
			success: true,
			data: portingBundles.map((b) => ({
				id: b.sid,
				status: b.status,
				friendlyName: b.friendlyName || "",
				dateCreated: b.dateCreated?.toISOString() || "",
			})),
		};
	} catch (error: any) {
		console.error("[Twilio Porting] Error listing orders:", error);
		return {
			success: false,
			error: error.message || "Failed to list porting orders",
		};
	}
}

// Re-export client-safe utilities for backward compatibility
export { getEstimatedFocDate, getRequiredPortingDocuments } from "./porting-utils";

/**
 * Validate phone numbers for porting eligibility
 */
export async function validateNumbersForPorting(
	phoneNumbers: string[]
): Promise<{
	valid: string[];
	invalid: Array<{ number: string; reason: string }>;
}> {
	const valid: string[] = [];
	const invalid: Array<{ number: string; reason: string }> = [];

	for (const number of phoneNumbers) {
		const result = await checkNumberPortability(number);
		if (result.portable) {
			valid.push(number);
		} else {
			invalid.push({
				number,
				reason: result.reason || "Number is not portable",
			});
		}
	}

	return { valid, invalid };
}
