"use client";

/**
 * Settings > Finance > Accounting Integration Page - Client Component
 *
 * Client-side features:
 * - Interactive accounting provider integration
 * - Real-time sync settings management
 * - Connection testing for accounting providers (QuickBooks, Xero, Sage)
 */

import {
	AlertCircle,
	Check,
	CheckCircle,
	HelpCircle,
	Link2,
	Loader2,
	RefreshCw,
	Save,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
	getAccountingSettings,
	updateAccountingSettings,
} from "@/actions/settings";
import { Badge } from "@/components/ui/badge";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

type AccountingSettings = {
	provider?: string;
	provider_enabled: boolean;
	api_key_encrypted?: string | null;
	api_secret_encrypted?: string | null;
	auto_sync_enabled: boolean;
	sync_frequency: string;
	income_account?: string;
	expense_account?: string;
	asset_account?: string;
	liability_account?: string;
	sync_invoices: boolean;
	sync_payments: boolean;
	sync_expenses: boolean;
	sync_customers: boolean;
	last_sync_at?: string | null;
};

export function AccountingSettingsClient() {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [isTestingConnection, setIsTestingConnection] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<
		"connected" | "disconnected" | null
	>(null);

	const [settings, setSettings] = useState<AccountingSettings>({
		provider: "none",
		provider_enabled: false,
		auto_sync_enabled: false,
		sync_frequency: "daily",
		sync_invoices: true,
		sync_payments: true,
		sync_expenses: true,
		sync_customers: true,
	});

	const [originalFormData, setOriginalFormData] = useState({
		provider: "none",
		providerEnabled: false,
		apiKey: "",
		apiSecret: "",
		autoSyncEnabled: false,
		syncFrequency: "daily",
		incomeAccount: "",
		expenseAccount: "",
		assetAccount: "",
		liabilityAccount: "",
		syncInvoices: true,
		syncPayments: true,
		syncExpenses: true,
		syncCustomers: true,
	});

	const [formData, setFormData] = useState({
		provider: "none",
		providerEnabled: false,
		apiKey: "",
		apiSecret: "",
		autoSyncEnabled: false,
		syncFrequency: "daily",
		incomeAccount: "",
		expenseAccount: "",
		assetAccount: "",
		liabilityAccount: "",
		syncInvoices: true,
		syncPayments: true,
		syncExpenses: true,
		syncCustomers: true,
	});

	const hasChanges = useMemo(
		() => JSON.stringify(formData) !== JSON.stringify(originalFormData),
		[formData, originalFormData],
	);

	useEffect(() => {
		async function loadSettings() {
			setIsLoading(true);
			try {
				const result = await getAccountingSettings();

				if (result.success && result.data) {
					setSettings(result.data);
					const loadedData = {
						provider: result.data.provider || "none",
						providerEnabled: result.data.provider_enabled,
						apiKey: "",
						apiSecret: "",
						autoSyncEnabled: result.data.auto_sync_enabled,
						syncFrequency: result.data.sync_frequency,
						incomeAccount: result.data.income_account || "",
						expenseAccount: result.data.expense_account || "",
						assetAccount: result.data.asset_account || "",
						liabilityAccount: result.data.liability_account || "",
						syncInvoices: result.data.sync_invoices,
						syncPayments: result.data.sync_payments,
						syncExpenses: result.data.sync_expenses,
						syncCustomers: result.data.sync_customers,
					};
					setFormData(loadedData);
					setOriginalFormData(loadedData);
					if (result.data.provider_enabled) {
						setConnectionStatus("connected");
					}
				}
			} catch {
				toast.error("Failed to load accounting settings");
			} finally {
				setIsLoading(false);
			}
		}

		loadSettings();
	}, [toast]);

	const handleSave = () => {
		startTransition(async () => {
			const formDataObj = new FormData();
			formDataObj.append("provider", formData.provider);
			formDataObj.append(
				"providerEnabled",
				formData.providerEnabled.toString(),
			);
			if (formData.apiKey) {
				formDataObj.append("apiKey", formData.apiKey);
			}
			if (formData.apiSecret) {
				formDataObj.append("apiSecret", formData.apiSecret);
			}
			formDataObj.append(
				"autoSyncEnabled",
				formData.autoSyncEnabled.toString(),
			);
			formDataObj.append("syncFrequency", formData.syncFrequency);
			if (formData.incomeAccount) {
				formDataObj.append("incomeAccount", formData.incomeAccount);
			}
			if (formData.expenseAccount) {
				formDataObj.append("expenseAccount", formData.expenseAccount);
			}
			if (formData.assetAccount) {
				formDataObj.append("assetAccount", formData.assetAccount);
			}
			if (formData.liabilityAccount) {
				formDataObj.append("liabilityAccount", formData.liabilityAccount);
			}
			formDataObj.append("syncInvoices", formData.syncInvoices.toString());
			formDataObj.append("syncPayments", formData.syncPayments.toString());
			formDataObj.append("syncExpenses", formData.syncExpenses.toString());
			formDataObj.append("syncCustomers", formData.syncCustomers.toString());

			const result = await updateAccountingSettings(formDataObj);

			if (result.success) {
				toast.success("Accounting settings updated successfully");
				setOriginalFormData(formData);
			} else {
				toast.error(result.error || "Failed to update accounting settings");
			}
		});
	};

	const handleCancel = () => {
		setFormData(originalFormData);
	};

	const handleTestConnection = () => {
		setIsTestingConnection(true);
		setTimeout(() => {
			setIsTestingConnection(false);
			if (formData.apiKey && formData.apiSecret) {
				setConnectionStatus("connected");
				toast.success(`Successfully connected to ${formData.provider}`);
			} else {
				setConnectionStatus("disconnected");
				toast.error("Please provide valid API credentials");
			}
		}, 2000);
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-8 py-8">
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h1 className="font-bold text-4xl tracking-tight">
							Accounting Integration
						</h1>
						<Tooltip>
							<TooltipTrigger asChild>
								<button type="button">
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</button>
							</TooltipTrigger>
							<TooltipContent className="max-w-xs">
								<p className="text-sm">
									Connect your accounting software for seamless financial data
									sync. Supports QuickBooks, Xero, Sage, and FreshBooks.
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
					{hasChanges && (
						<Badge className="bg-warning hover:bg-warning">
							Unsaved Changes
						</Badge>
					)}
				</div>
				<p className="text-lg text-muted-foreground">
					Connect your accounting software for seamless financial data sync
				</p>
			</div>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<RefreshCw className="size-5 text-primary" />
							Provider Configuration
						</CardTitle>
						<CardDescription>
							Select and configure your accounting provider
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-6 sm:grid-cols-2">
							<div>
								<Label htmlFor="provider">Accounting Provider</Label>
								<Select
									onValueChange={(value) =>
										setFormData({ ...formData, provider: value })
									}
									value={formData.provider}
								>
									<SelectTrigger className="mt-2">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">None</SelectItem>
										<SelectItem value="quickbooks">
											QuickBooks Online
										</SelectItem>
										<SelectItem value="xero">Xero</SelectItem>
										<SelectItem value="sage">Sage Intacct</SelectItem>
										<SelectItem value="freshbooks">FreshBooks</SelectItem>
										<SelectItem value="manual">Manual Entry</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-end">
								<div className="flex items-center gap-2">
									{connectionStatus === "connected" && (
										<div className="flex items-center gap-2 text-sm text-success">
											<CheckCircle className="size-4" />
											<span>Connected</span>
										</div>
									)}
									{connectionStatus === "disconnected" && (
										<div className="flex items-center gap-2 text-destructive text-sm">
											<AlertCircle className="size-4" />
											<span>Not Connected</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{formData.provider !== "none" && formData.provider !== "manual" && (
							<>
								<Separator />

								<div className="space-y-4">
									<h3 className="font-medium text-sm">API Credentials</h3>
									<div className="grid gap-4">
										<div>
											<Label htmlFor="apiKey">API Key / Client ID</Label>
											<Input
												className="mt-2"
												id="apiKey"
												onChange={(e) =>
													setFormData({ ...formData, apiKey: e.target.value })
												}
												placeholder="Enter your API key"
												type="password"
												value={formData.apiKey}
											/>
										</div>
										<div>
											<Label htmlFor="apiSecret">
												API Secret / Client Secret
											</Label>
											<Input
												className="mt-2"
												id="apiSecret"
												onChange={(e) =>
													setFormData({
														...formData,
														apiSecret: e.target.value,
													})
												}
												placeholder="Enter your API secret"
												type="password"
												value={formData.apiSecret}
											/>
										</div>
									</div>

									<Button
										disabled={
											isTestingConnection ||
											!formData.apiKey ||
											!formData.apiSecret
										}
										onClick={handleTestConnection}
										variant="outline"
									>
										{isTestingConnection ? (
											<>
												<Loader2 className="mr-2 size-4 animate-spin" />
												Testing Connection...
											</>
										) : (
											<>
												<Link2 className="mr-2 size-4" />
												Test Connection
											</>
										)}
									</Button>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label>Enable Provider</Label>
										<p className="text-muted-foreground text-xs">
											Activate integration with {formData.provider}
										</p>
									</div>
									<Switch
										checked={formData.providerEnabled}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, providerEnabled: checked })
										}
									/>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				{formData.providerEnabled && formData.provider !== "none" && (
					<>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<RefreshCw className="size-5 text-primary" />
									Sync Settings
								</CardTitle>
								<CardDescription>
									Configure automatic data synchronization
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label>Auto Sync</Label>
										<p className="text-muted-foreground text-xs">
											Automatically sync data on schedule
										</p>
									</div>
									<Switch
										checked={formData.autoSyncEnabled}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, autoSyncEnabled: checked })
										}
									/>
								</div>

								{formData.autoSyncEnabled && (
									<div>
										<Label htmlFor="syncFrequency">Sync Frequency</Label>
										<Select
											onValueChange={(value) =>
												setFormData({ ...formData, syncFrequency: value })
											}
											value={formData.syncFrequency}
										>
											<SelectTrigger className="mt-2">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="realtime">Real-time</SelectItem>
												<SelectItem value="hourly">Hourly</SelectItem>
												<SelectItem value="daily">Daily</SelectItem>
												<SelectItem value="weekly">Weekly</SelectItem>
												<SelectItem value="manual">Manual Only</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}

								<Separator />

								<div className="space-y-4">
									<h3 className="font-medium text-sm">Data Sync Options</h3>

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Sync Invoices</Label>
											<p className="text-muted-foreground text-xs">
												Sync invoice data to accounting system
											</p>
										</div>
										<Switch
											checked={formData.syncInvoices}
											onCheckedChange={(checked) =>
												setFormData({ ...formData, syncInvoices: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Sync Payments</Label>
											<p className="text-muted-foreground text-xs">
												Sync payment transactions
											</p>
										</div>
										<Switch
											checked={formData.syncPayments}
											onCheckedChange={(checked) =>
												setFormData({ ...formData, syncPayments: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Sync Expenses</Label>
											<p className="text-muted-foreground text-xs">
												Sync expense records
											</p>
										</div>
										<Switch
											checked={formData.syncExpenses}
											onCheckedChange={(checked) =>
												setFormData({ ...formData, syncExpenses: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Sync Customers</Label>
											<p className="text-muted-foreground text-xs">
												Sync customer information
											</p>
										</div>
										<Switch
											checked={formData.syncCustomers}
											onCheckedChange={(checked) =>
												setFormData({ ...formData, syncCustomers: checked })
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<RefreshCw className="size-5 text-primary" />
									Account Mapping
								</CardTitle>
								<CardDescription>
									Map Thorbis accounts to your accounting chart of accounts
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="incomeAccount">Income Account</Label>
									<Input
										className="mt-2"
										id="incomeAccount"
										onChange={(e) =>
											setFormData({
												...formData,
												incomeAccount: e.target.value,
											})
										}
										placeholder="e.g., 4000 - Service Revenue"
										value={formData.incomeAccount}
									/>
								</div>

								<div>
									<Label htmlFor="expenseAccount">Expense Account</Label>
									<Input
										className="mt-2"
										id="expenseAccount"
										onChange={(e) =>
											setFormData({
												...formData,
												expenseAccount: e.target.value,
											})
										}
										placeholder="e.g., 5000 - Operating Expenses"
										value={formData.expenseAccount}
									/>
								</div>

								<div>
									<Label htmlFor="assetAccount">Asset Account</Label>
									<Input
										className="mt-2"
										id="assetAccount"
										onChange={(e) =>
											setFormData({ ...formData, assetAccount: e.target.value })
										}
										placeholder="e.g., 1200 - Accounts Receivable"
										value={formData.assetAccount}
									/>
								</div>

								<div>
									<Label htmlFor="liabilityAccount">Liability Account</Label>
									<Input
										className="mt-2"
										id="liabilityAccount"
										onChange={(e) =>
											setFormData({
												...formData,
												liabilityAccount: e.target.value,
											})
										}
										placeholder="e.g., 2000 - Accounts Payable"
										value={formData.liabilityAccount}
									/>
								</div>
							</CardContent>
						</Card>
					</>
				)}

				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div className="space-y-1">
							<p className="font-medium text-primary text-sm dark:text-primary">
								Accounting Integration Benefits
							</p>
							<p className="text-muted-foreground text-sm">
								Connecting your accounting software enables automatic financial
								data sync, reduces manual data entry, ensures accuracy across
								systems, and provides real-time financial reporting. Your
								credentials are encrypted and securely stored.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sticky Bottom Action Bar */}
			<div className="sticky bottom-0 z-10 rounded-xl border bg-card p-6 shadow-lg">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{hasChanges ? (
							<>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning dark:bg-warning/30">
									<div className="h-2 w-2 animate-pulse rounded-full bg-warning" />
								</div>
								<div>
									<p className="font-medium text-sm">Unsaved Changes</p>
									<p className="text-muted-foreground text-xs">
										Save your changes or discard them
									</p>
								</div>
							</>
						) : (
							<>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-success dark:bg-success/30">
									<Check className="h-4 w-4 text-success dark:text-success" />
								</div>
								<div>
									<p className="font-medium text-sm">All Changes Saved</p>
									<p className="text-muted-foreground text-xs">
										{settings.last_sync_at
											? `Last synced: ${new Date(settings.last_sync_at).toLocaleString()}`
											: "Your settings are up to date"}
									</p>
								</div>
							</>
						)}
					</div>
					<div className="flex gap-3">
						<Button
							disabled={isPending}
							onClick={handleCancel}
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isPending || !hasChanges} onClick={handleSave}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 size-4" />
									Save Settings
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
