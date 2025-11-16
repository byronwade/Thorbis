/**
 * Materials List Widget - Server Component
 *
 * Displays materials required for the job with quantities, costs, and inventory status.
 * Critical for job costing and inventory management.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

type MaterialsListWidgetProps = {
  job: Job;
  materials?: unknown[];
};

// Material type from database
type Material = {
  id: string;
  name: string;
  sku?: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "ordered" | "received";
  estimatedDelivery?: Date;
  notes?: string;
};

export function MaterialsListWidget({
  job,
  materials: materialsData = [],
}: MaterialsListWidgetProps) {
  // Transform materials from database (job_line_items)
  const materials: Material[] = (materialsData as any[])
    .filter(
      (item) => item.item_type === "material" || item.item_type === "product"
    )
    .map((item) => ({
      id: item.id,
      name: item.name || item.description || "Unnamed Material",
      sku: item.sku || undefined,
      category: item.category || "General",
      quantity: item.quantity || 1,
      unit: item.unit || "unit",
      unitCost: (item.unit_price || 0) / 100, // Convert from cents
      totalCost: (item.total_price || 0) / 100, // Convert from cents
      supplier: undefined, // TODO: Add supplier to job_line_items
      status: "in_stock" as const, // TODO: Add inventory status tracking
      notes: item.notes,
    }));

  const statusConfig = {
    in_stock: {
      label: "In Stock",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success dark:bg-success",
      variant: "default" as const,
    },
    low_stock: {
      label: "Low Stock",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning dark:bg-warning",
      variant: "outline" as const,
    },
    out_of_stock: {
      label: "Out of Stock",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive dark:bg-destructive",
      variant: "destructive" as const,
    },
    ordered: {
      label: "Ordered",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary dark:bg-primary",
      variant: "secondary" as const,
    },
    received: {
      label: "Received",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success dark:bg-success",
      variant: "default" as const,
    },
  };

  // Calculate totals and progress
  const totalCost = materials.reduce((sum, m) => sum + m.totalCost, 0);
  const receivedItems = materials.filter(
    (m) => m.status === "received" || m.status === "in_stock"
  ).length;
  const totalItems = materials.length;
  const progressPercentage =
    totalItems > 0 ? (receivedItems / totalItems) * 100 : 0;

  function formatDate(date?: Date): string {
    if (!date) {
      return "N/A";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  // Group materials by category
  const materialsByCategory = materials.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = [];
      }
      acc[material.category].push(material);
      return acc;
    },
    {} as Record<string, Material[]>
  );

  if (materials.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center">
        <div>
          <Package className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
          <p className="mb-2 text-muted-foreground text-sm">
            No materials added yet
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/work/${job.id}/materials`}>
              <Plus className="mr-2 size-4" />
              Add Materials
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
        <h4 className="font-semibold text-sm">Materials List</h4>
        <Badge className="text-xs" variant="secondary">
          {receivedItems}/{totalItems} ready
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Materials Ready</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress className="h-2" value={progressPercentage} />
      </div>

      <Separator />

      {/* Materials by Category */}
      <div className="space-y-4">
        {Object.entries(materialsByCategory).map(
          ([category, categoryMaterials]) => (
            <div className="space-y-2" key={category}>
              <h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                {category}
              </h5>
              <div className="space-y-2">
                {categoryMaterials.map((material) => {
                  const config = statusConfig[material.status];
                  const Icon = config.icon;

                  return (
                    <div
                      className="space-y-2 rounded-lg border p-3"
                      key={material.id}
                    >
                      {/* Material Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <h6 className="font-medium text-sm">
                            {material.name}
                          </h6>
                          {material.sku && (
                            <p className="font-mono text-muted-foreground text-xs">
                              SKU: {material.sku}
                            </p>
                          )}
                        </div>
                        <Badge className="text-xs" variant={config.variant}>
                          <Icon className="mr-1 size-3" />
                          {config.label}
                        </Badge>
                      </div>

                      {/* Material Details */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Quantity:
                          </span>
                          <span className="font-medium">
                            {material.quantity} {material.unit}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Unit Cost:
                          </span>
                          <span className="font-medium">
                            ${material.unitCost.toFixed(2)}
                          </span>
                        </div>

                        {material.supplier && (
                          <div className="col-span-2 flex justify-between">
                            <span className="text-muted-foreground">
                              Supplier:
                            </span>
                            <span className="font-medium">
                              {material.supplier}
                            </span>
                          </div>
                        )}

                        <div className="col-span-2 flex justify-between border-t pt-1.5">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-semibold">
                            ${material.totalCost.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      {material.estimatedDelivery && (
                        <div className="rounded bg-muted p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Est. Delivery:
                            </span>
                            <span className="font-medium">
                              {formatDate(material.estimatedDelivery)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {material.notes && (
                        <div className="rounded border-warning border-l-2 bg-warning p-2 dark:bg-warning/30">
                          <p className="text-warning text-xs dark:text-warning">
                            {material.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Warnings */}
      {materials.some(
        (m) => m.status === "out_of_stock" || m.status === "low_stock"
      ) && (
        <>
          <Separator />
          <div className="flex items-start gap-2 rounded-lg border-warning border-l-4 bg-warning p-3 dark:bg-warning/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
            <div>
              <p className="font-medium text-sm text-warning dark:text-warning">
                Stock Alert
              </p>
              <p className="text-warning text-xs dark:text-warning">
                Some materials are low or out of stock. Order now to avoid
                delays.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <Separator />
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={`/dashboard/work/${job.id}/materials`}>
            <Package className="mr-2 size-4" />
            Manage Materials
          </Link>
        </Button>
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={"/dashboard/inventory/parts"}>View Inventory</Link>
        </Button>
      </div>

      {/* Cost Summary */}
      <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Total Materials Cost:</span>
          <span className="font-bold text-lg">${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
