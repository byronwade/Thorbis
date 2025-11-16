"use client";

/**
 * Column Builder Dialog - Client Component
 *
 * Allows users to add custom database fields as columns in datatables.
 *
 * Features:
 * - Field selector with all available database fields
 * - Custom label input
 * - Width selection
 * - Format selection (auto-recommended based on field type)
 * - Sortable toggle
 * - Live preview
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { renderCustomColumn } from "@/lib/datatable/custom-column-renderer";
import {
  type FieldDefinition,
  getAvailableFields,
} from "@/lib/datatable/field-introspection";
import type { CustomColumn } from "@/lib/stores/custom-columns-store";
import { useCustomColumnsStore } from "@/lib/stores/custom-columns-store";

type ColumnBuilderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: string; // Entity type (e.g., "appointments", "jobs")
};

export function ColumnBuilderDialog({
  open,
  onOpenChange,
  entity,
}: ColumnBuilderDialogProps) {
  const addColumn = useCustomColumnsStore((state) => state.addColumn);

  // Available fields for this entity
  const availableFields = getAvailableFields(entity);

  // Form state
  const [selectedField, setSelectedField] = useState<FieldDefinition | null>(
    null
  );
  const [label, setLabel] = useState("");
  const [width, setWidth] = useState<string>("auto");
  const [format, setFormat] = useState<CustomColumn["format"]>("text");
  const [sortable, setSortable] = useState(true);

  // Update label and format when field is selected
  const handleFieldSelect = (fieldPath: string) => {
    const field = availableFields.find((f) => f.path === fieldPath);
    if (field) {
      setSelectedField(field);
      setLabel(field.label); // Auto-populate label
      setFormat(field.recommended || "text"); // Auto-select recommended format
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (!selectedField) return;

    const newColumn: CustomColumn = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fieldPath: selectedField.path,
      label,
      width,
      format,
      sortable,
    };

    addColumn(entity, newColumn);

    // Reset form
    setSelectedField(null);
    setLabel("");
    setWidth("auto");
    setFormat("text");
    setSortable(true);

    // Close dialog
    onOpenChange(false);
  };

  // Preview data - use a fixed date to avoid PPR issues
  const previewData = {
    // Sample data for preview
    string: "Sample Text",
    number: 12_345,
    date: "2024-01-15T10:30:00.000Z", // Fixed date for preview
    boolean: true,
    relation: "Related Value",
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Custom Column</DialogTitle>
          <DialogDescription>
            Select a database field to add as a custom column to your table. The
            column will appear after existing columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Field Selector */}
          <div className="space-y-2">
            <Label htmlFor="field">Database Field</Label>
            <Select
              onValueChange={handleFieldSelect}
              value={selectedField?.path || ""}
            >
              <SelectTrigger className="w-full" id="field">
                <SelectValue placeholder="Select a field..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {availableFields.map((field) => (
                  <SelectItem key={field.path} value={field.path}>
                    {field.label}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({field.path})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="label">Column Label</Label>
            <Input
              id="label"
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter column label..."
              value={label}
            />
          </div>

          {/* Width Select */}
          <div className="space-y-2">
            <Label htmlFor="width">Column Width</Label>
            <Select onValueChange={setWidth} value={width}>
              <SelectTrigger id="width">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Flexible)</SelectItem>
                <SelectItem value="sm">Small (128px)</SelectItem>
                <SelectItem value="md">Medium (192px)</SelectItem>
                <SelectItem value="lg">Large (256px)</SelectItem>
                <SelectItem value="xl">X-Large (384px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Select */}
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select
              onValueChange={(value) =>
                setFormat(value as CustomColumn["format"])
              }
              value={format}
            >
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="date">Date/Time</SelectItem>
                <SelectItem value="currency">Currency</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="badge">Badge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sortable Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={sortable}
              id="sortable"
              onCheckedChange={(checked) => setSortable(checked === true)}
            />
            <Label
              className="cursor-pointer font-normal text-sm"
              htmlFor="sortable"
            >
              Enable sorting for this column
            </Label>
          </div>

          {/* Preview */}
          {selectedField && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <Label>Preview</Label>
              <div className="flex items-center gap-4">
                <div className="font-semibold text-muted-foreground text-xs">
                  {label || selectedField.label}:
                </div>
                <div>
                  {renderCustomColumn(previewData, selectedField.type, format)}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={!(selectedField && label.trim())}
            onClick={handleSubmit}
          >
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
