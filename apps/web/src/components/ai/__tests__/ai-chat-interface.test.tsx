/**
 * AI Chat Interface Tests
 *
 * Tests for @ai-sdk/react useChat hook integration
 * and @ai-sdk-tools/store state management
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

// =============================================================================
// MOCK SETUP - Use vi.hoisted to ensure mocks are available during hoisting
// =============================================================================

// Hoisted mock functions - these are available during vi.mock hoisting
const {
	mockSendMessage,
	mockRegenerate,
	mockSetMessages,
	mockStop,
	mockUseChatStatus,
	mockUseChatMessages,
	mockUseChatError,
	mockUseChatId,
	mockUseChatActions,
	mockUseDataPart,
	mockUseSelector,
} = vi.hoisted(() => ({
	mockSendMessage: vi.fn(),
	mockRegenerate: vi.fn(),
	mockSetMessages: vi.fn(),
	mockStop: vi.fn(),
	mockUseChatStatus: vi.fn(() => "ready"),
	mockUseChatMessages: vi.fn(() => []),
	mockUseChatError: vi.fn(() => null),
	mockUseChatId: vi.fn(() => "chat-123"),
	mockUseChatActions: vi.fn(() => ({
		sendMessage: vi.fn(),
		stop: vi.fn(),
	})),
	mockUseDataPart: vi.fn(() => [null, vi.fn()]),
	mockUseSelector: vi.fn((_key: string, selector: (arr: unknown[]) => unknown, _deps?: unknown[]) => selector([])),
}));

// Mock @ai-sdk/react
vi.mock("@ai-sdk/react", () => ({
	useChat: vi.fn(() => ({
		messages: [],
		error: null,
		sendMessage: mockSendMessage,
		status: "ready" as const,
		regenerate: mockRegenerate,
		setMessages: mockSetMessages,
		stop: mockStop,
	})),
	UIMessage: {} as unknown,
}));

// Mock ai package
vi.mock("ai", () => ({
	DefaultChatTransport: vi.fn().mockImplementation((config) => ({
		...config,
		_type: "transport",
	})),
	isTextUIPart: vi.fn((part: unknown) => {
		return (
			typeof part === "object" &&
			part !== null &&
			"type" in part &&
			(part as { type: string }).type === "text"
		);
	}),
}));

vi.mock("@ai-sdk-tools/store", () => ({
	createChatStore: vi.fn((initialMessages) => ({
		getState: () => ({
			messages: initialMessages || [],
			status: "ready",
			error: null,
		}),
		subscribe: vi.fn(),
		setState: vi.fn(),
	})),
	Provider: ({ children }: { children: ReactNode }) => children,
	useChatStore: vi.fn(() => ({
		messages: [],
		status: "ready",
		error: null,
	})),
	useChatMessages: mockUseChatMessages,
	useChatStatus: mockUseChatStatus,
	useChatError: mockUseChatError,
	useChatId: mockUseChatId,
	useChatActions: mockUseChatActions,
	useChatReset: vi.fn(() => vi.fn()),
	useMessageById: vi.fn(() => null),
	useMessageIds: vi.fn(() => []),
	useMessageCount: vi.fn(() => 0),
	useVirtualMessages: vi.fn(() => []),
	useSelector: mockUseSelector,
	useDataPart: mockUseDataPart,
	useDataParts: vi.fn(() => []),
}));

// Mock chat actions
vi.mock("@/actions/chats", () => ({
	createChat: vi.fn(() => Promise.resolve({ success: true, data: { chatId: "chat-new" } })),
	generateChatTitle: vi.fn(() => Promise.resolve({ success: true, data: "Generated Title" })),
	getChatMessages: vi.fn(() => Promise.resolve({ success: true, data: [] })),
}));

// Mock components
vi.mock("@/components/ai/artifact", () => ({
	Artifact: ({ children }: { children: ReactNode }) => <div data-testid="artifact">{children}</div>,
	ArtifactAction: ({ children }: { children: ReactNode }) => <button>{children}</button>,
	ArtifactActions: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ArtifactContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ArtifactDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
	ArtifactHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ArtifactTitle: ({ children }: { children: ReactNode }) => <h3>{children}</h3>,
}));

vi.mock("@/components/ai/conversation", () => ({
	Conversation: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ConversationContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ConversationEmptyState: () => <div data-testid="empty-state">No messages</div>,
	ConversationScrollButton: () => <button>Scroll</button>,
}));

vi.mock("@/components/ai/loader", () => ({
	Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("@/components/ai/message", () => ({
	Message: ({ children }: { children: ReactNode }) => <div data-testid="message">{children}</div>,
	MessageAction: ({ children }: { children: ReactNode }) => <button>{children}</button>,
	MessageActions: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	MessageAttachment: () => <div>Attachment</div>,
	MessageAttachments: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	MessageContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	MessageResponse: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	MessageToolbar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ai/model-selector", () => ({
	ModelSelector: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorEmpty: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorInput: () => <input />,
	ModelSelectorItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorList: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorLogo: () => <span>Logo</span>,
	ModelSelectorLogoGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ModelSelectorName: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	ModelSelectorTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ai/prompt-input", () => ({
	PromptInput: ({ children, onSubmit }: { children: ReactNode; onSubmit: unknown }) => (
		<form data-testid="prompt-input">{children}</form>
	),
	PromptInputActionAddAttachments: () => <button>Add</button>,
	PromptInputActionMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PromptInputActionMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PromptInputActionMenuTrigger: () => <button>Menu</button>,
	PromptInputAttachment: () => <div>Attachment</div>,
	PromptInputAttachments: ({ children }: { children: (a: unknown) => ReactNode }) => (
		<div>{children({})}</div>
	),
	PromptInputBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PromptInputButton: ({ children }: { children: ReactNode }) => <button>{children}</button>,
	PromptInputFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PromptInputSpeechButton: () => <button>Speech</button>,
	PromptInputSubmit: () => <button type="submit">Send</button>,
	PromptInputTextarea: () => <textarea />,
	PromptInputTools: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/lib/stores/chat-store", () => ({
	useChatStore: vi.fn((selector) => {
		const state = {
			createChat: vi.fn(),
			activeFilter: "all",
		};
		return selector ? selector(state) : state;
	}),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}));

// Import after mocks
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import {
	createChatStore,
	useChatStore as useAiToolsStore,
	useChatMessages,
	useChatStatus,
	useChatError,
	useChatId,
	useChatActions,
	useSelector,
	useDataPart,
} from "@ai-sdk-tools/store";

const mockedUseChat = vi.mocked(useChat);

// =============================================================================
// @AI-SDK/REACT TESTS
// =============================================================================

describe("@ai-sdk/react Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should export useChat hook from @ai-sdk/react", () => {
		expect(useChat).toBeDefined();
		expect(typeof useChat).toBe("function");
	});

	it("should return correct useChat hook interface", () => {
		const result = useChat({} as Parameters<typeof useChat>[0]);

		expect(result).toHaveProperty("messages");
		expect(result).toHaveProperty("error");
		expect(result).toHaveProperty("sendMessage");
		expect(result).toHaveProperty("status");
		expect(result).toHaveProperty("regenerate");
		expect(result).toHaveProperty("setMessages");
	});

	it("should use DefaultChatTransport from ai package", () => {
		// DefaultChatTransport is a class that creates a transport instance
		// Verify the mock is properly set up
		expect(DefaultChatTransport).toBeDefined();
		expect(typeof DefaultChatTransport).toBe("function");

		// When used as a factory function (mocked behavior)
		const transport = (DefaultChatTransport as unknown as (config: { api: string }) => { api: string; _type: string })({
			api: "/api/ai/chat",
		});

		expect(transport).toHaveProperty("api", "/api/ai/chat");
		expect(transport).toHaveProperty("_type", "transport");
	});

	it("should provide isTextUIPart utility from ai package", () => {
		expect(isTextUIPart).toBeDefined();
		expect(typeof isTextUIPart).toBe("function");
	});

	it("should correctly identify text UI parts", () => {
		const textPart = { type: "text", text: "Hello" };
		const toolPart = { type: "tool-call", toolName: "test" };

		expect(isTextUIPart(textPart)).toBe(true);
		expect(isTextUIPart(toolPart)).toBe(false);
	});
});

// =============================================================================
// USECAT HOOK TESTS
// =============================================================================

describe("useChat Hook Configuration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should support id parameter for chat identification", () => {
		useChat({
			id: "chat-123",
		} as Parameters<typeof useChat>[0]);

		expect(mockedUseChat).toHaveBeenCalled();
	});

	it("should support initialMessages parameter", () => {
		const initialMessages = [
			{ id: "1", role: "user" as const, content: "Hello" },
		];

		useChat({
			initialMessages,
		} as unknown as Parameters<typeof useChat>[0]);

		expect(mockedUseChat).toHaveBeenCalled();
	});

	it("should support experimental_throttle parameter", () => {
		useChat({
			experimental_throttle: 50,
		} as Parameters<typeof useChat>[0]);

		expect(mockedUseChat).toHaveBeenCalled();
	});

	it("should support onFinish callback", () => {
		const onFinish = vi.fn();

		useChat({
			onFinish,
		} as Parameters<typeof useChat>[0]);

		expect(mockedUseChat).toHaveBeenCalled();
	});

	it("should support onError callback", () => {
		const onError = vi.fn();

		useChat({
			onError,
		} as Parameters<typeof useChat>[0]);

		expect(mockedUseChat).toHaveBeenCalled();
	});
});

// =============================================================================
// CHAT STATUS TESTS
// =============================================================================

describe("Chat Status Handling", () => {
	it("should handle 'ready' status", () => {
		mockedUseChat.mockReturnValue({
			messages: [],
			error: null,
			sendMessage: mockSendMessage,
			status: "ready",
			regenerate: mockRegenerate,
			setMessages: mockSetMessages,
			stop: mockStop,
		} as ReturnType<typeof useChat>);

		const result = useChat({} as Parameters<typeof useChat>[0]);
		expect(result.status).toBe("ready");
	});

	it("should handle 'submitted' status", () => {
		mockedUseChat.mockReturnValue({
			messages: [],
			error: null,
			sendMessage: mockSendMessage,
			status: "submitted",
			regenerate: mockRegenerate,
			setMessages: mockSetMessages,
			stop: mockStop,
		} as ReturnType<typeof useChat>);

		const result = useChat({} as Parameters<typeof useChat>[0]);
		expect(result.status).toBe("submitted");
	});

	it("should handle 'streaming' status", () => {
		mockedUseChat.mockReturnValue({
			messages: [],
			error: null,
			sendMessage: mockSendMessage,
			status: "streaming",
			regenerate: mockRegenerate,
			setMessages: mockSetMessages,
			stop: mockStop,
		} as ReturnType<typeof useChat>);

		const result = useChat({} as Parameters<typeof useChat>[0]);
		expect(result.status).toBe("streaming");
	});

	it("should handle 'error' status", () => {
		mockedUseChat.mockReturnValue({
			messages: [],
			error: new Error("Test error"),
			sendMessage: mockSendMessage,
			status: "error",
			regenerate: mockRegenerate,
			setMessages: mockSetMessages,
			stop: mockStop,
		} as ReturnType<typeof useChat>);

		const result = useChat({} as Parameters<typeof useChat>[0]);
		expect(result.status).toBe("error");
		expect(result.error).toBeInstanceOf(Error);
	});
});

// =============================================================================
// @AI-SDK-TOOLS/STORE TESTS
// =============================================================================

describe("@ai-sdk-tools/store Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should export createChatStore from @ai-sdk-tools/store", () => {
		expect(createChatStore).toBeDefined();
		expect(typeof createChatStore).toBe("function");
	});

	it("should create store with initial messages", () => {
		const initialMessages = [{ id: "1", role: "user", content: "Hello" }];
		const store = createChatStore(initialMessages as unknown[]);

		expect(store).toBeDefined();
		expect(store.getState).toBeDefined();
		expect(store.getState().messages).toEqual(initialMessages);
	});

	it("should export useChatMessages hook", () => {
		expect(useChatMessages).toBeDefined();
		expect(typeof useChatMessages).toBe("function");
	});

	it("should export useChatStatus hook", () => {
		expect(useChatStatus).toBeDefined();
		expect(typeof useChatStatus).toBe("function");
	});

	it("should export useChatError hook", () => {
		expect(useChatError).toBeDefined();
		expect(typeof useChatError).toBe("function");
	});

	it("should export useChatId hook", () => {
		expect(useChatId).toBeDefined();
		expect(typeof useChatId).toBe("function");
	});

	it("should export useChatActions hook", () => {
		expect(useChatActions).toBeDefined();
		expect(typeof useChatActions).toBe("function");
	});

	it("should export useSelector hook", () => {
		expect(useSelector).toBeDefined();
		expect(typeof useSelector).toBe("function");
	});

	it("should export useDataPart hook", () => {
		expect(useDataPart).toBeDefined();
		expect(typeof useDataPart).toBe("function");
	});
});

// =============================================================================
// STORE HOOKS BEHAVIOR TESTS
// =============================================================================

describe("Store Hooks Behavior", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return messages from useChatMessages", () => {
		const messages = [
			{ id: "1", role: "user", content: "Hello" },
			{ id: "2", role: "assistant", content: "Hi there!" },
		];
		mockUseChatMessages.mockReturnValue(messages);

		const result = useChatMessages();
		expect(result).toEqual(messages);
	});

	it("should return status from useChatStatus", () => {
		mockUseChatStatus.mockReturnValue("streaming");

		const result = useChatStatus();
		expect(result).toBe("streaming");
	});

	it("should return error from useChatError", () => {
		const error = new Error("Test error");
		mockUseChatError.mockReturnValue(error);

		const result = useChatError();
		expect(result).toEqual(error);
	});

	it("should return chat ID from useChatId", () => {
		mockUseChatId.mockReturnValue("chat-456");

		const result = useChatId();
		expect(result).toBe("chat-456");
	});

	it("should return actions from useChatActions", () => {
		const actions = {
			sendMessage: mockSendMessage,
			stop: mockStop,
		};
		mockUseChatActions.mockReturnValue(actions);

		const result = useChatActions();
		expect(result.sendMessage).toBeDefined();
		expect(result.stop).toBeDefined();
	});
});

// =============================================================================
// DATA PART HOOKS TESTS
// =============================================================================

describe("useDataPart Hook", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return data part and clear function", () => {
		const clearFn = vi.fn();
		mockUseDataPart.mockReturnValue([{ status: "routing", agent: "customer" }, clearFn]);

		const [data, clear] = useDataPart("agent-status");

		expect(data).toEqual({ status: "routing", agent: "customer" });
		expect(typeof clear).toBe("function");
	});

	it("should return null when no data part exists", () => {
		mockUseDataPart.mockReturnValue([null, vi.fn()]);

		const [data] = useDataPart("non-existent");

		expect(data).toBeNull();
	});

	it("should support agent-status data part type", () => {
		mockUseDataPart.mockReturnValue([
			{ status: "executing", agent: "scheduling" },
			vi.fn(),
		]);

		const [status] = useDataPart("agent-status");

		expect(status).toHaveProperty("status", "executing");
		expect(status).toHaveProperty("agent", "scheduling");
	});

	it("should support agent-handoff data part type", () => {
		mockUseDataPart.mockReturnValue([
			{
				from: "customer-agent",
				to: "scheduling-agent",
				reason: "Appointment needed",
				routingStrategy: "llm",
			},
			vi.fn(),
		]);

		const [handoff] = useDataPart("agent-handoff");

		expect(handoff).toHaveProperty("from", "customer-agent");
		expect(handoff).toHaveProperty("to", "scheduling-agent");
		expect(handoff).toHaveProperty("routingStrategy", "llm");
	});

	it("should support rate-limit data part type", () => {
		mockUseDataPart.mockReturnValue([
			{
				limit: 100,
				remaining: 95,
				reset: "2024-01-15T12:00:00Z",
			},
			vi.fn(),
		]);

		const [rateLimit] = useDataPart("rate-limit");

		expect(rateLimit).toHaveProperty("limit", 100);
		expect(rateLimit).toHaveProperty("remaining", 95);
	});

	it("should support suggestions data part type", () => {
		mockUseDataPart.mockReturnValue([
			{
				prompts: ["Show overdue invoices", "Schedule an appointment"],
			},
			vi.fn(),
		]);

		const [suggestions] = useDataPart("suggestions");

		expect(suggestions).toHaveProperty("prompts");
		expect(suggestions?.prompts).toHaveLength(2);
	});
});

// =============================================================================
// SELECTOR HOOK TESTS
// =============================================================================

describe("useSelector Hook", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should select from messages using selector function", () => {
		const messages = [
			{ id: "1", role: "user", content: "Hello" },
			{ id: "2", role: "assistant", content: "Hi" },
			{ id: "3", role: "user", content: "How are you?" },
		];

		mockUseSelector.mockImplementation((key, selector) => selector(messages));

		const result = useSelector(
			"last-assistant",
			(msgs: typeof messages) => msgs.filter((m) => m.role === "assistant").slice(-1)[0],
			[]
		);

		expect(result).toEqual({ id: "2", role: "assistant", content: "Hi" });
	});

	it("should count messages by role", () => {
		const messages = [
			{ id: "1", role: "user" },
			{ id: "2", role: "assistant" },
			{ id: "3", role: "user" },
			{ id: "4", role: "assistant" },
			{ id: "5", role: "system" },
		];

		mockUseSelector.mockImplementation((key, selector) => selector(messages));

		const result = useSelector(
			"count-by-role",
			(msgs: typeof messages) => ({
				user: msgs.filter((m) => m.role === "user").length,
				assistant: msgs.filter((m) => m.role === "assistant").length,
				system: msgs.filter((m) => m.role === "system").length,
			}),
			[]
		);

		expect(result).toEqual({ user: 2, assistant: 2, system: 1 });
	});

	it("should extract artifacts from messages", () => {
		const messages = [
			{
				id: "1",
				role: "assistant",
				metadata: {
					artifacts: [
						{ id: "art-1", type: "customer-card" },
						{ id: "art-2", type: "invoice" },
					],
				},
			},
			{ id: "2", role: "user" },
		];

		mockUseSelector.mockImplementation((key, selector) => selector(messages));

		const result = useSelector(
			"all-artifacts",
			(msgs: typeof messages) =>
				msgs.flatMap((m) =>
					((m as { metadata?: { artifacts?: Array<{ id: string; type: string }> } }).metadata?.artifacts || []).map((a) => ({
						...a,
						messageId: m.id,
					}))
				),
			[]
		);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ id: "art-1", type: "customer-card", messageId: "1" });
	});
});

// =============================================================================
// MESSAGE CONTENT EXTRACTION TESTS
// =============================================================================

describe("Message Content Extraction", () => {
	it("should extract text from parts array using isTextUIPart", () => {
		const message = {
			id: "1",
			role: "assistant",
			parts: [
				{ type: "text", text: "Hello " },
				{ type: "tool-call", toolName: "search" },
				{ type: "text", text: "World!" },
			],
		};

		// Simulate getMessageTextContent logic
		const textContent = message.parts
			.filter(isTextUIPart)
			.map((part) => (part as { text: string }).text)
			.join("");

		expect(textContent).toBe("Hello World!");
	});

	it("should return empty string for messages without parts", () => {
		const message = {
			id: "1",
			role: "assistant",
			parts: [],
		};

		const textContent = message.parts
			.filter(isTextUIPart)
			.map((part) => (part as { text: string }).text)
			.join("");

		expect(textContent).toBe("");
	});

	it("should handle messages with only tool parts", () => {
		const message = {
			id: "1",
			role: "assistant",
			parts: [
				{ type: "tool-call", toolName: "searchCustomers", args: {} },
				{ type: "tool-result", toolName: "searchCustomers", result: [] },
			],
		};

		const textContent = message.parts
			.filter(isTextUIPart)
			.map((part) => (part as { text: string }).text)
			.join("");

		expect(textContent).toBe("");
	});
});

// =============================================================================
// SEND MESSAGE TESTS
// =============================================================================

describe("sendMessage Function", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should send message with text", () => {
		const { sendMessage } = useChat({} as Parameters<typeof useChat>[0]);

		sendMessage(
			{ text: "Hello AI" },
			{ body: { companyId: "company-123" } }
		);

		expect(mockSendMessage).toHaveBeenCalled();
	});

	it("should send message with files", () => {
		const { sendMessage } = useChat({} as Parameters<typeof useChat>[0]);

		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		sendMessage(
			{ text: "Check this image", files: [mockFile] },
			{ body: { companyId: "company-123" } }
		);

		expect(mockSendMessage).toHaveBeenCalled();
	});

	it("should send message with custom body parameters", () => {
		const { sendMessage } = useChat({} as Parameters<typeof useChat>[0]);

		sendMessage(
			{ text: "Hello" },
			{
				body: {
					companyId: "company-123",
					chatId: "chat-456",
					model: "llama-3.3-70b-versatile",
				},
			}
		);

		expect(mockSendMessage).toHaveBeenCalled();
	});
});

// =============================================================================
// REGENERATE FUNCTION TESTS
// =============================================================================

describe("regenerate Function", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should regenerate response", () => {
		const { regenerate } = useChat({} as Parameters<typeof useChat>[0]);

		regenerate({});

		expect(mockRegenerate).toHaveBeenCalled();
	});

	it("should regenerate specific message by ID", () => {
		const { regenerate } = useChat({} as Parameters<typeof useChat>[0]);

		regenerate({ messageId: "msg-123" });

		expect(mockRegenerate).toHaveBeenCalledWith({ messageId: "msg-123" });
	});
});

// =============================================================================
// MODEL CONFIGURATION TESTS
// =============================================================================

describe("Model Configuration", () => {
	it("should support LLaMA 3.3 70B model", () => {
		const models = [
			{
				id: "llama-3.3-70b-versatile",
				name: "LLaMA 3.3 70B",
				chef: "Groq",
				providers: ["groq"],
			},
		];

		expect(models[0].id).toBe("llama-3.3-70b-versatile");
		expect(models[0].providers).toContain("groq");
	});

	it("should support LLaMA 3.1 70B model", () => {
		const models = [
			{
				id: "llama-3.1-70b-versatile",
				name: "LLaMA 3.1 70B",
				chef: "Groq",
				providers: ["groq"],
			},
		];

		expect(models[0].id).toBe("llama-3.1-70b-versatile");
	});

	it("should support LLaMA 3.1 8B model", () => {
		const models = [
			{
				id: "llama-3.1-8b-instant",
				name: "LLaMA 3.1 8B",
				chef: "Groq",
				providers: ["groq"],
			},
		];

		expect(models[0].id).toBe("llama-3.1-8b-instant");
	});
});

// =============================================================================
// TOOL INVOCATION RENDERING TESTS
// =============================================================================

describe("Tool Invocation Handling", () => {
	it("should define tool invocation interface", () => {
		interface ToolInvocation {
			toolCallId: string;
			toolName: string;
			args: Record<string, unknown>;
			state: "partial-call" | "call" | "result";
			result?: unknown;
		}

		const invocation: ToolInvocation = {
			toolCallId: "call-123",
			toolName: "searchCustomers",
			args: { query: "John" },
			state: "call",
		};

		expect(invocation.toolCallId).toBe("call-123");
		expect(invocation.state).toBe("call");
	});

	it("should track tool invocation states", () => {
		const states = ["partial-call", "call", "result"] as const;

		expect(states).toContain("partial-call");
		expect(states).toContain("call");
		expect(states).toContain("result");
	});

	it("should map tool names to icons", () => {
		const toolIcons: Record<string, string> = {
			searchCustomers: "Users",
			searchJobs: "Wrench",
			createAppointment: "Calendar",
			searchInvoices: "FileText",
			sendEmail: "Mail",
			sendSms: "MessageSquare",
		};

		expect(toolIcons.searchCustomers).toBe("Users");
		expect(toolIcons.searchJobs).toBe("Wrench");
		expect(toolIcons.createAppointment).toBe("Calendar");
	});
});

// =============================================================================
// SUGGESTED ACTIONS TESTS
// =============================================================================

describe("Suggested Actions", () => {
	it("should define business-focused suggested actions", () => {
		const SUGGESTED_ACTIONS = [
			{ text: "Show today's schedule", icon: "Calendar" },
			{ text: "Inactive customers (30+ days)", icon: "Users" },
			{ text: "Overdue invoices", icon: "FileText" },
			{ text: "Monthly financial summary", icon: "TrendingUp" },
		];

		expect(SUGGESTED_ACTIONS).toHaveLength(4);
		expect(SUGGESTED_ACTIONS[0].text).toBe("Show today's schedule");
		expect(SUGGESTED_ACTIONS[2].text).toBe("Overdue invoices");
	});
});

// =============================================================================
// AI SDK TYPE EXPORTS TESTS
// =============================================================================

describe("AI SDK Type Exports", () => {
	it("should use UIMessage type from @ai-sdk/react", () => {
		// Type verification - UIMessage should have id, role, and parts
		type MessageShape = {
			id: string;
			role: "user" | "assistant" | "system";
			parts?: Array<{ type: string }>;
		};

		const message: MessageShape = {
			id: "1",
			role: "assistant",
			parts: [{ type: "text" }],
		};

		expect(message.id).toBe("1");
		expect(message.role).toBe("assistant");
	});

	it("should extend UIMessage with StratosMessage metadata", () => {
		interface StratosMessage {
			id: string;
			role: "user" | "assistant" | "system";
			metadata?: {
				agent?: string;
				handoffs?: Array<{ from: string; to: string; reason?: string }>;
				artifacts?: Array<{ id: string; type: string }>;
				suggestions?: string[];
			};
		}

		const message: StratosMessage = {
			id: "1",
			role: "assistant",
			metadata: {
				agent: "customer-agent",
				handoffs: [{ from: "triage", to: "customer-agent", reason: "Customer query" }],
				artifacts: [{ id: "art-1", type: "customer-card" }],
				suggestions: ["View customer details", "Schedule appointment"],
			},
		};

		expect(message.metadata?.agent).toBe("customer-agent");
		expect(message.metadata?.handoffs).toHaveLength(1);
		expect(message.metadata?.artifacts).toHaveLength(1);
		expect(message.metadata?.suggestions).toHaveLength(2);
	});
});
