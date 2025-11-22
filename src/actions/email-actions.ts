"use server";

import {
    getCompanyEmails,
    getEmailById,
    getEmailStats,
    getEmailThreads,
    markEmailAsRead,
    type CompanyEmail,
} from "@/lib/email/email-service";
import { z } from "zod";

const getEmailsSchema = z.object({
  limit: z.coerce.number().min(1).max(500).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
  type: z.enum(["sent", "received", "all"]).optional().default("all"),
  folder: z.enum(["inbox", "drafts", "sent", "archive", "snoozed", "spam", "trash", "bin", "starred"]).optional(),
  label: z.string().optional(),
  search: z.string().optional().nullable(),
  sortBy: z.enum(["created_at", "sent_at", "subject"]).optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
}).passthrough();

const getEmailThreadsSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(20),
  offset: z.number().min(0).optional().default(0),
  search: z.string().optional(),
});

const markEmailReadSchema = z.object({
  emailId: z.string().min(1),
});

export type GetEmailsInput = z.infer<typeof getEmailsSchema>;
export type GetEmailThreadsInput = z.infer<typeof getEmailThreadsSchema>;
export type MarkEmailReadInput = z.infer<typeof markEmailReadSchema>;

// Re-export email types from email-service
export type { CompanyEmail };

export type GetEmailsResult = Awaited<ReturnType<typeof getCompanyEmails>>;
export type GetEmailThreadsResult = Awaited<ReturnType<typeof getEmailThreads>>;
export type GetEmailStatsResult = Awaited<ReturnType<typeof getEmailStats>>;

/**
 * Get emails for the active company
 */
export async function getEmailsAction(
  input: GetEmailsInput
): Promise<GetEmailsResult> {
  try {
    console.log("📥 getEmailsAction called with:", JSON.stringify(input, null, 2));
    
    const parseResult = getEmailsSchema.safeParse(input);
    
    if (!parseResult.success) {
      console.error("❌ Zod validation error:", parseResult.error.issues);
      console.error("   Input received:", JSON.stringify(input, null, 2));
      throw new Error(`Invalid input parameters: ${parseResult.error.issues.map((e) => `${e.path.map(String).join('.')}: ${e.message}`).join(', ')}`);
    }
    
    const validatedInput = parseResult.data;
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      throw new Error("No active company found");
    }

    // Convert null to undefined for search field
    const sanitizedInput = {
      ...validatedInput,
      search: validatedInput.search ?? undefined,
    };
    return await getCompanyEmails(companyId, sanitizedInput);
  } catch (error) {
    console.error("❌ getEmailsAction error:", error);
    throw error;
  }
}

/**
 * Get email threads for the active company
 */
async function getEmailThreadsAction(
  input: GetEmailThreadsInput
): Promise<GetEmailThreadsResult> {
  try {
    const validatedInput = getEmailThreadsSchema.parse(input);
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      throw new Error("No active company found");
    }

    return await getEmailThreads(companyId, validatedInput);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid input parameters");
    }
    throw error;
  }
}

/**
 * Get a specific email by ID
 */
export async function getEmailByIdAction(emailId: string): Promise<{
  success: boolean;
  email?: CompanyEmail;
  error?: string;
}> {
  try {
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const email = await getEmailById(companyId, emailId);
    
    if (!email) {
      return { success: false, error: "Email not found" };
    }

    return { success: true, email };
  } catch (error) {
    console.error("Error getting email by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mark an email as read
 */
export async function markEmailAsReadAction(
  input: MarkEmailReadInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedInput = markEmailReadSchema.parse(input);
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const result = await markEmailAsRead(companyId, validatedInput.emailId);
    if (!result) {
      return { success: false, error: "Failed to mark email as read - check server logs for details" };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: `Invalid input: ${error.issues.map((e: { message: string }) => e.message).join(", ")}` };
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error marking email as read:", error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get email statistics for the active company
 */
async function getEmailStatsAction(): Promise<GetEmailStatsResult> {
  try {
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      throw new Error("No active company found");
    }

    return await getEmailStats(companyId);
  } catch (error) {
    console.error("Error getting email stats:", error);
    return {
      totalEmails: 0,
      sentEmails: 0,
      receivedEmails: 0,
      unreadEmails: 0,
      threadsCount: 0,
    };
  }
}

/**
 * Sync received emails from Resend API to database
 */
/**
 * Fetch email content from Resend API or update with provided content
 */
export async function fetchEmailContentAction(
  emailId: string,
  resendEmailId?: string,
  providedContent?: { html?: string | null; text?: string | null }
): Promise<{
  success: boolean;
  html?: string | null;
  text?: string | null;
  error?: string;
}> {
  "use server";

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    let html: string | null = null;
    let text: string | null = null;

    // If content is provided directly, use it
    if (providedContent) {
      console.log(`📥 Using provided content: html=${!!providedContent.html}, text=${!!providedContent.text}`);
      html = providedContent.html || null;
      text = providedContent.text || null;
    } else {
      // First, try to get email from database to check for content in metadata
      const { data: email, error: emailError } = await supabase
        .from("communications")
        .select("provider_message_id, provider_metadata, body, body_html")
        .eq("id", emailId)
        .eq("company_id", companyId)
        .single();

      if (emailError) {
        console.error("❌ Database lookup error:", emailError);
        // Don't return error for PGRST errors that might be expected
        if (emailError.code === 'PGRST116') {
          return { success: false, error: "Email not found in database" };
        }
        return { success: false, error: `Database error: ${emailError.message}` };
      }

      if (!email) {
        return { success: false, error: "Email not found in database" };
      }

      // Check if email already has content stored
      if (email.body_html || email.body) {
        console.log(`✅ Using stored content: html=${!!email.body_html}, text=${!!email.body}`);
        html = email.body_html || null;
        text = email.body || null;
      } else if (email.provider_metadata) {
        // Try to extract content from provider_metadata
        const metadata = email.provider_metadata as Record<string, unknown>;
        console.log(`🔍 Extracting content from provider_metadata...`);
        console.log(`   Metadata keys: ${Object.keys(metadata).join(", ")}`);
        
        // PRIORITY 1: Check webhook_content first (webhook payload - most reliable source)
        const webhookContent = metadata.webhook_content as Record<string, unknown> | undefined;
        if (webhookContent) {
          console.log(`   Checking webhook_content first, keys: ${Object.keys(webhookContent).join(", ")}`);
          const htmlValue = webhookContent.html || webhookContent.body_html;
          const textValue = webhookContent.text || webhookContent.body;
          
          if (htmlValue && typeof htmlValue === "string") {
            const content = htmlValue.trim();
            if (content.length > 0) {
              html = content;
              console.log(`✅ Found HTML content in webhook_content (${content.length} chars)`);
            }
          }
          if (!html && textValue && typeof textValue === "string") {
            const content = textValue.trim();
            if (content.length > 0) {
              text = content;
              console.log(`✅ Found text content in webhook_content (${content.length} chars)`);
            }
          }
        }

        // PRIORITY 2: Check full_content (API response) if webhook didn't have content
        if (!html && !text) {
          const fullContent = metadata.full_content as Record<string, unknown> | undefined;
          if (fullContent) {
            console.log(`   Checking full_content, keys: ${Object.keys(fullContent).join(", ")}`);
            const htmlFields = ["html", "body_html", "bodyHtml"];
            const textFields = ["text", "body", "plain_text", "plainText"];

            // Try HTML fields first
            for (const field of htmlFields) {
              if (fullContent[field] && typeof fullContent[field] === "string") {
                const content = (fullContent[field] as string).trim();
                if (content.length > 0) {
                  html = content;
                  console.log(`✅ Found HTML content in full_content.${field} (${content.length} chars)`);
                  break;
                }
              }
            }

            // If no HTML, try text fields
            if (!html) {
              for (const field of textFields) {
                if (fullContent[field] && typeof fullContent[field] === "string") {
                  const content = (fullContent[field] as string).trim();
                  if (content.length > 0) {
                    text = content;
                    console.log(`✅ Found text content in full_content.${field} (${content.length} chars)`);
                    break;
                  }
                }
              }
            }
          }
        }

        // PRIORITY 3: Check top-level metadata.data for content (webhook payload structure)
        if (!html && !text) {
          const webhookData = metadata.data as Record<string, unknown> | undefined;
          if (webhookData) {
            console.log(`   Checking metadata.data (webhook payload), keys: ${Object.keys(webhookData).join(", ")}`);
            const htmlValue = webhookData.html || webhookData.body_html;
            const textValue = webhookData.text || webhookData.body;
            
            if (htmlValue && typeof htmlValue === "string") {
              const content = htmlValue.trim();
              if (content.length > 0) {
                html = content;
                console.log(`✅ Found HTML content in metadata.data (${content.length} chars)`);
              }
            }
            if (!html && textValue && typeof textValue === "string") {
              const content = textValue.trim();
              if (content.length > 0) {
                text = content;
                console.log(`✅ Found text content in metadata.data (${content.length} chars)`);
              }
            }
          }
        }

        // PRIORITY 4: Check top-level metadata fields directly
        if (!html && !text) {
          const htmlFields = ["html", "body_html"];
          const textFields = ["text", "body"];
          
          for (const field of htmlFields) {
            if (metadata[field] && typeof metadata[field] === "string") {
              const content = (metadata[field] as string).trim();
              if (content.length > 0) {
                html = content;
                console.log(`✅ Found HTML content in metadata.${field} (${content.length} chars)`);
                break;
              }
            }
          }
          
          if (!html) {
            for (const field of textFields) {
              if (metadata[field] && typeof metadata[field] === "string") {
                const content = (metadata[field] as string).trim();
                if (content.length > 0) {
                  text = content;
                  console.log(`✅ Found text content in metadata.${field} (${content.length} chars)`);
                  break;
                }
              }
            }
          }
        }

        // If we found content in metadata, use it and return early
        if (html || text) {
          console.log(`✅ Successfully extracted content from metadata: html=${!!html}, text=${!!text}`);
          // Update database with extracted content
          if ((html || text) && supabase) {
            const { error: updateError } = await supabase
              .from("communications")
              .update({
                body: text || "",
                body_html: html,
              })
              .eq("id", emailId)
              .eq("company_id", companyId);

            if (updateError) {
              console.warn("⚠️  Failed to update email content in database:", updateError.message);
            } else {
              console.log(`✅ Updated email content in database from metadata`);
            }
          }
          return { success: true, html, text };
        } else {
          console.log(`⚠️  No content found in metadata, will try Resend API as last resort`);
          // No content in metadata, try to fetch from Resend API
          const { getReceivedEmail } = await import("@/lib/email/resend-domains");

          // Try to get Resend email ID from multiple sources
          let resendId = resendEmailId || email.provider_message_id;

          // If not found, try to extract from provider_metadata
          if (!resendId && metadata) {
            const fullContent = metadata.fullContent as { id?: string } | undefined;
            const fullContentId = fullContent?.id;
            if (fullContentId && typeof fullContentId === "string") {
              resendId = fullContentId;
            }
            // Check top-level id
            if (!resendId && metadata.id && typeof metadata.id === "string") {
              resendId = metadata.id;
            }
          }

          if (!resendId) {
            console.log("⚠️  No Resend email ID found and no content in metadata");
            return { success: false, error: "No Resend email ID found and no content available in metadata" };
          }

          console.log(`📥 Fetching email content from Resend for ID: ${resendId}`);

          // Fetch full email content from Resend
          const emailContent = await getReceivedEmail(resendId);
          if (!emailContent.success || !emailContent.data) {
            const errorMsg = "error" in emailContent ? emailContent.error : "Email not found in Resend. Content may have been deleted or expired.";
            console.warn("⚠️  Failed to fetch from Resend:", errorMsg);
            // Don't return error - just log it, content might not be available
            return { 
              success: false, 
              error: errorMsg
            };
          }

          const emailData = emailContent.data;
          html = emailData.html || emailData.body_html || null;
          text = emailData.text || emailData.body || emailData.plain_text || null;

          console.log(`✅ Fetched content from Resend: html=${!!html}, text=${!!text}`);
        }
      } else {
        // No metadata at all, can't fetch content
        console.log("⚠️  No provider_metadata available");
        return { success: false, error: "No email metadata available" };
      }
    }

    // Update the database with the content
    // Try to update, but don't fail if the email doesn't exist - we still return the content
    if (supabase) {
      const { error: updateError } = await supabase
        .from("communications")
        .update({
          body: text || "",
          body_html: html,
        })
        .eq("id", emailId)
        .eq("company_id", companyId);

      if (updateError) {
        console.warn("⚠️  Failed to update email content in database (this is OK, content still returned):", updateError.message);
        // Still return the content even if update fails - the email might not exist yet
      } else {
        console.log(`✅ Updated email content in database`);
      }
    }

    return { success: true, html, text };
  } catch (error) {
    console.error("Error fetching email content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Add an inbound email route for the active company
 * This allows emails sent to the specified address to be received via webhook
 * @deprecated Unused - use createInboundRoute from settings/communications instead
 */
export async function addInboundEmailRouteAction(
  routeAddress: string,
  name?: string
): Promise<{
  success: boolean;
  route?: any;
  error?: string;
}> {
  "use server";

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    // Validate email format
    if (!routeAddress || !routeAddress.includes("@")) {
      return { success: false, error: "Invalid email address format" };
    }

    // Check if route already exists
    const { data: existingRoute } = await supabase
      .from("communication_email_inbound_routes")
      .select("id, company_id")
      .eq("route_address", routeAddress)
      .maybeSingle();

    if (existingRoute) {
      if (existingRoute.company_id === companyId) {
        return { success: true, route: existingRoute, error: "Route already exists for this company" };
      } else {
        return { success: false, error: "This email address is already configured for another company" };
      }
    }

    // Insert the route
    const { data: route, error: insertError } = await supabase
      .from("communication_email_inbound_routes")
      .insert({
        company_id: companyId,
        route_address: routeAddress,
        name: name || `Inbound route for ${routeAddress}`,
        enabled: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create inbound route:", insertError);
      return { success: false, error: insertError.message };
    }

    console.log(`✅ Created inbound route: ${routeAddress} for company ${companyId}`);
    return { success: true, route };
  } catch (error) {
    console.error("Error adding inbound route:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sync inbound email routes from database to Resend
 * Creates routes in Resend that don't have a resend_route_id
 */
export async function syncInboundRoutesToResendAction(): Promise<{
  success: boolean;
  synced: number;
  errors: string[];
}> {
  "use server";

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { createInboundRoute } = await import("@/lib/email/resend-domains");
    const { createServiceSupabaseClient } = await import("@/lib/supabase/service-client");

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, synced: 0, errors: ["Database connection failed"] };
    }

    const serviceSupabase = await createServiceSupabaseClient();
    if (!serviceSupabase) {
      return { success: false, synced: 0, errors: ["Service database connection failed"] };
    }

    // Get all routes that don't have a resend_route_id
    // Note: This table may not be in the type definitions, so we use type assertion
    const { data: routes, error } = await (serviceSupabase
      .from("communication_email_inbound_routes" as any)
      .select("id, company_id, route_address, name, enabled")
      .is("resend_route_id", null)
      .eq("enabled", true) as any);

    if (error) {
      console.error("Failed to fetch routes:", error);
      return { success: false, synced: 0, errors: [error.message] };
    }

    if (!routes || routes.length === 0) {
      return { success: true, synced: 0, errors: [] };
    }

    // Construct webhook URL
    let webhookUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!webhookUrl && process.env.VERCEL_URL) {
      webhookUrl = `https://${process.env.VERCEL_URL}`;
    }
    if (!webhookUrl) {
      return { success: false, synced: 0, errors: ["Webhook URL not configured. Set NEXT_PUBLIC_SITE_URL or VERCEL_URL"] };
    }
    webhookUrl = `${webhookUrl}/api/webhooks/resend`;
    console.log(`🔗 Webhook URL: ${webhookUrl}`);

    const errors: string[] = [];
    let synced = 0;

    for (const route of (routes || []) as Array<{ id: string; company_id: string; route_address: string; name: string | null; enabled: boolean }>) {
      try {
        // Handle catch-all routes (e.g., @biezru.resend.app)
        // Resend doesn't support true catch-all, so we'll create a route for the domain
        // For now, we'll skip catch-all routes and handle them differently
        if (route.route_address.startsWith("@")) {
          console.log(`⚠️  Skipping catch-all route: ${route.route_address} (Resend requires specific addresses)`);
          errors.push(`Catch-all routes (${route.route_address}) need to be configured manually in Resend dashboard`);
          continue;
        }

        console.log(`🔄 Creating Resend route for: ${route.route_address}`);

        // Create route in Resend
        const result = await createInboundRoute({
          name: route.name || `Route for ${route.route_address}`,
          recipients: [route.route_address],
          url: webhookUrl,
        });

        if (!result.success) {
          console.error(`❌ Failed to create Resend route for ${route.route_address}:`, result.error);
          errors.push(`${route.route_address}: ${result.error}`);
          continue;
        }

        // Update database with resend_route_id
        const { error: updateError } = await serviceSupabase
          .from("communication_email_inbound_routes")
          .update({
            resend_route_id: result.data.id,
            signing_secret: result.data.secret || null,
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", route.id);

        if (updateError) {
          console.error(`❌ Failed to update route ${route.route_address}:`, updateError);
          errors.push(`${route.route_address}: Database update failed`);
          continue;
        }

        console.log(`✅ Successfully synced route: ${route.route_address} (Resend ID: ${result.data.id})`);
        synced++;
      } catch (error) {
        console.error(`❌ Error syncing route ${route.route_address}:`, error);
        errors.push(`${route.route_address}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    return {
      success: errors.length === 0,
      synced,
      errors,
    };
  } catch (error) {
    console.error("Error syncing inbound routes:", error);
    return {
      success: false,
      synced: 0,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

/**
 * Archive an email
 */
export async function archiveEmailAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    const { error } = await supabase
      .from("communications")
      .update({ is_archived: true })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Archive all emails in a folder
 */
export async function archiveAllEmailsAction(folder?: string): Promise<{ 
  success: boolean; 
  archived: number;
  error?: string 
}> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const { getCompanyEmails } = await import("@/lib/email/email-service");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, archived: 0, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, archived: 0, error: "Database connection failed" };
    }
    
    // Fetch all emails in the folder (with a high limit to get all)
    // getCompanyEmails already filters out archived emails for non-archive folders
    const result = await getCompanyEmails(companyId, {
      folder: folder === "inbox" ? undefined : folder,
      limit: 10000, // High limit to get all emails
      offset: 0,
    });
    
    if (!result.emails || result.emails.length === 0) {
      return { success: true, archived: 0 };
    }
    
    // Get all email IDs (they're already filtered to non-archived by getCompanyEmails)
    const emailIds = result.emails.map(email => email.id);
    
    if (emailIds.length === 0) {
      return { success: true, archived: 0 };
    }
    
    // Bulk archive all emails
    const { error, count } = await supabase
      .from("communications")
      .update({ is_archived: true })
      .in("id", emailIds)
      .eq("company_id", companyId)
      .eq("type", "email")
      .eq("is_archived", false); // Only archive non-archived emails (safety check)
    
    if (error) {
      return { success: false, archived: 0, error: error.message };
    }
    
    return { success: true, archived: count || emailIds.length };
  } catch (error) {
    return { 
      success: false, 
      archived: 0, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Unarchive an email
 * @deprecated Unused
 */
async function unarchiveEmailAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    const { error } = await supabase
      .from("communications")
      .update({ is_archived: false })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Snooze an email
 * @deprecated Unused
 */
async function snoozeEmailAction(
  emailId: string,
  snoozeUntil: string
): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    const { error } = await supabase
      .from("communications")
      .update({ snoozed_until: snoozeUntil })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Unsnooze an email
 * @deprecated Unused
 */
async function unsnoozeEmailAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    const { error } = await supabase
      .from("communications")
      .update({ snoozed_until: null })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Mark email as spam
 */
export async function markEmailAsSpamAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get current tags
    const { data: email } = await supabase
      .from("communications")
      .select("tags")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .single();
    
    const currentTags = (email?.tags as string[]) || [];
    const updatedTags = currentTags.includes("spam") 
      ? currentTags 
      : [...currentTags, "spam"];
    
    const { error } = await supabase
      .from("communications")
      .update({ 
        category: "spam",
        tags: updatedTags
      })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Remove spam mark from email
 * @deprecated Unused
 */
async function unmarkEmailAsSpamAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get current tags
    const { data: email } = await supabase
      .from("communications")
      .select("tags")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .single();
    
    const currentTags = (email?.tags as string[]) || [];
    const updatedTags = currentTags.filter(tag => tag !== "spam");
    
    const { error } = await supabase
      .from("communications")
      .update({ 
        category: null,
        tags: updatedTags.length > 0 ? updatedTags : null
      })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Delete an email (soft delete)
 * @deprecated Unused
 */
async function deleteEmailAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const { data: { user } } = await (await import("@/lib/supabase/server")).createClient().auth.getUser();
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    const { error } = await supabase
      .from("communications")
      .update({ 
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id || null
      })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Restore a deleted email
 * @deprecated Unused
 */
async function restoreEmailAction(emailId: string): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    const { error } = await supabase
      .from("communications")
      .update({ 
        deleted_at: null,
        deleted_by: null
      })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Add label to email
 * @deprecated Unused
 */
async function addLabelToEmailAction(
  emailId: string,
  label: string
): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get current tags
    const { data: email } = await supabase
      .from("communications")
      .select("tags")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .single();
    
    const currentTags = (email?.tags as string[]) || [];
    const updatedTags = currentTags.includes(label) 
      ? currentTags 
      : [...currentTags, label];
    
    const { error } = await supabase
      .from("communications")
      .update({ tags: updatedTags })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Remove label from email
 * @deprecated Unused
 */
async function removeLabelFromEmailAction(
  emailId: string,
  label: string
): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get current tags
    const { data: email } = await supabase
      .from("communications")
      .select("tags")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .single();
    
    const currentTags = (email?.tags as string[]) || [];
    const updatedTags = currentTags.filter(tag => tag !== label);
    
    const { error } = await supabase
      .from("communications")
      .update({ tags: updatedTags.length > 0 ? updatedTags : null })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Toggle star on email (add/remove "starred" tag)
 */
export async function toggleStarEmailAction(emailId: string): Promise<{ 
  success: boolean; 
  isStarred?: boolean;
  error?: string 
}> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get current tags
    const { data: email, error: fetchError } = await supabase
      .from("communications")
      .select("tags")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email")
      .single();
    
    if (fetchError || !email) {
      return { success: false, error: "Email not found" };
    }
    
    const currentTags = (email.tags as string[]) || [];
    const isStarred = currentTags.includes("starred");
    
    let updatedTags: string[];
    if (isStarred) {
      // Remove starred tag
      updatedTags = currentTags.filter(tag => tag !== "starred");
    } else {
      // Add starred tag
      updatedTags = [...currentTags, "starred"];
    }
    
    const { error: updateError } = await supabase
      .from("communications")
      .update({ tags: updatedTags.length > 0 ? updatedTags : null })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (updateError) {
      return { success: false, error: updateError.message };
    }
    
    return { success: true, isStarred: !isStarred };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Toggle spam on email (add/remove "spam" tag and update category)
 */
export async function toggleSpamEmailAction(emailId: string): Promise<{ 
  success: boolean; 
  isSpam?: boolean;
  error?: string 
}> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get current tags and category
    const { data: email, error: fetchError } = await supabase
      .from("communications")
      .select("tags, category")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email")
      .single();
    
    if (fetchError || !email) {
      return { success: false, error: "Email not found" };
    }
    
    const currentTags = (email.tags as string[]) || [];
    const isSpam = currentTags.includes("spam") || email.category === "spam";
    
    let updatedTags: string[];
    let updatedCategory: string | null;
    
    if (isSpam) {
      // Remove spam tag and category
      updatedTags = currentTags.filter(tag => tag !== "spam");
      updatedCategory = null;
    } else {
      // Add spam tag and set category
      updatedTags = currentTags.includes("spam") ? currentTags : [...currentTags, "spam"];
      updatedCategory = "spam";
    }
    
    const { error: updateError } = await supabase
      .from("communications")
      .update({ 
        tags: updatedTags.length > 0 ? updatedTags : null,
        category: updatedCategory
      })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");
    
    if (updateError) {
      return { success: false, error: updateError.message };
    }
    
    return { success: true, isSpam: !isSpam };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get email folder counts
 */
export async function getEmailFolderCountsAction(): Promise<{
  success: boolean;
  counts?: {
    inbox: number;
    drafts: number;
    sent: number;
    archive: number;
    snoozed: number;
    spam: number;
    trash: number;
    starred: number;
    [label: string]: number;
  };
  error?: string;
}> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Create a helper function to build fresh queries (Supabase queries are mutable)
    const createBaseQuery = () => supabase
      .from("communications")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("type", "email");
    
    // Fetch all emails with necessary fields to calculate counts in memory
    // This is more efficient than multiple queries and allows us to filter spam properly
    const { data: allEmails } = await supabase
      .from("communications")
      .select("id, direction, status, is_archived, deleted_at, snoozed_until, tags, category")
      .eq("company_id", companyId)
      .eq("type", "email")
      .limit(5000); // Reasonable limit for counting (most companies won't have more)
    
    if (!allEmails) {
      return { success: false, error: "Failed to fetch emails for counting" };
    }
    
    // Helper function to check if email is spam
    const isSpam = (email: any): boolean => {
      const tags = (email.tags as string[]) || [];
      return email.category === "spam" || tags.includes("spam");
    };
    
    // Helper function to check if email is starred
    const isStarred = (email: any): boolean => {
      const tags = (email.tags as string[]) || [];
      return tags.includes("starred");
    };
    
    const now = new Date().toISOString();
    
    // Calculate counts for each folder, excluding spam from all non-spam folders
    const inboxCount = allEmails.filter((email: any) => {
      if (isSpam(email)) return false; // Exclude spam
      return email.direction === "inbound" &&
        email.is_archived === false &&
        !email.deleted_at &&
        email.status !== "draft" &&
        (!email.snoozed_until || email.snoozed_until < now);
    }).length;
    
    const draftsCount = allEmails.filter((email: any) => {
      if (isSpam(email)) return false; // Exclude spam
      return email.status === "draft" && !email.deleted_at;
    }).length;
    
    const sentCount = allEmails.filter((email: any) => {
      if (isSpam(email)) return false; // Exclude spam
      return email.direction === "outbound" &&
        email.is_archived === false &&
        !email.deleted_at &&
        email.status !== "draft";
    }).length;
    
    const archiveCount = allEmails.filter((email: any) => {
      return email.is_archived === true && !email.deleted_at;
    }).length;
    
    const snoozedCount = allEmails.filter((email: any) => {
      if (isSpam(email)) return false; // Exclude spam
      return email.snoozed_until &&
        email.snoozed_until > now &&
        !email.deleted_at;
    }).length;
    
    const spamCount = allEmails.filter((email: any) => {
      return isSpam(email) && !email.deleted_at;
    }).length;
    
    const trashCount = allEmails.filter((email: any) => {
      return !!email.deleted_at;
    }).length;
    
    const starredCount = allEmails.filter((email: any) => {
      if (isSpam(email)) return false; // Exclude spam from starred
      return isStarred(email) && !email.deleted_at;
    }).length;
    
    const counts = {
      inbox: inboxCount,
      drafts: draftsCount,
      sent: sentCount,
      archive: archiveCount,
      snoozed: snoozedCount,
      spam: spamCount,
      trash: trashCount,
      starred: starredCount,
    };
    
    // Log counts for debugging
    console.log("📊 Email folder counts:", {
      ...counts,
      companyId,
      totalEmails: allEmails.length,
    });
    
    // Get custom folder counts from email_folders table
    const { data: customFolders } = await supabase
      .from("email_folders")
      .select("slug")
      .eq("company_id", companyId)
      .is("deleted_at", null)
      .eq("is_active", true);
    
    if (customFolders && customFolders.length > 0) {
      // Count emails for each custom folder (by slug in tags)
      for (const folder of customFolders) {
        const { count: folderCount } = await supabase
          .from("communications")
          .select("*", { count: "exact", head: true })
          .eq("company_id", companyId)
          .eq("type", "email")
          .is("deleted_at", null)
          .contains("tags", [folder.slug]);
        
        counts[folder.slug] = folderCount || 0;
      }
    }
    
    // Get label counts (legacy tags that aren't custom folders)
    const { data: emailsWithTags } = await supabase
      .from("communications")
      .select("tags")
      .eq("company_id", companyId)
      .eq("type", "email")
      .is("deleted_at", null)
      .not("tags", "is", null);
    
    if (emailsWithTags) {
      const customFolderSlugs = new Set(customFolders?.map(f => f.slug) || []);
      const labelCounts: Record<string, number> = {};
      emailsWithTags.forEach((email) => {
        const tags = (email.tags as string[]) || [];
        tags.forEach((tag) => {
          // Only count tags that aren't spam, starred, and aren't custom folders
          if (tag !== "spam" && tag !== "starred" && !customFolderSlugs.has(tag)) {
            labelCounts[tag] = (labelCounts[tag] || 0) + 1;
          }
        });
      });
      Object.assign(counts, labelCounts);
    }
    
    console.log("📊 Email folder counts (final):", counts);
    return { success: true, counts };
  } catch (error) {
    console.error("❌ getEmailFolderCountsAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get total unread message count (emails + SMS)
 * Used for the communications menu badge in the app header
 */
export async function getTotalUnreadCountAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }
    
    // Get unread email count (inbound emails that haven't been read, excluding spam)
    // We need to fetch and filter in memory to exclude spam (category = 'spam' OR tags contains 'spam')
    const { data: unreadEmails } = await supabase
      .from("communications")
      .select("id, tags, category")
      .eq("company_id", companyId)
      .eq("type", "email")
      .eq("direction", "inbound")
      .is("read_at", null)
      .is("deleted_at", null)
      .eq("is_archived", false)
      .neq("status", "draft")
      .or("snoozed_until.is.null,snoozed_until.lt.now()")
      .limit(5000);
    
    const unreadEmailCount = unreadEmails?.filter((email: any) => {
      const tags = (email.tags as string[]) || [];
      const isSpam = email.category === "spam" || tags.includes("spam");
      return !isSpam; // Exclude spam from unread count
    }).length || 0;
    
    // Get unread SMS count (inbound SMS that haven't been read)
    const { count: unreadSmsCount } = await supabase
      .from("communications")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("type", "sms")
      .eq("direction", "inbound")
      .is("read_at", null)
      .is("deleted_at", null)
      .eq("is_archived", false);
    
    const totalUnread = (unreadEmailCount || 0) + (unreadSmsCount || 0);
    
    return { success: true, count: totalUnread };
  } catch (error) {
    console.error("Error fetching total unread count:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * @deprecated Unused
 */
async function syncReceivedEmailsAction(): Promise<{
  success: boolean;
  synced: number;
  error?: string;
}> {
  "use server";
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, synced: 0, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, synced: 0, error: "Database connection failed" };
    }

    console.log(`🔄 Checking emails for company ${companyId}`);

    // Get all emails that don't have body content but have provider_metadata
    const { data: emailsWithoutContent, error: fetchError } = await supabase
      .from("communications")
      .select("id, provider_metadata, subject, from_address")
      .eq("company_id", companyId)
      .eq("type", "email")
      .eq("channel", "resend")
      .is("body", null)
      .not("provider_metadata", "is", null)
      .limit(50); // Process in batches

    if (fetchError) {
      console.error("❌ Failed to fetch emails:", fetchError);
      return { success: false, synced: 0, error: fetchError.message };
    }

    console.log(`📧 Found ${emailsWithoutContent?.length || 0} emails that need content extraction`);

    let synced = 0;

    if (emailsWithoutContent && emailsWithoutContent.length > 0) {
      for (const email of emailsWithoutContent) {
        console.log(`   Processing email: ${email.id} - ${email.subject}`);

        const metadata = email.provider_metadata as Record<string, unknown>;

        // Extract content from metadata - check both full_content (API) and webhook_content (webhook)
        let htmlContent: string | null = null;
        let textContent: string | null = null;

        // Check full_content first (from API response)
        const fullContent = metadata?.full_content as Record<string, unknown>;
        if (fullContent) {
          console.log(`   🔍 Checking full_content...`);
          const htmlFields = ["html", "body_html", "bodyHtml"];
          const textFields = ["text", "body", "plain_text", "plainText"];

          for (const field of htmlFields) {
            if (fullContent[field] && typeof fullContent[field] === "string" && (fullContent[field] as string).trim().length > 0) {
              htmlContent = fullContent[field] as string;
              console.log(`   ✅ Found HTML content in full_content.${field}`);
              break;
            }
          }

          if (!htmlContent) {
            for (const field of textFields) {
              if (fullContent[field] && typeof fullContent[field] === "string" && (fullContent[field] as string).trim().length > 0) {
                textContent = fullContent[field] as string;
                console.log(`   ✅ Found text content in full_content.${field}`);
                break;
              }
            }
          }
        }

        // If no content found in full_content, check webhook_content
        if (!htmlContent && !textContent) {
          const webhookContent = metadata?.webhook_content as Record<string, unknown>;
          if (webhookContent) {
            console.log(`   🔍 Checking webhook_content...`);
            htmlContent = (webhookContent.html || webhookContent.body_html) as string || null;
            if (htmlContent && htmlContent.trim().length > 0) {
              console.log(`   ✅ Found HTML content in webhook_content`);
            } else {
              textContent = (webhookContent.text || webhookContent.body) as string || null;
              if (textContent && textContent.trim().length > 0) {
                console.log(`   ✅ Found text content in webhook_content`);
              }
            }
          }
        }

        if (!htmlContent && !textContent) {
          console.log(`   ⏭️  No content found in metadata`);
          continue;
        }

        // Update the database with extracted content
        const { error: updateError } = await supabase
          .from("communications")
          .update({
            body: textContent || "",
            body_html: htmlContent,
          })
          .eq("id", email.id)
          .eq("company_id", companyId);

        if (updateError) {
          console.error(`   ❌ Failed to update email ${email.id}:`, updateError);
          continue;
        }

        synced++;
        console.log(`   ✅ Updated email ${email.id} with content`);
      }
    }

    console.log(`🎉 Content extraction complete! Updated ${synced} emails`);
    return { success: true, synced };
  } catch (error) {
    console.error("❌ Error syncing received emails:", error);
    return {
      success: false,
      synced: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Setup catch-all inbound route for a company's email domain
 * @param domain - The domain to create catch-all route for (e.g., "company.com")
 * @deprecated Unused
 */
async function setupCatchAllInboundRouteAction(
  domain: string
): Promise<{
  success: boolean;
  route?: any;
  error?: string;
}> {
  "use server";

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    // Validate domain format
    if (!domain || !domain.includes(".")) {
      return { success: false, error: "Invalid domain format. Must be a valid domain (e.g., company.com)" };
    }

    const catchAllAddress = `@${domain}`;
    
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    // Check if this domain is registered for this company
    const { data: emailDomain, error: domainError } = await supabase
      .from("communication_email_domains")
      .select("id, domain, status")
      .eq("company_id", companyId)
      .eq("domain", domain)
      .maybeSingle();

    if (domainError) {
      console.error("Error checking email domain:", domainError);
      return { success: false, error: `Failed to verify domain: ${domainError.message}` };
    }

    if (!emailDomain) {
      return { 
        success: false, 
        error: `Domain ${domain} is not registered for this company. Please add it in Settings → Email Domains first.` 
      };
    }

    if (emailDomain.status !== "verified") {
      return { 
        success: false, 
        error: `Domain ${domain} is not verified yet (status: ${emailDomain.status}). Please complete DNS verification first.` 
      };
    }

    // Check if catch-all route already exists
    const { data: existingRoute } = await supabase
      .from("communication_email_inbound_routes")
      .select("id, company_id, enabled")
      .eq("route_address", catchAllAddress)
      .maybeSingle();

    if (existingRoute) {
      if (existingRoute.company_id === companyId) {
        return { 
          success: true, 
          route: existingRoute, 
          error: existingRoute.enabled 
            ? "Catch-all route already exists and is enabled" 
            : "Catch-all route exists but is disabled"
        };
      } else {
        return { success: false, error: "This domain is already configured for another company" };
      }
    }

    // Create the catch-all route
    const { data: route, error: insertError } = await supabase
      .from("communication_email_inbound_routes")
      .insert({
        company_id: companyId,
        route_address: catchAllAddress,
        name: `Catch-all for ${domain}`,
        enabled: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create catch-all route:", insertError);
      return { success: false, error: insertError.message };
    }

    console.log(`✅ Created catch-all route: ${catchAllAddress} for company ${companyId}`);
    return { success: true, route };
  } catch (error) {
    console.error("Error setting up catch-all route:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}