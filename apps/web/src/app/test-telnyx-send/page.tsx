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
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-4xl font-bold mb-2 text-foreground">
					Test Telnyx SMS
				</h1>
				<p className="text-muted-foreground mb-1">
					Company: Test Plumbing Company
				</p>
				<p className="text-muted-foreground mb-8">From: +1 (831) 428-0176</p>

				<div className="space-y-4 mb-6">
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
						className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						{loading ? "Sending..." : "Send SMS"}
					</button>
				</div>

				{result && (
					<div
						className={`p-6 border-2 rounded-lg ${result.success ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"}`}
					>
						<h2 className="text-2xl font-bold mb-4 text-foreground">
							{result.success ? "✅ Success" : "❌ Failed"}
						</h2>
						{result.error && (
							<div className="mb-4">
								<h3 className="font-semibold text-red-500 mb-2">
									Error Message:
								</h3>
								<pre className="p-4 bg-background border border-border rounded-lg text-sm overflow-auto text-foreground">
									{result.error}
								</pre>
							</div>
						)}
						{result.messageId && (
							<div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
								<h3 className="font-semibold text-green-500 mb-2">
									Message ID:
								</h3>
								<p className="font-mono text-sm text-foreground">
									{result.messageId}
								</p>
							</div>
						)}
						<details className="mt-4 group">
							<summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors">
								Full Response JSON
							</summary>
							<pre className="mt-3 p-4 bg-background border border-border rounded-lg overflow-auto text-xs text-foreground">
								{JSON.stringify(result, null, 2)}
							</pre>
						</details>
					</div>
				)}
			</div>
		</div>
	);
}
