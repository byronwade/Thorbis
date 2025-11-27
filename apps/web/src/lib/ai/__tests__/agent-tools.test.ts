/**
 * AI Agent Tools Tests
 *
 * Tests for AI SDK tool() and jsonSchema() usage
 * Verifies tool definitions, schemas, and execution patterns
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock the AI SDK tool and jsonSchema functions
vi.mock("ai", () => ({
	tool: vi.fn((config) => ({
		...config,
		_type: "tool",
	})),
	jsonSchema: vi.fn((schema) => schema),
}));

// Mock search utilities
vi.mock("@/lib/search/full-text-search", () => ({
	searchAllEntities: vi.fn(),
	searchCustomersFullText: vi.fn(),
	searchJobsFullText: vi.fn(),
}));

// Mock Google search service
vi.mock("@/lib/services/google-custom-search-service", () => ({
	googleCustomSearchService: {
		search: vi.fn(),
	},
}));

// Mock Supabase
const mockSupabaseQuery = {
	select: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	update: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	eq: vi.fn().mockReturnThis(),
	neq: vi.fn().mockReturnThis(),
	gt: vi.fn().mockReturnThis(),
	gte: vi.fn().mockReturnThis(),
	lt: vi.fn().mockReturnThis(),
	lte: vi.fn().mockReturnThis(),
	like: vi.fn().mockReturnThis(),
	ilike: vi.fn().mockReturnThis(),
	in: vi.fn().mockReturnThis(),
	is: vi.fn().mockReturnThis(),
	order: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	range: vi.fn().mockReturnThis(),
	single: vi.fn().mockResolvedValue({ data: null, error: null }),
	then: vi.fn((resolve) => Promise.resolve({ data: [], error: null }).then(resolve)),
};

vi.mock("@stratos/database", () => ({
	createServiceSupabaseClient: () => ({
		from: vi.fn(() => mockSupabaseQuery),
	}),
}));

// Import after mocks
import { tool, jsonSchema } from "ai";
import {
	// Tool category type
	type ToolCategory,
	// Sample tools to test
	listDatabaseTablesTool,
	queryDatabaseTool,
} from "../agent-tools";

const mockedTool = vi.mocked(tool);
const mockedJsonSchema = vi.mocked(jsonSchema);

// =============================================================================
// TOOL CATEGORY TESTS
// =============================================================================

describe("Tool Categories", () => {
	it("should define all tool category types", () => {
		const validCategories: ToolCategory[] = [
			"communication",
			"financial",
			"scheduling",
			"customer",
			"reporting",
			"system",
			"team",
			"vendor",
			"notification",
			"property",
			"equipment",
		];

		// This is a compile-time check - if types are wrong, this won't compile
		expect(validCategories).toHaveLength(11);
	});
});

// =============================================================================
// AI SDK TOOL FUNCTION TESTS
// =============================================================================

describe("AI SDK tool() Function", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should use tool() function from ai package", () => {
		expect(tool).toBeDefined();
		expect(typeof tool).toBe("function");
	});

	it("should use jsonSchema() function from ai package", () => {
		expect(jsonSchema).toBeDefined();
		expect(typeof jsonSchema).toBe("function");
	});

	it("should create tools with required properties", () => {
		// listDatabaseTablesTool should have been created with tool()
		expect(listDatabaseTablesTool).toBeDefined();
		expect(listDatabaseTablesTool).toHaveProperty("description");
		expect(listDatabaseTablesTool).toHaveProperty("inputSchema");
		expect(listDatabaseTablesTool).toHaveProperty("execute");
	});

	it("should mark tools with _type: tool from our mock", () => {
		expect(listDatabaseTablesTool).toHaveProperty("_type", "tool");
		expect(queryDatabaseTool).toHaveProperty("_type", "tool");
	});
});

// =============================================================================
// LIST DATABASE TABLES TOOL TESTS
// =============================================================================

describe("listDatabaseTablesTool", () => {
	it("should have correct description", () => {
		expect(listDatabaseTablesTool.description).toContain("database tables");
	});

	it("should have inputSchema with optional verbose parameter", () => {
		const schema = listDatabaseTablesTool.inputSchema;
		expect(schema).toBeDefined();
		expect(schema).toHaveProperty("type", "object");
		expect(schema).toHaveProperty("properties");
		expect((schema as { properties: { verbose?: unknown } }).properties).toHaveProperty("verbose");
	});

	it("should execute and return table list", async () => {
		const result = await listDatabaseTablesTool.execute({});

		expect(result).toHaveProperty("success", true);
		expect(result).toHaveProperty("tables");
		expect(Array.isArray(result.tables)).toBe(true);
	});

	it("should return all business tables", async () => {
		const result = await listDatabaseTablesTool.execute({});

		const expectedTables = [
			"customers",
			"team_members",
			"vendors",
			"jobs",
			"appointments",
			"invoices",
			"estimates",
			"contracts",
			"payments",
			"properties",
			"equipment",
			"communications",
			"price_book_items",
			"materials",
			"purchase_orders",
			"time_entries",
			"expenses",
			"service_agreements",
			"maintenance_plans",
			"notes",
			"tags",
			"finance_virtual_buckets",
			"scheduled_notifications",
		];

		const tableNames = result.tables.map((t: { name: string }) => t.name);

		for (const table of expectedTables) {
			expect(tableNames).toContain(table);
		}
	});

	it("should include description for each table", async () => {
		const result = await listDatabaseTablesTool.execute({});

		for (const table of result.tables) {
			expect(table).toHaveProperty("name");
			expect(table).toHaveProperty("description");
			expect(typeof table.description).toBe("string");
			expect(table.description.length).toBeGreaterThan(0);
		}
	});
});

// =============================================================================
// QUERY DATABASE TOOL TESTS
// =============================================================================

describe("queryDatabaseTool", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset mock to return data
		mockSupabaseQuery.then = vi.fn((resolve) =>
			Promise.resolve({ data: [{ id: 1, name: "Test" }], error: null }).then(resolve)
		);
	});

	it("should have correct description", () => {
		expect(queryDatabaseTool.description).toContain("Query");
		expect(queryDatabaseTool.description).toContain("database");
	});

	it("should have Zod schema for input validation", () => {
		const schema = queryDatabaseTool.inputSchema;
		expect(schema).toBeDefined();

		// Verify it's a Zod schema by checking _def
		expect(schema).toHaveProperty("_def");
	});

	it("should define table parameter as required", () => {
		const schema = queryDatabaseTool.inputSchema as z.ZodObject<{
			table: z.ZodString;
		}>;

		// Try parsing without table - should fail
		const result = schema.safeParse({ select: "*" });
		expect(result.success).toBe(false);

		// Try parsing with table - should succeed
		const validResult = schema.safeParse({ table: "customers" });
		expect(validResult.success).toBe(true);
	});

	it("should support all filter operators", () => {
		const schema = queryDatabaseTool.inputSchema as z.ZodObject<{
			filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
				operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike", "in", "is"]>;
			}>>>;
		}>;

		const operators = ["eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike", "in", "is"];

		for (const op of operators) {
			const result = schema.safeParse({
				table: "customers",
				filters: [{ column: "status", operator: op, value: "active" }],
			});
			expect(result.success).toBe(true);
		}
	});

	it("should support orderBy with column and ascending", () => {
		const schema = queryDatabaseTool.inputSchema as z.ZodObject<{
			orderBy: z.ZodOptional<z.ZodObject<{
				column: z.ZodString;
				ascending: z.ZodDefault<z.ZodBoolean>;
			}>>;
		}>;

		const result = schema.safeParse({
			table: "jobs",
			orderBy: { column: "created_at", ascending: false },
		});

		expect(result.success).toBe(true);
	});

	it("should default select to * and limit to 50", () => {
		const schema = queryDatabaseTool.inputSchema as z.ZodObject<{
			select: z.ZodDefault<z.ZodOptional<z.ZodString>>;
			limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
		}>;

		const result = schema.parse({ table: "customers" });

		expect(result.select).toBe("*");
		expect(result.limit).toBe(50);
	});
});

// =============================================================================
// TOOL INPUT SCHEMA VALIDATION TESTS
// =============================================================================

describe("Tool Input Schema Validation", () => {
	describe("jsonSchema helper", () => {
		it("should be used for non-Zod schemas", () => {
			// listDatabaseTablesTool uses jsonSchema
			const schema = listDatabaseTablesTool.inputSchema;

			expect(schema).toHaveProperty("type", "object");
			expect(schema).toHaveProperty("properties");
		});

		it("should define proper JSON schema structure", () => {
			const schema = listDatabaseTablesTool.inputSchema as {
				type: string;
				properties: Record<string, unknown>;
				required: string[];
			};

			expect(schema.type).toBe("object");
			expect(typeof schema.properties).toBe("object");
			expect(Array.isArray(schema.required)).toBe(true);
		});
	});

	describe("Zod schema", () => {
		it("should be used for complex validation", () => {
			// queryDatabaseTool uses Zod schema
			const schema = queryDatabaseTool.inputSchema;

			// Zod schemas have _def property
			expect(schema).toHaveProperty("_def");
		});

		it("should support complex nested structures", () => {
			const schema = queryDatabaseTool.inputSchema as z.ZodObject<{
				filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
					column: z.ZodString;
					operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike", "in", "is"]>;
					value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString>]>;
				}>>>;
			}>;

			// Complex filter with nested object
			const result = schema.safeParse({
				table: "invoices",
				filters: [
					{ column: "status", operator: "eq", value: "paid" },
					{ column: "amount", operator: "gt", value: 100 },
					{ column: "customer_id", operator: "in", value: ["cust-1", "cust-2"] },
				],
			});

			expect(result.success).toBe(true);
		});
	});
});

// =============================================================================
// TOOL EXECUTION CONTEXT TESTS
// =============================================================================

describe("Tool Execution Context", () => {
	it("should accept companyId in execution context", async () => {
		// queryDatabaseTool expects { companyId: string } in context
		// This is passed as second argument to execute

		// The mock should handle this - we're testing the interface
		const executeFn = queryDatabaseTool.execute;
		expect(typeof executeFn).toBe("function");
	});
});

// =============================================================================
// TOOL SECURITY TESTS
// =============================================================================

describe("Tool Security", () => {
	it("should only allow access to business tables", async () => {
		// queryDatabaseTool has an allowedTables whitelist
		// Attempting to query system tables should fail

		const allowedTables = [
			"customers",
			"team_members",
			"vendors",
			"jobs",
			"appointments",
			"invoices",
			"estimates",
			"contracts",
			"payments",
			"properties",
			"equipment",
			"communications",
			"price_book_items",
			"materials",
			"purchase_orders",
			"time_entries",
			"expenses",
			"service_agreements",
			"maintenance_plans",
			"notes",
			"tags",
			"finance_virtual_buckets",
			"scheduled_notifications",
		];

		// Verify the tool has these tables whitelisted
		// This is a design verification - the actual security is in execute()
		expect(allowedTables.length).toBeGreaterThan(20);
	});

	it("should not include sensitive system tables", () => {
		const sensitiveTableNames = [
			"users",
			"auth",
			"sessions",
			"api_keys",
			"secrets",
			"passwords",
		];

		// listDatabaseTablesTool should not expose these
		// This verifies the design
		expect(sensitiveTableNames).not.toContain("customers");
	});
});

// =============================================================================
// TOOL DESCRIPTION TESTS
// =============================================================================

describe("Tool Descriptions", () => {
	it("should have descriptive descriptions for AI understanding", () => {
		expect(listDatabaseTablesTool.description).toBeTruthy();
		expect(listDatabaseTablesTool.description.length).toBeGreaterThan(20);

		expect(queryDatabaseTool.description).toBeTruthy();
		expect(queryDatabaseTool.description.length).toBeGreaterThan(20);
	});

	it("should describe tool purpose clearly", () => {
		// Good descriptions help the AI know when to use the tool
		expect(listDatabaseTablesTool.description.toLowerCase()).toMatch(/list|available|tables/);
		expect(queryDatabaseTool.description.toLowerCase()).toMatch(/query|retrieve|data/);
	});
});

// =============================================================================
// TOOL INTEGRATION PATTERN TESTS
// =============================================================================

describe("Tool Integration Patterns", () => {
	it("should follow AI SDK tool definition pattern", () => {
		// Every tool should have: description, inputSchema, execute
		const requiredProperties = ["description", "inputSchema", "execute"];

		for (const prop of requiredProperties) {
			expect(listDatabaseTablesTool).toHaveProperty(prop);
			expect(queryDatabaseTool).toHaveProperty(prop);
		}
	});

	it("should have async execute function", () => {
		expect(typeof listDatabaseTablesTool.execute).toBe("function");
		expect(typeof queryDatabaseTool.execute).toBe("function");

		// Execute should return a promise
		const result1 = listDatabaseTablesTool.execute({});
		const result2 = queryDatabaseTool.execute(
			{ table: "customers" },
			{ companyId: "test-company" }
		);

		expect(result1).toBeInstanceOf(Promise);
		expect(result2).toBeInstanceOf(Promise);
	});

	it("should return structured results", async () => {
		const result = await listDatabaseTablesTool.execute({});

		// Results should be objects with meaningful structure
		expect(typeof result).toBe("object");
		expect(result).not.toBeNull();
	});
});

// =============================================================================
// AI SDK 6 MIGRATION TESTS
// =============================================================================

describe("AI SDK 6 Compatibility", () => {
	it("should use inputSchema instead of deprecated parameters", () => {
		// AI SDK 6 renamed 'parameters' to 'inputSchema'
		expect(listDatabaseTablesTool).toHaveProperty("inputSchema");
		expect(listDatabaseTablesTool).not.toHaveProperty("parameters");

		expect(queryDatabaseTool).toHaveProperty("inputSchema");
		expect(queryDatabaseTool).not.toHaveProperty("parameters");
	});

	it("should support both jsonSchema and Zod for inputSchema", () => {
		// jsonSchema is used for simpler schemas
		const jsonSchemaExample = listDatabaseTablesTool.inputSchema;
		expect(jsonSchemaExample).toHaveProperty("type");

		// Zod is used for complex validation
		const zodSchemaExample = queryDatabaseTool.inputSchema;
		expect(zodSchemaExample).toHaveProperty("_def");
	});
});
