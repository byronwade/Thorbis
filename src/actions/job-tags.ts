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

const COMMON_TAGS_LIMIT = 20;

/**
 * Get commonly used tags for a company
 */
export async function getCommonTags(companyId: string) {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Database connection not available");
		}

		const user = await getAuthenticatedUserId(supabase);
		if (!user) {
			throw new Error("Not authenticated");
		}

		const { customers, jobs } = await fetchTagSources(supabase, companyId);
		const tagCounts = aggregateTagCounts(customers, jobs);

		return getTopTags(tagCounts, COMMON_TAGS_LIMIT);
	});
}

type SupabaseClientType = Awaited<ReturnType<typeof createClient>>;

async function getAuthenticatedUserId(supabase: SupabaseClientType): Promise<string | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user?.id ?? null;
}

async function fetchTagSources(
	supabase: SupabaseClientType,
	companyId: string
): Promise<{
	customers: { tags: unknown }[] | null;
	jobs: { metadata: unknown }[] | null;
}> {
	const [{ data: customers }, { data: jobs }] = await Promise.all([
		supabase.from("customers").select("tags").eq("company_id", companyId).not("tags", "is", null),
		supabase.from("jobs").select("metadata").eq("company_id", companyId).not("metadata", "is", null),
	]);

	return { customers: customers ?? null, jobs: jobs ?? null };
}

function aggregateTagCounts(
	customers: { tags: unknown }[] | null,
	jobs: { metadata: unknown }[] | null
): Record<string, number> {
	const tagCounts: Record<string, number> = {};

	accumulateCustomerTagCounts(customers, tagCounts);
	accumulateJobTagCounts(jobs, tagCounts);

	return tagCounts;
}

function accumulateCustomerTagCounts(customers: { tags: unknown }[] | null, tagCounts: Record<string, number>) {
	if (!customers) {
		return;
	}

	for (const customer of customers) {
		const customerTags = customer.tags as string[] | null;
		if (!customerTags) {
			continue;
		}
		for (const tag of customerTags) {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		}
	}
}

function accumulateJobTagCounts(jobs: { metadata: unknown }[] | null, tagCounts: Record<string, number>) {
	if (!jobs) {
		return;
	}

	for (const job of jobs) {
		const metadata = job.metadata as { tags?: string[] } | null;
		const jobTags = metadata?.tags;
		if (!jobTags) {
			continue;
		}
		for (const tag of jobTags) {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		}
	}
}

function getTopTags(tagCounts: Record<string, number>, limit: number): string[] {
	return Object.entries(tagCounts)
		.sort(([, a], [, b]) => b - a)
		.slice(0, limit)
		.map(([tag]) => tag);
}
