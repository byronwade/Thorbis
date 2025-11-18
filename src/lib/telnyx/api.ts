import "server-only";

const TELNYX_BASE_URL = "https://api.telnyx.com/v2";

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
		const response = await fetch(`${TELNYX_BASE_URL}${path}`, {
			method,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		const payload = (await response.json().catch(() => {})) as
			| { data?: TResponse; errors?: Array<{ detail?: string }> }
			| undefined;

		if (!response.ok) {
			const message =
				payload?.errors?.[0]?.detail ||
				payload?.errors?.[0] ||
				response.statusText;
			return {
				success: false,
				error: `Telnyx ${response.status}: ${message}`,
			};
		}

		return { success: true, data: payload?.data };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown Telnyx API error",
		};
	}
}
