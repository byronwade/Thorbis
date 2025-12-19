"use client";

/**
 * Notification Preferences Dialog - Report Alerts
 *
 * Configure alert thresholds and notification preferences
 * for specific reports and metrics.
 */

import {
	AlertTriangle,
	Bell,
	BellRing,
	Check,
	Loader2,
	Mail,
	Plus,
	Smartphone,
	Trash2,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { saveNotificationPreferences, getNotificationPreferences } from "@/actions/report-schedules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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

interface NotificationPreferencesDialogProps {
	reportTitle: string;
	reportType: string;
	trigger?: React.ReactNode;
	onSaved?: (preferences: NotificationPreferences) => void;
}

interface AlertCondition {
	id: string;
	metric: string;
	operator: "above" | "below" | "equals" | "change";
	value: number;
	isActive: boolean;
}

interface NotificationPreferences {
	alerts: AlertCondition[];
	channels: {
		inApp: boolean;
		email: boolean;
		sms: boolean;
	};
	quietHours: {
		enabled: boolean;
		start: string;
		end: string;
	};
}

const AVAILABLE_METRICS = [
	{ id: "revenue", label: "Revenue" },
	{ id: "jobs_completed", label: "Jobs Completed" },
	{ id: "conversion_rate", label: "Conversion Rate" },
	{ id: "customer_count", label: "Customer Count" },
	{ id: "avg_ticket", label: "Average Ticket" },
	{ id: "utilization", label: "Team Utilization" },
];

const OPERATORS = [
	{ id: "above", label: "Goes above", icon: TrendingUp },
	{ id: "below", label: "Falls below", icon: TrendingDown },
	{ id: "change", label: "Changes by", icon: AlertTriangle },
];

export function NotificationPreferencesDialog({
	reportTitle,
	reportType,
	trigger,
	onSaved,
}: NotificationPreferencesDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Notification channels
	const [inAppEnabled, setInAppEnabled] = useState(true);
	const [emailEnabled, setEmailEnabled] = useState(true);
	const [smsEnabled, setSmsEnabled] = useState(false);

	// Quiet hours
	const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
	const [quietStart, setQuietStart] = useState("22:00");
	const [quietEnd, setQuietEnd] = useState("08:00");

	// Alert conditions
	const [alerts, setAlerts] = useState<AlertCondition[]>([
		{
			id: "1",
			metric: "revenue",
			operator: "below",
			value: 1000,
			isActive: true,
		},
	]);

	const addAlert = () => {
		const newAlert: AlertCondition = {
			id: Date.now().toString(),
			metric: "revenue",
			operator: "below",
			value: 0,
			isActive: true,
		};
		setAlerts([...alerts, newAlert]);
	};

	const updateAlert = (id: string, updates: Partial<AlertCondition>) => {
		setAlerts(alerts.map((a) => (a.id === id ? { ...a, ...updates } : a)));
	};

	const removeAlert = (id: string) => {
		setAlerts(alerts.filter((a) => a.id !== id));
	};

	// Load existing preferences when dialog opens
	useEffect(() => {
		if (open) {
			loadPreferences();
		}
	}, [open, reportType]);

	const loadPreferences = async () => {
		const result = await getNotificationPreferences(reportType);
		if (result.success && result.data) {
			setAlerts(result.data.alerts);
			setInAppEnabled(result.data.channels.inApp);
			setEmailEnabled(result.data.channels.email);
			setSmsEnabled(result.data.channels.sms);
			setQuietHoursEnabled(result.data.quietHours.enabled);
			setQuietStart(result.data.quietHours.start);
			setQuietEnd(result.data.quietHours.end);
		}
	};

	const handleSave = async () => {
		setIsSaving(true);

		try {
			const preferences: NotificationPreferences = {
				alerts,
				channels: {
					inApp: inAppEnabled,
					email: emailEnabled,
					sms: smsEnabled,
				},
				quietHours: {
					enabled: quietHoursEnabled,
					start: quietStart,
					end: quietEnd,
				},
			};

			// Save to database
			const result = await saveNotificationPreferences({
				reportType,
				reportTitle,
				...preferences,
			});

			if (!result.success) {
				throw new Error(result.error || "Failed to save preferences");
			}

			onSaved?.(preferences);
			toast.success("Notification preferences saved");
			setOpen(false);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save preferences");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						<Bell className="mr-2 h-4 w-4" />
						Notifications
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<BellRing className="h-5 w-5" />
						Notification Preferences
					</DialogTitle>
					<DialogDescription>
						Get alerts when "{reportTitle}" metrics hit certain thresholds
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Left Column: Alert Conditions */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<Label className="text-base font-semibold">
										Alert Conditions
									</Label>
									<p className="text-sm text-muted-foreground">
										Get notified when metrics hit thresholds
									</p>
								</div>
								<Button variant="outline" size="sm" onClick={addAlert}>
									<Plus className="mr-1 h-3 w-3" />
									Add Alert
								</Button>
							</div>

							<div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
								{alerts.map((alert) => (
									<div
										key={alert.id}
										className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3"
									>
										<Switch
											checked={alert.isActive}
											onCheckedChange={(checked) =>
												updateAlert(alert.id, { isActive: checked })
											}
										/>

										<span className="text-sm text-muted-foreground">When</span>

										<Select
											value={alert.metric}
											onValueChange={(v) =>
												updateAlert(alert.id, { metric: v })
											}
										>
											<SelectTrigger className="w-[140px] h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{AVAILABLE_METRICS.map((m) => (
													<SelectItem key={m.id} value={m.id}>
														{m.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Select
											value={alert.operator}
											onValueChange={(v) =>
												updateAlert(alert.id, { operator: v as any })
											}
										>
											<SelectTrigger className="w-[130px] h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{OPERATORS.map((op) => (
													<SelectItem key={op.id} value={op.id}>
														<div className="flex items-center gap-2">
															<op.icon className="h-3 w-3" />
															{op.label}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Input
											type="number"
											value={alert.value}
											onChange={(e) =>
												updateAlert(alert.id, {
													value: parseFloat(e.target.value) || 0,
												})
											}
											className="w-[100px] h-8"
										/>

										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-muted-foreground hover:text-destructive ml-auto"
											onClick={() => removeAlert(alert.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								))}

								{alerts.length === 0 && (
									<div className="rounded-lg border border-dashed p-8 text-center">
										<AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
										<p className="text-sm font-medium">No alerts configured</p>
										<p className="text-xs text-muted-foreground mt-1">
											Click "Add Alert" to create your first alert condition
										</p>
									</div>
								)}
							</div>

							{/* Example Alerts */}
							<div className="rounded-lg bg-muted/50 p-3">
								<p className="text-xs font-medium mb-2">Example alerts:</p>
								<ul className="text-xs text-muted-foreground space-y-1">
									<li>• Revenue falls below $10,000</li>
									<li>• Jobs completed goes above 50</li>
									<li>• Conversion rate changes by 10%</li>
								</ul>
							</div>
						</div>

						{/* Right Column: Channels & Settings */}
						<div className="space-y-6">
							{/* Notification Channels */}
							<div className="space-y-3">
								<div>
									<Label className="text-base font-semibold">
										Notification Channels
									</Label>
									<p className="text-sm text-muted-foreground">
										Choose how you want to be notified
									</p>
								</div>
								<div className="space-y-2 rounded-lg border p-4">
									<div className="flex items-center justify-between py-2">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
												<Bell className="h-5 w-5 text-blue-500" />
											</div>
											<div>
												<Label className="font-medium">
													In-App Notifications
												</Label>
												<p className="text-xs text-muted-foreground">
													Show in notification center
												</p>
											</div>
										</div>
										<Switch
											checked={inAppEnabled}
											onCheckedChange={setInAppEnabled}
										/>
									</div>

									<div className="flex items-center justify-between py-2 border-t">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
												<Mail className="h-5 w-5 text-green-500" />
											</div>
											<div>
												<Label className="font-medium">Email Alerts</Label>
												<p className="text-xs text-muted-foreground">
													Send to your registered email
												</p>
											</div>
										</div>
										<Switch
											checked={emailEnabled}
											onCheckedChange={setEmailEnabled}
										/>
									</div>

									<div className="flex items-center justify-between py-2 border-t">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
												<Smartphone className="h-5 w-5 text-purple-500" />
											</div>
											<div>
												<Label className="font-medium">SMS Alerts</Label>
												<p className="text-xs text-muted-foreground">
													Text message for urgent alerts
												</p>
											</div>
										</div>
										<Switch
											checked={smsEnabled}
											onCheckedChange={setSmsEnabled}
										/>
									</div>
								</div>
							</div>

							{/* Quiet Hours */}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div>
										<Label className="text-base font-semibold">
											Quiet Hours
										</Label>
										<p className="text-sm text-muted-foreground">
											Pause notifications during specific times
										</p>
									</div>
									<Switch
										checked={quietHoursEnabled}
										onCheckedChange={setQuietHoursEnabled}
									/>
								</div>

								{quietHoursEnabled && (
									<div className="rounded-lg border p-4">
										<div className="flex items-center gap-4">
											<div className="flex-1 space-y-2">
												<Label className="text-xs text-muted-foreground">
													Start Time
												</Label>
												<Select
													value={quietStart}
													onValueChange={setQuietStart}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{Array.from({ length: 24 }, (_, i) => {
															const hour = i.toString().padStart(2, "0");
															return (
																<SelectItem key={hour} value={`${hour}:00`}>
																	{hour}:00
																</SelectItem>
															);
														})}
													</SelectContent>
												</Select>
											</div>
											<div className="pt-6">
												<span className="text-muted-foreground">→</span>
											</div>
											<div className="flex-1 space-y-2">
												<Label className="text-xs text-muted-foreground">
													End Time
												</Label>
												<Select value={quietEnd} onValueChange={setQuietEnd}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{Array.from({ length: 24 }, (_, i) => {
															const hour = i.toString().padStart(2, "0");
															return (
																<SelectItem key={hour} value={`${hour}:00`}>
																	{hour}:00
																</SelectItem>
															);
														})}
													</SelectContent>
												</Select>
											</div>
										</div>
										<p className="text-xs text-muted-foreground mt-3">
											Notifications will be queued and delivered when quiet
											hours end
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Check className="mr-2 h-4 w-4" />
								Save Preferences
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
