/**
 * AI Form Assistance Components
 *
 * Reusable components for integrating AI assistance into forms.
 * Import from @/components/ai/form-assistance
 *
 * Components:
 * - AIFieldWrapper - Wraps any field with AI suggestions
 * - AIInputField - Input with AI suggestions
 * - AITextareaField - Textarea with AI suggestions
 * - AIAssistButton - Sparkle button for triggering AI
 * - AISuggestionsDropdown - Dropdown showing suggestions
 * - AIPriceRecommendButton - Price recommendation with popover
 *
 * Hooks:
 * - useAICompletion - For text completions
 * - useAISuggestion - For field suggestions
 * - useAIPriceRecommendation - For price recommendations
 */

// Components
export { AIAssistButton } from "../ai-assist-button";
export { AISuggestionsDropdown } from "../ai-suggestions-dropdown";
export {
	AIFieldWrapper,
	AIInputField,
	AITextareaField,
} from "../ai-field-wrapper";
export { AIPriceRecommendButton } from "../ai-price-recommend-button";

// Hooks
export { useAICompletion } from "@/hooks/use-ai-completion";
export type { EntityType, AICompletionOptions } from "@/hooks/use-ai-completion";

export { useAISuggestion } from "@/hooks/use-ai-suggestion";
export type {
	SuggestionFieldType,
	SuggestionContext,
	Suggestion,
	AISuggestionOptions,
} from "@/hooks/use-ai-suggestion";

export { useAIPriceRecommendation } from "@/hooks/use-ai-price-recommendation";
export type {
	PriceRecommendation,
	PriceRecommendationContext,
} from "@/hooks/use-ai-price-recommendation";
