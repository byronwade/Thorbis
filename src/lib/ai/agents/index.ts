/**
 * Multi-Agent Orchestration System
 *
 * Specialized AI agents for Stratos field service management:
 * - Triage Agent: Routes requests to specialized agents
 * - Customer Agent: Customer management and communication
 * - Scheduling Agent: Job scheduling and dispatch
 * - Financial Agent: Invoices, payments, and estimates
 * - Communication Agent: Email, SMS, and internal messaging
 *
 * Uses @ai-sdk-tools/agents for automatic handoffs and routing
 */

import { Agent, handoff, type AgentConfig } from "@ai-sdk-tools/agents";
import { createAnthropic } from "@ai-sdk/anthropic";
import { tool } from "ai";
import { z } from "zod";
import {
	createSupabaseMemoryProvider,
	DEFAULT_WORKING_MEMORY_TEMPLATE,
} from "../memory-provider";
import {
	// Memory tools
	storeMemoryTool,
	searchMemoriesTool,
	getEntityMemoriesTool,
	recallContextTool,
	// Communication learning tools
	searchCommunicationsFullTextTool,
	getCallTranscriptTool,
	searchVoicemailTranscriptsTool,
	getCustomerCommunicationHistoryTool,
	extractCommunicationInsightsTool,
	// External data tools
	getWeatherForLocationTool,
	checkWeatherForJobTool,
	getWeatherAlertsTool,
	getTrafficConditionsTool,
	geocodeAddressTool,
	getPropertyConditionsTool,
	// Code search tools
	searchBuildingCodesTool,
	getPermitRequirementsTool,
	getCodeComplianceChecklistTool,
	// Proactive learning tools
	analyzeRecentCommunicationsTool,
	learnFromCompletedJobsTool,
	buildCustomerProfileTool,
	// Route optimization tools
	getRouteTool,
	findNearbySuppliersTool,
	// Inventory & parts tools
	searchInventoryTool,
	checkPartsAvailabilityTool,
	getLowStockAlertsTool,
	// Equipment history tools
	getPropertyEquipmentTool,
	getEquipmentServiceHistoryTool,
	checkEquipmentWarrantyTool,
	// Technician matching tools
	findTechniciansBySkillsTool,
	getTechnicianWorkloadTool,
	// Pricing & estimation tools
	searchPriceBookTool,
	calculateEstimateTool,
	// Smart scheduling tools
	suggestTechnicianForJobTool,
	optimizeJobOrderTool,
} from "../agent-tools";

// Initialize Anthropic provider
const anthropic = createAnthropic();
const claudeSonnet = anthropic("claude-sonnet-4-20250514");

/**
 * Create the multi-agent system for a company
 *
 * @param companyId - The company ID to scope all operations
 * @returns The triage agent that orchestrates all specialized agents
 *
 * @example
 * ```ts
 * import { createAgentSystem } from '@/lib/ai/agents';
 *
 * const triageAgent = createAgentSystem(companyId);
 *
 * // In API route:
 * return triageAgent.toUIMessageStream({
 *   message: userMessage,
 *   context: { userId, companyId }
 * });
 * ```
 */
export function createAgentSystem(companyId: string) {
	const memoryProvider = createSupabaseMemoryProvider(companyId);

	// Shared memory config
	const memoryConfig = {
		provider: memoryProvider,
		workingMemory: {
			enabled: true,
			scope: "chat" as const,
			template: DEFAULT_WORKING_MEMORY_TEMPLATE,
		},
		history: {
			enabled: true,
			limit: 20,
		},
		chats: {
			enabled: true,
			generateTitle: true,
		},
	};

	// Customer Agent - handles customer lookups, updates, and management
	const customerAgent = Agent.create({
		name: "customer-agent",
		model: claudeSonnet,
		instructions: `You are a Customer Management specialist for a field service company.

Your responsibilities:
- Look up customer information and history
- Update customer details (contact info, preferences)
- View customer's jobs, invoices, and service history
- Add notes to customer profiles
- Link communications to customers

Always be helpful and provide complete information about customers.
When updating customer data, confirm the changes with the user.`,
		handoffDescription:
			"Handles customer lookups, profile updates, and customer history",
		matchOn: [
			"customer",
			"client",
			"profile",
			"contact",
			/look.*up.*customer/i,
			/customer.*history/i,
			/update.*customer/i,
		],
		tools: {
			searchCustomers: tool({
				description: "Search for customers by name, email, phone, or address",
				parameters: z.object({
					query: z.string().describe("Search query"),
					limit: z.number().optional().default(10),
				}),
				execute: async ({ query, limit }) => {
					// Tool implementation would query the database
					return { message: `Searching customers for: ${query}`, limit };
				},
			}),
			getCustomerDetails: tool({
				description: "Get detailed information about a specific customer",
				parameters: z.object({
					customerId: z.string().describe("Customer UUID"),
				}),
				execute: async ({ customerId }) => {
					return { message: `Getting details for customer: ${customerId}` };
				},
			}),
			updateCustomer: tool({
				description: "Update customer information",
				parameters: z.object({
					customerId: z.string(),
					updates: z.object({
						name: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						address: z.string().optional(),
					}),
				}),
				execute: async ({ customerId, updates }) => {
					return {
						message: `Updated customer ${customerId}`,
						updates,
					};
				},
			}),
			// Memory tools for customer-specific memories
			storeMemory: storeMemoryTool,
			searchMemories: searchMemoriesTool,
			getEntityMemories: getEntityMemoriesTool,
			// Communication history tools
			getCustomerCommunicationHistory: getCustomerCommunicationHistoryTool,
			searchCommunications: searchCommunicationsFullTextTool,
			getCallTranscript: getCallTranscriptTool,
			// Profile building
			buildCustomerProfile: buildCustomerProfileTool,
			// Equipment history tools
			getPropertyEquipment: getPropertyEquipmentTool,
			getEquipmentServiceHistory: getEquipmentServiceHistoryTool,
			checkEquipmentWarranty: checkEquipmentWarrantyTool,
		},
		memory: memoryConfig,
	});

	// Scheduling Agent - handles job scheduling and dispatch
	const schedulingAgent = Agent.create({
		name: "scheduling-agent",
		model: claudeSonnet,
		instructions: `You are a Scheduling and Dispatch specialist for a field service company.

Your responsibilities:
- Schedule new jobs and appointments
- Reschedule existing jobs
- View technician availability
- Assign jobs to technicians
- Manage the dispatch board
- Handle scheduling conflicts

Consider technician skills, location, and availability when scheduling.
Always confirm scheduling changes with the user.`,
		handoffDescription:
			"Handles job scheduling, technician dispatch, and calendar management",
		matchOn: [
			"schedule",
			"appointment",
			"dispatch",
			"availability",
			"calendar",
			/schedule.*job/i,
			/reschedule/i,
			/available.*tech/i,
			/assign.*job/i,
		],
		tools: {
			getAvailability: tool({
				description: "Get technician availability for a date range",
				parameters: z.object({
					startDate: z.string().describe("Start date (ISO format)"),
					endDate: z.string().describe("End date (ISO format)"),
					technicianId: z.string().optional(),
				}),
				execute: async ({ startDate, endDate, technicianId }) => {
					return {
						message: `Getting availability from ${startDate} to ${endDate}`,
						technicianId,
					};
				},
			}),
			scheduleJob: tool({
				description: "Schedule a new job or appointment",
				parameters: z.object({
					customerId: z.string(),
					propertyId: z.string().optional(),
					scheduledDate: z.string(),
					scheduledTime: z.string(),
					duration: z.number().describe("Duration in minutes"),
					technicianId: z.string().optional(),
					jobType: z.string(),
					notes: z.string().optional(),
				}),
				execute: async (params) => {
					return { message: "Job scheduled", ...params };
				},
			}),
			rescheduleJob: tool({
				description: "Reschedule an existing job",
				parameters: z.object({
					jobId: z.string(),
					newDate: z.string(),
					newTime: z.string(),
					reason: z.string().optional(),
				}),
				execute: async ({ jobId, newDate, newTime, reason }) => {
					return {
						message: `Rescheduled job ${jobId} to ${newDate} at ${newTime}`,
						reason,
					};
				},
			}),
			// Weather and traffic tools for scheduling decisions
			getWeather: getWeatherForLocationTool,
			checkWeatherForJob: checkWeatherForJobTool,
			getWeatherAlerts: getWeatherAlertsTool,
			getTrafficConditions: getTrafficConditionsTool,
			getPropertyConditions: getPropertyConditionsTool,
			geocodeAddress: geocodeAddressTool,
			// Job analysis for scheduling optimization
			learnFromCompletedJobs: learnFromCompletedJobsTool,
			// Route optimization tools
			getRoute: getRouteTool,
			findNearbySuppliers: findNearbySuppliersTool,
			// Technician matching and workload
			findTechniciansBySkills: findTechniciansBySkillsTool,
			getTechnicianWorkload: getTechnicianWorkloadTool,
			// Smart scheduling tools
			suggestTechnicianForJob: suggestTechnicianForJobTool,
			optimizeJobOrder: optimizeJobOrderTool,
		},
		memory: memoryConfig,
	});

	// Financial Agent - handles invoices, payments, and estimates
	const financialAgent = Agent.create({
		name: "financial-agent",
		model: claudeSonnet,
		instructions: `You are a Financial Operations specialist for a field service company.

Your responsibilities:
- Create and send invoices
- Track payments and payment status
- Create estimates and quotes
- View financial reports
- Handle payment reminders
- Manage payment plans

Always be precise with financial amounts and dates.
Confirm all financial transactions with the user before executing.`,
		handoffDescription:
			"Handles invoices, payments, estimates, and financial reporting",
		matchOn: [
			"invoice",
			"payment",
			"estimate",
			"quote",
			"billing",
			"financial",
			"money",
			/create.*invoice/i,
			/send.*invoice/i,
			/payment.*status/i,
			/create.*estimate/i,
		],
		tools: {
			createInvoice: tool({
				description: "Create a new invoice for a customer",
				parameters: z.object({
					customerId: z.string(),
					jobId: z.string().optional(),
					lineItems: z.array(
						z.object({
							description: z.string(),
							quantity: z.number(),
							unitPrice: z.number(),
						})
					),
					dueDate: z.string().optional(),
				}),
				execute: async (params) => {
					const total = params.lineItems.reduce(
						(sum, item) => sum + item.quantity * item.unitPrice,
						0
					);
					return { message: "Invoice created", total, ...params };
				},
			}),
			getPaymentStatus: tool({
				description: "Get payment status for an invoice",
				parameters: z.object({
					invoiceId: z.string(),
				}),
				execute: async ({ invoiceId }) => {
					return { message: `Payment status for invoice ${invoiceId}` };
				},
			}),
			createEstimate: tool({
				description: "Create a new estimate/quote",
				parameters: z.object({
					customerId: z.string(),
					propertyId: z.string().optional(),
					lineItems: z.array(
						z.object({
							description: z.string(),
							quantity: z.number(),
							unitPrice: z.number(),
						})
					),
					validDays: z.number().optional().default(30),
				}),
				execute: async (params) => {
					const total = params.lineItems.reduce(
						(sum, item) => sum + item.quantity * item.unitPrice,
						0
					);
					return { message: "Estimate created", total, ...params };
				},
			}),
			sendPaymentReminder: tool({
				description: "Send a payment reminder for an overdue invoice",
				parameters: z.object({
					invoiceId: z.string(),
					reminderType: z
						.enum(["friendly", "urgent", "final"])
						.default("friendly"),
				}),
				execute: async ({ invoiceId, reminderType }) => {
					return {
						message: `${reminderType} reminder sent for invoice ${invoiceId}`,
					};
				},
			}),
			// Pricing & estimation tools
			searchPriceBook: searchPriceBookTool,
			calculateEstimate: calculateEstimateTool,
		},
		memory: memoryConfig,
	});

	// Communication Agent - handles email, SMS, and messaging
	const communicationAgent = Agent.create({
		name: "communication-agent",
		model: claudeSonnet,
		instructions: `You are a Communication specialist for a field service company.

Your responsibilities:
- Draft and send emails to customers
- Send SMS notifications
- Manage internal team messages
- Handle appointment reminders
- Create communication templates

Always maintain a professional tone appropriate for the business.
Confirm message content before sending.`,
		handoffDescription:
			"Handles email, SMS, and internal communications",
		matchOn: [
			"email",
			"sms",
			"text",
			"message",
			"send",
			"notify",
			"reminder",
			/send.*email/i,
			/send.*text/i,
			/notify.*customer/i,
			/draft.*message/i,
		],
		tools: {
			sendEmail: tool({
				description: "Send an email to a customer",
				parameters: z.object({
					recipientEmail: z.string().email(),
					subject: z.string(),
					body: z.string(),
					customerId: z.string().optional(),
				}),
				execute: async (params) => {
					return { message: "Email sent", ...params };
				},
			}),
			sendSMS: tool({
				description: "Send an SMS message",
				parameters: z.object({
					phoneNumber: z.string(),
					message: z.string().max(160),
					customerId: z.string().optional(),
				}),
				execute: async (params) => {
					return { message: "SMS sent", ...params };
				},
			}),
			draftMessage: tool({
				description:
					"Draft a message without sending (for user review)",
				parameters: z.object({
					type: z.enum(["email", "sms"]),
					purpose: z.string().describe("Purpose of the message"),
					customerName: z.string().optional(),
					additionalContext: z.string().optional(),
				}),
				execute: async ({ type, purpose, customerName, additionalContext }) => {
					return {
						message: "Draft created",
						type,
						purpose,
						customerName,
						additionalContext,
					};
				},
			}),
			scheduleReminder: tool({
				description: "Schedule an automated reminder",
				parameters: z.object({
					type: z.enum(["appointment", "payment", "followup"]),
					recipientId: z.string(),
					sendAt: z.string().describe("When to send (ISO format)"),
					channel: z.enum(["email", "sms", "both"]).default("email"),
				}),
				execute: async (params) => {
					return { message: "Reminder scheduled", ...params };
				},
			}),
		},
		memory: memoryConfig,
	});

	// Triage Agent - orchestrates all specialized agents
	const triageAgent = Agent.create({
		name: "triage-agent",
		model: claudeSonnet,
		instructions: (context) => `You are Stratos AI, an intelligent assistant for a field service management company.

You orchestrate a team of specialized agents to help with:
- **Customer Agent**: Customer lookups, profile updates, service history, communication history
- **Scheduling Agent**: Job scheduling, technician dispatch, weather/traffic conditions
- **Financial Agent**: Invoices, payments, estimates, billing
- **Communication Agent**: Email, SMS, notifications, reminders

Your role:
1. Understand the user's request
2. Route to the appropriate specialist agent
3. For general questions or multi-domain requests, handle directly
4. Provide helpful, accurate responses

**Memory Capabilities**:
- Use \`recallContext\` at conversation start to get relevant background information
- Use \`searchMemories\` to find facts/preferences about customers, jobs, or properties
- Use \`storeMemory\` to remember important facts (customer preferences, service notes, etc.)
- Use \`getEntityMemories\` to retrieve all stored info about a specific customer/job

**Code & Permit Knowledge**:
- Use \`searchBuildingCodes\` to look up code requirements (plumbing, electrical, HVAC, roofing)
- Use \`getPermitRequirements\` to determine if permits are needed for specific work
- Use \`getCodeComplianceChecklist\` to generate checklists for jobs

**Learning & Insights**:
- Use \`analyzeRecentCommunications\` to extract insights from customer interactions
- Use \`learnFromCompletedJobs\` to improve scheduling recommendations
- Use \`extractCommunicationInsights\` to find customer preferences and issues
- Use \`searchVoicemails\` to search voicemail transcriptions

Always be friendly, professional, and efficient.
If a request spans multiple domains, coordinate between agents.
Proactively use memory tools to provide personalized, context-aware assistance.
Use code search tools to provide accurate technical guidance to technicians.

Current context: ${JSON.stringify(context || {})}`,
		handoffs: [
			handoff(customerAgent, {
				onHandoff: async (ctx) => {
					console.log("Handing off to customer agent", ctx);
				},
			}),
			handoff(schedulingAgent, {
				onHandoff: async (ctx) => {
					console.log("Handing off to scheduling agent", ctx);
				},
			}),
			handoff(financialAgent, {
				onHandoff: async (ctx) => {
					console.log("Handing off to financial agent", ctx);
				},
			}),
			handoff(communicationAgent, {
				onHandoff: async (ctx) => {
					console.log("Handing off to communication agent", ctx);
				},
			}),
		],
		tools: {
			getCompanyOverview: tool({
				description: "Get a quick overview of company metrics",
				parameters: z.object({}),
				execute: async () => {
					return {
						message: "Company overview retrieved",
						metrics: {
							activeJobs: 0,
							pendingInvoices: 0,
							upcomingAppointments: 0,
						},
					};
				},
			}),
			// Memory tools for long-term semantic memory
			storeMemory: storeMemoryTool,
			searchMemories: searchMemoriesTool,
			getEntityMemories: getEntityMemoriesTool,
			recallContext: recallContextTool,
			// Code search tools for technical guidance
			searchBuildingCodes: searchBuildingCodesTool,
			getPermitRequirements: getPermitRequirementsTool,
			getCodeComplianceChecklist: getCodeComplianceChecklistTool,
			// Proactive learning tools
			analyzeRecentCommunications: analyzeRecentCommunicationsTool,
			learnFromCompletedJobs: learnFromCompletedJobsTool,
			// Communication insight extraction
			extractCommunicationInsights: extractCommunicationInsightsTool,
			searchVoicemails: searchVoicemailTranscriptsTool,
			// Inventory & parts tools
			searchInventory: searchInventoryTool,
			checkPartsAvailability: checkPartsAvailabilityTool,
			getLowStockAlerts: getLowStockAlertsTool,
		},
		memory: memoryConfig,
		maxTurns: 10,
		temperature: 0.7,
		onEvent: (event) => {
			// Log agent events for debugging
			if (process.env.NODE_ENV === "development") {
				console.log("[Agent Event]", event);
			}
		},
	});

	return triageAgent;
}

// Export individual agent factories for direct use
export { Agent };
export type { AgentConfig };
