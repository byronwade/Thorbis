/**
 * Google Calendar Settings Component
 *
 * Manages Google Calendar integration for technicians
 * - OAuth connection flow
 * - Calendar selection
 * - Sync preferences
 * - Manual sync trigger
 */

"use client";

import {
	AlertCircle,
	Calendar,
	Check,
	CheckCircle2,
	Clock,
	ExternalLink,
	Loader2,
	RefreshCw,
	Unlink,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type CalendarInfo = {
	id: string;
	name: string;
	primary?: boolean;
	accessRole?: string;
};

type SyncedEvent = {
	id: string;
	title: string;
	start: string;
	end: string;
	appointmentId?: string;
	jobNumber?: string;
};

type SyncStatus = {
	connected: boolean;
	calendarId?: string;
	events?: SyncedEvent[];
	totalEvents?: number;
	message?: string;
};

interface GoogleCalendarSettingsProps {
	className?: string;
	onConnectionChange?: (connected: boolean) => void;
}

export function GoogleCalendarSettings({
	className,
	onConnectionChange,
}: GoogleCalendarSettingsProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
	const [calendars, setCalendars] = useState<CalendarInfo[]>([]);
	const [selectedCalendar, setSelectedCalendar] = useState<string>("primary");
	const [autoSync, setAutoSync] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

	// Fetch current status
	const fetchStatus = useCallback(async () => {
		try {
			const response = await fetch("/api/calendar/sync");
			if (!response.ok) {
				throw new Error("Failed to fetch status");
			}
			const data: SyncStatus = await response.json();
			setSyncStatus(data);
			if (data.calendarId) {
				setSelectedCalendar(data.calendarId);
			}
			setError(null);
		} catch (err) {
			console.error("Status fetch error:", err);
			setError("Failed to load calendar status");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	// Handle OAuth callback
	useEffect(() => {
		const handleCallback = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");
			const state = urlParams.get("state");

			if (code) {
				setIsConnecting(true);
				try {
					const response = await fetch("/api/calendar/auth", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ code, state }),
					});

					if (!response.ok) {
						throw new Error("Failed to connect calendar");
					}

					const data = await response.json();
					if (data.calendars) {
						setCalendars(data.calendars);
					}

					// Clear URL params
					window.history.replaceState(
						{},
						document.title,
						window.location.pathname,
					);

					// Refresh status
					await fetchStatus();
					onConnectionChange?.(true);
				} catch (err) {
					console.error("OAuth callback error:", err);
					setError("Failed to connect Google Calendar");
				} finally {
					setIsConnecting(false);
				}
			}
		};

		handleCallback();
	}, [fetchStatus, onConnectionChange]);

	// Connect to Google Calendar
	const handleConnect = async () => {
		setIsConnecting(true);
		setError(null);

		try {
			const response = await fetch("/api/calendar/auth");
			if (!response.ok) {
				throw new Error("Failed to get authorization URL");
			}

			const data = await response.json();
			if (data.authUrl) {
				// Redirect to Google OAuth
				window.location.href = data.authUrl;
			}
		} catch (err) {
			console.error("Connect error:", err);
			setError("Failed to initiate connection");
			setIsConnecting(false);
		}
	};

	// Disconnect calendar
	const handleDisconnect = async () => {
		try {
			const response = await fetch("/api/calendar/auth", {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to disconnect");
			}

			setSyncStatus({ connected: false });
			setCalendars([]);
			onConnectionChange?.(false);
		} catch (err) {
			console.error("Disconnect error:", err);
			setError("Failed to disconnect calendar");
		}
	};

	// Manual sync
	const handleSync = async () => {
		setIsSyncing(true);
		setError(null);

		try {
			// In a real implementation, this would fetch appointments and sync them
			const response = await fetch("/api/calendar/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					appointments: [], // Would be populated from appointments
				}),
			});

			if (!response.ok) {
				throw new Error("Sync failed");
			}

			const result = await response.json();
			setLastSyncTime(new Date());

			// Refresh status
			await fetchStatus();
		} catch (err) {
			console.error("Sync error:", err);
			setError("Failed to sync appointments");
		} finally {
			setIsSyncing(false);
		}
	};

	if (isLoading) {
		return (
			<Card className={className}>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					Google Calendar Integration
				</CardTitle>
				<CardDescription>
					Sync your appointments to Google Calendar for easy access on any
					device
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Connection Status */}
				<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
					<div className="flex items-center gap-3">
						{syncStatus?.connected ? (
							<>
								<div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
									<CheckCircle2 className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<p className="font-medium">Connected</p>
									<p className="text-sm text-muted-foreground">
										{syncStatus.totalEvents || 0} events synced
									</p>
								</div>
							</>
						) : (
							<>
								<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
									<Calendar className="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<p className="font-medium">Not Connected</p>
									<p className="text-sm text-muted-foreground">
										Connect to sync appointments
									</p>
								</div>
							</>
						)}
					</div>

					{syncStatus?.connected ? (
						<Button variant="outline" size="sm" onClick={handleDisconnect}>
							<Unlink className="h-4 w-4 mr-2" />
							Disconnect
						</Button>
					) : (
						<Button onClick={handleConnect} disabled={isConnecting}>
							{isConnecting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Connecting...
								</>
							) : (
								<>
									<ExternalLink className="h-4 w-4 mr-2" />
									Connect Google Calendar
								</>
							)}
						</Button>
					)}
				</div>

				{/* Error Alert */}
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Settings (when connected) */}
				{syncStatus?.connected && (
					<>
						{/* Calendar Selection */}
						{calendars.length > 0 && (
							<div className="space-y-2">
								<Label htmlFor="calendar-select">Sync to Calendar</Label>
								<Select
									value={selectedCalendar}
									onValueChange={setSelectedCalendar}
								>
									<SelectTrigger id="calendar-select">
										<SelectValue placeholder="Select calendar" />
									</SelectTrigger>
									<SelectContent>
										{calendars.map((cal) => (
											<SelectItem key={cal.id} value={cal.id}>
												<div className="flex items-center gap-2">
													{cal.name}
													{cal.primary && (
														<Badge variant="secondary" className="text-xs">
															Primary
														</Badge>
													)}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{/* Auto Sync Toggle */}
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="auto-sync">Automatic Sync</Label>
								<p className="text-sm text-muted-foreground">
									Automatically sync new appointments to calendar
								</p>
							</div>
							<Switch
								id="auto-sync"
								checked={autoSync}
								onCheckedChange={setAutoSync}
							/>
						</div>

						{/* Manual Sync */}
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div className="flex items-center gap-3">
								<Clock className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">Last Synced</p>
									<p className="text-sm text-muted-foreground">
										{lastSyncTime
											? lastSyncTime.toLocaleString()
											: "Never synced"}
									</p>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleSync}
								disabled={isSyncing}
							>
								{isSyncing ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Syncing...
									</>
								) : (
									<>
										<RefreshCw className="h-4 w-4 mr-2" />
										Sync Now
									</>
								)}
							</Button>
						</div>

						{/* Synced Events Preview */}
						{syncStatus.events && syncStatus.events.length > 0 && (
							<div className="space-y-2">
								<Label>Recent Synced Events</Label>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{syncStatus.events.slice(0, 5).map((event) => (
										<div
											key={event.id}
											className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
										>
											<div>
												<p className="text-sm font-medium">{event.title}</p>
												<p className="text-xs text-muted-foreground">
													{new Date(event.start).toLocaleDateString()}{" "}
													{event.jobNumber && `• Job #${event.jobNumber}`}
												</p>
											</div>
											<Check className="h-4 w-4 text-green-600" />
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}

				{/* Info when not connected */}
				{!syncStatus?.connected && (
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-4 border rounded-lg">
								<Calendar className="h-6 w-6 text-primary mb-2" />
								<h4 className="font-medium text-sm">View Appointments</h4>
								<p className="text-xs text-muted-foreground">
									See your schedule in Google Calendar alongside personal events
								</p>
							</div>
							<div className="p-4 border rounded-lg">
								<RefreshCw className="h-6 w-6 text-primary mb-2" />
								<h4 className="font-medium text-sm">Auto Sync</h4>
								<p className="text-xs text-muted-foreground">
									Changes automatically update in both directions
								</p>
							</div>
							<div className="p-4 border rounded-lg">
								<Clock className="h-6 w-6 text-primary mb-2" />
								<h4 className="font-medium text-sm">Reminders</h4>
								<p className="text-xs text-muted-foreground">
									Get Google Calendar notifications before appointments
								</p>
							</div>
						</div>

						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Privacy Note</AlertTitle>
							<AlertDescription>
								Only appointments you're assigned to will be synced to your
								calendar. Customer contact information is included for your
								convenience.
							</AlertDescription>
						</Alert>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
