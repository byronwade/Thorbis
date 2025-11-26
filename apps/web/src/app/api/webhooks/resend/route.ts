import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { processResendWebhookEvent } from "@/lib/email/deliverability-monitor";
import {
	handleBounceWebhook,
	handleComplaintWebhook,
} from "@/lib/email/email-sender";
import {
	getReceivedEmail,
	getReceivedEmailAttachment,
	listReceivedEmailAttachments,
	verifyResendWebhookSignature,
} from "@/lib/email/resend-domains";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

/**
 * Result type for customer lookup with duplicate detection
 */
type CustomerLookupResult = {
	customerId: string | null;
	duplicateCustomerIds?: string[];
	hasDuplicates: boolean;
};

/**
 * Find customer by email address for auto-linking inbound emails
 * Returns the most recently updated customer if multiple matches found,
 * along with duplicate detection info for potential merge prompts
 */
async function findCustomerByEmail(
	supabase: TypedSupabaseClient,
	companyId: string,
	email: string,
): Promise<CustomerLookupResult> {
	if (!email) {
		return { customerId: null, hasDuplicates: false };
	}

	const normalizedEmail = email.toLowerCase().trim();

	// Find ALL matching customers, ordered by most recently updated
	const { data: customers, error } = await supabase
		.from("customers")
		.select("id, updated_at")
		.eq("company_id", companyId)
		.eq("email", normalizedEmail)
		.order("updated_at", { ascending: false });

	if (error) {
		console.error("Error finding customer by email:", error);
		return { customerId: null, hasDuplicates: false };
	}

	if (!customers || customers.length === 0) {
		return { customerId: null, hasDuplicates: false };
	}

	// Single match - no duplicates
	if (customers.length === 1) {
		return { customerId: customers[0].id, hasDuplicates: false };
	}

	// Multiple matches - return most recently active and flag duplicates
	console.log(
		`⚠️  Found ${customers.length} customers with email ${normalizedEmail}`,
	);
	return {
		customerId: customers[0].id,
		duplicateCustomerIds: customers.slice(1).map((c) => c.id),
		hasDuplicates: true,
	};
}

type TypedSupabaseClient = SupabaseClient<Database>;

export async function POST(request: Request) {
	try {
		console.log("🔄 Webhook received - processing...");

		const rawBody = await request.text();
		const headersList = await headers();

		console.log("Headers received:", {
			svixId: headersList.get("svix-id"),
			svixTimestamp: headersList.get("svix-timestamp"),
			hasSignature: !!headersList.get("svix-signature"),
		});

		const isValid = await verifyResendWebhookSignature({
			payload: rawBody,
			headers: {
				svixId: headersList.get("svix-id") || undefined,
				svixTimestamp: headersList.get("svix-timestamp") || undefined,
				svixSignature: headersList.get("svix-signature") || undefined,
			},
		});

		if (!isValid) {
			console.error("❌ Invalid webhook signature");
			return NextResponse.json(
				{ success: false, error: "Invalid signature" },
				{ status: 401 },
			);
		}

		console.log("✅ Webhook signature verified");

		const payload = JSON.parse(rawBody) as ResendWebhookPayload;
		console.log(`📧 Processing webhook event: ${payload.type}`);

		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			console.error("❌ Failed to create Supabase client");
			return NextResponse.json(
				{ success: false, error: "Database connection failed" },
				{ status: 500 },
			);
		}

		console.log("✅ Database client created");

		switch (payload.type) {
			case "email.delivered":
			case "email.bounced":
			case "email.complained":
			case "email.opened":
			case "email.clicked":
				await handleEmailEvent(supabase, payload);
				// Track deliverability events for domain reputation
				if (
					[
						"email.delivered",
						"email.bounced",
						"email.complained",
						"email.opened",
						"email.clicked",
					].includes(payload.type)
				) {
					try {
						await processResendWebhookEvent({
							type: payload.type,
							data: {
								email_id: payload.data.id,
								from:
									typeof payload.data.from?.[0] === "string"
										? payload.data.from[0]
										: payload.data.from?.[0]?.email,
								to: payload.data.to?.map((t) =>
									typeof t === "string" ? t : t.email,
								),
								subject: payload.data.subject,
								created_at: payload.created_at,
							},
						});
					} catch (deliverabilityError) {
						console.error(
							"⚠️  Deliverability tracking error:",
							deliverabilityError,
						);
						// Don't fail the webhook for deliverability tracking errors
					}
				}
				break;
			case "email.received":
				console.log("📧 Handling email.received event");
				await handleEmailReceived(supabase, payload);
				break;
			default:
				console.log(`⚠️  Unknown event type: ${payload.type}`);
				break;
		}

		console.log("✅ Webhook processed successfully");
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("💥 Webhook processing failed:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function handleEmailEvent(
	supabase: TypedSupabaseClient,
	payload: ResendWebhookPayload,
) {
	const communicationId = payload.data.tags?.find(
		(tag) => tag.name === "communication_id",
	)?.value;

	// Get company_id from tags for suppression list
	const companyIdTag = payload.data.tags?.find(
		(tag) => tag.name === "company_id",
	)?.value;

	// Process bounces and complaints for suppression list
	if (payload.type === "email.bounced" || payload.type === "email.complained") {
		// Get recipient emails
		const toAddresses =
			(payload.data.to
				?.map((t) => (typeof t === "string" ? t : t.email))
				.filter(Boolean) as string[]) || [];

		// Try to get company_id from tags or from the communication
		let companyId = companyIdTag;

		if (!companyId && communicationId) {
			const { data: comm } = await supabase
				.from("communications")
				.select("company_id")
				.eq("id", communicationId)
				.single();
			companyId = comm?.company_id;
		}

		if (companyId && toAddresses.length > 0) {
			for (const email of toAddresses) {
				try {
					if (payload.type === "email.bounced") {
						// Determine bounce type from payload
						const bounceType =
							payload.data.bounce_type === "hard" ? "hard" : "soft";
						const bounceReason =
							payload.data.bounce_reason || payload.data.error?.message;

						console.log(`📧 Processing bounce for ${email} (${bounceType})`);
						await handleBounceWebhook(
							companyId,
							email,
							bounceType,
							bounceReason,
						);
					} else if (payload.type === "email.complained") {
						console.log(`📧 Processing complaint for ${email}`);
						await handleComplaintWebhook(companyId, email);
					}
				} catch (err) {
					console.error(
						`Failed to process ${payload.type} for suppression list:`,
						err,
					);
					// Don't fail the webhook for suppression list errors
				}
			}
		}
	}

	if (!communicationId) {
		return;
	}

	await supabase.from("communication_email_events").insert({
		communication_id: communicationId,
		event_type: payload.type,
		provider_event_id: payload.data.id,
		payload,
		occurred_at: payload.created_at,
	});

	const updates: Record<string, unknown> = {
		provider_status: payload.type,
		provider_metadata: payload,
	};

	if (payload.type === "email.delivered") {
		updates.status = "delivered";
		updates.delivered_at = new Date().toISOString();
	}

	if (payload.type === "email.bounced") {
		updates.status = "bounced";
		updates.bounced_at = new Date().toISOString();
		updates.bounce_reason =
			payload.data.bounce_reason || payload.data.error?.message;
	}

	if (payload.type === "email.complained") {
		updates.status = "complained";
		updates.complained_at = new Date().toISOString();
	}

	if (payload.type === "email.opened") {
		// Get current values to increment counts
		const { data: current } = await supabase
			.from("communications")
			.select("opened_at, open_count")
			.eq("id", communicationId)
			.single();

		const currentOpenCount = current?.open_count || 0;
		updates.open_count = currentOpenCount + 1;

		// Set opened_at on first open only
		if (!current?.opened_at) {
			updates.opened_at = new Date().toISOString();
		}
	}

	if (payload.type === "email.clicked") {
		// Get current values to increment counts
		const { data: current } = await supabase
			.from("communications")
			.select("clicked_at, click_count")
			.eq("id", communicationId)
			.single();

		const currentClickCount = current?.click_count || 0;
		updates.click_count = currentClickCount + 1;

		// Set clicked_at on first click only
		if (!current?.clicked_at) {
			updates.clicked_at = new Date().toISOString();
		}
	}

	await supabase
		.from("communications")
		.update(updates)
		.eq("id", communicationId);
}

async function handleEmailReceived(
	supabase: TypedSupabaseClient,
	payload: ResendWebhookPayload,
) {
	console.log("📧 Starting email processing...");

	// Handle both formats: array of strings or array of objects
	let destination: string | undefined;
	const toAddress = payload.data.to?.[0];
	if (typeof toAddress === "string") {
		destination = toAddress;
	} else if (
		toAddress &&
		typeof toAddress === "object" &&
		"email" in toAddress
	) {
		destination = toAddress.email;
	}

	console.log(`📧 Destination email: ${destination}`);
	console.log(`📧 Raw to field: ${JSON.stringify(payload.data.to)}`);

	if (!destination) {
		console.error("❌ No destination email found in webhook payload");
		console.error("   Payload data:", JSON.stringify(payload.data, null, 2));
		return;
	}

	console.log(`🔍 Looking up route for: ${destination}`);

	// Extract domain from destination email
	const destinationDomain = destination.split("@")[1];

	// PHASE 1: Try to find existing inbound route
	let { data: route, error: routeError } = await supabase
		.from("communication_email_inbound_routes")
		.select("company_id, route_address")
		.eq("route_address", destination)
		.eq("enabled", true)
		.maybeSingle();

	if (routeError) {
		console.error("❌ Route lookup error:", routeError.message);
	}

	// PHASE 2: If no exact match, try domain-level catch-all (e.g., @biezru.resend.app)
	if (!route?.company_id && destinationDomain) {
		console.log(
			`🔍 No exact match, trying domain catch-all for: @${destinationDomain}`,
		);
		const catchAllPattern = `@${destinationDomain}`;

		const { data: catchAllRoute, error: catchAllError } = await supabase
			.from("communication_email_inbound_routes")
			.select("company_id, route_address")
			.eq("route_address", catchAllPattern)
			.eq("enabled", true)
			.maybeSingle();

		if (!catchAllError && catchAllRoute?.company_id) {
			console.log(`✅ Found catch-all route: ${catchAllPattern}`);
			route = catchAllRoute;
		}
	}

	// PHASE 3: If still no route, try finding company by email domain
	let companyId = route?.company_id;
	let autoCreatedRoute = false;

	if (!companyId && destinationDomain) {
		console.log(
			`🔍 No route found, checking for company by email domain: ${destinationDomain}`,
		);

		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("id, email_domain, email_receive_all")
			.eq("email_domain", destinationDomain)
			.eq("email_receive_all", true)
			.maybeSingle();

		if (!companyError && company) {
			console.log(`✅ Found company by domain: ${company.id}`);
			companyId = company.id;

			// Auto-create inbound route for this specific email address
			console.log(`🔧 Auto-creating inbound route for: ${destination}`);
			const { data: newRoute, error: createError } = await supabase
				.from("communication_email_inbound_routes")
				.insert({
					company_id: companyId,
					route_address: destination,
					name: `Auto-created route for ${destination}`,
					enabled: true,
					status: "active",
				})
				.select()
				.maybeSingle();

			if (createError) {
				console.error(`⚠️  Failed to auto-create route:`, createError.message);
			} else {
				console.log(`✅ Auto-created route: ${newRoute?.id}`);
				autoCreatedRoute = true;
			}
		}
	}

	// PHASE 4: If still no company, store as unrouted email for manual review
	if (!companyId) {
		console.log(
			`⚠️  No company found for ${destination}, storing as unrouted email`,
		);

		const { error: unroutedError } = await supabase
			.from("communication_unrouted_emails")
			.insert({
				to_address: destination,
				from_address:
					(payload.data.from?.[0] as any)?.email ||
					(payload.data.from?.[0] as string) ||
					"unknown",
				subject: payload.data.subject,
				payload: payload,
				status: "pending",
			});

		if (unroutedError) {
			console.error(
				`❌ Failed to store unrouted email:`,
				unroutedError.message,
			);
		} else {
			console.log(`✅ Stored unrouted email for manual review`);
		}

		// Return early - don't process further without company
		return;
	}

	console.log(
		`✅ ${autoCreatedRoute ? "Auto-created route and processing" : "Route found"} for company: ${companyId}`,
	);

	const emailId = payload.data.email_id || payload.data.id;
	console.log(`📧 Email ID: ${emailId}`);

	if (!emailId) {
		console.error("❌ No email ID found in webhook payload");
		return;
	}

	console.log(
		`🚀 Processing received email: ${emailId} for company: ${companyId}`,
	);

	// PRIORITY: Use webhook payload data FIRST (most reliable)
	const emailData = {
		subject: payload.data.subject || "(No subject)",
		html: payload.data.html || null,
		text: payload.data.text || payload.data.body || "",
	};

	console.log(`Using email data from webhook payload:`, {
		subject: emailData.subject,
		hasHtml: !!emailData.html,
		hasText: !!emailData.text,
	});

	// Only fetch from Resend API if webhook didn't include content
	if (!emailData.html && !emailData.text) {
		console.log(
			`⚠️  No content in webhook payload, fetching from Resend API...`,
		);
		const emailResponse = await getReceivedEmail(emailId);

		if (emailResponse.success && emailResponse.data) {
			emailData.html =
				emailResponse.data.html || emailResponse.data.body_html || null;
			emailData.text =
				emailResponse.data.text ||
				emailResponse.data.body ||
				emailResponse.data.plain_text ||
				"";
			console.log(`✅ Fetched content from Resend API`);
		} else {
			console.error(
				`Failed to fetch email content for ${emailId}: ${emailResponse.error}`,
			);
		}
	}

	console.log(`Processing email: ${emailData.subject}`);

	try {
		// Check if we have content from webhook payload as fallback
		let finalText = emailData.text || "";
		let finalHtml = emailData.html || null;

		// If no content from API, try webhook payload directly
		if (!finalText && !finalHtml) {
			console.log("🔍 Checking webhook payload for content...");
			finalText = payload.data.text || payload.data.body || "";
			finalHtml = payload.data.html || payload.data.body_html || null;
			console.log(
				`   Webhook content: text=${!!finalText}, html=${!!finalHtml}`,
			);
		}

		// Check for attachments in webhook payload first (faster)
		const payloadAttachments = payload.data.attachments || [];
		console.log(
			`Found ${payloadAttachments.length} attachments in webhook payload`,
		);

		// Fetch attachments metadata from API (fallback if not in payload)
		let attachments = [];
		if (payloadAttachments.length > 0) {
			// Use attachments from payload
			attachments = payloadAttachments.map((att) => ({
				id: att.id || `att_${Date.now()}_${Math.random()}`,
				filename: att.filename || "attachment",
				content_type: att.content_type || "application/octet-stream",
				content: att.content, // Base64 encoded content from payload
			}));
			console.log(
				`Using ${attachments.length} attachments from webhook payload`,
			);
		} else {
			// Fallback to API if no attachments in payload
			const attachmentsResponse = await listReceivedEmailAttachments(emailId);
			attachments = attachmentsResponse.success ? attachmentsResponse.data : [];
			console.log(`Found ${attachments.length} attachments from API`);
		}

		// Download and store attachments first
		const storedAttachments = [];
		if (attachments.length > 0) {
			console.log(`Processing ${attachments.length} attachments...`);
			for (const attachment of attachments) {
				try {
					console.log(`Processing attachment: ${attachment.filename}`);

					let buffer: Buffer;

					// If attachment has content from webhook payload (base64), use it directly
					if (attachment.content && typeof attachment.content === "string") {
						// Content is already base64 encoded from webhook payload
						buffer = Buffer.from(attachment.content, "base64");
						console.log(`Using attachment content from webhook payload`);
					} else {
						// Otherwise, fetch from API
						console.log(
							`Downloading attachment from API: ${attachment.filename}`,
						);
						const attachmentResponse = await getReceivedEmailAttachment(
							emailId,
							attachment.id,
						);

						if (!attachmentResponse.success) {
							console.error(
								`Failed to download attachment ${attachment.filename}: ${attachmentResponse.error}`,
							);
							continue;
						}

						// The attachment response should contain the file content
						const attachmentData = attachmentResponse.data;

						if (
							attachmentData.content &&
							typeof attachmentData.content === "string"
						) {
							// If content is base64 encoded
							buffer = Buffer.from(attachmentData.content, "base64");
						} else if (
							attachmentData.content &&
							Buffer.isBuffer(attachmentData.content)
						) {
							// If content is already a buffer
							buffer = attachmentData.content;
						} else {
							console.error(
								`Invalid attachment content format for ${attachment.filename}`,
							);
							continue;
						}
					}

					const filePath = `${companyId}/${Date.now()}-${attachment.filename}`;
					await supabase.storage
						.from("email-attachments")
						.upload(filePath, buffer, {
							contentType:
								attachment.content_type || "application/octet-stream",
							upsert: true,
						});

					// Get public URL for the stored attachment
					const { data: urlData } = supabase.storage
						.from("email-attachments")
						.getPublicUrl(filePath);

					storedAttachments.push({
						id: attachment.id,
						name: attachment.filename,
						filename: attachment.filename,
						path: filePath,
						type: attachment.content_type,
						content_type: attachment.content_type,
						storage_url: urlData.publicUrl,
						storage_path: filePath,
						storage_bucket: "email-attachments",
					});

					console.log(
						`Stored attachment: ${attachment.filename} at ${filePath}`,
					);
				} catch (error) {
					console.error(
						`Error processing attachment ${attachment.filename}:`,
						error,
					);
				}
			}
		}

		console.log(
			`Successfully processed ${storedAttachments.length} attachments`,
		);
		// Extract from address (handle both string and object formats)
		const fromAddress = payload.data.from?.[0];
		const fromEmail =
			typeof fromAddress === "string" ? fromAddress : fromAddress?.email;
		const fromName =
			typeof fromAddress === "object" && fromAddress && "name" in fromAddress
				? fromAddress.name
				: undefined;

		// Auto-link to customer by email address (handles multiple matches)
		let customerId: string | null = null;
		let customerLookup: CustomerLookupResult = {
			customerId: null,
			hasDuplicates: false,
		};
		if (fromEmail) {
			console.log(`🔍 Looking up customer by email: ${fromEmail}`);
			customerLookup = await findCustomerByEmail(
				supabase,
				companyId,
				fromEmail,
			);
			customerId = customerLookup.customerId;
			if (customerId) {
				console.log(`✅ Found customer: ${customerId}`);
				if (customerLookup.hasDuplicates) {
					console.log(
						`⚠️  Warning: ${customerLookup.duplicateCustomerIds?.length} duplicate customers found with same email`,
					);
				}
			} else {
				console.log(`⚠️  No customer found for email: ${fromEmail}`);
			}
		}

		// Run spam filter check
		console.log(`🔍 Running spam filter check...`);
		let spamResult = null;
		try {
			const { checkSpam } = await import("@/lib/email/spam-filter");
			spamResult = await checkSpam({
				subject: emailData.subject,
				body: finalText,
				bodyHtml: finalHtml,
				fromAddress: fromEmail,
				fromName: fromName,
				toAddress: destination,
			});

			if (spamResult.isSpam) {
				console.log(
					`🚫 Email detected as spam (${spamResult.method}, confidence: ${(spamResult.confidence * 100).toFixed(1)}%): ${spamResult.reason}`,
				);
			} else {
				console.log(
					`✅ Email passed spam filter (${spamResult.method}, confidence: ${(spamResult.confidence * 100).toFixed(1)}%)`,
				);
			}
		} catch (error) {
			console.error(`⚠️  Spam filter check failed:`, error);
			// Continue processing even if spam check fails
		}

		// Now insert the email into communications table with all data
		console.log(`💾 Inserting email into database...`);
		console.log(`   Company ID: ${companyId}`);
		console.log(`   Customer ID: ${customerId || "none"}`);
		console.log(`   Subject: ${emailData.subject}`);
		console.log(`   From: ${fromEmail}`);
		console.log(`   Attachments: ${storedAttachments.length}`);
		console.log(`   Spam: ${spamResult?.isSpam ? "YES" : "NO"}`);

		// Build provider metadata with duplicate customer detection
		const providerMetadata: Record<string, unknown> = {
			...payload,
			full_content: emailData, // Store API response
			webhook_content: {
				// Store webhook payload content for reference
				text: payload.data.text,
				html: payload.data.html,
				body: payload.data.body,
				body_html: payload.data.body_html,
			},
			attachments: storedAttachments, // Store attachment metadata for easy access
			spam_check: spamResult
				? {
						isSpam: spamResult.isSpam,
						confidence: spamResult.confidence,
						reason: spamResult.reason,
						method: spamResult.method,
						score: spamResult.score,
						checked_at: new Date().toISOString(),
					}
				: null,
		};

		// Add duplicate customer detection info if multiple matches found
		if (customerLookup.hasDuplicates) {
			providerMetadata.duplicate_customers = {
				detected: true,
				primary_customer_id: customerId,
				other_customer_ids: customerLookup.duplicateCustomerIds,
				merge_suggested: true,
				message:
					"Multiple customers found with this email address. Consider merging these contacts.",
			};
		}

		const insertData: any = {
			company_id: companyId,
			customer_id: customerId, // Auto-linked by email address (most recently updated if duplicates)
			type: "email",
			channel: "resend",
			direction: "inbound",
			from_address: fromEmail,
			from_name: fromName,
			to_address: destination,
			subject: emailData.subject,
			body: finalText,
			body_html: finalHtml,
			status: "delivered",
			provider_message_id: emailId,
			provider_metadata: providerMetadata,
			is_thread_starter: true,
		};

		// Set category to spam if detected
		if (spamResult?.isSpam) {
			insertData.category = "spam";
			// Also add "spam" tag for filtering
			insertData.tags = ["spam"];
		}

		const { data: insertedEmail, error: insertError } = await supabase
			.from("communications")
			.insert(insertData)
			.select()
			.single();

		if (insertError) {
			console.error(`❌ Failed to insert email:`, insertError);
			console.error(
				`   Error details: ${JSON.stringify(insertError, null, 2)}`,
			);
			return;
		}

		console.log(`✅ Email inserted successfully with ID: ${insertedEmail.id}`);
		console.log(
			`✅ Successfully stored email: ${emailData.subject} with ${storedAttachments.length} attachments`,
		);
	} catch (error) {
		console.error(`Unexpected error processing email: ${error}`);
		return; // Exit early on error
	}
}

type ResendWebhookPayload = {
	type: string;
	created_at: string;
	data: {
		id?: string;
		email_id?: string; // The actual email ID for API calls
		subject?: string;
		text?: string;
		html?: string;
		body?: string;
		body_html?: string;
		to?: string[] | { email: string }[]; // Can be array of strings or array of objects
		from?: string[] | { email: string; name?: string }[]; // Can be array of strings or array of objects
		tags?: { name: string; value: string }[];
		// Bounce-specific fields
		bounce_type?: "hard" | "soft";
		bounce_reason?: string;
		error?: {
			message?: string;
			code?: string;
		};
		attachments?: Array<{
			id?: string;
			filename?: string;
			content?: string;
			content_type?: string;
			content_disposition?: string;
			content_id?: string;
		}>;
	};
};
