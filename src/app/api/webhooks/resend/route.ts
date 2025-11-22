import { getReceivedEmail, getReceivedEmailAttachment, listReceivedEmailAttachments, verifyResendWebhookSignature } from "@/lib/email/resend-domains";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";

type TypedSupabaseClient = SupabaseClient<Database>;

export async function POST(request: Request) {
	const webhookId = crypto.randomUUID();
	try {
		console.log(`🔄 [${webhookId}] Webhook received - processing...`);

		const rawBody = await request.text();
		const headersList = await headers();

		console.log(`📋 [${webhookId}] Headers received:`, {
			svixId: headersList.get("svix-id"),
			svixTimestamp: headersList.get("svix-timestamp"),
			hasSignature: !!headersList.get("svix-signature")
		});

		const isValid = verifyResendWebhookSignature({
			payload: rawBody,
			headers: {
				svixId: headersList.get("svix-id") || undefined,
				svixTimestamp: headersList.get("svix-timestamp") || undefined,
				svixSignature: headersList.get("svix-signature") || undefined,
			},
		});

		if (!isValid) {
			console.error("❌ Invalid webhook signature");
			return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
		}

		console.log("✅ Webhook signature verified");

		const payload = JSON.parse(rawBody) as ResendWebhookPayload;
		console.log(`📧 [${webhookId}] Processing webhook event: ${payload.type}`);
		console.log(`📧 [${webhookId}] Event data:`, {
			emailId: payload.data.email_id || payload.data.id,
			subject: payload.data.subject,
			to: payload.data.to,
			from: payload.data.from,
		});

		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			console.error("❌ Failed to create Supabase client");
			return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 });
		}

		console.log("✅ Database client created");

		switch (payload.type) {
			case "email.delivered":
			case "email.bounced":
			case "email.complained":
			case "email.opened":
			case "email.clicked":
				await handleEmailEvent(supabase, payload);
				break;
			case "email.received":
				console.log("📧 Handling email.received event");
				try {
					await handleEmailReceived(supabase, payload);
					console.log("✅ Email received event processed successfully");
				} catch (error) {
					console.error("❌ Failed to process email.received event:", error);
					// Return error response so Resend knows to retry
					return NextResponse.json(
						{ 
							success: false, 
							error: error instanceof Error ? error.message : "Failed to process email" 
						}, 
						{ status: 500 }
					);
				}
				break;
			default:
				console.log(`⚠️  Unknown event type: ${payload.type}`);
				break;
		}

		console.log(`✅ [${webhookId}] Webhook processed successfully`);
		return NextResponse.json({ success: true });

	} catch (error) {
		console.error(`💥 [${webhookId}] Webhook processing failed:`, error);
		console.error(`💥 [${webhookId}] Error details:`, {
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		});
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : "Internal server error" 
			}, 
			{ status: 500 }
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
	} else if (toAddress && typeof toAddress === "object" && "email" in toAddress) {
		destination = toAddress.email;
	}

	console.log(`📧 Destination email: ${destination}`);
	console.log(`📧 Raw to field: ${JSON.stringify(payload.data.to)}`);

	if (!destination) {
		console.error("❌ No destination email found in webhook payload");
		console.error("   Payload data:", JSON.stringify(payload.data, null, 2));
		console.error("   Full payload:", JSON.stringify(payload, null, 2));
		// Throw error so it's properly logged and Resend can retry
		throw new Error("No destination email found in webhook payload");
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
		console.log(`🔍 No exact match, trying domain catch-all for: @${destinationDomain}`);
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
		console.log(`🔍 No route found, checking for company by email domain: ${destinationDomain}`);
		
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
					status: 'active',
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
		console.log(`⚠️  No company found for ${destination}, storing as unrouted email`);
		
		const { error: unroutedError } = await supabase
			.from("communication_unrouted_emails")
			.insert({
				to_address: destination,
				from_address: (payload.data.from?.[0] as any)?.email || (payload.data.from?.[0] as string) || "unknown",
				subject: payload.data.subject,
				payload: payload,
				status: 'pending',
			});

		if (unroutedError) {
			console.error(`❌ Failed to store unrouted email:`, unroutedError.message);
		} else {
			console.log(`✅ Stored unrouted email for manual review`);
		}
		
		// Return early - don't process further without company
		return;
	}

	console.log(`✅ ${autoCreatedRoute ? 'Auto-created route and processing' : 'Route found'} for company: ${companyId}`);

	const emailId = payload.data.email_id || payload.data.id;
	console.log(`📧 Email ID: ${emailId}`);
	console.log(`📧 Full payload.data:`, JSON.stringify(payload.data, null, 2));

	if (!emailId) {
		console.error("❌ No email ID found in webhook payload");
		console.error("   Payload data keys:", Object.keys(payload.data));
		console.error("   Full payload:", JSON.stringify(payload, null, 2));
		// Store as unrouted for debugging
		await supabase
			.from("communication_unrouted_emails")
			.insert({
				to_address: destination || "unknown",
				from_address: (payload.data.from?.[0] as any)?.email || (payload.data.from?.[0] as string) || "unknown",
				subject: payload.data.subject || "No subject",
				payload: payload,
				status: 'error',
				error_message: "No email ID found in webhook payload",
			})
			.catch(err => console.error("Failed to store error record:", err));
		throw new Error("No email ID found in webhook payload");
	}

	console.log(`🚀 Processing received email: ${emailId} for company: ${companyId}`);

	// PRIORITY: Use webhook payload data FIRST (most reliable)
	const emailData = {
		subject: payload.data.subject || "(No subject)",
		html: payload.data.html || null,
		text: payload.data.text || payload.data.body || "",
	};
	
	console.log(`Using email data from webhook payload:`, { 
		subject: emailData.subject, 
		hasHtml: !!emailData.html, 
		hasText: !!emailData.text 
	});

	// Fetch full email from Resend API to get complete from/to addresses and content
	let fullEmailData: any = null;
	const emailResponse = await getReceivedEmail(emailId);
	if (emailResponse.success && emailResponse.data) {
		fullEmailData = emailResponse.data;
		// Use API data if webhook didn't have content
		if (!emailData.html && !emailData.text) {
			emailData.html = fullEmailData.html || fullEmailData.body_html || null;
			emailData.text = fullEmailData.text || fullEmailData.body || fullEmailData.plain_text || "";
			console.log(`✅ Fetched content from Resend API`);
		}
	} else {
		console.error(`Failed to fetch email content for ${emailId}: ${emailResponse.error}`);
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
			console.log(`   Webhook content: text=${!!finalText}, html=${!!finalHtml}`);
		}

		// Check for attachments in webhook payload first (faster)
		const payloadAttachments = payload.data.attachments || [];
		console.log(`Found ${payloadAttachments.length} attachments in webhook payload`);

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
			console.log(`Using ${attachments.length} attachments from webhook payload`);
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
				if (attachment.content && typeof attachment.content === 'string') {
					// Content is already base64 encoded from webhook payload
					buffer = Buffer.from(attachment.content, 'base64');
					console.log(`Using attachment content from webhook payload`);
				} else {
					// Otherwise, fetch from API
					console.log(`Downloading attachment from API: ${attachment.filename}`);
					const attachmentResponse = await getReceivedEmailAttachment(emailId, attachment.id);

					if (!attachmentResponse.success) {
						console.error(`Failed to download attachment ${attachment.filename}: ${attachmentResponse.error}`);
						continue;
					}

					// The attachment response should contain the file content
					const attachmentData = attachmentResponse.data;

					if (attachmentData.content && typeof attachmentData.content === 'string') {
						// If content is base64 encoded
						buffer = Buffer.from(attachmentData.content, 'base64');
					} else if (attachmentData.content && Buffer.isBuffer(attachmentData.content)) {
						// If content is already a buffer
						buffer = attachmentData.content;
					} else {
						console.error(`Invalid attachment content format for ${attachment.filename}`);
						continue;
					}
				}

			const filePath = `${companyId}/${Date.now()}-${attachment.filename}`;
			await supabase.storage
				.from("email-attachments")
				.upload(filePath, buffer, {
					contentType: attachment.content_type || "application/octet-stream",
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

				console.log(`Stored attachment: ${attachment.filename} at ${filePath}`);
			} catch (error) {
				console.error(`Error processing attachment ${attachment.filename}:`, error);
			}
		}
		}

		console.log(`Successfully processed ${storedAttachments.length} attachments`);
		
		/**
		 * Extract full email address from various formats
		 * NEVER truncates - always returns the complete email address
		 */
		const extractFullEmail = (value: unknown): string | undefined => {
			if (!value) return undefined;
			
			// Extract email from "Name <email@domain.com>" format
			const extractFromFormat = (str: string): string => {
				// Try to extract email from angle brackets first
				const emailMatch = str.match(/<([^>]+@[^>]+)>/);
				if (emailMatch && emailMatch[1]) {
					const extracted = emailMatch[1].trim();
					// Validate it looks like an email
					if (extracted.includes("@") && extracted.length > 3) {
						return extracted;
					}
				}
				// If no angle brackets, check if it's a valid email format
				if (str.includes("@") && str.length > 3) {
					return str.trim();
				}
				// Return as-is if no clear email format found
				return str.trim();
			};

			// Handle string format
			if (typeof value === "string" && value.length > 0) {
				const extracted = extractFromFormat(value);
				// Only return if it looks like a valid email (contains @ and has reasonable length)
				if (extracted.includes("@") && extracted.length > 3) {
					return extracted;
				}
			}

			// Handle array format
			if (Array.isArray(value) && value.length > 0) {
				const first = value[0];
				if (typeof first === "string" && first.length > 0) {
					const extracted = extractFromFormat(first);
					if (extracted.includes("@") && extracted.length > 3) {
						return extracted;
					}
				}
				if (first && typeof first === "object" && "email" in first) {
					const email = (first as { email?: string }).email;
					if (email && typeof email === "string" && email.length > 0) {
						const extracted = extractFromFormat(email);
						if (extracted.includes("@") && extracted.length > 3) {
							return extracted;
						}
					}
				}
			}

			// Handle object format
			if (value && typeof value === "object" && !Array.isArray(value)) {
				const obj = value as Record<string, unknown>;
				if ("email" in obj && typeof obj.email === "string" && obj.email.length > 0) {
					const extracted = extractFromFormat(obj.email);
					if (extracted.includes("@") && extracted.length > 3) {
						return extracted;
					}
				}
			}

			return undefined;
		};

		// Extract from address - prioritize API response, fallback to webhook payload
		let fromAddress: any = null;
		let fromEmail: string | undefined;
		let fromName: string | undefined;
		
		// Try to get from API response first (more reliable)
		if (fullEmailData?.from) {
			fromAddress = fullEmailData.from;
			console.log(`📧 Using from address from API:`, fromAddress);
		} else {
			// Fallback to webhook payload
			fromAddress = payload.data.from?.[0];
			console.log(`📧 Using from address from webhook:`, fromAddress);
		}
		
		// Parse from address (handle both string and object formats)
		if (typeof fromAddress === "string") {
			fromEmail = extractFullEmail(fromAddress);
			// Extract name from "Name <email@domain.com>" format
			const nameMatch = fromAddress.match(/^([^<]+)</);
			if (nameMatch && nameMatch[1]) {
				fromName = nameMatch[1].trim();
			}
		} else if (fromAddress && typeof fromAddress === "object") {
			fromEmail = extractFullEmail(fromAddress.email || fromAddress);
			fromName = (fromAddress.name as string) || undefined;
		}
		
		// If still no email, try parsing from webhook payload more carefully
		if (!fromEmail || fromEmail.length <= 3 || !fromEmail.includes("@")) {
			const webhookFrom = payload.data.from;
			if (Array.isArray(webhookFrom) && webhookFrom.length > 0) {
				const firstFrom = webhookFrom[0];
				if (typeof firstFrom === "string") {
					const extracted = extractFullEmail(firstFrom);
					if (extracted) fromEmail = extracted;
					// Extract name from formatted string
					const nameMatch = firstFrom.match(/^([^<]+)</);
					if (nameMatch && nameMatch[1]) {
						fromName = nameMatch[1].trim();
					}
				} else if (firstFrom && typeof firstFrom === "object" && "email" in firstFrom) {
					const extracted = extractFullEmail(firstFrom.email);
					if (extracted) fromEmail = extracted;
					fromName = (firstFrom.name as string) || undefined;
				}
			}
		}
		
		// CRITICAL: Validate email before storing - must contain @ and be more than 3 characters
		if (!fromEmail || fromEmail.length <= 3 || !fromEmail.includes("@")) {
			console.error(`❌ Invalid email address extracted: "${fromEmail}"`);
			console.error(`   Full fromAddress:`, JSON.stringify(fromAddress, null, 2));
			console.error(`   Webhook payload from:`, JSON.stringify(payload.data.from, null, 2));
			console.error(`   API response from:`, fullEmailData?.from);
			// Don't throw - log error but continue with a placeholder to prevent data loss
			fromEmail = "unknown@unknown.local";
		}
		
		console.log(`📧 Extracted from address:`, { fromEmail, fromName });

		// Try to link to customer by email
		let customerId: string | null = null;
		if (fromEmail) {
			const { findCustomerByEmail } = await import("@/lib/communication/link-customer");
			customerId = await findCustomerByEmail(fromEmail, companyId);
			if (customerId) {
				console.log(`✅ Linked email to customer: ${customerId} (${fromEmail})`);
			}
		}

		// Run spam filter check (can be disabled via environment variable for testing)
		const spamFilterEnabled = process.env.ENABLE_SPAM_FILTER !== "false";
		let spamResult = null;
		
		if (spamFilterEnabled) {
			console.log(`🔍 Running spam filter check...`);
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
					console.log(`🚫 Email detected as spam (${spamResult.method}, confidence: ${(spamResult.confidence * 100).toFixed(1)}%): ${spamResult.reason}`);
				} else {
					console.log(`✅ Email passed spam filter (${spamResult.method}, confidence: ${(spamResult.confidence * 100).toFixed(1)}%)`);
				}
			} catch (error) {
				console.error(`⚠️  Spam filter check failed:`, error);
				// Continue processing even if spam check fails
			}
		} else {
			console.log(`⚠️  Spam filter is disabled (ENABLE_SPAM_FILTER=false)`);
		}

		// Now insert the email into communications table with all data
		console.log(`💾 Inserting email into database...`);
		console.log(`   Company ID: ${companyId}`);
		console.log(`   Subject: ${emailData.subject}`);
		console.log(`   From: ${fromEmail}`);
		console.log(`   Attachments: ${storedAttachments.length}`);
		console.log(`   Spam: ${spamResult?.isSpam ? "YES" : "NO"}`);

		const insertData: any = {
			company_id: companyId,
			type: "email",
			channel: "resend",
			direction: "inbound",
			from_address: fromEmail || null, // Store as string, not array - NEVER truncate
			from_name: fromName || null, // NEVER truncate
			to_address: destination, // Store as string, not array
			subject: emailData.subject,
			body: finalText,
			body_html: finalHtml,
			status: "delivered",
			provider_message_id: emailId,
			customer_id: customerId, // Link to customer if found
			provider_metadata: {
				...payload,
				full_content: emailData, // Store API response
				webhook_content: { // Store webhook payload content for reference
					text: payload.data.text,
					html: payload.data.html,
					body: payload.data.body,
					body_html: payload.data.body_html,
				},
				attachments: storedAttachments, // Store attachment metadata for easy access
				spam_check: spamResult ? {
					isSpam: spamResult.isSpam,
					confidence: spamResult.confidence,
					reason: spamResult.reason,
					method: spamResult.method,
					score: spamResult.score,
					checked_at: new Date().toISOString(),
				} : null,
			},
			is_thread_starter: true,
		};

		// Set category to spam if detected
		if (spamResult?.isSpam) {
			insertData.category = "spam";
			// Also add "spam" tag for filtering
			insertData.tags = ["spam"];
		}

		// Check for duplicate emails before inserting (prevent duplicate inserts)
		const { data: existingEmail } = await supabase
			.from("communications")
			.select("id")
			.eq("provider_message_id", emailId)
			.eq("company_id", companyId)
			.eq("type", "email")
			.maybeSingle();

		if (existingEmail) {
			console.log(`⚠️  Email ${emailId} already exists in database (ID: ${existingEmail.id}), skipping insert`);
			return; // Email already processed, return successfully
		}

		const { data: insertedEmail, error: insertError } = await supabase
			.from("communications")
			.insert(insertData)
			.select()
			.single();

		if (insertError) {
			console.error(`❌ Failed to insert email:`, insertError);
			console.error(`   Error details: ${JSON.stringify(insertError, null, 2)}`);
			console.error(`   Email ID: ${emailId}`);
			console.error(`   Company ID: ${companyId}`);
			console.error(`   Destination: ${destination}`);
			console.error(`   Subject: ${emailData.subject}`);
			
			// Store as unrouted email with error message for debugging
			await supabase
				.from("communication_unrouted_emails")
				.insert({
					to_address: destination,
					from_address: fromEmail || "unknown",
					subject: emailData.subject,
					payload: payload,
					status: 'error',
					error_message: `Database insert failed: ${insertError.message}`,
					company_id: companyId, // Store company ID even if insert failed
				})
				.catch(err => console.error("Failed to store error record:", err));
			
			// Throw error so Resend knows to retry
			throw new Error(`Failed to insert email: ${insertError.message}`);
		}

		console.log(`✅ Email inserted successfully with ID: ${insertedEmail.id}`);
		console.log(`✅ Successfully stored email: ${emailData.subject} with ${storedAttachments.length} attachments`);
	} catch (error) {
		console.error(`💥 Unexpected error processing email: ${error}`);
		console.error(`   Email ID: ${emailId || "unknown"}`);
		console.error(`   Company ID: ${companyId || "unknown"}`);
		console.error(`   Destination: ${destination || "unknown"}`);
		console.error(`   Error stack: ${error instanceof Error ? error.stack : "No stack trace"}`);
		
		// Re-throw error so Resend knows to retry
		throw error;
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
		to?: string[] | { email: string }[]; // Can be array of strings or array of objects
		from?: string[] | { email: string; name?: string }[]; // Can be array of strings or array of objects
		tags?: { name: string; value: string }[];
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
