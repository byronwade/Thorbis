"use client";

/**
 * Column Mapper Component
 *
 * Allows users to map spreadsheet columns to system fields
 * with drag-and-drop interface
 */

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  id: string;
  name: string;
  required: boolean;
}

interface SpreadsheetColumn {
  index: number;
  name: string;
  preview: string;
}

interface ColumnMapperProps {
  systemColumns: Column[];
  spreadsheetColumns: SpreadsheetColumn[];
  onMappingChange?: (mapping: Record<string, number>) => void;
}

export function ColumnMapper({
  systemColumns,
  spreadsheetColumns,
  onMappingChange,
}: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, number>>({});

  const handleMappingChange = (fieldId: string, columnIndex: number) => {
    const newMapping = { ...mapping, [fieldId]: columnIndex };
    setMapping(newMapping);
    onMappingChange?.(newMapping);
  };

  const isMapped = (fieldId: string) => mapping[fieldId] !== undefined;
  const getMapping = (fieldId: string) => mapping[fieldId];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-medium text-sm">Column Mapping</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Map your spreadsheet columns to the correct fields
        </p>

        <div className="space-y-3">
          {systemColumns.map((column) => (
            <div
              className="flex items-center gap-3 rounded-lg border p-3"
              key={column.id}
            >
              {/* System Field */}
              <div className="flex flex-1 items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded bg-primary/10">
                  <span className="font-medium text-primary text-xs">
                    {column.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{column.name}</p>
                  {column.required && (
                    <Badge className="mt-1" variant="outline">
                      Required
                    </Badge>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="size-4 text-muted-foreground" />

              {/* Spreadsheet Column Selector */}
              <div className="flex-1">
                <Select
                  onValueChange={(value) =>
                    handleMappingChange(column.id, Number.parseInt(value))
                  }
                  value={getMapping(column.id)?.toString()}
                >
                  <SelectTrigger
                    className={isMapped(column.id) ? "border-success" : ""}
                  >
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    {spreadsheetColumns.map((col) => (
                      <SelectItem key={col.index} value={col.index.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Column {col.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({col.preview})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Indicator */}
              {isMapped(column.id) && (
                <div className="flex size-6 items-center justify-center rounded-full bg-success">
                  <Check className="size-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mapping Summary */}
      <div className="flex items-center justify-between rounded-lg border border-primary/50 bg-primary/5 p-4">
        <div>
          <p className="font-medium text-sm">Mapping Progress</p>
          <p className="text-muted-foreground text-xs">
            {Object.keys(mapping).length} of {systemColumns.length} fields
            mapped
          </p>
        </div>
        <Badge className="bg-primary">
          {Math.round(
            (Object.keys(mapping).length / systemColumns.length) * 100
          )}
          %
        </Badge>
      </div>
    </div>
  );
}
