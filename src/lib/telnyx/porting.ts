/**
 * Telnyx Number Porting API
 *
 * Handles submitting porting orders, checking status, and managing the porting process.
 * Documentation: https://developers.telnyx.com/api/v2/number-portability/Porting-Orders
 */

import { TELNYX_CONFIG } from "./client";

export type PortingOrderStatus =
	| "draft"
	| "in-process"
	| "submitted"
	| "exception"
	| "foc-date-confirmed"
	| "ported"
	| "cancelled";

export interface PortingOrderRequest {
	phoneNumbers: string[]; // Numbers to port (E.164 format)
	// Current carrier info
	currentCarrierName: string;
	currentAccountNumber: string;
	currentPinPassword?: string; // Required by some carriers
	currentBillingTelephoneNumber?: string; // BTN

	// Business info (from company onboarding)
	businessName: string;
	businessAddress: string;
	businessCity: string;
	businessState: string;
	businessZip: string;
	businessContactName: string;
	businessContactEmail: string;
	businessContactPhone: string;

	// Additional info
	requestedFocDate?: string; // Preferred FOC date (YYYY-MM-DD)
	specialInstructions?: string;
}

export interface PortingOrder {
	id: string;
	status: PortingOrderStatus;
	phoneNumbers: string[];
	currentCarrierName: string;
	focDate?: string; // Firm Order Commitment date
	createdAt: string;
	updatedAt: string;
	portOutPin?: string; // PIN for future port-outs
	supportKey?: string; // For Telnyx support reference
}

export interface PortingOrderResult {
	success: boolean;
	data?: PortingOrder;
	error?: string;
	validationErrors?: Record<string, string[]>;
}

/**
 * Create a new porting order
 */
export async function createPortingOrder(
	request: PortingOrderRequest
): Promise<PortingOrderResult> {
	try {
		const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
		if (!TELNYX_API_KEY) {
			return {
				success: false,
				error: "Telnyx API key not configured (TELNYX_API_KEY)",
			};
		}

		// Validate phone numbers format (E.164)
		const validPhoneNumbers = request.phoneNumbers.filter((num) =>
			/^\+1[0-9]{10}$/.test(num)
		);
		if (validPhoneNumbers.length === 0) {
			return {
				success: false,
				error:
					"No valid phone numbers provided. Format must be E.164 (+1XXXXXXXXXX)",
			};
		}

		// Prepare porting order payload
		const payload = {
			phone_numbers: validPhoneNumbers,
			// Losing carrier info
			old_service_provider_details: {
				name: request.currentCarrierName,
				account_number: request.currentAccountNumber,
				pin_password: request.currentPinPassword,
				billing_telephone_number: request.currentBillingTelephoneNumber,
			},
			// Business address
			person_or_business_name: request.businessName,
			address_line_1: request.businessAddress,
			locality: request.businessCity,
			administrative_area: request.businessState,
			postal_code: request.businessZip,
			country_code: "US",
			// Contact info
			contact_name: request.businessContactName,
			contact_email: request.businessContactEmail,
			contact_phone: request.businessContactPhone,
			// Optional settings
			requested_foc_date: request.requestedFocDate,
			special_instructions: request.specialInstructions,
			// Bill of Lading - set to false if we want to use existing service address
			// (Typically false for most cases)
			enduser_location_type: "business",
		};

		const response = await fetch("https://api.telnyx.com/v2/porting_orders", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${TELNYX_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return {
				success: false,
				error: errorData.errors?.[0]?.detail || "Failed to create porting order",
				validationErrors: errorData.errors?.reduce(
					(acc: Record<string, string[]>, err: any) => {
						const field = err.source?.pointer?.split("/").pop() || "general";
						if (!acc[field]) acc[field] = [];
						acc[field].push(err.detail);
						return acc;
					},
					{}
				),
			};
		}

		const result = await response.json();
		const portingOrder = result.data;

		return {
			success: true,
			data: {
				id: portingOrder.id,
				status: portingOrder.status,
				phoneNumbers: portingOrder.phone_numbers,
				currentCarrierName: portingOrder.old_service_provider_details?.name,
				focDate: portingOrder.foc_date,
				createdAt: portingOrder.created_at,
				updatedAt: portingOrder.updated_at,
				portOutPin: portingOrder.port_out_pin,
				supportKey: portingOrder.support_key,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get porting order status
 */
export async function getPortingOrderStatus(
	portingOrderId: string
): Promise<PortingOrderResult> {
	try {
		const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
		if (!TELNYX_API_KEY) {
			return {
				success: false,
				error: "Telnyx API key not configured",
			};
		}

		const response = await fetch(
			`https://api.telnyx.com/v2/porting_orders/${portingOrderId}`,
			{
				headers: {
					Authorization: `Bearer ${TELNYX_API_KEY}`,
				},
			}
		);

		if (!response.ok) {
			return {
				success: false,
				error: `Failed to fetch porting order: ${response.statusText}`,
			};
		}

		const result = await response.json();
		const portingOrder = result.data;

		return {
			success: true,
			data: {
				id: portingOrder.id,
				status: portingOrder.status,
				phoneNumbers: portingOrder.phone_numbers,
				currentCarrierName: portingOrder.old_service_provider_details?.name,
				focDate: portingOrder.foc_date,
				createdAt: portingOrder.created_at,
				updatedAt: portingOrder.updated_at,
				portOutPin: portingOrder.port_out_pin,
				supportKey: portingOrder.support_key,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Cancel a porting order
 */
export async function cancelPortingOrder(
	portingOrderId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
		if (!TELNYX_API_KEY) {
			return {
				success: false,
				error: "Telnyx API key not configured",
			};
		}

		const response = await fetch(
			`https://api.telnyx.com/v2/porting_orders/${portingOrderId}/actions/cancel`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${TELNYX_API_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			return {
				success: false,
				error: `Failed to cancel porting order: ${response.statusText}`,
			};
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Validate if a number is portable
 */
export async function checkNumberPortability(
	phoneNumber: string
): Promise<{
	success: boolean;
	portable?: boolean;
	carrier?: string;
	numberType?: string;
	error?: string;
}> {
	try {
		const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
		if (!TELNYX_API_KEY) {
			return {
				success: false,
				error: "Telnyx API key not configured",
			};
		}

		// Normalize phone number to E.164
		const normalized = phoneNumber.replace(/\D/g, "");
		const e164 =
			normalized.startsWith("1") && normalized.length === 11
				? `+${normalized}`
				: `+1${normalized}`;

		const response = await fetch(
			`https://api.telnyx.com/v2/number_lookup/${e164}`,
			{
				headers: {
					Authorization: `Bearer ${TELNYX_API_KEY}`,
				},
			}
		);

		if (!response.ok) {
			return {
				success: false,
				error: `Failed to lookup number: ${response.statusText}`,
			};
		}

		const result = await response.json();
		const data = result.data;

		return {
			success: true,
			portable: data.portability?.portable !== false,
			carrier: data.carrier?.name,
			numberType: data.carrier?.type,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get estimated FOC date for a porting order
 * Returns the earliest possible completion date based on carrier rules
 */
export function getEstimatedFocDate(): string {
	// Most carriers require 2-4 weeks
	// Let's use 3 weeks (21 days) as a reasonable estimate
	const today = new Date();
	today.setDate(today.getDate() + 21);
	return today.toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * Format porting status for display
 */
export function formatPortingStatus(status: PortingOrderStatus): string {
	const statusLabels: Record<PortingOrderStatus, string> = {
		draft: "Draft",
		"in-process": "In Process",
		submitted: "Submitted to Carrier",
		exception: "Requires Attention",
		"foc-date-confirmed": "Scheduled for Porting",
		ported: "Complete",
		cancelled: "Cancelled",
	};
	return statusLabels[status] || status;
}

/**
 * Check if porting order requires action
 */
export function requiresAction(status: PortingOrderStatus): boolean {
	return status === "exception" || status === "draft";
}
