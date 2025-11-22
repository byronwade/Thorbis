/**
 * Email Service - Comprehensive email management for companies
 *
 * Features:
 * - Fetch all company emails (sent and received)
 * - Unified interface for email operations
 * - Email synchronization from Resend webhooks
 * - Thread management and conversation grouping
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SupabaseClient = ReturnType<typeof createClient>;
type CommunicationRow = Database["public"]["Tables"]["communications"]["Row"];
type EmailLogRow = Database["public"]["Tables"]["email_logs"]["Row"];

export interface CompanyEmail {
  id: string;
  type: "sent" | "received";
  subject: string | null;
  body: string | null;
  body_html: string | null;
  from_address: string | null;
  from_name: string | null;
  to_address: string | null;
  to_name: string | null;
  created_at: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  status: string;
  direction: "inbound" | "outbound";
  provider_message_id?: string | null;
  attachments?: any[] | null;
  thread_id?: string | null;
  customer_id?: string | null;
  customer?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  job_id?: string | null;
  invoice_id?: string | null;
  estimate_id?: string | null;
}

/**
 * Fetch all emails for a company
 * Combines sent emails (from communications) and received emails (from webhooks)
 */
export async function getCompanyEmails(
  companyId: string,
  options: {
    limit?: number;
    offset?: number;
    type?: "sent" | "received" | "all";
    search?: string;
    sortBy?: "created_at" | "sent_at" | "subject";
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<{
  emails: CompanyEmail[];
  total: number;
  hasMore: boolean;
}> {
  const {
    limit = 50,
    offset = 0,
    type = "all",
    search,
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Unable to connect to database");
  }

  // Build the base query for communications (includes both sent and received emails)
  let query = supabase
    .from("communications")
    .select(`
      id,
      type,
      direction,
      status,
      subject,
      body,
      body_html,
      created_at,
      sent_at,
      delivered_at,
      from_address,
      from_name,
      to_address,
      to_name,
      provider_message_id,
      attachments,
      thread_id,
      customer_id,
      job_id,
      invoice_id,
      estimate_id,
      customer:customers(id, first_name, last_name, email)
    `)
    .eq("company_id", companyId)
    .eq("channel", "resend")
    .is("deleted_at", null);

  // Filter by email type
  if (type === "sent") {
    query = query.eq("direction", "outbound");
  } else if (type === "received") {
    query = query.eq("direction", "inbound");
  }

  // Search functionality
  if (search) {
    const searchTerm = `%${search}%`;
    query = query.or(
      `subject.ilike.${searchTerm},body.ilike.${searchTerm},from_address.ilike.${searchTerm},to_address.ilike.${searchTerm}`
    );
  }

  // Sorting
  const sortColumn = sortBy === "sent_at" ? "sent_at" : sortBy === "subject" ? "subject" : "created_at";
  query = query.order(sortColumn, { ascending: sortOrder === "asc" });

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data: communications, error, count } = await query;

  if (error) {
    console.error("Error fetching company emails:", error);
    throw new Error("Failed to fetch company emails");
  }

  const total = count || 0;
  const hasMore = offset + limit < total;

  // Transform to unified email format
  const emails: CompanyEmail[] = (communications || []).map((comm) => ({
    id: comm.id,
    type: comm.direction === "outbound" ? "sent" : "received",
    subject: comm.subject,
    body: comm.body,
    body_html: comm.body_html,
    from_address: comm.from_address,
    from_name: comm.from_name,
    to_address: comm.to_address,
    to_name: comm.to_name,
    created_at: comm.created_at,
    sent_at: comm.sent_at,
    delivered_at: comm.delivered_at,
    status: comm.status,
    direction: comm.direction,
    provider_message_id: comm.provider_message_id,
    attachments: comm.attachments,
    thread_id: comm.thread_id,
    customer_id: comm.customer_id,
    customer: Array.isArray(comm.customer) ? comm.customer[0] : comm.customer,
    job_id: comm.job_id,
    invoice_id: comm.invoice_id,
    estimate_id: comm.estimate_id,
  }));

  return {
    emails,
    total,
    hasMore,
  };
}

/**
 * Get email threads/conversations for a company
 * Groups emails by thread_id or by common email addresses
 */
export async function getEmailThreads(
  companyId: string,
  options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}
): Promise<{
  threads: {
    threadId: string | null;
    subject: string | null;
    participants: string[];
    emailCount: number;
    lastEmailAt: string;
    latestEmail: CompanyEmail;
    emails: CompanyEmail[];
  }[];
  total: number;
}> {
  const { limit = 20, offset = 0, search } = options;

  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Unable to connect to database");
  }

  // Get all emails with thread information
  const { data: emails, error } = await supabase
    .from("communications")
    .select(`
      id,
      type,
      direction,
      status,
      subject,
      body,
      body_html,
      created_at,
      sent_at,
      delivered_at,
      from_address,
      from_name,
      to_address,
      to_name,
      provider_message_id,
      attachments,
      thread_id,
      customer_id,
      job_id,
      invoice_id,
      estimate_id,
      customer:customers(id, first_name, last_name, email)
    `)
    .eq("company_id", companyId)
    .eq("channel", "resend")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching email threads:", error);
    throw new Error("Failed to fetch email threads");
  }

  // Group emails by thread
  const threadMap = new Map<string, CompanyEmail[]>();

  emails?.forEach((email) => {
    const threadId = email.thread_id || `${email.from_address}-${email.to_address}-${email.subject}`;

    if (!threadMap.has(threadId)) {
      threadMap.set(threadId, []);
    }

    threadMap.get(threadId)!.push({
      id: email.id,
      type: email.direction === "outbound" ? "sent" : "received",
      subject: email.subject,
      body: email.body,
      body_html: email.body_html,
      from_address: email.from_address,
      from_name: email.from_name,
      to_address: email.to_address,
      to_name: email.to_name,
      created_at: email.created_at,
      sent_at: email.sent_at,
      delivered_at: email.delivered_at,
      status: email.status,
      direction: email.direction,
      provider_message_id: email.provider_message_id,
      attachments: email.attachments,
      thread_id: email.thread_id,
      customer_id: email.customer_id,
      customer: Array.isArray(email.customer) ? email.customer[0] : email.customer,
      job_id: email.job_id,
      invoice_id: email.invoice_id,
      estimate_id: email.estimate_id,
    });
  });

  // Convert to thread objects
  const threads = Array.from(threadMap.entries())
    .map(([threadId, threadEmails]) => {
      const sortedEmails = threadEmails.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const participants = Array.from(
        new Set(
          sortedEmails
            .flatMap(email => [email.from_address, email.to_address])
            .filter(Boolean)
        )
      );

      return {
        threadId: threadEmails[0]?.thread_id || threadId,
        subject: sortedEmails[0]?.subject || "(No subject)",
        participants,
        emailCount: sortedEmails.length,
        lastEmailAt: sortedEmails[0]?.created_at || "",
        latestEmail: sortedEmails[0]!,
        emails: sortedEmails,
      };
    })
    .filter(thread => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        thread.subject?.toLowerCase().includes(searchLower) ||
        thread.participants.some(p => p?.toLowerCase().includes(searchLower)) ||
        thread.emails.some(email =>
          email.body?.toLowerCase().includes(searchLower) ||
          email.from_address?.toLowerCase().includes(searchLower) ||
          email.to_address?.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => new Date(b.lastEmailAt).getTime() - new Date(a.lastEmailAt).getTime())
    .slice(offset, offset + limit);

  return {
    threads,
    total: threadMap.size,
  };
}

/**
 * Get a specific email by ID
 */
export async function getEmailById(
  companyId: string,
  emailId: string
): Promise<CompanyEmail | null> {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Unable to connect to database");
  }

  const { data: communication, error } = await supabase
    .from("communications")
    .select(`
      id,
      type,
      direction,
      status,
      subject,
      body,
      body_html,
      created_at,
      sent_at,
      delivered_at,
      from_address,
      from_name,
      to_address,
      to_name,
      provider_message_id,
      attachments,
      thread_id,
      customer_id,
      job_id,
      invoice_id,
      estimate_id,
      customer:customers(id, first_name, last_name, email)
    `)
    .eq("company_id", companyId)
    .eq("id", emailId)
    .eq("channel", "resend")
    .is("deleted_at", null)
    .single();

  if (error || !communication) {
    return null;
  }

  return {
    id: communication.id,
    type: communication.direction === "outbound" ? "sent" : "received",
    subject: communication.subject,
    body: communication.body,
    body_html: communication.body_html,
    from_address: communication.from_address,
    from_name: communication.from_name,
    to_address: communication.to_address,
    to_name: communication.to_name,
    created_at: communication.created_at,
    sent_at: communication.sent_at,
    delivered_at: communication.delivered_at,
    status: communication.status,
    direction: communication.direction,
    provider_message_id: communication.provider_message_id,
    attachments: communication.attachments,
    thread_id: communication.thread_id,
    customer_id: communication.customer_id,
    customer: Array.isArray(communication.customer) ? communication.customer[0] : communication.customer,
    job_id: communication.job_id,
    invoice_id: communication.invoice_id,
    estimate_id: communication.estimate_id,
  };
}

/**
 * Mark an email as read
 */
export async function markEmailAsRead(
  companyId: string,
  emailId: string
): Promise<boolean> {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Unable to connect to database");
  }

  const { error } = await supabase
    .from("communications")
    .update({ read_at: new Date().toISOString() })
    .eq("company_id", companyId)
    .eq("id", emailId)
    .eq("direction", "inbound")
    .is("read_at", null);

  if (error) {
    console.error("Error marking email as read:", error);
    return false;
  }

  return true;
}

/**
 * Get email statistics for a company
 */
export async function getEmailStats(companyId: string): Promise<{
  totalEmails: number;
  sentEmails: number;
  receivedEmails: number;
  unreadEmails: number;
  threadsCount: number;
}> {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Unable to connect to database");
  }

  // Get basic counts
  const { data: counts, error: countError } = await supabase
    .from("communications")
    .select("direction, read_at")
    .eq("company_id", companyId)
    .eq("channel", "resend")
    .is("deleted_at", null);

  if (countError) {
    console.error("Error fetching email stats:", countError);
    return {
      totalEmails: 0,
      sentEmails: 0,
      receivedEmails: 0,
      unreadEmails: 0,
      threadsCount: 0,
    };
  }

  const totalEmails = counts?.length || 0;
  const sentEmails = counts?.filter(c => c.direction === "outbound").length || 0;
  const receivedEmails = counts?.filter(c => c.direction === "inbound").length || 0;
  const unreadEmails = counts?.filter(c => c.direction === "inbound" && !c.read_at).length || 0;

  // Get unique thread count
  const { data: threads, error: threadError } = await supabase
    .from("communications")
    .select("thread_id, from_address, to_address, subject")
    .eq("company_id", companyId)
    .eq("channel", "resend")
    .is("deleted_at", null);

  const uniqueThreads = new Set<string>();
  threads?.forEach(email => {
    const threadId = email.thread_id || `${email.from_address}-${email.to_address}-${email.subject}`;
    uniqueThreads.add(threadId);
  });

  return {
    totalEmails,
    sentEmails,
    receivedEmails,
    unreadEmails,
    threadsCount: uniqueThreads.size,
  };
}
