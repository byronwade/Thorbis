/**
 * useAISuggestion Hook
 *
 * Custom hook for AI-powered field suggestions.
 * Generates contextual suggestions for form fields based on:
 * - Field type (job title, description, invoice line, etc.)
 * - Related data (customer info, property details, job type)
 * - Historical patterns
 *
 * Features:
 * - Multiple suggestion generation
 * - Context-aware prompts
 * - Caching of recent suggestions
 * - Streaming support
 */

import { useCallback, useRef, useState } from "react";

export type SuggestionFieldType =
	| "job-title"
	| "job-description"
	| "invoice-line"
	| "invoice-description"
	| "estimate-line"
	| "estimate-description"
	| "price-book-name"
	| "price-book-description"
	| "contract-title"
	| "contract-terms"
	| "note";

export type SuggestionContext = {
	/** Customer name or info */
	customerName?: string;
	/** Property address or type */
	propertyAddress?: string;
	/** Job type (repair, maintenance, installation, etc.) */
	jobType?: string;
	/** Service category (HVAC, Plumbing, Electrical, etc.) */
	category?: string;
	/** Existing items or line items */
	existingItems?: string[];
	/** Price book items for reference */
	priceBookItems?: string[];
	/** Any additional context */
	additionalContext?: string;
};

export type Suggestion = {
	id: string;
	text: string;
	confidence?: number;
};

export type AISuggestionOptions = {
	/** Type of field to generate suggestions for */
	fieldType: SuggestionFieldType;
	/** Number of suggestions to generate */
	count?: number;
};

export type AISuggestionResult = {
	/** Generated suggestions */
	suggestions: Suggestion[];
	/** Whether suggestions are being generated */
	isLoading: boolean;
	/** Error message if generation failed */
	error: string | null;
	/** Generate suggestions based on context */
	generate: (context: SuggestionContext) => Promise<Suggestion[]>;
	/** Clear suggestions */
	clear: () => void;
	/** Select a suggestion */
	select: (suggestion: Suggestion) => string;
};

const FIELD_PROMPTS: Record<SuggestionFieldType, string> = {
	"job-title": `Generate professional job/work order titles for a field service company.
Consider the service type, customer context, and make it clear and actionable.
Examples: "Annual HVAC Maintenance", "Emergency Pipe Repair", "Furnace Installation"`,

	"job-description": `Generate detailed job descriptions for field service work orders.
Include what work will be done, any preparation needed, and expected outcomes.
Be professional but concise.`,

	"invoice-line": `Generate invoice line item descriptions for field service work.
Be specific about the service provided, parts used, or labor performed.
Examples: "Labor - 2 hours diagnostic", "Capacitor replacement - 50/60 MFD"`,

	"invoice-description": `Generate invoice summary descriptions.
Summarize the work completed professionally for billing purposes.`,

	"estimate-line": `Generate estimate line item descriptions for field service quotes.
Be clear about what's included and any conditions.`,

	"estimate-description": `Generate estimate overview descriptions.
Explain the scope of work being quoted and any assumptions.`,

	"price-book-name": `Generate price book item names for field service pricing.
Be clear, searchable, and follow industry naming conventions.
Examples: "Filter - 16x25x1 MERV 8", "Labor - Standard Hourly Rate"`,

	"price-book-description": `Generate price book item descriptions.
Include specifications, compatibility notes, and any important details.`,

	"contract-title": `Generate service contract/agreement titles.
Examples: "Annual Maintenance Agreement", "Priority Service Plan"`,

	"contract-terms": `Generate service contract terms and conditions.
Be clear about service frequency, coverage, exclusions, and customer obligations.`,

	note: `Generate professional notes for service records.
Be factual, concise, and include relevant details.`,
};

export function useAISuggestion(
	options: AISuggestionOptions,
): AISuggestionResult {
	const { fieldType, count = 3 } = options;

	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const generate = useCallback(
		async (context: SuggestionContext): Promise<Suggestion[]> => {
			// Cancel any in-progress request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setIsLoading(true);
			setError(null);
			setSuggestions([]);

			try {
				// Build the context string
				const contextParts: string[] = [];
				if (context.customerName) {
					contextParts.push(`Customer: ${context.customerName}`);
				}
				if (context.propertyAddress) {
					contextParts.push(`Property: ${context.propertyAddress}`);
				}
				if (context.jobType) {
					contextParts.push(`Job Type: ${context.jobType}`);
				}
				if (context.category) {
					contextParts.push(`Category: ${context.category}`);
				}
				if (context.existingItems?.length) {
					contextParts.push(
						`Existing items: ${context.existingItems.join(", ")}`,
					);
				}
				if (context.additionalContext) {
					contextParts.push(context.additionalContext);
				}

				const response = await fetch("/api/ai/suggestions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fieldType,
						systemPrompt: FIELD_PROMPTS[fieldType],
						context: contextParts.join("\n"),
						count,
					}),
					signal: abortControllerRef.current.signal,
				});

				if (!response.ok) {
					throw new Error("Suggestion request failed");
				}

				const data = await response.json();
				const newSuggestions: Suggestion[] = (data.suggestions || []).map(
					(text: string, index: number) => ({
						id: `suggestion-${Date.now()}-${index}`,
						text,
						confidence: data.confidence?.[index],
					}),
				);

				setSuggestions(newSuggestions);
				return newSuggestions;
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") {
					return [];
				}
				const message =
					err instanceof Error ? err.message : "Failed to generate suggestions";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[fieldType, count],
	);

	const clear = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		setSuggestions([]);
		setError(null);
	}, []);

	const select = useCallback((suggestion: Suggestion): string => {
		setSuggestions([]);
		return suggestion.text;
	}, []);

	return {
		suggestions,
		isLoading,
		error,
		generate,
		clear,
		select,
	};
}
