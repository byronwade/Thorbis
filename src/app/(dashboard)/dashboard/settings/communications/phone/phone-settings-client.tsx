"use client";

import {
	AlertTriangle,
	HelpCircle,
	Phone as PhoneIcon,
	PhoneIncoming,
	PhoneOutgoing,
	Settings as SettingsIcon,
	Voicemail,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getPhoneSettings, updatePhoneSettings } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { CallFlowDesigner } from "@/components/telnyx/call-flow-designer";
import { VoicemailSettings } from "@/components/telnyx/voicemail-settings";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import {
	DEFAULT_PHONE_SETTINGS,
	mapPhoneSettings,
	type PhoneSettingsState,
} from "./phone-config";

type PhoneSettingsClientProps = {
	initialSettings: Partial<PhoneSettingsState> | null;
};

export default function PhoneSettingsClient({
	initialSettings,
}: PhoneSettingsClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<PhoneSettingsState>({
		getter: getPhoneSettings,
		setter: updatePhoneSettings,
		initialState: DEFAULT_PHONE_SETTINGS,
		settingsName: "phone",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapPhoneSettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("routingStrategy", state.routingStrategy);
			formData.append("fallbackNumber", state.fallbackNumber);
			formData.append("businessHoursOnly", state.businessHoursOnly.toString());
			formData.append("voicemailEnabled", state.voicemailEnabled.toString());
			formData.append("voicemailGreetingUrl", state.voicemailGreetingUrl);
			formData.append(
				"voicemailEmailNotifications",
				state.voicemailEmailNotifications.toString(),
			);
			formData.append(
				"voicemailTranscriptionEnabled",
				state.voicemailTranscriptionEnabled.toString(),
			);
			formData.append("recordingEnabled", state.recordingEnabled.toString());
			formData.append("recordingAnnouncement", state.recordingAnnouncement);
			formData.append(
				"recordingConsentRequired",
				state.recordingConsentRequired.toString(),
			);
			formData.append("ivrEnabled", state.ivrEnabled.toString());
			formData.append("ivrMenu", state.ivrMenu);
			return formData;
		},
	});

	const handleSave = useCallback(() => {
		saveSettings().catch(() => {
			// no-op
		});
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		reload().catch(() => {
			// no-op
		});
	}, [reload]);

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Manage routing, voicemail, and plan for the upcoming React Flow VOIP system."
				hasChanges={hasUnsavedChanges}
				helpText="Changes apply to all inbound calls immediately."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save phone settings"
				title="Phone & Voice"
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
									<Link href="/dashboard/settings/communications">
										Communications
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Phone</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild variant="ghost">
						<Link href="/dashboard/settings/communications">
							<SettingsIcon className="mr-2 size-4" />
							Back to communications
						</Link>
					</Button>
				</div>

				<Tabs className="mt-6 space-y-6" defaultValue="overview">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="overview">Routing & Compliance</TabsTrigger>
						<TabsTrigger value="voicemail">Company Voicemail</TabsTrigger>
						<TabsTrigger value="flows">Call Flows (Beta)</TabsTrigger>
					</TabsList>

					<TabsContent className="space-y-6" value="overview">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<PhoneIcon className="size-4" />
									Routing & fallback
								</CardTitle>
								<CardDescription>
									Where inbound calls go when they reach your main number
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className={cn("grid", "md:grid-cols-2", "gap-4")}>
									<div>
										<Label className="text-sm font-medium">
											Routing strategy
										</Label>
										<select
											className="border-input bg-background mt-2 block w-full rounded-md border px-3 py-2 text-sm"
											onChange={(event) =>
												updateSetting(
													"routingStrategy",
													event.target
														.value as PhoneSettingsState["routingStrategy"],
												)
											}
											value={settings.routingStrategy}
										>
											<option value="round_robin">Round robin</option>
											<option value="skills_based">Skills-based</option>
											<option value="priority">Priority</option>
											<option value="simultaneous">Simultaneous ring</option>
										</select>
										<p className="text-muted-foreground mt-1 text-xs">
											Determines how Thorbis assigns inbound calls.
										</p>
									</div>
									<div>
										<Label className="flex items-center gap-2 text-sm font-medium">
											Fallback number
											<Tooltip>
												<TooltipTrigger asChild>
													<HelpCircle className="text-muted-foreground size-3" />
												</TooltipTrigger>
												<TooltipContent>
													Phone number used if no teammates are available.
												</TooltipContent>
											</Tooltip>
										</Label>
										<Input
											className="mt-2"
											onChange={(event) =>
												updateSetting("fallbackNumber", event.target.value)
											}
											placeholder="(555) 987-6543"
											type="tel"
											value={settings.fallbackNumber}
										/>
										<p className="text-muted-foreground mt-1 text-xs">
											Phone number used if no teammates are available.
										</p>
									</div>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div>
										<Label className="text-sm font-medium">
											Business hours only
										</Label>
										<p className="text-muted-foreground text-xs">
											Send callers to voicemail outside of configured business
											hours.
										</p>
									</div>
									<Switch
										checked={settings.businessHoursOnly}
										onCheckedChange={(checked) =>
											updateSetting("businessHoursOnly", checked)
										}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Voicemail className="size-4" />
									Voicemail
								</CardTitle>
								<CardDescription>
									Greetings, transcription, and email notifications
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium">Enable voicemail</p>
										<p className="text-muted-foreground text-xs">
											Allow callers to leave a message when no one answers.
										</p>
									</div>
									<Switch
										checked={settings.voicemailEnabled}
										onCheckedChange={(checked) =>
											updateSetting("voicemailEnabled", checked)
										}
									/>
								</div>

								{settings.voicemailEnabled && (
									<>
										<Separator />
										<div className="grid gap-4 md:grid-cols-2">
											<div>
												<Label className="text-sm font-medium">
													Greeting URL
												</Label>
												<Input
													className="mt-2"
													onChange={(event) =>
														updateSetting(
															"voicemailGreetingUrl",
															event.target.value,
														)
													}
													placeholder="https://cdn.yourcompany.com/greetings/vm.mp3"
													value={settings.voicemailGreetingUrl}
												/>
												<p className="text-muted-foreground mt-1 text-xs">
													Provide an MP3/OGG file for your greeting.
												</p>
											</div>
											<div>
												<p className="text-sm font-medium">
													Email notifications for new voicemail
												</p>
												<Switch
													checked={settings.voicemailEmailNotifications}
													onCheckedChange={(checked) =>
														updateSetting(
															"voicemailEmailNotifications",
															checked,
														)
													}
												/>
											</div>
										</div>

										<Separator />

										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium">
													Transcribe voicemail
												</p>
												<p className="text-muted-foreground text-xs">
													Include transcription in notification emails.
												</p>
											</div>
											<Switch
												checked={settings.voicemailTranscriptionEnabled}
												onCheckedChange={(checked) =>
													updateSetting(
														"voicemailTranscriptionEnabled",
														checked,
													)
												}
											/>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<PhoneIncoming className="size-4" />
									Call recording
								</CardTitle>
								<CardDescription>
									Capture calls for QA and maintain compliance
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div
									className={cn(
										"flex items-center justify-between",
										"rounded-lg border",
										"p-3",
									)}
								>
									<div>
										<p className="text-sm font-medium">Enable recording</p>
										<p className="text-muted-foreground text-xs">
											Applies to all inbound and outbound calls.
										</p>
									</div>
									<Switch
										checked={settings.recordingEnabled}
										onCheckedChange={(checked) =>
											updateSetting("recordingEnabled", checked)
										}
									/>
								</div>

								{settings.recordingEnabled && (
									<>
										<Separator />
										<div>
											<Label className="text-sm font-medium">
												Announcement message
											</Label>
											<Textarea
												className="mt-2 min-h-[80px] resize-none"
												onChange={(event) =>
													updateSetting(
														"recordingAnnouncement",
														event.target.value,
													)
												}
												value={settings.recordingAnnouncement}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium">Consent required</p>
												<p className="text-muted-foreground text-xs">
													Pauses recording if customer declines consent.
												</p>
											</div>
											<Switch
												checked={settings.recordingConsentRequired}
												onCheckedChange={(checked) =>
													updateSetting("recordingConsentRequired", checked)
												}
											/>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<PhoneOutgoing className="size-4" />
									IVR & call flows
								</CardTitle>
								<CardDescription>
									Menu options and directed routing
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div
									className={cn(
										"flex items-center justify-between",
										"rounded-lg border",
										"p-3",
									)}
								>
									<div>
										<p className="text-sm font-medium">Enable IVR menu</p>
										<p className="text-muted-foreground text-xs">
											Present callers with “Press 1 for Sales” style prompts.
										</p>
									</div>
									<Switch
										checked={settings.ivrEnabled}
										onCheckedChange={(checked) =>
											updateSetting("ivrEnabled", checked)
										}
									/>
								</div>

								{settings.ivrEnabled && (
									<>
										<Separator />
										<div>
											<Label className="text-sm font-medium">
												IVR JSON definition
											</Label>
											<Textarea
												className="mt-2 min-h-[160px] font-mono text-sm"
												onChange={(event) =>
													updateSetting("ivrMenu", event.target.value)
												}
												value={settings.ivrMenu}
											/>
											<p className="text-muted-foreground mt-1 text-xs">
												Provide call flow definition (we’ll validate JSON on
												save).
											</p>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						<Card className="border-warning/40 bg-warning/5">
							<CardContent className={cn("flex items-start", "gap-3", "pt-6")}>
								<AlertTriangle className="text-warning size-5" />
								<div className="space-y-1">
									<p className="text-warning text-sm font-semibold">
										Regulatory reminder
									</p>
									<p className="text-muted-foreground text-sm">
										Recording and IVR features may carry legal obligations in
										your jurisdiction (GDPR, HIPAA, state consent laws). Confirm
										with legal counsel before enabling and keep callers informed
										via the announcement message.
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="voicemail">
						<Card>
							<CardHeader>
								<CardTitle>Company Voicemail Experience</CardTitle>
								<CardDescription>
									Configure greetings, notifications, and mailbox rules for
									every Telnyx number.
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<VoicemailSettings />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="flows">
						<Card>
							<CardHeader>
								<CardTitle>Visual Call Flow Builder</CardTitle>
								<CardDescription>
									Experiment with the React Flow designer that will power future
									VOIP automation.
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<CallFlowDesigner />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}
