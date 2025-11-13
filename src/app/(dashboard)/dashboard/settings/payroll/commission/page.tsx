/**
 * Commission Settings Page
 *
 * Configure commission structures, tiers, and rules for technicians
 */

import { Edit, Plus, Trash2, TrendingUp } from "lucide-react";
import { getCommissionRules } from "@/actions/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CommissionSettingsPage() {
  const result = await getCommissionRules();
  const rules = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">
            Commission Settings
          </h1>
          <p className="text-muted-foreground">
            Configure commission structures and rules for sales and upsells
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Commission Rule
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {rules.filter((r: any) => r.is_active).length}
            </div>
            <p className="text-muted-foreground text-xs">
              {rules.length} total rules configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Job Revenue Rules
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {
                rules.filter((r: any) => r.commission_basis === "job_revenue")
                  .length
              }
            </div>
            <p className="text-muted-foreground text-xs">
              Most common commission type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Upsell Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {
                rules.filter((r: any) => r.commission_basis === "upsells")
                  .length
              }
            </div>
            <p className="text-muted-foreground text-xs">
              Incentivizing additional sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Rules</CardTitle>
          <CardDescription>
            Manage commission structures for different job types and scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="py-12 text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-lg">
                No Commission Rules
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Get started by creating your first commission rule
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Commission Rule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Basis</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule: any) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      {rule.rule_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {rule.commission_basis.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rule.rate_type === "flat_percentage" && "Flat %"}
                      {rule.rate_type === "tiered" && "Tiered"}
                      {rule.rate_type === "progressive" && "Progressive"}
                    </TableCell>
                    <TableCell>
                      {rule.rate_type === "flat_percentage" &&
                      rule.flat_percentage
                        ? `${rule.flat_percentage}%`
                        : "Variable"}
                    </TableCell>
                    <TableCell>
                      {rule.payout_frequency === "per_job" && "Per Job"}
                      {rule.payout_frequency === "weekly" && "Weekly"}
                      {rule.payout_frequency === "biweekly" && "Bi-Weekly"}
                      {rule.payout_frequency === "monthly" && "Monthly"}
                      {rule.payout_frequency === "quarterly" && "Quarterly"}
                    </TableCell>
                    <TableCell>
                      {rule.is_active ? (
                        <Badge className="bg-success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Commission Types Examples */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flat Percentage Commission</CardTitle>
            <CardDescription>
              Simple percentage-based commission on job value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Job Revenue: $5,000</p>
                  <p className="text-muted-foreground text-sm">
                    Commission Rate: 5%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-success">$250</p>
                  <p className="text-muted-foreground text-xs">
                    Commission Earned
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                Best for: Consistent commission rates across all job types
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiered Commission</CardTitle>
            <CardDescription>
              Different rates based on revenue tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-sm">$0 - $2,500</span>
                  <Badge>3%</Badge>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-sm">$2,501 - $5,000</span>
                  <Badge>5%</Badge>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-sm">$5,001+</span>
                  <Badge>7%</Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                Best for: Incentivizing higher-value jobs and upsells
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Basis Types */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Basis Options</CardTitle>
          <CardDescription>
            Different ways to calculate commission amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Job Revenue</h4>
              <p className="text-muted-foreground text-sm">
                Percentage of total job invoice amount
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Job Profit</h4>
              <p className="text-muted-foreground text-sm">
                Percentage of profit margin (revenue - costs)
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Product Sales</h4>
              <p className="text-muted-foreground text-sm">
                Percentage of physical products sold
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Service Agreements</h4>
              <p className="text-muted-foreground text-sm">
                Commission on recurring service plans sold
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Memberships</h4>
              <p className="text-muted-foreground text-sm">
                Commission on membership sales
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Upsells</h4>
              <p className="text-muted-foreground text-sm">
                Additional services added to original job
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Timing Options */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Timing</CardTitle>
          <CardDescription>When commission is earned and paid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Earn Timing</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm">On Job Completion</span>
                </div>
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">On Invoice Sent</span>
                </div>
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-sm">On Payment Received</span>
                </div>
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">On Full Payment</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Payout Frequency</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm">Per Job (Immediate)</span>
                </div>
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">Weekly</span>
                </div>
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-sm">Bi-Weekly</span>
                </div>
                <div className="flex items-center gap-2 rounded border p-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">Monthly</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
