"use client";

/**
 * ColumnVisibilityMenu - Toolbar Component for Column Management
 *
 * Features:
 * - Dropdown menu for toggling column visibility
 * - Checkbox list of all hideable columns
 * - Quick actions: Show All / Hide All
 * - Integrates with Zustand store for persistence
 * - Excel-style column management
 *
 * Performance:
 * - Client component (uses state and interactions)
 * - Selective Zustand subscriptions
 * - Minimal re-renders
 */

import { Columns, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ColumnBuilderDialog } from "@/components/ui/column-builder-dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomColumnsStore } from "@/lib/stores/custom-columns-store";
import { useDataTableColumnsStore } from "@/lib/stores/datatable-columns-store";

export type ColumnVisibilityItem = {
	key: string;
	label: string;
};

type ColumnVisibilityMenuProps = {
	/** Entity type (e.g., "appointments", "jobs", "customers") */
	entity: string;
	/** List of columns that can be toggled */
	columns: ColumnVisibilityItem[];
	/** List of critical columns (always visible, shown for reference) */
	criticalColumns?: ColumnVisibilityItem[];
	/** Optional custom trigger button */
	trigger?: React.ReactNode;
};

export function ColumnVisibilityMenu({
	entity,
	columns,
	criticalColumns = [],
	trigger,
}: ColumnVisibilityMenuProps) {
	// Mounted state to prevent hydration mismatch
	const [mounted, setMounted] = useState(false);

	// Dialog state
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Zustand stores
	const isColumnVisible = useDataTableColumnsStore(
		(state) => state.isColumnVisible,
	);
	const toggleColumn = useDataTableColumnsStore((state) => state.toggleColumn);
	const showAllColumns = useDataTableColumnsStore(
		(state) => state.showAllColumns,
	);
	const hideAllColumns = useDataTableColumnsStore(
		(state) => state.hideAllColumns,
	);
	const resetEntity = useDataTableColumnsStore((state) => state.resetEntity);

	// Subscribe to column visibility state to trigger re-renders when columns are toggled
	const columnVisibilityState = useDataTableColumnsStore((state) =>
		entity ? state.entities[entity] : null,
	);

	// Custom columns store - get all columns and memoize
	const allCustomColumns = useCustomColumnsStore((state) => state.columns);
	const removeColumn = useCustomColumnsStore((state) => state.removeColumn);

	// Memoize custom columns for this entity to prevent re-renders
	const customColumns = useMemo(
		() => allCustomColumns[entity] || [],
		[allCustomColumns, entity],
	);

	// Count visible columns (recompute when visibility state changes)
	const visibleCount = useMemo(
		() => columns.filter((col) => isColumnVisible(entity, col.key)).length,
		[columns, entity, isColumnVisible],
	);
	const allVisible = visibleCount === columns.length;
	const noneVisible = visibleCount === 0;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{trigger || (
						<Button size="sm" variant="outline">
							<Columns className="mr-2 h-4 w-4" />
							Columns
							{mounted && visibleCount < columns.length && (
								<span className="text-muted-foreground ml-1.5 text-xs">
									({visibleCount}/{columns.length})
								</span>
							)}
						</Button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-64">
					<DropdownMenuLabel>
						<div className="flex items-center justify-between">
							<span>Optional Columns</span>
							{mounted && columns.length > 0 && (
								<span className="text-muted-foreground text-xs font-normal">
									{visibleCount}/{columns.length}
								</span>
							)}
						</div>
						<p className="text-muted-foreground mt-1 text-xs leading-tight font-normal">
							Critical columns are always visible
						</p>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />

					{/* Add Custom Column Button */}
					<div className="px-2 py-1">
						<Button
							className="w-full justify-start text-xs"
							onClick={() => setDialogOpen(true)}
							size="sm"
							variant="outline"
						>
							<Plus className="mr-2 h-3.5 w-3.5" />
							Add Custom Column
						</Button>
					</div>

					<DropdownMenuSeparator />

					{/* Quick Actions */}
					{columns.length > 0 && (
						<>
							<div className="grid grid-cols-2 gap-1 px-2 py-1">
								<Button
									className="h-7 text-xs"
									disabled={allVisible}
									onClick={() =>
										showAllColumns(
											entity,
											columns.map((c) => c.key),
										)
									}
									size="sm"
									variant="ghost"
								>
									<Eye className="mr-1.5 h-3 w-3" />
									Show All
								</Button>
								<Button
									className="h-7 text-xs"
									disabled={noneVisible}
									onClick={() =>
										hideAllColumns(
											entity,
											columns.map((c) => c.key),
										)
									}
									size="sm"
									variant="ghost"
								>
									<EyeOff className="mr-1.5 h-3 w-3" />
									Hide All
								</Button>
							</div>
							<div className="px-2 pb-1">
								<Button
									className="h-7 w-full text-xs"
									onClick={() => {
										resetEntity(entity);
										// Re-initialize with all columns visible (default state)
										showAllColumns(
											entity,
											columns.map((c) => c.key),
										);
									}}
									size="sm"
									variant="ghost"
								>
									Reset to Default
								</Button>
							</div>
							<DropdownMenuSeparator />
						</>
					)}

					{/* Critical Columns Section (Always Visible) */}
					{criticalColumns.length > 0 && (
						<>
							<div className="px-2 py-2">
								<div className="text-muted-foreground mb-2 text-xs font-medium">
									Always Visible (Critical)
								</div>
								{criticalColumns.map((column) => (
									<div
										className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
										key={column.key}
									>
										<div className="border-primary bg-primary flex h-4 w-4 items-center justify-center rounded-sm border">
											<svg
												className="text-primary-foreground h-3 w-3"
												fill="none"
												stroke="currentColor"
												strokeWidth={3}
												viewBox="0 0 24 24"
											>
												<path
													d="M5 13l4 4L19 7"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
										<span className="text-sm font-medium">{column.label}</span>
										<span className="text-muted-foreground ml-auto text-xs">
											Always
										</span>
									</div>
								))}
							</div>
							<DropdownMenuSeparator />
						</>
					)}

					{columns.length === 0 && criticalColumns.length === 0 && (
						<>
							<div className="text-muted-foreground px-2 py-3 text-center text-xs">
								No columns available to customize.
							</div>
							<DropdownMenuSeparator />
						</>
					)}

					{/* Optional Columns Section */}
					{columns.length > 0 && (
						<>
							{criticalColumns.length > 0 && (
								<div className="text-muted-foreground px-2 pt-1 pb-2 text-xs font-medium">
									Optional Columns
								</div>
							)}
							<div className="max-h-[300px] overflow-y-auto">
								{mounted &&
									columns.map((column) => {
										// Get fresh visibility state for each render
										const visible = columnVisibilityState?.[column.key] ?? true;
										return (
											<DropdownMenuCheckboxItem
												checked={visible}
												className="cursor-pointer"
												key={`${column.key}-${visible}`}
												onCheckedChange={() => toggleColumn(entity, column.key)}
											>
												<span
													className={
														visible ? "font-medium" : "text-muted-foreground"
													}
												>
													{column.label}
												</span>
											</DropdownMenuCheckboxItem>
										);
									})}

								{/* Custom Columns Section */}
								{customColumns && customColumns.length > 0 && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuLabel className="text-muted-foreground text-xs">
											Custom Columns
										</DropdownMenuLabel>
										{mounted &&
											customColumns.map((column) => {
												// Get fresh visibility state for each render
												const visible =
													columnVisibilityState?.[column.id] ?? true;
												return (
													<div
														className="group relative"
														key={`${column.id}-${visible}`}
													>
														<DropdownMenuCheckboxItem
															checked={visible}
															className="cursor-pointer pr-8"
															onCheckedChange={() =>
																toggleColumn(entity, column.id)
															}
														>
															<span
																className={
																	visible
																		? "font-medium"
																		: "text-muted-foreground"
																}
															>
																{column.label}
															</span>
														</DropdownMenuCheckboxItem>
														<Button
															className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
															onClick={(e) => {
																e.stopPropagation();
																removeColumn(entity, column.id);
															}}
															size="icon"
															variant="ghost"
														>
															<Trash2 className="text-destructive h-3 w-3" />
														</Button>
													</div>
												);
											})}
									</>
								)}
							</div>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Column Builder Dialog */}
			<ColumnBuilderDialog
				entity={entity}
				onOpenChange={setDialogOpen}
				open={dialogOpen}
			/>
		</>
	);
}
