"use client";

import {
  ArrowLeftRight,
  Layers,
  Plus,
  Save,
  Target,
  Trash2,
  TrendingUp,
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
import { usePageLayout } from "@/hooks/use-page-layout";

type VirtualBucket = {
  id: string;
  name: string;
  description: string;
  color: string;
  currentBalance: number;
  targetAmount: number;
  autoAllocate: boolean;
  allocationType: "percentage" | "fixed";
  allocationValue: number;
  linkedAccount: string;
};

export default function VirtualBucketsSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [buckets, _setBuckets] = useState<VirtualBucket[]>([
    {
      id: "1",
      name: "Tax Reserve",
      description: "Quarterly tax payments",
      color: "blue",
      currentBalance: 15_000,
      targetAmount: 25_000,
      autoAllocate: true,
      allocationType: "percentage",
      allocationValue: 25,
      linkedAccount: "Business Checking",
    },
    {
      id: "2",
      name: "Emergency Fund",
      description: "3 months operating expenses",
      color: "green",
      currentBalance: 45_000,
      targetAmount: 75_000,
      autoAllocate: true,
      allocationType: "percentage",
      allocationValue: 10,
      linkedAccount: "Business Savings",
    },
    {
      id: "3",
      name: "Equipment Reserve",
      description: "Vehicle and tool replacement",
      color: "orange",
      currentBalance: 8500,
      targetAmount: 20_000,
      autoAllocate: false,
      allocationType: "fixed",
      allocationValue: 500,
      linkedAccount: "Business Checking",
    },
  ]);

  const handleSave = () => {
    // TODO: Implement save logic
    setHasUnsavedChanges(false);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
    };
    return colors[color] || "bg-gray-500";
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Virtual Account Buckets
            </h1>
            <p className="mt-2 text-muted-foreground">
              Organize and allocate funds with virtual savings buckets
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Bucket
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Total Allocated
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">$68,500</div>
              <p className="text-muted-foreground text-xs">
                Across {buckets.length} buckets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Target Goals
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">$120,000</div>
              <p className="text-muted-foreground text-xs">
                57% of target reached
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Auto-Allocated
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">$2,450</div>
              <p className="text-muted-foreground text-xs">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Buckets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Virtual Buckets</CardTitle>
            <CardDescription>
              Manage your savings goals and automatic allocations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {buckets.map((bucket) => (
              <Card key={bucket.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex size-12 items-center justify-center rounded-lg ${getColorClass(bucket.color)}/10`}
                        >
                          <Layers
                            className={`size-6 ${getColorClass(bucket.color).replace("bg-", "text-")}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{bucket.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {bucket.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Linked to: {bucket.linkedAccount}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          ${bucket.currentBalance.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          / ${bucket.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full ${getColorClass(bucket.color)}`}
                          style={{
                            width: `${(bucket.currentBalance / bucket.targetAmount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Target Amount</Label>
                        <Input
                          onChange={() => setHasUnsavedChanges(true)}
                          placeholder="Target"
                          type="number"
                          value={bucket.targetAmount}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Allocation Type</Label>
                        <Select
                          onValueChange={() => setHasUnsavedChanges(true)}
                          value={bucket.allocationType}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Percentage
                            </SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">
                          {bucket.allocationType === "percentage"
                            ? "Percentage (%)"
                            : "Amount ($)"}
                        </Label>
                        <Input
                          onChange={() => setHasUnsavedChanges(true)}
                          placeholder="Value"
                          type="number"
                          value={bucket.allocationValue}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs">Auto-Allocate</Label>
                        <p className="text-muted-foreground text-xs">
                          Automatically allocate from deposits
                        </p>
                      </div>
                      <Switch
                        checked={bucket.autoAllocate}
                        onCheckedChange={() => setHasUnsavedChanges(true)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline">
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Transfer Funds
                      </Button>
                      <Button className="flex-1" variant="outline">
                        View History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Virtual Bucket
            </Button>
          </CardContent>
        </Card>

        {/* Allocation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Settings</CardTitle>
            <CardDescription>
              Configure how funds are automatically allocated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Allocate on Deposits</Label>
                <p className="text-muted-foreground text-sm">
                  Automatically allocate funds when deposits are received
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Round-Up Transfers</Label>
                <p className="text-muted-foreground text-sm">
                  Round up transactions and transfer difference to buckets
                </p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="allocation-frequency">Allocation Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="allocation-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stop at Target</Label>
                <p className="text-muted-foreground text-sm">
                  Stop auto-allocation when bucket reaches target
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Layers className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Virtual Buckets Help You Save
              </p>
              <p className="text-muted-foreground text-sm">
                Virtual buckets don't move money between accounts. They simply
                track and allocate portions of your existing balance toward
                specific goals, helping you manage cash flow and save for future
                expenses.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
