/**
 * Twilio Usage Client
 *
 * Fetches voice and SMS usage data from Twilio API
 * for billing and usage tracking
 */

import Twilio from "twilio";

interface TwilioVoiceUsage {
	total_minutes: number;
	inbound_minutes: number;
	outbound_minutes: number;
	total_cost_cents: number;
}

interface TwilioSmsUsage {
	total_messages: number;
	inbound_messages: number;
	outbound_messages: number;
	total_cost_cents: number;
}

interface TwilioUsageResponse {
	voice: TwilioVoiceUsage | null;
	sms: TwilioSmsUsage | null;
}

class TwilioUsageClient {
	private client: ReturnType<typeof Twilio> | null = null;
	private accountSid: string | undefined;

	private getClient() {
		if (this.client) return this.client;

		const accountSid = process.env.TWILIO_ACCOUNT_SID;
		const authToken = process.env.TWILIO_AUTH_TOKEN;

		if (!accountSid || !authToken) {
			console.warn("Twilio credentials not configured");
			return null;
		}

		this.accountSid = accountSid;
		this.client = Twilio(accountSid, authToken);
		return this.client;
	}

	async getCurrentMonthUsage(): Promise<TwilioUsageResponse> {
		const client = this.getClient();
		if (!client || !this.accountSid) {
			return { voice: null, sms: null };
		}

		try {
			// Get current month date range
			const now = new Date();
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			// Fetch usage records for the current month
			const usageRecords = await client.usage.records.list({
				startDate: startOfMonth,
				endDate: endOfMonth,
			});

			// Parse voice usage
			const voiceRecords = usageRecords.filter(
				(r) =>
					r.category === "calls" ||
					r.category === "calls-inbound" ||
					r.category === "calls-outbound",
			);

			let voiceInboundMinutes = 0;
			let voiceOutboundMinutes = 0;
			let voiceTotalCost = 0;

			for (const record of voiceRecords) {
				const minutes = parseFloat(record.usage || "0") / 60; // Convert seconds to minutes
				const cost = parseFloat(record.price || "0");

				if (record.category === "calls-inbound") {
					voiceInboundMinutes += minutes;
				} else if (record.category === "calls-outbound") {
					voiceOutboundMinutes += minutes;
				}
				voiceTotalCost += cost;
			}

			// Parse SMS usage
			const smsRecords = usageRecords.filter(
				(r) =>
					r.category === "sms" ||
					r.category === "sms-inbound" ||
					r.category === "sms-outbound",
			);

			let smsInbound = 0;
			let smsOutbound = 0;
			let smsTotalCost = 0;

			for (const record of smsRecords) {
				const count = parseInt(record.count || "0", 10);
				const cost = parseFloat(record.price || "0");

				if (record.category === "sms-inbound") {
					smsInbound += count;
				} else if (record.category === "sms-outbound") {
					smsOutbound += count;
				}
				smsTotalCost += cost;
			}

			return {
				voice: {
					total_minutes: voiceInboundMinutes + voiceOutboundMinutes,
					inbound_minutes: voiceInboundMinutes,
					outbound_minutes: voiceOutboundMinutes,
					total_cost_cents: Math.round(voiceTotalCost * 100),
				},
				sms: {
					total_messages: smsInbound + smsOutbound,
					inbound_messages: smsInbound,
					outbound_messages: smsOutbound,
					total_cost_cents: Math.round(smsTotalCost * 100),
				},
			};
		} catch (error) {
			console.error("Error fetching Twilio usage:", error);
			return { voice: null, sms: null };
		}
	}

	async checkHealth(): Promise<{
		healthy: boolean;
		responseTimeMs: number;
		error?: string;
	}> {
		const startTime = Date.now();
		const client = this.getClient();

		if (!client || !this.accountSid) {
			return {
				healthy: false,
				responseTimeMs: Date.now() - startTime,
				error: "Twilio credentials not configured",
			};
		}

		try {
			// Simple health check - fetch account info
			await client.api.v2010.accounts(this.accountSid).fetch();
			return {
				healthy: true,
				responseTimeMs: Date.now() - startTime,
			};
		} catch (error) {
			return {
				healthy: false,
				responseTimeMs: Date.now() - startTime,
				error: error instanceof Error ? error.message : "Health check failed",
			};
		}
	}
}

export const twilioUsageClient = new TwilioUsageClient();
