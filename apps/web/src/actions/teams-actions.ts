/**
 * Teams/Channels Server Actions
 *
 * Server-side actions for team channel messaging
 */

"use server";

import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const getChannelMessagesSchema = z.object({
	channel: z.string().min(1),
	limit: z.coerce.number().min(1).max(500).optional().default(100),
	offset: z.coerce.number().min(0).optional().default(0),
	search: z.string().optional(),
});

const sendChannelMessageSchema = z.object({
	channel: z.string().min(1),
	text: z.string().optional(),
	attachments: z
		.array(
			z.object({
				file: z.instanceof(File),
				type: z.enum(["image", "file"]),
			}),
		)
		.optional()
		.default([]),
});

const createTeamChannelSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	type: z.enum(["public", "private"]).default("public"),
});

export type GetChannelMessagesInput = z.infer<typeof getChannelMessagesSchema>;
export type SendChannelMessageInput = z.infer<typeof sendChannelMessageSchema>;
export type CreateTeamChannelInput = z.infer<typeof createTeamChannelSchema>;

export type ChannelMessage = {
	id: string;
	body: string;
	body_html: string | null;
	created_at: string;
	read_at: string | null;
	direction: "inbound" | "outbound";
	sent_by: string | null;
	sent_by_user?: {
		id: string;
		name: string | null;
		avatar: string | null;
		email: string | null;
	} | null;
	provider_metadata: Record<string, unknown> | null;
};

/**
 * Get user display name from user data
 * Note: This is a utility function, not a server action
 * It's kept here for backwards compatibility but should be moved to a utils file
 */
function getUserDisplayName(user: {
	name?: string | null;
	email?: string | null;
}): string {
	if (user.name) return user.name;
	if (user.email) return user.email.split("@")[0];
	return "Unknown User";
}

/**
 * Get messages for a team channel
 */
export async function getTeamChannelMessagesAction(
	input: GetChannelMessagesInput,
): Promise<{
	success: boolean;
	messages?: ChannelMessage[];
	error?: string;
}> {
	try {
		const parseResult = getChannelMessagesSchema.safeParse(input);

		if (!parseResult.success) {
			return {
				success: false,
				error: `Invalid input: ${parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
			};
		}

		const validatedInput = parseResult.data;
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Query communications table for channel messages
		// Using tags to identify channel messages
		let query = supabase
			.from("communications")
			.select(`
        id,
        body,
        body_html,
        created_at,
        read_at,
        direction,
        sent_by,
        provider_metadata,
        tags,
        sent_by_user:users!sent_by(id, name, avatar, email)
      `)
			.eq("company_id", companyId)
			.eq("type", "sms") // Using SMS type for team messages
			.is("deleted_at", null)
			.order("created_at", { ascending: true });

		if (validatedInput.search) {
			query = query.ilike("body", `%${validatedInput.search}%`);
		}

		query = query.range(
			validatedInput.offset,
			validatedInput.offset + validatedInput.limit - 1,
		);

		const { data, error } = await query;

		// Filter messages by channel tag in memory (workaround for JSONB contains issue)
		// The tags column is JSONB, but .contains() is having type issues, so filter in memory
		const filteredData =
			data?.filter((msg) => {
				const tags = msg.tags as string[] | null;
				return (
					tags && Array.isArray(tags) && tags.includes(validatedInput.channel)
				);
			}) || [];

		if (error) {
			console.error("Error fetching channel messages:", error);
			return { success: false, error: error.message };
		}

		const messages = (filteredData || []).map((msg) => {
			// Handle sent_by_user - it might be an array or single object
			const userData = Array.isArray(msg.sent_by_user)
				? msg.sent_by_user[0]
				: msg.sent_by_user;

			return {
				...msg,
				sent_by_user: userData
					? {
							id: userData.id,
							name: userData.name || null,
							avatar: userData.avatar || null,
							email: userData.email || null,
						}
					: null,
				provider_metadata:
					(msg.provider_metadata as Record<string, unknown>) || null,
			};
		}) as ChannelMessage[];

		return { success: true, messages };
	} catch (error) {
		console.error("Error in getTeamChannelMessagesAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Send a message to a team channel
 */
export async function sendTeamChannelMessageAction(
	input: SendChannelMessageInput,
): Promise<{
	success: boolean;
	messageId?: string;
	error?: string;
}> {
	try {
		const parseResult = sendChannelMessageSchema.safeParse(input);

		if (!parseResult.success) {
			return {
				success: false,
				error: `Invalid input: ${parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
			};
		}

		const validatedInput = parseResult.data;
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "User not authenticated" };
		}

		// Extract attachment URLs (already uploaded by client)
		const attachmentUrls =
			validatedInput.attachments
				?.map((a) => a.url)
				.filter((url): url is string => !!url) || [];

		// Insert message into communications table
		const { data: message, error: insertError } = await supabase
			.from("communications")
			.insert({
				company_id: companyId,
				type: "sms",
				direction: "outbound",
				channel: "teams",
				body: validatedInput.text || "",
				body_html: validatedInput.text || null,
				sent_by: user.id,
				to_address: `channel:${validatedInput.channel}`,
				from_address: user.email || "",
				tags: [validatedInput.channel],
				provider_metadata:
					attachmentUrls.length > 0
						? {
								attachments: attachmentUrls.map((url, idx) => ({
									url,
									type: validatedInput.attachments?.[idx]?.type || "file",
									filename:
										validatedInput.attachments?.[idx]?.filename || "attachment",
								})),
							}
						: null,
				attachment_count: attachmentUrls.length,
				status: "sent",
				is_internal: true, // Team messages are internal
			})
			.select()
			.single();

		if (insertError) {
			console.error("Error sending channel message:", insertError);
			return { success: false, error: insertError.message };
		}

		return { success: true, messageId: message.id };
	} catch (error) {
		console.error("Error in sendTeamChannelMessageAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Create a new team channel
 */
export async function createTeamChannelAction(
	input: CreateTeamChannelInput,
): Promise<{
	success: boolean;
	channelId?: string;
	error?: string;
}> {
	try {
		const parseResult = createTeamChannelSchema.safeParse(input);

		if (!parseResult.success) {
			return {
				success: false,
				error: `Invalid input: ${parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
			};
		}

		const validatedInput = parseResult.data;
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Check if channel with same name already exists
		const { data: existingChannel } = await supabase
			.from("team_channels")
			.select("id")
			.eq("company_id", companyId)
			.eq("name", validatedInput.name.toLowerCase())
			.single();

		if (existingChannel) {
			return { success: false, error: "A channel with this name already exists" };
		}

		// Create new channel
		const { data: newChannel, error: insertError } = await supabase
			.from("team_channels")
			.insert({
				company_id: companyId,
				name: validatedInput.name.toLowerCase(),
				description: validatedInput.description || null,
				type: validatedInput.type,
			})
			.select()
			.single();

		if (insertError) {
			console.error("Error creating team channel:", insertError);
			return { success: false, error: insertError.message };
		}

		return { success: true, channelId: newChannel.id };
	} catch (error) {
		console.error("Error in createTeamChannelAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Mark all unread messages in a team channel as read
 */
export async function markTeamChannelAsReadAction(channel: string): Promise<{
	success: boolean;
	error?: string;
}> {
	"use server";

	try {
		const companyId = await getActiveCompanyId();

		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Get all unread inbound messages first, then filter by channel in memory
		const { data: unreadMessages, error: fetchError } = await supabase
			.from("communications")
			.select("id, tags")
			.eq("company_id", companyId)
			.eq("type", "sms")
			.eq("direction", "inbound")
			.is("read_at", null)
			.is("deleted_at", null);

		if (fetchError) {
			console.error("Error fetching unread messages:", fetchError);
			return { success: false, error: fetchError.message };
		}

		// Filter by channel in memory (workaround for JSONB contains issue)
		const channelMessageIds = (unreadMessages || [])
			.filter((msg) => {
				const tags = msg.tags as string[] | null;
				return tags && Array.isArray(tags) && tags.includes(channel);
			})
			.map((msg) => msg.id);

		if (channelMessageIds.length === 0) {
			return { success: true }; // No unread messages to mark
		}

		// Mark filtered messages as read
		const readAt = new Date().toISOString();
		const { data, error } = await supabase
			.from("communications")
			.update({ read_at: readAt })
			.in("id", channelMessageIds)
			.select("id, read_at");

		if (error) {
			console.error("Error marking channel messages as read:", error);
			return { success: false, error: error.message };
		}

		console.log(
			`✅ markTeamChannelAsReadAction success: Marked ${data?.length || 0} messages as read`,
		);

		if (error) {
			console.error("Error marking channel messages as read:", error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Error in markTeamChannelAsReadAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
