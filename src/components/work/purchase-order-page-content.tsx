/**
 * Purchase Order Page Content
 *
 * Comprehensive purchase order details with collapsible sections
 * Matches job, customer, appointment, team member detail page patterns
 *
 * Sections:
 * - PO Information (number, vendor, dates, priority)
 * - Line Items (materials/items being ordered)
 * - Job Details (if linked to a job)
 * - Delivery Information (address, expected date, tracking)
 * - Activity Log (PO history and changes)
 */

"use client";

import {
  Package,
  Building2,
  Calendar,
  MapPin,
  FileText,
  Activity,
  Wrench,
  Phone,
  Mail,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
} from "@/components/ui/accordion";
import { CollapsibleDataSection } from "@/components/ui/collapsible-data-section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

export type PurchaseOrderData = {
  purchaseOrder: any;
  job?: any;
  lineItems?: any[];
  activities?: any[];
};

export type PurchaseOrderPageContentProps = {
  entityData: PurchaseOrderData;
  metrics: any;
};

const defaultAccordionSections = [
  "po-info",
  "line-items",
];

export function PurchaseOrderPageContent({
  entityData,
  metrics,
}: PurchaseOrderPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    purchaseOrder: po,
    job,
    lineItems = [],
    activities = [],
  } = entityData;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  return (
    <div className="flex-1">
      {/* Hero Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* PO Number Badge */}
          <div className="mb-3">
            <Badge variant="outline">
              {po.po_number || po.poNumber}
            </Badge>
          </div>

          {/* Title and Status */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-bold text-4xl">{po.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant={
                  po.status === "received" ? "default" :
                  po.status === "ordered" ? "secondary" :
                  "outline"
                }>
                  {po.status}
                </Badge>
                {po.priority && (
                  <Badge variant="outline">{po.priority} priority</Badge>
                )}
                {po.auto_generated && (
                  <Badge variant="outline">Auto-generated</Badge>
                )}
              </div>
            </div>

            {hasChanges && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setHasChanges(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>
                <Button
                  disabled={isSaving}
                  onClick={() => {}}
                  size="sm"
                >
                  <Save className="mr-2 size-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {/* Vendor Info */}
          {po.vendor && (
            <div className="mt-6">
              <p className="text-muted-foreground text-sm">Vendor</p>
              <p className="font-medium">{po.vendor}</p>
            </div>
          )}

          {/* Key Dates */}
          <div className="mt-4 flex flex-wrap items-center gap-6">
            {po.created_at && (
              <div>
                <p className="text-muted-foreground text-sm">Created</p>
                <p className="font-medium text-sm">
                  {new Date(po.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
            {po.expected_delivery && (
              <div>
                <p className="text-muted-foreground text-sm">Expected Delivery</p>
                <p className="font-medium text-sm">
                  {new Date(po.expected_delivery).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split Screen Layout: Line Items Left, Details Right */}
      <div className="mx-auto flex h-full w-full max-w-[1800px] gap-6 px-6 py-8">
        {/* Left Side: Line Items (Primary Content) */}
        <div className="flex w-full flex-1 flex-col lg:w-3/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-xl">Line Items ({lineItems.length})</h2>
          </div>

          <div className="flex-1 overflow-auto rounded-lg border">
            {lineItems.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-24">Qty</TableHead>
                    <TableHead className="text-right w-32">Unit Price</TableHead>
                    <TableHead className="text-right w-32">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.unit_price || 0)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format((item.quantity || 0) * (item.unit_price || 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="border-t-2 bg-muted/50">
                    <TableCell colSpan={3} className="font-semibold text-right">Total</TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        lineItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0), 0)
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto size-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground text-sm">No line items yet</p>
                  <p className="text-muted-foreground text-xs">Add items to this purchase order</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Collapsible Details */}
        <div className="hidden w-full flex-col space-y-3 lg:flex lg:w-2/5">
          <div suppressHydrationWarning>
            <Accordion
              className="space-y-3"
              defaultValue={defaultAccordionSections}
              type="multiple"
            >
              {/* PO Information */}
              <CollapsibleDataSection
                value="po-info"
                title="Purchase Order Info"
                icon={<Package className="size-4" />}
              >
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">PO Number</Label>
                    <p className="font-medium text-sm">{po.po_number || po.poNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Vendor</Label>
                    <p className="font-medium text-sm">{po.vendor || "Unknown"}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Expected Delivery</Label>
                    <p className="font-medium text-sm">
                      {po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                  {po.auto_generated && (
                    <div>
                      <Badge variant="outline">Auto-generated from estimate</Badge>
                    </div>
                  )}
                </div>
              </CollapsibleDataSection>

              {/* Job Details */}
              {job && (
                <CollapsibleDataSection
                  value="job-details"
                  title="Related Job"
                  icon={<Wrench className="size-4" />}
                >
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Job Number</Label>
                      <Link
                        href={`/dashboard/work/${job.id}`}
                        className="block font-medium text-primary text-sm hover:underline"
                      >
                        #{job.job_number}
                      </Link>
                    </div>
                    <div>
                      <Label className="text-xs">Title</Label>
                      <p className="text-sm">{job.title}</p>
                    </div>
                  </div>
                </CollapsibleDataSection>
              )}

              {/* Delivery Information */}
              <CollapsibleDataSection
                value="delivery"
                title="Delivery"
                icon={<MapPin className="size-4" />}
              >
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Expected Date</Label>
                    <p className="text-sm">
                      {po.expected_delivery
                        ? new Date(po.expected_delivery).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not set"}
                    </p>
                  </div>
                  {po.tracking_number && (
                    <div>
                      <Label className="text-xs">Tracking Number</Label>
                      <p className="font-mono text-sm">{po.tracking_number}</p>
                    </div>
                  )}
                </div>
              </CollapsibleDataSection>

              {/* Activity Log */}
              <CollapsibleDataSection
                value="activity"
                title="Activity"
                icon={<Activity className="size-4" />}
                count={activities.length}
              >
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {activities.length > 0 ? (
                    activities.map((activity: any) => (
                      <div key={activity.id} className="rounded-lg border p-3">
                        <p className="text-sm">{activity.description}</p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          {activity.user?.name} •{" "}
                          {formatDistance(new Date(activity.created_at), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground text-sm">
                      No activity yet
                    </p>
                  )}
                </div>
              </CollapsibleDataSection>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
