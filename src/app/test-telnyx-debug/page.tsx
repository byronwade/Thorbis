"use client";

import { useState } from "react";
import { sendTextMessage } from "@/actions/telnyx";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";
const TEST_FROM_NUMBER = "+18314280176";

export default function TestTelnyxDebug() {
  const [toNumber, setToNumber] = useState("+1");
  const [message, setMessage] = useState("Test message from Stratos");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [debugSteps, setDebugSteps] = useState<string[]>([]);

  const handleSend = async () => {
    setLoading(true);
    setResult(null);
    setDebugSteps([]);

    const steps: string[] = [];

    try {
      steps.push(`1. Starting SMS send to ${toNumber}`);
      steps.push(`2. Using company ID: ${TEST_COMPANY_ID}`);
      steps.push(`3. Using from number: ${TEST_FROM_NUMBER}`);
      steps.push(`4. Message: "${message}"`);
      setDebugSteps([...steps]);

      steps.push("5. Calling sendTextMessage action...");
      setDebugSteps([...steps]);

      const res = await sendTextMessage({
        companyId: TEST_COMPANY_ID,
        to: toNumber,
        from: TEST_FROM_NUMBER,
        text: message,
      });

      steps.push(`6. Got response: ${res.success ? "SUCCESS" : "FAILED"}`);

      if (res.success) {
        steps.push(`7. Message ID: ${res.messageId}`);
      } else {
        steps.push(`7. Error: ${res.error}`);
      }

      setDebugSteps([...steps]);
      setResult(res);
    } catch (error: any) {
      steps.push(`ERROR: ${error.message}`);
      setDebugSteps([...steps]);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Telnyx SMS Debug Console</h1>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Configuration</h2>
        <p className="text-sm text-gray-700">Company ID: {TEST_COMPANY_ID}</p>
        <p className="text-sm text-gray-700">From Number: {TEST_FROM_NUMBER}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">To Number</label>
          <input
            type="tel"
            value={toNumber}
            onChange={(e) => setToNumber(e.target.value)}
            placeholder="+14155551234"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send SMS"}
        </button>
      </div>

      {debugSteps.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 border rounded">
          <h2 className="font-bold mb-3">Debug Steps</h2>
          <ol className="space-y-1">
            {debugSteps.map((step, i) => (
              <li key={i} className="text-sm font-mono">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {result && (
        <div className={`p-6 border-2 rounded-lg ${result.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
          <h2 className="text-xl font-bold mb-4">
            {result.success ? "✅ Success" : "❌ Failed"}
          </h2>

          {result.error && (
            <div className="mb-4">
              <h3 className="font-semibold text-red-700 mb-2">Error Message:</h3>
              <pre className="p-3 bg-white border border-red-300 rounded text-sm overflow-auto">
                {result.error}
              </pre>
            </div>
          )}

          {result.messageId && (
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 mb-2">Message ID:</h3>
              <p className="font-mono text-sm">{result.messageId}</p>
            </div>
          )}

          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              Full Response JSON
            </summary>
            <pre className="mt-2 p-3 bg-white border rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
