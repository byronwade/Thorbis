"use client";

/**
 * Settings > Finance > Bank Accounts Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Link as LinkIcon,
  MoreVertical,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { TooltipProvider } from "@/components/ui/tooltip";
type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountType: "checking" | "savings" | "credit" | "line-of-credit";
  lastFour: string;
  status: "connected" | "reconnect-needed" | "error";
  lastSynced: string;
  isDefault: boolean;
  logoUrl: string;
  primaryColor: string;
};

const getBankLogo = (bankName: string) => {
  const logos: Record<string, { url: string; color: string }> = {
    "Chase Bank": {
      url: "https://logo.clearbit.com/chase.com",
      color: "#0071CE",
    },
    "Bank of America": {
      url: "https://logo.clearbit.com/bankofamerica.com",
      color: "#E31837",
    },
    "Wells Fargo": {
      url: "https://logo.clearbit.com/wellsfargo.com",
      color: "#D71E28",
    },
    Citibank: {
      url: "https://logo.clearbit.com/citi.com",
      color: "#003B71",
    },
    "American Express": {
      url: "https://logo.clearbit.com/americanexpress.com",
      color: "#006FCF",
    },
    "Capital One": {
      url: "https://logo.clearbit.com/capitalone.com",
      color: "#004879",
    },
    "US Bank": {
      url: "https://logo.clearbit.com/usbank.com",
      color: "#0D2C54",
    },
    "PNC Bank": {
      url: "https://logo.clearbit.com/pnc.com",
      color: "#F58025",
    },
    "TD Bank": {
      url: "https://logo.clearbit.com/td.com",
      color: "#5DBB46",
    },
    Truist: {
      url: "https://logo.clearbit.com/truist.com",
      color: "#340084",
    },
  };

  return (
    logos[bankName] || {
      url: "https://logo.clearbit.com/bank.com",
      color: "#6B7280",
    }
  );
};

export default function BankAccountsSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "Chase Bank",
      accountName: "Business Checking",
      accountType: "checking",
      lastFour: "4521",
      status: "connected",
      lastSynced: "2 minutes ago",
      isDefault: true,
      logoUrl: getBankLogo("Chase Bank").url,
      primaryColor: getBankLogo("Chase Bank").color,
    },
    {
      id: "2",
      bankName: "Bank of America",
      accountName: "Business Savings",
      accountType: "savings",
      lastFour: "8832",
      status: "connected",
      lastSynced: "5 minutes ago",
      isDefault: false,
      logoUrl: getBankLogo("Bank of America").url,
      primaryColor: getBankLogo("Bank of America").color,
    },
    {
      id: "3",
      bankName: "American Express",
      accountName: "Business Credit Card",
      accountType: "credit",
      lastFour: "1005",
      status: "reconnect-needed",
      lastSynced: "1 hour ago",
      isDefault: false,
      logoUrl: getBankLogo("American Express").url,
      primaryColor: getBankLogo("American Express").color,
    },
  ]);

  const [settings, setSettings] = useState({
    plaidEnabled: true,
    autoSyncEnabled: true,
    syncFrequency: "daily",
    syncTime: "02:00",
    realtimeUpdates: true,
    requireMFA: true,
    transactionHistory: 90,
    autoCategorize: true,
    emailNotifications: true,
    lowBalanceThreshold: 1000,
    largeTransactionThreshold: 5000,
    reconciliationReminders: true,
    allowManualAccounts: false,
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setHasUnsavedChanges(false);
  };

  const handleSetDefault = (accountId: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isDefault: acc.id === accountId,
      }))
    );
    setHasUnsavedChanges(true);
  };

  const handleDisconnect = (accountId: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== accountId));
    setHasUnsavedChanges(true);
  };

  const handleSync = (_accountId: string) => {
    // TODO: Implement sync logic
  };

  const getStatusBadge = (status: BankAccount["status"]) => {
    switch (status) {
      case "connected":
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1">
            <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 text-xs dark:text-green-400">
              Connected
            </span>
          </div>
        );
      case "reconnect-needed":
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1">
            <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-700 text-xs dark:text-amber-400">
              Reconnect Needed
            </span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1">
            <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
            <span className="font-medium text-red-700 text-xs dark:text-red-400">
              Error
            </span>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Bank Account Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Connect and configure bank account synchronization
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connected Bank Accounts</CardTitle>
                <CardDescription>
                  Manage your connected business bank accounts
                </CardDescription>
              </div>
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Bank
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold text-lg">
                  No Accounts Connected
                </h3>
                <p className="mb-4 max-w-sm text-muted-foreground text-sm">
                  Connect your business bank accounts to automatically sync
                  transactions and balances.
                </p>
                <Button>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect Your First Account
                </Button>
              </div>
            ) : (
              <>
                {accounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className="flex size-12 items-center justify-center rounded-lg border bg-white p-2"
                            style={{
                              borderColor: `${account.primaryColor}20`,
                            }}
                          >
                            <Image
                              alt={`${account.bankName} logo`}
                              className="size-full object-contain"
                              height={48}
                              src={account.logoUrl}
                              width={48}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {account.accountName}
                              </h3>
                              {account.isDefault && (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                                  Default
                                </span>
                              )}
                              {getStatusBadge(account.status)}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {account.bankName} •••• {account.lastFour}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Last synced: {account.lastSynced}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleSync(account.id)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </DropdownMenuItem>
                            {!account.isDefault && (
                              <DropdownMenuItem
                                onClick={() => handleSetDefault(account.id)}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            {account.status === "reconnect-needed" && (
                              <DropdownMenuItem>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Reconnect Account
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDisconnect(account.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {account.status === "reconnect-needed" && (
                        <>
                          <Separator className="my-4" />
                          <div className="flex items-center justify-between rounded-lg bg-amber-500/5 p-3">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                              <div>
                                <p className="font-medium text-amber-700 text-sm dark:text-amber-400">
                                  Reconnection Required
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  Your bank credentials need to be updated
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Reconnect
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <Button className="w-full" size="lg" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Another Bank Account
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Bank Integration
            </CardTitle>
            <CardDescription>
              Connect to banking services via Plaid
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Plaid Integration</Label>
                <p className="text-muted-foreground text-sm">
                  Allow connection to bank accounts through Plaid
                </p>
              </div>
              <Switch
                checked={settings.plaidEnabled}
                onCheckedChange={(checked) =>
                  handleChange("plaidEnabled", checked)
                }
              />
            </div>

            {settings.plaidEnabled && (
              <>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="transaction-history">
                    Initial Sync History
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleChange(
                        "transactionHistory",
                        Number.parseInt(value, 10)
                      )
                    }
                    value={settings.transactionHistory.toString()}
                  >
                    <SelectTrigger id="transaction-history">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="180">Last 6 months</SelectItem>
                      <SelectItem value="365">Last 12 months</SelectItem>
                      <SelectItem value="730">Last 24 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    How far back to sync when connecting a new account
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Multi-Factor Authentication</Label>
                    <p className="text-muted-foreground text-sm">
                      Users must complete MFA when connecting accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireMFA}
                    onCheckedChange={(checked) =>
                      handleChange("requireMFA", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Synchronization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Automatic Synchronization</CardTitle>
            <CardDescription>
              Configure how often accounts sync with banks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Auto-Sync</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically sync all connected accounts
                </p>
              </div>
              <Switch
                checked={settings.autoSyncEnabled}
                onCheckedChange={(checked) =>
                  handleChange("autoSyncEnabled", checked)
                }
              />
            </div>

            {settings.autoSyncEnabled && (
              <>
                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange("syncFrequency", value)
                      }
                      value={settings.syncFrequency}
                    >
                      <SelectTrigger id="sync-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="every-4-hours">
                          Every 4 Hours
                        </SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.syncFrequency === "daily" && (
                    <div className="space-y-2">
                      <Label htmlFor="sync-time">Daily Sync Time</Label>
                      <Input
                        id="sync-time"
                        onChange={(e) =>
                          handleChange("syncTime", e.target.value)
                        }
                        type="time"
                        value={settings.syncTime}
                      />
                      <p className="text-muted-foreground text-xs">
                        Time in your local timezone
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Balance Updates</Label>
                    <p className="text-muted-foreground text-sm">
                      Update balances immediately when transactions post
                    </p>
                  </div>
                  <Switch
                    checked={settings.realtimeUpdates}
                    onCheckedChange={(checked) =>
                      handleChange("realtimeUpdates", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Transaction Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Processing</CardTitle>
            <CardDescription>
              Configure automatic transaction handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Categorize Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically assign categories based on merchant
                </p>
              </div>
              <Switch
                checked={settings.autoCategorize}
                onCheckedChange={(checked) =>
                  handleChange("autoCategorize", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reconciliation Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Send reminders for unreconciled transactions
                </p>
              </div>
              <Switch
                checked={settings.reconciliationReminders}
                onCheckedChange={(checked) =>
                  handleChange("reconciliationReminders", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications & Alerts</CardTitle>
            <CardDescription>
              Get notified about account activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Send email alerts for important events
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleChange("emailNotifications", checked)
                }
              />
            </div>

            {settings.emailNotifications && (
              <>
                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="low-balance">
                      Low Balance Threshold ($)
                    </Label>
                    <Input
                      id="low-balance"
                      min={0}
                      onChange={(e) =>
                        handleChange(
                          "lowBalanceThreshold",
                          Number.parseInt(e.target.value, 10)
                        )
                      }
                      step={100}
                      type="number"
                      value={settings.lowBalanceThreshold}
                    />
                    <p className="text-muted-foreground text-xs">
                      Alert when balance drops below this amount
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="large-transaction">
                      Large Transaction Alert ($)
                    </Label>
                    <Input
                      id="large-transaction"
                      min={0}
                      onChange={(e) =>
                        handleChange(
                          "largeTransactionThreshold",
                          Number.parseInt(e.target.value, 10)
                        )
                      }
                      step={100}
                      type="number"
                      value={settings.largeTransactionThreshold}
                    />
                    <p className="text-muted-foreground text-xs">
                      Alert for transactions above this amount
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Additional configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Manual Account Entry</Label>
                <p className="text-muted-foreground text-sm">
                  Users can add accounts without Plaid connection
                </p>
              </div>
              <Switch
                checked={settings.allowManualAccounts}
                onCheckedChange={(checked) =>
                  handleChange("allowManualAccounts", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-2">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Bank-Level Security with Plaid
              </p>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>256-bit AES encryption for all data transmission</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>
                    Read-only access - credentials never stored on our servers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>SOC 2 Type II certified infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>Supports 12,000+ financial institutions</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
