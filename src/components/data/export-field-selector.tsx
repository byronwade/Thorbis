"use client";

/**
 * Export Field Selector Component
 *
 * Allows users to select which fields to include in export
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Field {
  id: string;
  label: string;
  description?: string;
  category?: string;
}

interface ExportFieldSelectorProps {
  fields: Field[];
  onSelectionChange?: (selectedFields: string[]) => void;
}

export function ExportFieldSelector({
  fields,
  onSelectionChange,
}: ExportFieldSelectorProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    fields.map((f) => f.id)
  );

  const handleToggle = (fieldId: string) => {
    const newSelection = selectedFields.includes(fieldId)
      ? selectedFields.filter((id) => id !== fieldId)
      : [...selectedFields, fieldId];

    setSelectedFields(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectAll = () => {
    const allFieldIds = fields.map((f) => f.id);
    setSelectedFields(allFieldIds);
    onSelectionChange?.(allFieldIds);
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
    onSelectionChange?.([]);
  };

  // Group fields by category
  const fieldsByCategory = fields.reduce<Record<string, Field[]>>(
    (acc, field) => {
      const category = field.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">Select Fields</h3>
          <p className="text-muted-foreground text-xs">
            Choose which fields to include in your export
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSelectAll} size="sm" variant="outline">
            Select All
          </Button>
          <Button onClick={handleDeselectAll} size="sm" variant="outline">
            Deselect All
          </Button>
        </div>
      </div>

      {/* Field Selection */}
      <div className="space-y-4">
        {Object.entries(fieldsByCategory).map(([category, categoryFields]) => (
          <div className="rounded-lg border p-4" key={category}>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-sm">{category}</h4>
              <Badge>
                {
                  categoryFields.filter((f) => selectedFields.includes(f.id))
                    .length
                }{" "}
                / {categoryFields.length}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {categoryFields.map((field) => (
                <div
                  className="flex items-start space-x-2 rounded-lg border p-3"
                  key={field.id}
                >
                  <Checkbox
                    checked={selectedFields.includes(field.id)}
                    id={field.id}
                    onCheckedChange={() => handleToggle(field.id)}
                  />
                  <div className="flex-1">
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor={field.id}
                    >
                      {field.label}
                    </Label>
                    {field.description && (
                      <p className="text-muted-foreground text-xs">
                        {field.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-blue-500/50 bg-blue-500/5 p-4">
        <p className="text-muted-foreground text-sm">
          <strong>{selectedFields.length}</strong> of{" "}
          <strong>{fields.length}</strong> fields selected
        </p>
      </div>
    </div>
  );
}
