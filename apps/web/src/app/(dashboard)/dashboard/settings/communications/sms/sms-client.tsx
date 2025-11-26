"use client";

import {
	AlertTriangle,
	HelpCircle,
	Phone,
	Settings as SettingsIcon,
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
	DEFAULT_SMS_SETTINGS,
	mapSmsSettings,
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
			return formData;
		},
	});

	const handleSave = useCallback(() => {
		void saveSettings();
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		void reload();
	}, [reload]);

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
									Must match an active Telnyx or Twilio number.
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
										<option value="telnyx">Telnyx</option>
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
