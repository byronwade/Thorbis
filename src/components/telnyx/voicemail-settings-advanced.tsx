"use client";

/**
 * Advanced Voicemail Settings - Company-wide voicemail configuration
 *
 * Features:
 * - Custom greeting management (upload/TTS)
 * - Voicemail notification settings
 * - Transcription configuration
 * - Storage and retention policies
 * - Email delivery settings
 */

import { Mic, Save, Upload, Voicemail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";

export function VoicemailSettingsAdvanced() {
	const [settings, setSettings] = useState({
		transcriptionEnabled: true,
		emailNotifications: true,
		smsNotifications: false,
		retentionDays: 90,
		maxMessageLength: 180,
		greetingType: "default",
		customGreeting: "",
	});

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Voicemail className="size-5" />
						Voicemail Greetings
					</CardTitle>
					<CardDescription>
						Configure default voicemail greeting for your company
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="greetingType">Greeting Type</Label>
						<Select
							onValueChange={(value) =>
								setSettings({ ...settings, greetingType: value })
							}
							value={settings.greetingType}
						>
							<SelectTrigger className="mt-2" id="greetingType">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">Default System Greeting</SelectItem>
								<SelectItem value="tts">Text-to-Speech (TTS)</SelectItem>
								<SelectItem value="upload">Upload Custom Recording</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{settings.greetingType === "tts" && (
						<div>
							<Label htmlFor="customGreeting">Greeting Text</Label>
							<Textarea
								className="mt-2"
								id="customGreeting"
								onChange={(e) =>
									setSettings({ ...settings, customGreeting: e.target.value })
								}
								placeholder="Thank you for calling. We're unable to take your call right now. Please leave a message..."
								rows={4}
								value={settings.customGreeting}
							/>
							<Button className="mt-2" size="sm" variant="outline">
								<Mic className="mr-2 size-4" />
								Preview Greeting
							</Button>
						</div>
					)}

					{settings.greetingType === "upload" && (
						<div>
							<Label>Upload Audio File</Label>
							<div className="mt-2 flex items-center gap-2">
								<Button variant="outline">
									<Upload className="mr-2 size-4" />
									Choose File
								</Button>
								<span className="text-muted-foreground text-sm">
									MP3, WAV, or M4A (max 5MB)
								</span>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Notification Settings</CardTitle>
					<CardDescription>
						How team members are notified of new voicemails
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<Label>Email Notifications</Label>
							<p className="text-muted-foreground text-xs">
								Send voicemail audio file via email
							</p>
						</div>
						<Switch
							checked={settings.emailNotifications}
							onCheckedChange={(checked) =>
								setSettings({ ...settings, emailNotifications: checked })
							}
						/>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<Label>SMS Notifications</Label>
							<p className="text-muted-foreground text-xs">
								Send text alerts for new voicemails
							</p>
						</div>
						<Switch
							checked={settings.smsNotifications}
							onCheckedChange={(checked) =>
								setSettings({ ...settings, smsNotifications: checked })
							}
						/>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<Label>Voicemail Transcription</Label>
							<p className="text-muted-foreground text-xs">
								Automatically transcribe voicemails to text
							</p>
						</div>
						<Switch
							checked={settings.transcriptionEnabled}
							onCheckedChange={(checked) =>
								setSettings({ ...settings, transcriptionEnabled: checked })
							}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Storage & Retention</CardTitle>
					<CardDescription>
						Configure voicemail storage policies
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="retention">Retention Period</Label>
						<Select
							onValueChange={(value) =>
								setSettings({
									...settings,
									retentionDays: Number.parseInt(value, 10),
								})
							}
							value={settings.retentionDays.toString()}
						>
							<SelectTrigger className="mt-2" id="retention">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="30">30 days</SelectItem>
								<SelectItem value="60">60 days</SelectItem>
								<SelectItem value="90">90 days</SelectItem>
								<SelectItem value="180">180 days</SelectItem>
								<SelectItem value="365">1 year</SelectItem>
								<SelectItem value="-1">Forever</SelectItem>
							</SelectContent>
						</Select>
						<p className="mt-1 text-muted-foreground text-xs">
							Automatically delete voicemails after this period
						</p>
					</div>

					<div>
						<Label htmlFor="maxLength">Maximum Message Length</Label>
						<Select
							onValueChange={(value) =>
								setSettings({
									...settings,
									maxMessageLength: Number.parseInt(value, 10),
								})
							}
							value={settings.maxMessageLength.toString()}
						>
							<SelectTrigger className="mt-2" id="maxLength">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="60">1 minute</SelectItem>
								<SelectItem value="120">2 minutes</SelectItem>
								<SelectItem value="180">3 minutes</SelectItem>
								<SelectItem value="300">5 minutes</SelectItem>
							</SelectContent>
						</Select>
						<p className="mt-1 text-muted-foreground text-xs">
							Maximum length for voicemail recordings
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Button>
					<Save className="mr-2 size-4" />
					Save Voicemail Settings
				</Button>
			</div>
		</div>
	);
}
