"use client";

/**
 * Advanced Filters Component
 * 
 * Powerful multi-criteria filtering system for data tables
 * - Filter by any field
 * - Multiple filter conditions
 * - Different filter types (text, number, date, select)
 * - Add/remove filters dynamically
 * - Save filter presets
 */

import { Plus, X, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "between"
  | "is_empty"
  | "is_not_empty"
  | "before"
  | "after"
  | "on_or_before"
  | "on_or_after"
  | "in_last"
  | "in_next";

export type FilterType = "text" | "number" | "date" | "select" | "boolean";

export type FilterField = {
  id: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[]; // For select type
};

export type FilterCondition = {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
  value2?: string | number; // For "between" operator
};

type AdvancedFiltersProps = {
  fields: FilterField[];
  conditions: FilterCondition[];
  onChange: (conditions: FilterCondition[]) => void;
  onClear: () => void;
};

const TEXT_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

const NUMBER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "greater_than_or_equal", label: "Greater than or equal" },
  { value: "less_than_or_equal", label: "Less than or equal" },
  { value: "between", label: "Between" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

const DATE_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "Is" },
  { value: "not_equals", label: "Is not" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "on_or_before", label: "On or before" },
  { value: "on_or_after", label: "On or after" },
  { value: "in_last", label: "In the last" },
  { value: "in_next", label: "In the next" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

const SELECT_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "Is" },
  { value: "not_equals", label: "Is not" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export function AdvancedFilters({
  fields,
  conditions,
  onChange,
  onClear,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const addCondition = (fieldId: string) => {
    console.log("➕ Adding filter for field:", fieldId);
    const field = fields.find((f) => f.id === fieldId);
    if (!field) {
      console.error("❌ Field not found:", fieldId);
      return;
    }

    const newCondition: FilterCondition = {
      id: crypto.randomUUID(),
      field: fieldId,
      operator: "equals",
      value: "",
    };

    console.log("➕ New condition created:", newCondition);
    console.log("➕ Calling onChange with:", [...conditions, newCondition]);
    onChange([...conditions, newCondition]);
  };

  const updateCondition = (
    id: string,
    updates: Partial<FilterCondition>
  ) => {
    console.log("🔄 Updating condition:", id, "with:", updates);
    const newConditions = conditions.map((c) => (c.id === id ? { ...c, ...updates } : c));
    console.log("🔄 Updated conditions:", newConditions);
    onChange(newConditions);
  };

  const removeCondition = (id: string) => {
    onChange(conditions.filter((c) => c.id !== id));
  };

  const getOperatorsForField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return TEXT_OPERATORS;

    switch (field.type) {
      case "text":
        return TEXT_OPERATORS;
      case "number":
        return NUMBER_OPERATORS;
      case "date":
        return DATE_OPERATORS;
      case "select":
        return SELECT_OPERATORS;
      case "boolean":
        return SELECT_OPERATORS;
      default:
        return TEXT_OPERATORS;
    }
  };

  const needsValueInput = (operator: FilterOperator) => {
    return operator !== "is_empty" && operator !== "is_not_empty";
  };

  return (
    <div className="space-y-2">
      {/* Filter Conditions */}
      {conditions.length > 0 && (
        <div className="space-y-2">
          {conditions.map((condition, index) => {
            const field = fields.find((f) => f.id === condition.field);
            if (!field) return null;

            const operators = getOperatorsForField(condition.field);
            const showValueInput = needsValueInput(condition.operator);

            return (
              <div
                key={condition.id}
                className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3"
              >
                {index > 0 && (
                  <span className="text-xs text-muted-foreground font-medium">
                    AND
                  </span>
                )}

                {/* Field Selector */}
                <Select
                  value={condition.field}
                  onValueChange={(value) =>
                    updateCondition(condition.id, { field: value })
                  }
                >
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator Selector */}
                <Select
                  value={condition.operator}
                  onValueChange={(value) =>
                    updateCondition(condition.id, {
                      operator: value as FilterOperator,
                    })
                  }
                >
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Value Input */}
                {showValueInput && (
                  <>
                    {field.type === "select" && field.options ? (
                      <Select
                        value={String(condition.value)}
                        onValueChange={(value) =>
                          updateCondition(condition.id, { value })
                        }
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "date" ? (
                      <Input
                        type="date"
                        className="h-8 w-[140px]"
                        value={String(condition.value)}
                        onChange={(e) =>
                          updateCondition(condition.id, {
                            value: e.target.value,
                          })
                        }
                      />
                    ) : field.type === "number" ? (
                      <Input
                        type="number"
                        className="h-8 w-[140px]"
                        value={String(condition.value)}
                        onChange={(e) =>
                          updateCondition(condition.id, {
                            value: e.target.value,
                          })
                        }
                        placeholder="Value..."
                      />
                    ) : (
                      <Input
                        type="text"
                        className="h-8 w-[180px]"
                        value={String(condition.value)}
                        onChange={(e) =>
                          updateCondition(condition.id, {
                            value: e.target.value,
                          })
                        }
                        placeholder="Value..."
                      />
                    )}

                    {/* Second value for "between" operator */}
                    {condition.operator === "between" && (
                      <>
                        <span className="text-xs text-muted-foreground">
                          and
                        </span>
                        <Input
                          type={field.type === "date" ? "date" : "number"}
                          className="h-8 w-[140px]"
                          value={String(condition.value2 || "")}
                          onChange={(e) =>
                            updateCondition(condition.id, {
                              value2: e.target.value,
                            })
                          }
                          placeholder="Value..."
                        />
                      </>
                    )}
                  </>
                )}

                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeCondition(condition.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Add Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground">
              Filter by field
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {fields.map((field) => (
              <DropdownMenuItem
                key={field.id}
                onClick={() => addCondition(field.id)}
              >
                {field.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear All Button */}
        {conditions.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={onClear}
          >
            Clear all
          </Button>
        )}

        {/* Active Filter Count Badge */}
        {conditions.length > 0 && (
          <Badge variant="secondary" className="h-6">
            {conditions.length} active
          </Badge>
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to apply filter conditions to data
 */
export function applyFilters<T extends Record<string, any>>(
  data: T[],
  conditions: FilterCondition[]
): T[] {
  if (conditions.length === 0) return data;

  return data.filter((item) => {
    return conditions.every((condition) => {
      const value = item[condition.field];
      const filterValue = condition.value;

      // Handle empty/not empty operators (these don't need a value)
      if (condition.operator === "is_empty") {
        return value === null || value === undefined || value === "";
      }
      if (condition.operator === "is_not_empty") {
        return value !== null && value !== undefined && value !== "";
      }

      // Skip filters with empty values (except for is_empty/is_not_empty which we handled above)
      if (filterValue === "" || filterValue === null || filterValue === undefined) {
        return true; // Don't filter out items if the filter value is empty
      }

      // Convert to strings for text comparison
      const strValue = String(value || "").toLowerCase();
      const strFilterValue = String(filterValue || "").toLowerCase();

      const parseDate = (input: unknown): Date | null => {
        if (input instanceof Date) {
          return Number.isNaN(input.getTime()) ? null : input;
        }
        if (typeof input === "string" || typeof input === "number") {
          const date = new Date(input);
          return Number.isNaN(date.getTime()) ? null : date;
        }
        return null;
      };
      const dateValue = parseDate(value);
      const dateFilterValue = parseDate(filterValue);

      switch (condition.operator) {
        case "equals":
          return strValue === strFilterValue;
        case "not_equals":
          return strValue !== strFilterValue;
        case "contains":
          return strValue.includes(strFilterValue);
        case "not_contains":
          return !strValue.includes(strFilterValue);
        case "starts_with":
          return strValue.startsWith(strFilterValue);
        case "ends_with":
          return strValue.endsWith(strFilterValue);
        case "greater_than":
          return Number(value) > Number(filterValue);
        case "less_than":
          return Number(value) < Number(filterValue);
        case "greater_than_or_equal":
          return Number(value) >= Number(filterValue);
        case "less_than_or_equal":
          return Number(value) <= Number(filterValue);
        case "between":
          return (
            Number(value) >= Number(filterValue) &&
            Number(value) <= Number(condition.value2 || 0)
          );
        case "before":
          return dateValue !== null && dateFilterValue !== null
            ? dateValue < dateFilterValue
            : false;
        case "after":
          return dateValue !== null && dateFilterValue !== null
            ? dateValue > dateFilterValue
            : false;
        case "on_or_before":
          return dateValue !== null && dateFilterValue !== null
            ? dateValue <= dateFilterValue
            : false;
        case "on_or_after":
          return dateValue !== null && dateFilterValue !== null
            ? dateValue >= dateFilterValue
            : false;
        default:
          return true;
      }
    });
  });
}

