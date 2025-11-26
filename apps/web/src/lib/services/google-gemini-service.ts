/**
 * Google Gemini (Generative Language) API Service
 *
 * Provides AI-powered text generation and analysis.
 * - Job description generation
 * - Customer communication drafting
 * - Estimate analysis
 * - Document summarization
 * - Multi-turn conversations
 *
 * API: Google Generative Language API (Gemini)
 * Docs: https://ai.google.dev/docs
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Available Gemini models
 */
export type GeminiModel =
	| "gemini-1.5-pro"
	| "gemini-1.5-flash"
	| "gemini-1.5-flash-8b"
	| "gemini-1.0-pro";

/**
 * Safety setting
 */
export interface SafetySetting {
	category:
		| "HARM_CATEGORY_HARASSMENT"
		| "HARM_CATEGORY_HATE_SPEECH"
		| "HARM_CATEGORY_SEXUALLY_EXPLICIT"
		| "HARM_CATEGORY_DANGEROUS_CONTENT";
	threshold:
		| "BLOCK_NONE"
		| "BLOCK_LOW_AND_ABOVE"
		| "BLOCK_MEDIUM_AND_ABOVE"
		| "BLOCK_ONLY_HIGH";
}

/**
 * Generation config
 */
export interface GenerationConfig {
	temperature?: number;
	topK?: number;
	topP?: number;
	maxOutputTokens?: number;
	stopSequences?: string[];
}

/**
 * Chat message
 */
export interface ChatMessage {
	role: "user" | "model";
	parts: { text: string }[];
}

/**
 * Generation result
 */
export interface GenerationResult {
	text: string;
	finishReason?: string;
	safetyRatings?: {
		category: string;
		probability: string;
	}[];
	tokenCount?: {
		prompt: number;
		response: number;
		total: number;
	};
}

/**
 * Chat result
 */
export interface ChatResult extends GenerationResult {
	history: ChatMessage[];
}

/**
 * Embedding result
 */
export interface EmbeddingResult {
	embedding: number[];
	dimensions: number;
}

/**
 * Field service specific prompts
 */
export interface JobDescriptionPrompt {
	serviceType: string;
	equipment?: string;
	symptoms?: string;
	customerNotes?: string;
}

export interface EstimateAnalysisPrompt {
	description: string;
	lineItems: { name: string; price: number; quantity: number }[];
	laborHours?: number;
	totalAmount: number;
}

export interface CustomerEmailPrompt {
	purpose:
		| "appointment_confirmation"
		| "follow_up"
		| "estimate_sent"
		| "invoice_reminder"
		| "thank_you";
	customerName: string;
	companyName: string;
	jobDetails?: string;
	appointmentDate?: string;
	amount?: number;
}

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleGeminiService {
	private readonly apiKey: string | undefined;
	private readonly baseUrl = "https://generativelanguage.googleapis.com/v1beta";
	private readonly defaultModel: GeminiModel = "gemini-1.5-flash";

	constructor() {
		this.apiKey =
			process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
	}

	/**
	 * Generate text content
	 */
	async generateContent(
		prompt: string,
		options: {
			model?: GeminiModel;
			config?: GenerationConfig;
			safetySettings?: SafetySetting[];
			systemInstruction?: string;
		} = {},
	): Promise<GenerationResult | null> {
		if (!this.apiKey) {
			console.warn("Google Gemini API key not configured");
			return null;
		}

		const model = options.model || this.defaultModel;

		try {
			const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

			const requestBody: Record<string, unknown> = {
				contents: [{ parts: [{ text: prompt }] }],
			};

			if (options.config) {
				requestBody.generationConfig = options.config;
			}

			if (options.safetySettings) {
				requestBody.safetySettings = options.safetySettings;
			}

			if (options.systemInstruction) {
				requestBody.systemInstruction = {
					parts: [{ text: options.systemInstruction }],
				};
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Gemini API error:", response.status, errorText);
				return null;
			}

			const data = await response.json();

			if (!data.candidates || data.candidates.length === 0) {
				console.error("No candidates returned from Gemini");
				return null;
			}

			const candidate = data.candidates[0];
			const text = candidate.content?.parts?.[0]?.text || "";

			return {
				text,
				finishReason: candidate.finishReason,
				safetyRatings: candidate.safetyRatings,
				tokenCount: data.usageMetadata
					? {
							prompt: data.usageMetadata.promptTokenCount,
							response: data.usageMetadata.candidatesTokenCount,
							total: data.usageMetadata.totalTokenCount,
						}
					: undefined,
			};
		} catch (error) {
			console.error("Gemini API error:", error);
			return null;
		}
	}

	/**
	 * Multi-turn chat conversation
	 */
	async chat(
		messages: ChatMessage[],
		newMessage: string,
		options: {
			model?: GeminiModel;
			config?: GenerationConfig;
			systemInstruction?: string;
		} = {},
	): Promise<ChatResult | null> {
		if (!this.apiKey) {
			console.warn("Google Gemini API key not configured");
			return null;
		}

		const model = options.model || this.defaultModel;

		try {
			const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

			// Build conversation history
			const contents = [
				...messages,
				{ role: "user" as const, parts: [{ text: newMessage }] },
			];

			const requestBody: Record<string, unknown> = { contents };

			if (options.config) {
				requestBody.generationConfig = options.config;
			}

			if (options.systemInstruction) {
				requestBody.systemInstruction = {
					parts: [{ text: options.systemInstruction }],
				};
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Gemini chat error:", response.status, errorText);
				return null;
			}

			const data = await response.json();

			if (!data.candidates || data.candidates.length === 0) {
				return null;
			}

			const candidate = data.candidates[0];
			const responseText = candidate.content?.parts?.[0]?.text || "";

			// Update history
			const updatedHistory: ChatMessage[] = [
				...messages,
				{ role: "user", parts: [{ text: newMessage }] },
				{ role: "model", parts: [{ text: responseText }] },
			];

			return {
				text: responseText,
				finishReason: candidate.finishReason,
				safetyRatings: candidate.safetyRatings,
				history: updatedHistory,
				tokenCount: data.usageMetadata
					? {
							prompt: data.usageMetadata.promptTokenCount,
							response: data.usageMetadata.candidatesTokenCount,
							total: data.usageMetadata.totalTokenCount,
						}
					: undefined,
			};
		} catch (error) {
			console.error("Gemini chat error:", error);
			return null;
		}
	}

	/**
	 * Generate text embeddings
	 */
	async generateEmbedding(
		text: string,
		options: { model?: string; taskType?: string } = {},
	): Promise<EmbeddingResult | null> {
		if (!this.apiKey) {
			console.warn("Google Gemini API key not configured");
			return null;
		}

		const model = options.model || "text-embedding-004";

		try {
			const url = `${this.baseUrl}/models/${model}:embedContent?key=${this.apiKey}`;

			const requestBody: Record<string, unknown> = {
				model: `models/${model}`,
				content: { parts: [{ text }] },
			};

			if (options.taskType) {
				requestBody.taskType = options.taskType;
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				console.error("Gemini embedding error:", response.status);
				return null;
			}

			const data = await response.json();

			return {
				embedding: data.embedding?.values || [],
				dimensions: data.embedding?.values?.length || 0,
			};
		} catch (error) {
			console.error("Gemini embedding error:", error);
			return null;
		}
	}

	/**
	 * Generate batch embeddings
	 */
	async batchEmbeddings(
		texts: string[],
		options: { model?: string; taskType?: string } = {},
	): Promise<EmbeddingResult[] | null> {
		if (!this.apiKey) {
			console.warn("Google Gemini API key not configured");
			return null;
		}

		const model = options.model || "text-embedding-004";

		try {
			const url = `${this.baseUrl}/models/${model}:batchEmbedContents?key=${this.apiKey}`;

			const requests = texts.map((text) => ({
				model: `models/${model}`,
				content: { parts: [{ text }] },
				taskType: options.taskType,
			}));

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify({ requests }),
			});

			if (!response.ok) {
				console.error("Gemini batch embedding error:", response.status);
				return null;
			}

			const data = await response.json();

			return (data.embeddings || []).map((emb: { values: number[] }) => ({
				embedding: emb.values || [],
				dimensions: emb.values?.length || 0,
			}));
		} catch (error) {
			console.error("Gemini batch embedding error:", error);
			return null;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Generate professional job description
	 */
	async generateJobDescription(
		prompt: JobDescriptionPrompt,
	): Promise<string | null> {
		const systemInstruction = `You are a professional field service technician assistant.
Generate clear, professional job descriptions for service tickets.
Include relevant technical details, safety considerations, and expected work scope.
Keep descriptions concise but comprehensive.`;

		const userPrompt = `Generate a professional job description for:
Service Type: ${prompt.serviceType}
${prompt.equipment ? `Equipment: ${prompt.equipment}` : ""}
${prompt.symptoms ? `Symptoms/Issues: ${prompt.symptoms}` : ""}
${prompt.customerNotes ? `Customer Notes: ${prompt.customerNotes}` : ""}

Provide a clear, professional description that technicians can use.`;

		const result = await this.generateContent(userPrompt, {
			systemInstruction,
			config: { temperature: 0.7, maxOutputTokens: 500 },
		});

		return result?.text || null;
	}

	/**
	 * Analyze estimate for accuracy and completeness
	 */
	async analyzeEstimate(prompt: EstimateAnalysisPrompt): Promise<{
		analysis: string;
		suggestions: string[];
		competitiveness: string;
	} | null> {
		const systemInstruction = `You are an expert in field service pricing and estimates.
Analyze estimates for completeness, accuracy, and competitiveness.
Provide actionable feedback and suggestions.`;

		const lineItemsSummary = prompt.lineItems
			.map((item) => `- ${item.name}: $${item.price} x ${item.quantity}`)
			.join("\n");

		const userPrompt = `Analyze this service estimate:

Description: ${prompt.description}

Line Items:
${lineItemsSummary}

${prompt.laborHours ? `Labor Hours: ${prompt.laborHours}` : ""}
Total Amount: $${prompt.totalAmount}

Provide:
1. Brief analysis of the estimate
2. 3-5 specific suggestions for improvement
3. Assessment of competitiveness (low/fair/high pricing)

Format as JSON with keys: analysis, suggestions (array), competitiveness`;

		const result = await this.generateContent(userPrompt, {
			systemInstruction,
			config: { temperature: 0.5, maxOutputTokens: 800 },
		});

		if (!result?.text) return null;

		try {
			// Extract JSON from response
			const jsonMatch = result.text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}
		} catch {
			// If JSON parsing fails, return structured response
			return {
				analysis: result.text,
				suggestions: [],
				competitiveness: "unknown",
			};
		}

		return null;
	}

	/**
	 * Draft customer email
	 */
	async draftCustomerEmail(prompt: CustomerEmailPrompt): Promise<{
		subject: string;
		body: string;
	} | null> {
		const systemInstruction = `You are a professional customer service representative for a field service company.
Write friendly, professional emails that maintain good customer relationships.
Keep emails concise and action-oriented.`;

		const purposeDescriptions: Record<CustomerEmailPrompt["purpose"], string> =
			{
				appointment_confirmation: "Confirm an upcoming service appointment",
				follow_up: "Follow up after a completed service",
				estimate_sent: "Notify that an estimate has been sent",
				invoice_reminder:
					"Send a friendly reminder about an outstanding invoice",
				thank_you: "Thank the customer for their business",
			};

		const userPrompt = `Draft an email for: ${purposeDescriptions[prompt.purpose]}

Customer Name: ${prompt.customerName}
Company Name: ${prompt.companyName}
${prompt.jobDetails ? `Job Details: ${prompt.jobDetails}` : ""}
${prompt.appointmentDate ? `Appointment Date: ${prompt.appointmentDate}` : ""}
${prompt.amount ? `Amount: $${prompt.amount}` : ""}

Format as JSON with keys: subject, body`;

		const result = await this.generateContent(userPrompt, {
			systemInstruction,
			config: { temperature: 0.7, maxOutputTokens: 600 },
		});

		if (!result?.text) return null;

		try {
			const jsonMatch = result.text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}
		} catch {
			// Extract subject and body manually if JSON fails
			const lines = result.text.split("\n");
			return {
				subject: lines[0]?.replace(/^Subject:\s*/i, "") || "Service Update",
				body: lines.slice(1).join("\n").trim(),
			};
		}

		return null;
	}

	/**
	 * Summarize document or notes
	 */
	async summarizeText(
		text: string,
		options: { maxLength?: number; format?: "bullets" | "paragraph" } = {},
	): Promise<string | null> {
		const format = options.format || "bullets";
		const maxLength = options.maxLength || 200;

		const prompt = `Summarize the following text in ${format === "bullets" ? "bullet points" : "a concise paragraph"}. Keep it under ${maxLength} words:

${text}`;

		const result = await this.generateContent(prompt, {
			config: { temperature: 0.3, maxOutputTokens: 500 },
		});

		return result?.text || null;
	}

	/**
	 * Extract structured data from text
	 */
	async extractStructuredData<T>(
		text: string,
		schema: { fields: { name: string; type: string; description: string }[] },
	): Promise<T | null> {
		const fieldsDescription = schema.fields
			.map((f) => `- ${f.name} (${f.type}): ${f.description}`)
			.join("\n");

		const prompt = `Extract the following fields from the text and return as JSON:

Fields to extract:
${fieldsDescription}

Text:
${text}

Return only valid JSON with the specified fields.`;

		const result = await this.generateContent(prompt, {
			config: { temperature: 0.1, maxOutputTokens: 500 },
		});

		if (!result?.text) return null;

		try {
			const jsonMatch = result.text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]) as T;
			}
		} catch {
			console.error("Failed to parse extracted data");
		}

		return null;
	}

	/**
	 * Generate service recommendations based on history
	 */
	async generateServiceRecommendations(customerHistory: {
		services: { type: string; date: string; equipment?: string }[];
		equipmentAge?: number;
		lastMaintenanceDate?: string;
	}): Promise<string[] | null> {
		const historyText = customerHistory.services
			.map(
				(s) =>
					`- ${s.date}: ${s.type}${s.equipment ? ` (${s.equipment})` : ""}`,
			)
			.join("\n");

		const prompt = `Based on this customer's service history, recommend future services:

Service History:
${historyText}

${customerHistory.equipmentAge ? `Equipment Age: ${customerHistory.equipmentAge} years` : ""}
${customerHistory.lastMaintenanceDate ? `Last Maintenance: ${customerHistory.lastMaintenanceDate}` : ""}

Provide 3-5 specific service recommendations as a JSON array of strings.`;

		const result = await this.generateContent(prompt, {
			config: { temperature: 0.6, maxOutputTokens: 400 },
		});

		if (!result?.text) return null;

		try {
			const jsonMatch = result.text.match(/\[[\s\S]*\]/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}
		} catch {
			// Extract list items manually
			const lines = result.text.split("\n");
			return lines
				.filter((line) => line.trim().startsWith("-") || line.match(/^\d+\./))
				.map((line) => line.replace(/^[-\d.]+\s*/, "").trim())
				.filter((line) => line.length > 0);
		}

		return null;
	}

	/**
	 * Count tokens in text (approximate)
	 */
	async countTokens(text: string, model?: GeminiModel): Promise<number | null> {
		if (!this.apiKey) {
			return null;
		}

		const modelName = model || this.defaultModel;

		try {
			const url = `${this.baseUrl}/models/${modelName}:countTokens?key=${this.apiKey}`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": USER_AGENT,
				},
				body: JSON.stringify({
					contents: [{ parts: [{ text }] }],
				}),
			});

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			return data.totalTokens || null;
		} catch {
			return null;
		}
	}

	/**
	 * List available models
	 */
	async listModels(): Promise<
		{ name: string; displayName: string; description: string }[] | null
	> {
		if (!this.apiKey) {
			return null;
		}

		try {
			const url = `${this.baseUrl}/models?key=${this.apiKey}`;

			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			return (data.models || []).map(
				(m: { name: string; displayName: string; description: string }) => ({
					name: m.name,
					displayName: m.displayName,
					description: m.description,
				}),
			);
		} catch {
			return null;
		}
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}
}

export const googleGeminiService = new GoogleGeminiService();
