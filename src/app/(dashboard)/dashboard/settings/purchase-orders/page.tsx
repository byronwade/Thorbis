"use client";

/**
 * Settings > Purchase Orders Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  ChevronLeft,
  DollarSign,
  Mail,
  Package,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
export default function PurchaseOrderSettingsPage() {
  const [requireApproval, setRequireApproval] = useState(true);
  const [approvalThreshold, setApprovalThreshold] = useState("500");
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);
  const [autoGenerateThreshold, setAutoGenerateThreshold] = useState("100");
  const [defaultVendors, setDefaultVendors] = useState("");
  const [notificationEmails, setNotificationEmails] = useState("");
  const [approvers, setApprovers] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="ghost">
          <Link href="/dashboard/settings">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-bold text-2xl tracking-tight">
            Purchase Order Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure how your purchase order system operates
          </p>
        </div>
      </div>

      {/* Approval Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Approval Settings</CardTitle>
          </div>
          <CardDescription>
            Configure when purchase orders require approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Require Approval Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Require Approval</Label>
              <p className="text-muted-foreground text-sm">
                All purchase orders must be approved before ordering
              </p>
            </div>
            <Switch
              checked={requireApproval}
              id="require-approval"
              onCheckedChange={setRequireApproval}
            />
          </div>

          {/* Approval Threshold */}
          {requireApproval && (
            <div className="space-y-2">
              <Label htmlFor="approval-threshold">
                Approval Threshold (Optional)
              </Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="approval-threshold"
                  onChange={(e) => setApprovalThreshold(e.target.value)}
                  placeholder="500.00"
                  type="number"
                  value={approvalThreshold}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Only require approval for POs above this amount. Leave empty to
                require approval for all POs.
              </p>
            </div>
          )}

          {/* Approvers */}
          {requireApproval && (
            <div className="space-y-2">
              <Label htmlFor="approvers">Approvers</Label>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="size-4" />
                  <span>No approvers selected</span>
                </div>
                <Button className="mt-3" size="sm" variant="outline">
                  Add Approvers
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Select team members who can approve purchase orders
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Generation Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Automatic PO Generation</CardTitle>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <CardDescription>
            Automatically create purchase orders when materials are needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-Generate Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-generate">Enable Auto-Generation</Label>
              <p className="text-muted-foreground text-sm">
                System will automatically create POs for approved estimates
              </p>
            </div>
            <Switch
              checked={autoGenerateEnabled}
              disabled
              id="auto-generate"
              onCheckedChange={setAutoGenerateEnabled}
            />
          </div>

          {/* Auto-Generate Threshold */}
          {autoGenerateEnabled && (
            <div className="space-y-2">
              <Label htmlFor="auto-threshold">Auto-Generation Threshold</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  disabled
                  id="auto-threshold"
                  onChange={(e) => setAutoGenerateThreshold(e.target.value)}
                  placeholder="100.00"
                  type="number"
                  value={autoGenerateThreshold}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Only auto-generate POs for line items above this amount
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Default Vendors */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Default Vendors</CardTitle>
          </div>
          <CardDescription>
            Frequently used vendors for quick PO creation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendors">Vendor List</Label>
            <Textarea
              id="vendors"
              onChange={(e) => setDefaultVendors(e.target.value)}
              placeholder="Enter vendor names (one per line)&#10;Home Depot&#10;Ferguson&#10;Grainger"
              rows={5}
              value={defaultVendors}
            />
            <p className="text-muted-foreground text-xs">
              Add frequently used vendors to speed up PO creation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Email notifications for purchase order events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-emails">Notification Emails</Label>
            <Input
              id="notification-emails"
              onChange={(e) => setNotificationEmails(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              type="email"
              value={notificationEmails}
            />
            <p className="text-muted-foreground text-xs">
              Comma-separated email addresses to notify when POs are created or
              updated
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard/settings">Cancel</Link>
        </Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
