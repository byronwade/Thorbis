"use server";

/**
 * Server Actions for Phone Number Porting
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	checkNumberPortability,
	createPortingOrder,
	getPortingOrderStatus,
	type PortingOrderRequest,
} from "@/lib/twilio/porting";

async function submitPortingOrder(data: {
	companyId: string;
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
}): Promise<{
	success: boolean;
	portingOrderId?: string;
	focDate?: string;
	error?: string;
	validationErrors?: Record<string, string[]>;
}> {
	try {
		// Create porting order with Twilio
		const result = await createPortingOrder({
			phoneNumbers: data.phoneNumbers,
			currentCarrierName: data.currentCarrierName,
			currentAccountNumber: data.currentAccountNumber,
			currentPinPassword: data.currentPinPassword,
			businessName: data.businessName,
			businessAddress: data.businessAddress,
			businessCity: data.businessCity,
			businessState: data.businessState,
			businessZip: data.businessZip,
			businessContactName: data.businessContactName,
			businessContactEmail: data.businessContactEmail,
			businessContactPhone: data.businessContactPhone,
			requestedFocDate: data.requestedFocDate,
		});

		if (!result.success || !result.data) {
			return {
				success: false,
				error: result.error,
				validationErrors: result.validationErrors,
			};
		}

		// Store porting order in database
		const supabase = createServiceSupabaseClient();
		const { error: dbError } = await supabase.from("porting_orders").insert({
			company_id: data.companyId,
			twilio_porting_order_id: result.data.id,
			phone_numbers: result.data.phoneNumbers,
			current_carrier: result.data.currentCarrierName,
			status: result.data.status,
			foc_date: result.data.focDate,
			support_key: result.data.supportKey,
			created_at: new Date().toISOString(),
		});

		if (dbError) {
			console.error("Failed to save porting order to database:", dbError);
			// Don't fail the request - porting order was created successfully
		}

		return {
			success: true,
			portingOrderId: result.data.id,
			focDate: result.data.focDate,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to submit porting order",
		};
	}
}

export async function checkPortability(phoneNumber: string): Promise<{
	success: boolean;
	portable?: boolean;
	carrier?: string;
	numberType?: string;
	error?: string;
}> {
	return await checkNumberPortability(phoneNumber);
}

async function getPortingStatus(portingOrderId: string): Promise<{
	success: boolean;
	status?: string;
	focDate?: string;
	error?: string;
}> {
	const result = await getPortingOrderStatus(portingOrderId);

	if (!result.success || !result.data) {
		return {
			success: false,
			error: result.error,
		};
	}

	return {
		success: true,
		status: result.data.status,
		focDate: result.data.focDate,
	};
}
