"use client";

import { Gift, Plus, Save } from "lucide-react";
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

export default function GiftCardsSettingsPage() {
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
            <h1 className="font-bold text-3xl tracking-tight">Gift Cards</h1>
            <p className="mt-2 text-muted-foreground">
              Sell and manage customer gift cards
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Gift Card
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
              <Gift className="h-5 w-5 text-primary" />
              Gift Card Program
            </CardTitle>
            <CardDescription>
              Configure customer gift card sales and redemption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Gift Card Sales</Label>
                <p className="text-muted-foreground text-sm">
                  Allow customers to purchase gift cards
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Gift Card Type</Label>
              <Select
                defaultValue="both"
                onValueChange={() => setHasUnsavedChanges(true)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Cards Only</SelectItem>
                  <SelectItem value="digital">Digital Cards Only</SelectItem>
                  <SelectItem value="both">Both Physical & Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Minimum Amount ($)</Label>
              <Input
                onChange={() => setHasUnsavedChanges(true)}
                placeholder="25"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Amount ($)</Label>
              <Input
                onChange={() => setHasUnsavedChanges(true)}
                placeholder="500"
                type="number"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Expiration Period</Label>
              <Select
                defaultValue="never"
                onValueChange={() => setHasUnsavedChanges(true)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="never">Never Expires</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Partial Redemption</Label>
                <p className="text-muted-foreground text-sm">
                  Use gift card for partial payment amounts
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
                <Label>Email Digital Cards</Label>
                <p className="text-muted-foreground text-sm">
                  Send digital gift cards via email
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Gift className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Gift Cards Generate Revenue
              </p>
              <p className="text-muted-foreground text-sm">
                Gift cards provide immediate cash flow and often result in
                customers spending more than the card value. They also attract
                new customers through referrals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
