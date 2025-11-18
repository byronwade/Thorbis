"use client";

import { useState } from "react";
import { registerCompanyFor10DLC } from "@/actions/ten-dlc-registration";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

export default function Test10DLCRegister() {
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleRegister = async () => {
		setLoading(true);
		setResult(null);

		try {
			const res = await registerCompanyFor10DLC(TEST_COMPANY_ID);
			setResult(res);
		} catch (error: any) {
			setResult({ success: false, error: error.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-2 text-foreground">
					10DLC Registration
				</h1>
				<p className="text-muted-foreground mb-8">
					Automated A2P 10DLC brand and campaign registration for Test Plumbing
					Company
				</p>

				<div className="bg-muted/50 p-6 rounded-lg border border-border mb-8">
					<h2 className="font-semibold mb-3 text-foreground text-lg">
						What is 10DLC?
					</h2>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>
							<strong className="text-foreground">
								10-Digit Long Code (10DLC)
							</strong>{" "}
							is required by US carriers for Application-to-Person (A2P)
							messaging.
						</p>
						<p>
							Without 10DLC registration, your SMS messages will be blocked or
							filtered by carriers.
						</p>
						<p>
							This automated process will:
							<ul className="list-disc ml-6 mt-2 space-y-1">
								<li>Create a verified brand with The Campaign Registry</li>
								<li>Create a messaging campaign</li>
								<li>
									Attach all your phone numbers to the approved campaign
								</li>
								<li>Enable full SMS delivery to US numbers</li>
							</ul>
						</p>
					</div>
				</div>

				<button
					onClick={handleRegister}
					disabled={loading}
					className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg mb-8"
				>
					{loading ? "Registering..." : "Register for 10DLC"}
				</button>

				{result && (
					<div
						className={`p-6 border-2 rounded-lg ${result.success ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"}`}
					>
						<h2 className="text-2xl font-bold mb-4 text-foreground">
							{result.success ? "✅ Success" : "❌ Failed"}
						</h2>

						{result.error && (
							<div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
								<h3 className="font-semibold text-red-500 mb-2 text-lg">
									Error:
								</h3>
								<pre className="p-4 bg-background border border-border rounded-lg text-sm overflow-auto text-foreground">
									{result.error}
								</pre>
							</div>
						)}

						{result.brandId && (
							<div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
								<h3 className="font-semibold text-green-500 mb-2 text-lg">
									Brand ID:
								</h3>
								<p className="font-mono text-sm text-foreground">
									{result.brandId}
								</p>
							</div>
						)}

						{result.campaignId && (
							<div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
								<h3 className="font-semibold text-green-500 mb-2 text-lg">
									Campaign ID:
								</h3>
								<p className="font-mono text-sm text-foreground">
									{result.campaignId}
								</p>
							</div>
						)}

						{result.log && result.log.length > 0 && (
							<details className="mt-4 group">
								<summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors text-lg">
									Registration Log ({result.log.length} steps)
								</summary>
								<div className="mt-3 p-4 bg-background border border-border rounded-lg">
									<ol className="space-y-2">
										{result.log.map((step: string, i: number) => (
											<li
												key={i}
												className="text-sm font-mono text-muted-foreground flex gap-3"
											>
												<span className="text-primary">
													{i + 1}.
												</span>
												<span>{step}</span>
											</li>
										))}
									</ol>
								</div>
							</details>
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

				<div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
					<h3 className="font-semibold mb-3 text-foreground text-lg">
						Next Steps
					</h3>
					<ul className="space-y-2 text-sm text-foreground">
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								After successful registration, test SMS sending at{" "}
								<a
									href="/test-telnyx-send"
									className="text-primary underline hover:text-primary/80 transition-colors font-semibold"
								>
									/test-telnyx-send
								</a>
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								Approval typically takes 1-5 minutes for brand and campaign
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								If approval is pending, you can run this registration again
								to check status
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								Once approved, all phone numbers will be automatically
								enabled for SMS
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
