"use client";

/**
 * Settings > Finance > Bank Accounts Page - Client Component
 *
 * Client-side features:
 * - Interactive bank account management
 * - Real-time balance updates
 * - Add/Edit/Delete bank accounts with Plaid integration support
 */

import { AlertCircle, Building2, CheckCircle, CreditCard, Edit, HelpCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	createBankAccount,
	deleteBankAccount,
	getBankAccounts,
	getUserCompanyId,
	updateBankAccount,
} from "@/actions/settings";
import { PlaidLinkButton } from "@/components/finance/plaid-link-button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type PaymentProcessor = {
	id: string;
	processor_type: string;
	status: string;
};

type BankAccount = {
	id: string;
	account_name: string;
	bank_name: string;
	account_type: string;
	account_number_last4?: string;
	current_balance: number;
	available_balance: number;
	auto_import_transactions: boolean;
	is_active: boolean;
	is_primary: boolean;
	last_synced_at?: string;
	created_at: string;
	payment_processors?: PaymentProcessor[];
};

export default function BankAccountsSettingsPage() {
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [companyId, setCompanyId] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
	const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		accountName: "",
		bankName: "",
		accountType: "checking",
		accountNumberLast4: "",
		currentBalance: "0",
		availableBalance: "0",
		autoImportTransactions: false,
		isActive: true,
		isPrimary: false,
	});

	// Load accounts and company ID from database
	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			try {
				// Fetch company ID
				const companyResult = await getUserCompanyId();
				if (companyResult.success && companyResult.data) {
					setCompanyId(companyResult.data);
				}

				// Fetch bank accounts
				const result = await getBankAccounts();
				if (result.success && result.data) {
					setAccounts(result.data);
				}
			} catch (_error) {
				toast.error("Failed to load bank accounts");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, []);

	const resetForm = () => {
		setFormData({
			accountName: "",
			bankName: "",
			accountType: "checking",
			accountNumberLast4: "",
			currentBalance: "0",
			availableBalance: "0",
			autoImportTransactions: false,
			isActive: true,
			isPrimary: false,
		});
		setEditingAccount(null);
	};

	const handleOpenDialog = (account?: BankAccount) => {
		if (account) {
			setEditingAccount(account);
			setFormData({
				accountName: account.account_name,
				bankName: account.bank_name,
				accountType: account.account_type,
				accountNumberLast4: account.account_number_last4 || "",
				currentBalance: account.current_balance.toString(),
				availableBalance: account.available_balance.toString(),
				autoImportTransactions: account.auto_import_transactions,
				isActive: account.is_active,
				isPrimary: account.is_primary,
			});
		} else {
			resetForm();
		}
		setDialogOpen(true);
	};

	const handleSave = () => {
		startTransition(async () => {
			const formDataObj = new FormData();
			formDataObj.append("accountName", formData.accountName);
			formDataObj.append("bankName", formData.bankName);
			formDataObj.append("accountType", formData.accountType);
			formDataObj.append("accountNumberLast4", formData.accountNumberLast4);
			formDataObj.append("currentBalance", formData.currentBalance);
			formDataObj.append("availableBalance", formData.availableBalance);
			formDataObj.append("autoImportTransactions", formData.autoImportTransactions.toString());
			formDataObj.append("isActive", formData.isActive.toString());
			formDataObj.append("isPrimary", formData.isPrimary.toString());

			let result;
			if (editingAccount) {
				result = await updateBankAccount(editingAccount.id, formDataObj);
			} else {
				result = await createBankAccount(formDataObj);
			}

			if (result.success) {
				toast.success(`Bank account ${editingAccount ? "updated" : "created"} successfully`);
				setDialogOpen(false);
				resetForm();
				// Reload accounts
				const accountsResult = await getBankAccounts();
				if (accountsResult.success && accountsResult.data) {
					setAccounts(accountsResult.data);
				}
			} else {
				toast.error(result.error || `Failed to ${editingAccount ? "update" : "create"} bank account`);
			}
		});
	};

	const handleDelete = async () => {
		if (!accountToDelete) {
			return;
		}

		startTransition(async () => {
			const result = await deleteBankAccount(accountToDelete);

			if (result.success) {
				toast.success("Bank account deleted successfully");
				setDeleteDialogOpen(false);
				setAccountToDelete(null);
				// Reload accounts
				const accountsResult = await getBankAccounts();
				if (accountsResult.success && accountsResult.data) {
					setAccounts(accountsResult.data);
				}
			} else {
				toast.error(result.error || "Failed to delete bank account");
			}
		});
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);

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
						<h1 className="font-bold text-4xl tracking-tight">Bank Accounts</h1>
						<Tooltip>
							<TooltipTrigger asChild>
								<button type="button">
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</button>
							</TooltipTrigger>
							<TooltipContent className="max-w-xs">
								<p className="text-sm">
									Connect and manage your business bank accounts with Plaid integration for automatic transaction
									imports and real-time balance updates.
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
				<p className="text-lg text-muted-foreground">Connect and manage your business bank accounts</p>
			</div>

			<div className="space-y-6">
				<div className="flex items-start justify-between">
					<div />
					<div className="flex gap-2">
						{companyId && (
							<PlaidLinkButton
								companyId={companyId}
								onSuccess={async () => {
									toast.success("Bank account linked successfully!");
									// Reload accounts
									const accountsResult = await getBankAccounts();
									if (accountsResult.success && accountsResult.data) {
										setAccounts(accountsResult.data);
									}
								}}
								variant="default"
							>
								<Building2 className="mr-2 size-4" />
								Connect via Plaid
							</PlaidLinkButton>
						)}
						<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
							<DialogTrigger asChild>
								<Button onClick={() => handleOpenDialog()} variant="outline">
									<Plus className="mr-2 size-4" />
									Add Manually
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[500px]">
								<DialogHeader>
									<DialogTitle>{editingAccount ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
									<DialogDescription>
										{editingAccount
											? "Update the bank account details below"
											: "Connect a new bank account to your business"}
									</DialogDescription>
								</DialogHeader>

								<div className="space-y-4 py-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<Label htmlFor="accountName">Account Name</Label>
											<Input
												className="mt-2"
												id="accountName"
												onChange={(e) =>
													setFormData({
														...formData,
														accountName: e.target.value,
													})
												}
												placeholder="Business Checking"
												value={formData.accountName}
											/>
										</div>
										<div>
											<Label htmlFor="bankName">Bank Name</Label>
											<Input
												className="mt-2"
												id="bankName"
												onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
												placeholder="Chase Bank"
												value={formData.bankName}
											/>
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<Label htmlFor="accountType">Account Type</Label>
											<Select
												onValueChange={(value) => setFormData({ ...formData, accountType: value })}
												value={formData.accountType}
											>
												<SelectTrigger className="mt-2">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="checking">Checking</SelectItem>
													<SelectItem value="savings">Savings</SelectItem>
													<SelectItem value="business_checking">Business Checking</SelectItem>
													<SelectItem value="credit_card">Credit Card</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor="accountNumberLast4">Last 4 Digits</Label>
											<Input
												className="mt-2"
												id="accountNumberLast4"
												maxLength={4}
												onChange={(e) =>
													setFormData({
														...formData,
														accountNumberLast4: e.target.value,
													})
												}
												placeholder="1234"
												value={formData.accountNumberLast4}
											/>
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<Label htmlFor="currentBalance">Current Balance</Label>
											<Input
												className="mt-2"
												id="currentBalance"
												onChange={(e) =>
													setFormData({
														...formData,
														currentBalance: e.target.value,
													})
												}
												placeholder="0.00"
												type="number"
												value={formData.currentBalance}
											/>
										</div>
										<div>
											<Label htmlFor="availableBalance">Available Balance</Label>
											<Input
												className="mt-2"
												id="availableBalance"
												onChange={(e) =>
													setFormData({
														...formData,
														availableBalance: e.target.value,
													})
												}
												placeholder="0.00"
												type="number"
												value={formData.availableBalance}
											/>
										</div>
									</div>

									<Separator />

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Auto Import Transactions</Label>
											<p className="text-muted-foreground text-xs">Automatically sync transactions via Plaid</p>
										</div>
										<Switch
											checked={formData.autoImportTransactions}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													autoImportTransactions: checked,
												})
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Primary Account</Label>
											<p className="text-muted-foreground text-xs">Use as default for payments</p>
										</div>
										<Switch
											checked={formData.isPrimary}
											onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked })}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label>Active</Label>
											<p className="text-muted-foreground text-xs">Show in reports and dashboard</p>
										</div>
										<Switch
											checked={formData.isActive}
											onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
										/>
									</div>
								</div>

								<DialogFooter>
									<Button
										onClick={() => {
											setDialogOpen(false);
											resetForm();
										}}
										variant="outline"
									>
										Cancel
									</Button>
									<Button disabled={isPending} onClick={handleSave}>
										{isPending ? (
											<>
												<Loader2 className="mr-2 size-4 animate-spin" />
												Saving...
											</>
										) : (
											"Save Account"
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{accounts.length === 0 ? (
					<Card>
						<CardContent className="flex min-h-[300px] flex-col items-center justify-center py-12">
							<Building2 className="mb-4 size-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">No bank accounts connected</h3>
							<p className="mb-6 text-center text-muted-foreground text-sm">
								Connect your business bank accounts to track balances and manage transactions
							</p>
							<Button onClick={() => handleOpenDialog()}>
								<Plus className="mr-2 size-4" />
								Add Your First Account
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 md:grid-cols-2">
						{accounts.map((account) => (
							<Card className={account.is_active ? "" : "opacity-60"} key={account.id}>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="flex items-center gap-2">
												<Building2 className="size-5 text-primary" />
												{account.account_name}
												{account.is_primary && (
													<span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs dark:text-primary">
														Primary
													</span>
												)}
											</CardTitle>
											<CardDescription className="mt-1">
												{account.bank_name}
												{account.account_number_last4 && (
													<span className="ml-2">····{account.account_number_last4}</span>
												)}
											</CardDescription>
										</div>
										<div className="flex gap-2">
											<Button onClick={() => handleOpenDialog(account)} size="icon" variant="ghost">
												<Edit className="size-4" />
											</Button>
											<Button
												onClick={() => {
													setAccountToDelete(account.id);
													setDeleteDialogOpen(true);
												}}
												size="icon"
												variant="ghost"
											>
												<Trash2 className="size-4 text-destructive" />
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-muted-foreground text-xs">Current Balance</p>
											<p className="font-semibold text-lg">{formatCurrency(account.current_balance)}</p>
										</div>
										<div>
											<p className="text-muted-foreground text-xs">Available Balance</p>
											<p className="font-semibold text-lg">{formatCurrency(account.available_balance)}</p>
										</div>
									</div>

									<Separator />

									<div className="flex items-center gap-2 text-sm">
										{account.is_active ? (
											<>
												<CheckCircle className="size-4 text-success" />
												<span className="text-muted-foreground">Active</span>
											</>
										) : (
											<>
												<AlertCircle className="size-4 text-warning" />
												<span className="text-muted-foreground">Inactive</span>
											</>
										)}
										<span className="text-muted-foreground">·</span>
										<span className="text-muted-foreground">
											{account.account_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
										</span>
										{account.auto_import_transactions && (
											<>
												<span className="text-muted-foreground">·</span>
												<span className="text-muted-foreground">Auto-sync enabled</span>
											</>
										)}
									</div>

									{account.last_synced_at && (
										<p className="text-muted-foreground text-xs">
											Last synced: {new Date(account.last_synced_at).toLocaleString()}
										</p>
									)}

									{account.payment_processors && account.payment_processors.length > 0 && (
										<div className="mt-4 space-y-2">
											<Separator />
											<div className="flex items-center gap-2">
												<CreditCard className="size-4 text-muted-foreground" />
												<p className="font-medium text-muted-foreground text-xs">Payment Processors:</p>
											</div>
											<div className="flex flex-wrap gap-2">
												{account.payment_processors.map((processor) => (
													<span
														className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-medium text-primary text-xs dark:text-primary"
														key={processor.id}
													>
														{processor.processor_type === "adyen" && "Adyen"}
														{processor.processor_type === "plaid" && "Plaid"}
														{processor.processor_type === "profitstars" && "ProfitStars"}
														{processor.processor_type === "stripe" && "Stripe"}
														{processor.status === "active" && <CheckCircle className="size-3" />}
													</span>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				)}

				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div className="space-y-1">
							<p className="font-medium text-primary text-sm dark:text-primary">Bank Account Integration</p>
							<p className="text-muted-foreground text-sm">
								Connect your accounts using Plaid for automatic transaction imports, real-time balance updates, and
								seamless reconciliation. Your credentials are encrypted and secure.
							</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-blue-500/50 bg-blue-500/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
						<div className="space-y-2">
							<p className="font-medium text-blue-600 text-sm dark:text-blue-400">Payment Processor Integration</p>
							<p className="text-muted-foreground text-sm">
								Bank accounts can be linked to payment processors (Adyen, Plaid, ProfitStars, Stripe) to automatically
								route collected payments to the correct account. When configuring a payment processor, you can select
								which bank account should receive deposits. If no account is selected, payments will be deposited to
								your primary bank account.
							</p>
							<p className="text-muted-foreground text-xs">
								Payment processors linked to each account are shown on the account cards above.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this bank account? This action cannot be undone. Transaction history will
							be preserved but the account connection will be removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setAccountToDelete(null)}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive hover:bg-destructive/90"
							disabled={isPending}
							onClick={handleDelete}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Account"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
