/**
 * Materials Page - Seamless Datatable Layout
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 */

import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type Material,
  MaterialsTable,
} from "@/components/work/materials-table";

// Mock data - replace with real data from database
const mockMaterials: Material[] = [
  {
    id: "1",
    itemCode: "MAT-001",
    description: 'Copper Pipe 3/4"',
    category: "Plumbing",
    quantity: 250,
    unit: "ft",
    unitCost: 250,
    totalValue: 62_500,
    status: "in-stock",
  },
  {
    id: "2",
    itemCode: "MAT-002",
    description: "Circuit Breaker 20A",
    category: "Electrical",
    quantity: 45,
    unit: "units",
    unitCost: 1250,
    totalValue: 56_250,
    status: "in-stock",
  },
  {
    id: "3",
    itemCode: "MAT-003",
    description: "HVAC Filter 20x25x1",
    category: "HVAC",
    quantity: 8,
    unit: "units",
    unitCost: 1500,
    totalValue: 12_000,
    status: "low-stock",
  },
  {
    id: "4",
    itemCode: "MAT-004",
    description: 'PVC Pipe 2"',
    category: "Plumbing",
    quantity: 0,
    unit: "ft",
    unitCost: 175,
    totalValue: 0,
    status: "out-of-stock",
  },
  {
    id: "5",
    itemCode: "MAT-005",
    description: "Wire Nuts (Pack of 100)",
    category: "Electrical",
    quantity: 120,
    unit: "packs",
    unitCost: 850,
    totalValue: 102_000,
    status: "in-stock",
  },
  {
    id: "6",
    itemCode: "MAT-006",
    description: "Refrigerant R-410A",
    category: "HVAC",
    quantity: 15,
    unit: "lbs",
    unitCost: 4500,
    totalValue: 67_500,
    status: "low-stock",
  },
  {
    id: "7",
    itemCode: "MAT-007",
    description: 'Ball Valve 1/2"',
    category: "Plumbing",
    quantity: 75,
    unit: "units",
    unitCost: 850,
    totalValue: 63_750,
    status: "in-stock",
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function MaterialsPage() {
  // Calculate stats from data
  const totalItems = mockMaterials.length;
  const inStock = mockMaterials.filter((m) => m.status === "in-stock").length;
  const lowStock = mockMaterials.filter((m) => m.status === "low-stock").length;
  const outOfStock = mockMaterials.filter(
    (m) => m.status === "out-of-stock"
  ).length;
  const totalValue = mockMaterials.reduce((sum, m) => sum + m.totalValue, 0);

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
            <Button
              className="md:hidden"
              size="sm"
              title="Import"
              variant="outline"
            >
              <Upload className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Upload className="mr-2 size-4" />
              Import
            </Button>

            <Button
              className="md:hidden"
              size="sm"
              title="Export"
              variant="outline"
            >
              <Download className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Download className="mr-2 size-4" />
              Export
            </Button>

            <Button asChild size="sm">
              <Link href="/dashboard/work/materials/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">Add Material</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </>
        }
        description="Track and manage company materials, parts, and supplies"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalItems}</div>
                <p className="text-muted-foreground text-xs">
                  Across all categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">In Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{inStock}</div>
                <p className="text-muted-foreground text-xs">
                  {Math.round((inStock / totalItems) * 100)}% availability
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{lowStock}</div>
                <p className="text-muted-foreground text-xs">
                  {outOfStock} out of stock
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Inventory Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {formatCurrency(totalValue)}
                </div>
                <p className="text-muted-foreground text-xs">
                  Current stock value
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Materials Inventory"
      />

      <div className="flex-1 overflow-auto">
        <MaterialsTable itemsPerPage={50} materials={mockMaterials} />
      </div>
    </div>
  );
}
