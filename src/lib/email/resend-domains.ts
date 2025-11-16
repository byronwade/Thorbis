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

export async function verifyResendDomain(domainId: string) {
	return resendRequest<any>(`/domains/${domainId}/verify`, {
		method: "POST",
	});
}

export async function deleteResendDomain(domainId: string) {
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

export async function deleteInboundRoute(routeId: string) {
	return resendRequest<void>(`/inbound/${routeId}`, {
		method: "DELETE",
	});
}

export async function verifyResendWebhookSignature({
	payload,
	signature,
}: {
	payload: string;
	signature: string;
}) {
	const secret = process.env.RESEND_WEBHOOK_SECRET;
	if (!(secret && signature)) {
		return false;
	}

	const [timestampPart, signaturePart] = signature.split(",");
	const timestamp = timestampPart?.split("=")[1] ?? "";
	const digest = signaturePart?.split("=")[1] ?? "";
	if (!(timestamp && digest)) {
		return false;
	}

	const computed = crypto
		.createHmac("sha256", secret)
		.update(`${timestamp}.${payload}`)
		.digest("hex");

	return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(digest));
}
