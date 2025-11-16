import "server-only";

const TELNYX_API_BASE = "https://api.telnyx.com/v2";

type NumberLookupResponse = {
	caller_name?: string | null;
	carrier?: {
		name?: string | null;
		type?: string | null;
	} | null;
	country_code?: string | null;
	national_format?: string | null;
	sanitized_number?: string | null;
};

export async function lookupCallerInfo(phoneNumber: string) {
	const apiKey = process.env.TELNYX_API_KEY;

	if (!apiKey) {
		return {
			success: false,
			error: "TELNYX_API_KEY is not configured",
		};
	}

	try {
		const response = await fetch(`${TELNYX_API_BASE}/number_lookup/${encodeURIComponent(phoneNumber)}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			cache: "no-store",
		});

		if (!response.ok) {
			const errorPayload = await response.json().catch(() => ({ errors: [{ detail: response.statusText }] }));

			return {
				success: false,
				error: errorPayload?.errors?.[0]?.detail || `Telnyx lookup failed (${response.status})`,
			};
		}

		const payload = (await response.json()) as { data?: NumberLookupResponse };

		return {
			success: true,
			data: payload.data,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error during lookup",
		};
	}
}
