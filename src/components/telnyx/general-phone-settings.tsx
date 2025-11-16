"use client";

/**
 * General Phone Settings - Basic phone configuration
 *
 * Features:
 * - Business phone number management
 * - Call recording settings with consent
 * - Basic voicemail configuration
 * - Default routing strategy
 * - Business hours enforcement
 */

import { HelpCircle, Loader2, Phone, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getPhoneSettings, updatePhoneSettings } from "@/actions/settings";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function GeneralPhoneSettings() {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [settings, setSettings] = useState({
		businessPhoneNumber: "",
		enableCallRecording: false,
		callRecordingDisclosure: true,
		enableVoicemail: true,
		voicemailGreeting: "",
		routingStrategy: "round_robin",
		businessHoursOnly: false,
		voicemailEmailNotifications: true,
		voicemailTranscription: false,
		fallbackNumber: "",
		maxConcurrentCalls: 3,
	});

	useEffect(() => {
		loadSettings();
	}, [loadSettings]);

	async function loadSettings() {
		setIsLoading(true);
		try {
			const result = await getPhoneSettings();

			if (result.success && result.data) {
				setSettings({
					businessPhoneNumber: result.data.fallback_number || "",
					enableCallRecording: result.data.recording_enabled ?? false,
					callRecordingDisclosure:
						result.data.recording_consent_required ?? true,
					enableVoicemail: result.data.voicemail_enabled ?? true,
					voicemailGreeting: result.data.voicemail_greeting_url || "",
					routingStrategy: result.data.routing_strategy || "round_robin",
					businessHoursOnly: result.data.business_hours_only ?? false,
					voicemailEmailNotifications:
						result.data.voicemail_email_notifications ?? true,
					voicemailTranscription:
						result.data.voicemail_transcription_enabled ?? false,
					fallbackNumber: result.data.fallback_number || "",
					maxConcurrentCalls: result.data.max_concurrent_calls || 3,
				});
			}
		} catch (_error) {
			toast.error("Failed to load phone settings");
		} finally {
			setIsLoading(false);
		}
	}

	function updateSetting(key: string, value: string | boolean | number) {
		setSettings((prev) => ({ ...prev, [key]: value }));
		setHasUnsavedChanges(true);
	}

	function handleSave() {
		startTransition(async () => {
			const formData = new FormData();
			formData.append("routingStrategy", settings.routingStrategy);
			formData.append("fallbackNumber", settings.fallbackNumber);
			formData.append(
				"businessHoursOnly",
				settings.businessHoursOnly.toString(),
			);
			formData.append("voicemailEnabled", settings.enableVoicemail.toString());
			formData.append("voicemailGreetingUrl", settings.voicemailGreeting);
			formData.append(
				"voicemailEmailNotifications",
				settings.voicemailEmailNotifications.toString(),
			);
			formData.append(
				"voicemailTranscriptionEnabled",
				settings.voicemailTranscription.toString(),
			);
			formData.append(
				"recordingEnabled",
				settings.enableCallRecording.toString(),
			);
			formData.append(
				"recordingConsentRequired",
				settings.callRecordingDisclosure.toString(),
			);
			formData.append(
				"maxConcurrentCalls",
				settings.maxConcurrentCalls.toString(),
			);

			const result = await updatePhoneSettings(formData);

			if (result.success) {
				setHasUnsavedChanges(false);
				toast.success("Phone settings saved successfully");
			} else {
				toast.error(result.error || "Failed to save phone settings");
			}
		});
	}

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{hasUnsavedChanges && (
					<div className="flex justify-end">
						<Button disabled={isPending} onClick={handleSave}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 size-4" />
									Save Changes
								</>
							)}
						</Button>
					</div>
				)}

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Phone className="size-4" />
							Business Phone Number
						</CardTitle>
						<CardDescription>
							Main business phone number and fallback settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label className="flex items-center gap-2 font-medium text-sm">
								Business Phone Number
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-3 w-3 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">
											Main phone number for your business
										</p>
									</TooltipContent>
								</Tooltip>
							</Label>
							<Input
								className="mt-2"
								onChange={(e) =>
									updateSetting("businessPhoneNumber", e.target.value)
								}
								placeholder="+1 (555) 123-4567"
								type="tel"
								value={settings.businessPhoneNumber}
							/>
							<p className="mt-1 text-muted-foreground text-xs">
								Displayed to customers and used for caller ID
							</p>
						</div>

						<div>
							<Label className="flex items-center gap-2 font-medium text-sm">
								Fallback Number
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-3 w-3 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">
											Number to forward calls when all team members are
											unavailable
										</p>
									</TooltipContent>
								</Tooltip>
							</Label>
							<Input
								className="mt-2"
								onChange={(e) =>
									updateSetting("fallbackNumber", e.target.value)
								}
								placeholder="+1 (555) 987-6543"
								type="tel"
								value={settings.fallbackNumber}
							/>
							<p className="mt-1 text-muted-foreground text-xs">
								Emergency or on-call number when no agents available
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Routing Strategy</CardTitle>
						<CardDescription>
							How incoming calls are distributed to team members
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="routing">Default Routing Method</Label>
							<Select
								onValueChange={(value) =>
									updateSetting("routingStrategy", value)
								}
								value={settings.routingStrategy}
							>
								<SelectTrigger className="mt-2" id="routing">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="round_robin">Round Robin</SelectItem>
									<SelectItem value="simultaneous">
										Simultaneous Ring
									</SelectItem>
									<SelectItem value="longest_idle">Longest Idle</SelectItem>
									<SelectItem value="skills_based">Skills Based</SelectItem>
								</SelectContent>
							</Select>
							<p className="mt-1 text-muted-foreground text-xs">
								{settings.routingStrategy === "round_robin" &&
									"Distribute calls evenly across available team members"}
								{settings.routingStrategy === "simultaneous" &&
									"Ring all available team members at once"}
								{settings.routingStrategy === "longest_idle" &&
									"Route to team member who hasn't received a call the longest"}
								{settings.routingStrategy === "skills_based" &&
									"Route based on agent skills and expertise"}
							</p>
						</div>

						<div>
							<Label htmlFor="concurrent">Max Concurrent Calls Per Agent</Label>
							<Select
								onValueChange={(value) =>
									updateSetting(
										"maxConcurrentCalls",
										Number.parseInt(value, 10),
									)
								}
								value={settings.maxConcurrentCalls.toString()}
							>
								<SelectTrigger className="mt-2" id="concurrent">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">1 call</SelectItem>
									<SelectItem value="2">2 calls</SelectItem>
									<SelectItem value="3">3 calls</SelectItem>
									<SelectItem value="5">5 calls</SelectItem>
									<SelectItem value="10">10 calls</SelectItem>
								</SelectContent>
							</Select>
							<p className="mt-1 text-muted-foreground text-xs">
								Maximum number of simultaneous calls per team member
							</p>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Business Hours Only
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">
												Only route calls during configured business hours
											</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">
									Enforce business hours for call routing
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
						<CardTitle>Call Recording</CardTitle>
						<CardDescription>
							Record calls for training and quality assurance
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Enable Call Recording
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">
												Record phone calls for training and quality
											</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">
									Record calls for quality and training
								</p>
							</div>
							<Switch
								checked={settings.enableCallRecording}
								onCheckedChange={(checked) =>
									updateSetting("enableCallRecording", checked)
								}
							/>
						</div>

						{settings.enableCallRecording && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="flex items-center gap-2 font-medium text-sm">
											Recording Disclosure
											<Tooltip>
												<TooltipTrigger>
													<HelpCircle className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">
														Play "This call may be recorded" message (required
														by law in most states)
													</p>
												</TooltipContent>
											</Tooltip>
										</Label>
										<p className="text-muted-foreground text-xs">
											Notify caller that call is recorded
										</p>
									</div>
									<Switch
										checked={settings.callRecordingDisclosure}
										onCheckedChange={(checked) =>
											updateSetting("callRecordingDisclosure", checked)
										}
									/>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Voicemail</CardTitle>
						<CardDescription>Basic voicemail configuration</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Enable Voicemail
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">
												Allow callers to leave voicemail messages
											</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">
									Allow callers to leave messages
								</p>
							</div>
							<Switch
								checked={settings.enableVoicemail}
								onCheckedChange={(checked) =>
									updateSetting("enableVoicemail", checked)
								}
							/>
						</div>

						{settings.enableVoicemail && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="font-medium text-sm">
											Email Notifications
										</Label>
										<p className="text-muted-foreground text-xs">
											Send email when voicemail received
										</p>
									</div>
									<Switch
										checked={settings.voicemailEmailNotifications}
										onCheckedChange={(checked) =>
											updateSetting("voicemailEmailNotifications", checked)
										}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="font-medium text-sm">
											Voicemail Transcription
										</Label>
										<p className="text-muted-foreground text-xs">
											Auto-transcribe voicemail to text
										</p>
									</div>
									<Switch
										checked={settings.voicemailTranscription}
										onCheckedChange={(checked) =>
											updateSetting("voicemailTranscription", checked)
										}
									/>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div className="space-y-1">
							<p className="font-medium text-primary text-sm dark:text-primary">
								Phone System Best Practices
							</p>
							<p className="text-muted-foreground text-sm">
								Always disclose call recording when enabled. Configure business
								hours in the Hours tab for accurate routing. Set up team member
								extensions for direct dialing. Use the fallback number for
								after-hours emergencies.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
