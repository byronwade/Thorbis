"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
	createSendGridDomain,
	getSendGridDomain,
	verifySendGridDomain,
	listSendGridDomains,
	getDomainDNSRecords,
	type SendGridDomain,
} from "@/lib/email/sendgrid-domains";

const setupDomainSchema = z.object({
	domain: z.string().min(1, "Domain is required"),
	subdomain: z.string().optional(),
});

/**
 * Setup SendGrid domain authentication
 */
export async function setupSendGridDomain(
	input: z.infer<typeof setupDomainSchema>,
): Promise<{
	success: boolean;
	domain?: SendGridDomain;
	dnsRecords?: ReturnType<typeof getDomainDNSRecords>;
	error?: string;
}> {
	try {
		const payload = setupDomainSchema.parse(input);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("company_id")
			.eq("id", user.id)
			.single();

		if (!profile?.company_id) {
			return { success: false, error: "No company found" };
		}

		// Create domain in SendGrid (uses global API key from environment)
		const domainResult = await createSendGridDomain(
			payload.domain,
			payload.subdomain || null,
		);

		if (!domainResult.success || !domainResult.domain) {
			return {
				success: false,
				error: domainResult.error || "Failed to create domain in SendGrid",
			};
		}

		const sendGridDomain = domainResult.domain;
		const dnsRecords = getDomainDNSRecords(sendGridDomain);

		// Store domain in company_email_domains table
		const fullDomain = payload.subdomain
			? `${payload.subdomain}.${payload.domain}`
			: payload.domain;

		const { error: domainError } = await supabase
			.from("company_email_domains")
			.upsert(
				{
					company_id: profile.company_id,
					domain_name: payload.domain,
					subdomain: payload.subdomain || "mail",
					sendgrid_domain_id: sendGridDomain.id.toString(),
					status: sendGridDomain.valid ? "verified" : "pending",
					sending_enabled: sendGridDomain.valid,
					dns_records: {
						mail_cname: dnsRecords.mailCname,
						dkim1: dnsRecords.dkim1,
						dkim2: dnsRecords.dkim2,
					},
					is_platform_subdomain: false,
					last_verified_at: sendGridDomain.valid
						? new Date().toISOString()
						: null,
				},
				{
					onConflict: "company_id,domain_name,subdomain",
				},
			);

		if (domainError) {
			console.error("Failed to save domain to database:", domainError);
			// Don't fail the whole operation if DB save fails
		}

		revalidatePath("/dashboard/settings/communications/email");
		return {
			success: true,
			domain: sendGridDomain,
			dnsRecords,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors[0]?.message || "Invalid input" };
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to setup domain",
		};
	}
}

/**
 * Verify SendGrid domain status
 */
export async function verifySendGridDomainStatus(
	domainId: string,
): Promise<{
	success: boolean;
	domain?: SendGridDomain;
	dnsRecords?: ReturnType<typeof getDomainDNSRecords>;
	error?: string;
}> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("company_id")
			.eq("id", user.id)
			.single();

		if (!profile?.company_id) {
			return { success: false, error: "No company found" };
		}

		// Verify domain with SendGrid (uses global API key from environment)
		const verifyResult = await verifySendGridDomain(
			parseInt(domainId),
		);

		if (!verifyResult.success || !verifyResult.domain) {
			return {
				success: false,
				error: verifyResult.error || "Failed to verify domain",
			};
		}

		const sendGridDomain = verifyResult.domain;
		const dnsRecords = getDomainDNSRecords(sendGridDomain);

		// Update domain status in database
		const { error: updateError } = await supabase
			.from("company_email_domains")
			.update({
				status: sendGridDomain.valid ? "verified" : "pending",
				sending_enabled: sendGridDomain.valid,
				dns_records: {
					mail_cname: dnsRecords.mailCname,
					dkim1: dnsRecords.dkim1,
					dkim2: dnsRecords.dkim2,
				},
				last_verified_at: sendGridDomain.valid
					? new Date().toISOString()
					: null,
			})
			.eq("sendgrid_domain_id", domainId);

		if (updateError) {
			console.error("Failed to update domain status:", updateError);
		}

		revalidatePath("/dashboard/settings/communications/email");
		return {
			success: true,
			domain: sendGridDomain,
			dnsRecords,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to verify domain",
		};
	}
}

/**
 * Get current SendGrid domain configuration status
 */
export async function getSendGridDomainStatus(): Promise<{
	success: boolean;
	hasApiKey?: boolean;
	domain?: {
		id: string;
		domain: string;
		subdomain: string | null;
		status: string;
		valid: boolean;
		dnsRecords: ReturnType<typeof getDomainDNSRecords>;
	};
	error?: string;
}> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("company_id")
			.eq("id", user.id)
			.single();

		if (!profile?.company_id) {
			return { success: false, error: "No company found" };
		}

		// Check if SendGrid API key is configured globally
		const { env } = await import("@stratos/config/env");
		const hasApiKey = !!env.sendgrid.apiKey;

		if (!hasApiKey) {
			return { success: true, hasApiKey: false };
		}

		// Get domain from database
		const { data: domainData } = await supabase
			.from("company_email_domains")
			.select("sendgrid_domain_id, domain_name, subdomain, status, dns_records")
			.eq("company_id", profile.company_id)
			.eq("is_platform_subdomain", false)
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (!domainData?.sendgrid_domain_id) {
			return { success: true, hasApiKey: true };
		}

		// Get latest status from SendGrid (uses global API key from environment)
		const domainResult = await getSendGridDomain(
			parseInt(domainData.sendgrid_domain_id),
		);

		if (!domainResult.success || !domainResult.domain) {
			return {
				success: true,
				hasApiKey: true,
				domain: {
					id: domainData.sendgrid_domain_id,
					domain: domainData.domain_name,
					subdomain: domainData.subdomain,
					status: domainData.status || "pending",
					valid: false,
					dnsRecords: {},
				},
			};
		}

		const sendGridDomain = domainResult.domain;
		const dnsRecords = getDomainDNSRecords(sendGridDomain);

		return {
			success: true,
			hasApiKey: true,
			domain: {
				id: domainData.sendgrid_domain_id,
				domain: domainData.domain_name,
				subdomain: domainData.subdomain,
				status: sendGridDomain.valid ? "verified" : "pending",
				valid: sendGridDomain.valid,
				dnsRecords,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get domain status",
		};
	}
}

