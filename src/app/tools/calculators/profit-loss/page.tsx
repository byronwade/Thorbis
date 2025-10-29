"use client";

/**
 * Profit & Loss Calculator - Client Component
 *
 * Client-side features:
 * - Revenue and expense tracking
 * - Real-time P&L calculations
 * - Margin analysis
 */

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProfitLossCalculator() {
  // Revenue
  const [revenue, setRevenue] = useState<string>("250000");

  // Cost of Goods Sold
  const [materials, setMaterials] = useState<string>("50000");
  const [directLabor, setDirectLabor] = useState<string>("60000");
  const [equipmentCosts, setEquipmentCosts] = useState<string>("10000");

  // Operating Expenses
  const [rent, setRent] = useState<string>("24000");
  const [insurance, setInsurance] = useState<string>("12000");
  const [utilities, setUtilities] = useState<string>("6000");
  const [marketing, setMarketing] = useState<string>("8000");
  const [adminSalaries, setAdminSalaries] = useState<string>("40000");
  const [officeSupplies, setOfficeSupplies] = useState<string>("3000");
  const [vehicleMaintenance, setVehicleMaintenance] = useState<string>("8000");
  const [otherExpenses, setOtherExpenses] = useState<string>("5000");

  // Calculations
  const revenueNum = parseFloat(revenue) || 0;

  const materialsNum = parseFloat(materials) || 0;
  const laborNum = parseFloat(directLabor) || 0;
  const equipmentNum = parseFloat(equipmentCosts) || 0;
  const cogs = materialsNum + laborNum + equipmentNum;

  const grossProfit = revenueNum - cogs;
  const grossMargin = revenueNum > 0 ? (grossProfit / revenueNum) * 100 : 0;

  const rentNum = parseFloat(rent) || 0;
  const insuranceNum = parseFloat(insurance) || 0;
  const utilitiesNum = parseFloat(utilities) || 0;
  const marketingNum = parseFloat(marketing) || 0;
  const adminNum = parseFloat(adminSalaries) || 0;
  const suppliesNum = parseFloat(officeSupplies) || 0;
  const vehicleNum = parseFloat(vehicleMaintenance) || 0;
  const otherNum = parseFloat(otherExpenses) || 0;

  const totalOperatingExpenses = rentNum + insuranceNum + utilitiesNum + marketingNum +
                                adminNum + suppliesNum + vehicleNum + otherNum;

  const operatingProfit = grossProfit - totalOperatingExpenses;
  const operatingMargin = revenueNum > 0 ? (operatingProfit / revenueNum) * 100 : 0;

  const netProfit = operatingProfit;
  const netMargin = revenueNum > 0 ? (netProfit / revenueNum) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <TrendingUp className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">Profit & Loss Calculator</h1>
              <Badge variant="secondary">Popular</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Track revenue, expenses, and calculate your net profit margins
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-5" />
            Understanding Your P&L Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>A P&L statement shows:</p>
          <ul className="ml-4 space-y-1 list-disc">
            <li><strong>Gross Profit:</strong> Revenue minus direct costs (materials, labor)</li>
            <li><strong>Operating Profit:</strong> Gross profit minus operating expenses</li>
            <li><strong>Net Profit:</strong> Your bottom line after all expenses</li>
            <li><strong>Profit Margins:</strong> Profitability as percentage of revenue</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Revenue
              </CardTitle>
              <CardDescription>Total income from sales and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="revenue">Total Revenue ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="250000"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="size-5" />
                Cost of Goods Sold (COGS)
              </CardTitle>
              <CardDescription>Direct costs to deliver services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="materials">Materials & Supplies ($)</Label>
                <Input
                  id="materials"
                  type="number"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="labor">Direct Labor Costs ($)</Label>
                <Input
                  id="labor"
                  type="number"
                  value={directLabor}
                  onChange={(e) => setDirectLabor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment & Tools ($)</Label>
                <Input
                  id="equipment"
                  type="number"
                  value={equipmentCosts}
                  onChange={(e) => setEquipmentCosts(e.target.value)}
                />
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold text-sm">Total COGS:</span>
                <span className="font-bold">${cogs.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5" />
                Operating Expenses
              </CardTitle>
              <CardDescription>Overhead and administrative costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent" className="text-sm">Rent/Lease ($)</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance" className="text-sm">Insurance ($)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilities" className="text-sm">Utilities ($)</Label>
                  <Input
                    id="utilities"
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketing" className="text-sm">Marketing ($)</Label>
                  <Input
                    id="marketing"
                    type="number"
                    value={marketing}
                    onChange={(e) => setMarketing(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin" className="text-sm">Admin Salaries ($)</Label>
                  <Input
                    id="admin"
                    type="number"
                    value={adminSalaries}
                    onChange={(e) => setAdminSalaries(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplies" className="text-sm">Office Supplies ($)</Label>
                  <Input
                    id="supplies"
                    type="number"
                    value={officeSupplies}
                    onChange={(e) => setOfficeSupplies(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-sm">Vehicle Maint. ($)</Label>
                  <Input
                    id="vehicle"
                    type="number"
                    value={vehicleMaintenance}
                    onChange={(e) => setVehicleMaintenance(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other" className="text-sm">Other Expenses ($)</Label>
                  <Input
                    id="other"
                    type="number"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold text-sm">Total Operating Expenses:</span>
                <span className="font-bold">${totalOperatingExpenses.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card className={`border-2 ${netProfit >= 0 ? 'border-green-500/20 bg-gradient-to-br from-green-500/10' : 'border-red-500/20 bg-gradient-to-br from-red-500/10'} to-transparent`}>
            <CardHeader>
              <CardTitle>Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">Your Bottom Line</p>
                  <p className={`font-bold text-5xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netProfit.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Net Margin</p>
                    <p className={`font-semibold text-2xl ${netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netMargin.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Total Revenue</p>
                    <p className="font-semibold text-2xl">${revenueNum.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profit & Loss Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Revenue</span>
                  <span>${revenueNum.toLocaleString()}</span>
                </div>

                <div className="ml-4 space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Materials</span>
                    <span>-${materialsNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Direct Labor</span>
                    <span>-${laborNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Equipment</span>
                    <span>-${equipmentNum.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between border-y py-2 font-semibold">
                  <span>Gross Profit</span>
                  <div className="text-right">
                    <div>${grossProfit.toLocaleString()}</div>
                    <div className="text-muted-foreground text-xs">{grossMargin.toFixed(1)}% margin</div>
                  </div>
                </div>

                <div className="ml-4 space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Rent/Lease</span>
                    <span>-${rentNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Insurance</span>
                    <span>-${insuranceNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Admin Salaries</span>
                    <span>-${adminNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Marketing</span>
                    <span>-${marketingNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Other Operating</span>
                    <span>-${(utilitiesNum + suppliesNum + vehicleNum + otherNum).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between border-y py-2 font-semibold">
                  <span>Operating Profit</span>
                  <div className="text-right">
                    <div>${operatingProfit.toLocaleString()}</div>
                    <div className="text-muted-foreground text-xs">{operatingMargin.toFixed(1)}% margin</div>
                  </div>
                </div>

                <div className={`flex justify-between border-t-2 pt-2 font-bold text-lg ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>Net Profit</span>
                  <div className="text-right">
                    <div>${netProfit.toLocaleString()}</div>
                    <div className="text-muted-foreground text-xs">{netMargin.toFixed(1)}% margin</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4" />
                Industry Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Healthy trade businesses typically have:</p>
              <ul className="ml-4 space-y-1 list-disc">
                <li>Gross Margin: 40-60%</li>
                <li>Operating Margin: 15-25%</li>
                <li>Net Margin: 10-20%</li>
                <li>COGS: 40-60% of revenue</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
