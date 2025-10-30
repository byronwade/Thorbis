"use client";

/**
 * Settings > Customers > Custom Fields Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { HelpCircle, Plus, Save, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CustomField = {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "dropdown" | "checkbox" | "multiselect";
  required: boolean;
  showOnBooking: boolean;
  showOnPortal: boolean;
  options?: string[];
  placeholder?: string;
};

export default function CustomFieldsPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([
    {
      id: "1",
      name: "Gate Code",
      type: "text",
      required: false,
      showOnBooking: true,
      showOnPortal: true,
      placeholder: "Enter gate access code",
    },
    {
      id: "2",
      name: "Pet Information",
      type: "text",
      required: false,
      showOnBooking: true,
      showOnPortal: false,
      placeholder: "Any pets on property?",
    },
    {
      id: "3",
      name: "Preferred Contact Method",
      type: "dropdown",
      required: true,
      showOnBooking: true,
      showOnPortal: true,
      options: ["Phone", "Email", "Text Message"],
    },
    {
      id: "4",
      name: "How did you hear about us?",
      type: "dropdown",
      required: false,
      showOnBooking: true,
      showOnPortal: false,
      options: [
        "Google Search",
        "Referral",
        "Social Media",
        "Advertisement",
        "Other",
      ],
    },
  ]);

  const addCustomField = () => {
    const newField: CustomField = {
      id: Math.random().toString(),
      name: "",
      type: "text",
      required: false,
      showOnBooking: false,
      showOnPortal: false,
    };
    setCustomFields((prev) => [...prev, newField]);
    setHasUnsavedChanges(true);
  };

  const removeField = (id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
    setHasUnsavedChanges(true);
  };

  const updateField = (
    id: string,
    key: keyof CustomField,
    value: string | boolean | string[]
  ) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const _getFieldTypeIcon = (type: CustomField["type"]) => {
    const icons = {
      text: "T",
      number: "#",
      date: "📅",
      dropdown: "▼",
      checkbox: "☑",
      multiselect: "☑☑",
    };
    return icons[type];
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Custom Fields</h1>
            <p className="mt-2 text-muted-foreground">
              Add custom fields to collect additional customer information
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4" />
                  Customer Custom Fields
                </CardTitle>
                <CardDescription>
                  Create custom fields to capture business-specific information
                </CardDescription>
              </div>
              <Button onClick={addCustomField} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {customFields.map((field, index) => (
              <div key={field.id}>
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label className="font-medium text-sm">
                            Field Name
                          </Label>
                          <Input
                            className="mt-2"
                            onChange={(e) =>
                              updateField(field.id, "name", e.target.value)
                            }
                            placeholder="e.g., Gate Code"
                            value={field.name}
                          />
                        </div>

                        <div>
                          <Label className="flex items-center gap-2 font-medium text-sm">
                            Field Type
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Type of input for this field
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              updateField(
                                field.id,
                                "type",
                                value as CustomField["type"]
                              )
                            }
                            value={field.type}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="multiselect">
                                Multi-Select
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {(field.type === "text" || field.type === "number") && (
                        <div>
                          <Label className="text-sm">
                            Placeholder Text (Optional)
                          </Label>
                          <Input
                            className="mt-2"
                            onChange={(e) =>
                              updateField(
                                field.id,
                                "placeholder",
                                e.target.value
                              )
                            }
                            placeholder="Enter placeholder text"
                            value={field.placeholder || ""}
                          />
                        </div>
                      )}

                      {(field.type === "dropdown" ||
                        field.type === "multiselect") && (
                        <div>
                          <Label className="flex items-center gap-2 text-sm">
                            Options (comma-separated)
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Separate options with commas
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            className="mt-2"
                            onChange={(e) =>
                              updateField(
                                field.id,
                                "options",
                                e.target.value.split(",").map((s) => s.trim())
                              )
                            }
                            placeholder="Option 1, Option 2, Option 3"
                            value={field.options?.join(", ") || ""}
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            {field.options?.map((option, i) => (
                              <Badge key={i} variant="secondary">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="text-sm">Required</Label>
                            <p className="text-muted-foreground text-xs">
                              Customer must fill
                            </p>
                          </div>
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) =>
                              updateField(field.id, "required", checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="text-sm">On Booking Form</Label>
                            <p className="text-muted-foreground text-xs">
                              Show when booking
                            </p>
                          </div>
                          <Switch
                            checked={field.showOnBooking}
                            onCheckedChange={(checked) =>
                              updateField(field.id, "showOnBooking", checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="text-sm">In Portal</Label>
                            <p className="text-muted-foreground text-xs">
                              Show in customer portal
                            </p>
                          </div>
                          <Switch
                            checked={field.showOnPortal}
                            onCheckedChange={(checked) =>
                              updateField(field.id, "showOnPortal", checked)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      className="ml-4"
                      onClick={() => removeField(field.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {index < customFields.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}

            {customFields.length === 0 && (
              <div className="rounded-lg border border-dashed py-12 text-center">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-medium">No Custom Fields</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Click "Add Field" to create your first custom field
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Field Examples</CardTitle>
            <CardDescription>
              Common custom fields for field service businesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Property Information</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Gate code or access instructions</li>
                  <li>• Parking instructions</li>
                  <li>• Property square footage</li>
                  <li>• Year built</li>
                </ul>
              </div>

              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Service Details</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Equipment brand/model</li>
                  <li>• Previous service provider</li>
                  <li>• Service history</li>
                  <li>• Warranty information</li>
                </ul>
              </div>

              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Customer Preferences</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Preferred contact method</li>
                  <li>• Best time to call</li>
                  <li>• Language preference</li>
                  <li>• Special instructions</li>
                </ul>
              </div>

              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Safety & Access</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Pet information</li>
                  <li>• Alarm system details</li>
                  <li>• Emergency contact</li>
                  <li>• Special access requirements</li>
                </ul>
              </div>

              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Business Information</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Referral source</li>
                  <li>• Customer type (residential/commercial)</li>
                  <li>• Tax ID/business license</li>
                  <li>• PO number requirements</li>
                </ul>
              </div>

              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Scheduling</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Preferred technician</li>
                  <li>• Availability windows</li>
                  <li>• Recurring service frequency</li>
                  <li>• Seasonal service preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Tag className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Custom Field Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Keep custom fields focused and relevant to avoid overwhelming
                customers during booking. Use dropdown menus instead of text
                fields when possible for easier reporting. Limit required fields
                to only essential information. Review and remove unused custom
                fields quarterly to maintain a clean customer experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
