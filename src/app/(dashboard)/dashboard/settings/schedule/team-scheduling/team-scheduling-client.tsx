"use client";

import { ClipboardList, Users, Workflow } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getTeamSchedulingRules, updateTeamSchedulingRules } from "@/actions/settings";
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
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_TEAM_SCHEDULING_SETTINGS,
	mapTeamSchedulingSettings,
	type TeamSchedulingSettingsState,
} from "./team-scheduling-config";

type TeamSchedulingClientProps = {
	initialSettings: Partial<TeamSchedulingSettingsState> | null;
};

export function TeamSchedulingClient({ initialSettings }: TeamSchedulingClientProps) {
	const { settings, isLoading, isPending, hasUnsavedChanges, updateSetting, saveSettings, reload } =
		useSettings<TeamSchedulingSettingsState>({
			getter: getTeamSchedulingRules,
			setter: updateTeamSchedulingRules,
			initialState: DEFAULT_TEAM_SCHEDULING_SETTINGS,
			settingsName: "team scheduling",
			prefetchedData: initialSettings ?? undefined,
			transformLoad: (data) => mapTeamSchedulingSettings(data),
			transformSave: (state) => {
				const formData = new FormData();
				formData.append("maxJobsPerDay", state.maxJobsPerDay.toString());
				formData.append("maxJobsPerWeek", state.maxJobsPerWeek.toString());
				formData.append("allowOvertime", state.allowOvertime.toString());
				formData.append("preferSameTechnician", state.preferSameTechnician.toString());
				formData.append("balanceWorkload", state.balanceWorkload.toString());
				formData.append("optimizeForTravelTime", state.optimizeForTravelTime.toString());
				formData.append("maxTravelTimeMinutes", state.maxTravelTimeMinutes.toString());
				formData.append("requireBreaks", state.requireBreaks.toString());
				formData.append("breakAfterHours", state.breakAfterHours.toString());
				formData.append("breakDurationMinutes", state.breakDurationMinutes.toString());
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
		<SettingsPageLayout
			description="Establish capacity limits, workload balance, and dispatch preferences for your crews."
			hasChanges={hasUnsavedChanges}
			helpText="These rules govern how many jobs can be booked per tech and how dispatch balances the team."
			isLoading={isLoading}
			isPending={isPending}
			onCancel={handleCancel}
			onSave={handleSave}
			saveButtonText="Save team rules"
			title="Team Scheduling"
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
								<Link href="/dashboard/settings/schedule">Scheduling</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Team scheduling</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Button asChild variant="ghost">
					<Link href="/dashboard/settings/schedule">Back to scheduling</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="size-4" />
						Workload limits
					</CardTitle>
					<CardDescription>Cap jobs per tech to avoid burnout</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Max jobs per day</Label>
						<Input
							className="mt-2"
							min={1}
							onChange={(event) => updateSetting("maxJobsPerDay", Number(event.target.value))}
							type="number"
							value={settings.maxJobsPerDay}
						/>
					</div>
					<div>
						<Label>Max jobs per week</Label>
						<Input
							className="mt-2"
							min={1}
							onChange={(event) => updateSetting("maxJobsPerWeek", Number(event.target.value))}
							type="number"
							value={settings.maxJobsPerWeek}
						/>
					</div>
					<div className="flex items-center justify-between rounded-lg border p-3 md:col-span-2">
						<div>
							<p className="font-medium text-sm">Allow overtime</p>
							<p className="text-muted-foreground text-xs">Permit scheduling beyond weekly cap when necessary.</p>
						</div>
						<Switch
							checked={settings.allowOvertime}
							onCheckedChange={(checked) => updateSetting("allowOvertime", checked)}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Workflow className="size-4" />
						Assignment preferences
					</CardTitle>
					<CardDescription>Guide dispatch on who gets the next job</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[
						{
							key: "preferSameTechnician",
							label: "Prefer same technician for repeat customers",
							description: "Keeps relationship continuity for recurring work.",
						},
						{
							key: "balanceWorkload",
							label: "Balance workload across team",
							description: "Evenly distribute jobs when possible.",
						},
						{
							key: "optimizeForTravelTime",
							label: "Optimize for travel time",
							description: "Favor assignments that minimize drive time.",
						},
					].map((pref) => (
						<div className="flex items-center justify-between rounded-lg border p-3" key={pref.key}>
							<div>
								<p className="font-medium text-sm">{pref.label}</p>
								<p className="text-muted-foreground text-xs">{pref.description}</p>
							</div>
							<Switch
								checked={settings[pref.key as keyof TeamSchedulingSettingsState] as boolean}
								onCheckedChange={(checked) => updateSetting(pref.key as keyof TeamSchedulingSettingsState, checked)}
							/>
						</div>
					))}
					<div>
						<Label>Maximum travel time (minutes)</Label>
						<Input
							className="mt-2 w-32"
							min={0}
							onChange={(event) => updateSetting("maxTravelTimeMinutes", Number(event.target.value))}
							type="number"
							value={settings.maxTravelTimeMinutes}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ClipboardList className="size-4" />
						Break requirements
					</CardTitle>
					<CardDescription>Ensure techs get rest between jobs</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between rounded-lg border p-3">
						<div>
							<p className="font-medium text-sm">Require breaks</p>
							<p className="text-muted-foreground text-xs">Automatically insert breaks into heavy schedules.</p>
						</div>
						<Switch
							checked={settings.requireBreaks}
							onCheckedChange={(checked) => updateSetting("requireBreaks", checked)}
						/>
					</div>
					{settings.requireBreaks && (
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Break after hours</Label>
								<Input
									className="mt-2 w-32"
									min={1}
									onChange={(event) => updateSetting("breakAfterHours", Number(event.target.value))}
									type="number"
									value={settings.breakAfterHours}
								/>
							</div>
							<div>
								<Label>Break duration (minutes)</Label>
								<Input
									className="mt-2 w-32"
									min={5}
									onChange={(event) => updateSetting("breakDurationMinutes", Number(event.target.value))}
									type="number"
									value={settings.breakDurationMinutes}
								/>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</SettingsPageLayout>
	);
}

export default TeamSchedulingClient;
