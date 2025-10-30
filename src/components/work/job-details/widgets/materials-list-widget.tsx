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

interface MaterialsListWidgetProps {
  job: Job;
}

// Mock material type (in production, fetch from job_materials table)
interface Material {
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
}

export function MaterialsListWidget({ job }: MaterialsListWidgetProps) {
  // Mock materials (in production, fetch from database)
  const materials: Material[] = [
    {
      id: "1",
      name: "3.5 Ton HVAC Unit",
      sku: "HVAC-35T-001",
      category: "HVAC Equipment",
      quantity: 1,
      unit: "unit",
      unitCost: 3500.0,
      totalCost: 3500.0,
      supplier: "HVAC Supply Co.",
      status: "received",
    },
    {
      id: "2",
      name: 'Copper Refrigerant Line Set (3/8" x 3/4")',
      sku: "COP-LN-3875",
      category: "Piping",
      quantity: 25,
      unit: "ft",
      unitCost: 12.5,
      totalCost: 312.5,
      supplier: "HVAC Supply Co.",
      status: "in_stock",
    },
    {
      id: "3",
      name: "R-410A Refrigerant",
      sku: "REF-410A-25",
      category: "Refrigerants",
      quantity: 2,
      unit: "lbs",
      unitCost: 45.0,
      totalCost: 90.0,
      supplier: "HVAC Supply Co.",
      status: "low_stock",
      notes: "Need to order more",
    },
    {
      id: "4",
      name: "Thermostat (Smart WiFi)",
      sku: "THERM-WIFI-100",
      category: "Controls",
      quantity: 1,
      unit: "unit",
      unitCost: 250.0,
      totalCost: 250.0,
      supplier: "Tech Distributors",
      status: "ordered",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
    {
      id: "5",
      name: "Condensate Drain Pan",
      sku: "DRAIN-PAN-24",
      category: "Drainage",
      quantity: 1,
      unit: "unit",
      unitCost: 85.0,
      totalCost: 85.0,
      supplier: "HVAC Supply Co.",
      status: "out_of_stock",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      notes: "Back-ordered",
    },
  ];

  const statusConfig = {
    in_stock: {
      label: "In Stock",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      variant: "default" as const,
    },
    low_stock: {
      label: "Low Stock",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
      variant: "outline" as const,
    },
    out_of_stock: {
      label: "Out of Stock",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
      variant: "destructive" as const,
    },
    ordered: {
      label: "Ordered",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
      variant: "secondary" as const,
    },
    received: {
      label: "Received",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
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
    if (!date) return "N/A";
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
                        <div className="rounded border-yellow-500 border-l-2 bg-yellow-50 p-2 dark:bg-yellow-950/30">
                          <p className="text-xs text-yellow-900 dark:text-yellow-100">
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
          <div className="flex items-start gap-2 rounded-lg border-yellow-500 border-l-4 bg-yellow-50 p-3 dark:bg-yellow-950/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-600" />
            <div>
              <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">
                Stock Alert
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
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
