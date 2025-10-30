/**
 * Purchase Orders Widget - Server Component
 *
 * Displays purchase orders related to the job with status tracking, vendor info, and delivery dates.
 * Critical for procurement and job cost tracking.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

interface PurchaseOrdersWidgetProps {
  job: Job;
}

// Mock purchase order type (in production, fetch from purchase_orders table)
interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  status:
    | "draft"
    | "sent"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  totalAmount: number;
  itemCount: number;
  notes?: string;
  trackingNumber?: string;
}

export function PurchaseOrdersWidget({ job }: PurchaseOrdersWidgetProps) {
  // Mock purchase orders (in production, fetch from database)
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "1",
      poNumber: "PO-2025-0042",
      vendor: "HVAC Supply Co.",
      status: "delivered",
      orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      expectedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      actualDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      totalAmount: 4237.5,
      itemCount: 5,
      trackingNumber: "1Z999AA1234567890",
    },
    {
      id: "2",
      poNumber: "PO-2025-0043",
      vendor: "Tech Distributors",
      status: "shipped",
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      expectedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      totalAmount: 335.0,
      itemCount: 2,
      trackingNumber: "1Z999AA9876543210",
      notes: "Signature required on delivery",
    },
    {
      id: "3",
      poNumber: "PO-2025-0044",
      vendor: "HVAC Supply Co.",
      status: "sent",
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      totalAmount: 85.0,
      itemCount: 1,
      notes: "Back-ordered item",
    },
  ];

  const statusConfig = {
    draft: {
      label: "Draft",
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-950",
      variant: "outline" as const,
    },
    sent: {
      label: "Sent",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
      variant: "secondary" as const,
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      variant: "default" as const,
    },
    shipped: {
      label: "Shipped",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
      variant: "secondary" as const,
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      variant: "default" as const,
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
      variant: "destructive" as const,
    },
  };

  // Calculate totals and progress
  const totalAmount = purchaseOrders.reduce(
    (sum, po) => sum + po.totalAmount,
    0
  );
  const deliveredOrders = purchaseOrders.filter(
    (po) => po.status === "delivered"
  ).length;
  const totalOrders = purchaseOrders.length;
  const progressPercentage =
    totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function formatDate(date?: Date): string {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function getDaysUntil(date?: Date): string {
    if (!date) return "";
    const diffMs = date.getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    return `in ${diffDays}d`;
  }

  if (purchaseOrders.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center">
        <div>
          <Package className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
          <p className="mb-2 text-muted-foreground text-sm">
            No purchase orders yet
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/work/purchase-orders?jobId=${job.id}`}>
              <FileText className="mr-2 size-4" />
              Create Purchase Order
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Purchase Orders</h4>
        <Badge className="text-xs" variant="secondary">
          {deliveredOrders}/{totalOrders} delivered
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Delivery Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress className="h-2" value={progressPercentage} />
      </div>

      {/* Total Amount */}
      <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Total PO Amount</span>
          <span className="font-bold text-lg">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Purchase Orders List */}
      <div className="space-y-3">
        {purchaseOrders.map((po) => {
          const config = statusConfig[po.status];
          const Icon = config.icon;
          const isOverdue =
            po.expectedDelivery &&
            po.expectedDelivery.getTime() < Date.now() &&
            po.status !== "delivered";

          return (
            <div className="space-y-2 rounded-lg border p-3" key={po.id}>
              {/* PO Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className={`rounded-full p-1.5 ${config.bgColor}`}>
                    <Icon className={`size-4 ${config.color}`} />
                  </div>
                  <div>
                    <h5 className="font-mono font-semibold text-sm">
                      {po.poNumber}
                    </h5>
                    <p className="text-muted-foreground text-xs">{po.vendor}</p>
                  </div>
                </div>
                <Badge className="text-xs" variant={config.variant}>
                  {config.label}
                </Badge>
              </div>

              {/* PO Details */}
              <div className="ml-10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">
                    {formatDate(po.orderDate)}
                  </span>
                </div>

                {po.expectedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Expected Delivery:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-medium ${isOverdue ? "text-red-600" : ""}`}
                      >
                        {formatDate(po.expectedDelivery)}
                      </span>
                      {!po.actualDelivery && (
                        <Badge
                          className="text-xs"
                          variant={isOverdue ? "destructive" : "outline"}
                        >
                          {getDaysUntil(po.expectedDelivery)}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {po.actualDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered:</span>
                    <span className="font-medium text-green-600">
                      {formatDate(po.actualDelivery)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">{po.itemCount}</span>
                </div>

                <div className="flex justify-between border-t pt-1.5">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">
                    {formatCurrency(po.totalAmount)}
                  </span>
                </div>

                {/* Tracking Number */}
                {po.trackingNumber && (
                  <div className="mt-2 rounded bg-muted p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tracking:</span>
                      <a
                        className="flex items-center gap-1 font-medium font-mono text-primary hover:underline"
                        href={`https://www.ups.com/track?tracknum=${po.trackingNumber}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {po.trackingNumber}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {po.notes && (
                  <div className="mt-2 rounded border-yellow-500 border-l-2 bg-yellow-50 p-2 dark:bg-yellow-950/30">
                    <p className="text-xs text-yellow-900 dark:text-yellow-100">
                      {po.notes}
                    </p>
                  </div>
                )}

                {/* Overdue Warning */}
                {isOverdue && (
                  <div className="mt-2 flex items-start gap-1.5 rounded border-red-500 border-l-2 bg-red-50 p-2 dark:bg-red-950/30">
                    <AlertCircle className="mt-0.5 size-3 shrink-0 text-red-600" />
                    <p className="text-red-900 text-xs dark:text-red-100">
                      Delivery overdue. Contact vendor for status update.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Alert */}
      {purchaseOrders.some(
        (po) =>
          po.expectedDelivery &&
          po.expectedDelivery.getTime() < Date.now() &&
          po.status !== "delivered"
      ) && (
        <>
          <Separator />
          <div className="flex items-start gap-2 rounded-lg border-red-500 border-l-4 bg-red-50 p-3 dark:bg-red-950/30">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
            <div>
              <p className="font-medium text-red-900 text-sm dark:text-red-100">
                Overdue Orders
              </p>
              <p className="text-red-800 text-xs dark:text-red-200">
                Some purchase orders are overdue. Follow up with vendors to
                avoid job delays.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <Separator />
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={`/dashboard/work/purchase-orders?jobId=${job.id}`}>
            <Package className="mr-2 size-4" />
            Manage Purchase Orders
          </Link>
        </Button>
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={"/dashboard/inventory/vendors"}>View Vendors</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-3 text-xs">
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground">Total POs</p>
          <p className="font-semibold">{totalOrders}</p>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground">In Transit</p>
          <p className="font-semibold">
            {purchaseOrders.filter((po) => po.status === "shipped").length}
          </p>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground">Pending</p>
          <p className="font-semibold">
            {
              purchaseOrders.filter(
                (po) => po.status === "sent" || po.status === "confirmed"
              ).length
            }
          </p>
        </div>
      </div>
    </div>
  );
}
