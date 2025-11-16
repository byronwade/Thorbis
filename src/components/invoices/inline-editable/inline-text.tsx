/**
 * Inline Editable Text Component
 *
 * Clean inline editing that looks like plain text until you interact with it.
 * Uses contentEditable for native editing experience.
 *
 * Midday.ai-inspired:
 * - No visible input borders
 * - Subtle hover state (light gray background)
 * - Clean focus state (blue tint + ring)
 * - Feels like editing a document, not a form
 */

"use client";

import { cn } from "@/lib/utils";

type InlineTextProps = {
	value: string;
	onUpdate: (newValue: string) => void;
	isEditable: boolean;
	placeholder?: string;
	className?: string;
	as?: "h1" | "h2" | "h3" | "p" | "span" | "div" | "a";
	multiline?: boolean;
};

export function InlineText({
	value,
	onUpdate,
	isEditable,
	placeholder = "Click to edit",
	className = "",
	as: Component = "div",
	multiline = false,
}: InlineTextProps) {
	const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== value) {
			onUpdate(newValue);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		// Prevent Enter from creating new lines in single-line mode
		if (!multiline && e.key === "Enter") {
			e.preventDefault();
			e.currentTarget.blur();
		}
	};

	return (
		<Component
			className={cn(
				"outline-none transition-all duration-150",
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
				!value && "text-muted-foreground italic",
				className,
			)}
			contentEditable={isEditable}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			suppressContentEditableWarning
		>
			{value || placeholder}
		</Component>
	);
}
