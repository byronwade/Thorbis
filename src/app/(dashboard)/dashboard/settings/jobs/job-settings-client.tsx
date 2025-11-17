"use client";

import { ClipboardList, FileText, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getJobSettings, updateJobSettings } from "@/actions/settings";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_JOB_SETTINGS,
	JOB_PRIORITIES,
	JOB_STATUSES,
	type JobSettingsState,
	mapJobSettings,
} from "./job-config";

type JobSettingsClientProps = {
	initialSettings: Partial<JobSettingsState> | null;
};

export function JobSettingsClient({ initialSettings }: JobSettingsClientProps) {
	const { settings, isLoading, isPending, hasUnsavedChanges, updateSetting, saveSettings, reload } =
		useSettings<JobSettingsState>({
			getter: getJobSettings,
			setter: updateJobSettings,
			initialState: DEFAULT_JOB_SETTINGS,
			settingsName: "jobs",
			prefetchedData: initialSettings ?? undefined,
			transformLoad: (data) => mapJobSettings(data),
			transformSave: (state) => {
				const formData = new FormData();
				formData.append("jobNumberPrefix", state.jobNumberPrefix);
				formData.append("jobNumberFormat", state.jobNumberFormat);
				formData.append("nextJobNumber", state.nextJobNumber.toString());
				formData.append("defaultJobStatus", state.defaultJobStatus);
				formData.append("defaultPriority", state.defaultPriority);
				formData.append("requireCustomerSignature", state.requireCustomerSignature.toString());
				formData.append("requirePhotoCompletion", state.requirePhotoCompletion.toString());
				formData.append("autoInvoiceOnCompletion", state.autoInvoiceOnCompletion.toString());
				formData.append("autoSendCompletionEmail", state.autoSendCompletionEmail.toString());
				formData.append("trackTechnicianTime", state.trackTechnicianTime.toString());
				formData.append("requireArrivalConfirmation", state.requireArrivalConfirmation.toString());
				formData.append("requireCompletionNotes", state.requireCompletionNotes.toString());
				return formData;
			},
		});

	const handleSave = useCallback(() => {
		saveSettings().catch(() => {
			// handled inside hook
		});
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		reload().catch(() => {
			// handled inside hook
		});
	}, [reload]);

	const jobPreview = (() => {
		const date = new Date();
		const map: Record<string, string> = {
			"{PREFIX}": settings.jobNumberPrefix || "JOB",
			"{YYYY}": date.getFullYear().toString(),
			"{MM}": String(date.getMonth() + 1).padStart(2, "0"),
			"{DD}": String(date.getDate()).padStart(2, "0"),
			"{XXXX}": settings.nextJobNumber.toString().padStart(4, "0"),
		};
		return Object.entries(map).reduce(
			(acc, [placeholder, value]) => acc.replaceAll(placeholder, value),
			settings.jobNumberFormat
		);
	})();

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Define how jobs are numbered, which data is required, and what happens at completion."
				hasChanges={hasUnsavedChanges}
				helpText="These rules power every job created manually, via automations, or from mobile."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save job settings"
				title="Job Configuration"
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
								<BreadcrumbPage>Jobs</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild variant="ghost">
						<Link href="/dashboard/settings">Back to settings overview</Link>
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="size-4" />
							Job numbering
						</CardTitle>
						<CardDescription>Control how IDs are formatted and incremented</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Prefix</Label>
								<Input
									className="mt-2"
									maxLength={8}
									onChange={(event) =>
										updateSetting("jobNumberPrefix", event.target.value.toUpperCase())
									}
									value={settings.jobNumberPrefix}
								/>
							</div>
							<div>
								<Label>Next number</Label>
								<Input
									className="mt-2"
									min={1}
									onChange={(event) => updateSetting("nextJobNumber", Number(event.target.value))}
									type="number"
									value={settings.nextJobNumber}
								/>
							</div>
						</div>
						<div>
							<Label>Format template</Label>
							<Input
								className="mt-2 font-mono text-sm"
								onChange={(event) => updateSetting("jobNumberFormat", event.target.value)}
								value={settings.jobNumberFormat}
							/>
							<p className="text-muted-foreground mt-1 text-xs">
								Supports placeholders: {"{PREFIX} {YYYY} {MM} {DD} {XXXX}"}
							</p>
						</div>
						<div className="rounded-lg border p-3">
							<p className="text-muted-foreground text-xs uppercase">Preview</p>
							<p className="mt-2 font-mono text-lg">{jobPreview}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ClipboardList className="size-4" />
							Defaults & requirements
						</CardTitle>
						<CardDescription>What every new job should start with</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2">
						<div>
							<Label>Default status</Label>
							<Select
								onValueChange={(value) => updateSetting("defaultJobStatus", value)}
								value={settings.defaultJobStatus}
							>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{JOB_STATUSES.map((status) => (
										<SelectItem key={status} value={status}>
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Default priority</Label>
							<Select
								onValueChange={(value) => updateSetting("defaultPriority", value)}
								value={settings.defaultPriority}
							>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{JOB_PRIORITIES.map((priority) => (
										<SelectItem key={priority} value={priority}>
											{priority}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Require customer signature</p>
								<p className="text-muted-foreground text-xs">
									Jobs cannot close until signatures are captured.
								</p>
							</div>
							<Switch
								checked={settings.requireCustomerSignature}
								onCheckedChange={(checked) => updateSetting("requireCustomerSignature", checked)}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Require job photos</p>
								<p className="text-muted-foreground text-xs">
									Mandate photo uploads before completion.
								</p>
							</div>
							<Switch
								checked={settings.requirePhotoCompletion}
								onCheckedChange={(checked) => updateSetting("requirePhotoCompletion", checked)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ShieldCheck className="size-4" />
							Completion checklist
						</CardTitle>
						<CardDescription>Guardrails before technicians can mark a job done</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Track technician time</p>
								<p className="text-muted-foreground text-xs">
									Capture hours for payroll and costing.
								</p>
							</div>
							<Switch
								checked={settings.trackTechnicianTime}
								onCheckedChange={(checked) => updateSetting("trackTechnicianTime", checked)}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Arrival confirmation</p>
								<p className="text-muted-foreground text-xs">
									Require acknowledgement when tech arrives onsite.
								</p>
							</div>
							<Switch
								checked={settings.requireArrivalConfirmation}
								onCheckedChange={(checked) => updateSetting("requireArrivalConfirmation", checked)}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Completion notes</p>
								<p className="text-muted-foreground text-xs">
									Prevent closing unless notes are documented.
								</p>
							</div>
							<Switch
								checked={settings.requireCompletionNotes}
								onCheckedChange={(checked) => updateSetting("requireCompletionNotes", checked)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="size-4" />
							Automation
						</CardTitle>
						<CardDescription>Automate downstream billing and communication</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Auto-generate invoices</p>
								<p className="text-muted-foreground text-xs">
									Create a draft invoice as soon as jobs are completed.
								</p>
							</div>
							<Switch
								checked={settings.autoInvoiceOnCompletion}
								onCheckedChange={(checked) => updateSetting("autoInvoiceOnCompletion", checked)}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Send completion email</p>
								<p className="text-muted-foreground text-xs">
									Notify customers with summary + next steps.
								</p>
							</div>
							<Switch
								checked={settings.autoSendCompletionEmail}
								onCheckedChange={(checked) => updateSetting("autoSendCompletionEmail", checked)}
							/>
						</div>
					</CardContent>
				</Card>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default JobSettingsClient;
