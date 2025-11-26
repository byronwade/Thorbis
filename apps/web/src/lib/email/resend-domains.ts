"use server";

import crypto from "node:crypto";
import {
	canRegisterMoreDomains,
	type DomainValidationResult,
	generatePlatformSubdomain,
	getDomainConfig,
	suggestSubdomains,
	validateDomain,
} from "./domain-validation";

const RESEND_API_BASE = "https://api.resend.com";

type ResendResponse<T> =
	| { success: true; data: T }
	| { success: false; error: string };

interface ResendDomainData {
	id: string;
	name: string;
	status: string;
	region: string;
	records: Array<{
		type: string;
		name: string;
		value: string;
		priority?: number;
		ttl?: string;
	}>;
	created_at: string;
}

interface ResendInboundRouteData {
	id: string;
	name: string;
	recipients: string[];
	url: string;
	enabled: boolean;
	created_at: string;
}

async function resendRequest<T>(
	path: string,
	init: RequestInit,
): Promise<ResendResponse<T>> {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return {
			success: false,
			error: "Resend API key is not configured",
		};
	}

	const response = await fetch(`${RESEND_API_BASE}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			...init.headers,
		},
	});

	if (!response.ok) {
		const message =
			(await response.json().catch(() => null))?.message || response.statusText;
		return { success: false, error: message };
	}

	const data = (await response.json().catch(() => ({}))) as T;
	return { success: true, data };
}

/**
 * Validate and create a Resend domain
 */
export async function createResendDomainWithValidation(params: {
	domain: string;
	currentDomainCount: number;
	companySlug: string;
}): Promise<
	ResendResponse<ResendDomainData> & {
		validation?: DomainValidationResult;
		suggestions?: string[];
	}
> {
	const { domain, currentDomainCount } = params;

	// Check if company can register more domains
	const canRegister = canRegisterMoreDomains(currentDomainCount);
	if (!canRegister.allowed) {
		return {
			success: false,
			error: canRegister.reason || "Cannot register more domains",
		};
	}

	// Validate the domain
	const validation = validateDomain(domain);
	if (!validation.valid) {
		return {
			success: false,
			error: validation.error || "Invalid domain",
			validation,
		};
	}

	// Create domain in Resend
	const result = await resendRequest<ResendDomainData>("/domains", {
		method: "POST",
		body: JSON.stringify({ name: validation.normalizedDomain }),
	});

	return {
		...result,
		validation,
	};
}

/**
 * Create a Resend domain (basic, without validation - for internal use)
 */
export async function createResendDomain(name: string) {
	return resendRequest<ResendDomainData>("/domains", {
		method: "POST",
		body: JSON.stringify({ name }),
	});
}

/**
 * Get domain details from Resend
 */
export async function getResendDomain(domainId: string) {
	return resendRequest<ResendDomainData>(`/domains/${domainId}`, {
		method: "GET",
	});
}

/**
 * Trigger domain verification in Resend
 */
export async function verifyResendDomain(domainId: string) {
	return resendRequest<ResendDomainData>(`/domains/${domainId}/verify`, {
		method: "POST",
	});
}

/**
 * Delete a domain from Resend
 */
export async function deleteResendDomain(domainId: string) {
	return resendRequest<void>(`/domains/${domainId}`, {
		method: "DELETE",
	});
}

/**
 * List all domains in Resend account
 */
export async function listResendDomains() {
	return resendRequest<{ data: ResendDomainData[] }>("/domains", {
		method: "GET",
	});
}

/**
 * Create an inbound email route
 */
export async function createInboundRoute(params: {
	name: string;
	recipients: string[];
	url: string;
}) {
	return resendRequest<ResendInboundRouteData>("/inbound", {
		method: "POST",
		body: JSON.stringify(params),
	});
}

/**
 * Delete an inbound route
 */
export async function deleteInboundRoute(routeId: string) {
	return resendRequest<void>(`/inbound/${routeId}`, {
		method: "DELETE",
	});
}

/**
 * List all inbound routes
 */
export async function listInboundRoutes() {
	return resendRequest<{ data: ResendInboundRouteData[] }>("/inbound", {
		method: "GET",
	});
}

/**
 * Get domain metrics from Resend (for deliverability monitoring)
 */
export async function getResendDomainMetrics(domainId: string) {
	// Resend doesn't have a direct metrics endpoint per domain
	// We track metrics in our database via webhook events
	return resendRequest<any>(`/domains/${domainId}`, {
		method: "GET",
	});
}

/**
 * Verify Resend webhook signature (Svix)
 */
export async function verifyResendWebhookSignature({
	payload,
	headers,
}: {
	payload: string;
	headers: {
		svixId?: string;
		svixTimestamp?: string;
		svixSignature?: string;
	};
}): Promise<boolean> {
	const secret = process.env.RESEND_WEBHOOK_SECRET;
	const { svixId, svixTimestamp, svixSignature } = headers;

	if (!secret || !svixId || !svixTimestamp || !svixSignature) {
		return false;
	}

	// Svix signature format: v1,<base64_signature>
	const signatures = svixSignature.split(" ");
	const signedPayload = `${svixId}.${svixTimestamp}.${payload}`;

	// Try to decode the secret (Svix uses whsec_ prefix)
	const secretBytes = secret.startsWith("whsec_")
		? Buffer.from(secret.slice(6), "base64")
		: Buffer.from(secret);

	const computed = crypto
		.createHmac("sha256", secretBytes)
		.update(signedPayload)
		.digest("base64");

	// Check against all provided signatures
	for (const sig of signatures) {
		const [version, expectedSig] = sig.split(",");
		if (version === "v1" && expectedSig === computed) {
			return true;
		}
	}

	return false;
}

// =============================================================================
// RECEIVED EMAIL FUNCTIONS (Inbound)
// =============================================================================

interface ReceivedEmailData {
	id: string;
	from: string;
	to: string[];
	subject: string;
	text?: string;
	html?: string;
	created_at: string;
	attachments?: { id: string; filename: string; content_type: string }[];
}

interface ReceivedAttachmentData {
	id: string;
	filename: string;
	content_type: string;
	content: string; // base64 encoded
}

/**
 * Get a received email by ID
 */
export async function getReceivedEmail(
	emailId: string,
): Promise<ResendResponse<ReceivedEmailData>> {
	return resendRequest<ReceivedEmailData>(`/emails/${emailId}`, {
		method: "GET",
	});
}

/**
 * List attachments for a received email
 */
export async function listReceivedEmailAttachments(
	emailId: string,
): Promise<ResendResponse<{ data: ReceivedAttachmentData[] }>> {
	return resendRequest<{ data: ReceivedAttachmentData[] }>(
		`/emails/${emailId}/attachments`,
		{ method: "GET" },
	);
}

/**
 * Get a specific attachment from a received email
 */
export async function getReceivedEmailAttachment(
	emailId: string,
	attachmentId: string,
): Promise<ResendResponse<ReceivedAttachmentData>> {
	return resendRequest<ReceivedAttachmentData>(
		`/emails/${emailId}/attachments/${attachmentId}`,
		{ method: "GET" },
	);
}

/**
 * Verify DNS records for a domain (for onboarding tracker)
 */
export async function verifyDomainDNS(domain: string): Promise<{
	success: boolean;
	records: Array<{
		id: string;
		type: string;
		name: string;
		value: string;
		purpose: string;
		verified: boolean;
	}>;
	error?: string;
}> {
	try {
		// First, get all domains to find the one matching our domain
		const listResult = await listResendDomains();

		if (!listResult.success || !listResult.data) {
			return {
				success: false,
				records: [],
				error: "Failed to fetch domains from Resend",
			};
		}

		// Find the domain by name
		const domainData = listResult.data.data?.find((d) => d.name === domain);

		if (!domainData) {
			return {
				success: false,
				records: [],
				error: `Domain ${domain} not found in Resend`,
			};
		}

		// Trigger verification
		await verifyResendDomain(domainData.id);

		// Get fresh domain data after verification
		const verifyResult = await getResendDomain(domainData.id);

		if (!verifyResult.success || !verifyResult.data) {
			return {
				success: false,
				records: [],
				error: "Failed to verify domain",
			};
		}

		// Format records for the tracker
		const records = (verifyResult.data.records || []).map((record, index) => ({
			id: `${record.type.toLowerCase()}-${index}`,
			type: record.type,
			name: record.name,
			value: record.value,
			purpose: getPurposeLabel(record.type),
			verified: verifyResult.data.status === "verified",
		}));

		return {
			success: true,
			records,
		};
	} catch (error) {
		return {
			success: false,
			records: [],
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get purpose label for DNS record type
 */
function getPurposeLabel(type: string): string {
	const purposes: Record<string, string> = {
		TXT: "SPF - Authorizes sending",
		CNAME: "DKIM - Email signing",
		MX: "Email routing",
		DMARC: "DMARC - Policy",
	};
	return purposes[type] || "Email authentication";
}

// Re-export validation utilities for convenience
export {
	validateDomain,
	generatePlatformSubdomain,
	getDomainConfig,
	canRegisterMoreDomains,
	suggestSubdomains,
	type DomainValidationResult,
};
