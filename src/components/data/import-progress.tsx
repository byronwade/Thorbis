"use client";

/**
 * Import Progress Component
 *
 * Displays real-time progress for import operations
 */

import { CheckCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ImportProgressProps {
  status: "uploading" | "validating" | "importing" | "completed" | "failed";
  progress: number;
  currentBatch?: number;
  totalBatches?: number;
  message?: string;
}

export function ImportProgress({
  status,
  progress,
  currentBatch,
  totalBatches,
  message,
}: ImportProgressProps) {
  const getStatusMessage = () => {
    switch (status) {
      case "uploading":
        return "Uploading file...";
      case "validating":
        return "Validating data...";
      case "importing":
        return `Importing batch ${currentBatch || 1} of ${totalBatches || 1}...`;
      case "completed":
        return "Import completed successfully!";
      case "failed":
        return "Import failed";
      default:
        return "Processing...";
    }
  };

  const isComplete = status === "completed";
  const isFailed = status === "failed";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="size-5 text-green-500" />
          ) : (
            <Loader2 className="size-5 animate-spin" />
          )}
          {getStatusMessage()}
        </CardTitle>
        <CardDescription>
          {message || "Please wait while your data is being processed"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Progress</p>
            <p className="font-medium text-sm">{progress}%</p>
          </div>
          <Progress className={isFailed ? "bg-red-100" : ""} value={progress} />
        </div>

        {currentBatch && totalBatches && (
          <p className="text-center text-muted-foreground text-xs">
            Processing batch {currentBatch} of {totalBatches}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
