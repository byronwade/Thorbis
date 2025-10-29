/**
 * Business Financing Page - Server Component
 */

import { Building2, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 900;

export default function BusinessFinancingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Business Financing</h1>
        <p className="text-muted-foreground">
          Loans, lines of credit, and business funding options
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Loans
            </CardTitle>
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
          <CardDescription>Business lending and funding solutions</CardDescription>
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
