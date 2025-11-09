/**
 * Materials Tab - Line Items & Inventory Management
 */

"use client";

import { Package, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MaterialsTabProps {
  job: any;
  materials: any[];
  isEditMode: boolean;
}

export function MaterialsTab({
  job,
  materials,
  isEditMode,
}: MaterialsTabProps) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  const totalCost = materials.reduce(
    (sum, item) => sum + (item.quantity * item.unit_price || 0),
    0
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Line Items</CardTitle>
              <Badge variant="secondary">{materials.length}</Badge>
            </div>
            {isEditMode && (
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {materials && materials.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    {isEditMode && <TableHead />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price || 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.quantity * item.unit_price || 0)}
                      </TableCell>
                      {isEditMode && (
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end border-t pt-4">
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">
                    Total Materials
                  </p>
                  <p className="font-bold text-2xl">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No line items added yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
