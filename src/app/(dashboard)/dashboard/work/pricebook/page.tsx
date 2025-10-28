"use client";

/**
 * Work > Pricebook Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  ArrowLeft,
  BookOpen,
  Box,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/work/stat-card";
import { WorkPageLayout } from "@/components/work/work-page-layout";
type Service = {
  id: string;
  serviceCode: string;
  description: string;
  category: string;
  duration: string;
  cost: string;
  price: string;
  margin: string;
  status: string;
  icon?: string;
};

type Material = {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  unit: string;
  cost: string;
  price: string;
  margin: string;
  status: string;
};

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
  {
    id: "5",
    serviceCode: "SVC-005",
    description: "AC Unit Maintenance",
    category: "HVAC",
    duration: "2 hrs",
    cost: "$90.00",
    price: "$150.00",
    margin: "40%",
    status: "active",
  },
  {
    id: "6",
    serviceCode: "SVC-006",
    description: "Circuit Breaker Replacement",
    category: "Electrical",
    duration: "1 hr",
    cost: "$80.00",
    price: "$135.00",
    margin: "41%",
    status: "active",
  },
];

const mockMaterials: Material[] = [
  {
    id: "1",
    itemCode: "MAT-001",
    description: 'Copper Pipe 3/4"',
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
    description: 'PVC Pipe 2"',
    category: "Plumbing",
    unit: "per ft",
    cost: "$1.75",
    price: "$3.25",
    margin: "46%",
    status: "active",
  },
  {
    id: "5",
    itemCode: "MAT-005",
    description: "Wire 12/2 Romex",
    category: "Electrical",
    unit: "per ft",
    cost: "$0.85",
    price: "$1.50",
    margin: "43%",
    status: "active",
  },
  {
    id: "6",
    itemCode: "MAT-006",
    description: "Refrigerant R-410A",
    category: "HVAC",
    unit: "lb",
    cost: "$45.00",
    price: "$75.00",
    margin: "40%",
    status: "active",
  },
];

// Category icons mapping
const categoryIcons: Record<string, typeof Wrench> = {
  HVAC: Wrench,
  Plumbing: Package,
  Electrical: TrendingUp,
};

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  const IconComponent = categoryIcons[service.category] || Wrench;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <Badge className="text-xs" variant="secondary">
            {service.category}
          </Badge>
        </div>
        <CardTitle className="text-lg">{service.description}</CardTitle>
        <CardDescription className="font-mono text-xs">
          {service.serviceCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <span>{service.duration}</span>
        </div>

        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cost</span>
            <span className="font-medium">{service.cost}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Price</span>
            <span className="font-semibold text-lg text-primary">
              {service.price}
            </span>
          </div>
          <div className="flex items-center justify-between border-border/50 border-t pt-2 text-sm">
            <span className="text-muted-foreground">Margin</span>
            <span className="font-medium text-green-600 dark:text-green-500">
              {service.margin}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Material Card Component
function MaterialCard({ material }: { material: Material }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <Badge className="text-xs" variant="secondary">
            {material.category}
          </Badge>
        </div>
        <CardTitle className="text-lg">{material.description}</CardTitle>
        <CardDescription className="font-mono text-xs">
          {material.itemCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Package className="h-4 w-4" />
          <span>Unit: {material.unit}</span>
        </div>

        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cost</span>
            <span className="font-medium">{material.cost}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Price</span>
            <span className="font-semibold text-lg text-primary">
              {material.price}
            </span>
          </div>
          <div className="flex items-center justify-between border-border/50 border-t pt-2 text-sm">
            <span className="text-muted-foreground">Margin</span>
            <span className="font-medium text-green-600 dark:text-green-500">
              {material.margin}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceBookPageContent() {  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam === "materials" || tabParam === "services") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Filter functions
  const filteredServices = mockServices.filter(
    (service) =>
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = mockMaterials.filter(
    (material) =>
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by category
  const servicesByCategory = filteredServices.reduce<Record<string, Service[]>>(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    },
    {}
  );

  const materialsByCategory = filteredMaterials.reduce<
    Record<string, Material[]>
  >((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {});

  return (
    <WorkPageLayout
      actionHref="/dashboard/work/pricebook/new"
      actionLabel="Add Item"
      description="Manage service pricing and materials costs"
      title="Price Book"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Total Items"
          subtext="Services & materials"
          value="347"
        />
        <StatCard label="Services" subtext="Service offerings" value="128" />
        <StatCard label="Materials" subtext="Parts & supplies" value="219" />
        <StatCard
          label="Avg. Markup"
          subtext="Average margin"
          trend="up"
          value="35%"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, description, or category..."
            type="search"
            value={searchQuery}
          />
          <DollarSign className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {activeTab === "services" ? (
        <div className="space-y-6">
          {Object.keys(servicesByCategory).length === 0 ? (
            <Card>
              <CardContent className="flex h-32 items-center justify-center">
                <p className="text-muted-foreground">
                  No services found matching your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(servicesByCategory).map(([category, services]) => (
              <div className="space-y-3" key={category}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Badge variant="outline">{services.length}</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(materialsByCategory).length === 0 ? (
            <Card>
              <CardContent className="flex h-32 items-center justify-center">
                <p className="text-muted-foreground">
                  No materials found matching your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(materialsByCategory).map(([category, materials]) => (
              <div className="space-y-3" key={category}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Badge variant="outline">{materials.length}</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {materials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </WorkPageLayout>
  );
}

export default function PriceBookPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PriceBookPageContent />
    </Suspense>
  );
}
