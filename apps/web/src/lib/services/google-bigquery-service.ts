/**
 * Google BigQuery API Service
 *
 * Data warehouse and analytics for large datasets.
 * Requires service account with BigQuery permissions.
 *
 * Features:
 * - Query execution
 * - Dataset management
 * - Table operations
 * - Data streaming
 * - Job management
 *
 * @see https://cloud.google.com/bigquery/docs/reference/rest
 */

// Types
export interface Dataset {
	kind: string;
	etag: string;
	id: string;
	selfLink: string;
	datasetReference: DatasetReference;
	friendlyName?: string;
	description?: string;
	defaultTableExpirationMs?: string;
	defaultPartitionExpirationMs?: string;
	labels?: Record<string, string>;
	access?: AccessEntry[];
	creationTime: string;
	lastModifiedTime: string;
	location: string;
	defaultEncryptionConfiguration?: { kmsKeyName: string };
	satisfiesPzs?: boolean;
}

export interface DatasetReference {
	datasetId: string;
	projectId: string;
}

export interface AccessEntry {
	role?: "READER" | "WRITER" | "OWNER";
	userByEmail?: string;
	groupByEmail?: string;
	domain?: string;
	specialGroup?:
		| "projectOwners"
		| "projectReaders"
		| "projectWriters"
		| "allAuthenticatedUsers";
	iamMember?: string;
	view?: TableReference;
	routine?: RoutineReference;
	dataset?: DatasetAccessEntry;
}

export interface DatasetAccessEntry {
	dataset: DatasetReference;
	targetTypes: string[];
}

export interface Table {
	kind: string;
	etag: string;
	id: string;
	selfLink: string;
	tableReference: TableReference;
	friendlyName?: string;
	description?: string;
	labels?: Record<string, string>;
	schema?: TableSchema;
	timePartitioning?: TimePartitioning;
	rangePartitioning?: RangePartitioning;
	clustering?: Clustering;
	requirePartitionFilter?: boolean;
	numBytes?: string;
	numLongTermBytes?: string;
	numRows?: string;
	creationTime: string;
	expirationTime?: string;
	lastModifiedTime: string;
	type?: "TABLE" | "VIEW" | "EXTERNAL" | "MATERIALIZED_VIEW" | "SNAPSHOT";
	view?: ViewDefinition;
	materializedView?: MaterializedViewDefinition;
	externalDataConfiguration?: ExternalDataConfiguration;
	location: string;
	streamingBuffer?: StreamingBuffer;
}

export interface TableReference {
	projectId: string;
	datasetId: string;
	tableId: string;
}

export interface RoutineReference {
	projectId: string;
	datasetId: string;
	routineId: string;
}

export interface TableSchema {
	fields: TableFieldSchema[];
}

export interface TableFieldSchema {
	name: string;
	type: FieldType;
	mode?: "NULLABLE" | "REQUIRED" | "REPEATED";
	description?: string;
	fields?: TableFieldSchema[];
	policyTags?: { names: string[] };
	maxLength?: string;
	precision?: string;
	scale?: string;
}

export type FieldType =
	| "STRING"
	| "BYTES"
	| "INTEGER"
	| "INT64"
	| "FLOAT"
	| "FLOAT64"
	| "NUMERIC"
	| "BIGNUMERIC"
	| "BOOLEAN"
	| "BOOL"
	| "TIMESTAMP"
	| "DATE"
	| "TIME"
	| "DATETIME"
	| "GEOGRAPHY"
	| "RECORD"
	| "STRUCT"
	| "JSON";

export interface TimePartitioning {
	type: "DAY" | "HOUR" | "MONTH" | "YEAR";
	expirationMs?: string;
	field?: string;
	requirePartitionFilter?: boolean;
}

export interface RangePartitioning {
	field: string;
	range: {
		start: string;
		end: string;
		interval: string;
	};
}

export interface Clustering {
	fields: string[];
}

export interface ViewDefinition {
	query: string;
	useLegacySql?: boolean;
	userDefinedFunctionResources?: {
		resourceUri?: string;
		inlineCode?: string;
	}[];
}

export interface MaterializedViewDefinition {
	query: string;
	lastRefreshTime?: string;
	enableRefresh?: boolean;
	refreshIntervalMs?: string;
}

export interface ExternalDataConfiguration {
	sourceUris: string[];
	sourceFormat: string;
	schema?: TableSchema;
	autodetect?: boolean;
}

export interface StreamingBuffer {
	estimatedBytes: string;
	estimatedRows: string;
	oldestEntryTime: string;
}

export interface QueryRequest {
	query: string;
	useLegacySql?: boolean;
	maxResults?: number;
	timeoutMs?: number;
	dryRun?: boolean;
	useQueryCache?: boolean;
	defaultDataset?: DatasetReference;
	parameterMode?: "POSITIONAL" | "NAMED";
	queryParameters?: QueryParameter[];
	labels?: Record<string, string>;
}

export interface QueryParameter {
	name?: string;
	parameterType: {
		type: string;
		structTypes?: { name?: string; type: { type: string } }[];
	};
	parameterValue: {
		value?: string;
		arrayValues?: { value?: string }[];
		structValues?: Record<string, { value?: string }>;
	};
}

export interface QueryResponse {
	kind: string;
	schema?: TableSchema;
	jobReference?: JobReference;
	totalRows?: string;
	pageToken?: string;
	rows?: TableRow[];
	totalBytesProcessed?: string;
	jobComplete: boolean;
	errors?: ErrorProto[];
	cacheHit?: boolean;
	numDmlAffectedRows?: string;
}

export interface TableRow {
	f: TableCell[];
}

export interface TableCell {
	v: unknown;
}

export interface JobReference {
	projectId: string;
	jobId: string;
	location: string;
}

export interface Job {
	kind: string;
	etag: string;
	id: string;
	selfLink: string;
	jobReference: JobReference;
	configuration: JobConfiguration;
	status: JobStatus;
	statistics?: JobStatistics;
	user_email?: string;
}

export interface JobConfiguration {
	query?: QueryJobConfiguration;
	load?: LoadJobConfiguration;
	extract?: ExtractJobConfiguration;
	copy?: CopyJobConfiguration;
	labels?: Record<string, string>;
	dryRun?: boolean;
	jobTimeoutMs?: string;
}

export interface QueryJobConfiguration {
	query: string;
	destinationTable?: TableReference;
	writeDisposition?: "WRITE_TRUNCATE" | "WRITE_APPEND" | "WRITE_EMPTY";
	createDisposition?: "CREATE_IF_NEEDED" | "CREATE_NEVER";
	useLegacySql?: boolean;
	priority?: "INTERACTIVE" | "BATCH";
}

export interface LoadJobConfiguration {
	sourceUris: string[];
	destinationTable: TableReference;
	schema?: TableSchema;
	sourceFormat?: string;
	writeDisposition?: "WRITE_TRUNCATE" | "WRITE_APPEND" | "WRITE_EMPTY";
}

export interface ExtractJobConfiguration {
	sourceTable: TableReference;
	destinationUris: string[];
	destinationFormat?: string;
	compression?: string;
}

export interface CopyJobConfiguration {
	sourceTables: TableReference[];
	destinationTable: TableReference;
	writeDisposition?: "WRITE_TRUNCATE" | "WRITE_APPEND" | "WRITE_EMPTY";
}

export interface JobStatus {
	state: "PENDING" | "RUNNING" | "DONE";
	errorResult?: ErrorProto;
	errors?: ErrorProto[];
}

export interface JobStatistics {
	creationTime: string;
	startTime?: string;
	endTime?: string;
	totalBytesProcessed?: string;
	query?: QueryStatistics;
}

export interface QueryStatistics {
	totalBytesBilled?: string;
	totalBytesProcessed?: string;
	cacheHit?: boolean;
	statementType?: string;
	numDmlAffectedRows?: string;
}

export interface ErrorProto {
	reason?: string;
	location?: string;
	debugInfo?: string;
	message?: string;
}

export interface InsertAllRequest {
	kind?: string;
	skipInvalidRows?: boolean;
	ignoreUnknownValues?: boolean;
	templateSuffix?: string;
	rows: { insertId?: string; json: Record<string, unknown> }[];
}

export interface InsertAllResponse {
	kind: string;
	insertErrors?: { index: number; errors: ErrorProto[] }[];
}

// Service implementation
class GoogleBigQueryService {
	private readonly projectId = process.env.GOOGLE_CLOUD_PROJECT;
	private readonly location = process.env.GOOGLE_BIGQUERY_LOCATION || "US";
	private accessToken: string | null = null;
	private tokenExpiry: number = 0;
	private readonly clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
	private readonly privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(
		/\\n/g,
		"\n",
	);

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!(this.projectId && this.clientEmail && this.privateKey);
	}

	/**
	 * Get access token for service account
	 */
	private async getAccessToken(): Promise<string | null> {
		if (this.accessToken && Date.now() < this.tokenExpiry) {
			return this.accessToken;
		}

		if (!this.clientEmail || !this.privateKey) {
			console.error("BigQuery credentials not configured");
			return null;
		}

		try {
			const now = Math.floor(Date.now() / 1000);
			const header = { alg: "RS256", typ: "JWT" };
			const payload = {
				iss: this.clientEmail,
				sub: this.clientEmail,
				aud: "https://oauth2.googleapis.com/token",
				iat: now,
				exp: now + 3600,
				scope: "https://www.googleapis.com/auth/bigquery",
			};

			const base64Header = Buffer.from(JSON.stringify(header)).toString(
				"base64url",
			);
			const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
				"base64url",
			);
			const signatureInput = `${base64Header}.${base64Payload}`;

			const crypto = await import("crypto");
			const sign = crypto.createSign("RSA-SHA256");
			sign.update(signatureInput);
			const signature = sign.sign(this.privateKey, "base64url");

			const jwt = `${signatureInput}.${signature}`;

			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
					assertion: jwt,
				}),
			});

			if (!response.ok) {
				console.error("BigQuery token error:", await response.text());
				return null;
			}

			const data = await response.json();
			this.accessToken = data.access_token;
			this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

			return this.accessToken;
		} catch (error) {
			console.error("BigQuery get access token error:", error);
			return null;
		}
	}

	private get baseUrl(): string {
		return `https://bigquery.googleapis.com/bigquery/v2/projects/${this.projectId}`;
	}

	// ============================================
	// Query Operations
	// ============================================

	/**
	 * Execute a query
	 */
	async query(
		sql: string,
		options?: Partial<QueryRequest>,
	): Promise<QueryResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const request: QueryRequest = {
				query: sql,
				useLegacySql: false,
				useQueryCache: true,
				...options,
			};

			const response = await fetch(`${this.baseUrl}/queries`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
			});

			if (!response.ok) {
				console.error("BigQuery query error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery query error:", error);
			return null;
		}
	}

	/**
	 * Get query results with pagination
	 */
	async getQueryResults(
		jobId: string,
		pageToken?: string,
		maxResults = 1000,
	): Promise<QueryResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const params = new URLSearchParams();
			params.set("maxResults", String(maxResults));
			if (pageToken) params.set("pageToken", pageToken);

			const response = await fetch(
				`${this.baseUrl}/queries/${jobId}?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("BigQuery get results error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery get results error:", error);
			return null;
		}
	}

	// ============================================
	// Dataset Operations
	// ============================================

	/**
	 * Create a dataset
	 */
	async createDataset(
		datasetId: string,
		options?: {
			description?: string;
			location?: string;
			labels?: Record<string, string>;
		},
	): Promise<Dataset | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const dataset = {
				datasetReference: {
					datasetId,
					projectId: this.projectId,
				},
				location: options?.location || this.location,
				description: options?.description,
				labels: options?.labels,
			};

			const response = await fetch(`${this.baseUrl}/datasets`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataset),
			});

			if (!response.ok) {
				console.error("BigQuery create dataset error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery create dataset error:", error);
			return null;
		}
	}

	/**
	 * Get a dataset
	 */
	async getDataset(datasetId: string): Promise<Dataset | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/datasets/${datasetId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("BigQuery get dataset error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery get dataset error:", error);
			return null;
		}
	}

	/**
	 * List datasets
	 */
	async listDatasets(): Promise<{
		datasets: { datasetReference: DatasetReference }[];
	} | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/datasets`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("BigQuery list datasets error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery list datasets error:", error);
			return null;
		}
	}

	/**
	 * Delete a dataset
	 */
	async deleteDataset(
		datasetId: string,
		deleteContents = false,
	): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(
				`${this.baseUrl}/datasets/${datasetId}?deleteContents=${deleteContents}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.ok;
		} catch (error) {
			console.error("BigQuery delete dataset error:", error);
			return false;
		}
	}

	// ============================================
	// Table Operations
	// ============================================

	/**
	 * Create a table
	 */
	async createTable(
		datasetId: string,
		tableId: string,
		schema: TableFieldSchema[],
		options?: {
			description?: string;
			timePartitioning?: TimePartitioning;
			clustering?: Clustering;
		},
	): Promise<Table | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const table = {
				tableReference: {
					projectId: this.projectId,
					datasetId,
					tableId,
				},
				schema: { fields: schema },
				description: options?.description,
				timePartitioning: options?.timePartitioning,
				clustering: options?.clustering,
			};

			const response = await fetch(
				`${this.baseUrl}/datasets/${datasetId}/tables`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(table),
				},
			);

			if (!response.ok) {
				console.error("BigQuery create table error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery create table error:", error);
			return null;
		}
	}

	/**
	 * Get a table
	 */
	async getTable(datasetId: string, tableId: string): Promise<Table | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/datasets/${datasetId}/tables/${tableId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("BigQuery get table error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery get table error:", error);
			return null;
		}
	}

	/**
	 * List tables in a dataset
	 */
	async listTables(
		datasetId: string,
	): Promise<{ tables: { tableReference: TableReference }[] } | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/datasets/${datasetId}/tables`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("BigQuery list tables error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery list tables error:", error);
			return null;
		}
	}

	/**
	 * Delete a table
	 */
	async deleteTable(datasetId: string, tableId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(
				`${this.baseUrl}/datasets/${datasetId}/tables/${tableId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.ok;
		} catch (error) {
			console.error("BigQuery delete table error:", error);
			return false;
		}
	}

	// ============================================
	// Streaming Insert
	// ============================================

	/**
	 * Stream data into a table
	 */
	async insertRows(
		datasetId: string,
		tableId: string,
		rows: Record<string, unknown>[],
		options?: { skipInvalidRows?: boolean; ignoreUnknownValues?: boolean },
	): Promise<InsertAllResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const request: InsertAllRequest = {
				rows: rows.map((row, index) => ({
					insertId: `${Date.now()}-${index}`,
					json: row,
				})),
				skipInvalidRows: options?.skipInvalidRows,
				ignoreUnknownValues: options?.ignoreUnknownValues,
			};

			const response = await fetch(
				`${this.baseUrl}/datasets/${datasetId}/tables/${tableId}/insertAll`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(request),
				},
			);

			if (!response.ok) {
				console.error("BigQuery insert rows error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("BigQuery insert rows error:", error);
			return null;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Setup field service analytics dataset
	 */
	async setupFieldServiceAnalytics(): Promise<{
		dataset: Dataset | null;
		tables: Record<string, Table | null>;
	}> {
		const dataset = await this.createDataset("field_service_analytics", {
			description: "Analytics data for field service operations",
		});

		const tables: Record<string, Table | null> = {};

		// Jobs analytics table
		tables.jobs = await this.createTable(
			"field_service_analytics",
			"jobs",
			[
				{ name: "job_id", type: "STRING", mode: "REQUIRED" },
				{ name: "company_id", type: "STRING", mode: "REQUIRED" },
				{ name: "customer_id", type: "STRING" },
				{ name: "technician_id", type: "STRING" },
				{ name: "service_type", type: "STRING" },
				{ name: "status", type: "STRING" },
				{ name: "scheduled_date", type: "TIMESTAMP" },
				{ name: "completed_date", type: "TIMESTAMP" },
				{ name: "duration_minutes", type: "INTEGER" },
				{ name: "revenue", type: "FLOAT" },
				{ name: "cost", type: "FLOAT" },
				{ name: "created_at", type: "TIMESTAMP", mode: "REQUIRED" },
			],
			{
				timePartitioning: { type: "DAY", field: "created_at" },
				clustering: { fields: ["company_id", "status"] },
			},
		);

		// Technician performance table
		tables.technicianPerformance = await this.createTable(
			"field_service_analytics",
			"technician_performance",
			[
				{ name: "technician_id", type: "STRING", mode: "REQUIRED" },
				{ name: "company_id", type: "STRING", mode: "REQUIRED" },
				{ name: "date", type: "DATE", mode: "REQUIRED" },
				{ name: "jobs_completed", type: "INTEGER" },
				{ name: "revenue_generated", type: "FLOAT" },
				{ name: "hours_worked", type: "FLOAT" },
				{ name: "average_rating", type: "FLOAT" },
				{ name: "first_time_fix_rate", type: "FLOAT" },
			],
			{
				timePartitioning: { type: "DAY", field: "date" },
				clustering: { fields: ["company_id", "technician_id"] },
			},
		);

		// Customer interactions table
		tables.customerInteractions = await this.createTable(
			"field_service_analytics",
			"customer_interactions",
			[
				{ name: "interaction_id", type: "STRING", mode: "REQUIRED" },
				{ name: "customer_id", type: "STRING", mode: "REQUIRED" },
				{ name: "company_id", type: "STRING", mode: "REQUIRED" },
				{ name: "interaction_type", type: "STRING" },
				{ name: "channel", type: "STRING" },
				{ name: "sentiment_score", type: "FLOAT" },
				{ name: "timestamp", type: "TIMESTAMP", mode: "REQUIRED" },
			],
			{
				timePartitioning: { type: "DAY", field: "timestamp" },
			},
		);

		return { dataset, tables };
	}

	/**
	 * Log job completion for analytics
	 */
	async logJobCompletion(job: {
		jobId: string;
		companyId: string;
		customerId?: string;
		technicianId?: string;
		serviceType?: string;
		status: string;
		scheduledDate?: Date;
		completedDate?: Date;
		durationMinutes?: number;
		revenue?: number;
		cost?: number;
	}): Promise<boolean> {
		const result = await this.insertRows("field_service_analytics", "jobs", [
			{
				job_id: job.jobId,
				company_id: job.companyId,
				customer_id: job.customerId,
				technician_id: job.technicianId,
				service_type: job.serviceType,
				status: job.status,
				scheduled_date: job.scheduledDate?.toISOString(),
				completed_date: job.completedDate?.toISOString(),
				duration_minutes: job.durationMinutes,
				revenue: job.revenue,
				cost: job.cost,
				created_at: new Date().toISOString(),
			},
		]);

		return result !== null && !result.insertErrors?.length;
	}

	/**
	 * Query revenue by service type
	 */
	async getRevenueByServiceType(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<
		{ serviceType: string; totalRevenue: number; jobCount: number }[] | null
	> {
		const sql = `
			SELECT
				service_type as serviceType,
				SUM(revenue) as totalRevenue,
				COUNT(*) as jobCount
			FROM \`${this.projectId}.field_service_analytics.jobs\`
			WHERE company_id = @companyId
				AND created_at BETWEEN @startDate AND @endDate
				AND status = 'completed'
			GROUP BY service_type
			ORDER BY totalRevenue DESC
		`;

		const result = await this.query(sql, {
			parameterMode: "NAMED",
			queryParameters: [
				{
					name: "companyId",
					parameterType: { type: "STRING" },
					parameterValue: { value: companyId },
				},
				{
					name: "startDate",
					parameterType: { type: "TIMESTAMP" },
					parameterValue: { value: startDate.toISOString() },
				},
				{
					name: "endDate",
					parameterType: { type: "TIMESTAMP" },
					parameterValue: { value: endDate.toISOString() },
				},
			],
		});

		if (!result?.rows) return null;

		return result.rows.map((row) => ({
			serviceType: row.f[0].v as string,
			totalRevenue: Number(row.f[1].v),
			jobCount: Number(row.f[2].v),
		}));
	}

	/**
	 * Query technician performance
	 */
	async getTechnicianPerformance(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<
		| {
				technicianId: string;
				jobsCompleted: number;
				avgDuration: number;
				totalRevenue: number;
		  }[]
		| null
	> {
		const sql = `
			SELECT
				technician_id as technicianId,
				COUNT(*) as jobsCompleted,
				AVG(duration_minutes) as avgDuration,
				SUM(revenue) as totalRevenue
			FROM \`${this.projectId}.field_service_analytics.jobs\`
			WHERE company_id = @companyId
				AND created_at BETWEEN @startDate AND @endDate
				AND status = 'completed'
				AND technician_id IS NOT NULL
			GROUP BY technician_id
			ORDER BY totalRevenue DESC
		`;

		const result = await this.query(sql, {
			parameterMode: "NAMED",
			queryParameters: [
				{
					name: "companyId",
					parameterType: { type: "STRING" },
					parameterValue: { value: companyId },
				},
				{
					name: "startDate",
					parameterType: { type: "TIMESTAMP" },
					parameterValue: { value: startDate.toISOString() },
				},
				{
					name: "endDate",
					parameterType: { type: "TIMESTAMP" },
					parameterValue: { value: endDate.toISOString() },
				},
			],
		});

		if (!result?.rows) return null;

		return result.rows.map((row) => ({
			technicianId: row.f[0].v as string,
			jobsCompleted: Number(row.f[1].v),
			avgDuration: Number(row.f[2].v),
			totalRevenue: Number(row.f[3].v),
		}));
	}

	/**
	 * Parse query results into objects
	 */
	parseQueryResults<T extends Record<string, unknown>>(
		response: QueryResponse,
	): T[] {
		if (!response.schema?.fields || !response.rows) {
			return [];
		}

		const fieldNames = response.schema.fields.map((f) => f.name);

		return response.rows.map((row) => {
			const obj: Record<string, unknown> = {};
			row.f.forEach((cell, index) => {
				obj[fieldNames[index]] = cell.v;
			});
			return obj as T;
		});
	}
}

// Export singleton instance
export const googleBigQueryService = new GoogleBigQueryService();
