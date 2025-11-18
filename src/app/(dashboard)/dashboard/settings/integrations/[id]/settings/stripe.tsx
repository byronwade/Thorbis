"use client";

import { Bell, CreditCard, Save, Shield } from "lucide-react";
import { useState } from "react";
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

const SAVE_TIMEOUT_MS = 1000;

export function StripeSettings() {
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
		}, SAVE_TIMEOUT_MS);
	};

	return (
		<div className="space-y-6">
			{/* Payment Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="size-5" />
						Payment Settings
					</CardTitle>
					<CardDescription>
						Configure payment processing options
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Accept Credit Cards</Label>
							<p className="text-muted-foreground text-sm">
								Enable credit card payments
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Accept ACH/Bank Transfers</Label>
							<p className="text-muted-foreground text-sm">
								Enable direct bank transfers
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Save Payment Methods</Label>
							<p className="text-muted-foreground text-sm">
								Save customer payment methods for future use
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="currency">Default Currency</Label>
						<Select defaultValue="usd">
							<SelectTrigger id="currency">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="usd">USD - US Dollar</SelectItem>
								<SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
								<SelectItem value="eur">EUR - Euro</SelectItem>
								<SelectItem value="gbp">GBP - British Pound</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Security Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="size-5" />
						Security & Fraud Prevention
					</CardTitle>
					<CardDescription>
						Configure security and fraud prevention settings
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Require CVC</Label>
							<p className="text-muted-foreground text-sm">
								Require card verification code for all transactions
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Stripe Radar</Label>
							<p className="text-muted-foreground text-sm">
								Use Stripe's machine learning fraud detection
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>3D Secure</Label>
							<p className="text-muted-foreground text-sm">
								Require 3D Secure authentication for eligible cards
							</p>
						</div>
						<Switch />
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="risk-level">Risk Tolerance</Label>
						<Select defaultValue="normal">
							<SelectTrigger id="risk-level">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">
									Low - Block suspicious payments
								</SelectItem>
								<SelectItem value="normal">
									Normal - Review suspicious
								</SelectItem>
								<SelectItem value="high">High - Allow most payments</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Notification Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="size-5" />
						Notifications
					</CardTitle>
					<CardDescription>
						Configure payment notifications and receipts
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Send Email Receipts</Label>
							<p className="text-muted-foreground text-sm">
								Automatically send receipts to customers
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Failed Payment Notifications</Label>
							<p className="text-muted-foreground text-sm">
								Notify when payments fail
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Dispute Notifications</Label>
							<p className="text-muted-foreground text-sm">
								Get notified about chargebacks and disputes
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="receipt-email">Receipt Email Address</Label>
						<Input
							defaultValue="receipts@thorbis.com"
							id="receipt-email"
							placeholder="email@example.com"
							type="email"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Webhook Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Webhook Configuration</CardTitle>
					<CardDescription>
						Stripe webhook endpoint for real-time events
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="webhook-url">Webhook URL</Label>
						<Input
							defaultValue="https://api.thorbis.com/webhooks/stripe"
							disabled
							id="webhook-url"
							type="url"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="webhook-secret">Webhook Signing Secret</Label>
						<Input
							defaultValue="whsec_••••••••••••••••••••"
							id="webhook-secret"
							type="password"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Save Button */}
			<div className="flex justify-end">
				<Button disabled={isSaving} onClick={handleSave}>
					<Save className="mr-2 size-4" />
					{isSaving ? "Saving..." : "Save Settings"}
				</Button>
			</div>
		</div>
	);
}
