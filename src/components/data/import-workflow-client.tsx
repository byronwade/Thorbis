"use client";

/**
 * Import Workflow Client Component
 *
 * Manages multi-step import process with state management
 */

import {
  AlertCircle,
  Check,
  CheckCircle,
  Eye,
  FileSpreadsheet,
  Play,
  Upload,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

type ImportStep =
  | "upload"
  | "mapping"
  | "preview"
  | "dry-run"
  | "confirm"
  | "importing"
  | "results";

interface ImportWorkflowClientProps {
  dataType: string;
}

export function ImportWorkflowClient({ dataType }: ImportWorkflowClientProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const steps: { id: ImportStep; label: string; icon: React.ReactNode }[] = [
    { id: "upload", label: "Upload File", icon: <Upload className="size-4" /> },
    {
      id: "mapping",
      label: "Column Mapping",
      icon: <FileSpreadsheet className="size-4" />,
    },
    {
      id: "preview",
      label: "Preview & Validate",
      icon: <Eye className="size-4" />,
    },
    { id: "dry-run", label: "Dry Run", icon: <Play className="size-4" /> },
    { id: "confirm", label: "Confirm", icon: <Check className="size-4" /> },
  ];

  const getStepIndex = (step: ImportStep) =>
    steps.findIndex((s) => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  const formatDataType = (type: string) =>
    type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Import {formatDataType(dataType)}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Follow the steps below to import your data safely
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div className="flex flex-1 items-center" key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 ${
                      index <= currentStepIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="size-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs ${
                      index <= currentStepIndex
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload an Excel (.xlsx, .xls) or CSV file to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12">
              <div className="text-center">
                <Upload className="mx-auto size-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium text-lg">Upload your file</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  Drag and drop or click to browse
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Maximum file size: 10MB
                </p>
                <Button className="mt-4" variant="default">
                  Choose File
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/5 p-4">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="mt-0.5 size-5 shrink-0 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Don't have a template?</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Download our Excel template with the correct format and
                    example data
                  </p>
                  <Button className="mt-2" size="sm" variant="outline">
                    <FileSpreadsheet className="mr-2 size-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setCurrentStep("mapping")}
                variant="default"
              >
                Next: Column Mapping
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "mapping" && (
        <Card>
          <CardHeader>
            <CardTitle>Column Mapping</CardTitle>
            <CardDescription>
              Map your spreadsheet columns to the correct fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Column mapping interface will be rendered here
              </p>
            </div>

            <div className="flex justify-between gap-2">
              <Button
                onClick={() => setCurrentStep("upload")}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("preview")}
                variant="default"
              >
                Next: Preview Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "preview" && (
        <Card>
          <CardHeader>
            <CardTitle>Preview & Validate</CardTitle>
            <CardDescription>
              Review your data and fix any validation errors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Validation Summary</p>
                  <p className="text-muted-foreground text-xs">
                    1,247 total rows detected
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">1,200 Valid</Badge>
                  <Badge className="bg-yellow-500">32 Warnings</Badge>
                  <Badge className="bg-red-500">15 Errors</Badge>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Preview table with validation highlighting will be rendered here
              </p>
            </div>

            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-yellow-500" />
                <div>
                  <p className="font-medium text-sm">Validation Errors Found</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    15 rows have errors that must be fixed before import. You
                    can either fix them in the preview or download an error
                    report.
                  </p>
                  <Button className="mt-2" size="sm" variant="outline">
                    Download Error Report
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button
                onClick={() => setCurrentStep("mapping")}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("dry-run")}
                variant="default"
              >
                Next: Dry Run
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "dry-run" && (
        <Card>
          <CardHeader>
            <CardTitle>Dry Run Simulation</CardTitle>
            <CardDescription>
              See what will happen without making any changes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Will Create</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl">1,150</p>
                  <p className="text-muted-foreground text-xs">new records</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Will Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl">50</p>
                  <p className="text-muted-foreground text-xs">
                    existing records
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Will Skip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl">47</p>
                  <p className="text-muted-foreground text-xs">duplicates</p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Dry Run Successful</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    No errors detected. Your data is ready to import.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button
                onClick={() => setCurrentStep("preview")}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("confirm")}
                variant="default"
              >
                Next: Confirm Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Import</CardTitle>
            <CardDescription>
              Review and confirm your import settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">Total Records</p>
                  <p className="text-muted-foreground text-xs">
                    1,200 records will be imported
                  </p>
                </div>
                <Badge>1,200</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">Import Method</p>
                  <p className="text-muted-foreground text-xs">
                    Create new & update existing
                  </p>
                </div>
                <Badge>Upsert</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">Backup</p>
                  <p className="text-muted-foreground text-xs">
                    Current data will be backed up for 24 hours
                  </p>
                </div>
                <Badge className="bg-green-500">Enabled</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-red-500/50 bg-red-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                <div>
                  <p className="font-medium text-sm">Large Import Detected</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    This import contains more than 100 records and requires
                    admin approval. An admin will be notified to review and
                    approve this import.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button
                onClick={() => setCurrentStep("dry-run")}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setCurrentStep("importing");
                  // Simulate import progress
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += 10;
                    setImportProgress(progress);
                    if (progress >= 100) {
                      clearInterval(interval);
                      setTimeout(() => setCurrentStep("results"), 500);
                    }
                  }, 500);
                }}
                variant="default"
              >
                Start Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "importing" && (
        <Card>
          <CardHeader>
            <CardTitle>Importing Data...</CardTitle>
            <CardDescription>
              Please wait while your data is being imported
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Progress</p>
                <p className="font-medium text-sm">{importProgress}%</p>
              </div>
              <Progress value={importProgress} />
              <p className="text-center text-muted-foreground text-xs">
                Importing batch {Math.floor(importProgress / 10)} of 10...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "results" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="size-6 text-green-500" />
              Import Completed Successfully
            </CardTitle>
            <CardDescription>Your data has been imported</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl text-green-600">1,150</p>
                  <p className="text-muted-foreground text-xs">new records</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl text-blue-600">50</p>
                  <p className="text-muted-foreground text-xs">
                    existing records
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Skipped</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl text-yellow-600">47</p>
                  <p className="text-muted-foreground text-xs">duplicates</p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border border-green-500/50 bg-green-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Backup Created</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    A backup has been created and will be available for 24
                    hours. You can undo this import from the import history
                    page.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">View Import History</Button>
              <Button variant="default">Done</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
