/**
 * Comprehensive type definitions for the world-class data import system
 * Supports: ServiceTitan, Housecall Pro, Jobber, CSV/Excel, and generic formats
 */

// ============================================================================
// Platform & Entity Types
// ============================================================================

export type SupportedPlatform =
	| "servicetitan"
	| "housecall"
	| "jobber"
	| "csv"
	| "generic"
	| "manual";

export type EntityType =
	| "customers"
	| "jobs"
	| "invoices"
	| "estimates"
	| "equipment"
	| "properties"
	| "team"
	| "communications"
	| "payments"
	| "contracts"
	| "appointments"
	| "vendors"
	| "purchase_orders"
	| "service_agreements"
	| "maintenance_plans";

export type ImportStatus =
	| "pending"
	| "in_progress"
	| "completed"
	| "failed"
	| "cancelled"
	| "validating";

export type DuplicateHandlingStrategy =
	| "skip"
	| "overwrite"
	| "merge"
	| "create_new"
	| "review";

// ============================================================================
// API Connector Types
// ============================================================================

export interface APICredentials {
	platform: SupportedPlatform;

	// ServiceTitan OAuth
	clientId?: string;
	clientSecret?: string;
	accessToken?: string;
	refreshToken?: string;
	tokenExpiry?: string;
	tenantId?: string;

	// Generic API
	apiKey?: string;
	apiUrl?: string;

	// Additional metadata
	customFields?: Record<string, unknown>;
}

export interface DataConnectorConfig {
	platform: SupportedPlatform;
	credentials: APICredentials;
	companyId: string;
	userId: string;
}

export interface FetchOptions {
	entityType: EntityType;
	limit?: number;
	offset?: number;
	continueFrom?: string; // For pagination (ServiceTitan)
	filters?: Record<string, unknown>;
	includeDeleted?: boolean;
}

export interface SchemaField {
	name: string;
	type:
		| "string"
		| "number"
		| "boolean"
		| "date"
		| "datetime"
		| "json"
		| "array";
	required: boolean;
	description?: string;
	sampleValues?: unknown[];
}

export interface SchemaDefinition {
	entity: EntityType;
	fields: SchemaField[];
	primaryKey: string;
	relationships?: {
		field: string;
		referencesEntity: EntityType;
		referencesField: string;
	}[];
}

// ============================================================================
// Field Mapping Types
// ============================================================================

export type TransformationType =
	| "direct"
	| "split"
	| "join"
	| "convert"
	| "lookup"
	| "custom";

export interface FieldMapping {
	sourceField: string;
	targetField: string;
	transformation: TransformationType;
	transformationParams?: Record<string, unknown>;
	confidence: number; // 0.0-1.0
	required: boolean;
	defaultValue?: unknown;
	validationRules?: ValidationRule[];
}

export interface ValidationRule {
	type: "regex" | "min" | "max" | "enum" | "custom";
	value: unknown;
	message: string;
}

export interface MappingTemplate {
	id: string;
	companyId?: string; // null = global template
	sourcePlatform: SupportedPlatform;
	entityType: EntityType;
	templateName: string;
	mappingRules: FieldMapping[];
	transformationRules: Record<string, unknown>;
	aiConfidence?: number;
	userApproved: boolean;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

// ============================================================================
// AI Engine Types
// ============================================================================

export interface FormatDetectionResult {
	platform: SupportedPlatform;
	confidence: number; // 0.0-1.0
	entityType: EntityType;
	reasoning: string;
	suggestedMappings: FieldMapping[];
	qualityIssues: DataQualityIssue[];
}

export interface DataQualityIssue {
	type:
		| "missing_required"
		| "invalid_format"
		| "duplicate"
		| "outlier"
		| "inconsistent";
	field: string;
	count: number;
	severity: "low" | "medium" | "high" | "critical";
	suggestion: string;
	sampleRecords?: number[]; // Record indices with this issue
}

export interface DataQualityScore {
	overallScore: number; // 0-100
	completeness: number; // 0-100
	accuracy: number; // 0-100
	consistency: number; // 0-100
	issues: DataQualityIssue[];
	duplicateGroups: DuplicateGroup[];
}

export interface DuplicateGroup {
	key: string; // Unique identifier for this duplicate group
	recordIndices: number[];
	similarity: number; // 0.0-1.0
	matchingFields: string[];
	recommendation: "keep_first" | "keep_last" | "merge" | "review";
}

// ============================================================================
// Import Process Types
// ============================================================================

export interface ImportJob {
	id: string;
	companyId: string;
	userId: string;

	// Source configuration
	sourcePlatform: SupportedPlatform;
	entityType: EntityType;
	connectorId?: string;
	mappingId?: string;

	// File details (for CSV/Excel imports)
	fileName?: string;
	fileSize?: number;
	filePath?: string;

	// Progress tracking
	status: ImportStatus;
	totalRows: number;
	successfulRows: number;
	failedRows: number;
	duplicateCount: number;

	// Configuration
	isDryRun: boolean;
	duplicateHandlingStrategy: DuplicateHandlingStrategy;

	// AI insights
	qualityScore?: number;
	aiInsights?: Record<string, unknown>;

	// Performance metrics
	estimatedDurationSeconds?: number;
	actualDurationSeconds?: number;

	// Rollback
	rollbackAvailableUntil?: string;

	// Validation
	validationResults?: ValidationResult[];
	relationshipErrors?: RelationshipError[];

	// Timestamps
	createdAt: string;
	updatedAt: string;
	startedAt?: string;
	completedAt?: string;
}

export interface ValidationResult {
	field: string;
	rule: string;
	passed: boolean;
	message?: string;
	recordIndices?: number[];
}

export interface RelationshipError {
	sourceEntity: EntityType;
	targetEntity: EntityType;
	field: string;
	missingReferences: string[];
	strategy: "skip" | "create_placeholder" | "manual_review";
}

export interface ImportProgress {
	importId: string;
	status: ImportStatus;
	totalRecords: number;
	processedRecords: number;
	successCount: number;
	failureCount: number;
	currentBatch: number;
	totalBatches: number;
	percentComplete: number;
	estimatedTimeRemaining?: number; // seconds
	errors: ImportError[];
}

export interface ImportError {
	recordIndex: number;
	recordData?: Record<string, unknown>;
	field?: string;
	error: string;
	code: string;
	severity: "warning" | "error";
	canRetry: boolean;
}

// ============================================================================
// Batch Processing Types
// ============================================================================

export interface BatchConfig {
	initialSize: number;
	maxSize: number;
	minSize: number;
	successThreshold: number; // 0.0-1.0
	failureThreshold: number; // 0.0-1.0
}

export interface BatchResult {
	batchNumber: number;
	recordsProcessed: number;
	successCount: number;
	failureCount: number;
	duration: number; // milliseconds
	errors: ImportError[];
	successRate: number; // 0.0-1.0
}

// ============================================================================
// Relationship Mapping Types
// ============================================================================

export interface RelationshipMap {
	customers: Map<string, string>; // External ID → Stratos UUID
	properties: Map<string, string>;
	jobs: Map<string, string>;
	invoices: Map<string, string>;
	equipment: Map<string, string>;
	team: Map<string, string>;
}

export interface RelationshipGraphNode {
	entity: EntityType;
	externalId: string;
	stratosId?: string;
	dependencies: {
		entity: EntityType;
		externalId: string;
		field: string;
	}[];
}

// ============================================================================
// Audit Log Types
// ============================================================================

export type AuditAction =
	| "upload"
	| "detect_format"
	| "map_fields"
	| "validate"
	| "transform"
	| "insert"
	| "rollback"
	| "cancel"
	| "complete"
	| "error";

export type AuditStatus = "started" | "in_progress" | "completed" | "failed";

export interface AuditLogEntry {
	id: string;
	importId: string;
	companyId: string;
	userId: string;
	action: AuditAction;
	actionStatus: AuditStatus;
	ipAddress?: string;
	userAgent?: string;
	details: Record<string, unknown>;
	recordsAffected: number;
	fieldsModified?: string[];
	errors?: ImportError[];
	durationMs?: number;
	memoryUsedMb?: number;
	createdAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ImportAPIResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta?: {
		timestamp: string;
		requestId: string;
	};
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasMore: boolean;
		continueFrom?: string;
	};
}

// ============================================================================
// Encryption Types
// ============================================================================

export interface EncryptedCredentials {
	encrypted: string; // Base64-encoded encrypted data
	iv: string; // Initialization vector
	tag: string; // Authentication tag
	algorithm: "aes-256-gcm";
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncResult<T, E = Error> = Promise<
	{ success: true; data: T } | { success: false; error: E }
>;
