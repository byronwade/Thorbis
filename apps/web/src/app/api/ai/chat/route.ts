/**
 * AI Chat API Route - Proactive Business Manager
 *
 * Features:
 * - Groq as the exclusive AI provider (free tier with generous limits)
 * - Comprehensive business tools (86+ tools)
 * - Permission-based action control
 * - Proactive business insights
 */

import { convertToModelMessages, generateText, jsonSchema, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import {
	type DestructiveToolMetadata,
	getDestructiveToolMetadata,
	isDestructiveTool,
	shouldInterceptTool,
} from "@/lib/ai/action-approval";
import {
	aiAgentTools,
	type ToolCategory,
	toolCategories,
} from "@/lib/ai/agent-tools";
import { createAIProvider, type AIProvider } from "@/lib/ai/config";
import { createServiceSupabaseClient } from "@stratos/database";
import { trackExternalApiCall } from "@/lib/analytics/external-api-tracker";

export const maxDuration = 60;

// ============================================================================
// MESSAGE PERSISTENCE - Save chat history to Supabase
// ============================================================================

interface MessagePart {
	type: string;
	text?: string;
	toolName?: string;
	toolCallId?: string;
	args?: unknown;
	result?: unknown;
}

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(str: string): boolean {
	return UUID_REGEX.test(str);
}

/**
 * Generate a meaningful chat title using AI
 * Runs asynchronously after chat creation to avoid blocking
 */
async function generateChatTitleWithAI(
	supabase: Awaited<ReturnType<typeof createServiceSupabaseClient>>,
	chatId: string,
	firstMessage: string,
): Promise<void> {
	if (!supabase || !firstMessage.trim()) return;

	try {
		// Use Groq for title generation (free)
		if (!process.env.GROQ_API_KEY) {
			console.log("[AI Chat API] No GROQ_API_KEY available for title generation");
			return;
		}

		const model = createAIProvider({ provider: "groq", model: "llama-3.3-70b-versatile" });

		const { text: title } = await generateText({
			model,
			prompt: `Generate a very brief, descriptive title (3-6 words max) for a conversation that starts with this message. Return ONLY the title, no quotes or extra text.

Message: "${firstMessage.slice(0, 500)}"

Title:`,
			maxOutputTokens: 30, // AI SDK 5: maxTokens renamed to maxOutputTokens
			temperature: 0.3,
		});

		// Clean up the title
		let cleanTitle = title
			.trim()
			.replace(/^["']|["']$/g, "") // Remove surrounding quotes
			.replace(/^Title:\s*/i, "") // Remove "Title:" prefix if AI added it
			.slice(0, 100); // Ensure max length

		// Capitalize first letter
		if (cleanTitle) {
			cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
		}

		if (cleanTitle && cleanTitle !== "New Chat") {
			await supabase
				.from("chats")
				.update({ title: cleanTitle, updated_at: new Date().toISOString() })
				.eq("id", chatId);

			console.log("[AI Chat API] Generated title for chat:", chatId, "->", cleanTitle);
		}
	} catch (error) {
		// Non-critical error - just log and continue
		console.error("[AI Chat API] Title generation failed:", error);
	}
}

/**
 * Ensure a chat exists, creating one if needed
 * Returns canPersist: false if persistence is not possible (invalid UUIDs, no supabase, etc.)
 */
async function ensureChat(
	supabase: Awaited<ReturnType<typeof createServiceSupabaseClient>>,
	chatId: string,
	userId: string,
	companyId: string,
	firstMessageContent?: string,
): Promise<{ id: string; isNew: boolean; canPersist: boolean }> {
	// If no supabase, skip persistence
	if (!supabase) {
		console.log("[AI Chat API] Supabase not available, skipping chat persistence");
		return { id: chatId, isNew: false, canPersist: false };
	}

	// Validate all required UUIDs - if invalid, skip persistence but continue with chat
	if (!isValidUUID(chatId)) {
		console.log("[AI Chat API] Invalid chatId UUID, skipping persistence:", chatId);
		return { id: chatId, isNew: false, canPersist: false };
	}
	if (!isValidUUID(userId) || userId === "anonymous") {
		console.log("[AI Chat API] Invalid or anonymous userId, skipping persistence:", userId);
		return { id: chatId, isNew: false, canPersist: false };
	}
	if (!isValidUUID(companyId)) {
		console.log("[AI Chat API] Invalid companyId UUID, skipping persistence:", companyId);
		return { id: chatId, isNew: false, canPersist: false };
	}

	// Check if chat exists
	const { data: existingChat } = await supabase
		.from("chats")
		.select("id")
		.eq("id", chatId)
		.single();

	if (existingChat) {
		return { id: existingChat.id, isNew: false, canPersist: true };
	}

	// Create new chat with placeholder title - AI will generate a better one
	const { data: newChat, error } = await supabase
		.from("chats")
		.insert({
			id: chatId,
			title: "New Chat",
			user_id: userId,
			company_id: companyId,
			visibility: "private",
		})
		.select("id")
		.single();

	if (error) {
		console.error("[AI Chat API] Error creating chat:", error);
		return { id: chatId, isNew: false, canPersist: false };
	}

	console.log("[AI Chat API] Created new chat:", newChat.id);

	// Generate AI title in background (non-blocking, fire-and-forget)
	if (firstMessageContent && firstMessageContent.trim()) {
		generateChatTitleWithAI(supabase, chatId, firstMessageContent).catch((err) => {
			console.error("[AI Chat API] Background title generation failed:", err);
		});
	}

	return { id: newChat.id, isNew: true, canPersist: true };
}

/**
 * Save a message to the messages_v2 table
 */
async function saveMessage(
	supabase: Awaited<ReturnType<typeof createServiceSupabaseClient>>,
	chatId: string,
	role: "user" | "assistant" | "system",
	parts: MessagePart[],
	attachments: unknown[] = [],
): Promise<string | null> {
	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from("messages_v2")
		.insert({
			chat_id: chatId,
			role,
			parts,
			attachments,
		})
		.select("id")
		.single();

	if (error) {
		console.error("[AI Chat API] Error saving message:", error);
		return null;
	}

	return data.id;
}

/**
 * Convert AI SDK message to parts format for storage
 */
function convertToMessageParts(content: string | unknown[]): MessagePart[] {
	// If content is already an array of parts, use it
	if (Array.isArray(content)) {
		return content.map((part) => {
			if (typeof part === "string") {
				return { type: "text", text: part };
			}
			return part as MessagePart;
		});
	}

	// If content is a string, wrap it as a text part
	if (typeof content === "string") {
		return [{ type: "text", text: content }];
	}

	return [{ type: "text", text: String(content) }];
}

// ============================================================================
// COMPANY CONTEXT CACHE - Reduces AI costs by ~$300-800/month
// Context is cached per company for 5 minutes to avoid 10 DB queries per message
// ============================================================================
const companyContextCache = new Map<
	string,
	{ data: string; timestamp: number }
>();
const CONTEXT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedContext(companyId: string): string | null {
	const cached = companyContextCache.get(companyId);
	if (cached && Date.now() - cached.timestamp < CONTEXT_CACHE_TTL_MS) {
		return cached.data;
	}
	return null;
}

function setCachedContext(companyId: string, data: string): void {
	companyContextCache.set(companyId, { data, timestamp: Date.now() });

	// Cleanup old entries (prevent memory leak)
	if (companyContextCache.size > 100) {
		const now = Date.now();
		for (const [key, value] of companyContextCache) {
			if (now - value.timestamp > CONTEXT_CACHE_TTL_MS) {
				companyContextCache.delete(key);
			}
		}
	}
}

type PermissionMode =
	| "autonomous"
	| "ask_permission"
	| "manual_only"
	| "disabled";

interface AISettings {
	permission_mode: PermissionMode;
	action_permissions: Record<ToolCategory, PermissionMode>;
	can_make_calls: boolean;
	can_send_sms: boolean;
	can_send_emails: boolean;
	can_create_invoices: boolean;
	can_create_appointments: boolean;
	can_create_customers: boolean;
	can_update_customers: boolean;
	can_move_funds: boolean;
	can_manage_buckets: boolean;
	max_transaction_amount: number;
	proactive_customer_outreach: boolean;
	proactive_financial_advice: boolean;
	proactive_scheduling_suggestions: boolean;
	company_context: string | null;
	custom_system_prompt: string | null;
	preferred_model: string;
	model_temperature: number;
	// New capability flags for expanded tools
	can_email_team: boolean;
	can_sms_team: boolean;
	can_email_vendors: boolean;
	can_sms_vendors: boolean;
	can_schedule_reminders: boolean;
	can_access_detailed_reports: boolean;
	can_access_properties: boolean;
	can_access_equipment: boolean;
}

async function getAISettings(companyId: string): Promise<AISettings | null> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		console.warn("[AI Chat API] Service client not configured, skipping AI settings");
		return null;
	}
	const { data } = await supabase
		.from("ai_agent_settings")
		.select("*")
		.eq("company_id", companyId)
		.single();

	return data as AISettings | null;
}

async function getCompanyContext(companyId: string): Promise<string> {
	// Check cache first (saves ~10 DB queries per cached hit)
	const cached = getCachedContext(companyId);
	if (cached) {
		return cached;
	}

	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return "## Company Context\nService client not configured - company context unavailable.";
	}

	// Get comprehensive business context in parallel
	// Using head: true for count-only queries to minimize data transfer
	const [
		companyResult,
		customerResult,
		teamResult,
		vendorResult,
		jobResult,
		invoiceResult,
		overdueInvoiceResult,
		appointmentResult,
		equipmentResult,
		recentJobsResult,
	] = await Promise.all([
		// Company info
		supabase
			.from("companies")
			.select(
				"name, industry, phone, email, address, city, state, zip_code, website, timezone, business_hours",
			)
			.eq("id", companyId)
			.single(),
		// Active customers count (head: true = no data transfer, only count)
		supabase
			.from("customers")
			.select("id", { count: "exact", head: true })
			.eq("company_id", companyId)
			.eq("status", "active"),
		// Team members count by role
		supabase
			.from("profiles")
			.select("id, role")
			.eq("company_id", companyId),
		// Vendors count (head: true = no data transfer, only count)
		supabase
			.from("vendors")
			.select("id", { count: "exact", head: true })
			.eq("company_id", companyId)
			.eq("is_active", true),
		// Jobs by status (limit to prevent fetching thousands)
		supabase
			.from("jobs")
			.select("id, status")
			.eq("company_id", companyId)
			.in("status", ["pending", "in_progress", "scheduled"])
			.limit(500),
		// Invoices summary (limit to prevent fetching thousands)
		supabase
			.from("invoices")
			.select("id, status, total_amount")
			.eq("company_id", companyId)
			.in("status", ["draft", "sent", "pending"])
			.limit(500),
		// Overdue invoices (limit for performance)
		supabase
			.from("invoices")
			.select("id, total_amount, due_date")
			.eq("company_id", companyId)
			.eq("status", "pending")
			.lt("due_date", new Date().toISOString())
			.limit(100),
		// Today's appointments
		supabase
			.from("appointments")
			.select("id, status")
			.eq("company_id", companyId)
			.gte("scheduled_start", new Date().toISOString().split("T")[0])
			.lt(
				"scheduled_start",
				new Date(Date.now() + 86400000).toISOString().split("T")[0],
			),
		// Equipment needing maintenance
		supabase
			.from("equipment")
			.select("id, next_service_date")
			.eq("company_id", companyId)
			.lt(
				"next_service_date",
				new Date(Date.now() + 30 * 86400000).toISOString(),
			),
		// Recent completed jobs (last 30 days for revenue estimate)
		supabase
			.from("jobs")
			.select("id, total_amount")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("completed_at", new Date(Date.now() - 30 * 86400000).toISOString())
			.limit(500),
	]);

	const company = companyResult.data;
	const customerCount = customerResult.count || 0;
	const teamMembers = teamResult.data || [];
	const vendorCount = vendorResult.count || 0;
	const activeJobs = jobResult.data || [];
	const pendingInvoices = invoiceResult.data || [];
	const overdueInvoices = overdueInvoiceResult.data || [];
	const todayAppointments = appointmentResult.data || [];
	const maintenanceDue = equipmentResult.data || [];
	const recentJobs = recentJobsResult.data || [];

	// Calculate team breakdown
	const teamByRole = teamMembers.reduce(
		(acc: Record<string, number>, member) => {
			const role = member.role || "staff";
			acc[role] = (acc[role] || 0) + 1;
			return acc;
		},
		{},
	);

	// Calculate job breakdown
	const jobsByStatus = activeJobs.reduce((acc: Record<string, number>, job) => {
		acc[job.status] = (acc[job.status] || 0) + 1;
		return acc;
	}, {});

	// Calculate financial metrics
	const pendingInvoiceTotal = pendingInvoices.reduce(
		(sum, inv) => sum + (inv.total_amount || 0),
		0,
	);
	const overdueTotal = overdueInvoices.reduce(
		(sum, inv) => sum + (inv.total_amount || 0),
		0,
	);
	const monthlyRevenue = recentJobs.reduce(
		(sum, job) => sum + (job.total_amount || 0),
		0,
	);

	// Format currency helper
	const formatCurrency = (cents: number) =>
		`$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

	const context = `
## Company Information
- Name: ${company?.name || "Unknown"}
- Industry: ${company?.industry || "Service Business"}
- Phone: ${company?.phone || "Not configured"}
- Email: ${company?.email || "Not configured"}
- Location: ${company?.city ? `${company.city}, ${company.state} ${company.zip_code}` : "Not configured"}
- Timezone: ${company?.timezone || "America/New_York"}

## Team Overview
- Total Team Members: ${teamMembers.length}
${Object.entries(teamByRole)
	.map(
		([role, count]) =>
			`- ${role.charAt(0).toUpperCase() + role.slice(1)}s: ${count}`,
	)
	.join("\n")}

## Business Metrics (Current)
- Active Customers: ${customerCount}
- Active Vendors: ${vendorCount}
- Active Jobs: ${activeJobs.length} (${
		Object.entries(jobsByStatus)
			.map(([status, count]) => `${count} ${status}`)
			.join(", ") || "none"
	})
- Today's Appointments: ${todayAppointments.length}
- Equipment Needing Service (next 30 days): ${maintenanceDue.length}

## Financial Overview
- Pending Invoices: ${pendingInvoices.length} (${formatCurrency(pendingInvoiceTotal)})
- Overdue Invoices: ${overdueInvoices.length} (${formatCurrency(overdueTotal)})${overdueInvoices.length > 0 ? " ⚠️ ATTENTION NEEDED" : ""}
- Last 30 Days Revenue: ${formatCurrency(monthlyRevenue)}

## Important Alerts
${overdueInvoices.length > 0 ? `- ${overdueInvoices.length} overdue invoice(s) totaling ${formatCurrency(overdueTotal)} need attention` : ""}
${maintenanceDue.length > 0 ? `- ${maintenanceDue.length} piece(s) of equipment due for maintenance` : ""}
${jobsByStatus.pending ? `- ${jobsByStatus.pending} job(s) pending assignment` : ""}
${!overdueInvoices.length && !maintenanceDue.length && !jobsByStatus.pending ? "- No urgent issues at this time" : ""}
`;

	// Cache the context for subsequent requests (saves ~10 queries per cached hit)
	setCachedContext(companyId, context);

	return context;
}

function buildSystemPrompt(
	settings: AISettings | null,
	companyContext: string,
): string {
	const permissionMode = settings?.permission_mode || "ask_permission";
	const proactiveFeatures = [];

	if (settings?.proactive_customer_outreach)
		proactiveFeatures.push("customer outreach");
	if (settings?.proactive_financial_advice)
		proactiveFeatures.push("financial advice");
	if (settings?.proactive_scheduling_suggestions)
		proactiveFeatures.push("scheduling optimization");

	const permissionInstructions = {
		autonomous:
			"You can take actions directly without asking for permission. Execute tasks proactively to help the business.",
		ask_permission:
			"Always ask for confirmation before taking actions that modify data, send communications, or involve money. Explain what you plan to do and wait for approval.",
		manual_only:
			"Only respond to direct questions. Do not take any actions unless explicitly instructed by the user.",
		disabled:
			"You can only provide information and answer questions. You cannot execute any tools or take actions.",
	};

	return `You are an AI business manager assistant for a field service company. You act as a proactive manager helping owners and staff run their business efficiently.

${companyContext}

## Your Role
- Help manage customers, jobs, invoices, and communications
- Provide business insights and recommendations
- ${proactiveFeatures.length > 0 ? `Proactively assist with: ${proactiveFeatures.join(", ")}` : "Respond to user requests"}
- Be professional, helpful, and efficient

## Permission Level: ${permissionMode.toUpperCase()}
${permissionInstructions[permissionMode]}

## Available Capabilities
${
	settings
		? `
### Customer Communication
- Send Emails to Customers: ${settings.can_send_emails ? "Yes" : "No"}
- Send SMS to Customers: ${settings.can_send_sms ? "Yes" : "No"}
- Make Calls: ${settings.can_make_calls ? "Yes" : "No"}

### Team Communication
- Send Emails to Team: ${settings.can_email_team ? "Yes" : "No"}
- Send SMS to Team: ${settings.can_sms_team ? "Yes" : "No"}

### Vendor Communication
- Send Emails to Vendors: ${settings.can_email_vendors ? "Yes" : "No"}
- Send SMS to Vendors: ${settings.can_sms_vendors ? "Yes" : "No"}

### Scheduling & Reminders
- Create Appointments: ${settings.can_create_appointments ? "Yes" : "No"}
- Schedule Reminders: ${settings.can_schedule_reminders ? "Yes" : "No"}

### Financial
- Create Invoices: ${settings.can_create_invoices ? "Yes" : "No"}
- Move Funds: ${settings.can_move_funds ? "Yes (max $${(settings.max_transaction_amount / 100).toFixed(2)})" : "No"}

### Customer Management
- Create Customers: ${settings.can_create_customers ? "Yes" : "No"}
- Update Customers: ${settings.can_update_customers ? "Yes" : "No"}

### Data Access
- Access Properties: ${settings.can_access_properties ? "Yes" : "No"}
- Access Equipment: ${settings.can_access_equipment ? "Yes" : "No"}
- Detailed Reports (job costing, revenue breakdown, AR aging): ${settings.can_access_detailed_reports ? "Yes" : "No"}
`
		: "All capabilities available (default settings)"
}

## Guidelines
1. Always search for existing customers/jobs before creating new ones
2. Confirm customer details before sending communications
3. For financial actions, always explain the amounts involved
4. When scheduling, check availability first
5. Log all communications and actions taken
6. Provide proactive insights when relevant (overdue invoices, inactive customers, etc.)
7. Do NOT list database tables or perform schema introspection unless the user explicitly asks for it
8. Keep responses concise and focused on the user request; avoid verbose summaries
9. When a question needs current or external information, use the web search tools (webSearchTool/webSearchNewsTool/webSearchSiteTool) and cite the sources you used

## IMPORTANT: Destructive Action Approval
Certain actions are classified as "destructive" and REQUIRE owner approval before execution:
- Sending emails, SMS, or making calls to customers, team members, or vendors
- Creating invoices or moving funds
- Creating or modifying appointments
- Updating customer records

When you attempt these actions, they will be queued for owner review instead of executing immediately.
The system will show a notification that owner approval is required.
Once a company owner approves the action, it will be executed automatically.
If rejected, the action will not be executed and you'll be notified.
This is a security measure to prevent unauthorized communications or financial actions.

${settings?.custom_system_prompt ? `\n## Additional Instructions\n${settings.custom_system_prompt}` : ""}
${settings?.company_context ? `\n## Business Context\n${settings.company_context}` : ""}
`;
}

function filterToolsByPermissions(
	settings: AISettings | null,
): Record<string, (typeof aiAgentTools)[keyof typeof aiAgentTools]> {
	if (!settings) return aiAgentTools;

	const permissionMode = settings.permission_mode;
	if (permissionMode === "disabled") return {};

	const filteredTools: Record<
		string,
		(typeof aiAgentTools)[keyof typeof aiAgentTools]
	> = {};

	for (const [toolName, toolInstance] of Object.entries(aiAgentTools)) {
		const category = toolCategories[toolName];
		const categoryPermission =
			settings.action_permissions?.[category] || permissionMode;

		// Avoid noisy introspection tools unless explicitly requested
		if (toolName === "listDatabaseTables") continue;

		// Skip if category is disabled
		if (categoryPermission === "disabled") continue;

		// Check specific capability flags - Customer Communication
		if (toolName === "sendEmail" && !settings.can_send_emails) continue;
		if (toolName === "sendSms" && !settings.can_send_sms) continue;
		if (toolName === "initiateCall" && !settings.can_make_calls) continue;

		// Team Communication
		if (toolName === "sendTeamEmail" && !settings.can_email_team) continue;
		if (toolName === "sendTeamSms" && !settings.can_sms_team) continue;

		// Vendor Communication
		if (toolName === "sendVendorEmail" && !settings.can_email_vendors) continue;
		if (toolName === "sendVendorSms" && !settings.can_sms_vendors) continue;

		// Financial
		if (toolName === "createInvoice" && !settings.can_create_invoices) continue;
		if (toolName === "transferToBucket" && !settings.can_move_funds) continue;

		// Scheduling
		if (toolName === "createAppointment" && !settings.can_create_appointments)
			continue;

		// Customers
		if (toolName === "createCustomer" && !settings.can_create_customers)
			continue;
		if (toolName === "updateCustomer" && !settings.can_update_customers)
			continue;

		// Reminders/Notifications
		if (
			(toolName === "scheduleReminder" ||
				toolName === "cancelReminder" ||
				toolName === "sendImmediateNotification") &&
			!settings.can_schedule_reminders
		)
			continue;

		// Detailed Reports
		if (
			(toolName === "getJobCostingReport" ||
				toolName === "getRevenueBreakdown" ||
				toolName === "getARAgingReport" ||
				toolName === "getTeamPerformanceReport" ||
				toolName === "getCustomerLifetimeValue") &&
			!settings.can_access_detailed_reports
		)
			continue;

		// Property Access
		if (
			(toolName === "searchProperties" || toolName === "getPropertyDetails") &&
			!settings.can_access_properties
		)
			continue;

		// Equipment Access
		if (
			(toolName === "searchEquipment" || toolName === "getMaintenanceDue") &&
			!settings.can_access_equipment
		)
			continue;

		filteredTools[toolName] = toolInstance;
	}

	return filteredTools;
}

// Request action approval tool - used when permission mode is ask_permission
// AI SDK 6: parameters -> inputSchema
const requestApprovalTool = tool({
	description:
		"Request user approval before taking an action. Use this when you need permission to proceed.",
	inputSchema: z.object({
		action: z.string().describe("The action you want to take"),
		reason: z.string().describe("Why this action is beneficial"),
		details: z.string().describe("Specific details of what will happen"),
	}),
	execute: async ({ action, reason, details }) => {
		return {
			requiresApproval: true,
			action,
			reason,
			details,
			message: `I'd like to ${action}. ${reason}. This will: ${details}. Do you approve?`,
		};
	},
});

/**
 * Wrap destructive tools with owner approval interception
 * When a destructive tool is called, instead of executing it directly,
 * we create a pending action and return a message asking for owner approval.
 */
function wrapToolsWithApprovalCheck(
	tools: Record<string, (typeof aiAgentTools)[keyof typeof aiAgentTools]>,
	context: {
		companyId: string;
		userId: string;
		chatId: string;
		messageId: string;
	},
): Record<string, (typeof aiAgentTools)[keyof typeof aiAgentTools]> {
	const wrappedTools: Record<
		string,
		(typeof aiAgentTools)[keyof typeof aiAgentTools]
	> = {};

	for (const [toolName, toolInstance] of Object.entries(tools)) {
		// Check if this tool is destructive and requires owner approval
		const metadata = getDestructiveToolMetadata(toolName);

		if (metadata && metadata.requiresOwnerApproval) {
			// Wrap the tool to intercept and require approval
			// AI SDK 6: parameters -> inputSchema, and access toolInstance.inputSchema
			const toolSchema = "inputSchema" in toolInstance ? toolInstance.inputSchema : (toolInstance as { parameters?: unknown }).parameters;
			wrappedTools[toolName] = tool({
				description: toolInstance.description,
				inputSchema: toolSchema,
				execute: async (args: Record<string, unknown>) => {
					// Intercept the tool call and create a pending action
					const interception = await shouldInterceptTool(toolName, args, {
						companyId: context.companyId,
						chatId: context.chatId,
						messageId: context.messageId,
						userId: context.userId,
					});

					if (interception.intercept) {
						if (interception.error) {
							return {
								success: false,
								requiresOwnerApproval: true,
								error: interception.error,
								message: `Failed to create approval request: ${interception.error}`,
							};
						}

						// Return a message indicating approval is needed
						return {
							success: false,
							requiresOwnerApproval: true,
							pendingActionId: interception.pendingActionId,
							riskLevel: metadata.riskLevel,
							actionType: metadata.actionType,
							message: `⚠️ This action requires owner approval before it can be executed.

**Action:** ${metadata.description}
**Risk Level:** ${metadata.riskLevel.toUpperCase()}
**Affected:** ${metadata.affectedEntityType}

The action has been queued for owner review. Once a company owner approves this action, it will be executed automatically.

Pending Action ID: ${interception.pendingActionId}`,
						};
					}

					// If no interception needed, execute the original tool
					// (This shouldn't happen for destructive tools, but fallback just in case)
					if (typeof toolInstance.execute === "function") {
						return await toolInstance.execute(args);
					}

					return { success: false, error: "Tool execution not available" };
				},
			}) as (typeof aiAgentTools)[keyof typeof aiAgentTools];
		} else {
			// Non-destructive tools pass through unchanged
			wrappedTools[toolName] = toolInstance;
		}
	}

	return wrappedTools;
}

export async function POST(req: Request) {
	try {
		const {
			messages,
			companyId: providedCompanyId,
			userId: providedUserId,
			chatId: providedChatId,
			model: requestedModel,
		} = await req.json();

		if (!(messages && Array.isArray(messages))) {
			return Response.json({ error: "Messages are required" }, { status: 400 });
		}

		console.log("[AI Chat API] Received request:", {
			messageCount: messages.length,
			companyId: providedCompanyId,
			chatId: providedChatId,
			model: requestedModel,
		});

		// Get company ID from auth or use provided (for demo)
		let companyId = providedCompanyId || process.env.DEFAULT_COMPANY_ID;
		if (!companyId) {
			// Fallback to active company cookie if available
			try {
				const { getActiveCompanyId } = await import("@/lib/auth/company-context");
				companyId = (await getActiveCompanyId()) || companyId;
			} catch (err) {
				console.warn("[AI Chat API] Unable to read active company:", err);
			}
		}

		if (!companyId) {
			return Response.json({ error: "Company ID required" }, { status: 400 });
		}

		// Get user ID (required for destructive action tracking)
		const userId = providedUserId || "anonymous";

		// Get or generate chat ID
		const chatId = providedChatId || crypto.randomUUID();

		// Generate a unique message ID for this request
		const messageId = crypto.randomUUID();

		// Load AI settings and company context
		const [settings, companyContext, supabase] = await Promise.all([
			getAISettings(companyId),
			getCompanyContext(companyId),
			createServiceSupabaseClient(),
		]);

		// === MESSAGE PERSISTENCE: Ensure chat exists and save user message ===
		// Get the last user message (the new one being sent)
		const lastMessage = messages[messages.length - 1];
		const isNewUserMessage = lastMessage?.role === "user";
		const userMessageContent = isNewUserMessage
			? (typeof lastMessage.content === "string"
					? lastMessage.content
					: lastMessage.parts?.[0]?.text || "")
			: "";

		// Ensure chat exists (creates if new)
		const chatResult = await ensureChat(
			supabase,
			chatId,
			userId,
			companyId,
			userMessageContent,
		);

		// Save the new user message if this is a new message AND persistence is possible
		if (isNewUserMessage && supabase && chatResult.canPersist) {
			const parts = lastMessage.parts
				? lastMessage.parts
				: convertToMessageParts(lastMessage.content);
			const savedId = await saveMessage(supabase, chatId, "user", parts, lastMessage.attachments || []);
			if (savedId) {
				console.log("[AI Chat API] Saved user message:", savedId);
			}
		}

		// Build system prompt based on settings
		const systemPrompt = buildSystemPrompt(settings, companyContext);

		// Filter tools based on permissions
		let availableTools = filterToolsByPermissions(settings);

		// Wrap destructive tools with owner approval interception
		// This ensures ALL destructive actions require owner approval before execution
		availableTools = wrapToolsWithApprovalCheck(availableTools, {
			companyId,
			userId,
			chatId,
			messageId,
		});

		// Add approval tool if in ask_permission mode
		if (settings?.permission_mode === "ask_permission") {
			availableTools.requestApproval = requestApprovalTool;
		}

		// Determine model and provider - Groq only
		const temperature = settings?.model_temperature || 0.7;

		// Use Groq exclusively (free with tools)
		const defaultModel = process.env.AI_DEFAULT_MODEL || "llama-3.1-8b-instant";
		const modelId = requestedModel || settings?.preferred_model || defaultModel;
		const provider: AIProvider = "groq";

		console.log("[AI Chat API] Using model:", modelId, "provider:", provider);

		// Create model instance using Groq
		const model = createAIProvider({ provider, model: modelId });

	// Create tool context with company ID
	const toolContext = { companyId };

	// Convert messages to ModelMessage format for streamText
	// AI SDK v5: UIMessage has 'parts' array, ModelMessage has 'content' string
		// Handle both formats for backward compatibility and direct API calls
		let modelMessages;
		const isUIMessageFormat = messages[0]?.parts !== undefined;

		if (isUIMessageFormat) {
			// UIMessage format from useChat hook - convert to ModelMessage
			modelMessages = convertToModelMessages(messages);
			// Strip tool invocations from prior assistant messages to avoid malformed tool_calls
			modelMessages = modelMessages.map((m: any) => {
				if (m.role === "assistant") {
					delete m.toolInvocations;
				}
				return m;
			});
		} else {
			// Already in simple/ModelMessage format (role + content) - use as-is
			modelMessages = messages.map((msg: { role: string; content: string }) => ({
				role: msg.role as "user" | "assistant" | "system",
				content: msg.content,
			}));
		}

		// Drop tool role messages entirely (Groq requires tool_calls with arguments, which we don't persist in history)
		modelMessages = modelMessages.filter(
			(m: any) => m.role !== "tool" && m.role !== "function"
		);

		console.log("[AI Chat API] Processed messages:", {
			originalFormat: isUIMessageFormat ? "UIMessage (parts)" : "ModelMessage (content)",
			convertedCount: modelMessages.length,
		});

		// Groq supports tools with llama-3.3-70b-versatile model
		const shouldDisableTools = false;

	// Build the streamText configuration
	const streamConfig: Parameters<typeof streamText>[0] = {
		model,
		messages: modelMessages,
		temperature,
		system: systemPrompt,
		maxOutputTokens: 512, // keep replies concise and reduce latency
	};

	// Enable tools - Groq with llama-3.3-70b-versatile supports tools
	if (!shouldDisableTools) {
		streamConfig.tools = availableTools;
		streamConfig.stopWhen = stepCountIs(5); // Reduced from 10 to lower AI costs
		streamConfig.maxToolRoundtrips = 2; // cap tool loops to improve response time
	}

	// Stream the response with retry-on-rate-limit (fallback to smaller model)
	const aiStartTime = Date.now();
	const runStream = async (modelOverride?: string) => {
		if (modelOverride) {
			console.warn("[AI Chat API] Falling back to model:", modelOverride);
			streamConfig.model = createAIProvider({ provider, model: modelOverride });
		}

		return streamText({
			...streamConfig,
			// === AI SDK 6 BEST PRACTICE: Handle streaming errors ===
			onError: (event) => {
				console.error("[AI Chat API] Stream error:", {
					error: event.error,
					message: (event.error as any)?.message,
					stack: (event.error as any)?.stack,
					name: (event.error as any)?.name,
					modelMessages: modelMessages,
				});
				// Track failed API call
				trackExternalApiCall({
					apiName: "groq",
					endpoint: `chat.${modelOverride || modelId}`,
					companyId,
					success: false,
					responseTimeMs: Date.now() - aiStartTime,
					estimatedCostCents: 0,
					errorMessage: event.error instanceof Error ? event.error.message : String(event.error),
				}).catch(() => {});
			},
			// === AI SDK 6 BEST PRACTICE: Track individual chunks for debugging ===
			onChunk: (event) => {
				// Log tool calls as they stream in for better debugging
				if (event.chunk.type === "tool-call") {
					console.log("[AI Chat API] Tool call started:", event.chunk.toolName);
				}
			},
			onToolCall: (event) => {
				console.log("[AI Chat API] Tool call event:", {
					name: event.toolName,
					callId: event.toolCallId,
				});
			},
			onToolResult: (event) => {
				console.log("[AI Chat API] Tool result event:", {
					callId: event.toolCallId,
					hasResult: !!event.result,
				});
			},
			// === MESSAGE PERSISTENCE: Save assistant response when complete ===
			onFinish: async ({ text, toolCalls, toolResults, usage }) => {
				// Track AI API usage for admin dashboard
				const responseTimeMs = Date.now() - aiStartTime;
				const totalTokens = (usage?.promptTokens || 0) + (usage?.completionTokens || 0);

				// Groq is free tier - no cost
				const estimatedCostCents = 0;

				// Track the API call (fire-and-forget)
				trackExternalApiCall({
					apiName: "groq",
					endpoint: `chat.${modelOverride || modelId}`,
					companyId,
					success: true,
					responseTimeMs,
					estimatedCostCents,
				}).catch(() => {});

				// Save the assistant's response to messages_v2 (only if persistence is possible)
				if (text && supabase && chatResult.canPersist) {
					// Build parts array with text and any tool calls/results
					const parts: MessagePart[] = [];

					// Add text content
					if (text) {
						parts.push({ type: "text", text });
					}

					// Add tool calls and results if any
					if (toolCalls && toolCalls.length > 0) {
						for (const call of toolCalls) {
							const toolName = "toolName" in call ? call.toolName : (call as { name?: string }).name || "unknown";
							const toolInput = "input" in call ? call.input : ("args" in call ? (call as { args?: unknown }).args : null);

							parts.push({
								type: "tool-invocation",
								toolName,
								toolCallId: call.toolCallId,
								args: toolInput,
							});

							// Find and add the result
							const resultData = toolResults?.find((r) => r.toolCallId === call.toolCallId);
							if (resultData) {
								const toolOutput = "output" in resultData ? resultData.output : (resultData as { result?: unknown })?.result;
								parts.push({
									type: "tool-result",
									toolCallId: call.toolCallId,
									result: toolOutput,
								});
							}
						}
					}

					const savedId = await saveMessage(supabase, chatId, "assistant", parts, []);
					if (savedId) {
						console.log("[AI Chat API] Saved assistant message:", savedId);
					}
				}
			},
			onStepFinish: async ({ toolCalls, toolResults }) => {
				// Log AI actions to the database
				if (toolCalls && toolCalls.length > 0) {
					const supabase = await createServiceSupabaseClient();
					if (!supabase) {
						console.warn("[AI Chat API] Service client not configured, skipping action log");
						return;
					}
					for (const call of toolCalls) {
						// AI SDK v5: toolName may be on different property, check for dynamic tools
						const toolName = "toolName" in call ? call.toolName : (call as { name?: string }).name || "unknown";
						const category = toolCategories[toolName] || "system";

						// AI SDK v5: args is now input
						const toolInput = "input" in call ? call.input : ("args" in call ? (call as { args?: unknown }).args : null);

						const result = toolResults?.find(
							(r) => r.toolCallId === call.toolCallId,
						);

						// AI SDK v5: result.result is now result.output
						const toolOutput = result && "output" in result ? result.output : (result as { result?: unknown })?.result;
						const isSuccess = toolOutput && typeof toolOutput === "object" && "success" in toolOutput ? (toolOutput as { success?: boolean }).success : false;

						await supabase.from("ai_action_log").insert({
							company_id: companyId,
							action_type: category,
							action_name: toolName,
							action_description: JSON.stringify(toolInput),
							permission_mode: settings?.permission_mode || "ask_permission",
							permission_requested:
								settings?.permission_mode === "ask_permission",
							permission_granted: settings?.permission_mode === "autonomous",
							status: isSuccess ? "executed" : "failed",
							input_data: toolInput,
							output_data: toolOutput,
							executed_at: new Date().toISOString(),
						});
					}
				}
			},
		});
	};

	let result;
	try {
		result = await runStream();
	} catch (error: any) {
		const message = error?.message || "";
		const isRateLimit = message.includes("rate limit") || message.includes("Rate limit");

		if (isRateLimit && modelId !== "llama-3.1-8b-instant") {
			result = await runStream("llama-3.1-8b-instant");
		} else {
			throw error;
		}
	}

	// AI SDK v5: Use toUIMessageStreamResponse for full-featured streaming with tools
	return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("[AI Chat API] Error:", error);

		// Provide more detailed error info for debugging
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		const errorName = error instanceof Error ? error.name : "UnknownError";

		return Response.json(
			{
				error: errorMessage,
				errorType: errorName,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
