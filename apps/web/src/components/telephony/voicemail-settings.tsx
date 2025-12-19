/**
 * Voicemail Settings
 *
 * Configure voicemail settings:
 * - Greeting upload (audio file or text-to-speech)
 * - Email notifications
 * - SMS notifications
 * - Transcription settings
 * - Voicemail box settings
 * - Greeting playback and testing
 */

"use client";

import {
	AlertCircle,
	CheckCircle2,
	Clock,
	FileAudio,
	Mail,
	MessageSquare,
	Pause,
	Play,
	Trash2,
	Upload,
	Voicemail,
	Volume2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { StandardFormField } from "@/components/ui/standard-form-field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Greeting configuration
type VoicemailGreeting = {
	type: "text-to-speech" | "audio-file" | "default";
	content?: string; // TTS text or audio file URL
	voice?: string; // TTS voice
	fileName?: string;
	fileSize?: number;
	duration?: number;
};

// Notification settings
type NotificationSettings = {
	emailEnabled: boolean;
	emailAddresses: string[];
	smsEnabled: boolean;
	smsNumbers: string[];
	transcriptionEnabled: boolean;
};

// Voicemail box settings
type VoicemailBoxSettings = {
	maxMessageLength: number; // seconds
	maxMessages: number;
	deleteAfterDays: number;
	requirePin: boolean;
	pin?: string;
};

// Available TTS voices
const ttsVoices = [
	{ value: "female-1", label: "Female - Professional" },
	{ value: "male-1", label: "Male - Professional" },
	{ value: "female-2", label: "Female - Friendly" },
	{ value: "male-2", label: "Male - Friendly" },
];

export function VoicemailSettings() {
	const { toast } = useToast();
	const [greeting, setGreeting] = useState<VoicemailGreeting>({
		type: "default",
	});

	const [notifications, setNotifications] = useState<NotificationSettings>({
		emailEnabled: true,
		emailAddresses: ["user@example.com"],
		smsEnabled: false,
		smsNumbers: [],
		transcriptionEnabled: true,
	});

	const [boxSettings, setBoxSettings] = useState<VoicemailBoxSettings>({
		maxMessageLength: 180, // 3 minutes
		maxMessages: 100,
		deleteAfterDays: 30,
		requirePin: false,
	});

	const [isPlaying, setIsPlaying] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle file upload
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		// Validate file type
		if (!file.type.startsWith("audio/")) {
			toast.error("Please upload an audio file (MP3, WAV, M4A)");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File size must be less than 5MB");
			return;
		}

		// Simulate upload progress
		setUploadProgress(0);
		const interval = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setGreeting({
						type: "audio-file",
						content: URL.createObjectURL(file),
						fileName: file.name,
						fileSize: file.size,
						duration: 0, // Would be calculated from audio metadata
					});
					return 100;
				}
				return prev + 10;
			});
		}, 100);
	};

	// Remove uploaded greeting
	const removeGreeting = () => {
		setGreeting({ type: "default" });
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// Toggle greeting playback
	const togglePlayback = () => {
		setIsPlaying(!isPlaying);
		// In real implementation, would use audio element
		setTimeout(() => setIsPlaying(false), 3000);
	};

	return (
		<div className="space-y-6">
			{/* Voicemail Greeting */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Voicemail className="size-5" />
						Voicemail Greeting
					</CardTitle>
					<CardDescription>
						Configure the greeting message that callers hear when they reach
						your voicemail
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Greeting Type Selection */}
					<StandardFormField label="Greeting Type" htmlFor="greetingType">
						<Select
							onValueChange={(value: VoicemailGreeting["type"]) =>
								setGreeting({ ...greeting, type: value })
							}
							value={greeting.type}
						>
							<SelectTrigger id="greetingType">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">
									<div className="flex items-center gap-2">
										<Volume2 className="size-4" />
										Default System Greeting
									</div>
								</SelectItem>
								<SelectItem value="text-to-speech">
									<div className="flex items-center gap-2">
										<MessageSquare className="size-4" />
										Text-to-Speech
									</div>
								</SelectItem>
								<SelectItem value="audio-file">
									<div className="flex items-center gap-2">
										<FileAudio className="size-4" />
										Upload Audio File
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					{/* Default Greeting Info */}
					{greeting.type === "default" && (
						<Alert>
							<AlertCircle className="size-4" />
							<AlertTitle>Default Greeting</AlertTitle>
							<AlertDescription>
								"You have reached the voicemail of [Your Business Name]. Please
								leave a message after the tone."
							</AlertDescription>
						</Alert>
					)}

					{/* Text-to-Speech Configuration */}
					{greeting.type === "text-to-speech" && (
						<div className="space-y-4">
							<StandardFormField
								label="Greeting Text"
								htmlFor="ttsText"
								description="Keep it concise (15-30 seconds when spoken)"
							>
								<Textarea
									id="ttsText"
									onChange={(e) =>
										setGreeting({ ...greeting, content: e.target.value })
									}
									placeholder="Enter your custom greeting message..."
									rows={4}
									value={greeting.content || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Voice" htmlFor="ttsVoice">
								<Select
									onValueChange={(value) =>
										setGreeting({ ...greeting, voice: value })
									}
									value={greeting.voice}
								>
									<SelectTrigger id="ttsVoice">
										<SelectValue placeholder="Select voice" />
									</SelectTrigger>
									<SelectContent>
										{ttsVoices.map((voice) => (
											<SelectItem key={voice.value} value={voice.value}>
												{voice.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</StandardFormField>

							{greeting.content && (
								<Button onClick={togglePlayback} variant="outline">
									{isPlaying ? (
										<>
											<Pause className="mr-2 size-4" />
											Pause Preview
										</>
									) : (
										<>
											<Play className="mr-2 size-4" />
											Preview Greeting
										</>
									)}
								</Button>
							)}
						</div>
					)}

					{/* Audio File Upload */}
					{greeting.type === "audio-file" && (
						<div className="space-y-4">
							{greeting.content ? (
								<Card className="border-success bg-success dark:border-success dark:bg-success/20">
									<CardContent className="pt-4">
										<div className="flex items-start justify-between">
											<div className="flex items-start gap-3">
												<FileAudio className="text-success dark:text-success size-5" />
												<div>
													<div className="font-medium">{greeting.fileName}</div>
													<div className="text-muted-foreground text-sm">
														{formatFileSize(greeting.fileSize || 0)}
														{greeting.duration && ` • ${greeting.duration}s`}
													</div>
													<div className="mt-2 flex items-center gap-2">
														<Button
															onClick={togglePlayback}
															size="sm"
															variant="outline"
														>
															{isPlaying ? (
																<>
																	<Pause className="mr-2 size-3" />
																	Pause
																</>
															) : (
																<>
																	<Play className="mr-2 size-3" />
																	Play
																</>
															)}
														</Button>
													</div>
												</div>
											</div>
											<Button
												onClick={removeGreeting}
												size="icon"
												variant="ghost"
											>
												<Trash2 className="size-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							) : (
								<div>
									<input
										accept="audio/*"
										className="hidden"
										onChange={handleFileUpload}
										ref={fileInputRef}
										type="file"
									/>
									<Button
										className="w-full"
										onClick={() => fileInputRef.current?.click()}
										variant="outline"
									>
										<Upload className="mr-2 size-4" />
										Upload Audio File
									</Button>
									<p className="text-muted-foreground mt-2 text-xs">
										Supported formats: MP3, WAV, M4A • Max file size: 5MB
									</p>

									{uploadProgress > 0 && uploadProgress < 100 && (
										<div className="mt-3">
											<div className="text-muted-foreground flex justify-between text-xs">
												<span>Uploading...</span>
												<span>{uploadProgress}%</span>
											</div>
											<div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
												<div
													className="bg-primary h-full transition-all duration-300"
													style={{ width: `${uploadProgress}%` }}
												/>
											</div>
										</div>
									)}
								</div>
							)}

							<Alert>
								<AlertCircle className="size-4" />
								<AlertTitle>Recording Tips</AlertTitle>
								<AlertDescription>
									<ul className="mt-2 space-y-1 text-sm">
										<li>• Record in a quiet environment</li>
										<li>• Speak clearly and at a moderate pace</li>
										<li>• Keep the greeting under 30 seconds</li>
										<li>• Include your business name and instructions</li>
									</ul>
								</AlertDescription>
							</Alert>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Notification Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Mail className="size-5" />
						Notifications
					</CardTitle>
					<CardDescription>
						Get notified when you receive new voicemail messages
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Email Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="emailNotifications">Email Notifications</Label>
								<p className="text-muted-foreground text-sm">
									Receive voicemail notifications via email
								</p>
							</div>
							<Switch
								checked={notifications.emailEnabled}
								id="emailNotifications"
								onCheckedChange={(checked) =>
									setNotifications({ ...notifications, emailEnabled: checked })
								}
							/>
						</div>

						{notifications.emailEnabled && (
							<StandardFormField
								label="Email Addresses"
								htmlFor="emailAddresses"
								description="Separate multiple addresses with commas"
							>
								<Input
									id="emailAddresses"
									onChange={(e) =>
										setNotifications({
											...notifications,
											emailAddresses: [e.target.value],
										})
									}
									placeholder="user@example.com"
									type="email"
									value={notifications.emailAddresses[0] || ""}
								/>
							</StandardFormField>
						)}
					</div>

					{/* SMS Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="smsNotifications">SMS Notifications</Label>
								<p className="text-muted-foreground text-sm">
									Receive voicemail notifications via text message
								</p>
							</div>
							<Switch
								checked={notifications.smsEnabled}
								id="smsNotifications"
								onCheckedChange={(checked) =>
									setNotifications({ ...notifications, smsEnabled: checked })
								}
							/>
						</div>

						{notifications.smsEnabled && (
							<StandardFormField label="Phone Number" htmlFor="smsNumbers">
								<Input
									id="smsNumbers"
									onChange={(e) =>
										setNotifications({
											...notifications,
											smsNumbers: [e.target.value],
										})
									}
									placeholder="+1 (555) 123-4567"
									type="tel"
									value={notifications.smsNumbers[0] || ""}
								/>
							</StandardFormField>
						)}
					</div>

					{/* Transcription */}
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="transcription">Voicemail Transcription</Label>
							<p className="text-muted-foreground text-sm">
								Automatically transcribe voicemail messages to text
							</p>
						</div>
						<Switch
							checked={notifications.transcriptionEnabled}
							id="transcription"
							onCheckedChange={(checked) =>
								setNotifications({
									...notifications,
									transcriptionEnabled: checked,
								})
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Voicemail Box Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="size-5" />
						Voicemail Box Settings
					</CardTitle>
					<CardDescription>
						Configure voicemail storage and security settings
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<StandardFormField label="Max Message Length" htmlFor="maxLength">
							<Select
								onValueChange={(value) =>
									setBoxSettings({
										...boxSettings,
										maxMessageLength: Number.parseInt(value, 10),
									})
								}
								value={boxSettings.maxMessageLength.toString()}
							>
								<SelectTrigger id="maxLength">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="60">1 minute</SelectItem>
									<SelectItem value="120">2 minutes</SelectItem>
									<SelectItem value="180">3 minutes</SelectItem>
									<SelectItem value="300">5 minutes</SelectItem>
								</SelectContent>
							</Select>
						</StandardFormField>

						<StandardFormField label="Max Messages" htmlFor="maxMessages">
							<Select
								onValueChange={(value) =>
									setBoxSettings({
										...boxSettings,
										maxMessages: Number.parseInt(value, 10),
									})
								}
								value={boxSettings.maxMessages.toString()}
							>
								<SelectTrigger id="maxMessages">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="50">50 messages</SelectItem>
									<SelectItem value="100">100 messages</SelectItem>
									<SelectItem value="200">200 messages</SelectItem>
									<SelectItem value="500">500 messages</SelectItem>
								</SelectContent>
							</Select>
						</StandardFormField>

						<StandardFormField label="Auto-Delete After" htmlFor="deleteAfter">
							<Select
								onValueChange={(value) =>
									setBoxSettings({
										...boxSettings,
										deleteAfterDays: Number.parseInt(value, 10),
									})
								}
								value={boxSettings.deleteAfterDays.toString()}
							>
								<SelectTrigger id="deleteAfter">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7">7 days</SelectItem>
									<SelectItem value="30">30 days</SelectItem>
									<SelectItem value="60">60 days</SelectItem>
									<SelectItem value="90">90 days</SelectItem>
									<SelectItem value="0">Never</SelectItem>
								</SelectContent>
							</Select>
						</StandardFormField>
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="requirePin">Require PIN for Access</Label>
							<p className="text-muted-foreground text-sm">
								Protect voicemail access with a PIN code
							</p>
						</div>
						<Switch
							checked={boxSettings.requirePin}
							id="requirePin"
							onCheckedChange={(checked) =>
								setBoxSettings({ ...boxSettings, requirePin: checked })
							}
						/>
					</div>

					{boxSettings.requirePin && (
						<StandardFormField label="PIN Code" htmlFor="pin">
							<Input
								id="pin"
								maxLength={6}
								onChange={(e) =>
									setBoxSettings({ ...boxSettings, pin: e.target.value })
								}
								placeholder="Enter 4-6 digit PIN"
								type="password"
								value={boxSettings.pin || ""}
							/>
						</StandardFormField>
					)}
				</CardContent>
			</Card>

			{/* Save Button */}
			<div className="flex justify-end gap-3">
				<Button variant="outline">Cancel</Button>
				<Button>
					<CheckCircle2 className="mr-2 size-4" />
					Save Voicemail Settings
				</Button>
			</div>
		</div>
	);
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
	if (bytes === 0) {
		return "0 Bytes";
	}
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}
