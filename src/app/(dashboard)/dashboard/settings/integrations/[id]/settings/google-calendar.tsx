"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function GoogleCalendarSettings() {
	const [isSaving, setIsSaving] = useState(false);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Calendar Sync</CardTitle>
					<CardDescription>Sync appointments and events with Google Calendar</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Two-way Sync</Label>
							<p className="text-muted-foreground text-sm">Sync events both ways</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Include Job Details</Label>
							<p className="text-muted-foreground text-sm">Add job information to calendar events</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Event Reminders</Label>
							<p className="text-muted-foreground text-sm">Send reminders for upcoming jobs</p>
						</div>
						<Switch defaultChecked />
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Button disabled={isSaving} onClick={() => setIsSaving(true)}>
					<Save className="mr-2 size-4" />
					{isSaving ? "Saving..." : "Save Settings"}
				</Button>
			</div>
		</div>
	);
}
