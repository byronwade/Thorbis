"use client";

/**
 * Settings > Job Fields Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  CalendarDays,
  Edit,
  HelpCircle,
  ListChecks,
  Loader2,
  Plus,
  Save,
  Settings,
  TextCursorInput,
  ToggleLeft,
  Trash2,
  Type,
} from "lucide-react";
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

// Constants
const SIMULATED_API_DELAY = 1500;

type CustomField = {
  id: string;
  name: string;
  fieldType: "text" | "number" | "date" | "dropdown" | "checkbox" | "textarea";
  options?: string[]; // For dropdown
  required: boolean;
  showOnInvoice: boolean;
  showToCustomer: boolean;
  active: boolean;
  category: "customer" | "property" | "job" | "estimate" | "invoice";
};

type JobFieldSettings = {
  // General Settings
  enableCustomFields: boolean;
  requireFieldCompletion: boolean;
  allowTechnicianEdit: boolean;

  // Field Visibility
  showFieldsOnMobile: boolean;
  groupFieldsByCategory: boolean;
  showInlineHelp: boolean;

  // Customer Portal
  customerCanViewFields: boolean;
  customerCanEditFields: boolean;
  hideInternalFields: boolean;

  // Default Fields
  requirePropertyType: boolean;
  requireAccessInstructions: boolean;
  requireParkingInfo: boolean;
  requirePetInfo: boolean;
  requireGateCode: boolean;
};

export default function JobFieldsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [settings, setSettings] = useState<JobFieldSettings>({
    // General Settings
    enableCustomFields: true,
    requireFieldCompletion: false,
    allowTechnicianEdit: true,

    // Field Visibility
    showFieldsOnMobile: true,
    groupFieldsByCategory: true,
    showInlineHelp: true,

    // Customer Portal
    customerCanViewFields: true,
    customerCanEditFields: false,
    hideInternalFields: true,

    // Default Fields
    requirePropertyType: true,
    requireAccessInstructions: false,
    requireParkingInfo: false,
    requirePetInfo: true,
    requireGateCode: false,
  });

  // Sample custom fields
  const [customFields] = useState<CustomField[]>([
    {
      id: "1",
      name: "Property Type",
      fieldType: "dropdown",
      options: ["Single Family", "Condo", "Apartment", "Commercial"],
      required: true,
      showOnInvoice: false,
      showToCustomer: true,
      active: true,
      category: "property",
    },
    {
      id: "2",
      name: "Square Footage",
      fieldType: "number",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "3",
      name: "AC Unit Brand",
      fieldType: "text",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "4",
      name: "Unit Age (Years)",
      fieldType: "number",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "5",
      name: "Last Service Date",
      fieldType: "date",
      required: false,
      showOnInvoice: false,
      showToCustomer: true,
      active: true,
      category: "property",
    },
    {
      id: "6",
      name: "Gate Code",
      fieldType: "text",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "7",
      name: "Parking Instructions",
      fieldType: "textarea",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "8",
      name: "Pets on Property",
      fieldType: "checkbox",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "9",
      name: "Pet Details",
      fieldType: "textarea",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "property",
    },
    {
      id: "10",
      name: "Preferred Contact Method",
      fieldType: "dropdown",
      options: ["Email", "Phone", "Text", "Any"],
      required: false,
      showOnInvoice: false,
      showToCustomer: true,
      active: true,
      category: "customer",
    },
    {
      id: "11",
      name: "Customer Notes",
      fieldType: "textarea",
      required: false,
      showOnInvoice: false,
      showToCustomer: false,
      active: true,
      category: "customer",
    },
    {
      id: "12",
      name: "Work Performed",
      fieldType: "textarea",
      required: true,
      showOnInvoice: true,
      showToCustomer: true,
      active: true,
      category: "job",
    },
    {
      id: "13",
      name: "Parts Replaced",
      fieldType: "textarea",
      required: false,
      showOnInvoice: true,
      showToCustomer: true,
      active: true,
      category: "job",
    },
    {
      id: "14",
      name: "Warranty Period",
      fieldType: "dropdown",
      options: ["30 Days", "90 Days", "1 Year", "2 Years", "Lifetime"],
      required: false,
      showOnInvoice: true,
      showToCustomer: true,
      active: true,
      category: "job",
    },
  ]);

  const updateSetting = <K extends keyof JobFieldSettings>(
    key: K,
    value: JobFieldSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getFieldTypeIcon = (fieldType: string) => {
    const icons: Record<string, typeof Type> = {
      text: Type,
      number: Type,
      date: CalendarDays,
      dropdown: ListChecks,
      checkbox: ToggleLeft,
      textarea: TextCursorInput,
    };
    return icons[fieldType] || Type;
  };

  const getFieldTypeLabel = (fieldType: string) => {
    const labels: Record<string, string> = {
      text: "Text",
      number: "Number",
      date: "Date",
      dropdown: "Dropdown",
      checkbox: "Checkbox",
      textarea: "Long Text",
    };
    return labels[fieldType] || fieldType;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      customer: "Customer",
      property: "Property",
      job: "Job",
      estimate: "Estimate",
      invoice: "Invoice",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      customer: "bg-primary",
      property: "bg-success",
      job: "bg-accent",
      estimate: "bg-warning",
      invoice: "bg-warning",
    };
    return colors[category] || "bg-secondary0";
  };

  const filteredFields =
    selectedCategory === "all"
      ? customFields
      : customFields.filter((field) => field.category === selectedCategory);

  const totalFields = customFields.length;
  const activeFields = customFields.filter((f) => f.active).length;
  const requiredFields = customFields.filter((f) => f.required).length;
  const customerVisibleFields = customFields.filter(
    (f) => f.showToCustomer
  ).length;

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Custom Job Fields
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track additional information specific to your business
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            New Field
          </Button>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Fields</p>
                  <p className="mt-1 font-bold text-2xl">{totalFields}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active</p>
                  <p className="mt-1 font-bold text-2xl">{activeFields}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Required</p>
                  <p className="mt-1 font-bold text-2xl">{requiredFields}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Customer Visible
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    {customerVisibleFields}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              General Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How custom fields work across your system
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Basic configuration for custom fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Custom Fields
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Turn custom fields feature on or off
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show custom fields throughout system
                </p>
              </div>
              <Switch
                checked={settings.enableCustomFields}
                onCheckedChange={(checked) =>
                  updateSetting("enableCustomFields", checked)
                }
              />
            </div>

            {settings.enableCustomFields && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Field Completion
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Must fill all required fields before completing job
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Can't complete job with empty required fields
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireFieldCompletion}
                    onCheckedChange={(checked) =>
                      updateSetting("requireFieldCompletion", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Technician Editing
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Let technicians edit custom fields in the field
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Technicians can update custom fields
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowTechnicianEdit}
                    onCheckedChange={(checked) =>
                      updateSetting("allowTechnicianEdit", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Field Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Field Visibility
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Where and how fields appear</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Control where fields are displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Fields on Mobile
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Display custom fields in mobile app
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Visible in technician mobile app
                </p>
              </div>
              <Switch
                checked={settings.showFieldsOnMobile}
                onCheckedChange={(checked) =>
                  updateSetting("showFieldsOnMobile", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Group by Category
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Organize fields into categories (Customer, Property,
                        Job)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Group fields by category for clarity
                </p>
              </div>
              <Switch
                checked={settings.groupFieldsByCategory}
                onCheckedChange={(checked) =>
                  updateSetting("groupFieldsByCategory", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Inline Help
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Display help text and examples with each field
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show help text under each field
                </p>
              </div>
              <Switch
                checked={settings.showInlineHelp}
                onCheckedChange={(checked) =>
                  updateSetting("showInlineHelp", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Portal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Customer Portal
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">What customers see and can edit</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Customer access to custom fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Customer Can View Fields
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show custom field data in customer portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display custom fields in portal
                </p>
              </div>
              <Switch
                checked={settings.customerCanViewFields}
                onCheckedChange={(checked) =>
                  updateSetting("customerCanViewFields", checked)
                }
              />
            </div>

            {settings.customerCanViewFields && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Customer Can Edit Fields
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Allow customers to update their own custom field
                            data
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Customers can update their fields
                    </p>
                  </div>
                  <Switch
                    checked={settings.customerCanEditFields}
                    onCheckedChange={(checked) =>
                      updateSetting("customerCanEditFields", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Hide Internal Fields
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Hide fields marked as internal-only from customer
                            view
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Don't show internal-only fields
                    </p>
                  </div>
                  <Switch
                    checked={settings.hideInternalFields}
                    onCheckedChange={(checked) =>
                      updateSetting("hideInternalFields", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Standard Field Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Standard Field Requirements
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Make common fields required</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Which standard fields are required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Property Type</Label>
                  <p className="text-muted-foreground text-xs">
                    Require property type selection
                  </p>
                </div>
                <Switch
                  checked={settings.requirePropertyType}
                  onCheckedChange={(checked) =>
                    updateSetting("requirePropertyType", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Access Instructions
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    How to access the property
                  </p>
                </div>
                <Switch
                  checked={settings.requireAccessInstructions}
                  onCheckedChange={(checked) =>
                    updateSetting("requireAccessInstructions", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Parking Info</Label>
                  <p className="text-muted-foreground text-xs">
                    Where technician should park
                  </p>
                </div>
                <Switch
                  checked={settings.requireParkingInfo}
                  onCheckedChange={(checked) =>
                    updateSetting("requireParkingInfo", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Pet Information</Label>
                  <p className="text-muted-foreground text-xs">
                    Pets on property (safety)
                  </p>
                </div>
                <Switch
                  checked={settings.requirePetInfo}
                  onCheckedChange={(checked) =>
                    updateSetting("requirePetInfo", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Gate Code</Label>
                  <p className="text-muted-foreground text-xs">
                    Security gate access code
                  </p>
                </div>
                <Switch
                  checked={settings.requireGateCode}
                  onCheckedChange={(checked) =>
                    updateSetting("requireGateCode", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Your Custom Fields</CardTitle>
                <CardDescription>
                  Manage custom fields for your business
                </CardDescription>
              </div>
              <Select
                onValueChange={setSelectedCategory}
                value={selectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="estimate">Estimate</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredFields.length === 0 ? (
              <div className="py-8 text-center">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground text-sm">
                  No fields found in this category
                </p>
              </div>
            ) : (
              filteredFields.map((field) => {
                const FieldIcon = getFieldTypeIcon(field.fieldType);

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    key={field.id}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <FieldIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{field.name}</h4>
                          <Badge className={getCategoryColor(field.category)}>
                            {getCategoryLabel(field.category)}
                          </Badge>
                          <Badge variant="outline">
                            {getFieldTypeLabel(field.fieldType)}
                          </Badge>
                          {field.required && (
                            <Badge variant="secondary">Required</Badge>
                          )}
                          {!field.active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-xs">
                          {field.options && field.options.length > 0 && (
                            <>
                              <span className="text-muted-foreground">
                                Options: {field.options.join(", ")}
                              </span>
                              <span className="text-muted-foreground">•</span>
                            </>
                          )}
                          <span className="text-muted-foreground">
                            {field.showOnInvoice
                              ? "Shows on invoice"
                              : "Not on invoice"}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {field.showToCustomer
                              ? "Customer visible"
                              : "Internal only"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button disabled={isSubmitting} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 size-4" />
            Save Field Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
