"use client";

import { useState } from "react";
import { CreditCard, TrendingUp, FileText, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@stratos/ui";
import { SubscriptionOverviewTab } from "./subscription-overview-tab";
import { SubscriptionUsageTab } from "./subscription-usage-tab";
import { SubscriptionBillingTab } from "./subscription-billing-tab";
import { SubscriptionActionsTab } from "./subscription-actions-tab";

type SubscriptionDetailTabsProps = {
	subscription: any; // TODO: Type properly
};

/**
 * Subscription Detail Tabs Component
 * 
 * Main container for subscription detail page with tabbed interface.
 */
export function SubscriptionDetailTabs({ subscription }: SubscriptionDetailTabsProps) {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="flex flex-col space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
						<CreditCard className="text-muted-foreground h-6 w-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							{subscription.company_name}
						</h1>
						<p className="text-muted-foreground text-sm">
							Subscription: {subscription.stripe_subscription_id || subscription.id}
						</p>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">
						<CreditCard className="mr-2 h-4 w-4" />
						Overview
					</TabsTrigger>
					<TabsTrigger value="usage">
						<TrendingUp className="mr-2 h-4 w-4" />
						Usage
					</TabsTrigger>
					<TabsTrigger value="billing">
						<FileText className="mr-2 h-4 w-4" />
						Billing History
					</TabsTrigger>
					<TabsTrigger value="actions">
						<Settings className="mr-2 h-4 w-4" />
						Actions
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<SubscriptionOverviewTab subscription={subscription} />
				</TabsContent>

				<TabsContent value="usage" className="mt-6">
					<SubscriptionUsageTab subscriptionId={subscription.stripe_subscription_id || subscription.id} />
				</TabsContent>

				<TabsContent value="billing" className="mt-6">
					<SubscriptionBillingTab subscriptionId={subscription.stripe_subscription_id || subscription.id} />
				</TabsContent>

				<TabsContent value="actions" className="mt-6">
					<SubscriptionActionsTab subscription={subscription} />
				</TabsContent>
			</Tabs>
		</div>
	);
}



