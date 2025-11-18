import { createClient } from "@/lib/supabase/server";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

export default async function TestTelnyxConfig() {
	const supabase = await createClient();

	// Get company Telnyx settings
	const { data: settings } = await supabase
		.from("company_telnyx_settings")
		.select("*")
		.eq("company_id", TEST_COMPANY_ID)
		.single();

	// Get phone number
	const { data: phoneNumber } = await supabase
		.from("phone_numbers")
		.select("*")
		.eq("company_id", TEST_COMPANY_ID)
		.eq("status", "active")
		.single();

	// Check environment variables (server-side only)
	const env = {
		hasTelnyxApiKey: !!process.env.TELNYX_API_KEY,
		hasPublicSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
		hasSiteUrl: !!process.env.SITE_URL,
		siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
		hasMessagingProfileId: !!(
			process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID ||
			process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID
		),
		hasConnectionId: !!(
			process.env.TELNYX_DEFAULT_CONNECTION_ID ||
			process.env.NEXT_PUBLIC_TELNYX_CONNECTION_ID
		),
	};

	const allChecks = [
		{
			name: "TELNYX_API_KEY",
			status: env.hasTelnyxApiKey,
			message: env.hasTelnyxApiKey ? "✅ Configured" : "❌ Missing",
		},
		{
			name: "Site URL (NEXT_PUBLIC_SITE_URL or SITE_URL)",
			status: env.hasPublicSiteUrl || env.hasSiteUrl,
			message: env.siteUrl || "❌ Missing",
		},
		{
			name: "Company Telnyx Settings",
			status: !!settings,
			message: settings ? `✅ Found (${settings.status})` : "❌ Missing",
		},
		{
			name: "Messaging Profile ID",
			status: !!settings?.messaging_profile_id,
			message: settings?.messaging_profile_id || "❌ Missing",
		},
		{
			name: "Call Control Application ID",
			status: !!settings?.call_control_application_id,
			message: settings?.call_control_application_id || "❌ Missing",
		},
		{
			name: "Default Outbound Number",
			status: !!settings?.default_outbound_number,
			message: settings?.default_outbound_number || "❌ Missing",
		},
		{
			name: "Phone Number in Database",
			status: !!phoneNumber,
			message: phoneNumber?.phone_number || "❌ Missing",
		},
		{
			name: "Phone Number Status",
			status: phoneNumber?.status === "active",
			message: phoneNumber?.status || "❌ Unknown",
		},
		{
			name: "Phone Number Features",
			status:
				Array.isArray(phoneNumber?.features) && phoneNumber.features.length > 0,
			message: phoneNumber?.features?.join(", ") || "❌ None",
		},
		{
			name: "Telnyx Phone Number ID",
			status: !!phoneNumber?.telnyx_phone_number_id,
			message: phoneNumber?.telnyx_phone_number_id || "❌ Missing",
		},
		{
			name: "Telnyx Messaging Profile ID (Phone)",
			status: !!phoneNumber?.telnyx_messaging_profile_id,
			message: phoneNumber?.telnyx_messaging_profile_id || "❌ Missing",
		},
		{
			name: "Telnyx Connection ID (Phone)",
			status: !!phoneNumber?.telnyx_connection_id,
			message: phoneNumber?.telnyx_connection_id || "❌ Missing",
		},
	];

	const allPassing = allChecks.every((check) => check.status);

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-2 text-foreground">
					Telnyx Configuration Check
				</h1>
				<p className="text-muted-foreground mb-8">
					Company: Test Plumbing Company
				</p>

				<div
					className={`p-6 rounded-lg mb-8 border-2 ${allPassing ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"}`}
				>
					<h2 className="text-2xl font-bold mb-2 text-foreground">
						{allPassing ? "✅ All Checks Passed" : "❌ Some Checks Failed"}
					</h2>
					<p className="text-muted-foreground">
						{allPassing
							? "Telnyx is properly configured and ready to use."
							: "Some configuration is missing or incorrect. See details below."}
					</p>
				</div>

				<div className="space-y-3">
					{allChecks.map((check, i) => (
						<div
							key={i}
							className={`p-4 rounded-lg border ${check.status ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}
						>
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-foreground">{check.name}</h3>
								<span
									className={`text-sm font-mono px-3 py-1 rounded ${check.status ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
								>
									{check.status ? "PASS" : "FAIL"}
								</span>
							</div>
							<p className="text-sm mt-2 font-mono text-muted-foreground">
								{check.message}
							</p>
						</div>
					))}
				</div>

				<div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border">
					<h2 className="font-bold text-lg mb-4 text-foreground">Raw Data</h2>

					<details className="mb-4 group">
						<summary className="cursor-pointer font-semibold mb-2 text-foreground hover:text-primary transition-colors">
							Company Telnyx Settings
						</summary>
						<pre className="p-4 bg-background rounded-lg border border-border text-xs overflow-auto text-foreground">
							{JSON.stringify(settings, null, 2)}
						</pre>
					</details>

					<details className="group">
						<summary className="cursor-pointer font-semibold mb-2 text-foreground hover:text-primary transition-colors">
							Phone Number Record
						</summary>
						<pre className="p-4 bg-background rounded-lg border border-border text-xs overflow-auto text-foreground">
							{JSON.stringify(phoneNumber, null, 2)}
						</pre>
					</details>
				</div>

				<div className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-lg">
					<h3 className="font-semibold mb-3 text-foreground text-lg">
						Next Steps
					</h3>
					<ul className="space-y-2 text-sm text-foreground">
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								If all checks pass, try sending an SMS at{" "}
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
								If any checks fail, review the error messages and fix the
								configuration
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								Check your environment variables in{" "}
								<code className="px-2 py-0.5 bg-muted rounded text-xs">
									.env.local
								</code>
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							<span>
								Verify Telnyx account settings at{" "}
								<a
									href="https://portal.telnyx.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline hover:text-primary/80 transition-colors font-semibold"
								>
									portal.telnyx.com
								</a>
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
