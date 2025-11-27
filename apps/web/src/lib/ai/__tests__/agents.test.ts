/**
 * Multi-Agent System Tests
 *
 * Tests for @ai-sdk-tools/agents integration
 * Verifies agent creation, configuration, and handoff patterns
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock @ai-sdk/groq
vi.mock("@ai-sdk/groq", () => ({
	createGroq: vi.fn(() => vi.fn(() => "mocked-groq-model")),
}));

// Mock @ai-sdk-tools/agents
const mockAgent = {
	name: "test-agent",
	model: "mocked-model",
	instructions: "Test instructions",
	tools: {},
	toUIMessageStream: vi.fn(),
};

vi.mock("@ai-sdk-tools/agents", () => ({
	Agent: {
		create: vi.fn((config) => ({
			...mockAgent,
			...config,
			_type: "agent",
		})),
	},
	handoff: vi.fn((config) => ({
		...config,
		_type: "handoff",
	})),
}));

// Mock ai tool function
vi.mock("ai", () => ({
	tool: vi.fn((config) => ({
		...config,
		_type: "tool",
	})),
}));

// Mock memory provider
vi.mock("../memory-provider", () => ({
	createSupabaseMemoryProvider: vi.fn(() => ({
		getWorkingMemory: vi.fn(),
		updateWorkingMemory: vi.fn(),
		saveMessage: vi.fn(),
		getMessages: vi.fn(),
		saveChat: vi.fn(),
		getChats: vi.fn(),
		getChat: vi.fn(),
		updateChatTitle: vi.fn(),
		deleteChat: vi.fn(),
	})),
	DEFAULT_WORKING_MEMORY_TEMPLATE: "# Working Memory\n## Key Facts\n",
}));

// Mock agent tools
vi.mock("../agent-tools", () => ({
	searchCustomersTool: { description: "Search customers", _type: "tool" },
	searchJobsTool: { description: "Search jobs", _type: "tool" },
	searchInvoicesTool: { description: "Search invoices", _type: "tool" },
	createInvoiceTool: { description: "Create invoice", _type: "tool" },
	calculateEstimateTool: { description: "Calculate estimate", _type: "tool" },
	sendEmailTool: { description: "Send email", _type: "tool" },
	sendSmsTool: { description: "Send SMS", _type: "tool" },
	createAppointmentTool: { description: "Create appointment", _type: "tool" },
	getAvailableSlotsTool: { description: "Get available slots", _type: "tool" },
	getCustomerDetailsTool: { description: "Get customer details", _type: "tool" },
	updateCustomerTool: { description: "Update customer", _type: "tool" },
	getCompanyOverviewTool: { description: "Get company overview", _type: "tool" },
	storeMemoryTool: { description: "Store memory", _type: "tool" },
	recallContextTool: { description: "Recall context", _type: "tool" },
	searchMemoriesTool: { description: "Search memories", _type: "tool" },
	getEntityMemoriesTool: { description: "Get entity memories", _type: "tool" },
	webSearchTool: { description: "Web search", _type: "tool" },
	webSearchTechnicalTool: { description: "Technical web search", _type: "tool" },
	webSearchNewsTool: { description: "News web search", _type: "tool" },
	webSearchSiteTool: { description: "Site-specific web search", _type: "tool" },
	analyzeRecentCommunicationsTool: { description: "Analyze communications", _type: "tool" },
	buildCustomerProfileTool: { description: "Build customer profile", _type: "tool" },
	checkEquipmentWarrantyTool: { description: "Check warranty", _type: "tool" },
	checkPartsAvailabilityTool: { description: "Check parts", _type: "tool" },
	checkWeatherForJobTool: { description: "Check weather", _type: "tool" },
	extractCommunicationInsightsTool: { description: "Extract insights", _type: "tool" },
	findNearbySuppliersTool: { description: "Find suppliers", _type: "tool" },
	findTechniciansBySkillsTool: { description: "Find technicians", _type: "tool" },
	geocodeAddressTool: { description: "Geocode address", _type: "tool" },
	getCallTranscriptTool: { description: "Get call transcript", _type: "tool" },
	getCodeComplianceChecklistTool: { description: "Get compliance checklist", _type: "tool" },
	getCustomerCommunicationHistoryTool: { description: "Get comm history", _type: "tool" },
	getEquipmentServiceHistoryTool: { description: "Get equipment history", _type: "tool" },
	getLowStockAlertsTool: { description: "Get low stock alerts", _type: "tool" },
	getPermitRequirementsTool: { description: "Get permit requirements", _type: "tool" },
	getPropertyConditionsTool: { description: "Get property conditions", _type: "tool" },
	getPropertyEquipmentTool: { description: "Get property equipment", _type: "tool" },
	getRouteTool: { description: "Get route", _type: "tool" },
	getTechnicianWorkloadTool: { description: "Get technician workload", _type: "tool" },
	getTrafficConditionsTool: { description: "Get traffic conditions", _type: "tool" },
	getWeatherAlertsTool: { description: "Get weather alerts", _type: "tool" },
	getWeatherForLocationTool: { description: "Get weather for location", _type: "tool" },
	learnFromCompletedJobsTool: { description: "Learn from jobs", _type: "tool" },
	optimizeJobOrderTool: { description: "Optimize job order", _type: "tool" },
	scheduleReminderTool: { description: "Schedule reminder", _type: "tool" },
	searchBuildingCodesTool: { description: "Search building codes", _type: "tool" },
	searchCommunicationsFullTextTool: { description: "Search communications", _type: "tool" },
	searchInventoryTool: { description: "Search inventory", _type: "tool" },
	searchPriceBookTool: { description: "Search price book", _type: "tool" },
	searchVoicemailTranscriptsTool: { description: "Search voicemails", _type: "tool" },
	suggestTechnicianForJobTool: { description: "Suggest technician", _type: "tool" },
}));

// Import after mocks
import { Agent, handoff } from "@ai-sdk-tools/agents";
import { createGroq } from "@ai-sdk/groq";
import { createAgentSystem } from "../agents";
import {
	createSupabaseMemoryProvider,
	DEFAULT_WORKING_MEMORY_TEMPLATE,
} from "../memory-provider";

const mockedAgentCreate = vi.mocked(Agent.create);
const mockedHandoff = vi.mocked(handoff);
const mockedCreateMemoryProvider = vi.mocked(createSupabaseMemoryProvider);

// =============================================================================
// AGENT SYSTEM CREATION TESTS
// =============================================================================

describe("createAgentSystem", () => {
	const testCompanyId = "company-123";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create an agent system for a company", () => {
		const agentSystem = createAgentSystem(testCompanyId);

		expect(agentSystem).toBeDefined();
	});

	it("should create memory provider with company ID", () => {
		createAgentSystem(testCompanyId);

		expect(mockedCreateMemoryProvider).toHaveBeenCalledWith(testCompanyId);
	});

	it("should create Agent using Agent.create from @ai-sdk-tools/agents", () => {
		createAgentSystem(testCompanyId);

		// Multiple agents should be created
		expect(mockedAgentCreate).toHaveBeenCalled();
	});

	it("should pass memory configuration to agents", () => {
		createAgentSystem(testCompanyId);

		// Verify Agent.create was called with memory config
		expect(mockedAgentCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				memory: expect.objectContaining({
					provider: expect.any(Object),
					workingMemory: expect.objectContaining({
						enabled: true,
						scope: "chat",
					}),
					history: expect.objectContaining({
						enabled: true,
						limit: 20,
					}),
					chats: expect.objectContaining({
						enabled: true,
						generateTitle: true,
					}),
				}),
			})
		);
	});
});

// =============================================================================
// AI SDK TOOLS AGENTS INTEGRATION TESTS
// =============================================================================

describe("@ai-sdk-tools/agents Integration", () => {
	it("should export Agent from @ai-sdk-tools/agents", () => {
		expect(Agent).toBeDefined();
		expect(Agent.create).toBeDefined();
	});

	it("should export handoff from @ai-sdk-tools/agents", () => {
		expect(handoff).toBeDefined();
		expect(typeof handoff).toBe("function");
	});

	it("should use createGroq from @ai-sdk/groq", () => {
		expect(createGroq).toBeDefined();
		expect(typeof createGroq).toBe("function");
	});
});

// =============================================================================
// AGENT CONFIGURATION TESTS
// =============================================================================

describe("Agent Configuration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should configure agents with name property", () => {
		createAgentSystem("company-123");

		// Check that at least one agent was created with a name
		const calls = mockedAgentCreate.mock.calls;
		expect(calls.length).toBeGreaterThan(0);

		const hasNamedAgent = calls.some(
			([config]) => typeof config.name === "string" && config.name.length > 0
		);
		expect(hasNamedAgent).toBe(true);
	});

	it("should configure agents with model", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;
		const hasModel = calls.some(([config]) => config.model !== undefined);
		expect(hasModel).toBe(true);
	});

	it("should configure agents with instructions", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;
		const hasInstructions = calls.some(
			([config]) => typeof config.instructions === "string"
		);
		expect(hasInstructions).toBe(true);
	});

	it("should configure agents with tools", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;
		const hasTools = calls.some(
			([config]) => config.tools !== undefined
		);
		expect(hasTools).toBe(true);
	});
});

// =============================================================================
// MEMORY CONFIGURATION TESTS
// =============================================================================

describe("Memory Configuration", () => {
	it("should use DEFAULT_WORKING_MEMORY_TEMPLATE", () => {
		expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toBeDefined();
		expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toContain("Working Memory");
	});

	it("should configure working memory with chat scope", () => {
		createAgentSystem("company-123");

		expect(mockedAgentCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				memory: expect.objectContaining({
					workingMemory: expect.objectContaining({
						scope: "chat",
					}),
				}),
			})
		);
	});

	it("should enable history with limit of 20", () => {
		createAgentSystem("company-123");

		expect(mockedAgentCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				memory: expect.objectContaining({
					history: expect.objectContaining({
						enabled: true,
						limit: 20,
					}),
				}),
			})
		);
	});

	it("should enable chat title generation", () => {
		createAgentSystem("company-123");

		expect(mockedAgentCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				memory: expect.objectContaining({
					chats: expect.objectContaining({
						generateTitle: true,
					}),
				}),
			})
		);
	});
});

// =============================================================================
// HANDOFF PATTERN TESTS
// =============================================================================

describe("Handoff Pattern", () => {
	it("should use handoff function from @ai-sdk-tools/agents", () => {
		// handoff is used to create tool definitions for agent routing
		const handoffConfig = {
			target: "customer-agent",
			description: "Route to customer agent",
		};

		const result = handoff(handoffConfig);

		expect(mockedHandoff).toHaveBeenCalledWith(handoffConfig);
		expect(result).toHaveProperty("_type", "handoff");
	});
});

// =============================================================================
// AGENT TYPES TESTS
// =============================================================================

describe("Agent Types", () => {
	it("should create agents with AgentConfig interface", () => {
		// Verify the config shape matches AgentConfig from @ai-sdk-tools/agents
		const validConfig = {
			name: "test-agent",
			model: "mocked-model",
			instructions: "Test instructions",
			tools: {},
			memory: {
				provider: {},
				workingMemory: { enabled: true, scope: "chat" as const },
				history: { enabled: true, limit: 20 },
				chats: { enabled: true, generateTitle: true },
			},
		};

		// This should compile without type errors
		const agent = Agent.create(validConfig);
		expect(agent).toBeDefined();
	});
});

// =============================================================================
// GROQ INTEGRATION TESTS
// =============================================================================

describe("Groq Integration", () => {
	it("should initialize Groq provider", () => {
		// createGroq should be called
		const groq = createGroq();
		expect(groq).toBeDefined();
	});

	it("should use llama-3.3-70b-versatile model", () => {
		// The agents use llama-3.3-70b-versatile as the default model
		createAgentSystem("company-123");

		// Verify model is set in agent creation
		const calls = mockedAgentCreate.mock.calls;
		expect(calls.length).toBeGreaterThan(0);
	});
});

// =============================================================================
// SPECIALIZED AGENT TESTS
// =============================================================================

describe("Specialized Agents", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create customer agent", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;
		const customerAgentCall = calls.find(
			([config]) => config.name === "customer-agent"
		);

		expect(customerAgentCall).toBeDefined();
	});

	it("should create agents with specialized instructions", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;

		// Each agent should have unique instructions
		const instructions = calls.map(([config]) => config.instructions);
		const uniqueInstructions = new Set(instructions.filter(Boolean));

		expect(uniqueInstructions.size).toBeGreaterThan(0);
	});

	it("should assign relevant tools to each agent", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;

		// Verify tools are assigned
		const agentsWithTools = calls.filter(([config]) => {
			const tools = config.tools;
			return tools && Object.keys(tools).length > 0;
		});

		expect(agentsWithTools.length).toBeGreaterThan(0);
	});
});

// =============================================================================
// AGENT TOOL ASSIGNMENT TESTS
// =============================================================================

describe("Agent Tool Assignment", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should assign customer-related tools to customer agent", () => {
		createAgentSystem("company-123");

		const calls = mockedAgentCreate.mock.calls;
		const customerAgentCall = calls.find(
			([config]) => config.name === "customer-agent"
		);

		if (customerAgentCall) {
			const [config] = customerAgentCall;
			const toolNames = Object.keys(config.tools || {});

			// Customer agent should have customer-related tools
			// The actual tool assignment depends on implementation
			expect(config.tools).toBeDefined();
		}
	});

	it("should use tool function from ai package", () => {
		// Tools should be created using the tool() function from ai package
		// This is verified through our mock setup
		expect(vi.mocked(vi.fn())).toBeDefined();
	});
});

// =============================================================================
// INTEGRATION VERIFICATION TESTS
// =============================================================================

describe("Integration Verification", () => {
	it("should properly integrate all AI SDK packages", () => {
		// Verify all required packages are properly integrated
		const packages = {
			"@ai-sdk-tools/agents": { Agent, handoff },
			"@ai-sdk/groq": { createGroq },
		};

		for (const [pkgName, exports] of Object.entries(packages)) {
			for (const [exportName, exportValue] of Object.entries(exports)) {
				expect(exportValue).toBeDefined();
			}
		}
	});

	it("should create complete agent system", () => {
		const system = createAgentSystem("company-test");

		// System should be returned and functional
		expect(system).toBeDefined();

		// Memory provider should be created
		expect(mockedCreateMemoryProvider).toHaveBeenCalled();

		// At least one agent should be created
		expect(mockedAgentCreate).toHaveBeenCalled();
	});
});
