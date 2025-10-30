"use client";

/**
 * Settings > Lead Sources Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  BarChart3,
  DollarSign,
  Edit,
  Globe,
  HelpCircle,
  Loader2,
  MapPin,
  Plus,
  Radio,
  Save,
  Search,
  Settings,
  Star,
  Trash2,
  TrendingUp,
  Users,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;

type LeadSource = {
  id: string;
  name: string;
  category:
    | "online"
    | "referral"
    | "advertising"
    | "direct"
    | "partnership"
    | "other";
  leads: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  cost: number;
  roi: number;
  active: boolean;
};

type LeadSourceSettings = {
  // General Settings
  enableLeadTracking: boolean;
  requireLeadSource: boolean;
  allowCustomSources: boolean;
  autoDetectOnlineSource: boolean;

  // Tracking Settings
  trackUTMParameters: boolean;
  trackReferralSource: boolean;
  trackPhoneNumbers: boolean;
  trackLandingPages: boolean;

  // Attribution
  firstTouchAttribution: boolean;
  lastTouchAttribution: boolean;
  multiTouchAttribution: boolean;
  attributionWindow: number; // days

  // Reporting
  showSourceOnInvoices: boolean;
  showSourceInPortal: boolean;
  calculateROI: boolean;
  trackCostPerLead: boolean;

  // Automation
  autoAssignSourceByChannel: boolean;
  autoTagBySource: boolean;
  sendSourceReports: boolean;
  reportFrequency: "daily" | "weekly" | "monthly";
};

export default function LeadSourcesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [settings, setSettings] = useState<LeadSourceSettings>({
    // General Settings
    enableLeadTracking: true,
    requireLeadSource: true,
    allowCustomSources: true,
    autoDetectOnlineSource: true,

    // Tracking Settings
    trackUTMParameters: true,
    trackReferralSource: true,
    trackPhoneNumbers: true,
    trackLandingPages: true,

    // Attribution
    firstTouchAttribution: true,
    lastTouchAttribution: false,
    multiTouchAttribution: false,
    attributionWindow: 30,

    // Reporting
    showSourceOnInvoices: false,
    showSourceInPortal: false,
    calculateROI: true,
    trackCostPerLead: true,

    // Automation
    autoAssignSourceByChannel: true,
    autoTagBySource: true,
    sendSourceReports: true,
    reportFrequency: "weekly",
  });

  // Sample lead sources
  const [sources] = useState<LeadSource[]>([
    {
      id: "1",
      name: "Google Search",
      category: "online",
      leads: 234,
      conversions: 87,
      conversionRate: 37.2,
      revenue: 47_850,
      cost: 8500,
      roi: 463,
      active: true,
    },
    {
      id: "2",
      name: "Facebook Ads",
      category: "online",
      leads: 156,
      conversions: 42,
      conversionRate: 26.9,
      revenue: 21_340,
      cost: 4200,
      roi: 408,
      active: true,
    },
    {
      id: "3",
      name: "Customer Referral",
      category: "referral",
      leads: 89,
      conversions: 67,
      conversionRate: 75.3,
      revenue: 38_920,
      cost: 2230,
      roi: 1646,
      active: true,
    },
    {
      id: "4",
      name: "Google My Business",
      category: "online",
      leads: 178,
      conversions: 98,
      conversionRate: 55.1,
      revenue: 52_140,
      cost: 0,
      roi: 0,
      active: true,
    },
    {
      id: "5",
      name: "Yelp",
      category: "online",
      leads: 67,
      conversions: 34,
      conversionRate: 50.7,
      revenue: 18_230,
      cost: 1200,
      roi: 1419,
      active: true,
    },
    {
      id: "6",
      name: "Direct Mail",
      category: "advertising",
      leads: 45,
      conversions: 12,
      conversionRate: 26.7,
      revenue: 6780,
      cost: 3500,
      roi: 94,
      active: true,
    },
    {
      id: "7",
      name: "Radio Ad",
      category: "advertising",
      leads: 34,
      conversions: 8,
      conversionRate: 23.5,
      revenue: 4120,
      cost: 2800,
      roi: 47,
      active: false,
    },
    {
      id: "8",
      name: "Website Contact Form",
      category: "online",
      leads: 123,
      conversions: 78,
      conversionRate: 63.4,
      revenue: 41_250,
      cost: 0,
      roi: 0,
      active: true,
    },
    {
      id: "9",
      name: "Partner Referral",
      category: "partnership",
      leads: 56,
      conversions: 42,
      conversionRate: 75.0,
      revenue: 28_340,
      cost: 5670,
      roi: 400,
      active: true,
    },
    {
      id: "10",
      name: "Service Plan Renewal",
      category: "direct",
      leads: 203,
      conversions: 187,
      conversionRate: 92.1,
      revenue: 37_230,
      cost: 0,
      roi: 0,
      active: true,
    },
    {
      id: "11",
      name: "Drive-By",
      category: "direct",
      leads: 23,
      conversions: 9,
      conversionRate: 39.1,
      revenue: 4580,
      cost: 0,
      roi: 0,
      active: true,
    },
    {
      id: "12",
      name: "Yard Sign",
      category: "advertising",
      leads: 12,
      conversions: 5,
      conversionRate: 41.7,
      revenue: 2340,
      cost: 450,
      roi: 420,
      active: true,
    },
  ]);

  const updateSetting = <K extends keyof LeadSourceSettings>(
    key: K,
    value: LeadSourceSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      online: "Online",
      referral: "Referral",
      advertising: "Advertising",
      direct: "Direct",
      partnership: "Partnership",
      other: "Other",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof Globe> = {
      online: Globe,
      referral: Users,
      advertising: Radio,
      direct: MapPin,
      partnership: Star,
      other: Settings,
    };
    return icons[category] || Settings;
  };

  const filteredSources =
    selectedCategory === "all"
      ? sources
      : sources.filter((source) => source.category === selectedCategory);

  const totalLeads = sources.reduce((sum, s) => sum + s.leads, 0);
  const totalConversions = sources.reduce((sum, s) => sum + s.conversions, 0);
  const totalRevenue = sources.reduce((sum, s) => sum + s.revenue, 0);
  const totalCost = sources.reduce((sum, s) => sum + s.cost, 0);
  const avgConversionRate =
    totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : "0";
  const overallROI =
    totalCost > 0
      ? (((totalRevenue - totalCost) / totalCost) * 100).toFixed(0)
      : "0";

  const topSource = sources.reduce((prev, current) =>
    current.conversions > prev.conversions ? current : prev
  );

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
            <h1 className="font-bold text-3xl tracking-tight">Lead Sources</h1>
            <p className="mt-2 text-muted-foreground">
              Track where your customers come from and ROI
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Source
          </Button>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Leads</p>
                  <p className="mt-1 font-bold text-2xl">{totalLeads}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Conversions</p>
                  <p className="mt-1 font-bold text-2xl">{totalConversions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Conversion Rate
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    {avgConversionRate}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Overall ROI</p>
                  <p className="mt-1 font-bold text-2xl">{overallROI}%</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performer */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-green-500" />
              Top Performing Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-2xl">{topSource.name}</h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  {topSource.conversions} conversions from {topSource.leads}{" "}
                  leads ({topSource.conversionRate.toFixed(1)}% conversion rate)
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl text-green-600">
                  ${topSource.revenue.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">Revenue</p>
              </div>
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
                  <p className="max-w-xs">How lead source tracking works</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Basic lead source configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Lead Tracking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Track where leads come from</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track lead sources for all customers
                </p>
              </div>
              <Switch
                checked={settings.enableLeadTracking}
                onCheckedChange={(checked) =>
                  updateSetting("enableLeadTracking", checked)
                }
              />
            </div>

            {settings.enableLeadTracking && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Lead Source
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Must select source when creating new customer
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Can't create customer without source
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireLeadSource}
                    onCheckedChange={(checked) =>
                      updateSetting("requireLeadSource", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Custom Sources
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Let team create new lead sources on the fly
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Team can add new sources
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowCustomSources}
                    onCheckedChange={(checked) =>
                      updateSetting("allowCustomSources", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Auto-Detect Online Source
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Automatically detect source from website forms
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Detect source from online forms
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDetectOnlineSource}
                    onCheckedChange={(checked) =>
                      updateSetting("autoDetectOnlineSource", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tracking Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              Tracking Methods
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Ways to track where leads come from
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>How you track lead sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track UTM Parameters
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Capture UTM codes from URLs (utm_source, utm_campaign,
                        etc.)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track campaign parameters in URLs
                </p>
              </div>
              <Switch
                checked={settings.trackUTMParameters}
                onCheckedChange={(checked) =>
                  updateSetting("trackUTMParameters", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Referral Source
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Track which website sent visitor to you
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track referring websites
                </p>
              </div>
              <Switch
                checked={settings.trackReferralSource}
                onCheckedChange={(checked) =>
                  updateSetting("trackReferralSource", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Phone Numbers
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Use different phone numbers for different marketing
                        channels
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Use unique numbers per channel
                </p>
              </div>
              <Switch
                checked={settings.trackPhoneNumbers}
                onCheckedChange={(checked) =>
                  updateSetting("trackPhoneNumbers", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Landing Pages
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Track which page customer first landed on
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track first page visited
                </p>
              </div>
              <Switch
                checked={settings.trackLandingPages}
                onCheckedChange={(checked) =>
                  updateSetting("trackLandingPages", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Attribution Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Attribution Model
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Which touchpoint gets credit for the conversion
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How to attribute conversions to sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  First Touch Attribution
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Credit goes to where customer first found you
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Credit the first interaction
                </p>
              </div>
              <Switch
                checked={settings.firstTouchAttribution}
                onCheckedChange={(checked) =>
                  updateSetting("firstTouchAttribution", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Last Touch Attribution
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Credit goes to last source before conversion
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Credit the last interaction
                </p>
              </div>
              <Switch
                checked={settings.lastTouchAttribution}
                onCheckedChange={(checked) =>
                  updateSetting("lastTouchAttribution", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Multi-Touch Attribution
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Credit split between all touchpoints
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Split credit across all interactions
                </p>
              </div>
              <Switch
                checked={settings.multiTouchAttribution}
                onCheckedChange={(checked) =>
                  updateSetting("multiTouchAttribution", checked)
                }
              />
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Attribution Window (Days)
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How long after first contact to count as same customer
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                onChange={(e) =>
                  updateSetting(
                    "attributionWindow",
                    Number.parseInt(e.target.value, 10) || 30
                  )
                }
                placeholder="30"
                type="number"
                value={settings.attributionWindow}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Example: Track customer journey for 30 days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reporting & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Reporting & Analytics
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Track performance and ROI by source
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Performance tracking and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Calculate ROI
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Calculate return on investment for each source
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track revenue vs cost per source
                </p>
              </div>
              <Switch
                checked={settings.calculateROI}
                onCheckedChange={(checked) =>
                  updateSetting("calculateROI", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Cost Per Lead
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Calculate how much each lead costs
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Calculate cost to acquire each lead
                </p>
              </div>
              <Switch
                checked={settings.trackCostPerLead}
                onCheckedChange={(checked) =>
                  updateSetting("trackCostPerLead", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Source Reports
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically email performance reports
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Email regular performance reports
                </p>
              </div>
              <Switch
                checked={settings.sendSourceReports}
                onCheckedChange={(checked) =>
                  updateSetting("sendSourceReports", checked)
                }
              />
            </div>

            {settings.sendSourceReports && (
              <div>
                <Label className="font-medium text-sm">Report Frequency</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting(
                      "reportFrequency",
                      value as LeadSourceSettings["reportFrequency"]
                    )
                  }
                  value={settings.reportFrequency}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-muted-foreground text-xs">
                  How often to send reports
                </p>
              </div>
            )}

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    Double Your Marketing ROI
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Businesses that track lead sources see 2x better ROI by
                    focusing budget on what works. Stop wasting money on ads
                    that don't convert!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Your Lead Sources</CardTitle>
                <CardDescription>
                  Performance of each marketing channel
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
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredSources.length === 0 ? (
              <div className="py-8 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground text-sm">
                  No sources found in this category
                </p>
              </div>
            ) : (
              filteredSources.map((source) => {
                const CategoryIcon = getCategoryIcon(source.category);
                const _costPerLead =
                  source.leads > 0 ? source.cost / source.leads : 0;

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    key={source.id}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{source.name}</h4>
                          <Badge variant="outline">
                            {getCategoryLabel(source.category)}
                          </Badge>
                          {!source.active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <div className="mt-2 grid grid-cols-5 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground">Leads</p>
                            <p className="font-medium">{source.leads}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Converted</p>
                            <p className="font-medium">{source.conversions}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conv. Rate</p>
                            <p className="font-medium">
                              {source.conversionRate.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">
                              ${source.revenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p
                              className={`font-medium ${source.roi > 200 ? "text-green-600" : source.roi > 0 ? "text-blue-600" : "text-muted-foreground"}`}
                            >
                              {source.cost > 0 ? `${source.roi}%` : "Free"}
                            </p>
                          </div>
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
            Save Lead Source Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
