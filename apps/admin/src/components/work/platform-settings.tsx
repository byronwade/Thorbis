"use client";

import { useState } from "react";
import { Settings, ToggleLeft, ToggleRight, AlertCircle, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@stratos/ui/switch";

type PlatformSettingsProps = {
	maintenanceMode: {
		enabled: boolean;
		message: string;
	};
};

/**
 * Platform Settings Component
 *
 * Manages platform settings including maintenance mode and feature flags.
 */
export function PlatformSettings({ maintenanceMode: initialMaintenanceMode }: PlatformSettingsProps) {
	const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
	const [saving, setSaving] = useState(false);

	const handleToggleMaintenance = async (enabled: boolean) => {
		setSaving(true);
		try {
			const response = await fetch("/api/admin/platform/maintenance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ enabled, message: maintenanceMode.message }),
			});

			if (response.ok) {
				setMaintenanceMode({ ...maintenanceMode, enabled });
			}
		} catch (error) {
			console.error("Failed to update maintenance mode:", error);
		} finally {
			setSaving(false);
		}
	};

	const handleSaveMessage = async () => {
		setSaving(true);
		try {
			const response = await fetch("/api/admin/platform/maintenance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					enabled: maintenanceMode.enabled,
					message: maintenanceMode.message,
				}),
			});

			if (response.ok) {
				// Success feedback could be shown here
			}
		} catch (error) {
			console.error("Failed to save maintenance message:", error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Maintenance Mode */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Settings className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Maintenance Mode</CardTitle>
						</div>
						<Switch
							checked={maintenanceMode.enabled}
							onCheckedChange={handleToggleMaintenance}
							disabled={saving}
						/>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{maintenanceMode.enabled && (
						<div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
							<div className="flex items-start gap-2">
								<AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
								<div className="flex-1">
									<p className="text-sm font-medium text-orange-900 dark:text-orange-100">
										Maintenance mode is currently enabled
									</p>
									<p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
										Users will see the maintenance message when accessing the platform.
									</p>
								</div>
							</div>
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="maintenance-message">Maintenance Message</Label>
						<Textarea
							id="maintenance-message"
							value={maintenanceMode.message}
							onChange={(e) => setMaintenanceMode({ ...maintenanceMode, message: e.target.value })}
							placeholder="Enter maintenance message..."
							rows={3}
						/>
						<Button onClick={handleSaveMessage} disabled={saving} size="sm">
							<Save className="h-4 w-4 mr-2" />
							Save Message
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Feature Flags Placeholder */}
			<Card>
				<CardHeader>
					<CardTitle>Feature Flags</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<Settings className="h-12 w-12 mx-auto mb-2 opacity-20" />
						<p>Feature flags management coming soon</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

