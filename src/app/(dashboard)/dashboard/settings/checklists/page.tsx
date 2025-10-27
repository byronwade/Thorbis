"use client";

export const dynamic = "force-dynamic";

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit,
  GripVertical,
  HelpCircle,
  Loader2,
  Plus,
  Save,
  Settings,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

// Constants
const SIMULATED_API_DELAY = 1500;

type ChecklistItem = {
  id: string;
  text: string;
  required: boolean;
  photoRequired: boolean;
  order: number;
};

type Checklist = {
  id: string;
  name: string;
  description: string;
  category: "hvac" | "plumbing" | "electrical" | "general" | "inspection";
  items: ChecklistItem[];
  active: boolean;
  usageCount: number;
};

type ChecklistSettings = {
  // General Settings
  enableChecklists: boolean;
  requireChecklistCompletion: boolean;
  allowTechnicianSkip: boolean;
  requireSkipReason: boolean;

  // Photo Requirements
  requirePhotos: boolean;
  photoQualityCheck: boolean;
  minimumPhotosPerJob: number;

  // Completion Settings
  requireAllItemsChecked: boolean;
  allowPartialCompletion: boolean;
  saveIncompleteLists: boolean;

  // Customer Visibility
  shareChecklistWithCustomer: boolean;
  includeInJobSummary: boolean;
  customerCanViewInPortal: boolean;
};

export default function ChecklistsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>(
    null
  );

  const [settings, setSettings] = useState<ChecklistSettings>({
    // General Settings
    enableChecklists: true,
    requireChecklistCompletion: true,
    allowTechnicianSkip: true,
    requireSkipReason: true,

    // Photo Requirements
    requirePhotos: true,
    photoQualityCheck: false,
    minimumPhotosPerJob: 2,

    // Completion Settings
    requireAllItemsChecked: false,
    allowPartialCompletion: true,
    saveIncompleteLists: true,

    // Customer Visibility
    shareChecklistWithCustomer: true,
    includeInJobSummary: true,
    customerCanViewInPortal: true,
  });

  // Sample checklists
  const [checklists] = useState<Checklist[]>([
    {
      id: "1",
      name: "AC Maintenance Checklist",
      description: "Standard air conditioning maintenance procedure",
      category: "hvac",
      usageCount: 342,
      active: true,
      items: [
        {
          id: "1-1",
          text: "Check and record refrigerant pressure",
          required: true,
          photoRequired: true,
          order: 1,
        },
        {
          id: "1-2",
          text: "Inspect and clean condenser coils",
          required: true,
          photoRequired: false,
          order: 2,
        },
        {
          id: "1-3",
          text: "Replace or clean air filter",
          required: true,
          photoRequired: true,
          order: 3,
        },
        {
          id: "1-4",
          text: "Check thermostat calibration",
          required: true,
          photoRequired: false,
          order: 4,
        },
        {
          id: "1-5",
          text: "Test system performance and record temperatures",
          required: true,
          photoRequired: false,
          order: 5,
        },
        {
          id: "1-6",
          text: "Inspect electrical connections and tighten if needed",
          required: true,
          photoRequired: false,
          order: 6,
        },
        {
          id: "1-7",
          text: "Clear drain line and check for proper drainage",
          required: true,
          photoRequired: false,
          order: 7,
        },
      ],
    },
    {
      id: "2",
      name: "Plumbing Inspection",
      description: "General plumbing system inspection",
      category: "plumbing",
      usageCount: 156,
      active: true,
      items: [
        {
          id: "2-1",
          text: "Check all visible pipes for leaks",
          required: true,
          photoRequired: true,
          order: 1,
        },
        {
          id: "2-2",
          text: "Test water pressure at fixtures",
          required: true,
          photoRequired: false,
          order: 2,
        },
        {
          id: "2-3",
          text: "Inspect water heater for signs of corrosion or leaks",
          required: true,
          photoRequired: true,
          order: 3,
        },
        {
          id: "2-4",
          text: "Check drain flow in all sinks and tubs",
          required: false,
          photoRequired: false,
          order: 4,
        },
        {
          id: "2-5",
          text: "Test toilet flush and fill mechanisms",
          required: false,
          photoRequired: false,
          order: 5,
        },
      ],
    },
    {
      id: "3",
      name: "Electrical Safety Inspection",
      description: "Safety check for electrical systems",
      category: "electrical",
      usageCount: 89,
      active: true,
      items: [
        {
          id: "3-1",
          text: "Check main panel for proper labeling",
          required: true,
          photoRequired: true,
          order: 1,
        },
        {
          id: "3-2",
          text: "Test GFCI outlets in bathrooms and kitchen",
          required: true,
          photoRequired: false,
          order: 2,
        },
        {
          id: "3-3",
          text: "Inspect visible wiring for damage",
          required: true,
          photoRequired: true,
          order: 3,
        },
        {
          id: "3-4",
          text: "Verify grounding on major appliances",
          required: true,
          photoRequired: false,
          order: 4,
        },
      ],
    },
  ]);

  const updateSetting = <K extends keyof ChecklistSettings>(
    key: K,
    value: ChecklistSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      hvac: "HVAC",
      plumbing: "Plumbing",
      electrical: "Electrical",
      general: "General",
      inspection: "Inspection",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hvac: "bg-blue-500",
      plumbing: "bg-green-500",
      electrical: "bg-yellow-500",
      general: "bg-gray-500",
      inspection: "bg-purple-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const totalChecklists = checklists.length;
  const activeChecklists = checklists.filter((c) => c.active).length;
  const totalItems = checklists.reduce((sum, c) => sum + c.items.length, 0);
  const avgItemsPerChecklist = Math.round(totalItems / totalChecklists);

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
            <h1 className="font-bold text-3xl tracking-tight">
              Job Checklists
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ensure quality and consistency on every job
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Checklist
          </Button>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Active Checklists
                  </p>
                  <p className="mt-1 font-bold text-2xl">{activeChecklists}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Total Checklists
                  </p>
                  <p className="mt-1 font-bold text-2xl">{totalChecklists}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Items</p>
                  <p className="mt-1 font-bold text-2xl">{totalItems}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Items</p>
                  <p className="mt-1 font-bold text-2xl">
                    {avgItemsPerChecklist}
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
              <Settings className="h-4 w-4" />
              General Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How checklists work for your technicians
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How technicians use checklists in the field
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Checklists
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Turn job checklists on or off</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show checklists to technicians during jobs
                </p>
              </div>
              <Switch
                checked={settings.enableChecklists}
                onCheckedChange={(checked) =>
                  updateSetting("enableChecklists", checked)
                }
              />
            </div>

            {settings.enableChecklists && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Checklist Completion
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Technician must complete checklist before finishing
                            job
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Can't complete job without finishing checklist
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireChecklistCompletion}
                    onCheckedChange={(checked) =>
                      updateSetting("requireChecklistCompletion", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Technician to Skip Items
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Let tech skip non-essential items if needed
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Tech can skip optional checklist items
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowTechnicianSkip}
                    onCheckedChange={(checked) =>
                      updateSetting("allowTechnicianSkip", checked)
                    }
                  />
                </div>

                {settings.allowTechnicianSkip && (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="flex items-center gap-2 font-medium text-sm">
                        Require Skip Reason
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Tech must explain why they skipped an item
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Must explain why item was skipped
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireSkipReason}
                      onCheckedChange={(checked) =>
                        updateSetting("requireSkipReason", checked)
                      }
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Photo Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4" />
              Photo Requirements
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Photo documentation requirements</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Photo documentation for quality assurance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Photos
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technician must take photos during job
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Photos required for checklist items
                </p>
              </div>
              <Switch
                checked={settings.requirePhotos}
                onCheckedChange={(checked) =>
                  updateSetting("requirePhotos", checked)
                }
              />
            </div>

            {settings.requirePhotos && (
              <>
                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Minimum Photos Per Job
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Minimum number of photos required
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    className="mt-2"
                    min="0"
                    onChange={(e) =>
                      updateSetting(
                        "minimumPhotosPerJob",
                        Number.parseInt(e.target.value, 10) || 2
                      )
                    }
                    placeholder="2"
                    type="number"
                    value={settings.minimumPhotosPerJob}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Tech must take at least this many photos
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Photo Quality Check
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Check for blurry or dark photos
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Warn if photos are blurry or too dark
                    </p>
                  </div>
                  <Switch
                    checked={settings.photoQualityCheck}
                    onCheckedChange={(checked) =>
                      updateSetting("photoQualityCheck", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Completion Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4" />
              Completion Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Rules for completing checklists</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              What's required to mark checklist complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require All Items Checked
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Every item must be checked off to complete
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must check every single item
                </p>
              </div>
              <Switch
                checked={settings.requireAllItemsChecked}
                onCheckedChange={(checked) =>
                  updateSetting("requireAllItemsChecked", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Partial Completion
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Save checklist even if not all items done
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Can complete job with partial checklist
                </p>
              </div>
              <Switch
                checked={settings.allowPartialCompletion}
                onCheckedChange={(checked) =>
                  updateSetting("allowPartialCompletion", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Save Incomplete Lists
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Keep partially completed checklists for later
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Keep partial progress if job interrupted
                </p>
              </div>
              <Switch
                checked={settings.saveIncompleteLists}
                onCheckedChange={(checked) =>
                  updateSetting("saveIncompleteLists", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4" />
              Customer Visibility
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    What customers can see about checklists
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Share checklist results with customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Share Checklist with Customer
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show completed checklist to customer
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Let customers see completed checklist
                </p>
              </div>
              <Switch
                checked={settings.shareChecklistWithCustomer}
                onCheckedChange={(checked) =>
                  updateSetting("shareChecklistWithCustomer", checked)
                }
              />
            </div>

            {settings.shareChecklistWithCustomer && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Include in Job Summary
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Add checklist to job completion email
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Email checklist when job completes
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeInJobSummary}
                    onCheckedChange={(checked) =>
                      updateSetting("includeInJobSummary", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Show in Customer Portal
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Customer can view checklist in portal
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Available in customer portal
                    </p>
                  </div>
                  <Switch
                    checked={settings.customerCanViewInPortal}
                    onCheckedChange={(checked) =>
                      updateSetting("customerCanViewInPortal", checked)
                    }
                  />
                </div>
              </>
            )}

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">Checklists Build Trust</p>
                  <p className="text-muted-foreground text-xs">
                    Customers love seeing detailed checklists! It shows
                    professionalism and proves work was done thoroughly.
                    Businesses that share checklists get 40% more 5-star
                    reviews.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Checklists */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Checklists</CardTitle>
            <CardDescription>
              Manage checklists for different job types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklists.map((checklist) => {
              const isExpanded = expandedChecklist === checklist.id;
              const requiredItems = checklist.items.filter(
                (item) => item.required
              ).length;
              const photoItems = checklist.items.filter(
                (item) => item.photoRequired
              ).length;

              return (
                <div
                  className="rounded-lg border transition-colors hover:bg-muted/50"
                  key={checklist.id}
                >
                  {/* Checklist Header */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-4"
                    onClick={() =>
                      setExpandedChecklist(isExpanded ? null : checklist.id)
                    }
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{checklist.name}</h4>
                          <Badge
                            className={getCategoryColor(checklist.category)}
                          >
                            {getCategoryLabel(checklist.category)}
                          </Badge>
                          {!checklist.active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-muted-foreground text-sm">
                          {checklist.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            {checklist.items.length} items
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {requiredItems} required
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {photoItems} photos needed
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            Used {checklist.usageCount} times
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  {isExpanded && (
                    <>
                      <Separator />
                      <div className="p-4">
                        <div className="space-y-2">
                          {checklist.items.map((item) => (
                            <div
                              className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                              key={item.id}
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm">{item.text}</p>
                              </div>
                              <div className="flex gap-2">
                                {item.required && (
                                  <Badge variant="secondary">Required</Badge>
                                )}
                                {item.photoRequired && (
                                  <Badge variant="outline">Photo</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button disabled={isSubmitting} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Checklist Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
