"use client";

/**
 * Import Preview Table Component
 *
 * Displays preview of import data with error highlighting
 * Supports inline editing and validation
 */

import { AlertCircle, CheckCircle, Edit } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ValidationError {
  row: number;
  field: string;
  error: string;
}

interface PreviewRow {
  rowNumber: number;
  data: Record<string, unknown>;
  errors: ValidationError[];
  valid: boolean;
}

interface ImportPreviewTableProps {
  rows: PreviewRow[];
  maxRows?: number;
  onEditRow?: (rowNumber: number, field: string, value: string) => void;
}

export function ImportPreviewTable({
  rows,
  maxRows = 10,
  onEditRow,
}: ImportPreviewTableProps) {
  const [editingCell, setEditingCell] = useState<{
    row: number;
    field: string;
  } | null>(null);

  const displayRows = rows.slice(0, maxRows);
  const headers = rows[0] ? Object.keys(rows[0].data) : [];

  const getCellError = (row: PreviewRow, field: string) =>
    row.errors.find((err) => err.field === field);

  const handleCellEdit = (rowNumber: number, field: string, value: string) => {
    onEditRow?.(rowNumber, field, value);
    setEditingCell(null);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex gap-3">
          <Badge className="bg-green-500">
            {rows.filter((r) => r.valid).length} Valid
          </Badge>
          <Badge className="bg-red-500">
            {rows.filter((r) => !r.valid).length} Errors
          </Badge>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-12">Status</TableHead>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRows.map((row) => (
                <TableRow
                  className={row.valid ? "" : "bg-red-50 dark:bg-red-950/20"}
                  key={row.rowNumber}
                >
                  {/* Row Number */}
                  <TableCell className="font-medium">{row.rowNumber}</TableCell>

                  {/* Status Icon */}
                  <TableCell>
                    {row.valid ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="size-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {row.errors.map((err, i) => (
                              <p className="text-xs" key={i}>
                                {err.field}: {err.error}
                              </p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>

                  {/* Data Cells */}
                  {headers.map((header) => {
                    const cellError = getCellError(row, header);
                    const isEditing =
                      editingCell?.row === row.rowNumber &&
                      editingCell?.field === header;

                    return (
                      <TableCell
                        className={
                          cellError
                            ? "border-2 border-red-500 bg-red-50 dark:bg-red-950/20"
                            : ""
                        }
                        key={header}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            className="w-full rounded border px-2 py-1 text-sm"
                            defaultValue={String(row.data[header] ?? "")}
                            onBlur={(e) =>
                              handleCellEdit(
                                row.rowNumber,
                                header,
                                e.target.value
                              )
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCellEdit(
                                  row.rowNumber,
                                  header,
                                  e.currentTarget.value
                                );
                              }
                              if (e.key === "Escape") {
                                setEditingCell(null);
                              }
                            }}
                            type="text"
                          />
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">
                              {String(row.data[header] ?? "")}
                            </span>
                            {cellError ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <button
                                    className="shrink-0 opacity-50 hover:opacity-100"
                                    onClick={() =>
                                      setEditingCell({
                                        row: row.rowNumber,
                                        field: header,
                                      })
                                    }
                                    type="button"
                                  >
                                    <Edit className="size-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{cellError.error}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : null}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {rows.length > maxRows && (
          <p className="text-center text-muted-foreground text-sm">
            Showing first {maxRows} of {rows.length} rows
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}
