/**
 * Job Tags Actions - Server Actions
 * Handle tag management for jobs and customers
 * Supports both legacy string tags and new object tags with colors
 */

"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandling } from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

export type TagWithColor = {
  label: string;
  color?: string;
};

export type Tag = string | TagWithColor;

/**
 * Update job tags
 */
export async function updateJobTags(jobId: string, tags: Tag[]) {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Database connection not available");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Update job metadata with tags
    const { error } = await supabase
      .from("jobs")
      .update({
        metadata: {
          tags,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      throw new Error(`Failed to update job tags: ${error.message}`);
    }

    revalidatePath(`/dashboard/work/${jobId}`);
    revalidatePath("/dashboard/work");

    return { jobId, tags };
  });
}

/**
 * Update customer tags
 */
export async function updateCustomerTags(customerId: string, tags: Tag[]) {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Database connection not available");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Update customer tags
    const { error } = await supabase
      .from("customers")
      .update({
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customerId);

    if (error) {
      throw new Error(`Failed to update customer tags: ${error.message}`);
    }

    // Revalidate all pages that might show this customer
    revalidatePath(`/dashboard/customers/${customerId}`);
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/work");

    return { customerId, tags };
  });
}

/**
 * Get commonly used tags for a company
 */
export async function getCommonTags(companyId: string) {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Database connection not available");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get all customer tags for this company
    const { data: customers } = await supabase
      .from("customers")
      .select("tags")
      .eq("company_id", companyId)
      .not("tags", "is", null);

    // Get all job tags for this company
    const { data: jobs } = await supabase
      .from("jobs")
      .select("metadata")
      .eq("company_id", companyId)
      .not("metadata", "is", null);

    // Aggregate all tags and count frequency
    const tagCounts: Record<string, number> = {};

    customers?.forEach((customer) => {
      const customerTags = customer.tags as string[];
      customerTags?.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    jobs?.forEach((job) => {
      const metadata = job.metadata as { tags?: string[] };
      metadata?.tags?.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Sort by frequency and return top 20
    const commonTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag]) => tag);

    return commonTags;
  });
}

