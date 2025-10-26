"use client";

export const dynamic = "force-dynamic";

import {
  Briefcase,
  DollarSign,
  Edit,
  FileText,
  HelpCircle,
  Loader2,
  MapPin,
  Plus,
  Save,
  Settings,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  Wrench,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;

type TagCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  usageCount: number;
};

type CustomTag = {
  id: string;
  name: string;
  category: "customer" | "job" | "service" | "priority" | "status" | "location";
  color: string;
  description: string;
  usageCount: number;
  active: boolean;
};

type TagSettings = {
  // General Settings
  enableTags: boolean;
  allowMultipleTags: boolean;
  requireAtLeastOneTag: boolean;
  allowCustomTagCreation: boolean;
  restrictTagsByRole: boolean;

  // Display Settings
  showTagsOnInvoices: boolean;
  showTagsInPortal: boolean;
  showTagColors: boolean;
  sortTagsAlphabetically: boolean;

  // Automation
  autoTagByLocation: boolean;
  autoTagByServiceType: boolean;
  autoTagByValue: boolean;
  highValueThreshold: number;

  // Analytics
  trackTagPerformance: boolean;
  showTagReports: boolean;
  trackRevenueByTag: boolean;
};

export default function TagsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [settings, setSettings] = useState<TagSettings>({
    // General Settings
    enableTags: true,
    allowMultipleTags: true,
    requireAtLeastOneTag: false,
    allowCustomTagCreation: true,
    restrictTagsByRole: false,

    // Display Settings
    showTagsOnInvoices: true,
    showTagsInPortal: true,
    showTagColors: true,
    sortTagsAlphabetically: true,

    // Automation
    autoTagByLocation: true,
    autoTagByServiceType: true,
    autoTagByValue: true,
    highValueThreshold: 1000,

    // Analytics
    trackTagPerformance: true,
    showTagReports: true,
    trackRevenueByTag: true,
  });

  // Sample tags
  const [tags] = useState<CustomTag[]>([
    // Customer Tags
    {
      id: "1",
      name: "VIP Customer",
      category: "customer",
      color: "#fbbf24",
      description: "High-value customer requiring priority service",
      usageCount: 47,
      active: true,
    },
    {
      id: "2",
      name: "Service Plan Member",
      category: "customer",
      color: "#10b981",
      description: "Active service plan subscriber",
      usageCount: 203,
      active: true,
    },
    {
      id: "3",
      name: "New Customer",
      category: "customer",
      color: "#3b82f6",
      description: "First-time customer",
      usageCount: 89,
      active: true,
    },
    {
      id: "4",
      name: "Repeat Customer",
      category: "customer",
      color: "#8b5cf6",
      description: "Customer with 3+ jobs",
      usageCount: 156,
      active: true,
    },
    // Job Tags
    {
      id: "5",
      name: "Emergency",
      category: "priority",
      color: "#ef4444",
      description: "Urgent service required",
      usageCount: 34,
      active: true,
    },
    {
      id: "6",
      name: "Same Day",
      category: "priority",
      color: "#f97316",
      description: "Must complete today",
      usageCount: 67,
      active: true,
    },
    {
      id: "7",
      name: "Scheduled Maintenance",
      category: "job",
      color: "#06b6d4",
      description: "Routine maintenance visit",
      usageCount: 412,
      active: true,
    },
    {
      id: "8",
      name: "Warranty Work",
      category: "job",
      color: "#14b8a6",
      description: "Work covered under warranty",
      usageCount: 23,
      active: true,
    },
    // Service Tags
    {
      id: "9",
      name: "AC Repair",
      category: "service",
      color: "#0ea5e9",
      description: "Air conditioning repair",
      usageCount: 234,
      active: true,
    },
    {
      id: "10",
      name: "Heating Repair",
      category: "service",
      color: "#f59e0b",
      description: "Heating system repair",
      usageCount: 187,
      active: true,
    },
    {
      id: "11",
      name: "Plumbing",
      category: "service",
      color: "#0284c7",
      description: "Plumbing services",
      usageCount: 156,
      active: true,
    },
    {
      id: "12",
      name: "Electrical",
      category: "service",
      color: "#eab308",
      description: "Electrical services",
      usageCount: 98,
      active: true,
    },
    // Location Tags
    {
      id: "13",
      name: "Downtown",
      category: "location",
      color: "#a855f7",
      description: "Downtown service area",
      usageCount: 178,
      active: true,
    },
    {
      id: "14",
      name: "Suburbs",
      category: "location",
      color: "#ec4899",
      description: "Suburban service area",
      usageCount: 312,
      active: true,
    },
    {
      id: "15",
      name: "Commercial",
      category: "location",
      color: "#6366f1",
      description: "Commercial properties",
      usageCount: 89,
      active: true,
    },
    // Status Tags
    {
      id: "16",
      name: "Quoted",
      category: "status",
      color: "#fbbf24",
      description: "Estimate provided, awaiting approval",
      usageCount: 67,
      active: true,
    },
    {
      id: "17",
      name: "In Progress",
      category: "status",
      color: "#3b82f6",
      description: "Work currently being performed",
      usageCount: 45,
      active: true,
    },
    {
      id: "18",
      name: "Follow-up Required",
      category: "status",
      color: "#f97316",
      description: "Needs follow-up call or visit",
      usageCount: 23,
      active: true,
    },
  ]);

  const updateSetting = <K extends keyof TagSettings>(
    key: K,
    value: TagSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      customer: "Customer",
      job: "Job",
      service: "Service Type",
      priority: "Priority",
      status: "Status",
      location: "Location",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof Tag> = {
      customer: Users,
      job: Briefcase,
      service: Wrench,
      priority: TrendingUp,
      status: FileText,
      location: MapPin,
    };
    return icons[category] || Tag;
  };

  const filteredTags =
    selectedCategory === "all"
      ? tags
      : tags.filter((tag) => tag.category === selectedCategory);

  const totalTags = tags.length;
  const activeTags = tags.filter((t) => t.active).length;
  const totalUsage = tags.reduce((sum, tag) => sum + tag.usageCount, 0);
  const avgUsagePerTag = Math.round(totalUsage / totalTags);

  const categoryStats = Array.from(new Set(tags.map((t) => t.category))).map(
    (category) => {
      const categoryTags = tags.filter((t) => t.category === category);
      return {
        category,
        count: categoryTags.length,
        usage: categoryTags.reduce((sum, t) => sum + t.usageCount, 0),
      };
    }
  );

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    console.log("Tag settings update request:", settings);
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Tags</h1>
            <p className="mt-2 text-muted-foreground">
              Organize and categorize customers, jobs, and services
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Tag
          </Button>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Tags</p>
                  <p className="mt-1 font-bold text-2xl">{totalTags}</p>
                </div>
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Tags</p>
                  <p className="mt-1 font-bold text-2xl">{activeTags}</p>
                </div>
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Usage</p>
                  <p className="mt-1 font-bold text-2xl">{totalUsage}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Usage</p>
                  <p className="mt-1 font-bold text-2xl">{avgUsagePerTag}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage by Category</CardTitle>
            <CardDescription>
              How tags are used across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {categoryStats.map((stat) => {
                const CategoryIcon = getCategoryIcon(stat.category);
                return (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={stat.category}
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">
                          {getCategoryLabel(stat.category)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {stat.count} tags
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{stat.usage} uses</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
                  <p className="max-w-xs">How tags work across your system</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Basic tag configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Tags
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Turn tagging system on or off</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show tags throughout system
                </p>
              </div>
              <Switch
                checked={settings.enableTags}
                onCheckedChange={(checked) =>
                  updateSetting("enableTags", checked)
                }
              />
            </div>

            {settings.enableTags && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Multiple Tags
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Apply multiple tags to one customer/job
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Can add more than one tag per item
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowMultipleTags}
                    onCheckedChange={(checked) =>
                      updateSetting("allowMultipleTags", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require At Least One Tag
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Must add at least one tag before saving
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Every job/customer must have a tag
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireAtLeastOneTag}
                    onCheckedChange={(checked) =>
                      updateSetting("requireAtLeastOneTag", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Custom Tag Creation
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Let team members create new tags on the fly
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Team can create new tags
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowCustomTagCreation}
                    onCheckedChange={(checked) =>
                      updateSetting("allowCustomTagCreation", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Restrict Tags by Role
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Only admins can add certain tags
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Some tags need admin permission
                    </p>
                  </div>
                  <Switch
                    checked={settings.restrictTagsByRole}
                    onCheckedChange={(checked) =>
                      updateSetting("restrictTagsByRole", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Display Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How tags appear to customers and team
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>How tags are displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Tags on Invoices
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Display tags on customer invoices
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Tags visible on invoices
                </p>
              </div>
              <Switch
                checked={settings.showTagsOnInvoices}
                onCheckedChange={(checked) =>
                  updateSetting("showTagsOnInvoices", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Tags in Customer Portal
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers see their tags in portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers see their tags
                </p>
              </div>
              <Switch
                checked={settings.showTagsInPortal}
                onCheckedChange={(checked) =>
                  updateSetting("showTagsInPortal", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Tag Colors
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Display tags with color coding</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Use colors for visual organization
                </p>
              </div>
              <Switch
                checked={settings.showTagColors}
                onCheckedChange={(checked) =>
                  updateSetting("showTagColors", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Sort Tags Alphabetically
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show tags in A-Z order vs by usage
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show tags in alphabetical order
                </p>
              </div>
              <Switch
                checked={settings.sortTagsAlphabetically}
                onCheckedChange={(checked) =>
                  updateSetting("sortTagsAlphabetically", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Automation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Automatic Tagging
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Automatically apply tags based on criteria
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Auto-tag based on job details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Tag by Location
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically tag based on customer address
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Tag based on customer location
                </p>
              </div>
              <Switch
                checked={settings.autoTagByLocation}
                onCheckedChange={(checked) =>
                  updateSetting("autoTagByLocation", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Tag by Service Type
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically tag based on service performed
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Tag based on type of service
                </p>
              </div>
              <Switch
                checked={settings.autoTagByServiceType}
                onCheckedChange={(checked) =>
                  updateSetting("autoTagByServiceType", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Tag High-Value Jobs
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Tag jobs above certain dollar amount
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Tag jobs over threshold amount
                </p>
              </div>
              <Switch
                checked={settings.autoTagByValue}
                onCheckedChange={(checked) =>
                  updateSetting("autoTagByValue", checked)
                }
              />
            </div>

            {settings.autoTagByValue && (
              <div>
                <Label className="font-medium text-sm">
                  High-Value Threshold
                </Label>
                <div className="relative mt-2">
                  <span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    className="pl-8"
                    onChange={(e) =>
                      updateSetting(
                        "highValueThreshold",
                        Number.parseInt(e.target.value) || 1000
                      )
                    }
                    placeholder="1000"
                    type="number"
                    value={settings.highValueThreshold}
                  />
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Jobs over this amount get "High-Value" tag
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Tag Analytics
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Track performance and revenue by tag
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Measure performance by tag</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Tag Performance
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Measure how often each tag is used
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track tag usage over time
                </p>
              </div>
              <Switch
                checked={settings.trackTagPerformance}
                onCheckedChange={(checked) =>
                  updateSetting("trackTagPerformance", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Tag Reports
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Create reports filtered by tags
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Generate reports by tag
                </p>
              </div>
              <Switch
                checked={settings.showTagReports}
                onCheckedChange={(checked) =>
                  updateSetting("showTagReports", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Revenue by Tag
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        See which tags generate the most revenue
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Calculate revenue per tag
                </p>
              </div>
              <Switch
                checked={settings.trackRevenueByTag}
                onCheckedChange={(checked) =>
                  updateSetting("trackRevenueByTag", checked)
                }
              />
            </div>

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    Tags Help You Focus Marketing
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Tracking revenue by tag shows which customer segments are
                    most profitable. Send targeted campaigns to high-value tags
                    to maximize ROI.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Your Tags</CardTitle>
                <CardDescription>
                  Manage tags for organizing your business
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
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="service">Service Type</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredTags.length === 0 ? (
              <div className="py-8 text-center">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground text-sm">
                  No tags found in this category
                </p>
              </div>
            ) : (
              filteredTags.map((tag) => {
                const CategoryIcon = getCategoryIcon(tag.category);

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    key={tag.id}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{tag.name}</h4>
                          <Badge variant="outline">
                            {getCategoryLabel(tag.category)}
                          </Badge>
                          {!tag.active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-muted-foreground text-sm">
                          {tag.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <Badge variant="secondary">
                            Used {tag.usageCount} times
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
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
            <Save className="mr-2 h-4 w-4" />
            Save Tag Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
