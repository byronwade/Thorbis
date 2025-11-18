"use server";

import { requireActiveCompany } from "@/lib/auth/company-context";
import {
	fetchSmsConversation,
	fetchSmsThreads,
	type SmsMessage,
	type SmsThread,
} from "@/lib/communications/sms";
import { createClient } from "@/lib/supabase/server";

export type SmsThreadResult = {
	success: boolean;
	threads?: SmsThread[];
	error?: string;
};

export type SmsConversationResult = {
	success: boolean;
	messages?: SmsMessage[];
	error?: string;
};

export async function getSmsThreadsAction(): Promise<SmsThreadResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		const companyId = await requireActiveCompany();
		const threads = await fetchSmsThreads(supabase, companyId);

		return {
			success: true,
			threads,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to load threads",
		};
	}
}

export async function getSmsConversationAction(
	threadId: string,
): Promise<SmsConversationResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		const companyId = await requireActiveCompany();
		const messages = await fetchSmsConversation(supabase, companyId, threadId);

		return {
			success: true,
			messages,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to load conversation",
		};
	}
}
