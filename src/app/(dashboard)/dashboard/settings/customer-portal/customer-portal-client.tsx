"use client";

import { Bell, Eye, Globe, Handshake, Palette } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getPortalSettings, updatePortalSettings } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
	type CustomerPortalSettingsState,
	DEFAULT_CUSTOMER_PORTAL_SETTINGS,
	mapCustomerPortalSettings,
} from "./customer-portal-config";

type CustomerPortalClientProps = {
	initialSettings: Partial<CustomerPortalSettingsState> | null;
};

const visibilityToggles: Array<{
	key: keyof CustomerPortalSettingsState;
	label: string;
	description: string;
}> = [
	{
		key: "showServiceHistory",
		label: "Service history",
		description: "Completed jobs, notes, and technician details.",
	},
	{
		key: "showInvoices",
		label: "Invoices & payments",
		description: "Customers can download and pay outstanding invoices.",
	},
	{
		key: "showEstimates",
		label: "Estimates & quotes",
		description: "Allow viewing and approvals directly in the portal.",
	},
];

const actionToggles: Array<{
	key: keyof CustomerPortalSettingsState;
	label: string;
	description: string;
}> = [
	{
		key: "allowBooking",
		label: "Book appointments",
		description: "Enable self-serve booking from the portal.",
	},
	{
		key: "allowInvoicePayment",
		label: "Pay invoices online",
		description: "Accept card or ACH payments inside the portal.",
	},
	{
		key: "allowEstimateApproval",
		label: "Approve estimates",
		description: "Convert quotes to jobs without emailing back and forth.",
	},
	{
		key: "allowMessaging",
		label: "Message the team",
		description: "Customers can send portal messages to your staff.",
	},
];

const notificationToggles: Array<{
	key: keyof CustomerPortalSettingsState;
	label: string;
	description: string;
}> = [
	{
		key: "notifyOnNewInvoice",
		label: "New invoice",
		description: "Email customers when a fresh invoice posts to their portal.",
	},
	{
		key: "notifyOnNewEstimate",
		label: "New estimate",
		description: "Let customers know when a quote is ready for review.",
	},
	{
		key: "notifyOnAppointment",
		label: "Appointment changes",
		description: "Send notices for newly scheduled or updated visits.",
	},
];

export function CustomerPortalClient({
	initialSettings,
}: CustomerPortalClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<CustomerPortalSettingsState>({
		getter: getPortalSettings,
		setter: updatePortalSettings,
		initialState: DEFAULT_CUSTOMER_PORTAL_SETTINGS,
		settingsName: "customer portal",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapCustomerPortalSettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("portalEnabled", state.portalEnabled.toString());
			formData.append(
				"requireAccountApproval",
				state.requireAccountApproval.toString(),
			);
			formData.append("allowBooking", state.allowBooking.toString());
			formData.append(
				"allowInvoicePayment",
				state.allowInvoicePayment.toString(),
			);
			formData.append(
				"allowEstimateApproval",
				state.allowEstimateApproval.toString(),
			);
			formData.append(
				"showServiceHistory",
				state.showServiceHistory.toString(),
			);
			formData.append("showInvoices", state.showInvoices.toString());
			formData.append("showEstimates", state.showEstimates.toString());
			formData.append("allowMessaging", state.allowMessaging.toString());
			formData.append("portalLogoUrl", state.portalLogoUrl);
			formData.append("primaryColor", state.primaryColor);
			formData.append("welcomeMessage", state.welcomeMessage);
			formData.append(
				"notifyOnNewInvoice",
				state.notifyOnNewInvoice.toString(),
			);
			formData.append(
				"notifyOnNewEstimate",
				state.notifyOnNewEstimate.toString(),
			);
			formData.append(
				"notifyOnAppointment",
				state.notifyOnAppointment.toString(),
			);
			return formData;
		},
	});

	const handleSave = useCallback(() => {
		saveSettings().catch(() => {});
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		reload().catch(() => {});
	}, [reload]);

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Configure the self-service experience your customers see when they log in."
				hasChanges={hasUnsavedChanges}
				helpText="Turn features on gradually; the portal updates instantly for customers."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save portal settings"
				title="Customer Portal"
			>
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings">Settings</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings/operations">Operations</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Customer portal</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild variant="ghost">
						<Link href="/dashboard/settings">Back to overview</Link>
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="size-4" />
							Access & security
						</CardTitle>
						<CardDescription>
							Decide who can log in and whether approvals are required
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="font-medium text-sm">Enable customer portal</p>
								<p className="text-muted-foreground text-xs">
									Turns the portal on for all customers.
								</p>
							</div>
							<Switch
								checked={settings.portalEnabled}
								onCheckedChange={(checked) =>
									updateSetting("portalEnabled", checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="font-medium text-sm">Require account approval</p>
								<p className="text-muted-foreground text-xs">
									New customers stay pending until staff approves them.
								</p>
							</div>
							<Switch
								checked={settings.requireAccountApproval}
								disabled={!settings.portalEnabled}
								onCheckedChange={(checked) =>
									updateSetting("requireAccountApproval", checked)
								}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Eye className="size-4" />
							What customers can see
						</CardTitle>
						<CardDescription>
							Toggle modules available in the portal dashboard
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{visibilityToggles.map((item) => (
							<div
								className="flex items-center justify-between rounded-lg border p-3"
								key={item.key}
							>
								<div>
									<p className="font-medium text-sm">{item.label}</p>
									<p className="text-muted-foreground text-xs">
										{item.description}
									</p>
								</div>
								<Switch
									checked={settings[item.key] as boolean}
									onCheckedChange={(checked) =>
										updateSetting(item.key, checked)
									}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Handshake className="size-4" />
							Self-service actions
						</CardTitle>
						<CardDescription>
							Allow portal users to take action without calling the office
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{actionToggles.map((item) => (
							<div
								className="flex items-center justify-between rounded-lg border p-3"
								key={item.key}
							>
								<div>
									<p className="font-medium text-sm">{item.label}</p>
									<p className="text-muted-foreground text-xs">
										{item.description}
									</p>
								</div>
								<Switch
									checked={settings[item.key] as boolean}
									onCheckedChange={(checked) =>
										updateSetting(item.key, checked)
									}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="size-4" />
							Communication & notifications
						</CardTitle>
						<CardDescription>
							Keep customers in the loop whenever portal data changes
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{notificationToggles.map((item) => (
							<div
								className="flex items-center justify-between rounded-lg border p-3"
								key={item.key}
							>
								<div>
									<p className="font-medium text-sm">{item.label}</p>
									<p className="text-muted-foreground text-xs">
										{item.description}
									</p>
								</div>
								<Switch
									checked={settings[item.key] as boolean}
									onCheckedChange={(checked) =>
										updateSetting(item.key, checked)
									}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="size-4" />
							Branding
						</CardTitle>
						<CardDescription>
							Update colors, messaging, and logo so the portal matches your
							brand
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Primary color</Label>
								<div className="mt-2 flex items-center gap-2">
									<Input
										onChange={(event) =>
											updateSetting("primaryColor", event.target.value)
										}
										type="color"
										value={settings.primaryColor}
									/>
									<Input
										className="font-mono text-sm"
										onChange={(event) =>
											updateSetting("primaryColor", event.target.value)
										}
										placeholder="#3b82f6"
										value={settings.primaryColor}
									/>
								</div>
							</div>
							<div>
								<Label>Portal logo URL</Label>
								<Input
									className="mt-2"
									onChange={(event) =>
										updateSetting("portalLogoUrl", event.target.value)
									}
									placeholder="https://cdn.yoursite.com/logo.png"
									value={settings.portalLogoUrl}
								/>
							</div>
						</div>
						<div>
							<Label>Welcome message</Label>
							<Textarea
								className="mt-2 min-h-[100px]"
								onChange={(event) =>
									updateSetting("welcomeMessage", event.target.value)
								}
								placeholder="What should customers know when they log in?"
								value={settings.welcomeMessage}
							/>
						</div>
					</CardContent>
				</Card>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default CustomerPortalClient;
