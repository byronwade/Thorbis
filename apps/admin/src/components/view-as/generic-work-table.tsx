/**
 * Generic Work Table Component
 *
 * Reusable table component for displaying work section data in view-as mode.
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ColumnConfig {
	header: string;
	accessor: string | ((row: any) => any);
	align?: "left" | "right" | "center";
	format?: (value: any) => string | React.ReactNode;
}

interface GenericWorkTableProps {
	data: any[];
	totalCount: number;
	columns: ColumnConfig[];
	emptyMessage?: string;
	actionsRenderer?: (row: any) => React.ReactNode; // Optional actions column
}

export function GenericWorkTable({
	data,
	totalCount,
	columns,
	emptyMessage = "No data found",
	actionsRenderer,
}: GenericWorkTableProps) {
	const getValue = (row: any, accessor: string | ((row: any) => any)) => {
		if (typeof accessor === "function") {
			return accessor(row);
		}
		return row[accessor];
	};

	// Calculate total columns including actions if present
	const totalColumns = columns.length + (actionsRenderer ? 1 : 0);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((col, idx) => (
							<TableHead
								key={idx}
								className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
							>
								{col.header}
							</TableHead>
						))}
						{actionsRenderer && (
							<TableHead className="w-[50px]">Actions</TableHead>
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 ? (
						<TableRow>
							<TableCell colSpan={totalColumns} className="text-center py-8 text-muted-foreground">
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						data.map((row, rowIdx) => (
							<TableRow key={row.id || rowIdx}>
								{columns.map((col, colIdx) => {
									const value = getValue(row, col.accessor);
									const formatted = col.format ? col.format(value) : value;

									return (
										<TableCell
											key={colIdx}
											className={
												col.align === "right"
													? "text-right"
													: col.align === "center"
														? "text-center"
														: ""
											}
										>
											{formatted || "—"}
										</TableCell>
									);
								})}
								{actionsRenderer && (
									<TableCell>
										{actionsRenderer(row)}
									</TableCell>
								)}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			<div className="p-4 text-sm text-muted-foreground">
				Showing {data.length} of {totalCount} items
			</div>
		</div>
	);
}

// Common formatters
export const formatters = {
	currency: (cents: number | null) => {
		if (cents === null) return "$0.00";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);
	},

	date: (dateString: string | null) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleDateString();
	},

	datetime: (dateString: string | null) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleString();
	},

	status: (status: string | null, statusMap?: Record<string, { variant: any; label: string }>) => {
		if (!status) return <Badge variant="outline">Unknown</Badge>;

		const defaultMap: Record<string, { variant: any; label: string }> = {
			active: { variant: "default", label: "Active" },
			completed: { variant: "outline", label: "Completed" },
			pending: { variant: "secondary", label: "Pending" },
			cancelled: { variant: "destructive", label: "Cancelled" },
			draft: { variant: "secondary", label: "Draft" },
		};

		const map = statusMap || defaultMap;
		const config = map[status] || { variant: "outline", label: status };

		return <Badge variant={config.variant}>{config.label}</Badge>;
	},

	customer: (customer: any) => {
		if (!customer) return "Unknown";
		if (Array.isArray(customer)) customer = customer[0];
		return customer?.display_name || [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || "Unknown";
	},
};
