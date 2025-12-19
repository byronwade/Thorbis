"use server";

/**
 * Call Control Actions
 *
 * Server actions for controlling active calls (transfer, hold, end, etc.)
 */

import { z } from "zod";
import { transferCall, holdCall, endCall, getCallDetails } from "@/lib/twilio/calls";
import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";

const transferCallSchema = z.object({
	callSid: z.string().min(1, "Call SID is required"),
	targetNumber: z.string().min(1, "Target number is required"),
	transferType: z.enum(["blind", "attended"]).default("blind"),
});

export type TransferCallParams = z.infer<typeof transferCallSchema>;

/**
 * Transfer an active call to another number
 */
export async function transferActiveCall(params: TransferCallParams): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		// Validate input
		const validated = transferCallSchema.parse(params);

		// Get company ID
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		// Verify the call belongs to this company
		const supabase = await createClient();
		if (supabase) {
			const { data: callRecord } = await supabase
				.from("communications")
				.select("id, company_id")
				.eq("twilio_call_sid", validated.callSid)
				.eq("company_id", companyId)
				.single();

			if (!callRecord) {
				return { success: false, error: "Call not found or unauthorized" };
			}
		}

		// Transfer the call
		const result = await transferCall({
			companyId,
			callSid: validated.callSid,
			transferTo: validated.targetNumber,
		});

		if (!result.success) {
			return { success: false, error: result.error || "Failed to transfer call" };
		}

		// Log the transfer action
		if (supabase) {
			await supabase.from("call_actions_log").insert({
				company_id: companyId,
				call_sid: validated.callSid,
				action: "transfer",
				details: {
					target_number: validated.targetNumber,
					transfer_type: validated.transferType,
				},
			}).catch(() => {
				// Ignore logging errors
			});
		}

		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.issues[0]?.message || "Invalid input" };
		}
		console.error("Transfer call error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to transfer call",
		};
	}
}

/**
 * Put an active call on hold
 */
export async function holdActiveCall(callSid: string, hold: boolean): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		if (!callSid) {
			return { success: false, error: "Call SID is required" };
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const result = await holdCall({
			companyId,
			callSid,
			hold,
		});

		return result;
	} catch (error) {
		console.error("Hold call error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update call hold status",
		};
	}
}

/**
 * End an active call
 */
export async function endActiveCall(callSid: string): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		if (!callSid) {
			return { success: false, error: "Call SID is required" };
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const result = await endCall({
			companyId,
			callSid,
		});

		return result;
	} catch (error) {
		console.error("End call error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to end call",
		};
	}
}

/**
 * Get details of an active call
 */
export async function getActiveCallDetails(callSid: string): Promise<{
	success: boolean;
	data?: Record<string, unknown>;
	error?: string;
}> {
	try {
		if (!callSid) {
			return { success: false, error: "Call SID is required" };
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const result = await getCallDetails({
			companyId,
			callSid,
		});

		if (result.success && result.call) {
			return { success: true, data: result.call };
		}

		return { success: false, error: result.error || "Failed to get call details" };
	} catch (error) {
		console.error("Get call details error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get call details",
		};
	}
}
