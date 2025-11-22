"use server";

import crypto from "node:crypto";

const RESEND_API_BASE = "https://api.resend.com";

type ResendResponse<T> =
	| { success: true; data: T }
	| { success: false; error: string };

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

export async function createResendDomain(name: string) {
	return resendRequest<any>("/domains", {
		method: "POST",
		body: JSON.stringify({ name }),
	});
}

export async function getResendDomain(domainId: string) {
	return resendRequest<any>(`/domains/${domainId}`, { method: "GET" });
}

async function verifyResendDomain(domainId: string) {
	return resendRequest<any>(`/domains/${domainId}/verify`, {
		method: "POST",
	});
}

async function deleteResendDomain(domainId: string) {
	return resendRequest<void>(`/domains/${domainId}`, {
		method: "DELETE",
	});
}

export async function createInboundRoute(params: {
	name: string;
	recipients: string[];
	url: string;
}) {
	return resendRequest<any>("/inbound", {
		method: "POST",
		body: JSON.stringify(params),
	});
}

async function deleteInboundRoute(routeId: string) {
	return resendRequest<void>(`/inbound/${routeId}`, {
		method: "DELETE",
	});
}

async function listReceivedEmails(params?: {
	limit?: number;
	cursor?: string;
}) {
	const queryParams = new URLSearchParams();
	if (params?.limit) queryParams.append("limit", params.limit.toString());
	if (params?.cursor) queryParams.append("cursor", params.cursor);
	
	const queryString = queryParams.toString();
	// Try the receiving endpoint - Resend API might use different paths
	const path = `/emails/receiving${queryString ? `?${queryString}` : ""}`;
	
	console.log(`📧 Calling Resend API: ${path}`);
	const response = await resendRequest<any>(path, {
		method: "GET",
	});
	
	if (!response.success) {
		// Try alternative endpoint format
		console.log(`⚠️  First attempt failed, trying alternative endpoint...`);
		const altPath = `/receiving/emails${queryString ? `?${queryString}` : ""}`;
		return resendRequest<any>(altPath, {
			method: "GET",
		});
	}
	
	return response;
}

export async function getReceivedEmail(emailId: string) {
	console.log(`🔍 Resend API: Fetching email ${emailId}`);
	
	// Try the receiving endpoint per Resend API docs: /emails/receiving/{id}
	let response = await resendRequest<any>(`/emails/receiving/${emailId}`, {
		method: "GET",
	});

	// If that fails, try the alternative endpoint format
	if (!response.success) {
		console.log(`⚠️  Receiving endpoint failed, trying alternative: /emails/${emailId}`);
		response = await resendRequest<any>(`/emails/${emailId}`, {
			method: "GET",
		});
	}

	if (response.success && response.data) {
		console.log(`✅ Resend API response for ${emailId}:`, {
			hasData: !!response.data,
			keys: Object.keys(response.data),
			hasHtml: !!response.data.html,
			hasText: !!response.data.text,
			hasBody: !!response.data.body,
			hasBodyHtml: !!response.data.body_html,
			hasPlainText: !!response.data.plain_text,
			htmlLength: response.data.html?.length || 0,
			textLength: response.data.text?.length || 0,
			// Log the actual structure for debugging
			dataSample: JSON.stringify(response.data).substring(0, 500),
		});
	} else {
		console.error(`❌ Resend API failed for ${emailId}:`, response.error);
	}

	return response;
}

export async function listReceivedEmailAttachments(emailId: string) {
	return resendRequest<any>(`/emails/${emailId}/attachments`, {
		method: "GET",
	});
}

export async function getReceivedEmailAttachment(
	emailId: string,
	attachmentId: string,
) {
	return resendRequest<any>(`/emails/${emailId}/attachments/${attachmentId}`, {
		method: "GET",
	});
}

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
}) {
	const secret = process.env.RESEND_WEBHOOK_SECRET;
	if (!secret) {
		console.error("RESEND_WEBHOOK_SECRET not configured");
		return false;
	}

	const { svixId, svixTimestamp, svixSignature } = headers;

	if (!(svixId && svixTimestamp && svixSignature)) {
		console.error("Missing required Svix headers");
		return false;
	}

	try {
		// Create the signed content
		const signedContent = `${svixId}.${svixTimestamp}.${payload}`;

		// Create HMAC signature
		const computed = crypto
			.createHmac("sha256", secret)
			.update(signedContent)
			.digest("hex");

		// Compare with the provided signature
		return crypto.timingSafeEqual(
			Buffer.from(`v1,${computed}`),
			Buffer.from(svixSignature),
		);
	} catch (error) {
		console.error("Error verifying webhook signature:", error);
		return false;
	}
}
