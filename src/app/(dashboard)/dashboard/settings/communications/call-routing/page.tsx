/**
 * Call Routing Settings Page
 *
 * Configure how incoming calls are routed:
 * - Business hours calendar
 * - After-hours routing
 * - Round-robin distribution
 * - Priority routing rules
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { BusinessHoursEditor } from "@/components/telnyx/business-hours-editor";
import { CallRoutingRulesList } from "@/components/telnyx/call-routing-rules-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const metadata = {
  title: "Call Routing | Communications Settings",
  description: "Configure call routing rules and business hours",
};

export default function CallRoutingPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <AppToolbar
        config={{
          show: true,
          title: "Call Routing",
          subtitle: "Configure how incoming calls are routed to your team"
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="routing-rules" className="h-full flex flex-col">
          <div className="border-b px-6 pt-4">
            <TabsList>
              <TabsTrigger value="routing-rules">Routing Rules</TabsTrigger>
              <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
              <TabsTrigger value="after-hours">After Hours</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="routing-rules" className="flex-1 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="text-sm font-medium">Routing Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Define how incoming calls are distributed to your team
                </p>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <Suspense fallback={<RoutingRulesListSkeleton />}>
                <CallRoutingRulesList />
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="business-hours" className="flex-1 mt-0 p-6">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <BusinessHoursEditor />
            </Suspense>
          </TabsContent>

          <TabsContent value="after-hours" className="flex-1 mt-0 p-6">
            {/* After-hours routing will be added here */}
            <div className="rounded-lg border border-dashed p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">After Hours Routing</h3>
              <p className="text-muted-foreground mb-4">
                Configure what happens when calls come in outside business hours
              </p>
              <Button variant="outline">Configure After Hours</Button>
            </div>
          </TabsContent>

          <TabsContent value="holidays" className="flex-1 mt-0 p-6">
            {/* Holiday exceptions will be added here */}
            <div className="rounded-lg border border-dashed p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Holiday Exceptions</h3>
              <p className="text-muted-foreground mb-4">
                Set special routing for holidays and company closures
              </p>
              <Button variant="outline">Add Holiday</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RoutingRulesListSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
