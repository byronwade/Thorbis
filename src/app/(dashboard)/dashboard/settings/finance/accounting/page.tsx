"use client";

/**
 * Settings > Finance > Accounting Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Banknote, Save } from "lucide-react";
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
import { TooltipProvider } from "@/components/ui/tooltip";
export default function AccountingSettingsPage() {
  const [hasUnsavedChanges, _setHasUnsavedChanges] = useState(false);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Accounting</h1>
            <p className="mt-2 text-muted-foreground">
              Chart of accounts and financial reporting settings
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Accounting Method
            </CardTitle>
            <CardDescription>
              Configure your accounting method and fiscal year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Accounting Method</Label>
              <Select defaultValue="accrual">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accrual">Accrual Basis</SelectItem>
                  <SelectItem value="cash">Cash Basis</SelectItem>
                  <SelectItem value="modified-cash">Modified Cash</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                How revenue and expenses are recognized
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Fiscal Year Start</Label>
              <Select defaultValue="january">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                When your fiscal year begins
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Multi-Currency Support</Label>
                <p className="text-muted-foreground text-sm">
                  Enable multiple currencies for international business
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart of Accounts</CardTitle>
            <CardDescription>
              Configure your account structure and numbering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Account Numbering System</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (1000-9000)</SelectItem>
                  <SelectItem value="simple">Simple (100-900)</SelectItem>
                  <SelectItem value="detailed">
                    Detailed (10000-90000)
                  </SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                How account numbers are structured
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sub-Accounts</Label>
                <p className="text-muted-foreground text-sm">
                  Allow creating sub-accounts for detailed tracking
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Department Tracking</Label>
                <p className="text-muted-foreground text-sm">
                  Track income and expenses by department
                </p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Class Tracking</Label>
                <p className="text-muted-foreground text-sm">
                  Track transactions by business segment or location
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Reporting</CardTitle>
            <CardDescription>
              Configure standard financial reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Comparison Periods</Label>
              <Select defaultValue="year-over-year">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Comparison</SelectItem>
                  <SelectItem value="prior-period">Prior Period</SelectItem>
                  <SelectItem value="year-over-year">Year over Year</SelectItem>
                  <SelectItem value="budget-vs-actual">
                    Budget vs Actual
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Default comparison for financial reports
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cash Flow Statement</Label>
                <p className="text-muted-foreground text-sm">
                  Generate cash flow statements automatically
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Balance Sheet</Label>
                <p className="text-muted-foreground text-sm">
                  Generate balance sheets automatically
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profit & Loss Statement</Label>
                <p className="text-muted-foreground text-sm">
                  Generate P&L statements automatically
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Standards</CardTitle>
            <CardDescription>
              Configure accounting standards and compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Accounting Standards</Label>
              <Select defaultValue="gaap">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaap">US GAAP</SelectItem>
                  <SelectItem value="ifrs">IFRS</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Which accounting standards to follow
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tax Compliance Tracking</Label>
                <p className="text-muted-foreground text-sm">
                  Track transactions for tax reporting
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Trail</Label>
                <p className="text-muted-foreground text-sm">
                  Maintain detailed audit trail of all changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Retention Period (years)</Label>
              <Select defaultValue="7">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 years</SelectItem>
                  <SelectItem value="5">5 years</SelectItem>
                  <SelectItem value="7">7 years</SelectItem>
                  <SelectItem value="10">10 years</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                How long to retain accounting records
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Accounting Configuration Help
              </p>
              <p className="text-muted-foreground text-sm">
                These settings control how your financial data is organized and
                reported. Changing the accounting method or fiscal year can
                significantly impact your financial reports. Consult with your
                accountant before making major changes to these settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
