"use client";

import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	ChevronUp,
	Search,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
	key: string;
	header: string;
	sortable?: boolean;
	filterable?: boolean;
	render?: (item: T) => React.ReactNode;
	className?: string;
};

type DataTableProps<T> = {
	data: T[];
	columns: DataTableColumn<T>[];
	keyField: keyof T;
	itemsPerPage?: number;
	searchPlaceholder?: string;
	emptyMessage?: string;
};

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
	data,
	columns,
	keyField,
	itemsPerPage = 10,
	searchPlaceholder = "Search...",
	emptyMessage = "No results found.",
}: DataTableProps<T>) {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Filter data based on search term
	const filteredData = searchTerm
		? data.filter((item) =>
				columns.some((col) => {
					if (!col.filterable) {
						return false;
					}
					const value = item[col.key];
					if (value === null || value === undefined) {
						return false;
					}
					return String(value).toLowerCase().includes(searchTerm.toLowerCase());
				})
			)
		: data;

	// Sort data
	const sortedData = [...filteredData].sort((a, b) => {
		if (!(sortColumn && sortDirection)) {
			return 0;
		}

		const aVal = a[sortColumn];
		const bVal = b[sortColumn];

		if (aVal === null || aVal === undefined) {
			return 1;
		}
		if (bVal === null || bVal === undefined) {
			return -1;
		}

		const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
		return sortDirection === "asc" ? comparison : -comparison;
	});

	// Paginate data
	const totalPages = Math.ceil(sortedData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedData = sortedData.slice(startIndex, endIndex);

	const handleSort = (columnKey: string) => {
		const column = columns.find((col) => col.key === columnKey);
		if (!column?.sortable) {
			return;
		}

		if (sortColumn === columnKey) {
			if (sortDirection === "asc") {
				setSortDirection("desc");
			} else if (sortDirection === "desc") {
				setSortColumn(null);
				setSortDirection(null);
			}
		} else {
			setSortColumn(columnKey);
			setSortDirection("asc");
		}
	};

	const getSortIcon = (columnKey: string) => {
		if (sortColumn !== columnKey) {
			return <ChevronsUpDown className="text-muted-foreground ml-2 size-3.5" />;
		}
		if (sortDirection === "asc") {
			return <ChevronUp className="ml-2 size-3.5" />;
		}
		return <ChevronDown className="ml-2 size-3.5" />;
	};

	const goToPage = (page: number) => {
		setCurrentPage(Math.min(Math.max(1, page), totalPages));
	};

	return (
		<div className="space-y-4">
			{/* Search Bar */}
			<div className="flex items-center gap-2">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						className="pl-9"
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setCurrentPage(1);
						}}
						placeholder={searchPlaceholder}
						value={searchTerm}
					/>
					{searchTerm && (
						<Button
							className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
							onClick={() => setSearchTerm("")}
							size="icon"
							variant="ghost"
						>
							<X className="size-3.5" />
						</Button>
					)}
				</div>
			</div>

			{/* Table */}
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead className={column.className} key={column.key}>
									{column.sortable ? (
										<button
											className="hover:text-foreground flex items-center font-medium transition-colors"
											onClick={() => handleSort(column.key)}
											type="button"
										>
											{column.header}
											{getSortIcon(column.key)}
										</button>
									) : (
										<span>{column.header}</span>
									)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedData.length === 0 ? (
							<TableRow>
								<TableCell
									className="text-muted-foreground h-24 text-center"
									colSpan={columns.length}
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						) : (
							paginatedData.map((item) => (
								<TableRow key={String(item[keyField])}>
									{columns.map((column) => (
										<TableCell className={column.className} key={column.key}>
											{column.render ? column.render(item) : String(item[column.key] ?? "")}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-muted-foreground text-sm">
						Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of{" "}
						{sortedData.length} results
					</div>
					<div className="flex items-center gap-2">
						<Button
							disabled={currentPage === 1}
							onClick={() => goToPage(currentPage - 1)}
							size="sm"
							variant="outline"
						>
							<ChevronLeft className="size-4" />
							Previous
						</Button>
						<div className="text-sm">
							Page {currentPage} of {totalPages}
						</div>
						<Button
							disabled={currentPage === totalPages}
							onClick={() => goToPage(currentPage + 1)}
							size="sm"
							variant="outline"
						>
							Next
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
