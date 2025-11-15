/**
 * Job Materials Section
 * Displays materials used on this job
 */

"use client";

import { Package } from "lucide-react";
import { updateEntityTags } from "@/actions/entity-tags";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type JobMaterialsProps = {
  materials: any[];
};

export function JobMaterials({ materials }: JobMaterialsProps) {
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold text-lg">No Materials</h3>
        <p className="text-muted-foreground text-sm">
          No materials have been added to this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">
                  {material.name || material.material_name || "—"}
                </TableCell>
                <TableCell>{material.quantity || 0}</TableCell>
                <TableCell>{material.unit || "ea"}</TableCell>
                <TableCell>
                  {formatCurrency(material.unit_cost || material.cost)}
                </TableCell>
                <TableCell className="max-w-[240px] align-top">
                  <EntityTags
                    entityId={material.id}
                    entityType="material"
                    onUpdateTags={(id, tags) =>
                      updateEntityTags("material", id, tags)
                    }
                    tags={
                      Array.isArray(material?.metadata?.tags)
                        ? (material.metadata.tags as any[])
                        : []
                    }
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    (material.quantity || 0) *
                      (material.unit_cost || material.cost || 0)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="rounded-md bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Total Materials</p>
            <p className="text-muted-foreground text-xs">
              {materials.length} item{materials.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl">
              {formatCurrency(
                materials.reduce(
                  (sum, m) =>
                    sum + (m.quantity || 0) * (m.unit_cost || m.cost || 0),
                  0
                )
              )}
            </p>
            <p className="text-muted-foreground text-xs">Total Cost</p>
          </div>
        </div>
      </div>
    </div>
  );
}
