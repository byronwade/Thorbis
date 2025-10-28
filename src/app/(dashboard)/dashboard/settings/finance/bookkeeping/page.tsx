"use client";

/**
 * Settings > Finance > Bookkeeping Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  BookOpen,
  Calculator,
  CheckCircle,
  FileCheck,
  Save,
  Tags,
} from "lucide-react";
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
import { TooltipProvider } from "@/components/ui/tooltip";
export default function BookkeepingSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Bookkeeping</h1>
            <p className="mt-2 text-muted-foreground">
              Transaction categorization, reconciliation, and reporting settings
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-primary" />
              Automated Categorization
            </CardTitle>
            <CardDescription>
              Configure automatic transaction categorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Categorize Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically categorize based on merchant and history
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Categorization Confidence Threshold</Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Confidence</SelectItem>
                  <SelectItem value="medium">Medium or Higher</SelectItem>
                  <SelectItem value="high">High Confidence Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Only auto-categorize when confidence meets this threshold
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Learn from Manual Changes</Label>
                <p className="text-muted-foreground text-sm">
                  Improve categorization based on your corrections
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Review Before Finalizing</Label>
                <p className="text-muted-foreground text-sm">
                  Require review of auto-categorized transactions
                </p>
              </div>
              <Switch onCheckedChange={() => setHasUnsavedChanges(true)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Categories</CardTitle>
            <CardDescription>
              Set default categories for common transaction types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Income Category</Label>
              <Select defaultValue="service-revenue">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service-revenue">
                    Service Revenue
                  </SelectItem>
                  <SelectItem value="product-sales">Product Sales</SelectItem>
                  <SelectItem value="other-income">Other Income</SelectItem>
                  <SelectItem value="interest-income">
                    Interest Income
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Default Expense Category</Label>
              <Select defaultValue="general-expense">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general-expense">
                    General Expense
                  </SelectItem>
                  <SelectItem value="operating-expense">
                    Operating Expense
                  </SelectItem>
                  <SelectItem value="cost-of-goods">
                    Cost of Goods Sold
                  </SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Payroll Category</Label>
              <Select defaultValue="payroll-expense">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payroll-expense">
                    Payroll Expense
                  </SelectItem>
                  <SelectItem value="contractor-payments">
                    Contractor Payments
                  </SelectItem>
                  <SelectItem value="wages-salaries">
                    Wages & Salaries
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Tax Payment Category</Label>
              <Select defaultValue="tax-payment">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax-payment">Tax Payment</SelectItem>
                  <SelectItem value="income-tax">Income Tax</SelectItem>
                  <SelectItem value="sales-tax">Sales Tax</SelectItem>
                  <SelectItem value="payroll-tax">Payroll Tax</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Reconciliation Settings
            </CardTitle>
            <CardDescription>
              Configure bank reconciliation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Reconcile Matched Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically mark perfectly matched transactions as
                  reconciled
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Reconciliation Frequency</Label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                How often to perform full reconciliation
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reconciliation Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Get notified when reconciliation is due
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Variance Tolerance ($)</Label>
              <Input
                defaultValue="0.01"
                min={0}
                onChange={() => setHasUnsavedChanges(true)}
                step={0.01}
                type="number"
              />
              <p className="text-muted-foreground text-xs">
                Maximum acceptable difference in reconciliation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Transaction Rules
            </CardTitle>
            <CardDescription>
              Configure custom rules for transaction handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Split Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Allow splitting transactions across multiple categories
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Merge Duplicate Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically identify and merge duplicate entries
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Duplicate Detection Window (days)</Label>
              <Input
                defaultValue="3"
                max={30}
                min={1}
                onChange={() => setHasUnsavedChanges(true)}
                type="number"
              />
              <p className="text-muted-foreground text-xs">
                Look for duplicates within this many days
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Flag Large Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Require review for transactions above a threshold
                </p>
              </div>
              <Switch onCheckedChange={() => setHasUnsavedChanges(true)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Reporting Preferences
            </CardTitle>
            <CardDescription>
              Configure financial reporting settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Reporting Basis</Label>
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
                Accounting method for financial reports
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Pending Transactions</Label>
                <p className="text-muted-foreground text-sm">
                  Show pending transactions in reports
                </p>
              </div>
              <Switch onCheckedChange={() => setHasUnsavedChanges(true)} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Monthly Report Emails</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically email monthly financial summaries
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() => setHasUnsavedChanges(true)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Report Delivery Day</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st of the month</SelectItem>
                  <SelectItem value="5">5th of the month</SelectItem>
                  <SelectItem value="15">15th of the month</SelectItem>
                  <SelectItem value="last">Last day of month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Bookkeeping Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Reconcile your accounts at least monthly to catch errors early.
                Use consistent categorization to make tax time easier. Review
                auto-categorized transactions regularly to ensure accuracy. Keep
                digital copies of all receipts and invoices for at least 7
                years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
