"use client";

import { useState } from "react";
import { fixCompanyTelnyxWebhooks, enablePhoneNumberMessaging } from "@/actions/telnyx-provisioning";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

export default function TestWebhookFix() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [messagingResult, setMessagingResult] = useState<any>(null);
  const [messagingLoading, setMessagingLoading] = useState(false);

  const handleFix = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fixCompanyTelnyxWebhooks(TEST_COMPANY_ID);
      setResult(res);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMessaging = async () => {
    setMessagingLoading(true);
    setMessagingResult(null);
    try {
      const res = await enablePhoneNumberMessaging(TEST_COMPANY_ID);
      setMessagingResult(res);
    } catch (error: any) {
      setMessagingResult({ success: false, error: error.message });
    } finally {
      setMessagingLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fix Test Company Telnyx Configuration</h1>
      <p className="mb-4">Company ID: {TEST_COMPANY_ID}</p>

      <div className="space-y-4 mb-6">
        <button
          onClick={handleFix}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mr-4"
        >
          {loading ? "Fixing..." : "Fix Webhook URLs"}
        </button>

        <button
          onClick={handleEnableMessaging}
          disabled={messagingLoading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {messagingLoading ? "Enabling..." : "Enable SMS/MMS"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold mb-2">
            Result: {result.success ? "✅ Success" : "❌ Failed"}
          </h2>
          {result.error && <p className="text-red-600">Error: {result.error}</p>}
          {result.fixed !== undefined && (
            <p>Fixed: {result.fixed ? "Yes" : "No changes needed"}</p>
          )}
          {result.changes && result.changes.length > 0 && (
            <div className="mt-2">
              <h3 className="font-semibold">Changes:</h3>
              <ul className="list-disc list-inside">
                {result.changes.map((change: string, i: number) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          )}
          <details className="mt-4">
            <summary className="cursor-pointer">Full Response</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {messagingResult && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold mb-2">
            Messaging Result: {messagingResult.success ? "✅ Success" : "❌ Failed"}
          </h2>
          {messagingResult.error && <p className="text-red-600">Error: {messagingResult.error}</p>}
          {messagingResult.message && <p className="text-green-600">{messagingResult.message}</p>}
          <details className="mt-4">
            <summary className="cursor-pointer">Full Response</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
              {JSON.stringify(messagingResult, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
