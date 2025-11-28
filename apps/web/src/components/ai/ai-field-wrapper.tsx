"use client";

/**
 * AI Field Wrapper
 *
 * Wraps any form field (Input, Textarea) with AI assistance capabilities.
 * Provides a unified interface for AI-powered suggestions and completions.
 *
 * Features:
 * - AI suggestion button positioned inline
 * - Suggestions dropdown
 * - Completion inline preview (Tab to accept)
 * - Works with any controlled input component
 */

import { Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { AIAssistButton } from "./ai-assist-button";
import { AISuggestionsDropdown } from "./ai-suggestions-dropdown";
import {
	type SuggestionContext,
	type SuggestionFieldType,
	useAISuggestion,
} from "@/hooks/use-ai-suggestion";
import { cn } from "@/lib/utils";

type AIFieldWrapperProps = {
	/** The input/textarea component */
	children: React.ReactNode;
	/** Current field value */
	value: string;
	/** Callback when value changes (from AI) */
	onChange: (value: string) => void;
	/** Field type for AI suggestions */
	fieldType: SuggestionFieldType;
	/** Context for generating suggestions */
	context?: SuggestionContext;
	/** Label for the field */
	label?: string;
	/** Whether AI assistance is enabled */
	enableAI?: boolean;
	/** Position of the AI button */
	buttonPosition?: "inline" | "end" | "label";
	/** Additional className for wrapper */
	className?: string;
	/** Number of suggestions to generate */
	suggestionCount?: number;
};

function AIFieldWrapper({
	children,
	value,
	onChange,
	fieldType,
	context = {},
	label,
	enableAI = true,
	buttonPosition = "end",
	className,
	suggestionCount = 3,
}: AIFieldWrapperProps) {
	const [suggestionsOpen, setSuggestionsOpen] = useState(false);
	const { suggestions, isLoading, error, generate, clear, select } =
		useAISuggestion({
			fieldType,
			count: suggestionCount,
		});

	const handleGenerate = useCallback(async () => {
		setSuggestionsOpen(true);
		await generate(context);
	}, [generate, context]);

	const handleSelect = useCallback(
		(suggestion: { text: string }) => {
			const selectedText = select(suggestion as { id: string; text: string });
			onChange(selectedText);
			setSuggestionsOpen(false);
		},
		[onChange, select],
	);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setSuggestionsOpen(open);
			if (!open) {
				clear();
			}
		},
		[clear],
	);

	if (!enableAI) {
		return (
			<div className={className}>
				{label && (
					<label className="mb-1.5 block text-sm font-medium">{label}</label>
				)}
				{children}
			</div>
		);
	}

	const aiButton = (
		<AISuggestionsDropdown
			suggestions={suggestions}
			isLoading={isLoading}
			error={error}
			onSelect={handleSelect}
			onGenerate={handleGenerate}
			open={suggestionsOpen}
			onOpenChange={handleOpenChange}
			trigger={
				<AIAssistButton
					onClick={handleGenerate}
					isLoading={isLoading}
					tooltip={`Get AI suggestions for ${fieldType.replace(/-/g, " ")}`}
					size="sm"
				/>
			}
			placeholder="Click to generate suggestions"
		/>
	);

	if (buttonPosition === "label" && label) {
		return (
			<div className={className}>
				<div className="mb-1.5 flex items-center justify-between">
					<label className="text-sm font-medium">{label}</label>
					{aiButton}
				</div>
				{children}
			</div>
		);
	}

	if (buttonPosition === "inline") {
		return (
			<div className={className}>
				{label && (
					<label className="mb-1.5 block text-sm font-medium">{label}</label>
				)}
				<div className="relative">
					{children}
					<div className="absolute right-2 top-1/2 -translate-y-1/2">
						{aiButton}
					</div>
				</div>
			</div>
		);
	}

	// Default: end position
	return (
		<div className={className}>
			{label && (
				<label className="mb-1.5 block text-sm font-medium">{label}</label>
			)}
			<div className="flex gap-2">
				<div className="flex-1">{children}</div>
				{aiButton}
			</div>
		</div>
	);
}

/**
 * AI Input Field
 *
 * A ready-to-use Input with AI assistance.
 */
import { Input } from "@/components/ui/input";

type AIInputFieldProps = Omit<
	React.ComponentProps<typeof Input>,
	"value" | "onChange"
> & {
	value: string;
	onChange: (value: string) => void;
	fieldType: SuggestionFieldType;
	context?: SuggestionContext;
	label?: string;
	enableAI?: boolean;
	buttonPosition?: "inline" | "end" | "label";
	wrapperClassName?: string;
	suggestionCount?: number;
};

export function AIInputField({
	value,
	onChange,
	fieldType,
	context,
	label,
	enableAI = true,
	buttonPosition = "end",
	wrapperClassName,
	suggestionCount,
	className,
	...inputProps
}: AIInputFieldProps) {
	return (
		<AIFieldWrapper
			value={value}
			onChange={onChange}
			fieldType={fieldType}
			context={context}
			label={label}
			enableAI={enableAI}
			buttonPosition={buttonPosition}
			className={wrapperClassName}
			suggestionCount={suggestionCount}
		>
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={cn(buttonPosition === "inline" && "pr-12", className)}
				{...inputProps}
			/>
		</AIFieldWrapper>
	);
}

/**
 * AI Textarea Field
 *
 * A ready-to-use Textarea with AI assistance.
 */
import { Textarea } from "@/components/ui/textarea";

type AITextareaFieldProps = Omit<
	React.ComponentProps<typeof Textarea>,
	"value" | "onChange"
> & {
	value: string;
	onChange: (value: string) => void;
	fieldType: SuggestionFieldType;
	context?: SuggestionContext;
	label?: string;
	enableAI?: boolean;
	buttonPosition?: "inline" | "end" | "label";
	wrapperClassName?: string;
	suggestionCount?: number;
};

export function AITextareaField({
	value,
	onChange,
	fieldType,
	context,
	label,
	enableAI = true,
	buttonPosition = "label",
	wrapperClassName,
	suggestionCount,
	className,
	...textareaProps
}: AITextareaFieldProps) {
	return (
		<AIFieldWrapper
			value={value}
			onChange={onChange}
			fieldType={fieldType}
			context={context}
			label={label}
			enableAI={enableAI}
			buttonPosition={buttonPosition}
			className={wrapperClassName}
			suggestionCount={suggestionCount}
		>
			<Textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={className}
				{...textareaProps}
			/>
		</AIFieldWrapper>
	);
}
