"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Wrench, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EquipmentPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <WorkPageLayout
      title="Equipment & Tools"
      description="Track company equipment, tools, and vehicles"
      actionLabel="Add Equipment"
      actionHref="/dashboard/work/equipment/new"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Equipment</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">87</div>
            <p className="text-muted-foreground text-xs">Company assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Available</CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">72</div>
            <p className="text-muted-foreground text-xs">Ready for use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">In Maintenance</CardTitle>
            <Wrench className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">8</div>
            <p className="text-muted-foreground text-xs">Under service</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Needs Attention</CardTitle>
            <AlertCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">7</div>
            <p className="text-muted-foreground text-xs">Requires service</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment & Tools</CardTitle>
          <CardDescription>Company equipment, tools, and vehicles inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">EQP-001</TableCell>
                <TableCell>2023 Ford F-150 (Truck #1)</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell>Jan 5, 2025</TableCell>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>
                  <Badge>Available</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">EQP-002</TableCell>
                <TableCell>Pipe Threading Machine</TableCell>
                <TableCell>Tool</TableCell>
                <TableCell>Workshop</TableCell>
                <TableCell>Dec 15, 2024</TableCell>
                <TableCell>Mar 15, 2025</TableCell>
                <TableCell>
                  <Badge>Available</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">EQP-003</TableCell>
                <TableCell>Ladder 32ft Extension</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Mike Johnson</TableCell>
                <TableCell>Jan 10, 2025</TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <Badge variant="secondary">In Use</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">EQP-004</TableCell>
                <TableCell>Power Drill Set</TableCell>
                <TableCell>Tool</TableCell>
                <TableCell>Sarah Williams</TableCell>
                <TableCell>Jan 1, 2025</TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <Badge variant="destructive">Maintenance</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkPageLayout>
  );
}
