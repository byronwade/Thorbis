export type RowHighlight = {
	isHighlighted: boolean;
	highlightClass: string;
};

/**
 * Generic row highlight logic for DataTables.
 * Adjust the status lists as needed for specific tables.
 */
export function getRowHighlight(item: any): RowHighlight {
	const status = (item?.status ?? "").toString().toLowerCase();
	const badStatuses = ["bad", "overdue", "error", "failed", "rejected"];
	const goodStatuses = [
		"good",
		"completed",
		"success",
		"ok",
		"active",
		"approved",
	];

	if (badStatuses.includes(status)) {
		return {
			isHighlighted: true,
			highlightClass: "bg-destructive/10 text-destructive",
		};
	}
	if (goodStatuses.includes(status)) {
		return {
			isHighlighted: true,
			highlightClass: "bg-success/10 text-success",
		};
	}
	return { isHighlighted: false, highlightClass: "" };
}
