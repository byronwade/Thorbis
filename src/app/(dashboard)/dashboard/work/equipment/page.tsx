/**
 * Equipment Page - Seamless Datatable Layout
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 *
 * Note: Equipment table exists but is for customer property equipment.
 * This page is for company equipment/tools which doesn't have a table yet.
 */

import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type Equipment,
  EquipmentTable,
} from "@/components/work/equipment-table";
import { EquipmentKanban } from "@/components/work/equipment-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";

export default function EquipmentPage() {
  // Equipment table exists but is for customer property equipment, not company equipment/tools
  // This page is for company equipment/tools which doesn't have a table yet
  const mockEquipment: Equipment[] = [];
  const totalEquipment = 0;
  const available = 0;
  const inUse = 0;
  const maintenance = 0;
  const needsAttention = 0;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <div className="flex items-center gap-2">
            <WorkViewSwitcher section="equipment" />
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
              <Link href="/dashboard/work/equipment/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">Add Equipment</span>
                <span className="sm-hidden">Add</span>
              </Link>
            </Button>
          </div>
        }
        description="Track company equipment, tools, and vehicles"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalEquipment}</div>
                <p className="text-muted-foreground text-xs">Company assets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{available}</div>
                <p className="text-muted-foreground text-xs">
                  {Math.round((available / totalEquipment) * 100)}% ready for
                  use
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  In Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{maintenance}</div>
                <p className="text-muted-foreground text-xs">
                  {inUse} currently in use
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{needsAttention}</div>
                <p className="text-muted-foreground text-xs">
                  Requires service
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Equipment & Tools"
      />

      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<EquipmentKanban equipment={mockEquipment} />}
          section="equipment"
          table={<EquipmentTable equipment={mockEquipment} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
