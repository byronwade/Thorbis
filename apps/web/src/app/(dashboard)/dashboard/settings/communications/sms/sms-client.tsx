"use client";

import {
	AlertTriangle,
	Bell,
	CheckCircle2,
	Clock,
	HelpCircle,
	MessageSquare,
	Moon,
	Phone,
	Settings as SettingsIcon,
	Star,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getSmsSettings, updateSmsSettings } from "@/actions/settings";
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
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_QUICK_REPLIES_CONFIG,
	DEFAULT_SMS_SETTINGS,
	mapSmsSettings,
	type QuickRepliesConfig,
	type SmsSettingsState,
} from "./sms-config";

type SmsSettingsClientProps = {
	initialSettings: Partial<SmsSettingsState> | null;
};

function SmsSettingsClient({ initialSettings }: SmsSettingsClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<SmsSettingsState>({
		getter: getSmsSettings,
		setter: updateSmsSettings,
		initialState: DEFAULT_SMS_SETTINGS,
		settingsName: "sms",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapSmsSettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("provider", state.provider);
			formData.append("providerApiKey", state.providerApiKey);
			formData.append("senderNumber", state.senderNumber);
			formData.append("autoReplyEnabled", state.autoReplyEnabled.toString());
			formData.append("autoReplyMessage", state.autoReplyMessage);
			formData.append("optOutMessage", state.optOutMessage);
			formData.append("includeOptOut", state.includeOptOut.toString());
			formData.append("consentRequired", state.consentRequired.toString());
			formData.append(
				"quickRepliesEnabled",
				state.quickRepliesEnabled.toString(),
			);
			formData.append(
				"quickRepliesConfig",
				JSON.stringify(state.quickRepliesConfig),
			);
			return formData;
		},
	});

	const handleSave = useCallback(() => {
		void saveSettings();
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		void reload();
	}, [reload]);

	// Helper to update nested quick replies config
	const updateQuickReplyConfig = useCallback(
		<K extends keyof QuickRepliesConfig>(key: K, value: QuickRepliesConfig[K]) => {
			updateSetting("quickRepliesConfig", {
				...settings.quickRepliesConfig,
				[key]: value,
			});
		},
		[settings.quickRepliesConfig, updateSetting],
	);

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Configure SMS sending numbers, auto-responses, and compliance defaults."
				hasChanges={hasUnsavedChanges}
				helpText="Applies to all outbound text messages and automation."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save SMS settings"
				title="SMS & Text"
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
								<BreadcrumbPage>SMS</BreadcrumbPage>
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

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Phone className="size-4" />
							Sender Identity
						</CardTitle>
						<CardDescription>Number and name customers see</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<StandardFormRow cols={2}>
							<StandardFormField label="SMS phone number" htmlFor="sms-phone">
								<div className="flex items-center gap-2 mb-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="text-muted-foreground size-3" />
										</TooltipTrigger>
										<TooltipContent>
											Provisioned number used to send all texts.
										</TooltipContent>
									</Tooltip>
									<span className="text-sm text-muted-foreground">
										Provisioned number used to send all texts
									</span>
								</div>
								<Input
									id="sms-phone"
									onChange={(event) =>
										updateSetting("senderNumber", event.target.value)
									}
									placeholder="(555) 123-4567"
									type="tel"
									value={settings.senderNumber}
								/>
								<p className="text-muted-foreground text-xs">
									Must match an active Twilio number.
								</p>
							</StandardFormField>
							<div className="space-y-4">
								<StandardFormField label="Provider" htmlFor="sms-provider">
									<select
										id="sms-provider"
										className="border-input bg-background block w-full rounded-md border px-3 py-2 text-sm"
										onChange={(event) =>
											updateSetting(
												"provider",
												event.target.value as SmsSettingsState["provider"],
											)
										}
										value={settings.provider}
									>
										<option value="twilio">Twilio</option>
										<option value="other">Other</option>
									</select>
								</StandardFormField>
								<StandardFormField
									label="Provider API Key"
									htmlFor="sms-api-key"
								>
									<Input
										id="sms-api-key"
										onChange={(event) =>
											updateSetting("providerApiKey", event.target.value)
										}
										placeholder="Provider API key"
										type="password"
										value={settings.providerApiKey}
									/>
									<p className="text-muted-foreground text-xs">
										Stored securely; leave blank to keep existing.
									</p>
								</StandardFormField>
							</div>
						</StandardFormRow>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Auto-response</CardTitle>
						<CardDescription>
							Automatically reply when a customer texts you
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Enable auto-response</p>
								<p className="text-muted-foreground text-xs">
									Sends an immediate acknowledgment outside business hours.
								</p>
							</div>
							<Switch
								checked={settings.autoReplyEnabled}
								onCheckedChange={(checked) =>
									updateSetting("autoReplyEnabled", checked)
								}
							/>
						</div>

						{settings.autoReplyEnabled && (
							<>
								<Separator />
								<StandardFormField
									label="Auto-response message"
									htmlFor="auto-response-msg"
								>
									<Textarea
										id="auto-response-msg"
										className="min-h-[120px] resize-none"
										onChange={(event) =>
											updateSetting("autoReplyMessage", event.target.value)
										}
										placeholder="Thanks for texting! We'll respond during business hours."
										value={settings.autoReplyMessage}
									/>
									<p className="text-muted-foreground text-xs">
										Sent once per conversation when an incoming SMS is received.
									</p>
								</StandardFormField>
							</>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Compliance</CardTitle>
						<CardDescription>
							Required messaging disclosures and consent tracking
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<Label className="flex items-center gap-2 text-sm font-medium">
									Include opt-out instructions
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="text-muted-foreground size-3" />
										</TooltipTrigger>
										<TooltipContent>
											Automatically append “Reply STOP to unsubscribe”.
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">
									Required for promotional messaging in most regions.
								</p>
							</div>
							<Switch
								checked={settings.includeOptOut}
								onCheckedChange={(checked) =>
									updateSetting("includeOptOut", checked)
								}
							/>
						</div>

						<Separator />

						<StandardFormField label="Opt-out message" htmlFor="opt-out-msg">
							<Textarea
								id="opt-out-msg"
								className="min-h-[80px] resize-none"
								onChange={(event) =>
									updateSetting("optOutMessage", event.target.value)
								}
								value={settings.optOutMessage}
							/>
							<p className="text-muted-foreground text-xs">
								Displayed after any outgoing SMS when opt-out instructions are
								enabled.
							</p>
						</StandardFormField>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Consent required</p>
								<p className="text-muted-foreground text-xs">
									Only send messages to contacts with documented consent.
								</p>
							</div>
							<Switch
								checked={settings.consentRequired}
								onCheckedChange={(checked) =>
									updateSetting("consentRequired", checked)
								}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="size-4" />
							Automated Quick Replies
						</CardTitle>
						<CardDescription>
							Automatically send predefined messages based on triggers. These
							run without CSR intervention.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">
									Enable automated quick replies
								</p>
								<p className="text-muted-foreground text-xs">
									Turn on automatic SMS responses for common scenarios.
								</p>
							</div>
							<Switch
								checked={settings.quickRepliesEnabled}
								onCheckedChange={(checked) =>
									updateSetting("quickRepliesEnabled", checked)
								}
							/>
						</div>

						{settings.quickRepliesEnabled && (
							<>
								<Separator />

								{/* Greeting Auto-Reply */}
								<div className="space-y-3 rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<MessageSquare className="text-muted-foreground size-4" />
											<div>
												<p className="text-sm font-medium">
													New conversation greeting
												</p>
												<p className="text-muted-foreground text-xs">
													Send when a customer texts for the first time.
												</p>
											</div>
										</div>
										<Switch
											checked={
												settings.quickRepliesConfig.greeting_enabled
											}
											onCheckedChange={(checked) =>
												updateQuickReplyConfig("greeting_enabled", checked)
											}
										/>
									</div>
									{settings.quickRepliesConfig.greeting_enabled && (
										<Textarea
											className="min-h-[80px] resize-none"
											onChange={(event) =>
												updateQuickReplyConfig(
													"greeting_message",
													event.target.value,
												)
											}
											placeholder="Hi! Thanks for reaching out..."
											value={settings.quickRepliesConfig.greeting_message}
										/>
									)}
								</div>

								{/* After Hours Auto-Reply */}
								<div className="space-y-3 rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Moon className="text-muted-foreground size-4" />
											<div>
												<p className="text-sm font-medium">After hours reply</p>
												<p className="text-muted-foreground text-xs">
													Send when messages arrive outside business hours.
												</p>
											</div>
										</div>
										<Switch
											checked={
												settings.quickRepliesConfig.after_hours_enabled
											}
											onCheckedChange={(checked) =>
												updateQuickReplyConfig("after_hours_enabled", checked)
											}
										/>
									</div>
									{settings.quickRepliesConfig.after_hours_enabled && (
										<Textarea
											className="min-h-[80px] resize-none"
											onChange={(event) =>
												updateQuickReplyConfig(
													"after_hours_message",
													event.target.value,
												)
											}
											placeholder="Thanks for your message! We're currently closed..."
											value={settings.quickRepliesConfig.after_hours_message}
										/>
									)}
								</div>

								{/* Appointment Reminder */}
								<div className="space-y-3 rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Bell className="text-muted-foreground size-4" />
											<div>
												<p className="text-sm font-medium">
													Appointment reminder
												</p>
												<p className="text-muted-foreground text-xs">
													Automatically remind customers before appointments.
												</p>
											</div>
										</div>
										<Switch
											checked={
												settings.quickRepliesConfig
													.appointment_reminder_enabled
											}
											onCheckedChange={(checked) =>
												updateQuickReplyConfig(
													"appointment_reminder_enabled",
													checked,
												)
											}
										/>
									</div>
									{settings.quickRepliesConfig
										.appointment_reminder_enabled && (
										<>
											<div className="flex items-center gap-2">
												<Clock className="text-muted-foreground size-3" />
												<Label className="text-xs">Hours before</Label>
												<Input
													className="w-20"
													min={1}
													max={72}
													onChange={(event) =>
														updateQuickReplyConfig(
															"appointment_reminder_hours_before",
															Number.parseInt(event.target.value) || 24,
														)
													}
													type="number"
													value={
														settings.quickRepliesConfig
															.appointment_reminder_hours_before
													}
												/>
											</div>
											<Textarea
												className="min-h-[80px] resize-none"
												onChange={(event) =>
													updateQuickReplyConfig(
														"appointment_reminder_message",
														event.target.value,
													)
												}
												placeholder="Reminder: You have an appointment..."
												value={
													settings.quickRepliesConfig
														.appointment_reminder_message
												}
											/>
										</>
									)}
								</div>

								{/* Job Complete Notification */}
								<div className="space-y-3 rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<CheckCircle2 className="text-muted-foreground size-4" />
											<div>
												<p className="text-sm font-medium">
													Job complete notification
												</p>
												<p className="text-muted-foreground text-xs">
													Send when a job is marked as complete.
												</p>
											</div>
										</div>
										<Switch
											checked={
												settings.quickRepliesConfig.job_complete_enabled
											}
											onCheckedChange={(checked) =>
												updateQuickReplyConfig("job_complete_enabled", checked)
											}
										/>
									</div>
									{settings.quickRepliesConfig.job_complete_enabled && (
										<Textarea
											className="min-h-[80px] resize-none"
											onChange={(event) =>
												updateQuickReplyConfig(
													"job_complete_message",
													event.target.value,
												)
											}
											placeholder="Your service has been completed..."
											value={settings.quickRepliesConfig.job_complete_message}
										/>
									)}
								</div>

								{/* Review Request */}
								<div className="space-y-3 rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Star className="text-muted-foreground size-4" />
											<div>
												<p className="text-sm font-medium">Review request</p>
												<p className="text-muted-foreground text-xs">
													Ask for a review after job completion.
												</p>
											</div>
										</div>
										<Switch
											checked={
												settings.quickRepliesConfig.review_request_enabled
											}
											onCheckedChange={(checked) =>
												updateQuickReplyConfig(
													"review_request_enabled",
													checked,
												)
											}
										/>
									</div>
									{settings.quickRepliesConfig.review_request_enabled && (
										<>
											<div className="flex items-center gap-2">
												<Clock className="text-muted-foreground size-3" />
												<Label className="text-xs">
													Hours after job complete
												</Label>
												<Input
													className="w-20"
													min={1}
													max={168}
													onChange={(event) =>
														updateQuickReplyConfig(
															"review_request_delay_hours",
															Number.parseInt(event.target.value) || 24,
														)
													}
													type="number"
													value={
														settings.quickRepliesConfig
															.review_request_delay_hours
													}
												/>
											</div>
											<Textarea
												className="min-h-[80px] resize-none"
												onChange={(event) =>
													updateQuickReplyConfig(
														"review_request_message",
														event.target.value,
													)
												}
												placeholder="Thank you for choosing us! Please leave a review..."
												value={
													settings.quickRepliesConfig.review_request_message
												}
											/>
										</>
									)}
								</div>

								{/* Template Variables Help */}
								<div className="bg-muted/50 rounded-lg p-3">
									<div className="flex items-center gap-2 mb-2">
										<HelpCircle className="text-muted-foreground size-3" />
										<p className="text-xs font-medium">Available variables</p>
									</div>
									<div className="text-muted-foreground grid grid-cols-2 gap-1 text-xs">
										<span>
											<code className="bg-muted rounded px-1">
												{"{{company_name}}"}
											</code>{" "}
											- Your company
										</span>
										<span>
											<code className="bg-muted rounded px-1">
												{"{{customer_name}}"}
											</code>{" "}
											- Customer name
										</span>
										<span>
											<code className="bg-muted rounded px-1">
												{"{{appointment_time}}"}
											</code>{" "}
											- Scheduled time
										</span>
										<span>
											<code className="bg-muted rounded px-1">
												{"{{emergency_phone}}"}
											</code>{" "}
											- Emergency line
										</span>
										<span>
											<code className="bg-muted rounded px-1">
												{"{{review_link}}"}
											</code>{" "}
											- Review page URL
										</span>
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				<Card className="border-warning/40 bg-warning/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<AlertTriangle className="text-warning size-5" />
						<div className="space-y-1">
							<p className="text-warning text-sm font-semibold">
								Compliance reminder
							</p>
							<p className="text-muted-foreground text-sm">
								Follow TCPA/CTIA guidelines: honor STOP requests immediately,
								keep quiet hours, and collect explicit consent before sending
								marketing texts. Configure opt-outs and consent policies here so
								Thorbis can enforce them automatically.
							</p>
						</div>
					</CardContent>
				</Card>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default SmsSettingsClient;
