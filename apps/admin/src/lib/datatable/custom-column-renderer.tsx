/**
 * Custom Column Renderer
 *
 * Renders custom column values based on format type.
 * Handles nested field access and formatting.
 */

import { format } from "date-fns";
import { Badge } from "@stratos/ui";

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: any, path: string): any {
	return path.split(".").reduce((current, key) => current?.[key], obj);
}

/**
 * Format currency value
 */
function formatCurrency(value: any): string {
	if (value === null || value === undefined || value === "") {
		return "—";
	}
	const num = Number(value);
	if (Number.isNaN(num)) {
		return "—";
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(num);
}

/**
 * Format number value
 */
function formatNumber(value: any): string {
	if (value === null || value === undefined || value === "") {
		return "—";
	}
	const num = Number(value);
	if (Number.isNaN(num)) {
		return "—";
	}
	return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format date value
 */
function formatDate(value: any): string {
	if (!value) {
		return "—";
	}
	try {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "—";
		}
		return format(date, "MMM d, yyyy h:mm a");
	} catch {
		return "—";
	}
}

/**
 * Render custom column based on format
 */
export function renderCustomColumn(
	item: any,
	fieldPath: string,
	columnFormat?: string,
): React.ReactNode {
	const value = getNestedValue(item, fieldPath);

	// Handle null/undefined values
	if (value === null || value === undefined || value === "") {
		return <span className="text-muted-foreground text-xs">—</span>;
	}

	switch (columnFormat) {
		case "date":
			return <span className="text-xs">{formatDate(value)}</span>;

		case "currency":
			return (
				<span className="font-mono text-xs tabular-nums">
					{formatCurrency(value)}
				</span>
			);

		case "number":
			return (
				<span className="font-mono text-xs tabular-nums">
					{formatNumber(value)}
				</span>
			);

		case "badge":
			// Handle boolean values
			if (typeof value === "boolean") {
				return (
					<Badge variant={value ? "default" : "secondary"}>
						{value ? "Yes" : "No"}
					</Badge>
				);
			}
			// Handle string values as badges
			return (
				<Badge className="capitalize" variant="outline">
					{String(value).replace(/_/g, " ")}
				</Badge>
			);
		default: {
			// Truncate long text
			const text = String(value);
			const truncated = text.length > 50 ? `${text.slice(0, 50)}...` : text;
			return (
				<span className="text-xs" title={text}>
					{truncated}
				</span>
			);
		}
	}
}

/**
 * Get width class for custom column
 */
export function getColumnWidthClass(width?: string): string {
	switch (width) {
		case "sm":
			return "w-32";
		case "md":
			return "w-48";
		case "lg":
			return "w-64";
		case "xl":
			return "w-96";
		default:
			return "flex-1";
	}
}
