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

import { useEffect, useMemo, useState } from "react";
import { Columns, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTableColumnsStore } from "@/lib/stores/datatable-columns-store";
import { useCustomColumnsStore } from "@/lib/stores/custom-columns-store";
import { ColumnBuilderDialog } from "@/components/ui/column-builder-dialog";

export type ColumnVisibilityItem = {
  key: string;
  label: string;
};

type ColumnVisibilityMenuProps = {
  /** Entity type (e.g., "appointments", "jobs", "customers") */
  entity: string;
  /** List of columns that can be toggled */
  columns: ColumnVisibilityItem[];
  /** Optional custom trigger button */
  trigger?: React.ReactNode;
};

export function ColumnVisibilityMenu({
  entity,
  columns,
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
    (state) => state.isColumnVisible
  );
  const toggleColumn = useDataTableColumnsStore((state) => state.toggleColumn);
  const showAllColumns = useDataTableColumnsStore(
    (state) => state.showAllColumns
  );
  const hideAllColumns = useDataTableColumnsStore(
    (state) => state.hideAllColumns
  );

  // Custom columns store - get all columns and memoize
  const allCustomColumns = useCustomColumnsStore((state) => state.columns);
  const removeColumn = useCustomColumnsStore((state) => state.removeColumn);

  // Memoize custom columns for this entity to prevent re-renders
  const customColumns = useMemo(
    () => allCustomColumns[entity] || [],
    [allCustomColumns, entity]
  );

  // Count visible columns
  const visibleCount = columns.filter((col) =>
    isColumnVisible(entity, col.key)
  ).length;
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
                <span className="ml-1.5 text-muted-foreground text-xs">
                  ({visibleCount}/{columns.length})
                </span>
              )}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Column Visibility</span>
            {mounted && (
              <span className="font-normal text-muted-foreground text-xs">
                {visibleCount}/{columns.length}
              </span>
            )}
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
        <div className="flex gap-1 px-2 py-1">
          <Button
            className="flex-1 h-7 text-xs"
            disabled={allVisible}
            onClick={() => showAllColumns(entity, columns.map((c) => c.key))}
            size="sm"
            variant="ghost"
          >
            <Eye className="mr-1.5 h-3 w-3" />
            Show All
          </Button>
          <Button
            className="flex-1 h-7 text-xs"
            disabled={noneVisible}
            onClick={() => hideAllColumns(entity, columns.map((c) => c.key))}
            size="sm"
            variant="ghost"
          >
            <EyeOff className="mr-1.5 h-3 w-3" />
            Hide All
          </Button>
        </div>

        <DropdownMenuSeparator />

        {/* Column List */}
        <div className="max-h-[300px] overflow-y-auto">
          {columns.map((column) => {
            const visible = isColumnVisible(entity, column.key);
            return (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visible}
                onCheckedChange={() => toggleColumn(entity, column.key)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            );
          })}

          {/* Custom Columns Section */}
          {customColumns && customColumns.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Custom Columns
              </DropdownMenuLabel>
              {customColumns.map((column) => {
                const visible = isColumnVisible(entity, column.id);
                return (
                  <div key={column.id} className="relative group">
                    <DropdownMenuCheckboxItem
                      checked={visible}
                      onCheckedChange={() => toggleColumn(entity, column.id)}
                      className="pr-8"
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColumn(entity, column.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Column Builder Dialog */}
    <ColumnBuilderDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      entity={entity}
    />
    </>
  );
}
