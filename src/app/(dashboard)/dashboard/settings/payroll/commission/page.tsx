/**
 * Commission Settings Page
 *
 * Configure commission structures, tiers, and rules for technicians
 */

import { TrendingUp, Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCommissionRules } from "@/actions/settings";

export default async function CommissionSettingsPage() {
  const result = await getCommissionRules();
  const rules = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Commission Settings</h1>
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
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter((r: any) => r.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {rules.length} total rules configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Revenue Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter((r: any) => r.commission_basis === "job_revenue").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Most common commission type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upsell Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter((r: any) => r.commission_basis === "upsells").length}
            </div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Commission Rules</h3>
              <p className="text-sm text-muted-foreground mt-2">
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
                    <TableCell className="font-medium">{rule.rule_name}</TableCell>
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
                      {rule.rate_type === "flat_percentage" && rule.flat_percentage
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
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Job Revenue: $5,000</p>
                  <p className="text-sm text-muted-foreground">Commission Rate: 5%</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">$250</p>
                  <p className="text-xs text-muted-foreground">Commission Earned</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
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
                <div className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">$0 - $2,500</span>
                  <Badge>3%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">$2,501 - $5,000</span>
                  <Badge>5%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">$5,001+</span>
                  <Badge>7%</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
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
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Job Revenue</h4>
              <p className="text-sm text-muted-foreground">
                Percentage of total job invoice amount
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Job Profit</h4>
              <p className="text-sm text-muted-foreground">
                Percentage of profit margin (revenue - costs)
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Product Sales</h4>
              <p className="text-sm text-muted-foreground">
                Percentage of physical products sold
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Service Agreements</h4>
              <p className="text-sm text-muted-foreground">
                Commission on recurring service plans sold
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Memberships</h4>
              <p className="text-sm text-muted-foreground">
                Commission on membership sales
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Upsells</h4>
              <p className="text-sm text-muted-foreground">
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
          <CardDescription>
            When commission is earned and paid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Earn Timing</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">On Job Completion</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">On Invoice Sent</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">On Payment Received</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm">On Full Payment</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Payout Frequency</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Per Job (Immediate)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">Weekly</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">Bi-Weekly</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
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
