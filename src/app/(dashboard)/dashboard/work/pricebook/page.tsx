"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Package, Wrench, DollarSign, TrendingUp } from "lucide-react";

export default function PriceBookPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <WorkPageLayout
      title="Price Book"
      description="Manage service pricing, materials costs, and labor rates"
      actionLabel="Add Item"
      actionHref="/dashboard/work/pricebook/new"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Items</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">347</div>
            <p className="text-muted-foreground text-xs">Services & materials</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Services</CardTitle>
            <Wrench className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">128</div>
            <p className="text-muted-foreground text-xs">Service offerings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Materials</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">219</div>
            <p className="text-muted-foreground text-xs">Parts & supplies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Avg. Markup</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">35%</div>
            <p className="text-muted-foreground text-xs">Average margin</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="labor">Labor Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Pricing</CardTitle>
              <CardDescription>Standard service offerings and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">SVC-001</TableCell>
                    <TableCell>HVAC System Inspection</TableCell>
                    <TableCell>HVAC</TableCell>
                    <TableCell>1.5 hrs</TableCell>
                    <TableCell>$75.00</TableCell>
                    <TableCell className="font-medium">$125.00</TableCell>
                    <TableCell>40%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SVC-002</TableCell>
                    <TableCell>Drain Cleaning Service</TableCell>
                    <TableCell>Plumbing</TableCell>
                    <TableCell>1 hr</TableCell>
                    <TableCell>$60.00</TableCell>
                    <TableCell className="font-medium">$95.00</TableCell>
                    <TableCell>37%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SVC-003</TableCell>
                    <TableCell>Electrical Panel Upgrade</TableCell>
                    <TableCell>Electrical</TableCell>
                    <TableCell>4 hrs</TableCell>
                    <TableCell>$400.00</TableCell>
                    <TableCell className="font-medium">$750.00</TableCell>
                    <TableCell>47%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SVC-004</TableCell>
                    <TableCell>Water Heater Installation</TableCell>
                    <TableCell>Plumbing</TableCell>
                    <TableCell>3 hrs</TableCell>
                    <TableCell>$450.00</TableCell>
                    <TableCell className="font-medium">$850.00</TableCell>
                    <TableCell>47%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Materials Pricing</CardTitle>
              <CardDescription>Parts, supplies, and material costs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">MAT-001</TableCell>
                    <TableCell>Copper Pipe 3/4"</TableCell>
                    <TableCell>Plumbing</TableCell>
                    <TableCell>per ft</TableCell>
                    <TableCell>$2.50</TableCell>
                    <TableCell className="font-medium">$4.00</TableCell>
                    <TableCell>38%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MAT-002</TableCell>
                    <TableCell>Circuit Breaker 20A</TableCell>
                    <TableCell>Electrical</TableCell>
                    <TableCell>each</TableCell>
                    <TableCell>$12.50</TableCell>
                    <TableCell className="font-medium">$22.50</TableCell>
                    <TableCell>44%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MAT-003</TableCell>
                    <TableCell>HVAC Filter 20x25x1</TableCell>
                    <TableCell>HVAC</TableCell>
                    <TableCell>each</TableCell>
                    <TableCell>$15.00</TableCell>
                    <TableCell className="font-medium">$25.00</TableCell>
                    <TableCell>40%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MAT-004</TableCell>
                    <TableCell>PVC Pipe 2"</TableCell>
                    <TableCell>Plumbing</TableCell>
                    <TableCell>per ft</TableCell>
                    <TableCell>$1.75</TableCell>
                    <TableCell className="font-medium">$3.25</TableCell>
                    <TableCell>46%</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Labor Rates</CardTitle>
              <CardDescription>Hourly rates by skill level and service type</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rate Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Skill Level</TableHead>
                    <TableHead>Regular Rate</TableHead>
                    <TableHead>Overtime Rate</TableHead>
                    <TableHead>Emergency Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">LAB-001</TableCell>
                    <TableCell>Master Technician</TableCell>
                    <TableCell>Master</TableCell>
                    <TableCell className="font-medium">$125/hr</TableCell>
                    <TableCell>$187.50/hr</TableCell>
                    <TableCell>$250/hr</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">LAB-002</TableCell>
                    <TableCell>Journeyman Technician</TableCell>
                    <TableCell>Journeyman</TableCell>
                    <TableCell className="font-medium">$95/hr</TableCell>
                    <TableCell>$142.50/hr</TableCell>
                    <TableCell>$190/hr</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">LAB-003</TableCell>
                    <TableCell>Apprentice Technician</TableCell>
                    <TableCell>Apprentice</TableCell>
                    <TableCell className="font-medium">$65/hr</TableCell>
                    <TableCell>$97.50/hr</TableCell>
                    <TableCell>$130/hr</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">LAB-004</TableCell>
                    <TableCell>Helper/Assistant</TableCell>
                    <TableCell>Entry</TableCell>
                    <TableCell className="font-medium">$45/hr</TableCell>
                    <TableCell>$67.50/hr</TableCell>
                    <TableCell>$90/hr</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </WorkPageLayout>
  );
}
