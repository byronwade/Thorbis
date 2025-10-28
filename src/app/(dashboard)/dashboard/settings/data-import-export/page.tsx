"use client";

/**
 * Settings > Data Import Export Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertCircle,
  CheckCircle,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Upload,
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
type DataCategory = {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  supportsImport: boolean;
  supportsExport: boolean;
  fields: string[];
};

const dataCategories: DataCategory[] = [
  {
    id: "customers",
    name: "Customers",
    description: "Customer profiles and contact information",
    recordCount: 1247,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Name",
      "Email",
      "Phone",
      "Address",
      "Tags",
      "Notes",
      "Created Date",
    ],
  },
  {
    id: "jobs",
    name: "Jobs & Work Orders",
    description: "Job details, assignments, and status",
    recordCount: 3892,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Job Number",
      "Customer",
      "Status",
      "Technician",
      "Scheduled Date",
      "Total",
      "Notes",
    ],
  },
  {
    id: "invoices",
    name: "Invoices",
    description: "Invoice data and payment records",
    recordCount: 2156,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Invoice Number",
      "Customer",
      "Date",
      "Due Date",
      "Amount",
      "Status",
      "Payment Method",
    ],
  },
  {
    id: "estimates",
    name: "Estimates & Quotes",
    description: "Estimate details and line items",
    recordCount: 892,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Estimate Number",
      "Customer",
      "Date",
      "Valid Until",
      "Total",
      "Status",
      "Notes",
    ],
  },
  {
    id: "products",
    name: "Products & Services",
    description: "Price book items and service catalog",
    recordCount: 456,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "SKU",
      "Name",
      "Category",
      "Description",
      "Price",
      "Cost",
      "In Stock",
    ],
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Stock levels and warehouse data",
    recordCount: 1234,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Item",
      "SKU",
      "Location",
      "Quantity",
      "Reorder Point",
      "Supplier",
      "Last Updated",
    ],
  },
  {
    id: "team",
    name: "Team Members",
    description: "Employee and technician information",
    recordCount: 28,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Hourly Rate",
      "Hire Date",
      "Status",
    ],
  },
  {
    id: "schedule",
    name: "Schedule & Appointments",
    description: "Appointments and time blocks",
    recordCount: 4521,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Date",
      "Time",
      "Duration",
      "Customer",
      "Technician",
      "Job Type",
      "Status",
    ],
  },
  {
    id: "payments",
    name: "Payments",
    description: "Payment transactions and receipts",
    recordCount: 1987,
    supportsImport: false,
    supportsExport: true,
    fields: [
      "Date",
      "Customer",
      "Invoice",
      "Amount",
      "Method",
      "Status",
      "Reference",
    ],
  },
  {
    id: "expenses",
    name: "Expenses",
    description: "Business expense tracking",
    recordCount: 743,
    supportsImport: true,
    supportsExport: true,
    fields: [
      "Date",
      "Category",
      "Vendor",
      "Amount",
      "Payment Method",
      "Receipt",
      "Notes",
    ],
  },
  {
    id: "reports",
    name: "Report Data",
    description: "Historical reporting data",
    recordCount: 0,
    supportsImport: false,
    supportsExport: true,
    fields: ["Varies by report type"],
  },
  {
    id: "communications",
    name: "Communication History",
    description: "Email, SMS, and call logs",
    recordCount: 8934,
    supportsImport: false,
    supportsExport: true,
    fields: ["Date", "Type", "From", "To", "Subject", "Status", "Content"],
  },
];

export default function DataImportExportPage() {  const [selectedCategory, setSelectedCategory] = useState<string>("customers");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [dateRange, setDateRange] = useState<string>("all");
  const [fileFormat, setFileFormat] = useState<string>("xlsx");

  const currentCategory = dataCategories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Data Import & Export
          </h1>
          <p className="mt-2 text-muted-foreground">
            Import and export your data using Excel-compatible formats
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" />
                Import Data
              </CardTitle>
              <CardDescription>
                Upload Excel files to import data into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  Data Category
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Select what type of data to import
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={setSelectedCategory}
                  value={selectedCategory}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataCategories
                      .filter((cat) => cat.supportsImport)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-muted-foreground text-xs">
                  {currentCategory?.description}
                </p>
              </div>

              <Separator />

              <div>
                <Label>Upload File</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Button className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Excel File (.xlsx, .xls, .csv)
                  </Button>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Maximum file size: 10MB
                </p>
              </div>

              <Separator />

              <div className="rounded-lg border bg-blue-500/5 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-sm">
                  <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                  Required Fields for {currentCategory?.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {currentCategory?.fields.map((field) => (
                    <span
                      className="rounded bg-blue-500/10 px-2 py-1 text-blue-700 text-xs dark:text-blue-400"
                      key={field}
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline">
                  Download Template
                </Button>
                <Button className="flex-1" disabled>
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-500" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download your data as Excel files for backup or analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Data Category</Label>
                <Select
                  onValueChange={setSelectedCategory}
                  value={selectedCategory}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataCategories
                      .filter((cat) => cat.supportsExport)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({cat.recordCount} records)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label>Date Range</Label>
                <Select onValueChange={setDateRange} value={dateRange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="last-90">Last 90 Days</SelectItem>
                    <SelectItem value="last-30">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label>File Format</Label>
                <Select onValueChange={setFileFormat} value={fileFormat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem value="xls">Excel 97-2003 (.xls)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-sm">Include Archived Records</Label>
                  <p className="text-muted-foreground text-xs">
                    Export deleted and archived items
                  </p>
                </div>
                <Switch
                  checked={includeArchived}
                  onCheckedChange={setIncludeArchived}
                />
              </div>

              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export {currentCategory?.recordCount} Records
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Export Options</CardTitle>
            <CardDescription>
              Download commonly requested data exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto flex-col gap-2 py-4" variant="outline">
                <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                <div className="text-center">
                  <p className="font-medium text-sm">Customer List</p>
                  <p className="text-muted-foreground text-xs">1,247 records</p>
                </div>
              </Button>

              <Button className="h-auto flex-col gap-2 py-4" variant="outline">
                <FileSpreadsheet className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <p className="font-medium text-sm">Invoice Report</p>
                  <p className="text-muted-foreground text-xs">YTD data</p>
                </div>
              </Button>

              <Button className="h-auto flex-col gap-2 py-4" variant="outline">
                <FileSpreadsheet className="h-8 w-8 text-purple-500" />
                <div className="text-center">
                  <p className="font-medium text-sm">Product Catalog</p>
                  <p className="text-muted-foreground text-xs">456 items</p>
                </div>
              </Button>

              <Button className="h-auto flex-col gap-2 py-4" variant="outline">
                <FileSpreadsheet className="h-8 w-8 text-orange-500" />
                <div className="text-center">
                  <p className="font-medium text-sm">Complete Backup</p>
                  <p className="text-muted-foreground text-xs">All data</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <div className="space-y-2">
              <p className="font-medium text-orange-700 text-sm dark:text-orange-400">
                Important Data Import Guidelines
              </p>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    Always download and use the provided Excel template to
                    ensure correct formatting
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    Backup your existing data before importing to prevent data
                    loss
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    Duplicate records will be updated based on unique
                    identifiers (email, phone, or ID)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    Large imports (over 1,000 records) may take several minutes
                    to process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    You'll receive an email notification when the import
                    completes
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="space-y-1">
              <p className="font-medium text-red-700 text-sm dark:text-red-400">
                Data Deletion Protection
              </p>
              <p className="text-muted-foreground text-sm">
                Mass deletion of data is not possible through the import/export
                system. This is a safety feature to prevent accidental data
                loss. Records must be deleted individually through their
                respective management pages. If you need to archive or delete
                large amounts of data, please contact support for assistance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Export History</CardTitle>
            <CardDescription>Recent exports and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Customers Export</p>
                    <p className="text-muted-foreground text-xs">
                      1,247 records • 2 days ago
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Re-download
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Invoice Report YTD</p>
                    <p className="text-muted-foreground text-xs">
                      2,156 records • 1 week ago
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Re-download
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-medium text-sm">Complete Backup</p>
                    <p className="text-muted-foreground text-xs">
                      All data • 2 weeks ago
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Re-download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
