/**
 * Equipment Page - Seamless Datatable Layout
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
  type Equipment,
  EquipmentTable,
} from "@/components/work/equipment-table";

// Mock data - replace with real data from database
const mockEquipment: Equipment[] = [
  {
    id: "1",
    assetId: "EQP-001",
    name: "2023 Ford F-150 (Truck #1)",
    type: "Vehicle",
    assignedTo: "John Smith",
    lastService: "Jan 5, 2025",
    nextService: "Apr 5, 2025",
    status: "available",
  },
  {
    id: "2",
    assetId: "EQP-002",
    name: "Pipe Threading Machine",
    type: "Tool",
    assignedTo: "Workshop",
    lastService: "Dec 15, 2024",
    nextService: "Mar 15, 2025",
    status: "available",
  },
  {
    id: "3",
    assetId: "EQP-003",
    name: "Ladder 32ft Extension",
    type: "Equipment",
    assignedTo: "Mike Johnson",
    lastService: "Jan 10, 2025",
    nextService: "—",
    status: "in-use",
  },
  {
    id: "4",
    assetId: "EQP-004",
    name: "Power Drill Set",
    type: "Tool",
    assignedTo: "Sarah Williams",
    lastService: "Jan 1, 2025",
    nextService: "—",
    status: "maintenance",
  },
  {
    id: "5",
    assetId: "EQP-005",
    name: "2022 Chevy Silverado (Truck #2)",
    type: "Vehicle",
    assignedTo: "Tom Brown",
    lastService: "Jan 8, 2025",
    nextService: "Apr 8, 2025",
    status: "in-use",
  },
  {
    id: "6",
    assetId: "EQP-006",
    name: "Hydraulic Pipe Bender",
    type: "Tool",
    assignedTo: "Workshop",
    lastService: "Dec 20, 2024",
    nextService: "Mar 20, 2025",
    status: "available",
  },
  {
    id: "7",
    assetId: "EQP-007",
    name: "Portable Generator 5000W",
    type: "Equipment",
    assignedTo: "Mobile Storage",
    lastService: "Jan 3, 2025",
    nextService: "Apr 3, 2025",
    status: "available",
  },
];

export default function EquipmentPage() {
  // Calculate stats from data
  const totalEquipment = mockEquipment.length;
  const available = mockEquipment.filter(
    (e) => e.status === "available"
  ).length;
  const inUse = mockEquipment.filter((e) => e.status === "in-use").length;
  const maintenance = mockEquipment.filter(
    (e) => e.status === "maintenance"
  ).length;

  // Calculate equipment needing service (next service in the next 30 days)
  const needsAttention = 7; // Mock value

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
              <Link href="/dashboard/work/equipment/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">Add Equipment</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </>
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
        <EquipmentTable equipment={mockEquipment} itemsPerPage={50} />
      </div>
    </div>
  );
}
