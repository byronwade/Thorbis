"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/work/stat-card";

interface Service extends Record<string, unknown> {
  id: string;
  serviceCode: string;
  description: string;
  category: string;
  duration: string;
  cost: string;
  price: string;
  margin: string;
  status: string;
}

interface Material extends Record<string, unknown> {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  unit: string;
  cost: string;
  price: string;
  margin: string;
  status: string;
}

interface LaborRate extends Record<string, unknown> {
  id: string;
  rateCode: string;
  description: string;
  skillLevel: string;
  regularRate: string;
  overtimeRate: string;
  emergencyRate: string;
  status: string;
}

const mockServices: Service[] = [
  {
    id: "1",
    serviceCode: "SVC-001",
    description: "HVAC System Inspection",
    category: "HVAC",
    duration: "1.5 hrs",
    cost: "$75.00",
    price: "$125.00",
    margin: "40%",
    status: "active",
  },
  {
    id: "2",
    serviceCode: "SVC-002",
    description: "Drain Cleaning Service",
    category: "Plumbing",
    duration: "1 hr",
    cost: "$60.00",
    price: "$95.00",
    margin: "37%",
    status: "active",
  },
  {
    id: "3",
    serviceCode: "SVC-003",
    description: "Electrical Panel Upgrade",
    category: "Electrical",
    duration: "4 hrs",
    cost: "$400.00",
    price: "$750.00",
    margin: "47%",
    status: "active",
  },
  {
    id: "4",
    serviceCode: "SVC-004",
    description: "Water Heater Installation",
    category: "Plumbing",
    duration: "3 hrs",
    cost: "$450.00",
    price: "$850.00",
    margin: "47%",
    status: "active",
  },
];

const mockMaterials: Material[] = [
  {
    id: "1",
    itemCode: "MAT-001",
    description: "Copper Pipe 3/4\"",
    category: "Plumbing",
    unit: "per ft",
    cost: "$2.50",
    price: "$4.00",
    margin: "38%",
    status: "active",
  },
  {
    id: "2",
    itemCode: "MAT-002",
    description: "Circuit Breaker 20A",
    category: "Electrical",
    unit: "each",
    cost: "$12.50",
    price: "$22.50",
    margin: "44%",
    status: "active",
  },
  {
    id: "3",
    itemCode: "MAT-003",
    description: "HVAC Filter 20x25x1",
    category: "HVAC",
    unit: "each",
    cost: "$15.00",
    price: "$25.00",
    margin: "40%",
    status: "active",
  },
  {
    id: "4",
    itemCode: "MAT-004",
    description: "PVC Pipe 2\"",
    category: "Plumbing",
    unit: "per ft",
    cost: "$1.75",
    price: "$3.25",
    margin: "46%",
    status: "active",
  },
];

const mockLaborRates: LaborRate[] = [
  {
    id: "1",
    rateCode: "LAB-001",
    description: "Master Technician",
    skillLevel: "Master",
    regularRate: "$125/hr",
    overtimeRate: "$187.50/hr",
    emergencyRate: "$250/hr",
    status: "active",
  },
  {
    id: "2",
    rateCode: "LAB-002",
    description: "Journeyman Technician",
    skillLevel: "Journeyman",
    regularRate: "$95/hr",
    overtimeRate: "$142.50/hr",
    emergencyRate: "$190/hr",
    status: "active",
  },
  {
    id: "3",
    rateCode: "LAB-003",
    description: "Apprentice Technician",
    skillLevel: "Apprentice",
    regularRate: "$65/hr",
    overtimeRate: "$97.50/hr",
    emergencyRate: "$130/hr",
    status: "active",
  },
  {
    id: "4",
    rateCode: "LAB-004",
    description: "Helper/Assistant",
    skillLevel: "Entry",
    regularRate: "$45/hr",
    overtimeRate: "$67.50/hr",
    emergencyRate: "$90/hr",
    status: "active",
  },
];

export default function PriceBookPage() {
  usePageLayout({
    maxWidth: "7xl",
    paddingY: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const serviceColumns: DataTableColumn<Service>[] = [
    {
      key: "serviceCode",
      header: "Service Code",
      sortable: true,
      filterable: true,
      render: (service) => <span className="font-medium">{service.serviceCode}</span>,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      filterable: true,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      filterable: true,
    },
    {
      key: "duration",
      header: "Duration",
      sortable: true,
    },
    {
      key: "cost",
      header: "Cost",
      sortable: true,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (service) => <span className="font-medium">{service.price}</span>,
    },
    {
      key: "margin",
      header: "Margin",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: () => <Badge>Active</Badge>,
    },
  ];

  const materialColumns: DataTableColumn<Material>[] = [
    {
      key: "itemCode",
      header: "Item Code",
      sortable: true,
      filterable: true,
      render: (material) => <span className="font-medium">{material.itemCode}</span>,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      filterable: true,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      filterable: true,
    },
    {
      key: "unit",
      header: "Unit",
      sortable: true,
    },
    {
      key: "cost",
      header: "Cost",
      sortable: true,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (material) => <span className="font-medium">{material.price}</span>,
    },
    {
      key: "margin",
      header: "Margin",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: () => <Badge>Active</Badge>,
    },
  ];

  const laborColumns: DataTableColumn<LaborRate>[] = [
    {
      key: "rateCode",
      header: "Rate Code",
      sortable: true,
      filterable: true,
      render: (rate) => <span className="font-medium">{rate.rateCode}</span>,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      filterable: true,
    },
    {
      key: "skillLevel",
      header: "Skill Level",
      sortable: true,
      filterable: true,
    },
    {
      key: "regularRate",
      header: "Regular Rate",
      sortable: true,
      render: (rate) => <span className="font-medium">{rate.regularRate}</span>,
    },
    {
      key: "overtimeRate",
      header: "Overtime Rate",
      sortable: true,
    },
    {
      key: "emergencyRate",
      header: "Emergency Rate",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: () => <Badge>Active</Badge>,
    },
  ];

  return (
    <WorkPageLayout
      title="Price Book"
      description="Manage service pricing, materials costs, and labor rates"
      actionLabel="Add Item"
      actionHref="/dashboard/work/pricebook/new"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Items" value="347" subtext="Services & materials" />
        <StatCard label="Services" value="128" subtext="Service offerings" />
        <StatCard label="Materials" value="219" subtext="Parts & supplies" />
        <StatCard label="Avg. Markup" value="35%" subtext="Average margin" trend="up" />
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
              <DataTable
                data={mockServices}
                columns={serviceColumns}
                keyField="id"
                itemsPerPage={10}
                searchPlaceholder="Search services by code, description, category, or status..."
                emptyMessage="No services found."
              />
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
              <DataTable
                data={mockMaterials}
                columns={materialColumns}
                keyField="id"
                itemsPerPage={10}
                searchPlaceholder="Search materials by code, description, category, or status..."
                emptyMessage="No materials found."
              />
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
              <DataTable
                data={mockLaborRates}
                columns={laborColumns}
                keyField="id"
                itemsPerPage={10}
                searchPlaceholder="Search labor rates by code, description, or skill level..."
                emptyMessage="No labor rates found."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </WorkPageLayout>
  );
}
