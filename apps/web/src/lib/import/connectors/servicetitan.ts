/**
 * ServiceTitan API Connector
 *
 * Features:
 * - OAuth 2.0 authentication
 * - Rate limiting (60 calls/sec per tenant)
 * - ContinueFrom token pagination
 * - Comprehensive entity support
 *
 * API Documentation: https://developer.servicetitan.io
 */

import type {
	DataConnectorConfig,
	EntityType,
	FetchOptions,
	SchemaDefinition,
	SchemaField,
} from "@/types/import";
import { BaseDataConnector } from "./base";

interface ServiceTitanTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
}

interface ServiceTitanPaginationInfo {
	continueFrom?: string;
	hasMore: boolean;
}

export class ServiceTitanConnector extends BaseDataConnector {
	private readonly baseUrl = "https://api.servicetitan.io";
	private readonly authUrl = "https://auth.servicetitan.io";
	private readonly apiVersion = "v2";

	// Rate limiting: 60 calls/sec per tenant
	private readonly rateLimit = 60;
	private rateLimitRemaining = 60;
	private rateLimitResetAt = new Date();

	constructor(config: DataConnectorConfig) {
		super(config);
	}

	// ========================================================================
	// Authentication
	// ========================================================================

	async authenticate(): Promise<{
		success: boolean;
		token?: string;
		error?: string;
	}> {
		try {
			// Check if we already have a valid token
			if (this.credentials.accessToken && this.credentials.tokenExpiry) {
				const expiry = new Date(this.credentials.tokenExpiry);
				if (expiry > new Date()) {
					this.authToken = this.credentials.accessToken;
					this.authenticated = true;
					return { success: true, token: this.authToken };
				}
			}

			// Refresh token if available
			if (this.credentials.refreshToken) {
				return await this.refreshAccessToken();
			}

			// Otherwise, get new token with client credentials
			return await this.getAccessToken();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Authentication failed";
			this.log("error", "Authentication failed", error);
			return { success: false, error: message };
		}
	}

	private async getAccessToken(): Promise<{
		success: boolean;
		token?: string;
		error?: string;
	}> {
		const { clientId, clientSecret } = this.credentials;

		if (!clientId || !clientSecret) {
			return {
				success: false,
				error: "Client ID and Client Secret are required",
			};
		}

		try {
			const response = await fetch(`${this.authUrl}/connect/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "client_credentials",
					client_id: clientId,
					client_secret: clientSecret,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`OAuth failed: ${response.status} - ${error}`);
			}

			const data: ServiceTitanTokenResponse = await response.json();

			this.authToken = data.access_token;
			this.authenticated = true;

			// Update credentials with new token
			this.credentials.accessToken = data.access_token;
			this.credentials.tokenExpiry = new Date(
				Date.now() + data.expires_in * 1000,
			).toISOString();
			if (data.refresh_token) {
				this.credentials.refreshToken = data.refresh_token;
			}

			this.log("info", "Successfully authenticated with ServiceTitan");
			return { success: true, token: this.authToken };
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Token request failed";
			this.log("error", "Failed to get access token", error);
			return { success: false, error: message };
		}
	}

	private async refreshAccessToken(): Promise<{
		success: boolean;
		token?: string;
		error?: string;
	}> {
		const { clientId, clientSecret, refreshToken } = this.credentials;

		if (!clientId || !clientSecret || !refreshToken) {
			return await this.getAccessToken();
		}

		try {
			const response = await fetch(`${this.authUrl}/connect/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "refresh_token",
					client_id: clientId,
					client_secret: clientSecret,
					refresh_token: refreshToken,
				}),
			});

			if (!response.ok) {
				// If refresh fails, try getting new token
				return await this.getAccessToken();
			}

			const data: ServiceTitanTokenResponse = await response.json();

			this.authToken = data.access_token;
			this.authenticated = true;

			// Update credentials
			this.credentials.accessToken = data.access_token;
			this.credentials.tokenExpiry = new Date(
				Date.now() + data.expires_in * 1000,
			).toISOString();
			if (data.refresh_token) {
				this.credentials.refreshToken = data.refresh_token;
			}

			this.log("info", "Successfully refreshed ServiceTitan token");
			return { success: true, token: this.authToken };
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Token refresh failed";
			this.log("error", "Failed to refresh token", error);
			return { success: false, error: message };
		}
	}

	// ========================================================================
	// Data Fetching
	// ========================================================================

	async *fetchData(
		entity: EntityType,
		options: FetchOptions,
	): AsyncGenerator<Record<string, unknown>, void, undefined> {
		this.validateEntityType(entity);

		// Ensure authenticated
		if (!this.authenticated) {
			const authResult = await this.authenticate();
			if (!authResult.success) {
				throw new Error(`Authentication failed: ${authResult.error}`);
			}
		}

		const endpoint = this.getEntityEndpoint(entity);
		let continueFrom = options.continueFrom;
		let hasMore = true;
		let pageCount = 0;

		while (hasMore) {
			// Rate limiting
			await this.waitForRateLimit();

			try {
				const url = this.buildUrl(endpoint, {
					continueFrom,
					includeDeleted: options.includeDeleted,
					...options.filters,
				});

				const response = await this.makeRequest(url);
				const data = await response.json();

				// ServiceTitan returns {data: [], continueFrom: string}
				const records = data.data || [];
				continueFrom = data.continueFrom;
				hasMore = !!continueFrom && records.length > 0;

				this.log("info", `Fetched page ${++pageCount} of ${entity}`, {
					count: records.length,
					hasMore,
				});

				// Yield each record
				for (const record of records) {
					yield this.sanitizeData(this.transformRecord(entity, record));
				}

				// Update rate limit info from response headers
				this.updateRateLimitFromHeaders(response.headers);
			} catch (error) {
				this.log("error", `Failed to fetch ${entity}`, error);
				throw error;
			}
		}

		this.log("info", `Completed fetching ${entity}`, { totalPages: pageCount });
	}

	// ========================================================================
	// Schema Definition
	// ========================================================================

	async getSchema(entity: EntityType): Promise<SchemaDefinition> {
		const schemas: Record<EntityType, SchemaDefinition> = {
			customers: {
				entity: "customers",
				primaryKey: "id",
				fields: [
					{
						name: "id",
						type: "number",
						required: true,
						description: "ServiceTitan customer ID",
					},
					{
						name: "name",
						type: "string",
						required: true,
						description: "Customer name",
					},
					{
						name: "type",
						type: "string",
						required: true,
						description: "residential or commercial",
					},
					{
						name: "email",
						type: "string",
						required: false,
						description: "Primary email",
					},
					{
						name: "phoneNumbers",
						type: "array",
						required: false,
						description: "Phone numbers",
					},
					{
						name: "address",
						type: "json",
						required: false,
						description: "Address object",
					},
					{
						name: "balance",
						type: "number",
						required: false,
						description: "Account balance",
					},
					{
						name: "tags",
						type: "array",
						required: false,
						description: "Customer tags",
					},
					{
						name: "customFields",
						type: "json",
						required: false,
						description: "Custom field values",
					},
					{
						name: "createdOn",
						type: "datetime",
						required: true,
						description: "Creation timestamp",
					},
					{
						name: "modifiedOn",
						type: "datetime",
						required: false,
						description: "Last modified",
					},
					{
						name: "active",
						type: "boolean",
						required: true,
						description: "Is active",
					},
				],
				relationships: [
					{
						field: "locations",
						referencesEntity: "properties",
						referencesField: "customerId",
					},
					{
						field: "jobs",
						referencesEntity: "jobs",
						referencesField: "customerId",
					},
				],
			},
			jobs: {
				entity: "jobs",
				primaryKey: "id",
				fields: [
					{ name: "id", type: "number", required: true },
					{ name: "jobNumber", type: "string", required: true },
					{ name: "customerId", type: "number", required: true },
					{ name: "locationId", type: "number", required: false },
					{ name: "jobType", type: "string", required: true },
					{ name: "summary", type: "string", required: false },
					{ name: "status", type: "string", required: true },
					{ name: "completedOn", type: "datetime", required: false },
					{ name: "total", type: "number", required: false },
					{ name: "technicians", type: "array", required: false },
				],
				relationships: [
					{
						field: "customerId",
						referencesEntity: "customers",
						referencesField: "id",
					},
					{
						field: "locationId",
						referencesEntity: "properties",
						referencesField: "id",
					},
				],
			},
			invoices: {
				entity: "invoices",
				primaryKey: "id",
				fields: [
					{ name: "id", type: "number", required: true },
					{ name: "number", type: "string", required: true },
					{ name: "customerId", type: "number", required: true },
					{ name: "jobId", type: "number", required: false },
					{ name: "total", type: "number", required: true },
					{ name: "balance", type: "number", required: true },
					{ name: "status", type: "string", required: true },
					{ name: "dueDate", type: "date", required: false },
					{ name: "items", type: "array", required: false },
				],
				relationships: [
					{
						field: "customerId",
						referencesEntity: "customers",
						referencesField: "id",
					},
					{ field: "jobId", referencesEntity: "jobs", referencesField: "id" },
				],
			},
			// Add more entities as needed
		} as Partial<Record<EntityType, SchemaDefinition>>;

		const schema = schemas[entity];
		if (!schema) {
			throw new Error(`Schema not defined for entity: ${entity}`);
		}

		return schema;
	}

	// ========================================================================
	// Utilities
	// ========================================================================

	async estimateRecordCount(
		entity: EntityType,
		filters?: Record<string, unknown>,
	): Promise<number> {
		// ServiceTitan doesn't provide count endpoint, so we fetch first page
		const endpoint = this.getEntityEndpoint(entity);
		const url = this.buildUrl(endpoint, { ...filters, pageSize: 1 });

		try {
			const response = await this.makeRequest(url);
			const data = await response.json();

			// If there's a continueFrom token, assume large dataset
			if (data.continueFrom) {
				return 10000; // Estimate for planning
			}

			return data.data?.length || 0;
		} catch (error) {
			this.log("warn", "Failed to estimate record count, returning 0", error);
			return 0;
		}
	}

	async getRateLimitInfo(): Promise<{
		limit: number;
		remaining: number;
		resetAt: Date;
	}> {
		return {
			limit: this.rateLimit,
			remaining: this.rateLimitRemaining,
			resetAt: this.rateLimitResetAt,
		};
	}

	protected getSupportedEntities(): EntityType[] {
		return [
			"customers",
			"jobs",
			"invoices",
			"estimates",
			"equipment",
			"properties",
			"team",
			"appointments",
			"payments",
		];
	}

	// ========================================================================
	// Private Helpers
	// ========================================================================

	private getEntityEndpoint(entity: EntityType): string {
		const endpoints: Partial<Record<EntityType, string>> = {
			customers: "/crm/v2/export/customers",
			jobs: "/jpm/v2/export/jobs",
			invoices: "/accounting/v2/export/invoices",
			estimates: "/sales/v2/export/estimates",
			equipment: "/equipment/v2/export/equipment",
			properties: "/crm/v2/export/locations",
			team: "/settings/v2/export/technicians",
			appointments: "/jpm/v2/export/appointments",
			payments: "/accounting/v2/export/payments",
		};

		const endpoint = endpoints[entity];
		if (!endpoint) {
			throw new Error(`Endpoint not configured for entity: ${entity}`);
		}

		return endpoint;
	}

	private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
		const url = new URL(`${this.baseUrl}${endpoint}`);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		// Add tenant ID if available
		if (this.credentials.tenantId) {
			url.searchParams.append("tenant", this.credentials.tenantId);
		}

		return url.toString();
	}

	private async makeRequest(url: string): Promise<Response> {
		if (!this.authToken) {
			throw new Error("Not authenticated");
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.authToken}`,
				"Content-Type": "application/json",
			},
		});

		if (response.status === 401) {
			// Try to refresh token
			const authResult = await this.authenticate();
			if (authResult.success) {
				// Retry request
				return this.makeRequest(url);
			}
			throw new Error("Authentication expired and refresh failed");
		}

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`ServiceTitan API error: ${response.status} - ${errorText}`,
			);
		}

		return response;
	}

	private transformRecord(
		entity: EntityType,
		record: any,
	): Record<string, unknown> {
		// Transform ServiceTitan data to Stratos format
		const transformed: Record<string, unknown> = { ...record };

		// Store original ID for relationship mapping
		transformed.external_id = String(record.id);

		// Normalize phone numbers
		if (record.phoneNumbers && Array.isArray(record.phoneNumbers)) {
			transformed.phone = record.phoneNumbers[0]?.number;
			transformed.phone_numbers = record.phoneNumbers;
		}

		// Normalize email
		if (record.email) {
			transformed.email = this.normalizeEmail(record.email);
		}

		// Handle address
		if (record.address) {
			transformed.address = record.address.street;
			transformed.city = record.address.city;
			transformed.state = record.address.state;
			transformed.zip = record.address.zip;
		}

		return transformed;
	}

	private async waitForRateLimit(): Promise<void> {
		if (this.rateLimitRemaining <= 1) {
			const now = Date.now();
			const resetAt = this.rateLimitResetAt.getTime();
			const waitTime = Math.max(0, resetAt - now);

			if (waitTime > 0) {
				this.log("info", `Rate limit reached, waiting ${waitTime}ms`);
				await this.sleep(waitTime);
			}

			// Reset rate limit
			this.rateLimitRemaining = this.rateLimit;
			this.rateLimitResetAt = new Date(Date.now() + 1000); // 1 second window
		}

		this.rateLimitRemaining--;
	}

	private updateRateLimitFromHeaders(headers: Headers): void {
		const remaining = headers.get("x-ratelimit-remaining");
		const reset = headers.get("x-ratelimit-reset");

		if (remaining) {
			this.rateLimitRemaining = parseInt(remaining, 10);
		}

		if (reset) {
			this.rateLimitResetAt = new Date(parseInt(reset, 10) * 1000);
		}
	}
}
