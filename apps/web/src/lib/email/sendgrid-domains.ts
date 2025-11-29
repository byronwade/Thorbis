/**
 * SendGrid Domain Authentication API Client
 *
 * Handles domain authentication with SendGrid for email sending.
 * SendGrid uses CNAME records for domain authentication (not TXT like some providers).
 */

import { env } from "@stratos/config/env";

const SENDGRID_API_BASE = "https://api.sendgrid.com/v3";

export type SendGridDomain = {
	id: number;
	domain: string;
	subdomain: string | null;
	username: string;
	user_id: number;
	ips: string[];
	custom_spf: boolean;
	default: boolean;
	legacy: boolean;
	automatic_security: boolean;
	valid: boolean;
	dns: {
		mail_cname: {
			host: string;
			type: string;
			data: string;
			valid: boolean;
		};
		dkim1: {
			host: string;
			type: string;
			data: string;
			valid: boolean;
		};
		dkim2: {
			host: string;
			type: string;
			data: string;
			valid: boolean;
		};
	};
};

export type SendGridDomainDNSRecord = {
	host: string;
	type: "CNAME" | "TXT";
	data: string;
	valid: boolean;
};

export type SendGridDomainResponse = {
	result: SendGridDomain[];
};

/**
 * Get SendGrid API key (global multi-tenant key)
 * Uses environment variable - single API key for all companies
 */
function getSendGridApiKey(): string | null {
	return env.sendgrid.apiKey || null;
}

/**
 * Make authenticated request to SendGrid API
 */
async function sendGridRequest<T>(
	endpoint: string,
	options: RequestInit,
	apiKey: string,
): Promise<{ data?: T; error?: string }> {
	try {
		const response = await fetch(`${SENDGRID_API_BASE}${endpoint}`, {
			...options,
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = `SendGrid API error: ${response.status}`;
			
			try {
				const errorJson = JSON.parse(errorText);
				if (errorJson.errors && Array.isArray(errorJson.errors)) {
					errorMessage = errorJson.errors
						.map((e: { message?: string; field?: string }) => e.message || e.field)
						.join(", ");
				} else if (errorJson.message) {
					errorMessage = errorJson.message;
				}
			} catch {
				errorMessage = errorText || errorMessage;
			}

			return { error: errorMessage };
		}

		const data = await response.json();
		return { data };
	} catch (error) {
		return {
			error:
				error instanceof Error
					? error.message
					: "Failed to connect to SendGrid API",
		};
	}
}

/**
 * Create a domain in SendGrid
 * @param domain - Domain name (e.g., "thorbis.com")
 * @param subdomain - Optional subdomain (e.g., "mail")
 */
export async function createSendGridDomain(
	domain: string,
	subdomain: string | null,
): Promise<{ success: boolean; domain?: SendGridDomain; error?: string }> {
	const apiKey = getSendGridApiKey();
	if (!apiKey) {
		return { success: false, error: "SendGrid API key not configured. Please set SENDGRID_API_KEY environment variable." };
	}

	const domainToAuthenticate = subdomain ? `${subdomain}.${domain}` : domain;

	const result = await sendGridRequest<SendGridDomain>(
		"/whitelabel/domains",
		{
			method: "POST",
			body: JSON.stringify({
				domain: domainToAuthenticate,
				subdomain: subdomain || null,
				automatic_security: true, // Enable automated security (SPF/DKIM)
			}),
		},
		apiKey,
	);

	if (result.error) {
		return { success: false, error: result.error };
	}

	if (!result.data) {
		return { success: false, error: "No domain data returned from SendGrid" };
	}

	return { success: true, domain: result.data };
}

/**
 * Get domain details and DNS records from SendGrid
 * @param domainId - SendGrid domain ID
 */
export async function getSendGridDomain(
	domainId: number,
): Promise<{ success: boolean; domain?: SendGridDomain; error?: string }> {
	const apiKey = getSendGridApiKey();
	if (!apiKey) {
		return { success: false, error: "SendGrid API key not configured. Please set SENDGRID_API_KEY environment variable." };
	}

	const result = await sendGridRequest<SendGridDomain>(
		`/whitelabel/domains/${domainId}`,
		{
			method: "GET",
		},
		apiKey,
	);

	if (result.error) {
		return { success: false, error: result.error };
	}

	if (!result.data) {
		return { success: false, error: "Domain not found" };
	}

	return { success: true, domain: result.data };
}

/**
 * List all domains for a SendGrid account
 */
export async function listSendGridDomains(): Promise<{ success: boolean; domains?: SendGridDomain[]; error?: string }> {
	const apiKey = getSendGridApiKey();
	if (!apiKey) {
		return { success: false, error: "SendGrid API key not configured. Please set SENDGRID_API_KEY environment variable." };
	}

	const result = await sendGridRequest<SendGridDomainResponse>(
		"/whitelabel/domains",
		{
			method: "GET",
		},
		apiKey,
	);

	if (result.error) {
		return { success: false, error: result.error };
	}

	return { success: true, domains: result.data?.result || [] };
}

/**
 * Verify domain with SendGrid
 * @param domainId - SendGrid domain ID
 */
export async function verifySendGridDomain(
	domainId: number,
): Promise<{ success: boolean; domain?: SendGridDomain; error?: string }> {
	const apiKey = getSendGridApiKey();
	if (!apiKey) {
		return { success: false, error: "SendGrid API key not configured. Please set SENDGRID_API_KEY environment variable." };
	}

	const result = await sendGridRequest<SendGridDomain>(
		`/whitelabel/domains/${domainId}/validate`,
		{
			method: "POST",
		},
		apiKey,
	);

	if (result.error) {
		return { success: false, error: result.error };
	}

	if (!result.data) {
		return { success: false, error: "Verification failed" };
	}

	return { success: true, domain: result.data };
}

/**
 * Delete a domain from SendGrid
 * @param domainId - SendGrid domain ID
 */
export async function deleteSendGridDomain(
	domainId: number,
): Promise<{ success: boolean; error?: string }> {
	const apiKey = getSendGridApiKey();
	if (!apiKey) {
		return { success: false, error: "SendGrid API key not configured. Please set SENDGRID_API_KEY environment variable." };
	}

	const result = await sendGridRequest<never>(
		`/whitelabel/domains/${domainId}`,
		{
			method: "DELETE",
		},
		apiKey,
	);

	if (result.error) {
		return { success: false, error: result.error };
	}

	return { success: true };
}

/**
 * Get DNS records for a domain in a format suitable for display
 */
export function getDomainDNSRecords(domain: SendGridDomain): {
	spf?: SendGridDomainDNSRecord;
	dkim1?: SendGridDomainDNSRecord;
	dkim2?: SendGridDomainDNSRecord;
	mailCname?: SendGridDomainDNSRecord;
} {
	const records: {
		spf?: SendGridDomainDNSRecord;
		dkim1?: SendGridDomainDNSRecord;
		dkim2?: SendGridDomainDNSRecord;
		mailCname?: SendGridDomainDNSRecord;
	} = {};

	if (domain.dns.mail_cname) {
		records.mailCname = {
			host: domain.dns.mail_cname.host,
			type: domain.dns.mail_cname.type as "CNAME",
			data: domain.dns.mail_cname.data,
			valid: domain.dns.mail_cname.valid,
		};
	}

	if (domain.dns.dkim1) {
		records.dkim1 = {
			host: domain.dns.dkim1.host,
			type: domain.dns.dkim1.type as "CNAME",
			data: domain.dns.dkim1.data,
			valid: domain.dns.dkim1.valid,
		};
	}

	if (domain.dns.dkim2) {
		records.dkim2 = {
			host: domain.dns.dkim2.host,
			type: domain.dns.dkim2.type as "CNAME",
			data: domain.dns.dkim2.data,
			valid: domain.dns.dkim2.valid,
		};
	}

	return records;
}

