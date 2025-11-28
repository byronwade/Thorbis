"use server";

/**
 * Waitlist Server Actions
 *
 * Server-side actions for managing waitlist subscribers.
 * Integrates with Resend Contacts API for waitlist management.
 * Auto-discovers or creates the waitlist audience.
 */

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import type { WaitlistSubscriber, WaitlistStats } from "@/types/campaigns";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Cache for audience ID (avoid repeated API calls)
let cachedAudienceId: string | null = null;

/**
 * Get or create the waitlist audience
 * Automatically discovers existing "Waitlist" audience or creates one
 */
async function getWaitlistAudienceId(): Promise<string | null> {
	// Return cached value if available
	if (cachedAudienceId) {
		return cachedAudienceId;
	}

	// Check env var first
	if (process.env.RESEND_WAITLIST_AUDIENCE_ID) {
		cachedAudienceId = process.env.RESEND_WAITLIST_AUDIENCE_ID;
		return cachedAudienceId;
	}

	try {
		// List all audiences to find existing waitlist
		const { data: audiences, error: listError } = await resend.audiences.list();

		if (listError) {
			console.error("Failed to list audiences:", listError);
			return null;
		}

		// Look for existing waitlist audience
		const waitlistAudience = audiences?.data?.find(
			(a) => a.name.toLowerCase().includes("waitlist")
		);

		if (waitlistAudience) {
			cachedAudienceId = waitlistAudience.id;
			return cachedAudienceId;
		}

		// Create new waitlist audience if none exists
		const { data: newAudience, error: createError } = await resend.audiences.create({
			name: "Thorbis Waitlist",
		});

		if (createError) {
			console.error("Failed to create waitlist audience:", createError);
			return null;
		}

		cachedAudienceId = newAudience?.id || null;
		console.log("Created new waitlist audience:", cachedAudienceId);
		return cachedAudienceId;
	} catch (error) {
		console.error("Error getting waitlist audience:", error);
		return null;
	}
}

// ============================================================================
// Types
// ============================================================================

type ActionResult<T = void> = {
	success: boolean;
	data?: T;
	error?: string;
};

type WaitlistListResult = {
	subscribers: WaitlistSubscriber[];
	total: number;
	page: number;
	pageSize: number;
};

// ============================================================================
// Waitlist CRUD Actions
// ============================================================================

/**
 * Get waitlist statistics from Resend
 */
export async function getWaitlistStats(): Promise<ActionResult<WaitlistStats>> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			console.warn("Could not get or create waitlist audience");
			return {
				success: true,
				data: {
					totalSubscribers: 0,
					activeSubscribers: 0,
					unsubscribedCount: 0,
					recentSignups: 0,
					growthRate: 0,
				},
			};
		}

		// Fetch all contacts from Resend
		const response = await resend.contacts.list({ audienceId });

		if (response.error) {
			console.error("Failed to get waitlist stats:", response.error);
			return { success: false, error: "Failed to get waitlist stats" };
		}

		const contacts = response.data?.data || [];
		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		// Calculate statistics
		const totalSubscribers = contacts.length;
		const activeSubscribers = contacts.filter((c) => !c.unsubscribed).length;
		const unsubscribedCount = contacts.filter((c) => c.unsubscribed).length;
		const recentSignups = contacts.filter((c) => {
			const createdAt = new Date(c.created_at);
			return createdAt >= weekAgo;
		}).length;

		// Calculate growth rate (recent signups / total * 100)
		const growthRate = totalSubscribers > 0
			? parseFloat(((recentSignups / totalSubscribers) * 100).toFixed(1))
			: 0;

		const stats: WaitlistStats = {
			totalSubscribers,
			activeSubscribers,
			unsubscribedCount,
			recentSignups,
			growthRate,
		};

		return { success: true, data: stats };
	} catch (error) {
		console.error("Failed to get waitlist stats:", error);
		return { success: false, error: "Failed to get waitlist stats" };
	}
}

/**
 * Get paginated list of waitlist subscribers from Resend
 */
async function getWaitlistSubscribers(
	page: number = 1,
	pageSize: number = 50,
	search?: string
): Promise<ActionResult<WaitlistListResult>> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			console.warn("Could not get or create waitlist audience");
			return {
				success: true,
				data: {
					subscribers: [],
					total: 0,
					page,
					pageSize,
				},
			};
		}

		// Fetch contacts from Resend
		const response = await resend.contacts.list({ audienceId });

		if (response.error) {
			console.error("Failed to get waitlist subscribers:", response.error);
			return { success: false, error: "Failed to get waitlist subscribers" };
		}

		let contacts = response.data?.data || [];

		// Apply search filter
		if (search) {
			const searchLower = search.toLowerCase();
			contacts = contacts.filter((c) =>
				c.email.toLowerCase().includes(searchLower) ||
				(c.first_name && c.first_name.toLowerCase().includes(searchLower)) ||
				(c.last_name && c.last_name.toLowerCase().includes(searchLower))
			);
		}

		const total = contacts.length;

		// Apply pagination
		const startIndex = (page - 1) * pageSize;
		const paginatedContacts = contacts.slice(startIndex, startIndex + pageSize);

		// Map to WaitlistSubscriber type
		const subscribers: WaitlistSubscriber[] = paginatedContacts.map((contact) => ({
			id: contact.id,
			email: contact.email,
			firstName: contact.first_name || undefined,
			lastName: contact.last_name || undefined,
			createdAt: contact.created_at,
			unsubscribed: contact.unsubscribed || false,
			tags: [],
			source: "resend",
		}));

		const result: WaitlistListResult = {
			subscribers,
			total,
			page,
			pageSize,
		};

		return { success: true, data: result };
	} catch (error) {
		console.error("Failed to get waitlist subscribers:", error);
		return { success: false, error: "Failed to get waitlist subscribers" };
	}
}

/**
 * Add a new subscriber to the waitlist via Resend
 */
async function addWaitlistSubscriber(
	email: string,
	firstName?: string,
	lastName?: string,
	_tags?: string[],
	_source?: string
): Promise<ActionResult<WaitlistSubscriber>> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: false, error: "Could not get or create waitlist audience" };
		}

		// Create contact in Resend
		const response = await resend.contacts.create({
			email,
			firstName,
			lastName,
			unsubscribed: false,
			audienceId,
		});

		if (response.error) {
			console.error("Failed to add waitlist subscriber:", response.error);
			return { success: false, error: response.error.message || "Failed to add subscriber" };
		}

		const subscriber: WaitlistSubscriber = {
			id: response.data?.id || "",
			email,
			firstName,
			lastName,
			createdAt: new Date().toISOString(),
			unsubscribed: false,
			tags: [],
			source: "admin",
		};

		revalidatePath("/dashboard/marketing");
		revalidatePath("/dashboard/marketing/campaigns");

		return { success: true, data: subscriber };
	} catch (error) {
		console.error("Failed to add waitlist subscriber:", error);
		return { success: false, error: "Failed to add waitlist subscriber" };
	}
}

/**
 * Remove a subscriber from the waitlist via Resend
 */
async function removeWaitlistSubscriber(
	contactId: string
): Promise<ActionResult> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: false, error: "Could not get or create waitlist audience" };
		}

		// Delete contact from Resend
		const response = await resend.contacts.remove({
			id: contactId,
			audienceId,
		});

		if (response.error) {
			console.error("Failed to remove waitlist subscriber:", response.error);
			return { success: false, error: "Failed to remove subscriber" };
		}

		revalidatePath("/dashboard/marketing");
		revalidatePath("/dashboard/marketing/campaigns");

		return { success: true };
	} catch (error) {
		console.error("Failed to remove waitlist subscriber:", error);
		return { success: false, error: "Failed to remove waitlist subscriber" };
	}
}

/**
 * Update subscriber details via Resend
 */
async function updateWaitlistSubscriber(
	contactId: string,
	updates: {
		firstName?: string;
		lastName?: string;
		unsubscribed?: boolean;
	}
): Promise<ActionResult> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: false, error: "Could not get or create waitlist audience" };
		}

		// Update contact in Resend
		const response = await resend.contacts.update({
			id: contactId,
			audienceId,
			firstName: updates.firstName,
			lastName: updates.lastName,
			unsubscribed: updates.unsubscribed,
		});

		if (response.error) {
			console.error("Failed to update waitlist subscriber:", response.error);
			return { success: false, error: "Failed to update subscriber" };
		}

		revalidatePath("/dashboard/marketing");
		revalidatePath("/dashboard/marketing/campaigns");

		return { success: true };
	} catch (error) {
		console.error("Failed to update waitlist subscriber:", error);
		return { success: false, error: "Failed to update waitlist subscriber" };
	}
}

/**
 * Import subscribers from CSV via Resend batch API
 */
async function importWaitlistSubscribers(
	subscribers: { email: string; firstName?: string; lastName?: string }[]
): Promise<ActionResult<{ imported: number; skipped: number; errors: string[] }>> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: false, error: "Could not get or create waitlist audience" };
		}

		let imported = 0;
		let skipped = 0;
		const errors: string[] = [];

		// Process in batches of 100 to avoid rate limits
		const batchSize = 100;
		for (let i = 0; i < subscribers.length; i += batchSize) {
			const batch = subscribers.slice(i, i + batchSize);

			for (const sub of batch) {
				try {
					// Validate email format
					if (!sub.email || !sub.email.includes("@")) {
						errors.push(`Invalid email: ${sub.email}`);
						skipped++;
						continue;
					}

					// Add to Resend
					const response = await resend.contacts.create({
						email: sub.email,
						firstName: sub.firstName,
						lastName: sub.lastName,
						unsubscribed: false,
						audienceId,
					});

					if (response.error) {
						skipped++;
						if (response.error.message?.includes("already exists")) {
							// Skip duplicates silently
						} else {
							errors.push(`Failed to import: ${sub.email}`);
						}
					} else {
						imported++;
					}
				} catch {
					skipped++;
					errors.push(`Failed to import: ${sub.email}`);
				}
			}

			// Small delay between batches to avoid rate limiting
			if (i + batchSize < subscribers.length) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}

		revalidatePath("/dashboard/marketing");
		revalidatePath("/dashboard/marketing/campaigns");

		return {
			success: true,
			data: { imported, skipped, errors: errors.slice(0, 10) }, // Limit error messages
		};
	} catch (error) {
		console.error("Failed to import waitlist subscribers:", error);
		return { success: false, error: "Failed to import waitlist subscribers" };
	}
}

/**
 * Export waitlist subscribers as CSV
 */
async function exportWaitlistSubscribers(): Promise<
	ActionResult<{ csvContent: string; filename: string }>
> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: false, error: "Could not get or create waitlist audience" };
		}

		// Fetch all contacts from Resend
		const response = await resend.contacts.list({ audienceId });

		if (response.error) {
			console.error("Failed to export waitlist subscribers:", response.error);
			return { success: false, error: "Failed to export waitlist subscribers" };
		}

		const contacts = response.data?.data || [];

		// Generate CSV content
		const headers = ["Email", "First Name", "Last Name", "Subscribed", "Created At"];
		const rows = contacts.map((c) => [
			c.email,
			c.first_name || "",
			c.last_name || "",
			c.unsubscribed ? "No" : "Yes",
			c.created_at,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const filename = `waitlist-export-${new Date().toISOString().split("T")[0]}.csv`;

		return {
			success: true,
			data: { csvContent, filename },
		};
	} catch (error) {
		console.error("Failed to export waitlist subscribers:", error);
		return { success: false, error: "Failed to export waitlist subscribers" };
	}
}

// ============================================================================
// Waitlist Campaign Actions
// ============================================================================

/**
 * Get waitlist campaign ready count
 * Returns count of subscribers who can receive emails (not unsubscribed)
 */
async function getWaitlistCampaignReadyCount(): Promise<ActionResult<number>> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: true, data: 0 };
		}

		const response = await resend.contacts.list({ audienceId });

		if (response.error) {
			console.error("Failed to get waitlist campaign ready count:", response.error);
			return { success: false, error: "Failed to get count" };
		}

		const activeCount = (response.data?.data || []).filter((c) => !c.unsubscribed).length;

		return { success: true, data: activeCount };
	} catch (error) {
		console.error("Failed to get waitlist campaign ready count:", error);
		return { success: false, error: "Failed to get count" };
	}
}

/**
 * Get waitlist emails for campaign sending
 * Returns list of emails that can receive campaign
 */
async function getWaitlistEmailsForCampaign(): Promise<
	ActionResult<{ email: string; firstName?: string; lastName?: string }[]>
> {
	try {
		const audienceId = await getWaitlistAudienceId();

		if (!audienceId) {
			return { success: true, data: [] };
		}

		const response = await resend.contacts.list({ audienceId });

		if (response.error) {
			console.error("Failed to get waitlist emails:", response.error);
			return { success: false, error: "Failed to get waitlist emails" };
		}

		// Filter out unsubscribed contacts
		const emails = (response.data?.data || [])
			.filter((c) => !c.unsubscribed)
			.map((c) => ({
				email: c.email,
				firstName: c.first_name || undefined,
				lastName: c.last_name || undefined,
			}));

		return { success: true, data: emails };
	} catch (error) {
		console.error("Failed to get waitlist emails:", error);
		return { success: false, error: "Failed to get waitlist emails" };
	}
}
