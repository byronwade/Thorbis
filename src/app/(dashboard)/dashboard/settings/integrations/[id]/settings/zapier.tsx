"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function ZapierSettings() {
	const [isSaving, setIsSaving] = useState(false);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Zapier Connection</CardTitle>
					<CardDescription>Configure Zapier integration for workflow automation</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="api-key">API Key</Label>
						<Input defaultValue="zap_live_••••••••••••••••••••" id="api-key" type="password" />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Enable Webhooks</Label>
							<p className="text-muted-foreground text-sm">Allow Zapier to trigger actions via webhooks</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Real-time Updates</Label>
							<p className="text-muted-foreground text-sm">Send updates to Zapier in real-time</p>
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
