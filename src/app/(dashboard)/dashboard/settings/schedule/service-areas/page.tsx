"use client";

/**
 * Settings > Schedule > Service Areas Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { HelpCircle, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
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

type ServiceArea = {
  id: string;
  name: string;
  zipCodes: string;
  travelFeeType: "none" | "flat" | "perMile";
  travelFeeAmount: number;
  minimumJobAmount: number;
  enabled: boolean;
};

export default function ServiceAreasSettingsPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    primaryAddress: "123 Main St, City, ST 12345",
    radius: 25,
    radiusUnit: "miles",
    allowOutsideServiceArea: false,
    outsideAreaFeeType: "perMile",
    outsideAreaFeeAmount: 2.5,
    showServiceAreaOnWebsite: true,
    requireServiceAreaForBooking: true,
  });

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    {
      id: "1",
      name: "Downtown Core",
      zipCodes: "12345, 12346, 12347",
      travelFeeType: "none",
      travelFeeAmount: 0,
      minimumJobAmount: 50,
      enabled: true,
    },
    {
      id: "2",
      name: "Suburban Zone",
      zipCodes: "12350-12360",
      travelFeeType: "flat",
      travelFeeAmount: 25,
      minimumJobAmount: 75,
      enabled: true,
    },
    {
      id: "3",
      name: "Extended Area",
      zipCodes: "12400, 12401, 12402",
      travelFeeType: "perMile",
      travelFeeAmount: 2,
      minimumJobAmount: 100,
      enabled: false,
    },
  ]);

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const addServiceArea = () => {
    const newArea: ServiceArea = {
      id: Math.random().toString(),
      name: "",
      zipCodes: "",
      travelFeeType: "none",
      travelFeeAmount: 0,
      minimumJobAmount: 0,
      enabled: true,
    };
    setServiceAreas((prev) => [...prev, newArea]);
    setHasUnsavedChanges(true);
  };

  const removeServiceArea = (id: string) => {
    setServiceAreas((prev) => prev.filter((area) => area.id !== id));
    setHasUnsavedChanges(true);
  };

  const updateServiceArea = (
    id: string,
    field: keyof ServiceArea,
    value: string | number | boolean
  ) => {
    setServiceAreas((prev) =>
      prev.map((area) => (area.id === id ? { ...area, [field]: value } : area))
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Service Areas</h1>
            <p className="mt-2 text-muted-foreground">
              Define where you provide services and manage travel fees
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
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Primary Service Area
            </CardTitle>
            <CardDescription>
              Set your main business location and default service radius
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Business Address
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Your primary business location used as the center point
                      for service area calculations
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                onChange={(e) =>
                  updateSetting("primaryAddress", e.target.value)
                }
                placeholder="123 Main St, City, ST 12345"
                value={settings.primaryAddress}
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Service Radius
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How far from your business location you provide services
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min="1"
                    onChange={(e) =>
                      updateSetting("radius", Number(e.target.value))
                    }
                    type="number"
                    value={settings.radius}
                  />
                  <Select
                    onValueChange={(value) =>
                      updateSetting("radiusUnit", value)
                    }
                    value={settings.radiusUnit}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="miles">miles</SelectItem>
                      <SelectItem value="kilometers">kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Show Service Area on Website
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display service area map on public booking page
                </p>
              </div>
              <Switch
                checked={settings.showServiceAreaOnWebsite}
                onCheckedChange={(checked) =>
                  updateSetting("showServiceAreaOnWebsite", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Service Area for Booking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Prevent bookings from addresses outside service area
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Block online bookings from outside service area
                </p>
              </div>
              <Switch
                checked={settings.requireServiceAreaForBooking}
                onCheckedChange={(checked) =>
                  updateSetting("requireServiceAreaForBooking", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outside Service Area</CardTitle>
            <CardDescription>
              Configure options for jobs outside your primary service area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Jobs Outside Service Area
                </Label>
                <p className="text-muted-foreground text-xs">
                  Accept jobs beyond your standard service radius
                </p>
              </div>
              <Switch
                checked={settings.allowOutsideServiceArea}
                onCheckedChange={(checked) =>
                  updateSetting("allowOutsideServiceArea", checked)
                }
              />
            </div>

            {settings.allowOutsideServiceArea && (
              <>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="font-medium text-sm">
                      Additional Travel Fee Type
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        updateSetting("outsideAreaFeeType", value)
                      }
                      value={settings.outsideAreaFeeType}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Additional Fee</SelectItem>
                        <SelectItem value="flat">Flat Fee</SelectItem>
                        <SelectItem value="perMile">Per Mile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.outsideAreaFeeType !== "none" && (
                    <div>
                      <Label className="font-medium text-sm">Fee Amount</Label>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          className="w-24"
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "outsideAreaFeeAmount",
                              Number(e.target.value)
                            )
                          }
                          step="0.01"
                          type="number"
                          value={settings.outsideAreaFeeAmount}
                        />
                        {settings.outsideAreaFeeType === "perMile" && (
                          <span className="text-muted-foreground">/mile</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Custom Service Areas</CardTitle>
                <CardDescription>
                  Define specific zones with custom pricing and requirements
                </CardDescription>
              </div>
              <Button onClick={addServiceArea} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Area
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceAreas.map((area) => (
              <div className="space-y-4 rounded-lg border p-4" key={area.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={area.enabled}
                      onCheckedChange={(checked) =>
                        updateServiceArea(area.id, "enabled", checked)
                      }
                    />
                    <Input
                      className="w-64 font-medium"
                      onChange={(e) =>
                        updateServiceArea(area.id, "name", e.target.value)
                      }
                      placeholder="Area name"
                      value={area.name}
                    />
                  </div>
                  <Button
                    onClick={() => removeServiceArea(area.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="flex items-center gap-2 text-sm">
                      ZIP Codes
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Comma-separated ZIP codes or ranges (e.g., 12345,
                            12350-12360)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      className="mt-1"
                      onChange={(e) =>
                        updateServiceArea(area.id, "zipCodes", e.target.value)
                      }
                      placeholder="12345, 12350-12360"
                      value={area.zipCodes}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Minimum Job Amount</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        min="0"
                        onChange={(e) =>
                          updateServiceArea(
                            area.id,
                            "minimumJobAmount",
                            Number(e.target.value)
                          )
                        }
                        type="number"
                        value={area.minimumJobAmount}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm">Travel Fee Type</Label>
                    <Select
                      onValueChange={(value) =>
                        updateServiceArea(
                          area.id,
                          "travelFeeType",
                          value as ServiceArea["travelFeeType"]
                        )
                      }
                      value={area.travelFeeType}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Travel Fee</SelectItem>
                        <SelectItem value="flat">Flat Fee</SelectItem>
                        <SelectItem value="perMile">Per Mile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {area.travelFeeType !== "none" && (
                    <div>
                      <Label className="text-sm">Travel Fee Amount</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateServiceArea(
                              area.id,
                              "travelFeeAmount",
                              Number(e.target.value)
                            )
                          }
                          step="0.01"
                          type="number"
                          value={area.travelFeeAmount}
                        />
                        {area.travelFeeType === "perMile" && (
                          <span className="text-muted-foreground">/mile</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {serviceAreas.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                No custom service areas configured
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Service Area Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Clearly define your service areas to set customer expectations.
                Use ZIP codes for precise coverage and consider travel time when
                setting fees. Review service areas quarterly to ensure they
                align with your business capacity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
