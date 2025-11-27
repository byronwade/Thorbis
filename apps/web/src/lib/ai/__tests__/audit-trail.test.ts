/**
 * AI Audit Trail Tests
 *
 * Tests for tamper-evident logging with SHA-256 checksums.
 * Covers audit log creation, integrity verification, and reversal tracking.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Create chainable mock helper that properly supports method chaining
function createChainableMock(resolveValue: unknown = { data: null, error: null }) {
	const mock: Record<string, unknown> = {};

	// Make all methods return the same mock object for chaining
	const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'lt', 'gt', 'gte', 'lte', 'in', 'order', 'range', 'limit'];
	chainMethods.forEach(method => {
		mock[method] = vi.fn().mockReturnValue(mock);
	});

	// Terminal methods that return promises
	mock.single = vi.fn().mockResolvedValue(resolveValue);
	mock.maybeSingle = vi.fn().mockResolvedValue(resolveValue);

	// Make the mock itself thenable for when chain ends without terminal method
	mock.then = vi.fn((resolve) => Promise.resolve(resolveValue).then(resolve));

	return mock;
}

// Mock Supabase service client
const mockSupabaseClient = {
	from: vi.fn(() => createChainableMock()),
	rpc: vi.fn(),
};

vi.mock("@/lib/supabase/service-client", () => ({
	createServiceSupabaseClient: () => mockSupabaseClient,
}));

// Import after mocks
import {
	createAuditLog,
	verifyAuditLogIntegrity,
	getEntityAuditTrail,
	getChatAuditTrail,
	getHighSeverityAuditEntries,
	recordReversal,
	getAuditStatistics,
	type AuditContext,
	type AuditLogEntry,
	type AuditAction,
	type AuditSeverity,
} from "../audit-trail";

// =============================================================================
// TEST HELPERS
// =============================================================================

const mockCompanyId = "company-123";
const mockUserId = "user-456";
const mockChatId = "chat-abc";
const mockMessageId = "msg-def";
const mockAuditLogId = "audit-xyz";

function createMockContext(overrides?: Partial<AuditContext>): AuditContext {
	return {
		companyId: mockCompanyId,
		userId: mockUserId,
		chatId: mockChatId,
		messageId: mockMessageId,
		traceId: "trace-123",
		spanId: "span-456",
		...overrides,
	};
}

function createMockEntry(overrides?: Partial<AuditLogEntry>): AuditLogEntry {
	return {
		action: "update",
		entityType: "customer",
		entityId: "cust-123",
		beforeState: { name: "Old Name", email: "old@test.com" },
		afterState: { name: "New Name", email: "old@test.com" },
		...overrides,
	};
}

function calculateExpectedChecksum(data: Record<string, unknown>): string {
	const normalized = JSON.stringify(data, Object.keys(data).sort());
	return crypto.createHash("sha256").update(normalized).digest("hex");
}

function resetMocks() {
	vi.clearAllMocks();
}

// =============================================================================
// AUDIT LOG CREATION TESTS
// =============================================================================

describe("AI Audit Trail", () => {
	beforeEach(() => {
		resetMocks();
	});

	describe("Audit Log Creation", () => {
		it("should create audit log with checksum", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const context = createMockContext();
			const entry = createMockEntry();

			const auditId = await createAuditLog(context, entry);

			expect(auditId).toBeDefined();
			expect(mockQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					company_id: mockCompanyId,
					user_id: mockUserId,
					action: "update",
					entity_type: "customer",
					entity_id: "cust-123",
					checksum: expect.any(String),
				})
			);
		});

		it("should extract changed fields from before/after states", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const entry: AuditLogEntry = {
				action: "update",
				entityType: "customer",
				entityId: "cust-123",
				beforeState: { name: "Old", email: "a@test.com", phone: "123" },
				afterState: { name: "New", email: "a@test.com", phone: "456" },
			};

			await createAuditLog(createMockContext(), entry);

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.changed_fields).toContain("name");
			expect(insertCall.changed_fields).toContain("phone");
			expect(insertCall.changed_fields).not.toContain("email");
		});

		it("should use provided changed fields over extracted ones", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const entry: AuditLogEntry = {
				action: "update",
				entityType: "customer",
				entityId: "cust-123",
				beforeState: { name: "Old" },
				afterState: { name: "New" },
				changedFields: ["custom_field"],
			};

			await createAuditLog(createMockContext(), entry);

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.changed_fields).toEqual(["custom_field"]);
		});

		it("should set is_reversible based on action and before state", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			// Update with before state should be reversible
			await createAuditLog(createMockContext(), {
				action: "update",
				entityType: "customer",
				entityId: "cust-123",
				beforeState: { name: "Old" },
				afterState: { name: "New" },
			});

			let insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.is_reversible).toBe(true);

			// Query action should not be reversible
			mockQuery.insert.mockClear();
			mockQuery.insert.mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createAuditLog(createMockContext(), {
				action: "query",
				entityType: "customer",
				entityId: "cust-123",
			});

			insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.is_reversible).toBe(false);
		});

		it("should throw on database insert error", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({
					error: { message: "Insert failed" },
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await expect(
				createAuditLog(createMockContext(), createMockEntry())
			).rejects.toMatchObject({ message: "Insert failed" });
		});

		it("should include tool information when provided", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const entry: AuditLogEntry = {
				action: "tool_call",
				entityType: "customer",
				entityId: "cust-123",
				toolName: "updateCustomer",
				toolParams: { name: "New Name" },
				toolResult: { success: true },
			};

			await createAuditLog(createMockContext(), entry);

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.tool_name).toBe("updateCustomer");
			expect(insertCall.tool_params).toEqual({ name: "New Name" });
			expect(insertCall.tool_result).toEqual({ success: true });
		});
	});

	// =============================================================================
	// SEVERITY DETERMINATION TESTS
	// =============================================================================

	describe("Severity Determination", () => {
		it("should determine critical severity for delete actions", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createAuditLog(createMockContext(), {
				action: "delete",
				entityType: "customer",
				entityId: "cust-123",
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.severity).toBe("critical");
		});

		it("should determine critical severity for permission changes", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createAuditLog(createMockContext(), {
				action: "permission_change",
				entityType: "user",
				entityId: "user-123",
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.severity).toBe("critical");
		});

		it("should determine high severity for bulk operations", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createAuditLog(createMockContext(), {
				action: "bulk_operation",
				entityType: "customer",
				entityIds: ["cust-1", "cust-2", "cust-3"],
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.severity).toBe("high");
		});

		it("should determine high severity for payment-related entities", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createAuditLog(createMockContext(), {
				action: "create",
				entityType: "payment",
				entityId: "pay-123",
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.severity).toBe("high");
		});

		it("should use provided severity over calculated one", async () => {
			const mockQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createAuditLog(createMockContext(), {
				action: "query",
				entityType: "note",
				entityId: "note-123",
				severity: "critical", // Override low default
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.severity).toBe("critical");
		});
	});

	// =============================================================================
	// INTEGRITY VERIFICATION TESTS
	// =============================================================================

	describe("Integrity Verification", () => {
		it("should verify valid audit log integrity", async () => {
			const checksumData = {
				id: mockAuditLogId,
				company_id: mockCompanyId,
				user_id: mockUserId,
				chat_id: mockChatId,
				message_id: mockMessageId,
				trace_id: "trace-123",
				span_id: "span-456",
				action: "update",
				entity_type: "customer",
				entity_id: "cust-123",
				entity_ids: null,
				before_state: { name: "Old" },
				after_state: { name: "New" },
				changed_fields: ["name"],
				tool_name: null,
				tool_params: null,
				tool_result: null,
				timestamp: "2024-01-15T10:00:00.000Z",
			};

			const validChecksum = calculateExpectedChecksum(checksumData);

			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: {
						...checksumData,
						checksum: validChecksum,
						created_at: checksumData.timestamp,
					},
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await verifyAuditLogIntegrity(mockCompanyId, mockAuditLogId);

			expect(result.valid).toBe(true);
			expect(result.reason).toBeUndefined();
		});

		it("should detect tampered audit log", async () => {
			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: {
						id: mockAuditLogId,
						company_id: mockCompanyId,
						action: "update",
						entity_type: "customer",
						checksum: "invalid-checksum-that-wont-match",
						created_at: "2024-01-15T10:00:00.000Z",
					},
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await verifyAuditLogIntegrity(mockCompanyId, mockAuditLogId);

			expect(result.valid).toBe(false);
			expect(result.reason).toContain("tampered");
		});

		it("should handle non-existent audit log", async () => {
			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: null,
					error: { message: "Not found" },
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await verifyAuditLogIntegrity(mockCompanyId, "non-existent");

			expect(result.valid).toBe(false);
			expect(result.reason).toBe("Audit log not found");
		});
	});

	// =============================================================================
	// AUDIT TRAIL RETRIEVAL TESTS
	// =============================================================================

	describe("Entity Audit Trail", () => {
		it("should retrieve entity audit trail with pagination", async () => {
			const mockEntries = [
				{
					id: "audit-1",
					action: "update",
					changed_fields: ["name"],
					before_state: { name: "Old" },
					after_state: { name: "New" },
					user_id: mockUserId,
					tool_name: null,
					severity: "medium",
					reversed: false,
					created_at: "2024-01-15T10:00:00.000Z",
				},
			];

			// Mock count query
			const mockCountQuery: Record<string, unknown> = {};
			mockCountQuery.select = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.eq = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.then = vi.fn((resolve) => Promise.resolve({ count: 1, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockCountQuery);

			// Mock data query
			const mockDataQuery: Record<string, unknown> = {};
			mockDataQuery.select = vi.fn().mockReturnValue(mockDataQuery);
			mockDataQuery.eq = vi.fn().mockReturnValue(mockDataQuery);
			mockDataQuery.order = vi.fn().mockReturnValue(mockDataQuery);
			mockDataQuery.range = vi.fn().mockResolvedValueOnce({ data: mockEntries, error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockDataQuery);

			const result = await getEntityAuditTrail(
				mockCompanyId,
				"customer",
				"cust-123",
				{ limit: 10, offset: 0 }
			);

			expect(result.entries).toHaveLength(1);
			expect(result.total).toBe(1);
			expect(result.entries[0].action).toBe("update");
			expect(result.entries[0].changedFields).toEqual(["name"]);
		});

		it("should return empty result on error", async () => {
			const mockCountQuery: Record<string, unknown> = {};
			mockCountQuery.select = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.eq = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.then = vi.fn((resolve) => Promise.resolve({ count: 0, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockCountQuery);

			const mockDataQuery: Record<string, unknown> = {};
			mockDataQuery.select = vi.fn().mockReturnValue(mockDataQuery);
			mockDataQuery.eq = vi.fn().mockReturnValue(mockDataQuery);
			mockDataQuery.order = vi.fn().mockReturnValue(mockDataQuery);
			mockDataQuery.range = vi.fn().mockResolvedValueOnce({
				data: null,
				error: { message: "Query error" },
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockDataQuery);

			const result = await getEntityAuditTrail(mockCompanyId, "customer", "cust-123");

			expect(result.entries).toEqual([]);
			expect(result.total).toBe(0);
		});
	});

	describe("Chat Audit Trail", () => {
		it("should retrieve chat audit trail with severity filter", async () => {
			const mockEntries = [
				{
					id: "audit-1",
					action: "delete",
					entity_type: "customer",
					entity_id: "cust-123",
					tool_name: "deleteCustomer",
					severity: "critical",
					is_reversible: true,
					reversed: false,
					created_at: "2024-01-15T10:00:00.000Z",
				},
			];

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.in = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.range = vi.fn().mockResolvedValueOnce({
				data: mockEntries,
				count: 1,
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getChatAuditTrail(mockCompanyId, mockChatId, {
				severityFilter: ["critical", "high"],
			});

			expect(result.entries).toHaveLength(1);
			expect(result.entries[0].severity).toBe("critical");
			expect(mockQuery.in).toHaveBeenCalledWith("severity", ["critical", "high"]);
		});
	});

	describe("High Severity Entries", () => {
		it("should retrieve high severity entries within time range", async () => {
			const mockEntries = [
				{
					id: "audit-1",
					action: "delete",
					entity_type: "customer",
					entity_id: "cust-123",
					user_id: mockUserId,
					tool_name: "deleteCustomer",
					severity: "critical",
					reversed: false,
					created_at: "2024-01-15T10:00:00.000Z",
				},
			];

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.in = vi.fn().mockReturnValue(mockQuery);
			mockQuery.gte = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockReturnValue(mockQuery);
			// Make the mock thenable so await query works
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ data: mockEntries, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getHighSeverityAuditEntries(mockCompanyId, {
				since: new Date("2024-01-01"),
				limit: 50,
			});

			expect(result).toHaveLength(1);
			expect(result[0].severity).toBe("critical");
			expect(mockQuery.in).toHaveBeenCalledWith("severity", ["high", "critical"]);
		});

		it("should exclude reversed entries by default", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.in = vi.fn().mockReturnValue(mockQuery);
			mockQuery.gte = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockReturnValue(mockQuery);
			// Make the mock thenable so await query works
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ data: [], error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await getHighSeverityAuditEntries(mockCompanyId);

			expect(mockQuery.eq).toHaveBeenCalledWith("reversed", false);
		});

		it("should include reversed entries when requested", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.in = vi.fn().mockReturnValue(mockQuery);
			mockQuery.gte = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockResolvedValueOnce({ data: [], error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await getHighSeverityAuditEntries(mockCompanyId, {
				includeReversed: true,
			});

			// eq should only be called for company_id, not for reversed
			const eqCalls = (mockQuery.eq as ReturnType<typeof vi.fn>).mock.calls;
			expect(eqCalls.some((call: [string, unknown]) => call[0] === "reversed")).toBe(false);
		});
	});

	// =============================================================================
	// REVERSAL TESTS
	// =============================================================================

	describe("Reversal Recording", () => {
		it("should record reversal for reversible action", async () => {
			// Mock fetch original audit log
			const mockFetchQuery: Record<string, unknown> = {};
			mockFetchQuery.select = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.eq = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					id: mockAuditLogId,
					action: "update",
					entity_type: "customer",
					entity_id: "cust-123",
					before_state: { name: "Original" },
					is_reversible: true,
					reversed: false,
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockFetchQuery);

			// Mock insert reversal
			const mockInsertQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			// Mock update audit log
			const mockUpdateQuery: Record<string, unknown> = {};
			mockUpdateQuery.update = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.eq = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.then = vi.fn((resolve) => Promise.resolve({ error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockUpdateQuery);

			const reversalId = await recordReversal(mockCompanyId, {
				auditLogId: mockAuditLogId,
				reason: "User requested undo",
				reversedBy: mockUserId,
				reversalMethod: "automatic",
			});

			expect(reversalId).toBeDefined();
			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					audit_log_id: mockAuditLogId,
					reversed_by: mockUserId,
					reversal_reason: "User requested undo",
					reversal_method: "automatic",
					restored_state: { name: "Original" },
				})
			);
		});

		it("should throw error for non-reversible action", async () => {
			const mockFetchQuery: Record<string, unknown> = {};
			mockFetchQuery.select = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.eq = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					id: mockAuditLogId,
					is_reversible: false,
					reversed: false,
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockFetchQuery);

			await expect(
				recordReversal(mockCompanyId, {
					auditLogId: mockAuditLogId,
					reason: "Test",
					reversedBy: mockUserId,
					reversalMethod: "manual",
				})
			).rejects.toThrow("This action is not reversible");
		});

		it("should throw error for already reversed action", async () => {
			const mockFetchQuery: Record<string, unknown> = {};
			mockFetchQuery.select = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.eq = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					id: mockAuditLogId,
					is_reversible: true,
					reversed: true,
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockFetchQuery);

			await expect(
				recordReversal(mockCompanyId, {
					auditLogId: mockAuditLogId,
					reason: "Test",
					reversedBy: mockUserId,
					reversalMethod: "manual",
				})
			).rejects.toThrow("already been reversed");
		});

		it("should throw error for non-existent audit log", async () => {
			const mockFetchQuery: Record<string, unknown> = {};
			mockFetchQuery.select = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.eq = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.single = vi.fn().mockResolvedValueOnce({
				data: null,
				error: { message: "Not found" },
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockFetchQuery);

			await expect(
				recordReversal(mockCompanyId, {
					auditLogId: "non-existent",
					reason: "Test",
					reversedBy: mockUserId,
					reversalMethod: "manual",
				})
			).rejects.toThrow("Audit log entry not found");
		});

		it("should support partial reversal with specific fields", async () => {
			const mockFetchQuery: Record<string, unknown> = {};
			mockFetchQuery.select = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.eq = vi.fn().mockReturnValue(mockFetchQuery);
			mockFetchQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					id: mockAuditLogId,
					before_state: { name: "Old", email: "old@test.com" },
					is_reversible: true,
					reversed: false,
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockFetchQuery);

			const mockInsertQuery = {
				insert: vi.fn().mockResolvedValueOnce({ error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			const mockUpdateQuery: Record<string, unknown> = {};
			mockUpdateQuery.update = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.eq = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.then = vi.fn((resolve) => Promise.resolve({ error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockUpdateQuery);

			await recordReversal(mockCompanyId, {
				auditLogId: mockAuditLogId,
				reason: "Partial undo",
				reversedBy: mockUserId,
				reversalMethod: "partial",
				partialFields: ["name"],
			});

			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					reversal_method: "partial",
					partial_fields: ["name"],
				})
			);
		});
	});

	// =============================================================================
	// STATISTICS TESTS
	// =============================================================================

	describe("Audit Statistics", () => {
		it("should calculate comprehensive audit statistics", async () => {
			const mockData = [
				{ action: "update", severity: "medium", entity_type: "customer", tool_name: "updateCustomer", reversed: false },
				{ action: "delete", severity: "critical", entity_type: "customer", tool_name: "deleteCustomer", reversed: false },
				{ action: "create", severity: "medium", entity_type: "job", tool_name: null, reversed: false },
				{ action: "update", severity: "medium", entity_type: "customer", tool_name: "updateCustomer", reversed: true },
				{ action: "query", severity: "low", entity_type: "customer", tool_name: "getCustomer", reversed: false },
			];

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.gte = vi.fn().mockReturnValue(mockQuery);
			mockQuery.lte = vi.fn().mockResolvedValueOnce({ data: mockData, error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getAuditStatistics(mockCompanyId, {
				start: new Date("2024-01-01"),
				end: new Date("2024-01-31"),
			});

			expect(result.totalActions).toBe(5);
			expect(result.byAction.update).toBe(2);
			expect(result.byAction.delete).toBe(1);
			expect(result.byAction.create).toBe(1);
			expect(result.bySeverity.critical).toBe(1);
			expect(result.bySeverity.medium).toBe(3);
			expect(result.byEntityType.customer).toBe(4);
			expect(result.reversalRate).toBe(20); // 1 out of 5
			expect(result.criticalActionsCount).toBe(1);
			expect(result.topTools).toContainEqual({ tool: "updateCustomer", count: 2 });
		});

		it("should return empty statistics on error", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.gte = vi.fn().mockReturnValue(mockQuery);
			mockQuery.lte = vi.fn().mockResolvedValueOnce({
				data: null,
				error: { message: "Query error" },
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getAuditStatistics(mockCompanyId, {
				start: new Date("2024-01-01"),
				end: new Date("2024-01-31"),
			});

			expect(result.totalActions).toBe(0);
			expect(result.byAction).toEqual({});
			expect(result.reversalRate).toBe(0);
		});

		it("should limit top tools to 10", async () => {
			// Create data with many tools
			const mockData = Array.from({ length: 15 }, (_, i) => ({
				action: "tool_call",
				severity: "low",
				entity_type: "customer",
				tool_name: `tool${i}`,
				reversed: false,
			}));

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.gte = vi.fn().mockReturnValue(mockQuery);
			mockQuery.lte = vi.fn().mockResolvedValueOnce({ data: mockData, error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getAuditStatistics(mockCompanyId, {
				start: new Date("2024-01-01"),
				end: new Date("2024-01-31"),
			});

			expect(result.topTools.length).toBeLessThanOrEqual(10);
		});
	});
});
