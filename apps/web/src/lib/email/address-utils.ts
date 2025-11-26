const extractEmailFromFormat = (str: string): string => {
	const emailMatch = str.match(/<([^>]+)>/);
	if (emailMatch && emailMatch[1]) {
		return emailMatch[1].trim();
	}
	if (str.includes("@") && str.length > 3) {
		return str.trim();
	}
	return str.trim();
};

function normalizeArray(value: unknown): string[] {
	if (!value) return [];
	if (Array.isArray(value)) {
		return value
			.map((item) => (typeof item === "string" ? item.trim() : ""))
			.filter(Boolean);
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return [];
		if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
			try {
				const parsed = JSON.parse(trimmed);
				if (Array.isArray(parsed)) {
					return parsed
						.map((item) => (typeof item === "string" ? item.trim() : ""))
						.filter(Boolean);
				}
			} catch (error) {
				// fall back to comma-separated parsing
			}
		}
		return trimmed
			.split(/[;,]+/)
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return [];
}

function getFromProviderMetadata(
	providerMetadata?: Record<string, unknown> | null,
	metadataKey?: string,
): string | null {
	if (!providerMetadata || !metadataKey) return null;
	const metadataValue = providerMetadata[metadataKey];
	if (!metadataValue) return null;
	if (typeof metadataValue === "string" && metadataValue.includes("@")) {
		return extractEmailFromFormat(metadataValue);
	}
	if (typeof metadataValue === "object") {
		const data = (metadataValue as any).data;
		if (data && metadataKey && data[metadataKey]) {
			return extractEmailFromFormat(data[metadataKey]);
		}
	}
	return null;
}

export function extractFullEmailAddress(
	value: unknown,
	providerMetadata?: Record<string, unknown> | null,
	metadataKey?: string,
): string {
	if (typeof value === "string" && value.length > 0) {
		const extracted = extractEmailFromFormat(value);
		if (extracted.length > 1 && extracted.includes("@")) {
			return extracted;
		}
	}

	if (Array.isArray(value) && value.length > 0) {
		const first = value[0];
		if (typeof first === "string" && first.length > 0) {
			const extracted = extractEmailFromFormat(first);
			if (extracted.length > 1 && extracted.includes("@")) {
				return extracted;
			}
		}
		if (first && typeof first === "object" && "email" in first) {
			const email = (first as { email?: string }).email;
			if (email && typeof email === "string" && email.length > 0) {
				return extractEmailFromFormat(email);
			}
		}
	}

	if (value && typeof value === "object" && !Array.isArray(value)) {
		const obj = value as Record<string, unknown>;
		if (
			"email" in obj &&
			typeof obj.email === "string" &&
			obj.email.length > 0
		) {
			return extractEmailFromFormat(obj.email);
		}
	}

	const fallback = getFromProviderMetadata(providerMetadata, metadataKey);
	if (fallback) return fallback;

	return "Unknown";
}

export function normalizeEmailAddressList(
	value: string | string[] | null | undefined,
): string[] {
	return normalizeArray(value);
}
