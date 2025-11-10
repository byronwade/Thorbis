/**
 * Materials Page - Seamless Datatable Layout
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 *
 * Note: Materials table doesn't exist yet - page shows empty state
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
import { MaterialsKanban } from "@/components/work/materials-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function MaterialsPage() {
  // Materials table doesn't exist yet - show empty state
  const mockMaterials: Material[] = [];
  const totalItems = 0;
  const inStock = 0;
  const lowStock = 0;
  const outOfStock = 0;
  const totalValue = 0;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <div className="flex items-center gap-2">
            <WorkViewSwitcher section="materials" />
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
                <span className="sm-hidden">Add</span>
              </Link>
            </Button>
          </div>
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
        <WorkDataView
          kanban={<MaterialsKanban materials={mockMaterials} />}
          section="materials"
          table={<MaterialsTable materials={mockMaterials} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
