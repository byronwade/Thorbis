"use client";

import { useState } from "react";
import { User, Activity, CreditCard, Shield, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@stratos/ui";
import { UserOverviewTab } from "./user-overview-tab";
import { UserActivityTab } from "./user-activity-tab";
import { UserBillingTab } from "./user-billing-tab";
import { UserSecurityTab } from "./user-security-tab";
import { UserSettingsTab } from "./user-settings-tab";

type UserDetailTabsProps = {
	user: any; // TODO: Type properly
};

/**
 * User Detail Tabs Component
 * 
 * Main container for user detail page with tabbed interface.
 */
export function UserDetailTabs({ user }: UserDetailTabsProps) {
	const [activeTab, setActiveTab] = useState("overview");

	const displayName = user.full_name || user.email.split("@")[0];
	const initials = user.full_name
		? user.full_name
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user.email[0].toUpperCase();

	return (
		<div className="flex flex-col space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
						<span className="text-muted-foreground text-lg font-medium">{initials}</span>
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
						<p className="text-muted-foreground text-sm">{user.email}</p>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="overview">
						<User className="mr-2 h-4 w-4" />
						Overview
					</TabsTrigger>
					<TabsTrigger value="activity">
						<Activity className="mr-2 h-4 w-4" />
						Activity
					</TabsTrigger>
					<TabsTrigger value="billing">
						<CreditCard className="mr-2 h-4 w-4" />
						Billing
					</TabsTrigger>
					<TabsTrigger value="security">
						<Shield className="mr-2 h-4 w-4" />
						Security
					</TabsTrigger>
					<TabsTrigger value="settings">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<UserOverviewTab user={user} />
				</TabsContent>

				<TabsContent value="activity" className="mt-6">
					<UserActivityTab userId={user.id} />
				</TabsContent>

				<TabsContent value="billing" className="mt-6">
					<UserBillingTab user={user} />
				</TabsContent>

				<TabsContent value="security" className="mt-6">
					<UserSecurityTab userId={user.id} />
				</TabsContent>

				<TabsContent value="settings" className="mt-6">
					<UserSettingsTab user={user} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

