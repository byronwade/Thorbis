import "server-only";

const TELNYX_BASE_URL = "https://api.telnyx.com/v2";
const TELNYX_PUBLIC_BASE_URL = "https://api.telnyx.com";

type TelnyxRequestOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: Record<string, unknown>;
};

/**
 * Make an authenticated request to the Telnyx API
 *
 * @param path - API endpoint path (e.g., "/10dlc/brand")
 * @param options - Request options (method, body)
 * @returns Promise with success status, data, and optional error
 */
export async function telnyxRequest<TResponse>(
	path: string,
	{ method = "GET", body }: TelnyxRequestOptions = {},
): Promise<{ success: boolean; data?: TResponse; error?: string }> {
	const apiKey = process.env.TELNYX_API_KEY;
	if (!apiKey) {
		return { success: false, error: "TELNYX_API_KEY is not configured" };
	}

	try {
		const hasProtocol = /^https?:\/\//i.test(path);
		const normalizedPath =
			hasProtocol || path.startsWith("/") ? path : `/${path}`;
		// Toll-free verification endpoints live under /public instead of /v2
		const requestUrl = hasProtocol
			? normalizedPath
			: normalizedPath.startsWith("/public/")
				? `${TELNYX_PUBLIC_BASE_URL}${normalizedPath}`
				: `${TELNYX_BASE_URL}${normalizedPath}`;

		console.log("🔵 Telnyx request:", {
			method,
			url: requestUrl,
			body: body ? JSON.stringify(body, null, 2) : undefined,
		});
		const response = await fetch(requestUrl, {
			method,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		const payload = (await response.json().catch(() => {})) as
			| {
					data?: TResponse;
					errors?: Array<{ detail?: string } | string>;
			  }
			| undefined;

		if (!response.ok) {
			let message = response.statusText;

			// Log the FULL error details for debugging
			console.error(
				"🔴 Telnyx error response (FULL):",
				JSON.stringify(
					{
						status: response.status,
						url: requestUrl,
						payload,
						rawErrors: payload?.errors,
					},
					null,
					2,
				),
			);

			if (payload?.errors && Array.isArray(payload.errors)) {
				const formatted = payload.errors
					.map(
						(
							err:
								| { detail?: string; code?: string; source?: unknown }
								| string,
						) => {
							if (typeof err === "string") {
								return err;
							}
							if (err.detail) {
								// Include error code and source if available
								const parts = [err.detail];
								if (err.code) parts.push(`[code: ${err.code}]`);
								if (err.source)
									parts.push(`[source: ${JSON.stringify(err.source)}]`);
								return parts.join(" ");
							}
							try {
								return JSON.stringify(err);
							} catch {
								return String(err);
							}
						},
					)
					.filter(Boolean);
				if (formatted.length > 0) {
					message = formatted.join("; ");
				}
			} else if (payload?.errors?.[0]) {
				message =
					payload.errors[0].detail || String(payload.errors[0]) || message;
			}

			return {
				success: false,
				error: `Telnyx ${response.status}: ${message}`,
			};
		}

		console.log("🟢 Telnyx response:", {
			status: response.status,
			url: requestUrl,
			payload: JSON.stringify(payload, null, 2),
		});

		// Telnyx API sometimes wraps response in "data", sometimes returns directly
		// Handle both formats
		const responseData = payload?.data || payload;

		return { success: true, data: responseData as TResponse };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown Telnyx API error",
		};
	}
}
