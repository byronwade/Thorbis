/**
 * AI Action Approval Tests
 *
 * Tests for owner-only approval workflow for destructive AI actions.
 * Covers permission validation, action lifecycle, and interception logic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Create chainable mock helper that properly supports method chaining
function createChainableMock(resolveValue: unknown = { data: null, error: null }) {
	const mock: Record<string, unknown> = {};

	// Make all methods return the same mock object for chaining
	const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'lt', 'gt', 'gte', 'lte', 'in', 'order', 'limit', 'range'];
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
	rpc: vi.fn(),
	from: vi.fn(() => createChainableMock()),
};

vi.mock("@/lib/supabase/service-client", () => ({
	createServiceSupabaseClient: () => mockSupabaseClient,
}));

// Mock agent-tools destructive tool detection
const mockDestructiveTools: Record<string, {
	isDestructive: true;
	actionType: string;
	riskLevel: string;
	requiresOwnerApproval: boolean;
	description: string;
	affectedEntityType: string;
}> = {
	deleteCustomer: {
		isDestructive: true,
		actionType: "delete",
		riskLevel: "critical",
		requiresOwnerApproval: true,
		description: "Permanently delete a customer record",
		affectedEntityType: "customer",
	},
	sendBulkEmail: {
		isDestructive: true,
		actionType: "send_communication",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Send bulk email to customers",
		affectedEntityType: "customer",
	},
	archiveJob: {
		isDestructive: true,
		actionType: "archive",
		riskLevel: "medium",
		requiresOwnerApproval: true,
		description: "Archive a job record",
		affectedEntityType: "job",
	},
	processRefund: {
		isDestructive: true,
		actionType: "financial",
		riskLevel: "high",
		requiresOwnerApproval: true,
		description: "Process a customer refund",
		affectedEntityType: "payment",
	},
	updateCustomer: {
		isDestructive: true,
		actionType: "bulk_update",
		riskLevel: "medium",
		requiresOwnerApproval: true,
		description: "Modifies customer record information",
		affectedEntityType: "customer",
	},
	safeToolNoApproval: {
		isDestructive: true,
		actionType: "archive",
		riskLevel: "low",
		requiresOwnerApproval: false,
		description: "Low risk action not requiring approval",
		affectedEntityType: "note",
	},
};

vi.mock("../agent-tools", () => ({
	isDestructiveTool: (toolName: string) => toolName in mockDestructiveTools,
	getDestructiveToolMetadata: (toolName: string) => mockDestructiveTools[toolName] || null,
	getDestructiveToolNames: () => Object.keys(mockDestructiveTools),
}));

// Import after mocks
import {
	isCompanyOwner,
	getCompanyOwners,
	createPendingAction,
	getPendingActionsForChat,
	getPendingActionsForCompany,
	getPendingAction,
	approveAction,
	rejectAction,
	markActionExecuted,
	markActionFailed,
	expireOldActions,
	shouldInterceptTool,
	type PendingAction,
	type CreatePendingActionInput,
} from "../action-approval";

// =============================================================================
// TEST HELPERS
// =============================================================================

const mockCompanyId = "company-123";
const mockUserId = "user-456";
const mockOwnerId = "owner-789";
const mockChatId = "chat-abc";
const mockMessageId = "msg-def";
const mockActionId = "action-xyz";

function createMockPendingAction(overrides?: Partial<PendingAction>): PendingAction {
	return {
		id: mockActionId,
		companyId: mockCompanyId,
		chatId: mockChatId,
		messageId: mockMessageId,
		userId: mockUserId,
		toolName: "deleteCustomer",
		toolArgs: { customerId: "cust-123" },
		actionType: "delete",
		affectedEntityType: "customer",
		affectedEntityIds: ["cust-123"],
		affectedCount: 1,
		riskLevel: "critical",
		status: "pending",
		expiresAt: new Date(Date.now() + 86400000).toISOString(),
		createdAt: new Date().toISOString(),
		...overrides,
	};
}

function resetMocks() {
	vi.clearAllMocks();
}

// =============================================================================
// OWNER VERIFICATION TESTS
// =============================================================================

describe("AI Action Approval", () => {
	beforeEach(() => {
		resetMocks();
	});

	describe("Owner Verification", () => {
		it("should return true when user is company owner", async () => {
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null });

			const result = await isCompanyOwner(mockCompanyId, mockOwnerId);

			expect(result).toBe(true);
			expect(mockSupabaseClient.rpc).toHaveBeenCalledWith("is_company_owner", {
				p_company_id: mockCompanyId,
				p_user_id: mockOwnerId,
			});
		});

		it("should return false when user is not company owner", async () => {
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: false, error: null });

			const result = await isCompanyOwner(mockCompanyId, mockUserId);

			expect(result).toBe(false);
		});

		it("should return false on database error", async () => {
			mockSupabaseClient.rpc.mockResolvedValueOnce({
				data: null,
				error: { message: "Database error" },
			});

			const result = await isCompanyOwner(mockCompanyId, mockUserId);

			expect(result).toBe(false);
		});

		it("should fetch company owners with user details", async () => {
			const mockOwners = [
				{
					user_id: "owner-1",
					users: { email: "owner1@test.com", name: "John Owner" },
				},
				{
					user_id: "owner-2",
					users: { email: "owner2@test.com", name: "Jane Smith Owner" },
				},
			];

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ data: mockOwners, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getCompanyOwners(mockCompanyId);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				userId: "owner-1",
				email: "owner1@test.com",
				firstName: "John",
				lastName: "Owner",
			});
			expect(result[1]).toEqual({
				userId: "owner-2",
				email: "owner2@test.com",
				firstName: "Jane",
				lastName: "Smith Owner",
			});
		});

		it("should return empty array when no owners found", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ data: [], error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getCompanyOwners(mockCompanyId);

			expect(result).toEqual([]);
		});

		it("should handle null user data gracefully", async () => {
			const mockOwners = [
				{ user_id: "owner-1", users: null },
			];

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ data: mockOwners, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getCompanyOwners(mockCompanyId);

			expect(result[0]).toEqual({
				userId: "owner-1",
				email: "",
				firstName: "",
				lastName: "",
			});
		});
	});

	// =============================================================================
	// PENDING ACTION CREATION TESTS
	// =============================================================================

	describe("Pending Action Creation", () => {
		const createInput: CreatePendingActionInput = {
			companyId: mockCompanyId,
			chatId: mockChatId,
			messageId: mockMessageId,
			userId: mockUserId,
			toolName: "deleteCustomer",
			toolArgs: { customerId: "cust-123" },
			affectedEntityIds: ["cust-123"],
		};

		it("should create pending action for destructive tool", async () => {
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await createPendingAction(createInput);

			expect(result.success).toBe(true);
			expect(result.pendingActionId).toBe(mockActionId);
			expect(mockQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					company_id: mockCompanyId,
					chat_id: mockChatId,
					tool_name: "deleteCustomer",
					action_type: "delete",
					risk_level: "critical",
					status: "pending",
				})
			);
		});

		it("should fail for non-destructive tool", async () => {
			const result = await createPendingAction({
				...createInput,
				toolName: "getCustomerDetails", // Not in destructive tools
			});

			expect(result.success).toBe(false);
			expect(result.error).toContain("not registered as destructive");
		});

		it("should set 24-hour expiration", async () => {
			const beforeCreate = Date.now();
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createPendingAction(createInput);

			const insertCall = mockQuery.insert.mock.calls[0][0];
			const expiresAt = new Date(insertCall.expires_at).getTime();
			const expectedExpiry = beforeCreate + 24 * 60 * 60 * 1000;

			// Should expire approximately 24 hours from now (allow 1 second tolerance)
			expect(expiresAt).toBeGreaterThanOrEqual(expectedExpiry - 1000);
			expect(expiresAt).toBeLessThanOrEqual(expectedExpiry + 1000);
		});

		it("should handle database insert error", async () => {
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: null,
					error: { message: "Insert failed" },
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await createPendingAction(createInput);

			expect(result.success).toBe(false);
			expect(result.error).toBe("Insert failed");
		});

		it("should generate action summary with tool details", async () => {
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createPendingAction({
				...createInput,
				toolArgs: {
					customerId: "cust-123",
					to: "customer@test.com",
					subject: "Important Notice",
					amount: 5000, // in cents
				},
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.action_summary).toContain("Permanently delete a customer record");
			expect(insertCall.action_summary).toContain("customer@test.com");
			expect(insertCall.action_summary).toContain("Important Notice");
			expect(insertCall.action_summary).toContain("$50");
		});
	});

	// =============================================================================
	// PENDING ACTION RETRIEVAL TESTS
	// =============================================================================

	describe("Pending Action Retrieval", () => {
		it("should get pending actions for chat", async () => {
			const mockActions = [
				{
					id: "action-1",
					company_id: mockCompanyId,
					chat_id: mockChatId,
					message_id: mockMessageId,
					user_id: mockUserId,
					tool_name: "deleteCustomer",
					tool_args: {},
					action_type: "delete",
					affected_entity_type: "customer",
					affected_entity_ids: [],
					affected_count: 1,
					risk_level: "critical",
					status: "pending",
					expires_at: new Date().toISOString(),
					created_at: new Date().toISOString(),
				},
			];

			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				order: vi.fn().mockResolvedValueOnce({ data: mockActions, error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getPendingActionsForChat(mockCompanyId, mockChatId);

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe("action-1");
			expect(result[0].status).toBe("pending");
		});

		it("should get pending actions for company with filters", async () => {
			const mockActions = [
				{
					id: "action-1",
					company_id: mockCompanyId,
					chat_id: mockChatId,
					message_id: mockMessageId,
					user_id: mockUserId,
					tool_name: "deleteCustomer",
					tool_args: {},
					action_type: "delete",
					affected_entity_type: "customer",
					affected_entity_ids: [],
					affected_count: 1,
					risk_level: "critical",
					status: "approved",
					expires_at: new Date().toISOString(),
					created_at: new Date().toISOString(),
				},
			];

			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				order: vi.fn().mockReturnThis(),
				limit: vi.fn().mockResolvedValueOnce({ data: mockActions, error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getPendingActionsForCompany(mockCompanyId, {
				status: "approved",
				limit: 10,
			});

			expect(result).toHaveLength(1);
			expect(mockQuery.eq).toHaveBeenCalledWith("status", "approved");
			expect(mockQuery.limit).toHaveBeenCalledWith(10);
		});

		it("should get single pending action by ID", async () => {
			const mockAction = {
				id: mockActionId,
				company_id: mockCompanyId,
				chat_id: mockChatId,
				message_id: mockMessageId,
				user_id: mockUserId,
				tool_name: "deleteCustomer",
				tool_args: { customerId: "cust-123" },
				action_type: "delete",
				affected_entity_type: "customer",
				affected_entity_ids: ["cust-123"],
				affected_count: 1,
				risk_level: "critical",
				status: "pending",
				expires_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
			};

			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({ data: mockAction, error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getPendingAction(mockCompanyId, mockActionId);

			expect(result).not.toBeNull();
			expect(result?.id).toBe(mockActionId);
			expect(result?.toolArgs).toEqual({ customerId: "cust-123" });
		});

		it("should return null for non-existent action", async () => {
			const mockQuery = {
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: null,
					error: { message: "Not found" },
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await getPendingAction(mockCompanyId, "non-existent");

			expect(result).toBeNull();
		});
	});

	// =============================================================================
	// APPROVAL/REJECTION TESTS
	// =============================================================================

	describe("Action Approval", () => {
		it("should approve action via RPC", async () => {
			const mockResult = {
				success: true,
				actionId: mockActionId,
				toolName: "deleteCustomer",
				toolArgs: { customerId: "cust-123" },
			};
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: mockResult, error: null });

			const result = await approveAction(mockActionId, mockOwnerId);

			expect(result.success).toBe(true);
			expect(result.actionId).toBe(mockActionId);
			expect(result.toolName).toBe("deleteCustomer");
			expect(mockSupabaseClient.rpc).toHaveBeenCalledWith("approve_pending_action", {
				p_action_id: mockActionId,
				p_approver_id: mockOwnerId,
			});
		});

		it("should fail approval for non-owner", async () => {
			mockSupabaseClient.rpc.mockResolvedValueOnce({
				data: null,
				error: { message: "Only owners can approve actions" },
			});

			const result = await approveAction(mockActionId, mockUserId);

			expect(result.success).toBe(false);
			expect(result.error).toBe("Only owners can approve actions");
		});

		it("should reject action with reason", async () => {
			const mockResult = { success: true };
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: mockResult, error: null });

			const result = await rejectAction(mockActionId, mockOwnerId, "Too risky");

			expect(result.success).toBe(true);
			expect(mockSupabaseClient.rpc).toHaveBeenCalledWith("reject_pending_action", {
				p_action_id: mockActionId,
				p_rejector_id: mockOwnerId,
				p_reason: "Too risky",
			});
		});

		it("should reject action without reason", async () => {
			const mockResult = { success: true };
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: mockResult, error: null });

			const result = await rejectAction(mockActionId, mockOwnerId);

			expect(result.success).toBe(true);
			expect(mockSupabaseClient.rpc).toHaveBeenCalledWith("reject_pending_action", {
				p_action_id: mockActionId,
				p_rejector_id: mockOwnerId,
				p_reason: null,
			});
		});
	});

	// =============================================================================
	// EXECUTION TRACKING TESTS
	// =============================================================================

	describe("Execution Tracking", () => {
		it("should mark approved action as executed", async () => {
			const executionResult = { recordsDeleted: 1 };
			const mockQuery: Record<string, unknown> = {};
			mockQuery.update = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await markActionExecuted(mockCompanyId, mockActionId, executionResult);

			expect(result).toBe(true);
			expect(mockQuery.update).toHaveBeenCalledWith(
				expect.objectContaining({
					status: "executed",
					execution_result: executionResult,
				})
			);
		});

		it("should only execute approved actions", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.update = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			// Return error simulating non-approved status
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ error: { message: "No matching rows" } }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await markActionExecuted(mockCompanyId, mockActionId, {});

			expect(result).toBe(false);
		});

		it("should mark action as failed with error message", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.update = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.then = vi.fn((resolve) => Promise.resolve({ error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await markActionFailed(mockCompanyId, mockActionId, "Connection timeout");

			expect(result).toBe(true);
			expect(mockQuery.update).toHaveBeenCalledWith(
				expect.objectContaining({
					status: "failed",
					execution_error: "Connection timeout",
				})
			);
		});
	});

	// =============================================================================
	// EXPIRATION TESTS
	// =============================================================================

	describe("Action Expiration", () => {
		it("should expire old pending actions", async () => {
			const expiredActions = [{ id: "action-1" }, { id: "action-2" }];
			const mockQuery = {
				update: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				lt: vi.fn().mockReturnThis(),
				select: vi.fn().mockResolvedValueOnce({ data: expiredActions, error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await expireOldActions(mockCompanyId);

			expect(result).toBe(2);
			expect(mockQuery.update).toHaveBeenCalledWith(
				expect.objectContaining({
					status: "expired",
				})
			);
		});

		it("should return 0 when no actions to expire", async () => {
			const mockQuery = {
				update: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				lt: vi.fn().mockReturnThis(),
				select: vi.fn().mockResolvedValueOnce({ data: [], error: null }),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await expireOldActions(mockCompanyId);

			expect(result).toBe(0);
		});

		it("should handle expiration errors gracefully", async () => {
			const mockQuery = {
				update: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				lt: vi.fn().mockReturnThis(),
				select: vi.fn().mockResolvedValueOnce({
					data: null,
					error: { message: "DB error" },
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await expireOldActions(mockCompanyId);

			expect(result).toBe(0);
		});
	});

	// =============================================================================
	// TOOL INTERCEPTION TESTS
	// =============================================================================

	describe("Tool Interception", () => {
		const interceptContext = {
			companyId: mockCompanyId,
			chatId: mockChatId,
			messageId: mockMessageId,
			userId: mockUserId,
		};

		it("should not intercept non-destructive tools", async () => {
			const result = await shouldInterceptTool(
				"getCustomerDetails",
				{ customerId: "cust-123" },
				interceptContext
			);

			expect(result.intercept).toBe(false);
		});

		it("should not intercept tools that do not require owner approval", async () => {
			const result = await shouldInterceptTool(
				"safeToolNoApproval",
				{},
				interceptContext
			);

			expect(result.intercept).toBe(false);
		});

		it("should intercept destructive tools requiring approval", async () => {
			// Mock owner check
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: false, error: null });

			// Mock pending action creation
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await shouldInterceptTool(
				"deleteCustomer",
				{ customerId: "cust-123" },
				interceptContext
			);

			expect(result.intercept).toBe(true);
			expect(result.pendingActionId).toBe(mockActionId);
			expect(result.metadata?.actionType).toBe("delete");
			expect(result.metadata?.riskLevel).toBe("critical");
		});

		it("should still intercept for owners (explicit approval required)", async () => {
			// Mock owner check - user IS owner
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null });

			// Mock pending action creation
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await shouldInterceptTool(
				"deleteCustomer",
				{ customerId: "cust-123" },
				interceptContext
			);

			// Even owners need explicit approval for destructive actions
			expect(result.intercept).toBe(true);
			expect(result.pendingActionId).toBe(mockActionId);
		});

		it("should return error when pending action creation fails", async () => {
			// Mock owner check
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: false, error: null });

			// Mock failed pending action creation
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: null,
					error: { message: "Insert failed" },
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await shouldInterceptTool(
				"deleteCustomer",
				{ customerId: "cust-123" },
				interceptContext
			);

			expect(result.intercept).toBe(true);
			expect(result.error).toBe("Insert failed");
			expect(result.pendingActionId).toBeUndefined();
		});

		it("should handle high risk financial actions", async () => {
			// Mock owner check
			mockSupabaseClient.rpc.mockResolvedValueOnce({ data: false, error: null });

			// Mock pending action creation
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const result = await shouldInterceptTool(
				"processRefund",
				{ amount: 50000, paymentId: "pay-123" },
				interceptContext
			);

			expect(result.intercept).toBe(true);
			expect(result.metadata?.actionType).toBe("financial");
			expect(result.metadata?.riskLevel).toBe("high");
		});
	});

	// =============================================================================
	// RISK LEVEL TESTS
	// =============================================================================

	describe("Risk Level Handling", () => {
		it("should set urgency based on risk level - critical", async () => {
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createPendingAction({
				companyId: mockCompanyId,
				chatId: mockChatId,
				messageId: mockMessageId,
				userId: mockUserId,
				toolName: "deleteCustomer", // critical risk
				toolArgs: {},
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.urgency).toBe("high");
		});

		it("should set urgency based on risk level - high", async () => {
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createPendingAction({
				companyId: mockCompanyId,
				chatId: mockChatId,
				messageId: mockMessageId,
				userId: mockUserId,
				toolName: "processRefund", // high risk
				toolArgs: {},
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.urgency).toBe("medium");
		});

		it("should set urgency based on risk level - medium", async () => {
			const mockQuery = {
				insert: vi.fn().mockReturnThis(),
				select: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValueOnce({
					data: { id: mockActionId },
					error: null,
				}),
			};
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			await createPendingAction({
				companyId: mockCompanyId,
				chatId: mockChatId,
				messageId: mockMessageId,
				userId: mockUserId,
				toolName: "archiveJob", // medium risk
				toolArgs: {},
			});

			const insertCall = mockQuery.insert.mock.calls[0][0];
			expect(insertCall.urgency).toBe("low");
		});
	});
});
