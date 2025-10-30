"use client";

/**
 * FullWidthDataTable - Reusable Component
 * Gmail-style full-width table layout for all datatables
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with checkboxes
 * - Bulk actions toolbar
 * - Search filtering
 * - Pagination
 * - Unread/status highlighting
 * - Hover effects
 * - Custom column rendering
 */

import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export type ColumnDef<T> = {
  /** Unique identifier for the column */
  key: string;
  /** Column header text */
  header: string;
  /** Custom render function for cell content */
  render: (item: T) => React.ReactNode;
  /** Column width class (e.g., "w-48", "flex-1", "w-32") */
  width?: string;
  /** Whether the column should shrink */
  shrink?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Hide column on mobile */
  hideOnMobile?: boolean;
};

export type BulkAction = {
  /** Action label */
  label: string;
  /** Action icon */
  icon: React.ReactNode;
  /** Action handler */
  onClick: (selectedIds: Set<string>) => void;
  /** Variant style */
  variant?: "default" | "destructive" | "ghost";
};

export type FullWidthDataTableProps<T> = {
  /** Array of data items to display */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Function to extract unique ID from item */
  getItemId: (item: T) => string;
  /** Function to determine if row should be highlighted (e.g., unread) */
  isHighlighted?: (item: T) => boolean;
  /** Function to get highlight background class */
  getHighlightClass?: (item: T) => string;
  /** Handler when row is clicked */
  onRowClick?: (item: T) => void;
  /** Bulk actions to show when items are selected */
  bulkActions?: BulkAction[];
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Function to filter items based on search query */
  searchFilter?: (item: T, query: string) => boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state icon */
  emptyIcon?: React.ReactNode;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Show pagination */
  showPagination?: boolean;
  /** Items per page (default 50) */
  itemsPerPage?: number;
  /** Custom toolbar actions (rendered on right side) */
  toolbarActions?: React.ReactNode;
  /** Enable row selection */
  enableSelection?: boolean;
  /** Custom row className */
  getRowClassName?: (item: T) => string;
};

export function FullWidthDataTable<T>({
  data,
  columns,
  getItemId,
  isHighlighted,
  getHighlightClass,
  onRowClick,
  bulkActions = [],
  searchPlaceholder = "Search...",
  searchFilter,
  emptyMessage = "No items found",
  emptyIcon,
  showRefresh = true,
  onRefresh,
  showPagination = true,
  itemsPerPage = 50,
  toolbarActions,
  enableSelection = true,
  getRowClassName,
}: FullWidthDataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!(searchQuery && searchFilter)) return data;
    return data.filter((item) => searchFilter(item, searchQuery.toLowerCase()));
  }, [data, searchQuery, searchFilter]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(getItemId));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleRowClick = (item: T, event: React.MouseEvent) => {
    // Prevent row click if clicking on checkbox or action buttons
    const target = event.target as HTMLElement;
    if (
      target.closest("[data-no-row-click]") ||
      target.closest("button") ||
      target.closest('[role="checkbox"]')
    ) {
      return;
    }
    onRowClick?.(item);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const isAllSelected =
    selectedIds.size === paginatedData.length && paginatedData.length > 0;

  return (
    <div className="flex flex-col">
      {/* Sticky Top Toolbar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background px-4 py-2">
        {enableSelection && (
          <Checkbox
            aria-label="Select all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
        )}

        {showRefresh && (
          <Button
            onClick={onRefresh}
            size="icon"
            title="Refresh"
            variant="ghost"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}

        {/* Bulk Actions */}
        {selectedIds.size > 0 && bulkActions.length > 0 && (
          <>
            <div className="mx-2 h-4 w-px bg-border" />
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => action.onClick(selectedIds)}
                size="sm"
                variant={action.variant || "ghost"}
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
            <span className="ml-2 text-muted-foreground text-sm">
              {selectedIds.size} selected
            </span>
          </>
        )}

        {/* Right side: Search and Pagination */}
        <div className="ml-auto flex items-center gap-2">
          {toolbarActions}

          {searchFilter && (
            <div className="relative">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="h-9 w-64 pl-8"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                placeholder={searchPlaceholder}
                value={searchQuery}
              />
            </div>
          )}

          {showPagination && (
            <>
              <Button
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                size="icon"
                variant="ghost"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                size="icon"
                variant="ghost"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1">
        {paginatedData.length === 0 ? (
          <div className="flex h-full min-h-[50vh] items-center justify-center px-4 py-12 md:min-h-[60vh]">
            <div className="mx-auto w-full max-w-md space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {emptyIcon}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{emptyMessage}</h3>
                {searchQuery && (
                  <p className="text-muted-foreground text-sm">
                    No results found for "{searchQuery}". Try adjusting your
                    search terms.
                  </p>
                )}
                {!searchQuery && (
                  <p className="text-muted-foreground text-sm">
                    Get started by creating your first item.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {paginatedData.map((item) => {
              const itemId = getItemId(item);
              const isSelected = selectedIds.has(itemId);
              const highlighted = isHighlighted?.(item);
              const highlightClass = highlighted
                ? getHighlightClass?.(item) ||
                  "bg-blue-50/30 dark:bg-blue-950/10"
                : "";
              const customRowClass = getRowClassName?.(item) || "";

              return (
                <div
                  className={`group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40 ${highlightClass} ${
                    isSelected ? "bg-muted/50" : ""
                  } ${customRowClass}`}
                  key={itemId}
                  onClick={(e) => handleRowClick(item, e)}
                >
                  {/* Selection Checkbox */}
                  {enableSelection && (
                    <div className="flex items-center" data-no-row-click>
                      <Checkbox
                        aria-label={`Select item ${itemId}`}
                        checked={isSelected}
                        onCheckedChange={() => handleSelectItem(itemId)}
                      />
                    </div>
                  )}

                  {/* Columns */}
                  {columns.map((column) => {
                    const widthClass = column.width || "flex-1";
                    const shrinkClass = column.shrink ? "shrink-0" : "";
                    const alignClass =
                      column.align === "right"
                        ? "justify-end text-right"
                        : column.align === "center"
                          ? "justify-center text-center"
                          : "justify-start text-left";
                    const hideClass = column.hideOnMobile
                      ? "hidden md:flex"
                      : "flex";

                    return (
                      <div
                        className={`${hideClass} ${widthClass} ${shrinkClass} ${alignClass} min-w-0 items-center`}
                        key={column.key}
                      >
                        {column.render(item)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
