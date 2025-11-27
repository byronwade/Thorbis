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
 * Powered by Groq (free tier)
 */

import { createGroq } from "@ai-sdk/groq";
import { Agent, type AgentConfig, handoff } from "@ai-sdk-tools/agents";
import { tool } from "ai";
import { z } from "zod";
import {
	// Proactive learning tools
	analyzeRecentCommunicationsTool,
	buildCustomerProfileTool,
	calculateEstimateTool,
	checkEquipmentWarrantyTool,
	checkPartsAvailabilityTool,
	checkWeatherForJobTool,
	createAppointmentTool,
	createInvoiceTool,
	extractCommunicationInsightsTool,
	findNearbySuppliersTool,
	// Technician matching tools
	findTechniciansBySkillsTool,
	geocodeAddressTool,
	getAvailableSlotsTool,
	getCallTranscriptTool,
	getCodeComplianceChecklistTool,
	// Company overview tool (properly implemented)
	getCompanyOverviewTool,
	getCustomerCommunicationHistoryTool,
	getCustomerDetailsTool,
	getEntityMemoriesTool,
	getEquipmentServiceHistoryTool,
	getLowStockAlertsTool,
	getPermitRequirementsTool,
	getPropertyConditionsTool,
	// Equipment history tools
	getPropertyEquipmentTool,
	// Route optimization tools
	getRouteTool,
	getTechnicianWorkloadTool,
	getTrafficConditionsTool,
	getWeatherAlertsTool,
	// External data tools
	getWeatherForLocationTool,
	learnFromCompletedJobsTool,
	optimizeJobOrderTool,
	recallContextTool,
	scheduleReminderTool,
	// Code search tools
	searchBuildingCodesTool,
	// Communication learning tools
	searchCommunicationsFullTextTool,
	// Customer tools (properly implemented)
	searchCustomersTool,
	// Inventory & parts tools
	searchInventoryTool,
	// Invoice tools
	searchInvoicesTool,
	// Job/Scheduling tools
	searchJobsTool,
	searchMemoriesTool,
	// Pricing & estimation tools
	searchPriceBookTool,
	searchVoicemailTranscriptsTool,
	// Communication tools
	sendEmailTool,
	sendSmsTool,
	// Memory tools
	storeMemoryTool,
	// Smart scheduling tools
	suggestTechnicianForJobTool,
	updateCustomerTool,
	webSearchNewsTool,
	webSearchSiteTool,
	webSearchTechnicalTool,
	// Web search & research tools
	webSearchTool,
} from "../agent-tools";
import {
	createSupabaseMemoryProvider,
	DEFAULT_WORKING_MEMORY_TEMPLATE,
} from "../memory-provider";

// Initialize Groq provider (free tier with generous limits)
const groq = createGroq();
const groqModel = groq("llama-3.3-70b-versatile");

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
		model: groqModel,
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
			// Use properly implemented customer tools from agent-tools
			searchCustomers: searchCustomersTool,
			getCustomerDetails: getCustomerDetailsTool,
			updateCustomer: updateCustomerTool,
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
		model: groqModel,
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
			// Use properly implemented scheduling tools
			searchJobs: searchJobsTool,
			getAvailableSlots: getAvailableSlotsTool,
			scheduleAppointment: createAppointmentTool,
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
		model: groqModel,
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
			// Use properly implemented financial tools
			searchInvoices: searchInvoicesTool,
			createInvoice: createInvoiceTool,
			// Pricing & estimation tools
			searchPriceBook: searchPriceBookTool,
			calculateEstimate: calculateEstimateTool,
			// Payment reminders via email
			sendPaymentReminder: sendEmailTool,
		},
		memory: memoryConfig,
	});

	// Communication Agent - handles email, SMS, and messaging
	const communicationAgent = Agent.create({
		name: "communication-agent",
		model: groqModel,
		instructions: `You are a Communication specialist for a field service company.

Your responsibilities:
- Draft and send emails to customers
- Send SMS notifications
- Manage internal team messages
- Handle appointment reminders
- Create communication templates

Always maintain a professional tone appropriate for the business.
Confirm message content before sending.`,
		handoffDescription: "Handles email, SMS, and internal communications",
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
			// Use properly implemented communication tools
			sendEmail: sendEmailTool,
			sendSMS: sendSmsTool,
			scheduleReminder: scheduleReminderTool,
		},
		memory: memoryConfig,
	});

	// Triage Agent - orchestrates all specialized agents
	const triageAgent = Agent.create({
		name: "triage-agent",
		model: groqModel,
		instructions: (
			context,
		) => `You are Stratos AI, an intelligent assistant for a field service management company.

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

**Web Search & Research**:
- Use \`webSearch\` to find answers to general questions, look up information, or research topics
- Use \`webSearchNews\` to find recent industry news, regulation changes, or current events
- Use \`webSearchTechnical\` to find technical documentation, guides, and troubleshooting help
- Use \`webSearchSite\` to search within specific websites (e.g., manufacturer docs, gov sites)

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
			// Use properly implemented company overview tool
			getCompanyOverview: getCompanyOverviewTool,
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
			// Web search & research tools
			webSearch: webSearchTool,
			webSearchNews: webSearchNewsTool,
			webSearchTechnical: webSearchTechnicalTool,
			webSearchSite: webSearchSiteTool,
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
