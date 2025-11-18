"use client";

import { DollarSign, FileText, Save, Users } from "lucide-react";
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

const SAVE_TIMEOUT_MS = 1000;

export function QuickBooksSettings() {
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
		}, SAVE_TIMEOUT_MS);
	};

	return (
		<div className="space-y-6">
			{/* Sync Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="size-5" />
						Sync Settings
					</CardTitle>
					<CardDescription>
						Configure what data syncs between Thorbis and QuickBooks Online
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Sync Invoices</Label>
							<p className="text-muted-foreground text-sm">
								Automatically sync invoices to QuickBooks
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Sync Payments</Label>
							<p className="text-muted-foreground text-sm">
								Sync payment records and transactions
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Sync Customers</Label>
							<p className="text-muted-foreground text-sm">
								Keep customer information synchronized
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Sync Expenses</Label>
							<p className="text-muted-foreground text-sm">
								Sync business expenses and bills
							</p>
						</div>
						<Switch />
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="sync-frequency">Sync Frequency</Label>
						<Select defaultValue="hourly">
							<SelectTrigger id="sync-frequency">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="realtime">Real-time</SelectItem>
								<SelectItem value="15min">Every 15 minutes</SelectItem>
								<SelectItem value="hourly">Every hour</SelectItem>
								<SelectItem value="daily">Daily</SelectItem>
								<SelectItem value="manual">Manual only</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Account Mapping */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<DollarSign className="size-5" />
						Account Mapping
					</CardTitle>
					<CardDescription>
						Map Thorbis accounts to QuickBooks accounts
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="income-account">Income Account</Label>
						<Select defaultValue="sales">
							<SelectTrigger id="income-account">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sales">Sales Income</SelectItem>
								<SelectItem value="service">Service Revenue</SelectItem>
								<SelectItem value="other">Other Income</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="expense-account">Expense Account</Label>
						<Select defaultValue="cogs">
							<SelectTrigger id="expense-account">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cogs">Cost of Goods Sold</SelectItem>
								<SelectItem value="operating">Operating Expenses</SelectItem>
								<SelectItem value="admin">Administrative</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="payment-account">Payment Account</Label>
						<Select defaultValue="checking">
							<SelectTrigger id="payment-account">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="checking">Business Checking</SelectItem>
								<SelectItem value="savings">Business Savings</SelectItem>
								<SelectItem value="merchant">Merchant Account</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Customer Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="size-5" />
						Customer Settings
					</CardTitle>
					<CardDescription>
						Configure how customers are managed in QuickBooks
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Auto-create Customers</Label>
							<p className="text-muted-foreground text-sm">
								Automatically create new customers in QuickBooks
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Update Customer Details</Label>
							<p className="text-muted-foreground text-sm">
								Update existing customer information when changed
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="customer-type">Default Customer Type</Label>
						<Select defaultValue="commercial">
							<SelectTrigger id="customer-type">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="residential">Residential</SelectItem>
								<SelectItem value="commercial">Commercial</SelectItem>
								<SelectItem value="both">Both</SelectItem>
							</SelectContent>
						</Select>
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
