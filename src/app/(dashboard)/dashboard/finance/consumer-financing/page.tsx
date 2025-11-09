/**
 * Consumer Financing Page - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 *
 * Shows Coming Soon component in production, normal page in development
 */

import {
  CheckCircle2,
  CreditCard,
  DollarSign,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComingSoon } from "@/components/ui/coming-soon";

export const revalidate = 900; // Revalidate every 15 minutes

export default function ConsumerFinancingPage() {
  // Show Coming Soon in production, normal page in development
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  if (isProduction) {
    return (
      <ComingSoon
        description="Help customers say yes to larger jobs with instant financing approvals. Increase your average ticket size and close more deals with flexible payment options."
        features={[
          {
            icon: Zap,
            title: "Instant Approvals",
            description:
              "Get customers approved in seconds with instant online applications - no waiting",
            color: "green-500",
          },
          {
            icon: CreditCard,
            title: "Flexible Terms",
            description:
              "Offer payment plans from 6-60 months with competitive rates and low monthly payments",
            color: "blue-500",
          },
          {
            icon: TrendingUp,
            title: "Higher Tickets",
            description:
              "Increase average job size by 40%+ when customers can spread costs over time",
            color: "purple-500",
          },
          {
            icon: CheckCircle2,
            title: "Multiple Partners",
            description:
              "Integrated with Wisetack, GreenSky, and major BNPL providers for maximum approval rates",
            color: "orange-500",
          },
        ]}
        icon={UserCheck}
        showViewAllLink={false}
        title="Consumer Financing"
        titleGradient="from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
      />
    );
  }

  // Development - show normal page
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Consumer Financing</h1>
        <p className="text-muted-foreground">
          Offer financing options to your customers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Financed Jobs</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Financed
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">Approved amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Approval Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0%</div>
            <p className="text-muted-foreground text-xs">Applications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consumer Financing Solutions</CardTitle>
          <CardDescription>
            Help customers pay for your services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Point-of-sale financing (Wisetack, GreenSky)</p>
            <p>• Credit card payment plans</p>
            <p>• Buy now, pay later options</p>
            <p>• Flexible payment terms</p>
            <p>• Instant approval process</p>
            <p>• No upfront costs to you</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
