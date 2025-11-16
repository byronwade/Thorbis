/**
 * Business Financing Page - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 *
 * Shows Coming Soon component in production, normal page in development
 */

import { Building2, CreditCard, DollarSign, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComingSoon } from "@/components/ui/coming-soon";

export default function BusinessFinancingPage() {
  // Show Coming Soon in production, normal page in development
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  if (isProduction) {
    return (
      <ComingSoon
        description="Access capital to grow your business with term loans, lines of credit, equipment financing, and more - all integrated directly into your workflow."
        features={[
          {
            icon: DollarSign,
            title: "Term Loans",
            description:
              "Fixed-rate business loans with flexible repayment terms to fund expansion and growth",
            color: "blue-500",
          },
          {
            icon: CreditCard,
            title: "Lines of Credit",
            description:
              "Revolving credit lines for working capital and seasonal cash flow needs",
            color: "green-500",
          },
          {
            icon: Building2,
            title: "Equipment Financing",
            description:
              "Finance trucks, tools, and equipment with low down payments and competitive rates",
            color: "purple-500",
          },
          {
            icon: FileText,
            title: "SBA & More",
            description:
              "SBA loans, invoice factoring, and merchant cash advances for every situation",
            color: "orange-500",
          },
        ]}
        icon={Building2}
        showViewAllLink={false}
        title="Business Financing"
        titleGradient="from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
      />
    );
  }

  // Development - show normal page
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Business Financing</h1>
        <p className="text-muted-foreground">
          Loans, lines of credit, and business funding options
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Loans</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">Total borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Credit Line Available
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">Ready to use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Monthly Payments
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">Due this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financing Options</CardTitle>
          <CardDescription>
            Business lending and funding solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Business term loans</p>
            <p>• Lines of credit</p>
            <p>• Equipment financing</p>
            <p>• SBA loans</p>
            <p>• Invoice factoring</p>
            <p>• Merchant cash advances</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
