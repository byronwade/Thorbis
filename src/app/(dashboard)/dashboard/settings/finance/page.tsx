/**
 * Settings > Finance Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertCircle,
  Banknote,
  Building2,
  Calculator,
  CreditCard,
  DollarSign,
  Fuel,
  Gift,
  Layers,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every 1 hour

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const financeSections = [
  {
    title: "Bank Accounts",
    description: "Connect and manage business bank accounts",
    icon: Building2,
    href: "/dashboard/settings/finance/bank-accounts",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Virtual Buckets",
    description: "Organize funds with virtual account buckets",
    icon: Layers,
    href: "/dashboard/settings/finance/virtual-buckets",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Consumer Financing",
    description: "Customer payment plans and financing options",
    icon: DollarSign,
    href: "/dashboard/settings/finance/consumer-financing",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Business Financing",
    description: "Business loans and credit lines",
    icon: TrendingUp,
    href: "/dashboard/settings/finance/business-financing",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Bookkeeping",
    description: "Transaction categorization and reconciliation",
    icon: Calculator,
    href: "/dashboard/settings/finance/bookkeeping",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    title: "Accounting",
    description: "Chart of accounts and financial reporting",
    icon: Banknote,
    href: "/dashboard/settings/finance/accounting",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    title: "Debit Cards",
    description: "Issue and manage company debit cards",
    icon: CreditCard,
    href: "/dashboard/settings/finance/debit-cards",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Gas Cards",
    description: "Fleet gas cards for employee vehicles",
    icon: Fuel,
    href: "/dashboard/settings/finance/gas-cards",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Gift Cards",
    description: "Sell and manage customer gift cards",
    icon: Gift,
    href: "/dashboard/settings/finance/gift-cards",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

export default function FinanceSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Finance Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage banking, financing, cards, and financial integrations
        </p>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="space-y-1">
            <p className="font-medium text-amber-700 text-sm dark:text-amber-400">
              Important: Financial Configuration
            </p>
            <p className="text-muted-foreground text-sm">
              These settings control critical financial operations including
              banking, financing, and payment processing. Ensure proper
              authorization and compliance before making changes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Overview of your financial settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Connected Banks</p>
              <p className="font-semibold">2 Accounts</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Virtual Buckets</p>
              <p className="font-semibold">5 Active</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Active Cards</p>
              <p className="font-semibold">12 Issued</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Financing</p>
              <p className="font-semibold">Enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {financeSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link href={section.href} key={section.title}>
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${section.bgColor}`}
                    >
                      <Icon className={`size-5 ${section.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Integrations</CardTitle>
          <CardDescription>
            Connected banking and accounting services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Building2 className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Plaid Banking</p>
                  <p className="text-muted-foreground text-xs">
                    Connected • Last sync: 5 min ago
                  </p>
                </div>
              </div>
              <div className="flex size-2 rounded-full bg-green-500" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Calculator className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">QuickBooks Online</p>
                  <p className="text-muted-foreground text-xs">
                    Connected • Last sync: 1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex size-2 rounded-full bg-green-500" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-dashed p-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gray-500/10">
                  <Wallet className="size-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Stripe</p>
                  <p className="text-muted-foreground text-xs">Not connected</p>
                </div>
              </div>
              <Link href="/dashboard/settings/integrations">
                <span className="text-primary text-sm hover:underline">
                  Connect
                </span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base text-blue-700 dark:text-blue-400">
              Need Help Configuring Finance?
            </CardTitle>
          </div>
          <CardDescription>
            Our financial specialists can help you set up banking integrations,
            configure financing options, and ensure regulatory compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/help/finance-setup">
              <span className="text-blue-600 text-sm underline hover:text-blue-700">
                View Setup Guide
              </span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact">
              <span className="text-blue-600 text-sm underline hover:text-blue-700">
                Contact Support
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
