"use client";

import { useState } from "react";

const TEST_MESSAGE_ID = "40319a95-3ba7-4596-835a-07615af55329";

export default function TestTelnyxStatus() {
  const [messageId, setMessageId] = useState(TEST_MESSAGE_ID);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/telnyx/message-status?messageId=${messageId}`);
      const data = await response.json();
      setStatus(data);
    } catch (error: any) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Telnyx Message Status Checker
        </h1>
        <p className="text-muted-foreground mb-8">Check the delivery status of sent SMS messages</p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Message ID
            </label>
            <input
              type="text"
              value={messageId}
              onChange={(e) => setMessageId(e.target.value)}
              placeholder="40319a95-3ba7-4596-835a-07615af55329"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
          </div>

          <button
            onClick={checkStatus}
            disabled={loading}
            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </div>

        {status && (
          <div className="p-6 border-2 rounded-lg border-border bg-muted/50">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Message Status</h2>

            {status.error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="font-semibold text-red-500 mb-2">Error:</h3>
                <p className="text-foreground">{status.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="font-semibold text-lg text-foreground">
                      {status.data?.status || "Unknown"}
                    </p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Direction</p>
                    <p className="font-semibold text-lg text-foreground">
                      {status.data?.direction || "Unknown"}
                    </p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="font-semibold text-lg text-foreground font-mono">
                      {status.data?.from?.phone_number || "Unknown"}
                    </p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="font-semibold text-lg text-foreground font-mono">
                      {status.data?.to?.[0]?.phone_number || "Unknown"}
                    </p>
                  </div>
                </div>

                {status.data?.errors && status.data.errors.length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h3 className="font-semibold text-red-500 mb-2">Errors:</h3>
                    <ul className="space-y-2">
                      {status.data.errors.map((error: any, i: number) => (
                        <li key={i} className="text-sm text-foreground">
                          {error.title}: {error.detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors text-lg">
                    Full Response JSON
                  </summary>
                  <pre className="mt-3 p-4 bg-background border border-border rounded-lg text-xs overflow-auto max-h-96 text-foreground">
                    {JSON.stringify(status, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
