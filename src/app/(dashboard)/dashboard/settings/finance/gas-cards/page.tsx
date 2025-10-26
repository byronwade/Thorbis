"use client";

import { Fuel, Plus, Save } from "lucide-react";
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
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

export default function GasCardsSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Gas Cards</h1>
            <p className="mt-2 text-muted-foreground">
              Manage fleet gas cards for employee vehicles
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Issue Gas Card
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-primary" />
              Fleet Card Program
            </CardTitle>
            <CardDescription>
              Configure gas card program for your fleet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Card Provider</Label>
              <Select
                defaultValue="shell"
                onValueChange={() => setHasUnsavedChanges(true)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shell">Shell Fleet Plus</SelectItem>
                  <SelectItem value="exxon">ExxonMobil Fleet Card</SelectItem>
                  <SelectItem value="bp">BP Business Solutions</SelectItem>
                  <SelectItem value="wex">WEX Fleet Card</SelectItem>
                  <SelectItem value="fleet">Fleetcor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Daily Fuel Limit (gallons)</Label>
              <Input
                onChange={() => setHasUnsavedChanges(true)}
                placeholder="30"
                type="number"
              />
              <p className="text-muted-foreground text-xs">
                Maximum gallons per day per card
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Restrict to Fuel Only</Label>
                <p className="text-muted-foreground text-sm">
                  Prevent purchases of non-fuel items
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Odometer Entry</Label>
                <p className="text-muted-foreground text-sm">
                  Track mileage with each fuel purchase
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
