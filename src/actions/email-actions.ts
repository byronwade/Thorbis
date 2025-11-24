"use server";

import {
    archiveAllEmails,
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
  folder: z.enum(["inbox", "drafts", "sent", "archive", "snoozed", "spam", "trash", "bin", "starred", "all"]).optional(),
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
    const parseResult = getEmailsSchema.safeParse(input);
    
    if (!parseResult.success) {
      console.error("❌ Zod validation error:", parseResult.error.issues);
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

    return await getEmailStats();
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
 * Get total unread email count for the active company
 * Used for displaying notification badges in the header
 */
export async function getTotalUnreadCountAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string
}> {
  try {
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const stats = await getEmailStats();
    return { success: true, count: stats.unreadEmails };
  } catch (error) {
    console.error("Error getting unread count:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Fetch email content from Resend API or update with provided content
 */
export async function fetchEmailContentAction(
  emailId: string,
  _resendEmailId?: string,
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
        html = email.body_html || null;
        text = email.body || null;
      } else if (email.provider_metadata) {
        // Try to extract content from provider_metadata
        const metadata = email.provider_metadata as Record<string, unknown>;
        
        // PRIORITY 1: Check webhook_content first (webhook payload - most reliable source)
        const webhookContent = metadata.webhook_content as Record<string, unknown> | undefined;
        if (webhookContent) {
          const htmlValue = webhookContent.html || webhookContent.body_html;
          const textValue = webhookContent.text || webhookContent.body;
          
          if (htmlValue && typeof htmlValue === "string") {
            const content = htmlValue.trim();
            if (content.length > 0) {
              html = content;
            }
          }
          if (!html && textValue && typeof textValue === "string") {
            const content = textValue.trim();
            if (content.length > 0) {
              text = content;
            }
          }
        }

        // PRIORITY 2: Check full_content (API response) if webhook didn't have content
        if (!html && !text) {
          const fullContent = metadata.full_content as Record<string, unknown> | undefined;
          if (fullContent) {
            const htmlFields = ["html", "body_html", "bodyHtml"];
            const textFields = ["text", "body", "plain_text", "plainText"];

            // Try HTML fields first
            for (const field of htmlFields) {
              if (fullContent[field] && typeof fullContent[field] === "string") {
                const content = (fullContent[field] as string).trim();
                if (content.length > 0) {
                  html = content;
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
            const htmlValue = webhookData.html || webhookData.body_html;
            const textValue = webhookData.text || webhookData.body;
            
            if (htmlValue && typeof htmlValue === "string") {
              const content = htmlValue.trim();
              if (content.length > 0) {
                html = content;
              }
            }
            if (!html && textValue && typeof textValue === "string") {
              const content = textValue.trim();
              if (content.length > 0) {
                text = content;
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
                  break;
                }
              }
            }
          }
        }

        // If we found content in metadata, use it and return early
        if (html || text) {
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
            }
          }
          return { success: true, html, text };
        } else {
          // No content found in metadata
          return {
            success: false,
            error: "No email content available in metadata"
          };
        }
      } else {
        // No metadata at all, can't fetch content
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

    const errors: string[] = [];
    let synced = 0;

    for (const route of (routes || []) as Array<{ id: string; company_id: string; route_address: string; name: string | null; enabled: boolean }>) {
      try {
        // Handle catch-all routes (e.g., @biezru.resend.app)
        // Resend doesn't support true catch-all, so we'll create a route for the domain
        // For now, we'll skip catch-all routes and handle them differently
        if (route.route_address.startsWith("@")) {
          errors.push(`Catch-all routes (${route.route_address}) need to be configured manually in Resend dashboard`);
          continue;
        }

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
        const { error: updateError } = await (serviceSupabase
          .from("communication_email_inbound_routes" as any)
          .update({
            resend_route_id: result.data.id,
            signing_secret: result.data.secret || null,
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", route.id) as any);

        if (updateError) {
          console.error(`❌ Failed to update route ${route.route_address}:`, updateError);
          errors.push(`${route.route_address}: Database update failed`);
          continue;
        }

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
 * Bulk archive multiple emails by their IDs
 */
export async function bulkArchiveEmailsAction(emailIds: string[]): Promise<{
  success: boolean;
  archived: number;
  error?: string
}> {
  "use server";

  if (!emailIds || emailIds.length === 0) {
    return { success: false, archived: 0, error: "No email IDs provided" };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, archived: 0, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, archived: 0, error: "Database connection failed" };
    }

    const { data, error } = await supabase
      .from("communications")
      .update({ is_archived: true })
      .in("id", emailIds)
      .eq("company_id", companyId)
      .eq("type", "email")
      .select("id");

    if (error) {
      return { success: false, archived: 0, error: error.message };
    }

    const archivedCount = data?.length ?? 0;
    return { success: true, archived: archivedCount };
  } catch (error) {
    return { success: false, archived: 0, error: error instanceof Error ? error.message : "Unknown error" };
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
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, archived: 0, error: "No active company found" };
    }
    
    const result = await archiveAllEmails(companyId, folder);
    
    if (!result.success) {
      return { success: false, archived: 0, error: result.error };
    }
    
    return { success: true, archived: result.count };
  } catch (error) {
    return {
      success: false,
      archived: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Get email folder counts for the active company
 * Returns count of emails in each folder (inbox, sent, drafts, etc.)
 */
export async function getEmailFolderCountsAction(): Promise<{
  success: boolean;
  counts?: {
    all: number;
    inbox: number;
    drafts: number;
    sent: number;
    archive: number;
    snoozed: number;
    spam: number;
    trash: number;
    starred: number;
    [key: string]: number;
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

    // Get counts for each folder type using parallel queries
    // All counts show UNREAD emails only (read_at IS NULL)
    const [
      allResult,
      inboxResult,
      draftsResult,
      sentResult,
      archiveResult,
      snoozedResult,
      spamResult,
      trashResult,
      starredResult
    ] = await Promise.all([
      // All Mail: all non-deleted, unread emails
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .is("deleted_at", null)
        .is("read_at", null),

      // Inbox: inbound, not archived, not deleted, not draft, not spam, unread
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .eq("direction", "inbound")
        .eq("is_archived", false)
        .is("deleted_at", null)
        .is("read_at", null)
        .neq("status", "draft")
        .or("category.is.null,category.neq.spam")
        .or("snoozed_until.is.null,snoozed_until.lt.now()"),

      // Drafts - always count all drafts (read_at not relevant for drafts)
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .eq("status", "draft")
        .is("deleted_at", null),

      // Sent: outbound, not archived, not deleted, unread
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .eq("direction", "outbound")
        .eq("is_archived", false)
        .is("deleted_at", null)
        .is("read_at", null)
        .neq("status", "draft"),

      // Archive - unread archived emails
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .eq("is_archived", true)
        .is("deleted_at", null)
        .is("read_at", null),

      // Snoozed - unread snoozed emails
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .not("snoozed_until", "is", null)
        .gt("snoozed_until", new Date().toISOString())
        .is("deleted_at", null)
        .is("read_at", null),

      // Spam - fetch category, tags, and read_at to count unread spam
      supabase
        .from("communications")
        .select("category, tags, read_at")
        .eq("company_id", companyId)
        .eq("type", "email")
        .is("deleted_at", null)
        .is("read_at", null),

      // Trash - unread deleted emails
      supabase
        .from("communications")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("type", "email")
        .not("deleted_at", "is", null)
        .is("read_at", null),

      // Starred - fetch tags and read_at, count unread starred in memory
      supabase
        .from("communications")
        .select("tags, read_at")
        .eq("company_id", companyId)
        .eq("type", "email")
        .is("deleted_at", null)
        .is("read_at", null),
    ]);

    // Count spam emails in memory (category=spam OR spam tag)
    const spamCount = (spamResult.data ?? []).filter(email => {
      const tags = email.tags as string[] | null;
      const hasSpamTag = Array.isArray(tags) && tags.includes("spam");
      return email.category === "spam" || hasSpamTag;
    }).length;

    // Count starred emails in memory
    const starredCount = (starredResult.data ?? []).filter(email => {
      const tags = email.tags as string[] | null;
      return Array.isArray(tags) && tags.includes("starred");
    }).length;

    return {
      success: true,
      counts: {
        all: allResult.count ?? 0,
        inbox: inboxResult.count ?? 0,
        drafts: draftsResult.count ?? 0,
        sent: sentResult.count ?? 0,
        archive: archiveResult.count ?? 0,
        snoozed: snoozedResult.count ?? 0,
        spam: spamCount,
        trash: trashResult.count ?? 0,
        starred: starredCount,
      },
    };
  } catch (error) {
    console.error("Error getting email folder counts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Toggle star status on an email
 * Adds or removes "starred" tag from the email's tags array
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

    // First, get current tags
    const { data: email, error: fetchError } = await supabase
      .from("communications")
      .select("tags")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email")
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    const currentTags = (email?.tags as string[]) || [];
    const isCurrentlyStarred = currentTags.includes("starred");

    // Toggle the starred tag
    const newTags = isCurrentlyStarred
      ? currentTags.filter(tag => tag !== "starred")
      : [...currentTags, "starred"];

    // Update the email
    const { error: updateError } = await supabase
      .from("communications")
      .update({ tags: newTags.length > 0 ? newTags : null })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, isStarred: !isCurrentlyStarred };
  } catch (error) {
    console.error("Error toggling star on email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Toggle spam status on an email
 * Adds or removes "spam" tag and updates category field
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

    // First, get current tags and category
    const { data: email, error: fetchError } = await supabase
      .from("communications")
      .select("tags, category")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email")
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    const currentTags = (email?.tags as string[]) || [];
    const isCurrentlySpam = currentTags.includes("spam") || email?.category === "spam";

    // Toggle the spam tag and category
    const newTags = isCurrentlySpam
      ? currentTags.filter(tag => tag !== "spam")
      : [...currentTags, "spam"];

    const newCategory = isCurrentlySpam ? null : "spam";

    // Update the email
    const { error: updateError } = await supabase
      .from("communications")
      .update({
        tags: newTags.length > 0 ? newTags : null,
        category: newCategory
      })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, isSpam: !isCurrentlySpam };
  } catch (error) {
    console.error("Error toggling spam on email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Snooze an email until a specific time
 * The email will reappear in inbox after the snooze time
 */
export async function snoozeEmailAction(
  emailId: string,
  snoozeUntil: string | null
): Promise<{
  success: boolean;
  snoozedUntil?: string | null;
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

    // Update the snoozed_until field
    const { error: updateError } = await supabase
      .from("communications")
      .update({ snoozed_until: snoozeUntil })
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email");

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, snoozedUntil: snoozeUntil };
  } catch (error) {
    console.error("Error snoozing email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Unsnooze an email (remove snooze time)
 */
export async function unsnoozeEmailAction(emailId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  return snoozeEmailAction(emailId, null);
}

/**
 * Bulk mark emails as read or unread
 */
export async function bulkMarkReadUnreadAction(
  emailIds: string[],
  markAsRead: boolean
): Promise<{
  success: boolean;
  updated: number;
  error?: string;
}> {
  "use server";

  if (!emailIds || emailIds.length === 0) {
    return { success: false, updated: 0, error: "No IDs provided" };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, updated: 0, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, updated: 0, error: "Database connection failed" };
    }

    const { data, error } = await supabase
      .from("communications")
      .update({ read_at: markAsRead ? new Date().toISOString() : null })
      .in("id", emailIds)
      .eq("company_id", companyId)
      .eq("type", "email")
      .select("id");

    if (error) {
      return { success: false, updated: 0, error: error.message };
    }

    // Dispatch event to refresh counts
    return { success: true, updated: data?.length ?? 0 };
  } catch (error) {
    console.error("Error bulk marking emails:", error);
    return { success: false, updated: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Bulk toggle star on emails
 */
export async function bulkStarEmailsAction(
  emailIds: string[],
  addStar: boolean
): Promise<{
  success: boolean;
  updated: number;
  error?: string;
}> {
  "use server";

  if (!emailIds || emailIds.length === 0) {
    return { success: false, updated: 0, error: "No IDs provided" };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, updated: 0, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, updated: 0, error: "Database connection failed" };
    }

    // OPTIMIZED: Batch fetch all emails in ONE query (was N queries)
    const { data: emails } = await supabase
      .from("communications")
      .select("id, tags")
      .in("id", emailIds)
      .eq("company_id", companyId);

    if (!emails || emails.length === 0) {
      return { success: true, updated: 0 };
    }

    // Group emails by what changes need to be made
    const toUpdate: Array<{ id: string; newTags: string[] | null }> = [];

    for (const email of emails) {
      const currentTags = (email.tags as string[]) || [];
      const hasStarred = currentTags.includes("starred");

      let newTags: string[];
      if (addStar && !hasStarred) {
        newTags = [...currentTags, "starred"];
      } else if (!addStar && hasStarred) {
        newTags = currentTags.filter((t) => t !== "starred");
      } else {
        continue; // No change needed
      }

      toUpdate.push({ id: email.id, newTags: newTags.length > 0 ? newTags : null });
    }

    if (toUpdate.length === 0) {
      return { success: true, updated: 0 };
    }

    // Batch update using Promise.all (parallel updates)
    const results = await Promise.all(
      toUpdate.map(({ id, newTags }) =>
        supabase
          .from("communications")
          .update({ tags: newTags })
          .eq("id", id)
          .eq("company_id", companyId)
      )
    );

    const updatedCount = results.filter((r) => !r.error).length;
    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error("Error bulk starring emails:", error);
    return { success: false, updated: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Bulk delete emails (move to trash)
 */
export async function bulkDeleteEmailsAction(emailIds: string[]): Promise<{
  success: boolean;
  deleted: number;
  error?: string;
}> {
  "use server";

  if (!emailIds || emailIds.length === 0) {
    return { success: false, deleted: 0, error: "No IDs provided" };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, deleted: 0, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, deleted: 0, error: "Database connection failed" };
    }

    // Soft delete by setting deleted_at
    const { data, error } = await supabase
      .from("communications")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", emailIds)
      .eq("company_id", companyId)
      .eq("type", "email")
      .select("id");

    if (error) {
      return { success: false, deleted: 0, error: error.message };
    }

    return { success: true, deleted: data?.length ?? 0 };
  } catch (error) {
    console.error("Error bulk deleting emails:", error);
    return { success: false, deleted: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Bulk move emails to spam
 */
export async function bulkMoveToSpamAction(emailIds: string[]): Promise<{
  success: boolean;
  moved: number;
  error?: string;
}> {
  "use server";

  if (!emailIds || emailIds.length === 0) {
    return { success: false, moved: 0, error: "No IDs provided" };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, moved: 0, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, moved: 0, error: "Database connection failed" };
    }

    // OPTIMIZED: Batch fetch all emails in ONE query (was N queries)
    const { data: emails } = await supabase
      .from("communications")
      .select("id, tags")
      .in("id", emailIds)
      .eq("company_id", companyId);

    if (!emails || emails.length === 0) {
      return { success: true, moved: 0 };
    }

    // Prepare updates with new tags
    const updates = emails.map((email) => {
      const currentTags = (email.tags as string[]) || [];
      const newTags = currentTags.includes("spam")
        ? currentTags
        : [...currentTags, "spam"];
      return { id: email.id, newTags };
    });

    // Batch update using Promise.all (parallel updates)
    const results = await Promise.all(
      updates.map(({ id, newTags }) =>
        supabase
          .from("communications")
          .update({ category: "spam", tags: newTags })
          .eq("id", id)
          .eq("company_id", companyId)
      )
    );

    const movedCount = results.filter((r) => !r.error).length;
    return { success: true, moved: movedCount };
  } catch (error) {
    console.error("Error moving emails to spam:", error);
    return { success: false, moved: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ============================================================================
// DRAFT ACTIONS
// ============================================================================

const saveDraftSchema = z.object({
  id: z.string().uuid().optional(), // If provided, update existing draft
  to: z.array(z.string().email()).optional().default([]),
  cc: z.array(z.string().email()).optional().default([]),
  bcc: z.array(z.string().email()).optional().default([]),
  subject: z.string().optional().default(""),
  body: z.string().optional().default(""),
  bodyHtml: z.string().optional(),
  customerId: z.string().uuid().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(),
    contentType: z.string().optional(),
  })).optional(),
});

export type SaveDraftInput = z.infer<typeof saveDraftSchema>;

/**
 * Save or update an email draft
 * If id is provided, updates existing draft; otherwise creates a new one
 */
export async function saveDraftAction(input: SaveDraftInput): Promise<{
  success: boolean;
  draftId?: string;
  error?: string;
}> {
  "use server";

  try {
    const parseResult = saveDraftSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: `Invalid input: ${parseResult.error.message}` };
    }

    const { id, to, cc, bcc, subject, body, bodyHtml, customerId, attachments } = parseResult.data;

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

    // Get the company's default email address for from_address
    const { data: companySettings } = await supabase
      .from("company_communication_settings")
      .select("email_from_address, email_from_name")
      .eq("company_id", companyId)
      .single();

    const fromAddress = companySettings?.email_from_address || "noreply@example.com";
    const fromName = companySettings?.email_from_name || "Draft";

    const draftData = {
      company_id: companyId,
      customer_id: customerId || null,
      type: "email" as const,
      direction: "outbound" as const,
      from_address: fromAddress,
      from_name: fromName,
      to_address: to.length > 0 ? to.join(", ") : "draft@placeholder.local",
      cc_address: cc.length > 0 ? cc.join(", ") : null,
      bcc_address: bcc.length > 0 ? bcc.join(", ") : null,
      subject: subject || "(No subject)",
      body: body || "",
      body_html: bodyHtml || null,
      attachments: attachments && attachments.length > 0 ? attachments : null,
      attachment_count: attachments?.length || 0,
      status: "draft" as const,
      is_automated: false,
      is_internal: false,
      is_archived: false,
      is_thread_starter: true,
      priority: "normal" as const,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      // Update existing draft
      const { error: updateError } = await supabase
        .from("communications")
        .update(draftData)
        .eq("id", id)
        .eq("company_id", companyId)
        .eq("status", "draft");

      if (updateError) {
        console.error("Error updating draft:", updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true, draftId: id };
    } else {
      // Create new draft
      const { data: newDraft, error: insertError } = await supabase
        .from("communications")
        .insert({
          ...draftData,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error creating draft:", insertError);
        return { success: false, error: insertError.message };
      }

      return { success: true, draftId: newDraft.id };
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get a draft by ID
 */
export async function getDraftAction(draftId: string): Promise<{
  success: boolean;
  draft?: {
    id: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    bodyHtml?: string | null;
    customerId?: string | null;
    attachments?: Array<{ filename: string; content: string; contentType?: string }> | null;
    updatedAt: string;
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

    const { data: draft, error: fetchError } = await supabase
      .from("communications")
      .select("id, to_address, cc_address, bcc_address, subject, body, body_html, customer_id, attachments, updated_at")
      .eq("id", draftId)
      .eq("company_id", companyId)
      .eq("status", "draft")
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!draft) {
      return { success: false, error: "Draft not found" };
    }

    // Parse addresses from comma-separated strings to arrays
    const parseAddresses = (addr: string | null): string[] => {
      if (!addr || addr === "draft@placeholder.local") return [];
      return addr.split(",").map(a => a.trim()).filter(Boolean);
    };

    return {
      success: true,
      draft: {
        id: draft.id,
        to: parseAddresses(draft.to_address),
        cc: parseAddresses(draft.cc_address),
        bcc: parseAddresses(draft.bcc_address),
        subject: draft.subject === "(No subject)" ? "" : (draft.subject || ""),
        body: draft.body || "",
        bodyHtml: draft.body_html,
        customerId: draft.customer_id,
        attachments: draft.attachments as Array<{ filename: string; content: string; contentType?: string }> | null,
        updatedAt: draft.updated_at,
      },
    };
  } catch (error) {
    console.error("Error getting draft:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Delete a draft
 */
export async function deleteDraftAction(draftId: string): Promise<{
  success: boolean;
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

    // Hard delete drafts (they don't need to go to trash)
    const { error: deleteError } = await supabase
      .from("communications")
      .delete()
      .eq("id", draftId)
      .eq("company_id", companyId)
      .eq("status", "draft");

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ============================================================================
// RETRY ACTIONS
// ============================================================================

/**
 * Retry sending a failed email
 * Fetches the failed email, resets its status, and attempts to resend
 */
export async function retryFailedEmailAction(emailId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  "use server";

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const { sendEmail } = await import("@/lib/email/email-sender");
    const { PlainTextEmail } = await import("@/emails/plain-text-email");

    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    // Get the failed email
    const { data: email, error: fetchError } = await supabase
      .from("communications")
      .select("*")
      .eq("id", emailId)
      .eq("company_id", companyId)
      .eq("type", "email")
      .eq("status", "failed")
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!email) {
      return { success: false, error: "Failed email not found" };
    }

    // Reset status to queued
    const { error: updateError } = await supabase
      .from("communications")
      .update({
        status: "queued",
        failure_reason: null,
      })
      .eq("id", emailId)
      .eq("company_id", companyId);

    if (updateError) {
      return { success: false, error: `Failed to reset email status: ${updateError.message}` };
    }

    // Parse recipients
    const parseAddresses = (addr: string | null): string | string[] => {
      if (!addr) return [];
      const addresses = addr.split(",").map(a => a.trim()).filter(Boolean);
      return addresses.length === 1 ? addresses[0] : addresses;
    };

    const to = parseAddresses(email.to_address);
    const cc = parseAddresses(email.cc_address);
    const bcc = parseAddresses(email.bcc_address);

    // Get attachments from metadata if stored (for scheduled emails)
    const metadata = email.provider_metadata as Record<string, unknown> | null;
    const attachments = metadata?.scheduled_attachments as Array<{
      filename: string;
      content: string;
      contentType?: string;
    }> | undefined;

    // Attempt to resend
    const sendResult = await sendEmail({
      to,
      subject: email.subject || "(No subject)",
      template: PlainTextEmail({ message: email.body || "" }),
      templateType: "generic" as any,
      companyId,
      communicationId: emailId,
      cc: cc.length > 0 ? cc : undefined,
      bcc: bcc.length > 0 ? bcc : undefined,
      attachments,
    });

    if (!sendResult.success) {
      // Update status back to failed
      await supabase
        .from("communications")
        .update({
          status: "failed",
          failure_reason: sendResult.error || "Email send failed on retry",
        })
        .eq("id", emailId)
        .eq("company_id", companyId);

      return {
        success: false,
        error: sendResult.error || "Failed to send email on retry",
      };
    }

    // Update status to sent
    await supabase
      .from("communications")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        provider_message_id: sendResult.data?.id || null,
        failure_reason: null,
      })
      .eq("id", emailId)
      .eq("company_id", companyId);

    return { success: true };
  } catch (error) {
    console.error("Error retrying failed email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}