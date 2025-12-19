"use client";

import { useState } from "react";
import { Building2, Users, CreditCard, Activity, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@stratos/ui";
import { CompanyOverviewTab } from "./company-overview-tab";
import { CompanyUsersTab } from "./company-users-tab";
import { CompanyBillingTab } from "./company-billing-tab";
import { CompanyActivityTab } from "./company-activity-tab";
import { CompanySettingsTab } from "./company-settings-tab";
import type { CompanyWithDetails } from "@/types/entities";

type CompanyDetailTabsProps = {
	company: CompanyWithDetails;
};

/**
 * Company Detail Tabs Component
 * 
 * Main container for company detail page with tabbed interface.
 */
export function CompanyDetailTabs({ company }: CompanyDetailTabsProps) {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="flex flex-col space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
						<Building2 className="text-muted-foreground h-6 w-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
						<p className="text-muted-foreground text-sm">
							{company.owner_email || "No email"}
						</p>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="overview">
						<Building2 className="mr-2 h-4 w-4" />
						Overview
					</TabsTrigger>
					<TabsTrigger value="users">
						<Users className="mr-2 h-4 w-4" />
						Users
					</TabsTrigger>
					<TabsTrigger value="billing">
						<CreditCard className="mr-2 h-4 w-4" />
						Billing
					</TabsTrigger>
					<TabsTrigger value="activity">
						<Activity className="mr-2 h-4 w-4" />
						Activity
					</TabsTrigger>
					<TabsTrigger value="settings">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<CompanyOverviewTab company={company} />
				</TabsContent>

				<TabsContent value="users" className="mt-6">
					<CompanyUsersTab companyId={company.id} memberships={company.memberships} />
				</TabsContent>

				<TabsContent value="billing" className="mt-6">
					<CompanyBillingTab company={company} />
				</TabsContent>

				<TabsContent value="activity" className="mt-6">
					<CompanyActivityTab companyId={company.id} />
				</TabsContent>

				<TabsContent value="settings" className="mt-6">
					<CompanySettingsTab company={company} />
				</TabsContent>
			</Tabs>
		</div>
	);
}



