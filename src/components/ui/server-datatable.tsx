/**
 * ServerDataTable - Table with Server-Side Pagination
 *
 * USES:
 * - useServerPagination hook for state management
 * - Server-side filtering, sorting, pagination
 * - Optimized for 100,000+ row datasets
 *
 * FEATURES:
 * - Built-in search with debouncing
 * - Column sorting (single column)
 * - Advanced filtering
 * - Configurable page sizes
 * - Selection and bulk actions
 * - Loading states
 * - Error handling
 *
 * PERFORMANCE:
 * - Only loads current page from server
 * - Database handles sorting/filtering (fast indexes)
 * - Low memory usage
 * - Fast initial render
 */

"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseServerPaginationReturn } from "@/lib/hooks/use-server-pagination";

export type ServerColumnDef<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
};

export type BulkAction = {
  label: string;
  icon: React.ReactNode;
  onClick: (selectedIds: Set<string>) => void | Promise<void>;
  variant?: "default" | "destructive" | "ghost";
};

export type ServerDataTableProps<T> = {
  /** Data from useServerPagination hook */
  pagination: UseServerPaginationReturn<T>;
  /** Column definitions */
  columns: ServerColumnDef<T>[];
  /** Function to get unique ID for each row */
  getItemId: (item: T) => string;
  /** Highlight specific rows */
  isHighlighted?: (item: T) => boolean;
  getHighlightClass?: (item: T) => string;
  /** Handle row clicks */
  onRowClick?: (item: T) => void;
  /** Bulk actions for selected rows */
  bulkActions?: BulkAction[];
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  /** Custom toolbar actions */
  toolbarActions?: React.ReactNode;
  /** Enable row selection */
  enableSelection?: boolean;
  /** Custom row className */
  getRowClassName?: (item: T) => string;
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Available page sizes */
  pageSizeOptions?: number[];
};

// Memoized table row
const TableRowInner = function TableRow<T>({
  item,
  columns,
  isSelected,
  isHighlighted,
  highlightClass,
  rowClassName,
  onSelectItem,
  onRowClick,
  enableSelection,
  itemId,
}: {
  item: T;
  columns: ServerColumnDef<T>[];
  isSelected: boolean;
  isHighlighted?: boolean;
  highlightClass?: string;
  rowClassName?: string;
  onSelectItem: (id: string) => void;
  onRowClick?: (item: T) => void;
  enableSelection?: boolean;
  itemId: string;
}) {
  const handleSelect = useCallback(
    (checked: boolean) => {
      onSelectItem(itemId);
    },
    [itemId, onSelectItem]
  );

  const handleClick = useCallback(() => {
    if (onRowClick) {
      onRowClick(item);
    }
  }, [item, onRowClick]);

  return (
    <tr
      className={`border-border/60 border-b transition-colors hover:bg-secondary/30 dark:hover:bg-secondary/20 ${
        isHighlighted ? highlightClass : ""
      } ${rowClassName || ""} ${onRowClick ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      {enableSelection && (
        <td className="w-12 px-4 py-3">
          <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
        </td>
      )}
      {columns.map((column) => (
        <td
          className={`px-4 py-3 ${column.hideOnMobile ? "hidden md:table-cell" : ""} ${
            column.align === "right"
              ? "text-right"
              : column.align === "center"
                ? "text-center"
                : ""
          }`}
          key={column.key}
          style={{ width: column.width }}
        >
          {column.render(item)}
        </td>
      ))}
    </tr>
  );
};

const TableRow = memo(TableRowInner) as typeof TableRowInner;

export function ServerDataTable<T>({
  pagination,
  columns,
  getItemId,
  isHighlighted,
  getHighlightClass,
  onRowClick,
  bulkActions = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  emptyIcon,
  emptyAction,
  toolbarActions,
  enableSelection = true,
  getRowClassName,
  showPageSizeSelector = true,
  pageSizeOptions = [25, 50, 100, 200],
}: ServerDataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    data,
    isLoading,
    error,
    pagination: paginationState,
    sorting,
    search,
    refetch,
  } = pagination;

  // Selection handlers
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(data.map(getItemId)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [data, getItemId]
  );

  const handleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Sort icon helper
  const getSortIcon = (columnKey: string) => {
    if (sorting.sortBy !== columnKey) {
      return <ChevronsUpDown className="ml-2 size-3.5 text-muted-foreground" />;
    }
    if (sorting.sortDirection === "asc") {
      return <ChevronUp className="ml-2 size-3.5" />;
    }
    return <ChevronDown className="ml-2 size-3.5" />;
  };

  const allSelected =
    data.length > 0 && data.every((item) => selectedIds.has(getItemId(item)));

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => search.setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            value={search.query}
          />
          {search.query && (
            <Button
              className="-translate-y-1/2 absolute top-1/2 right-1 size-7"
              onClick={search.clearQuery}
              size="icon"
              variant="ghost"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        {/* Refresh */}
        <Button
          disabled={isLoading}
          onClick={refetch}
          size="sm"
          variant="outline"
        >
          <RefreshCw
            className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>

        {/* Custom toolbar actions */}
        {toolbarActions}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && bulkActions.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-primary p-4 text-primary-foreground">
          <span className="text-sm">{selectedIds.size} selected</span>
          <div className="ml-auto flex gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => action.onClick(selectedIds)}
                size="sm"
                variant={action.variant || "default"}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full bg-card">
            <thead className="border-border border-b bg-muted/60">
              <tr>
                {enableSelection && (
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      aria-label="Select all"
                      checked={allSelected}
                      disabled={isLoading}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    className={`px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider ${
                      column.hideOnMobile ? "hidden md:table-cell" : ""
                    }`}
                    key={column.key}
                    style={{ width: column.width }}
                  >
                    {column.sortable ? (
                      <button
                        className="flex items-center font-medium transition-colors hover:text-foreground"
                        disabled={isLoading}
                        onClick={() => sorting.setSort(column.key)}
                        type="button"
                      >
                        {column.header}
                        {getSortIcon(column.key)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td
                    className="py-12 text-center"
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="size-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    className="py-12 text-center"
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                  >
                    <div className="flex flex-col items-center gap-4">
                      {emptyIcon}
                      <p className="text-muted-foreground">{emptyMessage}</p>
                      {emptyAction}
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item: T) => {
                  const itemId = getItemId(item);
                  return (
                    <TableRow
                      columns={columns}
                      enableSelection={enableSelection}
                      highlightClass={getHighlightClass?.(item)}
                      isHighlighted={isHighlighted?.(item)}
                      isSelected={selectedIds.has(itemId)}
                      item={item}
                      itemId={itemId}
                      key={itemId}
                      onRowClick={onRowClick}
                      onSelectItem={handleSelectItem}
                      rowClassName={getRowClassName?.(item)}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground text-sm">
            Showing{" "}
            {data.length === 0
              ? 0
              : (paginationState.page - 1) * paginationState.pageSize + 1}{" "}
            to{" "}
            {Math.min(
              paginationState.page * paginationState.pageSize,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount.toLocaleString()} results
          </div>

          {showPageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Rows per page:
              </span>
              <Select
                onValueChange={(value) =>
                  paginationState.setPageSize(Number(value))
                }
                value={paginationState.pageSize.toString()}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={paginationState.page === 1 || isLoading}
            onClick={paginationState.previousPage}
            size="sm"
            variant="outline"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {paginationState.page} of {paginationState.totalPages}
          </span>
          <Button
            disabled={
              paginationState.page === paginationState.totalPages || isLoading
            }
            onClick={paginationState.nextPage}
            size="sm"
            variant="outline"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export memoized version
export const MemoizedServerDataTable = memo(
  ServerDataTable
) as typeof ServerDataTable;
