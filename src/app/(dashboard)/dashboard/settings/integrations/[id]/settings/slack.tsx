"use client";

import { Save } from "lucide-react";
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

export function SlackSettings() {
	const [isSaving, setIsSaving] = useState(false);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Channel Notifications</CardTitle>
					<CardDescription>
						Choose which events to send to Slack
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>New Customers</Label>
							<p className="text-muted-foreground text-sm">
								Notify when new customers sign up
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Job Completion</Label>
							<p className="text-muted-foreground text-sm">
								Notify when jobs are completed
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="channel">Default Channel</Label>
						<Select defaultValue="general">
							<SelectTrigger id="channel">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="general">#general</SelectItem>
								<SelectItem value="operations">#operations</SelectItem>
								<SelectItem value="sales">#sales</SelectItem>
							</SelectContent>
						</Select>
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
