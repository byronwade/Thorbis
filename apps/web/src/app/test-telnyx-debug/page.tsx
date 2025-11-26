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
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-2 text-foreground">
					Telnyx SMS Debug Console
				</h1>
				<p className="text-muted-foreground mb-8">
					Step-by-step SMS sending diagnostics
				</p>

				<div className="bg-muted/50 p-6 rounded-lg border border-border mb-8">
					<h2 className="font-semibold mb-3 text-foreground text-lg">
						Configuration
					</h2>
					<div className="space-y-1 text-sm">
						<p className="text-muted-foreground">
							Company ID:{" "}
							<span className="font-mono text-foreground">
								{TEST_COMPANY_ID}
							</span>
						</p>
						<p className="text-muted-foreground">
							From Number:{" "}
							<span className="font-mono text-foreground">
								{TEST_FROM_NUMBER}
							</span>
						</p>
					</div>
				</div>

				<div className="space-y-4 mb-8">
					<div>
						<label className="block text-sm font-semibold mb-2 text-foreground">
							To Number
						</label>
						<input
							type="tel"
							value={toNumber}
							onChange={(e) => setToNumber(e.target.value)}
							placeholder="+14155551234"
							className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold mb-2 text-foreground">
							Message
						</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={4}
							className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground resize-none"
						/>
					</div>

					<button
						onClick={handleSend}
						disabled={loading}
						className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
					>
						{loading ? "Sending..." : "Send SMS"}
					</button>
				</div>

				{debugSteps.length > 0 && (
					<div className="mb-8 p-6 bg-muted/50 border border-border rounded-lg">
						<h2 className="font-bold mb-4 text-foreground text-lg">
							Debug Steps
						</h2>
						<ol className="space-y-2">
							{debugSteps.map((step, i) => (
								<li
									key={i}
									className="text-sm font-mono text-muted-foreground flex gap-3"
								>
									<span className="text-primary">→</span>
									<span>{step}</span>
								</li>
							))}
						</ol>
					</div>
				)}

				{result && (
					<div
						className={`p-6 border-2 rounded-lg ${result.success ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"}`}
					>
						<h2 className="text-2xl font-bold mb-4 text-foreground">
							{result.success ? "✅ Success" : "❌ Failed"}
						</h2>

						{result.error && (
							<div className="mb-4">
								<h3 className="font-semibold text-red-500 mb-2 text-lg">
									Error Message:
								</h3>
								<pre className="p-4 bg-background border border-border rounded-lg text-sm overflow-auto text-foreground">
									{result.error}
								</pre>
							</div>
						)}

						{result.messageId && (
							<div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
								<h3 className="font-semibold text-green-500 mb-2 text-lg">
									Message ID:
								</h3>
								<p className="font-mono text-sm text-foreground">
									{result.messageId}
								</p>
							</div>
						)}

						<details className="mt-4 group">
							<summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors text-lg">
								Full Response JSON
							</summary>
							<pre className="mt-3 p-4 bg-background border border-border rounded-lg text-xs overflow-auto max-h-96 text-foreground">
								{JSON.stringify(result, null, 2)}
							</pre>
						</details>
					</div>
				)}
			</div>
		</div>
	);
}
