/**
 * Google Cloud Natural Language API Service
 *
 * Text analysis and understanding using machine learning.
 *
 * Features:
 * - Sentiment analysis
 * - Entity recognition
 * - Entity sentiment analysis
 * - Syntax analysis
 * - Content classification
 * - Text moderation
 *
 * @see https://cloud.google.com/natural-language/docs/reference/rest
 */

// Types
export interface Document {
	type: "PLAIN_TEXT" | "HTML";
	content?: string;
	gcsContentUri?: string;
	language?: string;
}

export interface Sentiment {
	magnitude: number; // 0 to +inf, strength of sentiment
	score: number; // -1.0 to 1.0, positive = positive sentiment
}

export interface Entity {
	name: string;
	type: EntityType;
	metadata: Record<string, string>;
	salience: number;
	mentions: EntityMention[];
	sentiment?: Sentiment;
}

export type EntityType =
	| "UNKNOWN"
	| "PERSON"
	| "LOCATION"
	| "ORGANIZATION"
	| "EVENT"
	| "WORK_OF_ART"
	| "CONSUMER_GOOD"
	| "OTHER"
	| "PHONE_NUMBER"
	| "ADDRESS"
	| "DATE"
	| "NUMBER"
	| "PRICE";

export interface EntityMention {
	text: TextSpan;
	type: "TYPE_UNKNOWN" | "PROPER" | "COMMON";
	sentiment?: Sentiment;
}

export interface TextSpan {
	content: string;
	beginOffset: number;
}

export interface Sentence {
	text: TextSpan;
	sentiment?: Sentiment;
}

export interface Token {
	text: TextSpan;
	partOfSpeech: PartOfSpeech;
	dependencyEdge: DependencyEdge;
	lemma: string;
}

export interface PartOfSpeech {
	tag: POSTag;
	aspect?: string;
	case?: string;
	form?: string;
	gender?: string;
	mood?: string;
	number?: string;
	person?: string;
	proper?: string;
	reciprocity?: string;
	tense?: string;
	voice?: string;
}

export type POSTag =
	| "UNKNOWN"
	| "ADJ"
	| "ADP"
	| "ADV"
	| "CONJ"
	| "DET"
	| "NOUN"
	| "NUM"
	| "PRON"
	| "PRT"
	| "PUNCT"
	| "VERB"
	| "X"
	| "AFFIX";

export interface DependencyEdge {
	headTokenIndex: number;
	label: string;
}

export interface ClassificationCategory {
	name: string;
	confidence: number;
}

export interface AnalyzeSentimentResponse {
	documentSentiment: Sentiment;
	language: string;
	sentences: Sentence[];
}

export interface AnalyzeEntitiesResponse {
	entities: Entity[];
	language: string;
}

export interface AnalyzeEntitySentimentResponse {
	entities: Entity[];
	language: string;
}

export interface AnalyzeSyntaxResponse {
	sentences: Sentence[];
	tokens: Token[];
	language: string;
}

export interface ClassifyTextResponse {
	categories: ClassificationCategory[];
}

export interface ModerateTextResponse {
	moderationCategories: {
		name: string;
		confidence: number;
	}[];
}

export interface AnnotateTextResponse {
	sentences: Sentence[];
	tokens: Token[];
	entities: Entity[];
	documentSentiment: Sentiment;
	language: string;
	categories: ClassificationCategory[];
	moderationCategories?: { name: string; confidence: number }[];
}

// Analysis result types for field service
export interface CustomerFeedbackAnalysis {
	overallSentiment: "positive" | "negative" | "neutral" | "mixed";
	sentimentScore: number;
	sentimentMagnitude: number;
	keyTopics: {
		topic: string;
		sentiment: "positive" | "negative" | "neutral";
	}[];
	mentionedEntities: { name: string; type: string; sentiment?: string }[];
	actionItems: string[];
}

export interface ServiceRequestAnalysis {
	urgency: "low" | "medium" | "high" | "emergency";
	serviceType: string | null;
	equipment: string[];
	symptoms: string[];
	location: string | null;
	contactInfo: { phone?: string; address?: string };
}

// Service implementation
class GoogleNaturalLanguageService {
	private readonly baseUrl = "https://language.googleapis.com/v1";
	private readonly apiKey = process.env.GOOGLE_API_KEY;

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Analyze sentiment of text
	 */
	async analyzeSentiment(
		text: string,
		language?: string,
	): Promise<AnalyzeSentimentResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
				language,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:analyzeSentiment?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						document,
						encodingType: "UTF8",
					}),
				},
			);

			if (!response.ok) {
				console.error("NLP sentiment error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP sentiment error:", error);
			return null;
		}
	}

	/**
	 * Extract entities from text
	 */
	async analyzeEntities(
		text: string,
		language?: string,
	): Promise<AnalyzeEntitiesResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
				language,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:analyzeEntities?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						document,
						encodingType: "UTF8",
					}),
				},
			);

			if (!response.ok) {
				console.error("NLP entities error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP entities error:", error);
			return null;
		}
	}

	/**
	 * Analyze entities with sentiment
	 */
	async analyzeEntitySentiment(
		text: string,
		language?: string,
	): Promise<AnalyzeEntitySentimentResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
				language,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:analyzeEntitySentiment?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						document,
						encodingType: "UTF8",
					}),
				},
			);

			if (!response.ok) {
				console.error("NLP entity sentiment error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP entity sentiment error:", error);
			return null;
		}
	}

	/**
	 * Analyze syntax (parts of speech, dependencies)
	 */
	async analyzeSyntax(
		text: string,
		language?: string,
	): Promise<AnalyzeSyntaxResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
				language,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:analyzeSyntax?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						document,
						encodingType: "UTF8",
					}),
				},
			);

			if (!response.ok) {
				console.error("NLP syntax error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP syntax error:", error);
			return null;
		}
	}

	/**
	 * Classify text into categories
	 */
	async classifyText(text: string): Promise<ClassifyTextResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:classifyText?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						document,
						classificationModelOptions: {
							v2Model: {
								contentCategoriesVersion: "V2",
							},
						},
					}),
				},
			);

			if (!response.ok) {
				console.error("NLP classify error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP classify error:", error);
			return null;
		}
	}

	/**
	 * Moderate text content
	 */
	async moderateText(text: string): Promise<ModerateTextResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:moderateText?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ document }),
				},
			);

			if (!response.ok) {
				console.error("NLP moderate error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP moderate error:", error);
			return null;
		}
	}

	/**
	 * Full annotation (all features)
	 */
	async annotateText(
		text: string,
		features: {
			extractSyntax?: boolean;
			extractEntities?: boolean;
			extractDocumentSentiment?: boolean;
			extractEntitySentiment?: boolean;
			classifyText?: boolean;
			moderateText?: boolean;
		},
	): Promise<AnnotateTextResponse | null> {
		try {
			const document: Document = {
				type: "PLAIN_TEXT",
				content: text,
			};

			const response = await fetch(
				`${this.baseUrl}/documents:annotateText?key=${this.apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						document,
						features: {
							extractSyntax: features.extractSyntax ?? false,
							extractEntities: features.extractEntities ?? false,
							extractDocumentSentiment:
								features.extractDocumentSentiment ?? false,
							extractEntitySentiment: features.extractEntitySentiment ?? false,
							classifyText: features.classifyText ?? false,
							moderateText: features.moderateText ?? false,
						},
						encodingType: "UTF8",
					}),
				},
			);

			if (!response.ok) {
				console.error("NLP annotate error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("NLP annotate error:", error);
			return null;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Analyze customer feedback/review
	 */
	async analyzeCustomerFeedback(
		feedback: string,
	): Promise<CustomerFeedbackAnalysis | null> {
		const result = await this.annotateText(feedback, {
			extractDocumentSentiment: true,
			extractEntitySentiment: true,
			extractEntities: true,
		});

		if (!result) return null;

		// Determine overall sentiment
		let overallSentiment: "positive" | "negative" | "neutral" | "mixed";
		const score = result.documentSentiment.score;
		const magnitude = result.documentSentiment.magnitude;

		if (magnitude < 0.5) {
			overallSentiment = "neutral";
		} else if (score > 0.25) {
			overallSentiment = "positive";
		} else if (score < -0.25) {
			overallSentiment = "negative";
		} else {
			overallSentiment = "mixed";
		}

		// Extract key topics with sentiment
		const keyTopics = result.entities
			.filter((e) => e.salience > 0.1)
			.map((e) => ({
				topic: e.name,
				sentiment: this.getSentimentLabel(e.sentiment?.score ?? 0),
			}));

		// Extract mentioned entities
		const mentionedEntities = result.entities.map((e) => ({
			name: e.name,
			type: e.type,
			sentiment: e.sentiment
				? this.getSentimentLabel(e.sentiment.score)
				: undefined,
		}));

		// Generate action items based on negative sentiment topics
		const actionItems: string[] = [];
		for (const topic of keyTopics) {
			if (topic.sentiment === "negative") {
				actionItems.push(`Address customer concern about: ${topic.topic}`);
			}
		}

		return {
			overallSentiment,
			sentimentScore: score,
			sentimentMagnitude: magnitude,
			keyTopics,
			mentionedEntities,
			actionItems,
		};
	}

	/**
	 * Analyze service request to extract key information
	 */
	async analyzeServiceRequest(
		requestText: string,
	): Promise<ServiceRequestAnalysis | null> {
		const result = await this.analyzeEntities(requestText);
		if (!result) return null;

		// Analyze for urgency keywords
		const urgencyKeywords = {
			emergency: [
				"emergency",
				"urgent",
				"asap",
				"immediately",
				"critical",
				"flooding",
				"fire",
				"gas leak",
				"no heat",
				"no ac",
			],
			high: ["soon", "quickly", "today", "broken", "not working", "leak"],
			medium: ["when possible", "this week", "maintenance", "check"],
		};

		const lowerText = requestText.toLowerCase();
		let urgency: "low" | "medium" | "high" | "emergency" = "low";

		if (urgencyKeywords.emergency.some((k) => lowerText.includes(k))) {
			urgency = "emergency";
		} else if (urgencyKeywords.high.some((k) => lowerText.includes(k))) {
			urgency = "high";
		} else if (urgencyKeywords.medium.some((k) => lowerText.includes(k))) {
			urgency = "medium";
		}

		// Extract service type
		const serviceKeywords = {
			hvac: [
				"hvac",
				"air conditioning",
				"ac",
				"heating",
				"furnace",
				"heat pump",
				"thermostat",
				"ductwork",
			],
			plumbing: [
				"plumbing",
				"pipe",
				"drain",
				"toilet",
				"faucet",
				"water heater",
				"leak",
				"clog",
			],
			electrical: [
				"electrical",
				"outlet",
				"switch",
				"breaker",
				"wiring",
				"lights",
				"panel",
			],
			appliance: [
				"appliance",
				"refrigerator",
				"washer",
				"dryer",
				"dishwasher",
				"oven",
				"stove",
			],
		};

		let serviceType: string | null = null;
		for (const [type, keywords] of Object.entries(serviceKeywords)) {
			if (keywords.some((k) => lowerText.includes(k))) {
				serviceType = type;
				break;
			}
		}

		// Extract equipment mentions
		const equipment = result.entities
			.filter((e) => e.type === "CONSUMER_GOOD" || e.type === "OTHER")
			.map((e) => e.name);

		// Extract symptoms/issues
		const symptoms: string[] = [];
		const symptomKeywords = [
			"not working",
			"broken",
			"leaking",
			"making noise",
			"won't start",
			"running constantly",
			"not cooling",
			"not heating",
		];
		for (const keyword of symptomKeywords) {
			if (lowerText.includes(keyword)) {
				symptoms.push(keyword);
			}
		}

		// Extract contact info
		const phoneEntity = result.entities.find((e) => e.type === "PHONE_NUMBER");
		const addressEntity = result.entities.find((e) => e.type === "ADDRESS");
		const locationEntity = result.entities.find((e) => e.type === "LOCATION");

		return {
			urgency,
			serviceType,
			equipment,
			symptoms,
			location: locationEntity?.name || addressEntity?.name || null,
			contactInfo: {
				phone: phoneEntity?.name,
				address: addressEntity?.name,
			},
		};
	}

	/**
	 * Check if text contains inappropriate content
	 */
	async isContentAppropriate(
		text: string,
	): Promise<{ appropriate: boolean; issues: string[] } | null> {
		const result = await this.moderateText(text);
		if (!result) return null;

		const issues: string[] = [];
		const inappropriateCategories = result.moderationCategories.filter(
			(c) => c.confidence > 0.7,
		);

		for (const category of inappropriateCategories) {
			issues.push(category.name);
		}

		return {
			appropriate: issues.length === 0,
			issues,
		};
	}

	/**
	 * Extract contact information from text
	 */
	async extractContactInfo(text: string): Promise<{
		phones: string[];
		addresses: string[];
		dates: string[];
		prices: string[];
	} | null> {
		const result = await this.analyzeEntities(text);
		if (!result) return null;

		return {
			phones: result.entities
				.filter((e) => e.type === "PHONE_NUMBER")
				.map((e) => e.name),
			addresses: result.entities
				.filter((e) => e.type === "ADDRESS")
				.map((e) => e.name),
			dates: result.entities
				.filter((e) => e.type === "DATE")
				.map((e) => e.name),
			prices: result.entities
				.filter((e) => e.type === "PRICE")
				.map((e) => e.name),
		};
	}

	/**
	 * Analyze technician notes
	 */
	async analyzeTechnicianNotes(notes: string): Promise<{
		partsUsed: string[];
		workPerformed: string[];
		recommendations: string[];
		issues: string[];
	} | null> {
		const result = await this.analyzeEntities(notes);
		if (!result) return null;

		// This is a simplified extraction - in production you'd use more sophisticated NLP
		const partsUsed = result.entities
			.filter((e) => e.type === "CONSUMER_GOOD")
			.map((e) => e.name);

		// Simple keyword-based extraction
		const lowerNotes = notes.toLowerCase();
		const workPerformed: string[] = [];
		const recommendations: string[] = [];
		const issues: string[] = [];

		const lines = notes.split(/[.\n]/);
		for (const line of lines) {
			const lowerLine = line.toLowerCase().trim();
			if (!lowerLine) continue;

			if (
				lowerLine.includes("replaced") ||
				lowerLine.includes("installed") ||
				lowerLine.includes("repaired") ||
				lowerLine.includes("cleaned")
			) {
				workPerformed.push(line.trim());
			} else if (
				lowerLine.includes("recommend") ||
				lowerLine.includes("suggest") ||
				lowerLine.includes("should")
			) {
				recommendations.push(line.trim());
			} else if (
				lowerLine.includes("found") ||
				lowerLine.includes("noticed") ||
				lowerLine.includes("issue") ||
				lowerLine.includes("problem")
			) {
				issues.push(line.trim());
			}
		}

		return {
			partsUsed,
			workPerformed,
			recommendations,
			issues,
		};
	}

	// Helper methods
	private getSentimentLabel(
		score: number,
	): "positive" | "negative" | "neutral" {
		if (score > 0.25) return "positive";
		if (score < -0.25) return "negative";
		return "neutral";
	}
}

// Export singleton instance
export const googleNaturalLanguageService = new GoogleNaturalLanguageService();
