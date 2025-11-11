"use client";

/**
 * ImportExportDropdown - Universal data management dropdown
 *
 * Provides comprehensive import/export and data management features
 * via an ellipsis menu positioned at the far right of page toolbars.
 *
 * Features:
 * - Import/Export with templates
 * - Bulk actions (edit, delete, archive)
 * - Analysis tools (reports, summaries)
 * - Data management (duplicates, alerts)
 */

import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  BarChart3,
  Calendar,
  Copy,
  Download,
  FileSpreadsheet,
  Mail,
  Merge,
  MoreVertical,
  Pencil,
  Printer,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DataType =
  | "jobs"
  | "invoices"
  | "estimates"
  | "contracts"
  | "purchase-orders"
  | "customers"
  | "pricebook"
  | "materials"
  | "equipment"
  | "schedule"
  | "maintenance-plans"
  | "service-agreements"
  | "service-tickets";

interface ImportExportDropdownProps {
  /** Type of data for import/export operations */
  dataType: DataType;
  /** Optional array of selected record IDs for bulk actions */
  selectedIds?: string[];
  /** Optional callback when bulk action is triggered */
  onBulkAction?: (action: string, ids: string[]) => void;
}

export function ImportExportDropdown({
  dataType,
  selectedIds = [],
  onBulkAction,
}: ImportExportDropdownProps) {
  const hasSelection = selectedIds.length > 0;

  const handleBulkAction = (action: string) => {
    if (onBulkAction) {
      onBulkAction(action, selectedIds);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Data management options"
          className="h-9 w-9"
          size="icon"
          variant="ghost"
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Import/Export Group */}
        <DropdownMenuLabel>Import & Export</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/import/${dataType}`}>
              <Upload className="mr-2 size-4" />
              <span>Import Data</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/export/${dataType}`}>
              <Download className="mr-2 size-4" />
              <span>Export Data</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/templates/${dataType}`}>
              <FileSpreadsheet className="mr-2 size-4" />
              <span>Download Template</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/schedule-export/${dataType}`}>
              <Calendar className="mr-2 size-4" />
              <span>Schedule Export</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Bulk Actions Group */}
        <DropdownMenuLabel>
          Bulk Actions {hasSelection && `(${selectedIds.length})`}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={!hasSelection}
            onClick={() => handleBulkAction("edit")}
          >
            <Pencil className="mr-2 size-4" />
            <span>Bulk Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={!hasSelection}
            onClick={() => handleBulkAction("delete")}
          >
            <Trash2 className="mr-2 size-4" />
            <span>Bulk Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!hasSelection}
            onClick={() => handleBulkAction("archive")}
          >
            <Archive className="mr-2 size-4" />
            <span>Archive Selected</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction("restore")}>
            <ArchiveRestore className="mr-2 size-4" />
            <span>Restore Archived</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Analysis Group */}
        <DropdownMenuLabel>Analysis & Reports</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/report/${dataType}`}>
              <BarChart3 className="mr-2 size-4" />
              <span>Generate Report</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/email-summary/${dataType}`}>
              <Mail className="mr-2 size-4" />
              <span>Email Summary</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.print()}>
            <Printer className="mr-2 size-4" />
            <span>Print View</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Data Management Group */}
        <DropdownMenuLabel>Data Management</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/duplicates/${dataType}`}>
              <Copy className="mr-2 size-4" />
              <span>Find Duplicates</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/merge/${dataType}`}>
              <Merge className="mr-2 size-4" />
              <span>Merge Records</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/data/alerts/${dataType}`}>
              <AlertCircle className="mr-2 size-4" />
              <span>Set up Alerts</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
