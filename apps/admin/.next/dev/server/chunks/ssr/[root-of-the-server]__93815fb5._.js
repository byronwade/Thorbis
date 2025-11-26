module.exports = [
	"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["createClient", () => createClient]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+ssr@0.7.0_@supabase+supabase-js@2.81.0/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+ssr@0.7.0_@supabase+supabase-js@2.81.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)",
			);
		/**
		 * Cookie name prefix for admin app session isolation
		 * This ensures admin cookies don't conflict with contractor web app cookies
		 * Both apps share the same domain but use different cookie prefixes
		 */ const COOKIE_PREFIX = "admin_";
		/**
		 * Add prefix to cookie name for isolation
		 */ const prefixCookieName = (name) => `${COOKIE_PREFIX}${name}`;
		/**
		 * Remove prefix from cookie name
		 */ const unprefixCookieName = (name) =>
			name.startsWith(COOKIE_PREFIX) ? name.slice(COOKIE_PREFIX.length) : name;
		async function createClient() {
			const cookieStore = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"cookies"
			])();
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"createServerClient"
			])(
				("TURBOPACK compile-time value",
				"https://togejqdwggezkxahomeh.supabase.co"),
				("TURBOPACK compile-time value",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2VqcWR3Z2dlemt4YWhvbWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjAyOTUsImV4cCI6MjA3NzI5NjI5NX0.a74QOxiIcxeALZsTsNXNDiOls1MZDsFfyGFq992eBBM"),
				{
					cookies: {
						getAll() {
							// Get all cookies and filter/unprefix admin cookies
							return cookieStore
								.getAll()
								.filter((cookie) => cookie.name.startsWith(COOKIE_PREFIX))
								.map((cookie) => ({
									...cookie,
									name: unprefixCookieName(cookie.name),
								}));
						},
						setAll(cookiesToSet) {
							try {
								cookiesToSet.forEach(({ name, value, options }) =>
									cookieStore.set(prefixCookieName(name), value, options),
								);
							} catch {
								// The `setAll` method was called from a Server Component.
								// This can be ignored if you have middleware refreshing
								// user sessions.
							}
						},
					},
				},
			);
		}
	},
	"[externals]/node:crypto [external] (node:crypto, cjs)",
	(__turbopack_context__, module, exports) => {
		const mod = __turbopack_context__.x("node:crypto", () =>
			require("node:crypto"),
		);

		module.exports = mod;
	},
	"[project]/apps/admin/src/actions/campaigns.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/* __next_internal_action_entry_do_not_use__ [{"4043ae0039bf09c40589e660c59b07364b7c03eea1":"duplicateCampaign","4052d2bfebb353ea74b1949d573e258603ef44f96f":"createCampaign","4089e557e2816754916dbdd651062181b36b4d2433":"pauseCampaign","409672eb9339ca62cc96de65f7dcac5d4a49a0b478":"sendCampaign","409ddc6e3d75dffb6c90f8a205c85c6871c1cac117":"resumeCampaign","40b11fc9abef983db72b135bbe418052ebe542800a":"deleteCampaign","40b399ccf9a2142395bfa2eea55fde288210f7ed84":"getCampaignAnalytics","40d1b5f9e75fb61ed582c571643f84c6560b125a9a":"updateCampaign","40eaa63c9acddfea7c31afc5985c991d0024189757":"cancelScheduledCampaign","60af3af87ad52156490b89abc6aa146796116d29c0":"previewAudience","60b4d0e31b81b8c3d4635afecade7d99682faac8c4":"scheduleCampaign","7834098687d20bccdb54f44f3540bd99e1d2c099dd":"recordCampaignEvent"},"",""] */ __turbopack_context__.s(
			[
				"cancelScheduledCampaign",
				() => cancelScheduledCampaign,
				"createCampaign",
				() => createCampaign,
				"deleteCampaign",
				() => deleteCampaign,
				"duplicateCampaign",
				() => duplicateCampaign,
				"getCampaignAnalytics",
				() => getCampaignAnalytics,
				"pauseCampaign",
				() => pauseCampaign,
				"previewAudience",
				() => previewAudience,
				"recordCampaignEvent",
				() => recordCampaignEvent,
				"resumeCampaign",
				() => resumeCampaign,
				"scheduleCampaign",
				() => scheduleCampaign,
				"sendCampaign",
				() => sendCampaign,
				"updateCampaign",
				() => updateCampaign,
			],
		);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)",
			);
		/**
		 * Campaign Server Actions
		 *
		 * Server-side actions for managing email marketing campaigns.
		 * Handles CRUD operations, sending via Resend, scheduling, and analytics.
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$4$2e$2_$40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/resend@6.4.2_@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0_/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)",
			);
		// Initialize Resend client
		const resend =
			new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$4$2e$2_$40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"Resend"
			](process.env.RESEND_API_KEY);
		// Platform email configuration
		const PLATFORM_FROM_EMAIL =
			process.env.RESEND_FROM_EMAIL || "hello@thorbis.com";
		const PLATFORM_FROM_NAME = process.env.RESEND_FROM_NAME || "Thorbis";
		async function createCampaign(input) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				const { data, error } = await supabase
					.from("email_campaigns")
					.insert({
						name: input.name,
						subject: input.subject,
						preview_text: input.previewText,
						template_id: input.templateId,
						template_data: input.templateData,
						html_content: input.htmlContent,
						plain_text_content: input.plainTextContent,
						audience_type: input.audienceType,
						audience_filter: input.audienceFilter,
						from_name: input.fromName || PLATFORM_FROM_NAME,
						from_email: input.fromEmail || PLATFORM_FROM_EMAIL,
						reply_to: input.replyTo,
						tags: input.tags || [],
						notes: input.notes,
						status: "draft",
						total_recipients: 0,
						sent_count: 0,
						delivered_count: 0,
						opened_count: 0,
						unique_opens: 0,
						clicked_count: 0,
						unique_clicks: 0,
						bounced_count: 0,
						complained_count: 0,
						unsubscribed_count: 0,
						failed_count: 0,
						revenue_attributed: 0,
						conversions_count: 0,
					})
					.select()
					.single();
				if (error) {
					console.error("Failed to create campaign:", error);
					return {
						success: false,
						error: "Failed to create campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				return {
					success: true,
					data: mapCampaignFromDb(data),
				};
			} catch (error) {
				console.error("Failed to create campaign:", error);
				return {
					success: false,
					error: "Failed to create campaign",
				};
			}
		}
		async function updateCampaign(input) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				// Build update object with only provided fields
				const updateData = {
					updated_at: new Date().toISOString(),
				};
				if (input.name !== undefined) updateData.name = input.name;
				if (input.subject !== undefined) updateData.subject = input.subject;
				if (input.previewText !== undefined)
					updateData.preview_text = input.previewText;
				if (input.templateId !== undefined)
					updateData.template_id = input.templateId;
				if (input.templateData !== undefined)
					updateData.template_data = input.templateData;
				if (input.htmlContent !== undefined)
					updateData.html_content = input.htmlContent;
				if (input.plainTextContent !== undefined)
					updateData.plain_text_content = input.plainTextContent;
				if (input.audienceType !== undefined)
					updateData.audience_type = input.audienceType;
				if (input.audienceFilter !== undefined)
					updateData.audience_filter = input.audienceFilter;
				if (input.fromName !== undefined) updateData.from_name = input.fromName;
				if (input.fromEmail !== undefined)
					updateData.from_email = input.fromEmail;
				if (input.replyTo !== undefined) updateData.reply_to = input.replyTo;
				if (input.tags !== undefined) updateData.tags = input.tags;
				if (input.notes !== undefined) updateData.notes = input.notes;
				const { data, error } = await supabase
					.from("email_campaigns")
					.update(updateData)
					.eq("id", input.id)
					.select()
					.single();
				if (error) {
					console.error("Failed to update campaign:", error);
					return {
						success: false,
						error: "Failed to update campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])(`/dashboard/marketing/campaigns/${input.id}`);
				return {
					success: true,
					data: mapCampaignFromDb(data),
				};
			} catch (error) {
				console.error("Failed to update campaign:", error);
				return {
					success: false,
					error: "Failed to update campaign",
				};
			}
		}
		async function deleteCampaign(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				// Only allow deleting drafts
				const { data: campaign } = await supabase
					.from("email_campaigns")
					.select("status")
					.eq("id", id)
					.single();
				if (campaign?.status !== "draft") {
					return {
						success: false,
						error: "Only draft campaigns can be deleted",
					};
				}
				const { error } = await supabase
					.from("email_campaigns")
					.delete()
					.eq("id", id);
				if (error) {
					console.error("Failed to delete campaign:", error);
					return {
						success: false,
						error: "Failed to delete campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				return {
					success: true,
				};
			} catch (error) {
				console.error("Failed to delete campaign:", error);
				return {
					success: false,
					error: "Failed to delete campaign",
				};
			}
		}
		async function duplicateCampaign(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				// Fetch original campaign
				const { data: original, error: fetchError } = await supabase
					.from("email_campaigns")
					.select("*")
					.eq("id", id)
					.single();
				if (fetchError || !original) {
					return {
						success: false,
						error: "Campaign not found",
					};
				}
				// Create copy with reset stats
				const { data, error } = await supabase
					.from("email_campaigns")
					.insert({
						name: `${original.name} (Copy)`,
						subject: original.subject,
						preview_text: original.preview_text,
						template_id: original.template_id,
						template_data: original.template_data,
						html_content: original.html_content,
						plain_text_content: original.plain_text_content,
						audience_type: original.audience_type,
						audience_filter: original.audience_filter,
						from_name: original.from_name,
						from_email: original.from_email,
						reply_to: original.reply_to,
						tags: original.tags,
						notes: original.notes,
						status: "draft",
						total_recipients: 0,
						sent_count: 0,
						delivered_count: 0,
						opened_count: 0,
						unique_opens: 0,
						clicked_count: 0,
						unique_clicks: 0,
						bounced_count: 0,
						complained_count: 0,
						unsubscribed_count: 0,
						failed_count: 0,
						revenue_attributed: 0,
						conversions_count: 0,
					})
					.select()
					.single();
				if (error) {
					console.error("Failed to duplicate campaign:", error);
					return {
						success: false,
						error: "Failed to duplicate campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				return {
					success: true,
					data: mapCampaignFromDb(data),
				};
			} catch (error) {
				console.error("Failed to duplicate campaign:", error);
				return {
					success: false,
					error: "Failed to duplicate campaign",
				};
			}
		}
		async function sendCampaign(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				// Get campaign details
				const { data: campaign, error: fetchError } = await supabase
					.from("email_campaigns")
					.select("*")
					.eq("id", id)
					.single();
				if (fetchError || !campaign) {
					return {
						success: false,
						error: "Campaign not found",
					};
				}
				if (campaign.status !== "draft") {
					return {
						success: false,
						error: "Only draft campaigns can be sent",
					};
				}
				// Get recipients based on audience type
				const recipients = await getAudienceRecipients(
					campaign.audience_type,
					campaign.audience_filter,
				);
				if (recipients.length === 0) {
					return {
						success: false,
						error: "No recipients found for this audience",
					};
				}
				// Update campaign status to sending
				await supabase
					.from("email_campaigns")
					.update({
						status: "sending",
						sending_started_at: new Date().toISOString(),
						total_recipients: recipients.length,
					})
					.eq("id", id);
				// Create send records for each recipient
				const sendRecords = recipients.map((recipient) => ({
					campaign_id: id,
					recipient_email: recipient.email,
					recipient_name: recipient.name,
					recipient_type: recipient.type,
					recipient_id: recipient.id,
					status: "pending",
				}));
				await supabase.from("email_campaign_sends").insert(sendRecords);
				// Send emails via Resend (batch processing)
				let sentCount = 0;
				let failedCount = 0;
				for (const recipient of recipients) {
					try {
						const { data: sendResult, error: sendError } =
							await resend.emails.send({
								from: `${campaign.from_name} <${campaign.from_email}>`,
								to: recipient.email,
								subject: campaign.subject,
								html:
									campaign.html_content ||
									`<p>${campaign.plain_text_content}</p>`,
								text: campaign.plain_text_content,
								replyTo: campaign.reply_to,
								tags: [
									{
										name: "campaign_id",
										value: id,
									},
									{
										name: "recipient_type",
										value: recipient.type,
									},
								],
							});
						if (sendError) {
							failedCount++;
							// Update send record with error
							await supabase
								.from("email_campaign_sends")
								.update({
									status: "failed",
									error_message: sendError.message,
									updated_at: new Date().toISOString(),
								})
								.eq("campaign_id", id)
								.eq("recipient_email", recipient.email);
						} else {
							sentCount++;
							// Update send record with Resend ID
							await supabase
								.from("email_campaign_sends")
								.update({
									status: "sent",
									resend_id: sendResult?.id,
									sent_at: new Date().toISOString(),
									updated_at: new Date().toISOString(),
								})
								.eq("campaign_id", id)
								.eq("recipient_email", recipient.email);
						}
					} catch (err) {
						failedCount++;
						console.error(`Failed to send to ${recipient.email}:`, err);
					}
				}
				// Update campaign with final stats
				await supabase
					.from("email_campaigns")
					.update({
						status: "sent",
						sent_at: new Date().toISOString(),
						completed_at: new Date().toISOString(),
						sent_count: sentCount,
						failed_count: failedCount,
					})
					.eq("id", id);
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])(`/dashboard/marketing/campaigns/${id}`);
				return {
					success: true,
					data: {
						campaignId: id,
						recipientCount: recipients.length,
						estimatedCompletionTime: new Date().toISOString(),
					},
				};
			} catch (error) {
				console.error("Failed to send campaign:", error);
				return {
					success: false,
					error: "Failed to send campaign",
				};
			}
		}
		async function scheduleCampaign(id, scheduledFor) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				// Validate campaign is in draft status
				const { data: campaign } = await supabase
					.from("email_campaigns")
					.select("status, audience_type, audience_filter")
					.eq("id", id)
					.single();
				if (campaign?.status !== "draft") {
					return {
						success: false,
						error: "Only draft campaigns can be scheduled",
					};
				}
				// Get recipient count for the campaign
				const recipients = await getAudienceRecipients(
					campaign.audience_type,
					campaign.audience_filter,
				);
				const { error } = await supabase
					.from("email_campaigns")
					.update({
						status: "scheduled",
						scheduled_for: scheduledFor,
						total_recipients: recipients.length,
						updated_at: new Date().toISOString(),
					})
					.eq("id", id);
				if (error) {
					console.error("Failed to schedule campaign:", error);
					return {
						success: false,
						error: "Failed to schedule campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])(`/dashboard/marketing/campaigns/${id}`);
				return {
					success: true,
				};
			} catch (error) {
				console.error("Failed to schedule campaign:", error);
				return {
					success: false,
					error: "Failed to schedule campaign",
				};
			}
		}
		async function cancelScheduledCampaign(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				const { error } = await supabase
					.from("email_campaigns")
					.update({
						status: "draft",
						scheduled_for: null,
						updated_at: new Date().toISOString(),
					})
					.eq("id", id)
					.eq("status", "scheduled");
				if (error) {
					console.error("Failed to cancel scheduled campaign:", error);
					return {
						success: false,
						error: "Failed to cancel scheduled campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])(`/dashboard/marketing/campaigns/${id}`);
				return {
					success: true,
				};
			} catch (error) {
				console.error("Failed to cancel scheduled campaign:", error);
				return {
					success: false,
					error: "Failed to cancel scheduled campaign",
				};
			}
		}
		async function pauseCampaign(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				const { error } = await supabase
					.from("email_campaigns")
					.update({
						status: "paused",
						updated_at: new Date().toISOString(),
					})
					.eq("id", id)
					.eq("status", "sending");
				if (error) {
					console.error("Failed to pause campaign:", error);
					return {
						success: false,
						error: "Failed to pause campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])(`/dashboard/marketing/campaigns/${id}`);
				return {
					success: true,
				};
			} catch (error) {
				console.error("Failed to pause campaign:", error);
				return {
					success: false,
					error: "Failed to pause campaign",
				};
			}
		}
		async function resumeCampaign(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				const { error } = await supabase
					.from("email_campaigns")
					.update({
						status: "sending",
						updated_at: new Date().toISOString(),
					})
					.eq("id", id)
					.eq("status", "paused");
				if (error) {
					console.error("Failed to resume campaign:", error);
					return {
						success: false,
						error: "Failed to resume campaign",
					};
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])("/dashboard/marketing/campaigns");
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"revalidatePath"
				])(`/dashboard/marketing/campaigns/${id}`);
				return {
					success: true,
				};
			} catch (error) {
				console.error("Failed to resume campaign:", error);
				return {
					success: false,
					error: "Failed to resume campaign",
				};
			}
		}
		async function previewAudience(audienceType, filter) {
			try {
				const recipients = await getAudienceRecipients(audienceType, filter);
				return {
					success: true,
					data: {
						estimatedCount: recipients.length,
						sampleRecipients: recipients.slice(0, 5).map((r) => ({
							email: r.email,
							name: r.name,
							type: r.type,
						})),
					},
				};
			} catch (error) {
				console.error("Failed to preview audience:", error);
				return {
					success: false,
					error: "Failed to preview audience",
				};
			}
		}
		async function getCampaignAnalytics(id) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				// Get link performance
				const { data: links } = await supabase
					.from("email_campaign_links")
					.select("*")
					.eq("campaign_id", id)
					.order("unique_clicks", {
						ascending: false,
					})
					.limit(10);
				const topLinks = (links || []).map((link) => ({
					url: link.original_url,
					linkText: link.link_text || link.original_url,
					clicks: link.total_clicks || 0,
					uniqueClicks: link.unique_clicks || 0,
				}));
				// Get send metadata for device breakdown (from metadata JSONB)
				const { data: sends } = await supabase
					.from("email_campaign_sends")
					.select("metadata, first_opened_at")
					.eq("campaign_id", id)
					.not("first_opened_at", "is", null);
				// Calculate device breakdown from metadata
				let desktop = 0;
				let mobile = 0;
				let tablet = 0;
				(sends || []).forEach((send) => {
					const device = send.metadata?.device;
					if (device === "mobile") mobile++;
					else if (device === "tablet") tablet++;
					else desktop++;
				});
				const total = desktop + mobile + tablet || 1;
				const deviceBreakdown = {
					desktop: Math.round((desktop / total) * 100),
					mobile: Math.round((mobile / total) * 100),
					tablet: Math.round((tablet / total) * 100),
				};
				// Calculate hourly opens
				const hourlyMap = {};
				(sends || []).forEach((send) => {
					if (send.first_opened_at) {
						const hour = new Date(send.first_opened_at).getHours();
						const hourLabel =
							hour < 12
								? `${hour || 12} AM`
								: `${hour === 12 ? 12 : hour - 12} PM`;
						hourlyMap[hourLabel] = (hourlyMap[hourLabel] || 0) + 1;
					}
				});
				const hourlyOpens = Object.entries(hourlyMap)
					.map(([hour, opens]) => ({
						hour,
						opens,
					}))
					.sort((a, b) => {
						const parseHour = (h) => {
							const [num, period] = h.split(" ");
							return period === "PM" && num !== "12"
								? parseInt(num) + 12
								: parseInt(num);
						};
						return parseHour(a.hour) - parseHour(b.hour);
					});
				return {
					success: true,
					data: {
						topLinks,
						deviceBreakdown,
						hourlyOpens,
					},
				};
			} catch (error) {
				console.error("Failed to get campaign analytics:", error);
				return {
					success: false,
					error: "Failed to get campaign analytics",
				};
			}
		}
		async function recordCampaignEvent(
			campaignId,
			recipientEmail,
			eventType,
			eventData,
		) {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createClient"
				])();
				const now = new Date().toISOString();
				// Update send record
				const updateData = {
					updated_at: now,
				};
				switch (eventType) {
					case "delivered":
						updateData.status = "delivered";
						updateData.delivered_at = now;
						break;
					case "opened":
						updateData.status = "opened";
						updateData.last_opened_at = now;
						// Increment open count
						await supabase.rpc("increment_campaign_send_open_count", {
							p_campaign_id: campaignId,
							p_recipient_email: recipientEmail,
						});
						break;
					case "clicked":
						updateData.status = "clicked";
						updateData.last_clicked_at = now;
						if (eventData?.url) {
							// Record link click
							await supabase.rpc("increment_campaign_link_click", {
								p_campaign_id: campaignId,
								p_url: eventData.url,
							});
						}
						break;
					case "bounced":
						updateData.status = "bounced";
						updateData.bounced_at = now;
						updateData.error_message = eventData?.reason;
						break;
					case "complained":
						updateData.status = "complained";
						updateData.complained_at = now;
						break;
					case "unsubscribed":
						updateData.unsubscribed_at = now;
						break;
				}
				await supabase
					.from("email_campaign_sends")
					.update(updateData)
					.eq("campaign_id", campaignId)
					.eq("recipient_email", recipientEmail);
				// Update aggregate campaign stats
				await updateCampaignStats(campaignId);
				return {
					success: true,
				};
			} catch (error) {
				console.error("Failed to record campaign event:", error);
				return {
					success: false,
					error: "Failed to record campaign event",
				};
			}
		}
		// ============================================================================
		// Helper Functions
		// ============================================================================
		/**
		 * Get recipients based on audience type and filter
		 */ async function getAudienceRecipients(audienceType, filter) {
			const supabase = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"createClient"
			])();
			const recipients = [];
			switch (audienceType) {
				case "waitlist": {
					// Get waitlist subscribers from Resend
					const waitlistContacts = await getWaitlistContacts();
					recipients.push(
						...waitlistContacts.map((c) => ({
							email: c.email,
							name: c.firstName
								? `${c.firstName} ${c.lastName || ""}`.trim()
								: undefined,
							type: "waitlist",
							id: c.id,
						})),
					);
					break;
				}
				case "all_users": {
					// Get all users from the database
					const { data: users } = await supabase
						.from("users")
						.select("id, email, full_name")
						.not("email", "is", null);
					recipients.push(
						...(users || []).map((u) => ({
							email: u.email,
							name: u.full_name,
							type: "user",
							id: u.id,
						})),
					);
					break;
				}
				case "all_companies": {
					// Get primary contacts from all companies
					const { data: companies } = await supabase
						.from("companies")
						.select("id, email, name")
						.not("email", "is", null);
					recipients.push(
						...(companies || []).map((c) => ({
							email: c.email,
							name: c.name,
							type: "company",
							id: c.id,
						})),
					);
					break;
				}
				case "custom": {
					// Use custom email list from filter
					if (filter?.customEmails) {
						recipients.push(
							...filter.customEmails.map((email) => ({
								email,
								type: "custom",
							})),
						);
					}
					break;
				}
				case "segment": {
					// Filter users based on segment criteria
					let query = supabase
						.from("users")
						.select("id, email, full_name, role");
					if (filter?.userRoles?.length) {
						query = query.in("role", filter.userRoles);
					}
					if (filter?.userStatuses?.length) {
						query = query.in("status", filter.userStatuses);
					}
					if (filter?.createdAfter) {
						query = query.gte("created_at", filter.createdAfter);
					}
					if (filter?.createdBefore) {
						query = query.lte("created_at", filter.createdBefore);
					}
					const { data: users } = await query.not("email", "is", null);
					recipients.push(
						...(users || []).map((u) => ({
							email: u.email,
							name: u.full_name,
							type: "segment",
							id: u.id,
						})),
					);
					break;
				}
			}
			// Apply exclusions
			if (
				filter?.excludeUnsubscribed ||
				filter?.excludeBounced ||
				filter?.excludeComplained
			) {
				// Get suppressed emails
				const { data: suppressions } = await supabase
					.from("email_suppressions")
					.select("email, reason");
				const suppressedEmails = new Set(
					(suppressions || [])
						.filter((s) => {
							if (filter.excludeUnsubscribed && s.reason === "unsubscribed")
								return true;
							if (filter.excludeBounced && s.reason === "bounced") return true;
							if (filter.excludeComplained && s.reason === "complained")
								return true;
							return false;
						})
						.map((s) => s.email.toLowerCase()),
				);
				return recipients.filter(
					(r) => !suppressedEmails.has(r.email.toLowerCase()),
				);
			}
			return recipients;
		}
		/**
		 * Get waitlist contacts from Resend
		 */ async function getWaitlistContacts() {
			try {
				const audienceId = process.env.RESEND_WAITLIST_AUDIENCE_ID;
				if (!audienceId) {
					console.warn("RESEND_WAITLIST_AUDIENCE_ID not configured");
					return [];
				}
				const response = await resend.contacts.list({
					audienceId,
				});
				if (response.error) {
					console.error("Failed to fetch waitlist contacts:", response.error);
					return [];
				}
				return (response.data?.data || []).map((contact) => ({
					id: contact.id,
					email: contact.email,
					firstName: contact.first_name || undefined,
					lastName: contact.last_name || undefined,
				}));
			} catch (error) {
				console.error("Failed to fetch waitlist contacts:", error);
				return [];
			}
		}
		/**
		 * Update aggregate campaign statistics
		 */ async function updateCampaignStats(campaignId) {
			const supabase = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"createClient"
			])();
			// Get counts from sends table
			const { data: stats } = await supabase
				.from("email_campaign_sends")
				.select("status")
				.eq("campaign_id", campaignId);
			if (!stats) return;
			const counts = {
				delivered_count: stats.filter((s) =>
					["delivered", "opened", "clicked"].includes(s.status),
				).length,
				opened_count: stats.filter((s) =>
					["opened", "clicked"].includes(s.status),
				).length,
				unique_opens: stats.filter((s) =>
					["opened", "clicked"].includes(s.status),
				).length,
				clicked_count: stats.filter((s) => s.status === "clicked").length,
				unique_clicks: stats.filter((s) => s.status === "clicked").length,
				bounced_count: stats.filter((s) => s.status === "bounced").length,
				complained_count: stats.filter((s) => s.status === "complained").length,
			};
			await supabase
				.from("email_campaigns")
				.update(counts)
				.eq("id", campaignId);
		}
		/**
		 * Map database row to EmailCampaign type
		 */ function mapCampaignFromDb(row) {
			return {
				id: row.id,
				name: row.name,
				subject: row.subject,
				previewText: row.preview_text,
				templateId: row.template_id,
				templateData: row.template_data,
				htmlContent: row.html_content,
				plainTextContent: row.plain_text_content,
				status: row.status,
				scheduledFor: row.scheduled_for,
				audienceType: row.audience_type,
				audienceFilter: row.audience_filter,
				totalRecipients: row.total_recipients || 0,
				sentCount: row.sent_count || 0,
				deliveredCount: row.delivered_count || 0,
				openedCount: row.opened_count || 0,
				uniqueOpens: row.unique_opens || 0,
				clickedCount: row.clicked_count || 0,
				uniqueClicks: row.unique_clicks || 0,
				bouncedCount: row.bounced_count || 0,
				complainedCount: row.complained_count || 0,
				unsubscribedCount: row.unsubscribed_count || 0,
				failedCount: row.failed_count || 0,
				revenueAttributed: Number(row.revenue_attributed || 0),
				conversionsCount: row.conversions_count || 0,
				fromName: row.from_name,
				fromEmail: row.from_email,
				replyTo: row.reply_to,
				tags: row.tags || [],
				notes: row.notes,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
				sentAt: row.sent_at,
			};
		}
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"ensureServerEntryExports"
		])([
			createCampaign,
			updateCampaign,
			deleteCampaign,
			duplicateCampaign,
			sendCampaign,
			scheduleCampaign,
			cancelScheduledCampaign,
			pauseCampaign,
			resumeCampaign,
			previewAudience,
			getCampaignAnalytics,
			recordCampaignEvent,
		]);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(createCampaign, "4052d2bfebb353ea74b1949d573e258603ef44f96f", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(updateCampaign, "40d1b5f9e75fb61ed582c571643f84c6560b125a9a", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(deleteCampaign, "40b11fc9abef983db72b135bbe418052ebe542800a", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(duplicateCampaign, "4043ae0039bf09c40589e660c59b07364b7c03eea1", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(sendCampaign, "409672eb9339ca62cc96de65f7dcac5d4a49a0b478", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(scheduleCampaign, "60b4d0e31b81b8c3d4635afecade7d99682faac8c4", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(
			cancelScheduledCampaign,
			"40eaa63c9acddfea7c31afc5985c991d0024189757",
			null,
		);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(pauseCampaign, "4089e557e2816754916dbdd651062181b36b4d2433", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(resumeCampaign, "409ddc6e3d75dffb6c90f8a205c85c6871c1cac117", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(previewAudience, "60af3af87ad52156490b89abc6aa146796116d29c0", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(
			getCampaignAnalytics,
			"40b399ccf9a2142395bfa2eea55fde288210f7ed84",
			null,
		);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(recordCampaignEvent, "7834098687d20bccdb54f44f3540bd99e1d2c099dd", null);
	},
	'[project]/apps/admin/.next-internal/server/app/(dashboard)/dashboard/marketing/campaigns/new/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin/src/actions/campaigns.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>',
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/actions/campaigns.ts [app-rsc] (ecmascript)",
			);
	},
	'[project]/apps/admin/.next-internal/server/app/(dashboard)/dashboard/marketing/campaigns/new/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin/src/actions/campaigns.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript)',
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"4052d2bfebb353ea74b1949d573e258603ef44f96f",
			() =>
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"createCampaign"
				],
			"409672eb9339ca62cc96de65f7dcac5d4a49a0b478",
			() =>
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"sendCampaign"
				],
			"60b4d0e31b81b8c3d4635afecade7d99682faac8c4",
			() =>
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"scheduleCampaign"
				],
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$dashboard$2f$marketing$2f$campaigns$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				'[project]/apps/admin/.next-internal/server/app/(dashboard)/dashboard/marketing/campaigns/new/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin/src/actions/campaigns.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>',
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/actions/campaigns.ts [app-rsc] (ecmascript)",
			);
	},
];

//# sourceMappingURL=%5Broot-of-the-server%5D__93815fb5._.js.map
