/**
 * Call Routing Settings Page
 *
 * Configure how incoming calls are routed:
 * - Business hours calendar
 * - After-hours routing
 * - Round-robin distribution
 * - Priority routing rules
 */

import { Plus } from "lucide-react";
import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { BusinessHoursEditor } from "@/components/telnyx/business-hours-editor";
import { CallRoutingRulesList } from "@/components/telnyx/call-routing-rules-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
					subtitle: "Configure how incoming calls are routed to your team",
				}}
			/>

			{/* Content */}
			<div className="flex-1 overflow-auto">
				<Tabs className="flex h-full flex-col" defaultValue="routing-rules">
					<div className="border-b px-6 pt-4">
						<TabsList>
							<TabsTrigger value="routing-rules">Routing Rules</TabsTrigger>
							<TabsTrigger value="business-hours">Business Hours</TabsTrigger>
							<TabsTrigger value="after-hours">After Hours</TabsTrigger>
							<TabsTrigger value="holidays">Holidays</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent
						className="mt-0 flex-1 data-[state=active]:flex data-[state=active]:flex-col"
						value="routing-rules"
					>
						<div className="bg-muted/30 flex items-center justify-between border-b px-6 py-4">
							<div>
								<h3 className="text-sm font-medium">Routing Rules</h3>
								<p className="text-muted-foreground text-sm">
									Define how incoming calls are distributed to your team
								</p>
							</div>
							<Button size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Create Rule
							</Button>
						</div>
						<div className="flex-1 overflow-auto">
							<Suspense fallback={<RoutingRulesListSkeleton />}>
								<CallRoutingRulesList />
							</Suspense>
						</div>
					</TabsContent>

					<TabsContent className="mt-0 flex-1 p-6" value="business-hours">
						<Suspense fallback={<Skeleton className="h-96 w-full" />}>
							<BusinessHoursEditor />
						</Suspense>
					</TabsContent>

					<TabsContent className="mt-0 flex-1 p-6" value="after-hours">
						{/* After-hours routing will be added here */}
						<div className="rounded-lg border border-dashed p-12 text-center">
							<h3 className="mb-2 text-lg font-semibold">
								After Hours Routing
							</h3>
							<p className="text-muted-foreground mb-4">
								Configure what happens when calls come in outside business hours
							</p>
							<Button variant="outline">Configure After Hours</Button>
						</div>
					</TabsContent>

					<TabsContent className="mt-0 flex-1 p-6" value="holidays">
						{/* Holiday exceptions will be added here */}
						<div className="rounded-lg border border-dashed p-12 text-center">
							<h3 className="mb-2 text-lg font-semibold">Holiday Exceptions</h3>
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
			{[...new Array(3)].map((_, i) => (
				<Skeleton className="h-32 w-full" key={i} />
			))}
		</div>
	);
}
