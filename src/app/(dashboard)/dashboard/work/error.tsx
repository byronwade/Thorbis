"use client";

/**
 * Error boundary for Work page
 * Displays a centered, non-scrollable error state with helpful information
 * Mobile-friendly design
 */

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Work page error:", error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        {/* Error Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="font-semibold text-xl">Something went wrong</h2>
          <p className="text-muted-foreground text-sm">
            An error occurred while loading this page. This has been logged and
            we'll look into it.
          </p>
        </div>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
            <p className="font-mono text-destructive text-xs">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} variant="default">
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            variant="outline"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
