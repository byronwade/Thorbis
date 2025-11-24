"use server";

import {
    getCompanySms,
    getSmsById,
    markSmsAsRead,
    markSmsConversationAsRead,
    type CompanySms,
} from "@/lib/sms/sms-service";
import { z } from "zod";

const getSmsSchema = z.object({
  limit: z.coerce.number().min(1).max(500).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
  type: z.enum(["sent", "received", "all"]).optional().default("all"),
  folder: z.enum(["inbox", "sent", "archive", "trash", "bin"]).optional(),
  label: z.string().optional(),
  search: z.string().optional().nullable(),
  sortBy: z.enum(["created_at", "sent_at"]).optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
}).passthrough();

const markSmsReadSchema = z.object({
  smsId: z.string().min(1),
});

export type GetSmsInput = z.infer<typeof getSmsSchema>;
export type MarkSmsReadInput = z.infer<typeof markSmsReadSchema>;

// Re-export SMS types from sms-service
export type { CompanySms };

export type GetSmsResult = Awaited<ReturnType<typeof getCompanySms>>;

/**
 * Get SMS messages for the active company
 */
export async function getSmsAction(
  input: GetSmsInput
): Promise<GetSmsResult> {
  try {
    const parseResult = getSmsSchema.safeParse(input);
    
    if (!parseResult.success) {
      throw new Error(`Invalid input parameters: ${parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    
    const validatedInput = parseResult.data;
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      throw new Error("No active company found");
    }

    return await getCompanySms(companyId, validatedInput);
  } catch (error) {
    console.error("❌ getSmsAction error:", error);
    throw error;
  }
}

/**
 * Get a specific SMS by ID
 */
export async function getSmsByIdAction(smsId: string): Promise<{
  success: boolean;
  sms?: CompanySms;
  error?: string;
}> {
  try {
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const sms = await getSmsById(companyId, smsId);
    
    if (!sms) {
      return { success: false, error: "SMS not found" };
    }

    return { success: true, sms };
  } catch (error) {
    console.error("Error getting SMS by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mark an SMS as read
 */
export async function markSmsAsReadAction(
  input: MarkSmsReadInput
): Promise<boolean> {
  try {
    const validatedInput = markSmsReadSchema.parse(input);
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      throw new Error("Invalid input parameters");
    }

    return await markSmsAsRead(companyId, validatedInput.smsId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid input parameters");
    }
    throw error;
  }
}

/**
 * Mark all unread messages in an SMS conversation as read
 */
export async function markSmsConversationAsReadAction(phoneNumber: string): Promise<{
  success: boolean;
  error?: string;
}> {
  "use server";
  
  try {
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();
    
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const success = await markSmsConversationAsRead(companyId, phoneNumber);
    return { success };
  } catch (error) {
    console.error("Error marking SMS conversation as read:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get SMS conversation thread by phone number
 */
export async function getSmsConversationAction(phoneNumber: string): Promise<{
  success: boolean;
  messages?: CompanySms[];
  error?: string;
}> {
  "use server";
  
  try {
    const { getSmsConversation } = await import("@/lib/sms/sms-service");
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    
    const companyId = await getActiveCompanyId();
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    const messages = await getSmsConversation(companyId, phoneNumber);
    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching SMS conversation:", error);
    // Handle cookies() error gracefully
    if (error instanceof Error && error.message.includes("cookies")) {
      return {
        success: false,
        error: "Request context not available. Please refresh the page.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get SMS folder counts
 */
export async function getSmsFolderCountsAction(): Promise<{
  success: boolean;
  counts?: {
    inbox: number;
    sent: number;
    archive: number;
    trash: number;
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
    
    const baseQuery = supabase
      .from("communications")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("type", "sms");
    
    // Get counts for each folder
    const [inboxResult, sentResult, archiveResult, trashResult] = await Promise.all([
      // Inbox
      baseQuery
        .eq("direction", "inbound")
        .eq("is_archived", false)
        .is("deleted_at", null)
        .or("snoozed_until.is.null,snoozed_until.lt.now()"),
      // Sent
      baseQuery
        .eq("direction", "outbound")
        .eq("is_archived", false)
        .is("deleted_at", null),
      // Archive
      baseQuery.eq("is_archived", true).is("deleted_at", null),
      // Trash
      baseQuery.not("deleted_at", "is", null),
    ]);
    
    const counts = {
      inbox: inboxResult.count || 0,
      sent: sentResult.count || 0,
      archive: archiveResult.count || 0,
      trash: trashResult.count || 0,
    };
    
    return { success: true, counts };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Upload SMS attachments to storage
 */
export async function uploadSmsAttachments(
  files: File[]
): Promise<{
  success: boolean;
  urls?: string[];
  error?: string;
}> {
  "use server";
  
  try {
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();
    
    if (!companyId) {
      return { success: false, error: "No active company found" };
    }
    
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const urls: string[] = [];
    
      // Upload each file to Supabase Storage
      // Use company-files bucket which has proper RLS policies for company members
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        // Path structure: companyId must be at index [0] for RLS policy (matches document-manager pattern)
        // Format: companyId/folder/filename (storage.foldername(name))[0] = companyId
        const filePath = `${companyId}/sms-attachments/${fileName}`;
        
        // Convert file to array buffer
        const arrayBuffer = await file.arrayBuffer();
        const { data, error: uploadError } = await supabase.storage
          .from('company-files') // Use company-files bucket with proper RLS
          .upload(filePath, arrayBuffer, {
            contentType: file.type,
            upsert: false,
          });
        
        if (uploadError) {
          console.error("Upload error:", uploadError);
          return { success: false, error: `Failed to upload ${file.name}: ${uploadError.message}` };
        }
        
        // Get public URL (or signed URL for private bucket)
        const { data: { publicUrl } } = supabase.storage
          .from('company-files')
          .getPublicUrl(filePath);
        
        urls.push(publicUrl);
      }
    
    return { success: true, urls };
  } catch (error) {
    console.error("Error uploading SMS attachments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * SMS Template Context Type
 * Data available for auto-filling SMS templates
 */
export type SmsTemplateContext = {
  companyName?: string;
  companyPhone?: string;
  companyEmail?: string;
};

/**
 * Get company context for SMS templates
 * Returns company info for auto-filling template messages
 */
export async function getCompanyContextAction(): Promise<{
  success: boolean;
  context?: SmsTemplateContext;
  error?: string;
}> {
  "use server";

  try {
    const { getActiveCompany } = await import("@/lib/auth/company-context");

    const company = await getActiveCompany();
    if (!company) {
      return { success: false, error: "No active company found" };
    }

    return {
      success: true,
      context: {
        companyName: company.name,
        companyPhone: company.phone || undefined,
        companyEmail: company.email || undefined,
      },
    };
  } catch (error) {
    console.error("Error getting company context:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

