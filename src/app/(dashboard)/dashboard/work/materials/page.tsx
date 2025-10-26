"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Box, Package, AlertTriangle, TrendingUp } from "lucide-react";

export default function MaterialsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <WorkPageLayout
      title="Materials Inventory"
      description="Track and manage company materials, parts, and supplies"
      actionLabel="Add Material"
      actionHref="/dashboard/work/materials/new"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Items</CardTitle>
            <Box className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">1,284</div>
            <p className="text-muted-foreground text-xs">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">In Stock</CardTitle>
            <Package className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">1,156</div>
            <p className="text-muted-foreground text-xs">90% availability</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Low Stock</CardTitle>
            <AlertTriangle className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">45</div>
            <p className="text-muted-foreground text-xs">Needs reorder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Inventory Value</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$145,890</div>
            <p className="text-muted-foreground text-xs">Current stock value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials Inventory</CardTitle>
          <CardDescription>All company materials, parts, and supplies</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">MAT-001</TableCell>
                <TableCell>Copper Pipe 3/4"</TableCell>
                <TableCell>Plumbing</TableCell>
                <TableCell>250 ft</TableCell>
                <TableCell>$2.50/ft</TableCell>
                <TableCell>$625.00</TableCell>
                <TableCell>
                  <Badge>In Stock</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">MAT-002</TableCell>
                <TableCell>Circuit Breaker 20A</TableCell>
                <TableCell>Electrical</TableCell>
                <TableCell>45 units</TableCell>
                <TableCell>$12.50</TableCell>
                <TableCell>$562.50</TableCell>
                <TableCell>
                  <Badge>In Stock</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">MAT-003</TableCell>
                <TableCell>HVAC Filter 20x25x1</TableCell>
                <TableCell>HVAC</TableCell>
                <TableCell>8 units</TableCell>
                <TableCell>$15.00</TableCell>
                <TableCell>$120.00</TableCell>
                <TableCell>
                  <Badge variant="destructive">Low Stock</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">MAT-004</TableCell>
                <TableCell>PVC Pipe 2"</TableCell>
                <TableCell>Plumbing</TableCell>
                <TableCell>0 ft</TableCell>
                <TableCell>$1.75/ft</TableCell>
                <TableCell>$0.00</TableCell>
                <TableCell>
                  <Badge variant="outline">Out of Stock</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkPageLayout>
  );
}
