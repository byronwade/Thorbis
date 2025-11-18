"use client";

import { Building, Inbox, ListChecks, Users } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getIntakeSettings, updateIntakeSettings } from "@/actions/settings";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
	type CustomerIntakeSettingsState,
	DEFAULT_CUSTOMER_INTAKE_SETTINGS,
	mapCustomerIntakeSettings,
} from "./customer-intake-config";

type CustomerIntakeClientProps = {
	initialSettings: Partial<CustomerIntakeSettingsState> | null;
};

export function CustomerIntakeClient({
	initialSettings,
}: CustomerIntakeClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<CustomerIntakeSettingsState>({
		getter: getIntakeSettings,
		setter: updateIntakeSettings,
		initialState: DEFAULT_CUSTOMER_INTAKE_SETTINGS,
		settingsName: "customer intake",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapCustomerIntakeSettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("requirePhone", state.requirePhone.toString());
			formData.append("requireEmail", state.requireEmail.toString());
			formData.append("requireAddress", state.requireAddress.toString());
			formData.append(
				"requirePropertyType",
				state.requirePropertyType.toString(),
			);
			formData.append("trackLeadSource", state.trackLeadSource.toString());
			formData.append("requireLeadSource", state.requireLeadSource.toString());
			formData.append(
				"autoAssignTechnician",
				state.autoAssignTechnician.toString(),
			);
			formData.append("autoCreateJob", state.autoCreateJob.toString());
			formData.append("sendWelcomeEmail", state.sendWelcomeEmail.toString());
			formData.append(
				"welcomeEmailTemplateId",
				state.welcomeEmailTemplateId || "",
			);
			const trimmedQuestions = state.customQuestions.trim();
			formData.append(
				"customQuestions",
				trimmedQuestions.length === 0 ? "[]" : trimmedQuestions,
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
				description="Decide which information is required during customer self-entry and internal intake."
				hasChanges={hasUnsavedChanges}
				helpText="These defaults apply to forms across your portal, CSR console, and embeddable workflows."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save intake settings"
				title="Customer Intake"
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
								<BreadcrumbPage>Customer intake</BreadcrumbPage>
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
							<Users className="size-4" />
							Contact essentials
						</CardTitle>
						<CardDescription>
							Required fields before a customer can be created
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{[
							{
								key: "requirePhone",
								label: "Require phone number",
								description: "Used for confirmations and SMS notifications.",
							},
							{
								key: "requireEmail",
								label: "Require email address",
								description: "Needed for invoices, receipts, and updates.",
							},
							{
								key: "requireAddress",
								label: "Require service address",
								description: "Required for routing and scheduling.",
							},
							{
								key: "requirePropertyType",
								label: "Require property type",
								description: "Collect residential vs. commercial context.",
							},
						].map((field) => (
							<div
								className="flex items-center justify-between rounded-lg border p-3"
								key={field.key}
							>
								<div>
									<p className="text-sm font-medium">{field.label}</p>
									<p className="text-muted-foreground text-xs">
										{field.description}
									</p>
								</div>
								<Switch
									checked={
										settings[
											field.key as keyof CustomerIntakeSettingsState
										] as boolean
									}
									onCheckedChange={(checked) =>
										updateSetting(
											field.key as keyof CustomerIntakeSettingsState,
											checked,
										)
									}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building className="size-4" />
							Lead capture
						</CardTitle>
						<CardDescription>
							Decide when to capture attribution and assign work automatically
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Track lead source</p>
								<p className="text-muted-foreground text-xs">
									Show the “How did you hear about us?” dropdown.
								</p>
							</div>
							<Switch
								checked={settings.trackLeadSource}
								onCheckedChange={(checked) =>
									updateSetting("trackLeadSource", checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Require lead source</p>
								<p className="text-muted-foreground text-xs">
									Prevent submission until a source is selected.
								</p>
							</div>
							<Switch
								checked={settings.requireLeadSource}
								onCheckedChange={(checked) =>
									updateSetting("requireLeadSource", checked)
								}
							/>
						</div>
						<Separator />
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Auto-assign technician</p>
								<p className="text-muted-foreground text-xs">
									Immediately route new intake to dispatch rules.
								</p>
							</div>
							<Switch
								checked={settings.autoAssignTechnician}
								onCheckedChange={(checked) =>
									updateSetting("autoAssignTechnician", checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Auto-create job</p>
								<p className="text-muted-foreground text-xs">
									Convert intake submissions straight into jobs.
								</p>
							</div>
							<Switch
								checked={settings.autoCreateJob}
								onCheckedChange={(checked) =>
									updateSetting("autoCreateJob", checked)
								}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Inbox className="size-4" />
							Welcome messaging
						</CardTitle>
						<CardDescription>
							What happens immediately after a customer submits the form
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Send welcome email</p>
								<p className="text-muted-foreground text-xs">
									Triggers the template defined below.
								</p>
							</div>
							<Switch
								checked={settings.sendWelcomeEmail}
								onCheckedChange={(checked) =>
									updateSetting("sendWelcomeEmail", checked)
								}
							/>
						</div>
						<div>
							<Label>Email template ID</Label>
							<Input
								className="mt-2"
								onChange={(event) =>
									updateSetting("welcomeEmailTemplateId", event.target.value)
								}
								placeholder="tmpl_welcome_123"
								value={settings.welcomeEmailTemplateId}
							/>
							<p className="text-muted-foreground mt-1 text-xs">
								Must match a template configured in your messaging provider.
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ListChecks className="size-4" />
							Custom questions
						</CardTitle>
						<CardDescription>
							Extend the intake form with extra fields or disclosures
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Textarea
							className="min-h-[220px] font-mono text-sm"
							onChange={(event) =>
								updateSetting("customQuestions", event.target.value)
							}
							placeholder='Example: [{"label":"Gate code","type":"text","required":false}]'
							value={settings.customQuestions}
						/>
						<p className="text-muted-foreground text-xs">
							Provide a JSON array describing custom questions. Each object can
							include <code>label</code>, <code>type</code>, and{" "}
							<code>required</code>.
						</p>
					</CardContent>
				</Card>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default CustomerIntakeClient;
