"use client";

import { Crown, Gift, HelpCircle, Save, Star, TrendingUp } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

type Tier = {
  id: string;
  name: string;
  minSpend: number;
  discountPercent: number;
  color: string;
};

export default function LoyaltyRewardsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    enableLoyaltyProgram: true,
    programName: "Rewards Program",
    pointsPerDollar: 10,
    pointsValue: 0.01,
    minimumRedemption: 500,
    pointsExpireDays: 365,
    earnOnTaxes: false,
    earnOnFees: true,
    allowPartialRedemption: true,
    enableReferralRewards: true,
    referrerPoints: 500,
    refereeDiscount: 25,
    referralRequirement: "first_job",
    enableBirthdayReward: true,
    birthdayRewardType: "points",
    birthdayRewardAmount: 100,
    enableAnniversaryReward: true,
    anniversaryRewardType: "discount",
    anniversaryRewardAmount: 15,
    enableTierSystem: true,
    autoUpgradeTiers: true,
    tierReviewPeriod: "annual",
    sendTierChangeNotification: true,
    displayPointsOnInvoice: true,
    displayTierOnProfile: true,
    allowPointsTransfer: false,
  });

  const [tiers, _setTiers] = useState<Tier[]>([
    {
      id: "1",
      name: "Bronze",
      minSpend: 0,
      discountPercent: 0,
      color: "#CD7F32",
    },
    {
      id: "2",
      name: "Silver",
      minSpend: 1000,
      discountPercent: 5,
      color: "#C0C0C0",
    },
    {
      id: "3",
      name: "Gold",
      minSpend: 5000,
      discountPercent: 10,
      color: "#FFD700",
    },
    {
      id: "4",
      name: "Platinum",
      minSpend: 10_000,
      discountPercent: 15,
      color: "#E5E4E2",
    },
  ]);

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Loyalty & Rewards
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure customer loyalty program and rewards
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>
                  Reward customers with points for purchases
                </CardDescription>
              </div>
              <Switch
                checked={settings.enableLoyaltyProgram}
                onCheckedChange={(checked) =>
                  updateSetting("enableLoyaltyProgram", checked)
                }
              />
            </div>
          </CardHeader>
          {settings.enableLoyaltyProgram && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium text-sm">Program Name</Label>
                <Input
                  className="mt-2"
                  onChange={(e) => updateSetting("programName", e.target.value)}
                  placeholder="Rewards Program"
                  value={settings.programName}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Displayed to customers on invoices and portal
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Points Per Dollar Spent
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How many points customers earn per dollar
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    className="mt-2"
                    min="1"
                    onChange={(e) =>
                      updateSetting("pointsPerDollar", Number(e.target.value))
                    }
                    type="number"
                    value={settings.pointsPerDollar}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Example: $100 = {settings.pointsPerDollar * 100} points
                  </p>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Point Value in Dollars
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Dollar value of each point when redeemed
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      min="0.001"
                      onChange={(e) =>
                        updateSetting("pointsValue", Number(e.target.value))
                      }
                      step="0.001"
                      type="number"
                      value={settings.pointsValue}
                    />
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Example: 100 points = $
                    {(100 * settings.pointsValue).toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Minimum Points for Redemption
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Minimum points balance required to redeem
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  min="1"
                  onChange={(e) =>
                    updateSetting("minimumRedemption", Number(e.target.value))
                  }
                  type="number"
                  value={settings.minimumRedemption}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Worth $
                  {(settings.minimumRedemption * settings.pointsValue).toFixed(
                    2
                  )}{" "}
                  in rewards
                </p>
              </div>

              <Separator />

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Points Expiration
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How long points remain valid (0 = never expire)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-32"
                    min="0"
                    onChange={(e) =>
                      updateSetting("pointsExpireDays", Number(e.target.value))
                    }
                    type="number"
                    value={settings.pointsExpireDays}
                  />
                  <span className="text-muted-foreground text-sm">
                    days (0 = never)
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Earn Points on Taxes
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Include tax amount in points calculation
                  </p>
                </div>
                <Switch
                  checked={settings.earnOnTaxes}
                  onCheckedChange={(checked) =>
                    updateSetting("earnOnTaxes", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Earn Points on Service Fees
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Include fees in points calculation
                  </p>
                </div>
                <Switch
                  checked={settings.earnOnFees}
                  onCheckedChange={(checked) =>
                    updateSetting("earnOnFees", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Allow Partial Redemption
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Allow redeeming any amount above minimum
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Redeem any amount above minimum
                  </p>
                </div>
                <Switch
                  checked={settings.allowPartialRedemption}
                  onCheckedChange={(checked) =>
                    updateSetting("allowPartialRedemption", checked)
                  }
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Crown className="h-4 w-4" />
                  Customer Tiers
                </CardTitle>
                <CardDescription>
                  Reward high-value customers with tier benefits
                </CardDescription>
              </div>
              <Switch
                checked={settings.enableTierSystem}
                onCheckedChange={(checked) =>
                  updateSetting("enableTierSystem", checked)
                }
              />
            </div>
          </CardHeader>
          {settings.enableTierSystem && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {tiers.map((tier, index) => (
                  <div
                    className="flex items-center gap-4 rounded-lg border p-4"
                    key={tier.id}
                  >
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{tier.name}</p>
                        {index === 0 && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        ${tier.minSpend.toLocaleString()}+ lifetime spend •{" "}
                        {tier.discountPercent}% discount
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {tier.discountPercent}%
                      </p>
                      <p className="text-muted-foreground text-xs">discount</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Auto-Upgrade Tiers
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Automatically upgrade customers when they reach tier
                          threshold
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Upgrade when spending threshold is reached
                  </p>
                </div>
                <Switch
                  checked={settings.autoUpgradeTiers}
                  onCheckedChange={(checked) =>
                    updateSetting("autoUpgradeTiers", checked)
                  }
                />
              </div>

              <Separator />

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Tier Review Period
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How often to recalculate customer tiers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("tierReviewPeriod", value)
                  }
                  value={settings.tierReviewPeriod}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lifetime">
                      Lifetime (Never Reset)
                    </SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Send Tier Change Notifications
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Notify customers when their tier changes
                  </p>
                </div>
                <Switch
                  checked={settings.sendTierChangeNotification}
                  onCheckedChange={(checked) =>
                    updateSetting("sendTierChangeNotification", checked)
                  }
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Referral Rewards
                </CardTitle>
                <CardDescription>
                  Reward customers for referring new business
                </CardDescription>
              </div>
              <Switch
                checked={settings.enableReferralRewards}
                onCheckedChange={(checked) =>
                  updateSetting("enableReferralRewards", checked)
                }
              />
            </div>
          </CardHeader>
          {settings.enableReferralRewards && (
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Referrer Reward
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Points given to customer who refers
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      min="0"
                      onChange={(e) =>
                        updateSetting("referrerPoints", Number(e.target.value))
                      }
                      type="number"
                      value={settings.referrerPoints}
                    />
                    <span className="text-muted-foreground text-sm">
                      points
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Worth $
                    {(settings.referrerPoints * settings.pointsValue).toFixed(
                      2
                    )}
                  </p>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    New Customer Discount
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Discount given to referred customer
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      min="0"
                      onChange={(e) =>
                        updateSetting("refereeDiscount", Number(e.target.value))
                      }
                      type="number"
                      value={settings.refereeDiscount}
                    />
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    One-time discount on first job
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Reward Requirement
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">When to award referral rewards</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("referralRequirement", value)
                  }
                  value={settings.referralRequirement}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signup">
                      When Referred Signs Up
                    </SelectItem>
                    <SelectItem value="first_job">
                      When Referred Books First Job
                    </SelectItem>
                    <SelectItem value="completed_job">
                      When First Job is Completed
                    </SelectItem>
                    <SelectItem value="paid_invoice">
                      When First Invoice is Paid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-4 w-4" />
              Special Occasion Rewards
            </CardTitle>
            <CardDescription>
              Celebrate customer birthdays and anniversaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Birthday Reward</Label>
                <p className="text-muted-foreground text-xs">
                  Send reward on customer's birthday
                </p>
              </div>
              <Switch
                checked={settings.enableBirthdayReward}
                onCheckedChange={(checked) =>
                  updateSetting("enableBirthdayReward", checked)
                }
              />
            </div>

            {settings.enableBirthdayReward && (
              <div className="ml-6 grid gap-4 border-l-2 pl-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm">Reward Type</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("birthdayRewardType", value)
                    }
                    value={settings.birthdayRewardType}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="credit">Account Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Amount</Label>
                  <div className="mt-2 flex items-center gap-2">
                    {settings.birthdayRewardType === "discount" && (
                      <>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "birthdayRewardAmount",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.birthdayRewardAmount}
                        />
                        <span className="text-muted-foreground text-sm">%</span>
                      </>
                    )}
                    {settings.birthdayRewardType === "points" && (
                      <>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "birthdayRewardAmount",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.birthdayRewardAmount}
                        />
                        <span className="text-muted-foreground text-sm">
                          points
                        </span>
                      </>
                    )}
                    {settings.birthdayRewardType === "credit" && (
                      <>
                        <span className="text-muted-foreground">$</span>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "birthdayRewardAmount",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.birthdayRewardAmount}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Customer Anniversary Reward
                </Label>
                <p className="text-muted-foreground text-xs">
                  Reward on anniversary of first job
                </p>
              </div>
              <Switch
                checked={settings.enableAnniversaryReward}
                onCheckedChange={(checked) =>
                  updateSetting("enableAnniversaryReward", checked)
                }
              />
            </div>

            {settings.enableAnniversaryReward && (
              <div className="ml-6 grid gap-4 border-l-2 pl-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm">Reward Type</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("anniversaryRewardType", value)
                    }
                    value={settings.anniversaryRewardType}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="credit">Account Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Amount</Label>
                  <div className="mt-2 flex items-center gap-2">
                    {settings.anniversaryRewardType === "discount" && (
                      <>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "anniversaryRewardAmount",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.anniversaryRewardAmount}
                        />
                        <span className="text-muted-foreground text-sm">%</span>
                      </>
                    )}
                    {settings.anniversaryRewardType === "points" && (
                      <>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "anniversaryRewardAmount",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.anniversaryRewardAmount}
                        />
                        <span className="text-muted-foreground text-sm">
                          points
                        </span>
                      </>
                    )}
                    {settings.anniversaryRewardType === "credit" && (
                      <>
                        <span className="text-muted-foreground">$</span>
                        <Input
                          min="0"
                          onChange={(e) =>
                            updateSetting(
                              "anniversaryRewardAmount",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.anniversaryRewardAmount}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
            <CardDescription>
              Configure how rewards are displayed to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Display Points on Invoices
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show points earned on invoice
                </p>
              </div>
              <Switch
                checked={settings.displayPointsOnInvoice}
                onCheckedChange={(checked) =>
                  updateSetting("displayPointsOnInvoice", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Display Tier on Profile
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show customer tier badge on profile
                </p>
              </div>
              <Switch
                checked={settings.displayTierOnProfile}
                onCheckedChange={(checked) =>
                  updateSetting("displayTierOnProfile", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Points Transfer
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow customers to transfer points to another customer
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Transfer points between customer accounts
                </p>
              </div>
              <Switch
                checked={settings.allowPointsTransfer}
                onCheckedChange={(checked) =>
                  updateSetting("allowPointsTransfer", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Star className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Loyalty Program Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Start with a simple points system before adding tiers. Set point
                values that encourage repeat business (typically 1-5% return).
                Use referral rewards to drive new customer acquisition. Track
                redemption rates monthly and adjust rewards to maintain 20-30%
                redemption rates for optimal engagement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
