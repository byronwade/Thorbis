"use client";

/**
 * Marketing Dashboard - Client Component (Development Only)
 *
 * Full-featured marketing dashboard with:
 * - Lead Management (scoring, qualification, nurturing)
 * - Review Management (multi-platform monitoring)
 * - Campaign Management (email, SMS, automation)
 * - Analytics & ROI tracking
 */

import { BarChart3, Megaphone, Star, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { CampaignsManager } from "@/components/marketing/campaigns-manager";
import { LeadsTable } from "@/components/marketing/leads-table";
import { MarketingAnalytics } from "@/components/marketing/marketing-analytics";
import { ReviewsManagement } from "@/components/marketing/reviews-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MarketingTab = "leads" | "reviews" | "campaigns" | "analytics";

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState<MarketingTab>("leads");

  return (
    <div className="flex h-full flex-col">
      {/* Header Stats */}
      <div className="border-b bg-background p-6">
        <div className="mb-6">
          <h1 className="font-semibold text-3xl tracking-tight">
            Marketing Center
          </h1>
          <p className="text-muted-foreground">
            Manage leads, reviews, campaigns, and track marketing ROI
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">248</div>
              <p className="text-muted-foreground text-xs">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Avg. Review Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">4.8</div>
              <p className="text-muted-foreground text-xs">
                Based on 156 reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Active Campaigns
              </CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">12</div>
              <p className="text-muted-foreground text-xs">
                3 scheduled for next week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Marketing ROI
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">327%</div>
              <p className="text-muted-foreground text-xs">
                $12.5k revenue per $1k spent
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          className="flex h-full flex-col"
          onValueChange={(value) => setActiveTab(value as MarketingTab)}
          value={activeTab}
        >
          <div className="border-b bg-background px-6">
            <TabsList className="h-12 w-full justify-start rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                className="relative h-12 rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                value="leads"
              >
                <Users className="mr-2 h-4 w-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger
                className="relative h-12 rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                value="reviews"
              >
                <Star className="mr-2 h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger
                className="relative h-12 rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                value="campaigns"
              >
                <Megaphone className="mr-2 h-4 w-4" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                className="relative h-12 rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                value="analytics"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent className="m-0 h-full" value="leads">
              <LeadsTable />
            </TabsContent>

            <TabsContent className="m-0 h-full" value="reviews">
              <ReviewsManagement />
            </TabsContent>

            <TabsContent className="m-0 h-full" value="campaigns">
              <CampaignsManager />
            </TabsContent>

            <TabsContent className="m-0 h-full" value="analytics">
              <MarketingAnalytics />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
