"use client";

/**
 * Settings > Finance > Business Financing Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertTriangle,
  Building2,
  DollarSign,
  Plus,
  Save,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
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
interface LoanAccount extends Record<string, unknown> {
  id: string;
  lender: string;
  type: "line-of-credit" | "term-loan" | "sba-loan" | "equipment-loan";
  accountNumber: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  maturityDate: string;
  status: "active" | "paid-off" | "delinquent";
}

export default function BusinessFinancingSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loanAccounts] = useState<LoanAccount[]>([
    {
      id: "1",
      lender: "Wells Fargo Business",
      type: "line-of-credit",
      accountNumber: "****4532",
      originalAmount: 100_000,
      currentBalance: 35_000,
      interestRate: 7.5,
      monthlyPayment: 0,
      maturityDate: "2026-12-31",
      status: "active",
    },
    {
      id: "2",
      lender: "Bank of America",
      type: "term-loan",
      accountNumber: "****8921",
      originalAmount: 250_000,
      currentBalance: 187_500,
      interestRate: 5.25,
      monthlyPayment: 4167,
      maturityDate: "2028-06-15",
      status: "active",
    },
  ]);

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "default" as const, label: "Active" },
      "paid-off": { variant: "secondary" as const, label: "Paid Off" },
      delinquent: { variant: "destructive" as const, label: "Delinquent" },
    };
    const badge = config[status as keyof typeof config] || config.active;
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getLoanTypeName = (type: string) => {
    const types = {
      "line-of-credit": "Line of Credit",
      "term-loan": "Term Loan",
      "sba-loan": "SBA Loan",
      "equipment-loan": "Equipment Loan",
    };
    return types[type as keyof typeof types] || type;
  };

  const totalDebt = loanAccounts.reduce(
    (sum, loan) => sum + loan.currentBalance,
    0
  );
  const totalCreditAvailable = loanAccounts
    .filter((loan) => loan.type === "line-of-credit")
    .reduce(
      (sum, loan) => sum + (loan.originalAmount - loan.currentBalance),
      0
    );
  const monthlyObligations = loanAccounts.reduce(
    (sum, loan) => sum + loan.monthlyPayment,
    0
  );

  const columns: DataTableColumn<LoanAccount>[] = [
    {
      key: "lender",
      header: "Lender",
      sortable: true,
      filterable: true,
      render: (loan) => (
        <div className="space-y-1">
          <div className="font-medium">{loan.lender}</div>
          <div className="text-muted-foreground text-xs">
            {loan.accountNumber}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      filterable: true,
      render: (loan) => getLoanTypeName(loan.type),
    },
    {
      key: "currentBalance",
      header: "Balance",
      sortable: true,
      render: (loan) => (
        <div className="space-y-1">
          <div className="font-medium">
            ${loan.currentBalance.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-xs">
            of ${loan.originalAmount.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "interestRate",
      header: "Rate",
      sortable: true,
      render: (loan) => `${loan.interestRate}%`,
    },
    {
      key: "monthlyPayment",
      header: "Payment",
      sortable: true,
      render: (loan) =>
        loan.monthlyPayment > 0
          ? `$${loan.monthlyPayment.toLocaleString()}/mo`
          : "As needed",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (loan) => getStatusBadge(loan.status),
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Business Financing
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage business loans, lines of credit, and financing options
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Loan Account
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Debt</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                ${totalDebt.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                Across {loanAccounts.length} accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Available Credit
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                ${totalCreditAvailable.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">Ready to access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Monthly Obligations
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                ${monthlyObligations.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                Total monthly payments
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Financing Accounts</CardTitle>
            <CardDescription>
              Manage your business loans and lines of credit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={loanAccounts}
              emptyMessage="No financing accounts found."
              itemsPerPage={10}
              keyField="id"
              searchPlaceholder="Search by lender, type, or status..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Financing Settings
            </CardTitle>
            <CardDescription>
              Configure business financing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Track Loan Balances</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically sync loan balances from lenders
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Get notified before loan payments are due
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Reminder Days Before Due Date</Label>
              <Select defaultValue="7">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Pay from Bank Account</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically pay loans from linked account
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Line Settings</CardTitle>
            <CardDescription>
              Configure line of credit preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Draw Account</Label>
              <Select defaultValue="checking">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Business Checking</SelectItem>
                  <SelectItem value="savings">Business Savings</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Where credit line draws deposit by default
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Low Credit Alert Threshold (%)</Label>
              <Input defaultValue="20" max={100} min={0} type="number" />
              <p className="text-muted-foreground text-xs">
                Get notified when available credit falls below this percentage
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Interest Accrual Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Track daily interest charges
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debt Management</CardTitle>
            <CardDescription>
              Configure debt payoff and reporting preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Debt-to-Income Tracking</Label>
                <p className="text-muted-foreground text-sm">
                  Monitor your business debt-to-income ratio
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Payoff Strategy</Label>
              <Select defaultValue="avalanche">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avalanche">
                    Highest Interest First (Avalanche)
                  </SelectItem>
                  <SelectItem value="snowball">
                    Smallest Balance First (Snowball)
                  </SelectItem>
                  <SelectItem value="custom">Custom Priority</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Strategy for extra payments
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Monthly Debt Reports</Label>
                <p className="text-muted-foreground text-sm">
                  Email summary of all financing accounts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <div className="space-y-1">
              <p className="font-medium text-orange-700 text-sm dark:text-orange-400">
                Business Financing Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Keep your debt-to-income ratio below 36% for optimal financial
                health. Consider using lines of credit for short-term cash flow
                needs and term loans for long-term investments. Always maintain
                emergency reserves equal to 3-6 months of operating expenses.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
