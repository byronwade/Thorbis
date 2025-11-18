"use client";

import { useState } from "react";
import { sendTextMessage } from "@/actions/telnyx";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

export default function TestTelnyxSend() {
  const [toNumber, setToNumber] = useState("+1");
  const [message, setMessage] = useState("Test message from Stratos");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await sendTextMessage({
        companyId: TEST_COMPANY_ID,
        to: toNumber,
        from: "+18314280176", // Test Plumbing Company's phone number
        text: message,
      });
      setResult(res);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Test Telnyx SMS</h1>
      <p className="mb-2 text-sm text-gray-600">Company ID: {TEST_COMPANY_ID}</p>
      <p className="mb-4 text-sm text-gray-600">From Number: +1 (831) 428-0176</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">To Number</label>
          <input
            type="tel"
            value={toNumber}
            onChange={(e) => setToNumber(e.target.value)}
            placeholder="+14155551234"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send SMS"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold mb-2">
            Result: {result.success ? "✅ Success" : "❌ Failed"}
          </h2>
          {result.error && (
            <div className="mb-2">
              <strong className="text-red-600">Error:</strong>
              <pre className="mt-1 p-2 bg-red-50 rounded text-xs overflow-auto">
                {result.error}
              </pre>
            </div>
          )}
          {result.messageId && (
            <p className="text-green-600">Message ID: {result.messageId}</p>
          )}
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">Full Response</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
