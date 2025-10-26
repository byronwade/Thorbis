"use client";

import { CreditCard, Plus, Save } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

export default function DebitCardsSettingsPage() {
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
            <h1 className="font-bold text-3xl tracking-tight">Debit Cards</h1>
            <p className="mt-2 text-muted-foreground">
              Issue and manage company debit cards for employees
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Issue Card
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
              <CreditCard className="h-5 w-5 text-primary" />
              Card Program Settings
            </CardTitle>
            <CardDescription>
              Configure company debit card program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Debit Card Program</Label>
                <p className="text-muted-foreground text-sm">
                  Issue cards to employees for business expenses
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Default Daily Limit ($)</Label>
              <Input
                onChange={() => setHasUnsavedChanges(true)}
                placeholder="500"
                type="number"
              />
              <p className="text-muted-foreground text-xs">
                Default spending limit per day
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Receipts</Label>
                <p className="text-muted-foreground text-sm">
                  Employees must upload receipts for all transactions
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
                <Label>Real-time Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Get notified of all card transactions
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
