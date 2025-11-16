"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestAuthPage() {
	const [status, setStatus] = useState("Checking...");
	const [user, setUser] = useState<any>(null);
	const [session, setSession] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function checkAuth() {
			try {
				const supabase = createClient();

				if (!supabase) {
					setStatus("❌ Supabase client not configured");
					setError("Check .env.local file");
					return;
				}

				setStatus("✅ Supabase client created");

				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();

				if (userError) {
					setError(userError.message);
					return;
				}

				setUser(user);

				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError) {
					setError(sessionError.message);
					return;
				}

				setSession(session);

				if (user) {
					setStatus("✅ User is authenticated");
				} else {
					setStatus("❌ No user authenticated");
				}
			} catch (err) {
    console.error("Error:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
				setStatus("❌ Error occurred");
			}
		}

		checkAuth();
	}, []);

	return (
		<div className="min-h-screen p-8">
			<div className="mx-auto max-w-2xl space-y-6">
				<h1 className="font-bold text-3xl">🔐 Auth Diagnostic</h1>

				<div className="space-y-4">
					<div className="rounded-lg border p-4">
						<h2 className="mb-2 font-semibold text-lg">Status</h2>
						<p className="text-2xl">{status}</p>
					</div>

					{error && (
						<div className="rounded-lg border border-destructive bg-destructive p-4">
							<h2 className="mb-2 font-semibold text-destructive text-lg">Error</h2>
							<p className="text-destructive">{error}</p>
						</div>
					)}

					<div className="rounded-lg border p-4">
						<h2 className="mb-2 font-semibold text-lg">User</h2>
						{user ? (
							<div className="space-y-2">
								<p>
									<strong>ID:</strong> {user.id}
								</p>
								<p>
									<strong>Email:</strong> {user.email}
								</p>
								<p>
									<strong>Email Confirmed:</strong> {user.email_confirmed_at ? "✅ Yes" : "❌ No (needs verification)"}
								</p>
								<p>
									<strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
								</p>
								<details className="mt-4">
									<summary className="cursor-pointer font-semibold">Full User Object</summary>
									<pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(user, null, 2)}</pre>
								</details>
							</div>
						) : (
							<p className="text-muted-foreground">No user data</p>
						)}
					</div>

					<div className="rounded-lg border p-4">
						<h2 className="mb-2 font-semibold text-lg">Session</h2>
						{session ? (
							<div className="space-y-2">
								<p>
									<strong>Access Token:</strong> {session.access_token ? "✅ Present" : "❌ Missing"}
								</p>
								<p>
									<strong>Expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}
								</p>
								<details className="mt-4">
									<summary className="cursor-pointer font-semibold">Full Session Object</summary>
									<pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
										{JSON.stringify(session, null, 2)}
									</pre>
								</details>
							</div>
						) : (
							<p className="text-muted-foreground">No session data</p>
						)}
					</div>

					<div className="rounded-lg border p-4">
						<h2 className="mb-2 font-semibold text-lg">Environment</h2>
						<div className="space-y-2">
							<p>
								<strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Not set"}
							</p>
							<p>
								<strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
							</p>
							<p>
								<strong>Site URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || "❌ Not set"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
