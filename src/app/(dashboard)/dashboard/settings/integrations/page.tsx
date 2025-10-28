"use client";

/**
 * Settings > Integrations Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Building2,
  CheckCircle2,
  CreditCard,
  Mail,
  MessageSquare,
  Phone,
  Plug,
  Search,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type IntegrationCategory,
  integrations,
} from "@/lib/data/integrations";
import { cn } from "@/lib/utils";

// Constants
const MAX_DISPLAYED_FEATURES = 3;

const categories: {
  value: IntegrationCategory;
  label: string;
  icon: typeof Building2;
}[] = [
  { value: "all", label: "All Integrations", icon: Zap },
  { value: "accounting", label: "Accounting", icon: Building2 },
  { value: "payment", label: "Payments", icon: CreditCard },
  { value: "communication", label: "Communication", icon: MessageSquare },
  { value: "marketing", label: "Marketing", icon: Mail },
  { value: "crm", label: "CRM & Leads", icon: TrendingUp },
  { value: "scheduling", label: "Scheduling", icon: Phone },
  { value: "analytics", label: "Analytics", icon: TrendingUp },
];

export default function IntegrationsPage() {  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<IntegrationCategory>("all");
  const [viewMode, setViewMode] = useState<"connected" | "available" | "all">(
    "all"
  );

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || integration.category === selectedCategory;

    const matchesView =
      viewMode === "all" ||
      (viewMode === "connected" && integration.isConnected) ||
      (viewMode === "available" && !integration.isConnected);

    return matchesSearch && matchesCategory && matchesView;
  });

  const connectedCount = integrations.filter((i) => i.isConnected).length;
  const availableCount = integrations.filter((i) => !i.isConnected).length;

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Stratos with your favorite tools and services
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Connected</CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{connectedCount}</div>
            <p className="text-muted-foreground text-xs">Active integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Available</CardTitle>
            <Plug className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{availableCount}</div>
            <p className="text-muted-foreground text-xs">Ready to connect</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total</CardTitle>
            <Zap className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{integrations.length}</div>
            <p className="text-muted-foreground text-xs">
              Integrations catalog
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              value={searchQuery}
            />
          </div>

          <Select
            onValueChange={(value) =>
              setSelectedCategory(value as IntegrationCategory)
            }
            value={selectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Tabs
          className="w-full lg:w-auto"
          onValueChange={(value) =>
            setViewMode(value as "connected" | "available" | "all")
          }
          value={viewMode}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Integrations Grid */}
      {filteredIntegrations.length === 0 ? (
        <Card className="p-12 text-center">
          <Zap className="mx-auto mb-4 size-12 text-muted-foreground/50" />
          <h3 className="mb-2 font-semibold text-lg">No integrations found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <Card
              className={cn(
                "overflow-hidden transition-all hover:shadow-md",
                integration.isConnected &&
                  "border-green-200 dark:border-green-900"
              )}
              key={integration.id}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Avatar className="size-12 rounded-lg">
                    <AvatarImage src={integration.icon} />
                    <AvatarFallback
                      className={cn("rounded-lg text-white", integration.color)}
                    >
                      {integration.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    {integration.isConnected && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle2 className="mr-1 size-3" />
                        Connected
                      </Badge>
                    )}
                    {integration.isPremium && (
                      <Badge variant="secondary">Premium</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {integration.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {integration.features && integration.features.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Features
                    </p>
                    <ul className="space-y-1">
                      {integration.features
                        .slice(0, MAX_DISPLAYED_FEATURES)
                        .map((feature) => (
                          <li
                            className="flex items-center gap-2 text-sm"
                            key={feature}
                          >
                            <CheckCircle2 className="size-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  {integration.isConnected ? (
                    <>
                      <Button
                        asChild
                        className="flex-1"
                        size="sm"
                        variant="outline"
                      >
                        <Link
                          href={`/dashboard/settings/integrations/${integration.id}`}
                        >
                          <Settings className="mr-2 size-4" />
                          Configure
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" size="sm">
                      <Plug className="mr-2 size-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Need a custom integration?
          </CardTitle>
          <CardDescription>
            Our team can help you connect with custom tools or build specialized
            integrations for your business needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  );
}
