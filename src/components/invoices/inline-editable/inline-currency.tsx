/**
 * Inline Editable Currency Component
 *
 * Inline editing for currency values (stored in cents).
 * Displays as $X,XXX.XX, edits as decimal number.
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type InlineCurrencyProps = {
	value: number; // in cents
	onUpdate: (newValue: number) => void; // in cents
	isEditable: boolean;
	className?: string;
	readOnly?: boolean;
};

export function InlineCurrency({
	value,
	onUpdate,
	isEditable,
	className = "",
	readOnly = false,
}: InlineCurrencyProps) {
	const [isEditing, setIsEditing] = useState(false);

	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);

	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		setIsEditing(false);
		const text = e.currentTarget.textContent || "0";
		const dollars = Number.parseFloat(text.replace(/[^0-9.-]/g, "")) || 0;
		const cents = Math.round(dollars * 100);

		if (cents !== value) {
			onUpdate(cents);
		}

		// Reset display to formatted value
		e.currentTarget.textContent = formatCurrency(cents);
	};

	const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
		setIsEditing(true);
		// Show dollar value for editing
		e.currentTarget.textContent = (value / 100).toFixed(2);

		// Select all text
		const range = document.createRange();
		range.selectNodeContents(e.currentTarget);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Only allow numbers and decimal point
		if (
			e.key.length === 1 &&
			!/[0-9.]/.test(e.key) &&
			!e.ctrlKey &&
			!e.metaKey
		) {
			e.preventDefault();
		}

		// Enter to save
		if (e.key === "Enter") {
			e.preventDefault();
			e.currentTarget.blur();
		}
	};

	if (readOnly) {
		return (
			<span className={cn("font-mono font-semibold tabular-nums", className)}>
				{formatCurrency(value)}
			</span>
		);
	}

	return (
		<div
			className={cn(
				"font-mono tabular-nums transition-all duration-150 outline-none",
				isEditable &&
					!readOnly && [
						"cursor-text",
						"hover:bg-secondary",
						"focus:bg-primary/50",
						"focus:ring-1",
						"focus:ring-blue-500/20",
						"rounded",
						"px-1",
						"-mx-1",
					],
				className,
			)}
			contentEditable={isEditable && !readOnly}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
			suppressContentEditableWarning
		>
			{isEditing ? (value / 100).toFixed(2) : formatCurrency(value)}
		</div>
	);
}
