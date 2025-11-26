/**
 * Tag Badge Component
 * Display individual tag pills with visual distinction and custom colors
 */

"use client";

import { Tag, X } from "lucide-react";
import type { TagWithColor } from "@/actions/job-tags";
import { Button } from "@/components/ui/button";

type TagBadgeProps = {
	tag: string | TagWithColor;
	type: "customer" | "job";
	onRemove?: () => void;
	showRemove?: boolean;
};

const COLOR_CLASSES: Record<string, string> = {
	red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
	orange:
		"bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30",
	amber:
		"bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
	yellow:
		"bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30",
	green:
		"bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30",
	emerald:
		"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
	teal: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30",
	blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
	indigo:
		"bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30",
	purple:
		"bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30",
	pink: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-900/30",
	gray: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/30",
};

export function TagBadge({
	tag,
	type,
	onRemove,
	showRemove = false,
}: TagBadgeProps) {
	// Handle both string tags (legacy) and object tags (with color)
	const tagLabel = typeof tag === "string" ? tag : tag.label;
	const tagColor = typeof tag === "string" ? undefined : tag.color;

	// Get color class - use custom color if provided, otherwise fall back to type-based default
	const colorClass =
		tagColor && COLOR_CLASSES[tagColor]
			? COLOR_CLASSES[tagColor]
			: type === "customer"
				? COLOR_CLASSES.blue
				: COLOR_CLASSES.purple;

	return (
		<div
			className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${colorClass}`}
		>
			<Tag className="size-3" />
			<span>{tagLabel}</span>
			{showRemove && onRemove && (
				<Button
					className="size-4 p-0 hover:bg-transparent"
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					size="icon"
					variant="ghost"
				>
					<X className="size-3" />
				</Button>
			)}
		</div>
	);
}
