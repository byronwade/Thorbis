/**
 * Phone Number Setup & Verification
 *
 * Verifies phone numbers are properly configured in Telnyx and can auto-fix issues.
 */

import { TELNYX_CONFIG } from "./client";
import {
	getNumberDetails,
	listOwnedNumbers,
	updateNumber,
	type NumberFeature,
} from "./numbers";

export type PhoneNumberStatus = {
	exists: boolean;
	hasMessagingProfile: boolean;
	hasConnection: boolean;
	capabilities: {
		sms: boolean;
		voice: boolean;
		mms: boolean;
	};
	needsFix: boolean;
	issues: string[];
};

export type PhoneNumberFixResult = {
	success: boolean;
	fixed: boolean;
	error?: string;
	changes: string[];
};

/**
 * Find phone number ID by phone number string
 */
async function findPhoneNumberId(
	phoneNumber: string,
): Promise<{ success: boolean; phoneNumberId?: string; error?: string }> {
	try {
		// Normalize phone number (E.164 format)
		const normalized = phoneNumber.replace(/\D/g, "");
		const e164 = normalized.startsWith("+")
			? phoneNumber
			: normalized.startsWith("1") && normalized.length === 11
				? `+${normalized}`
				: `+1${normalized}`;

		// List all owned numbers and find matching one
		const result = await listOwnedNumbers({ pageSize: 100 });
		if (!result.success || !result.data) {
			return {
				success: false,
				error: "Failed to list phone numbers from Telnyx",
			};
		}

		const numbers = Array.isArray(result.data) ? result.data : [result.data];
		const matching = numbers.find(
			(num: any) =>
				num.phone_number === e164 ||
				num.phone_number === phoneNumber ||
				num.phone_number?.replace(/\D/g, "") === normalized,
		);

		if (!matching) {
			return {
				success: false,
				error: `Phone number ${phoneNumber} not found in Telnyx account`,
			};
		}

		return {
			success: true,
			phoneNumberId: matching.id,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to find phone number",
		};
	}
}

/**
 * Verify phone number configuration
 */
export async function verifyPhoneNumber(
	phoneNumber: string,
): Promise<PhoneNumberStatus> {
	const status: PhoneNumberStatus = {
		exists: false,
		hasMessagingProfile: false,
		hasConnection: false,
		capabilities: {
			sms: false,
			voice: false,
			mms: false,
		},
		needsFix: false,
		issues: [],
	};

	try {
		// Find phone number ID
		const findResult = await findPhoneNumberId(phoneNumber);
		if (!findResult.success || !findResult.phoneNumberId) {
			status.issues.push(
				findResult.error || "Phone number not found in Telnyx",
			);
			status.needsFix = true;
			return status;
		}

		status.exists = true;

		// Get phone number details
		const detailsResult = await getNumberDetails(findResult.phoneNumberId);
		if (!detailsResult.success || !detailsResult.data) {
			status.issues.push("Failed to retrieve phone number details");
			status.needsFix = true;
			return status;
		}

		const numberData = detailsResult.data as any;

		// Check messaging profile
		if (numberData.messaging_profile_id) {
			status.hasMessagingProfile = true;
		} else {
			status.issues.push("Phone number is not associated with a messaging profile");
			status.needsFix = true;
		}

		// Check connection
		if (numberData.connection_id) {
			status.hasConnection = true;
		} else {
			status.issues.push("Phone number is not associated with a connection");
			status.needsFix = true;
		}

		// Check capabilities
		const features = (numberData.features || []) as string[];
		status.capabilities.sms = features.includes("sms");
		status.capabilities.voice = features.includes("voice");
		status.capabilities.mms = features.includes("mms");

		if (!status.capabilities.sms) {
			status.issues.push("Phone number does not have SMS capability");
		}
		if (!status.capabilities.voice) {
			status.issues.push("Phone number does not have voice capability");
		}

		return status;
	} catch (error) {
		status.issues.push(
			error instanceof Error ? error.message : "Unknown error",
		);
		status.needsFix = true;
		return status;
	}
}

/**
 * Auto-fix phone number configuration
 */
export async function fixPhoneNumber(
	phoneNumber: string,
	options?: {
		messagingProfileId?: string;
		connectionId?: string;
	},
): Promise<PhoneNumberFixResult> {
	const changes: string[] = [];

	try {
		// Find phone number ID
		const findResult = await findPhoneNumberId(phoneNumber);
		if (!findResult.success || !findResult.phoneNumberId) {
			return {
				success: false,
				fixed: false,
				error: findResult.error || "Phone number not found",
				changes: [],
			};
		}

		// Get current status
		const status = await verifyPhoneNumber(phoneNumber);
		if (!status.needsFix) {
			return {
				success: true,
				fixed: false,
				changes: [],
			};
		}

		// Prepare update parameters
		const updateParams: {
			phoneNumberId: string;
			messagingProfileId?: string;
			connectionId?: string;
		} = {
			phoneNumberId: findResult.phoneNumberId,
		};

		// Fix messaging profile
		if (!status.hasMessagingProfile) {
			const messagingProfileId =
				options?.messagingProfileId || TELNYX_CONFIG.messagingProfileId;
			if (messagingProfileId) {
				updateParams.messagingProfileId = messagingProfileId;
				changes.push(
					`Assigned messaging profile ${messagingProfileId} to phone number`,
				);
			} else {
				return {
					success: false,
					fixed: false,
					error:
						"Messaging profile ID is required but not configured. Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID.",
					changes: [],
				};
			}
		}

		// Fix connection
		if (!status.hasConnection) {
			const connectionId =
				options?.connectionId || TELNYX_CONFIG.connectionId;
			if (connectionId) {
				updateParams.connectionId = connectionId;
				changes.push(
					`Assigned connection ${connectionId} to phone number`,
				);
			} else {
				return {
					success: false,
					fixed: false,
					error:
						"Connection ID is required but not configured. Set NEXT_PUBLIC_TELNYX_CONNECTION_ID.",
					changes: [],
				};
			}
		}

		// Apply updates if needed
		if (updateParams.messagingProfileId || updateParams.connectionId) {
			const updateResult = await updateNumber(updateParams);
			if (!updateResult.success) {
				return {
					success: false,
					fixed: false,
					error: updateResult.error || "Failed to update phone number",
					changes,
				};
			}
		}

		return {
			success: true,
			fixed: changes.length > 0,
			changes,
		};
	} catch (error) {
		return {
			success: false,
			fixed: false,
			error: error instanceof Error ? error.message : "Unknown error",
			changes,
		};
	}
}

/**
 * Verify phone number has SMS capability
 */
export async function verifySmsCapability(
	phoneNumber: string,
): Promise<{ hasSms: boolean; error?: string }> {
	const status = await verifyPhoneNumber(phoneNumber);

	if (!status.exists) {
		return {
			hasSms: false,
			error: "Phone number not found in Telnyx",
		};
	}

	if (!status.capabilities.sms) {
		return {
			hasSms: false,
			error: "Phone number does not have SMS capability",
		};
	}

	if (!status.hasMessagingProfile) {
		return {
			hasSms: false,
			error: "Phone number is not associated with a messaging profile",
		};
	}

	return { hasSms: true };
}

/**
 * Verify phone number has voice capability
 */
export async function verifyVoiceCapability(
	phoneNumber: string,
): Promise<{ hasVoice: boolean; error?: string }> {
	const status = await verifyPhoneNumber(phoneNumber);

	if (!status.exists) {
		return {
			hasVoice: false,
			error: "Phone number not found in Telnyx",
		};
	}

	if (!status.capabilities.voice) {
		return {
			hasVoice: false,
			error: "Phone number does not have voice capability",
		};
	}

	if (!status.hasConnection) {
		return {
			hasVoice: false,
			error: "Phone number is not associated with a connection",
		};
	}

	return { hasVoice: true };
}

