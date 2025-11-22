/**
 * Connection Setup & Verification
 *
 * Verifies connection configuration and can auto-update webhook URLs.
 */

import { TELNYX_CONFIG, telnyxClient } from "./client";

export type ConnectionStatus = {
	exists: boolean;
	isActive: boolean;
	hasWebhookUrl: boolean;
	webhookUrl: string | null;
	webhookFailoverUrl: string | null;
	webhookApiVersion: string | null;
	connectionType: string | null;
	supportsVoice: boolean;
	needsFix: boolean;
	issues: string[];
};

export type ConnectionFixResult = {
	success: boolean;
	fixed: boolean;
	error?: string;
	changes: string[];
};

function getWebhookUrl(): string | undefined {
	const candidates = [
		process.env.NEXT_PUBLIC_SITE_URL,
		process.env.SITE_URL,
		process.env.NEXT_PUBLIC_APP_URL,
		process.env.APP_URL,
	];
	for (const candidate of candidates) {
		if (candidate && candidate.trim()) {
			const trimmed = candidate.trim();
			const isLocal =
				trimmed.includes("localhost") ||
				trimmed.includes("127.0.0.1") ||
				trimmed.includes("0.0.0.0");
			if (!isLocal) {
				const normalized = trimmed.startsWith("http")
					? trimmed
					: `https://${trimmed}`;
				return `${normalized.replace(/\/+$/, "")}/api/webhooks/telnyx`;
			}
		}
	}
	return undefined;
}

/**
 * Verify connection configuration
 */
export async function verifyConnection(
	connectionId?: string,
): Promise<ConnectionStatus> {
	const connId = connectionId || TELNYX_CONFIG.connectionId;

	const status: ConnectionStatus = {
		exists: false,
		isActive: false,
		hasWebhookUrl: false,
		webhookUrl: null,
		webhookFailoverUrl: null,
		webhookApiVersion: null,
		connectionType: null,
		supportsVoice: false,
		needsFix: false,
		issues: [],
	};

	if (!connId || connId.trim() === "") {
		status.issues.push("Connection ID is not configured");
		status.needsFix = true;
		return status;
	}

	try {
		const connection =
			await telnyxClient.callControlApplications.retrieve(connId);
		const connectionData = connection.data as any;

		if (!connectionData) {
			status.issues.push(`Connection ${connId} not found in Telnyx`);
			status.needsFix = true;
			return status;
		}

		status.exists = true;
		status.isActive = connectionData.active !== false;
		status.webhookUrl = connectionData.webhook_event_url || null;
		status.webhookFailoverUrl =
			connectionData.webhook_event_failover_url || null;
		status.webhookApiVersion = connectionData.webhook_api_version || null;
		status.connectionType = connectionData.type || null;

		// Check if connection supports voice
		// Call Control Applications typically support voice
		status.supportsVoice = true;

		// Check webhook URL
		const expectedWebhookUrl = getWebhookUrl();
		if (!expectedWebhookUrl) {
			status.issues.push(
				"NEXT_PUBLIC_SITE_URL is not set to a valid production URL",
			);
			status.needsFix = true;
		} else if (!status.webhookUrl) {
			status.issues.push(
				`Webhook URL is not set. Expected: ${expectedWebhookUrl} (with optional ?company=... for multi-tenant)`,
			);
			status.needsFix = true;
		} else {
			// Accept both base webhook URL and company-specific URLs (with query params)
			const baseUrl = status.webhookUrl.split("?")[0];
			if (
				baseUrl === expectedWebhookUrl ||
				status.webhookUrl === expectedWebhookUrl
			) {
				status.hasWebhookUrl = true;
			} else {
				status.issues.push(
					`Webhook URL base is not set correctly. Expected: ${expectedWebhookUrl}, Current: ${baseUrl}`,
				);
				status.needsFix = true;
			}
		}

		// Check webhook API version
		if (status.webhookApiVersion !== "2") {
			status.issues.push(
				`Webhook API version should be "2", but is "${status.webhookApiVersion || "not set"}"`,
			);
			status.needsFix = true;
		}

		// Check if connection is active
		if (!status.isActive) {
			status.issues.push("Connection is not active");
			status.needsFix = true;
		}

		return status;
	} catch (error: any) {
		if (error?.statusCode === 404) {
			status.issues.push(`Connection ${connId} not found in Telnyx`);
		} else {
			status.issues.push(error?.message || "Failed to retrieve connection");
		}
		status.needsFix = true;
		return status;
	}
}

/**
 * Auto-fix connection configuration
 */
export async function fixConnection(
	connectionId?: string,
	options?: {
		webhookUrl?: string;
		webhookFailoverUrl?: string;
	},
): Promise<ConnectionFixResult> {
	const connId = connectionId || TELNYX_CONFIG.connectionId;
	const changes: string[] = [];

	if (!connId || connId.trim() === "") {
		return {
			success: false,
			fixed: false,
			error: "Connection ID is not configured",
			changes: [],
		};
	}

	try {
		// Get current status
		const status = await verifyConnection(connId);
		if (!status.needsFix) {
			return {
				success: true,
				fixed: false,
				changes: [],
			};
		}

		// Get expected webhook URL
		const expectedWebhookUrl = options?.webhookUrl || getWebhookUrl();
		if (!expectedWebhookUrl) {
			return {
				success: false,
				fixed: false,
				error:
					"NEXT_PUBLIC_SITE_URL must be set to a valid production URL to configure webhooks",
				changes: [],
			};
		}

		// Prepare update
		const updateData: Record<string, unknown> = {};

		// Fix webhook URL
		if (status.webhookUrl !== expectedWebhookUrl) {
			updateData.webhook_event_url = expectedWebhookUrl;
			changes.push(`Updated webhook URL to ${expectedWebhookUrl}`);
		}

		// Fix webhook failover URL
		const expectedFailoverUrl =
			options?.webhookFailoverUrl ||
			process.env.TELNYX_WEBHOOK_FAILOVER_URL ||
			null;
		if (status.webhookFailoverUrl !== expectedFailoverUrl) {
			updateData.webhook_event_failover_url = expectedFailoverUrl;
			if (expectedFailoverUrl) {
				changes.push(`Updated webhook failover URL to ${expectedFailoverUrl}`);
			} else {
				changes.push("Removed webhook failover URL");
			}
		}

		// Fix webhook API version
		if (status.webhookApiVersion !== "2") {
			updateData.webhook_api_version = "2";
			changes.push("Updated webhook API version to 2");
		}

		// Fix connection active status
		if (!status.isActive) {
			updateData.active = true;
			changes.push("Activated connection");
		}

		// Apply updates if needed
		if (Object.keys(updateData).length > 0) {
			await telnyxClient.callControlApplications.update(connId, updateData);
		}

		return {
			success: true,
			fixed: changes.length > 0,
			changes,
		};
	} catch (error: any) {
		return {
			success: false,
			fixed: false,
			error: error?.message || "Failed to update connection",
			changes,
		};
	}
}

/**
 * Get connection details
 */
async function getConnectionDetails(connectionId?: string): Promise<{
	success: boolean;
	data?: any;
	error?: string;
}> {
	const connId = connectionId || TELNYX_CONFIG.connectionId;

	if (!connId || connId.trim() === "") {
		return {
			success: false,
			error: "Connection ID is not configured",
		};
	}

	try {
		const connection =
			await telnyxClient.callControlApplications.retrieve(connId);
		return {
			success: true,
			data: connection.data,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error?.message || "Failed to retrieve connection",
		};
	}
}
