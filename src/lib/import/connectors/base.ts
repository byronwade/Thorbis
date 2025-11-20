/**
 * Base DataConnector Interface and Abstract Class
 * Defines the contract all platform connectors must implement
 */

import type {
	APICredentials,
	AsyncResult,
	DataConnectorConfig,
	EntityType,
	FetchOptions,
	PaginatedResponse,
	SchemaDefinition,
	SupportedPlatform,
} from "@/types/import";

/**
 * Core interface all connectors must implement
 */
export interface IDataConnector {
	platform: SupportedPlatform;
	companyId: string;

	/**
	 * Authenticate with the platform
	 * @returns Auth token or confirmation
	 */
	authenticate(): Promise<{ success: boolean; token?: string; error?: string }>;

	/**
	 * Fetch data from the platform with pagination
	 * @param entity Entity type to fetch
	 * @param options Fetch options (limit, offset, filters)
	 * @returns AsyncGenerator of records for memory-efficient streaming
	 */
	fetchData(
		entity: EntityType,
		options: FetchOptions,
	): AsyncGenerator<Record<string, unknown>, void, undefined>;

	/**
	 * Get schema definition for an entity
	 * @param entity Entity type
	 * @returns Schema with field definitions and relationships
	 */
	getSchema(entity: EntityType): Promise<SchemaDefinition>;

	/**
	 * Estimate total record count for planning
	 * @param entity Entity type
	 * @param filters Optional filters
	 * @returns Estimated count
	 */
	estimateRecordCount(
		entity: EntityType,
		filters?: Record<string, unknown>,
	): Promise<number>;

	/**
	 * Test connection to the platform
	 * @returns Test result with details
	 */
	testConnection(): Promise<{
		success: boolean;
		message: string;
		details?: unknown;
	}>;

	/**
	 * Get rate limit information
	 * @returns Current rate limit status
	 */
	getRateLimitInfo(): Promise<{
		limit: number;
		remaining: number;
		resetAt: Date;
	}>;
}

/**
 * Abstract base class with common functionality
 */
export abstract class BaseDataConnector implements IDataConnector {
	public readonly platform: SupportedPlatform;
	public readonly companyId: string;
	protected readonly userId: string;
	protected credentials: APICredentials;
	protected authenticated: boolean = false;
	protected authToken?: string;

	constructor(config: DataConnectorConfig) {
		this.platform = config.platform;
		this.companyId = config.companyId;
		this.userId = config.userId;
		this.credentials = config.credentials;
	}

	// ========================================================================
	// Abstract methods (must be implemented by subclasses)
	// ========================================================================

	abstract authenticate(): Promise<{
		success: boolean;
		token?: string;
		error?: string;
	}>;

	abstract fetchData(
		entity: EntityType,
		options: FetchOptions,
	): AsyncGenerator<Record<string, unknown>, void, undefined>;

	abstract getSchema(entity: EntityType): Promise<SchemaDefinition>;

	abstract estimateRecordCount(
		entity: EntityType,
		filters?: Record<string, unknown>,
	): Promise<number>;

	abstract getRateLimitInfo(): Promise<{
		limit: number;
		remaining: number;
		resetAt: Date;
	}>;

	// ========================================================================
	// Common methods (can be overridden if needed)
	// ========================================================================

	/**
	 * Test connection to the platform
	 * Default implementation attempts authentication
	 */
	async testConnection(): Promise<{
		success: boolean;
		message: string;
		details?: unknown;
	}> {
		try {
			const authResult = await this.authenticate();

			if (!authResult.success) {
				return {
					success: false,
					message: `Authentication failed: ${authResult.error}`,
					details: authResult,
				};
			}

			return {
				success: true,
				message: `Successfully connected to ${this.platform}`,
				details: authResult,
			};
		} catch (error) {
			return {
				success: false,
				message: `Connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				details: error,
			};
		}
	}

	/**
	 * Validate entity type is supported
	 */
	protected validateEntityType(entity: EntityType): void {
		const supportedEntities = this.getSupportedEntities();
		if (!supportedEntities.includes(entity)) {
			throw new Error(
				`Entity type "${entity}" not supported by ${this.platform}. ` +
					`Supported types: ${supportedEntities.join(", ")}`,
			);
		}
	}

	/**
	 * Get list of supported entities for this platform
	 * Override in subclass to specify supported entities
	 */
	protected getSupportedEntities(): EntityType[] {
		return [
			"customers",
			"jobs",
			"invoices",
			"estimates",
			"equipment",
			"properties",
			"team",
			"communications",
			"payments",
			"contracts",
		];
	}

	/**
	 * Log connector activity (for debugging/monitoring)
	 */
	protected log(
		level: "info" | "warn" | "error",
		message: string,
		data?: unknown,
	): void {
		const timestamp = new Date().toISOString();
		const logMessage = `[${timestamp}] [${this.platform}] [${level.toUpperCase()}] ${message}`;

		if (data) {
			console[level](logMessage, data);
		} else {
			console[level](logMessage);
		}
	}

	/**
	 * Handle API errors with retry logic
	 */
	protected async retryWithBackoff<T>(
		fn: () => Promise<T>,
		maxRetries: number = 3,
		baseDelay: number = 1000,
	): Promise<T> {
		let lastError: Error | undefined;

		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				return await fn();
			} catch (error) {
				lastError = error instanceof Error ? error : new Error("Unknown error");
				this.log(
					"warn",
					`Attempt ${attempt + 1}/${maxRetries} failed`,
					lastError,
				);

				// Don't retry on auth errors
				if (this.isAuthError(error)) {
					throw lastError;
				}

				// Exponential backoff
				if (attempt < maxRetries - 1) {
					const delay = baseDelay * 2 ** attempt;
					this.log("info", `Retrying in ${delay}ms...`);
					await this.sleep(delay);
				}
			}
		}

		throw lastError;
	}

	/**
	 * Check if error is authentication-related
	 */
	protected isAuthError(error: unknown): boolean {
		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			return (
				message.includes("unauthorized") ||
				message.includes("authentication") ||
				message.includes("401") ||
				message.includes("403")
			);
		}
		return false;
	}

	/**
	 * Sleep utility for backoff
	 */
	protected sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Format date for API requests
	 */
	protected formatDate(date: Date): string {
		return date.toISOString();
	}

	/**
	 * Parse date from API response
	 */
	protected parseDate(dateString: string): Date {
		return new Date(dateString);
	}

	/**
	 * Normalize phone number
	 */
	protected normalizePhone(phone: string): string {
		// Remove all non-digit characters
		const digits = phone.replace(/\D/g, "");

		// Add country code if missing (assume US)
		if (digits.length === 10) {
			return `+1${digits}`;
		} else if (digits.length === 11 && digits.startsWith("1")) {
			return `+${digits}`;
		}

		return `+${digits}`;
	}

	/**
	 * Normalize email
	 */
	protected normalizeEmail(email: string): string {
		return email.toLowerCase().trim();
	}

	/**
	 * Sanitize data before import
	 * Remove null bytes, control characters, etc.
	 */
	protected sanitizeData(
		data: Record<string, unknown>,
	): Record<string, unknown> {
		const sanitized: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(data)) {
			if (value === null || value === undefined) {
				continue;
			}

			if (typeof value === "string") {
				// Remove null bytes and control characters
				sanitized[key] = value
					.replace(/\x00/g, "")
					.replace(/[\x00-\x1F\x7F]/g, "");
			} else if (typeof value === "object" && !Array.isArray(value)) {
				sanitized[key] = this.sanitizeData(value as Record<string, unknown>);
			} else {
				sanitized[key] = value;
			}
		}

		return sanitized;
	}
}

/**
 * Factory function to create connectors
 */
export async function createConnector(
	config: DataConnectorConfig,
): Promise<IDataConnector> {
	// Dynamic import to avoid circular dependencies
	switch (config.platform) {
		case "servicetitan": {
			const { ServiceTitanConnector } = await import("./servicetitan");
			return new ServiceTitanConnector(config);
		}
		case "housecall":
		case "jobber":
			// Fallback to CSV for platforms without dedicated connectors
			// Users can export from Housecall Pro / Jobber and import via CSV
			console.log(
				`Platform ${config.platform} using CSV fallback - please export to CSV first`,
			);
		// Fall through to csv case
		case "csv":
		case "generic": {
			const { GenericCSVConnector } = await import("./generic-csv");
			return new GenericCSVConnector(config);
		}
		default:
			throw new Error(`Unsupported platform: ${config.platform}`);
	}
}
