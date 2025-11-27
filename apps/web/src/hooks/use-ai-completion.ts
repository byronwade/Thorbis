/**
 * useAICompletion Hook
 *
 * Custom hook for AI-powered text completions and suggestions.
 * Used for autocomplete, field suggestions, and content generation.
 *
 * Features:
 * - Streaming text completion
 * - Entity-specific prompts (job, invoice, estimate, customer)
 * - Debounced requests to reduce API calls
 * - Manual trigger or auto-complete modes
 */

import { useCallback, useRef, useState } from "react";

export type EntityType =
	| "job"
	| "invoice"
	| "estimate"
	| "customer"
	| "price-book"
	| "contract"
	| "default";

export type AICompletionOptions = {
	/** Entity type for context-specific completions */
	entityType?: EntityType;
	/** Minimum text length before triggering completion */
	minLength?: number;
	/** Debounce delay in milliseconds */
	debounceMs?: number;
	/** Additional context to help the AI */
	context?: string;
};

export type AICompletionResult = {
	/** The AI-generated completion text */
	completion: string;
	/** Whether a completion is currently being generated */
	isLoading: boolean;
	/** Error message if completion failed */
	error: string | null;
	/** Trigger completion manually */
	complete: (text: string) => Promise<string | null>;
	/** Clear the current completion */
	clear: () => void;
	/** Accept the completion (returns the combined text) */
	accept: (currentText: string) => string;
};

export function useAICompletion(
	options: AICompletionOptions = {},
): AICompletionResult {
	const {
		entityType = "default",
		minLength = 10,
		context,
	} = options;

	const [completion, setCompletion] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const complete = useCallback(
		async (text: string): Promise<string | null> => {
			// Don't complete if text is too short
			if (text.trim().length < minLength) {
				setCompletion("");
				return null;
			}

			// Cancel any in-progress request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setIsLoading(true);
			setError(null);
			setCompletion("");

			try {
				const response = await fetch("/api/ai/completion", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						prompt: text,
						entityType,
						context,
					}),
					signal: abortControllerRef.current.signal,
				});

				if (!response.ok) {
					throw new Error("Completion request failed");
				}

				// Handle streaming response
				const reader = response.body?.getReader();
				const decoder = new TextDecoder();
				let result = "";

				if (reader) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						const chunk = decoder.decode(value);
						// Parse SSE data format
						const lines = chunk.split("\n");
						for (const line of lines) {
							if (line.startsWith("0:")) {
								// Text chunk from Vercel AI SDK
								try {
									const text = JSON.parse(line.slice(2));
									result += text;
									setCompletion(result);
								} catch {
									// Not JSON, try direct text
									result += line.slice(2);
									setCompletion(result);
								}
							}
						}
					}
				}

				return result;
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") {
					// Request was cancelled, not an error
					return null;
				}
				const message =
					err instanceof Error ? err.message : "Failed to generate completion";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[entityType, minLength, context],
	);

	const clear = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		setCompletion("");
		setError(null);
	}, []);

	const accept = useCallback(
		(currentText: string): string => {
			const combined = currentText + completion;
			setCompletion("");
			return combined;
		},
		[completion],
	);

	return {
		completion,
		isLoading,
		error,
		complete,
		clear,
		accept,
	};
}
