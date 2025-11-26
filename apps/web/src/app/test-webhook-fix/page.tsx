"use client";

import { useState } from "react";
import {
	enablePhoneNumberMessaging,
	fixCompanyTelnyxWebhooks,
} from "@/actions/telnyx-provisioning";

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
			<h1 className="mb-4 text-2xl font-bold">
				Fix Test Company Telnyx Configuration
			</h1>
			<p className="mb-4">Company ID: {TEST_COMPANY_ID}</p>

			<div className="mb-6 space-y-4">
				<button
					onClick={handleFix}
					disabled={loading}
					className="mr-4 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
				>
					{loading ? "Fixing..." : "Fix Webhook URLs"}
				</button>

				<button
					onClick={handleEnableMessaging}
					disabled={messagingLoading}
					className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
				>
					{messagingLoading ? "Enabling..." : "Enable SMS/MMS"}
				</button>
			</div>

			{result && (
				<div className="mt-6 rounded border p-4">
					<h2 className="mb-2 font-bold">
						Result: {result.success ? "✅ Success" : "❌ Failed"}
					</h2>
					{result.error && (
						<p className="text-red-600">Error: {result.error}</p>
					)}
					{result.fixed !== undefined && (
						<p>Fixed: {result.fixed ? "Yes" : "No changes needed"}</p>
					)}
					{result.changes && result.changes.length > 0 && (
						<div className="mt-2">
							<h3 className="font-semibold">Changes:</h3>
							<ul className="list-inside list-disc">
								{result.changes.map((change: string, i: number) => (
									<li key={i}>{change}</li>
								))}
							</ul>
						</div>
					)}
					<details className="mt-4">
						<summary className="cursor-pointer">Full Response</summary>
						<pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
							{JSON.stringify(result, null, 2)}
						</pre>
					</details>
				</div>
			)}

			{messagingResult && (
				<div className="mt-6 rounded border p-4">
					<h2 className="mb-2 font-bold">
						Messaging Result:{" "}
						{messagingResult.success ? "✅ Success" : "❌ Failed"}
					</h2>
					{messagingResult.error && (
						<p className="text-red-600">Error: {messagingResult.error}</p>
					)}
					{messagingResult.message && (
						<p className="text-green-600">{messagingResult.message}</p>
					)}
					<details className="mt-4">
						<summary className="cursor-pointer">Full Response</summary>
						<pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
							{JSON.stringify(messagingResult, null, 2)}
						</pre>
					</details>
				</div>
			)}
		</div>
	);
}
