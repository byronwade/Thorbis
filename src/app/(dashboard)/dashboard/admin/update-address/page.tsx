/**
 * Quick admin page to update ALL property addresses for testing
 * DELETE THIS FILE AFTER TESTING
 */

"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function UpdateAddressPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);

  const handleSetup = async () => {
    setSetupLoading(true);
    setSetupResult(null);

    try {
      // Use service role endpoint to bypass RLS
      const response = await fetch("/api/admin/setup-with-service-role", {
        method: "POST",
      });

      const data = await response.json();
      setSetupResult(data);
    } catch (error: any) {
      setSetupResult({ error: error.message });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/update-byron-address", {
        method: "POST",
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Test Enrichment Feature</h1>

      {/* Step 1: Setup Test Company */}
      <div className="mb-6 rounded border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-2 font-semibold">Step 1: Create Test Company</h2>
        <p className="mb-3 text-sm">
          First, create a test company with sample data (customer, property, job)
        </p>
        <Button onClick={handleSetup} disabled={setupLoading} variant="default">
          {setupLoading ? "Setting up..." : "Create Test Company & Data"}
        </Button>

        {setupResult && (
          <div
            className={`mt-3 rounded p-3 ${setupResult.success ? "border border-green-300 bg-green-100" : "border border-red-300 bg-red-100"}`}
          >
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(setupResult, null, 2)}
            </pre>
          </div>
        )}

        {setupResult?.success && setupResult.job && (
          <div className="mt-3 rounded border border-green-300 bg-green-100 p-3">
            <p className="mb-2 font-semibold text-sm">✅ Ready to test!</p>
            <a
              href={`/dashboard/work/${setupResult.job.id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              View Test Job → See Enrichment Data
            </a>
          </div>
        )}
      </div>

      {/* Step 2: Update Existing Properties (if needed) */}
      <div className="mb-6">
        <h2 className="mb-2 font-semibold">Step 2: Update Existing Properties (Optional)</h2>
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This will update <strong>ALL</strong> properties in your company to the
            test address below. Only use this for testing the enrichment feature!
          </AlertDescription>
        </Alert>

        <div className="mb-4 rounded bg-muted p-4">
        <p className="mb-2 font-medium">New Address (all properties):</p>
        <p>165 Rock Building Lane</p>
        <p>Talking Rock, GA 30175</p>
        <p className="mt-2 text-muted-foreground text-sm">
          This is a real address that will geocode successfully and show weather,
          water quality, flood zones, and nearby suppliers.
        </p>
      </div>

      <Button onClick={handleUpdate} disabled={loading} className="mb-4">
        {loading ? "Updating..." : "Update All Properties to Test Address"}
      </Button>

      {result && (
        <div
          className={`rounded p-4 ${result.success ? "border border-green-200 bg-green-50" : "border border-red-200 bg-red-50"}`}
        >
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {result?.success && (
        <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 font-medium">✅ Success!</p>
          <p className="mb-3 text-sm">
            Updated <strong>{result.propertiesUpdated}</strong> properties.
          </p>
          <p className="mb-2 font-medium text-sm">Next steps:</p>
          <ol className="list-inside list-decimal space-y-1 text-sm">
            <li>Go to any existing job in the Work page</li>
            <li>View the job details</li>
            <li>
              You should now see the <strong>"Operational Intelligence"</strong>{" "}
              section!
            </li>
            <li>Check your terminal for enrichment logs</li>
          </ol>
        </div>
      )}
      </div>
    </div>
  );
}

