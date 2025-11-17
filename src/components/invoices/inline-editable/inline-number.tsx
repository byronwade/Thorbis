/**
 * Inline Editable Number Component
 *
 * Inline editing for numbers with auto-formatting.
 * Uses monospace font for proper alignment.
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type InlineNumberProps = {
	value: number;
	onUpdate: (newValue: number) => void;
	isEditable: boolean;
	placeholder?: string;
	className?: string;
	decimals?: number;
	min?: number;
	max?: number;
};

export function InlineNumber({
	value,
	onUpdate,
	isEditable,
	placeholder = "0",
	className = "",
	decimals = 0,
	min,
	max,
}: InlineNumberProps) {
	const [isEditing, setIsEditing] = useState(false);

	const formatValue = (val: number) => val.toFixed(decimals);

	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		setIsEditing(false);
		const text = e.currentTarget.textContent || "0";
		let newValue = Number.parseFloat(text.replace(/[^0-9.-]/g, "")) || 0;

		// Apply min/max constraints
		if (min !== undefined && newValue < min) {
			newValue = min;
		}
		if (max !== undefined && newValue > max) {
			newValue = max;
		}

		if (newValue !== value) {
			onUpdate(newValue);
		}

		// Reset display to formatted value
		e.currentTarget.textContent = formatValue(newValue);
	};

	const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
		setIsEditing(true);
		// Select all text on focus for easy replacement
		const range = document.createRange();
		range.selectNodeContents(e.currentTarget);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Only allow numbers, decimal point, and minus
		if (e.key.length === 1 && !/[0-9.-]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
			e.preventDefault();
		}

		// Enter to save
		if (e.key === "Enter") {
			e.preventDefault();
			e.currentTarget.blur();
		}
	};

	return (
		<div
			className={cn(
				"font-mono tabular-nums transition-all duration-150 outline-none",
				isEditable && [
					"cursor-text",
					"hover:bg-secondary",
					"focus:bg-primary/50",
					"focus:ring-1",
					"focus:ring-blue-500/20",
					"rounded",
					"px-1",
					"-mx-1",
				],
				!value && "text-muted-foreground",
				className
			)}
			contentEditable={isEditable}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
			suppressContentEditableWarning
		>
			{isEditing ? value : formatValue(value)}
		</div>
	);
}
