import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";

export type TeamChannel = {
	id: string;
	company_id: string;
	name: string;
	description: string | null;
	type: "public" | "private" | "direct";
	created_at: string;
	updated_at: string;
	unreadCount?: number;
	lastMessage?: TeamMessage | null;
};

export type TeamMessage = {
	id: string;
	channel_id: string;
	company_id: string;
	team_member_id: string;
	message: string;
	attachments: unknown[] | null;
	created_at: string;
	updated_at: string;
	read_at: string | null;
	teamMember?: {
		id: string;
		first_name: string;
		last_name: string;
		email: string | null;
		role: string | null;
	};
};

export type TeamChannelsResult = {
	channels: TeamChannel[];
	total: number;
};

export type TeamMessagesResult = {
	messages: TeamMessage[];
	total: number;
	hasMore: boolean;
};

/**
 * Cached team channels fetching function using React.cache()
 * This ensures multiple components calling getTeamChannels in the same request
 * only trigger one database query
 */
export const getTeamChannels = cache(async (): Promise<TeamChannelsResult> => {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return { channels: [], total: 0 };
	}

	const supabase = await createClient();
	if (!supabase) {
		return { channels: [], total: 0 };
	}

	const { data: channels, error, count } = await supabase
		.from("team_channels")
		.select(
			`
			id,
			company_id,
			name,
			description,
			type,
			created_at,
			updated_at
		`,
			{ count: "exact" }
		)
		.eq("company_id", companyId)
		.order("name", { ascending: true });

	if (error || !channels) {
		return { channels: [], total: 0 };
	}

	return {
		channels: channels as TeamChannel[],
		total: count ?? 0,
	};
});

/**
 * Get team channel by ID
 */
export const getTeamChannelById = cache(async (channelId: string): Promise<TeamChannel | null> => {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return null;
	}

	const supabase = await createClient();
	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from("team_channels")
		.select(
			`
			id,
			company_id,
			name,
			description,
			type,
			created_at,
			updated_at
		`
		)
		.eq("id", channelId)
		.eq("company_id", companyId)
		.single();

	if (error || !data) {
		return null;
	}

	return data as TeamChannel;
});

/**
 * Get team messages for a specific channel
 */
export const getTeamMessages = cache(
	async (channelId: string, limit: number = 100, offset: number = 0): Promise<TeamMessagesResult> => {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { messages: [], total: 0, hasMore: false };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { messages: [], total: 0, hasMore: false };
		}

		const { data: messages, error, count } = await supabase
			.from("team_messages")
			.select(
				`
			id,
			channel_id,
			company_id,
			team_member_id,
			message,
			attachments,
			created_at,
			updated_at,
			read_at,
			teamMember:team_members!team_member_id(
				id,
				first_name,
				last_name,
				email,
				role
			)
		`,
				{ count: "exact" }
			)
			.eq("channel_id", channelId)
			.eq("company_id", companyId)
			.order("created_at", { ascending: true })
			.range(offset, offset + limit - 1);

		if (error || !messages) {
			return { messages: [], total: 0, hasMore: false };
		}

		const total = count ?? 0;
		const hasMore = total > offset + limit;

		return {
			messages: messages as TeamMessage[],
			total,
			hasMore,
		};
	}
);

/**
 * Get team message by ID
 */
export const getTeamMessageById = cache(async (messageId: string): Promise<TeamMessage | null> => {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return null;
	}

	const supabase = await createClient();
	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from("team_messages")
		.select(
			`
			id,
			channel_id,
			company_id,
			team_member_id,
			message,
			attachments,
			created_at,
			updated_at,
			read_at,
			teamMember:team_members!team_member_id(
				id,
				first_name,
				last_name,
				email,
				role
			)
		`
		)
		.eq("id", messageId)
		.eq("company_id", companyId)
		.single();

	if (error || !data) {
		return null;
	}

	return data as TeamMessage;
});
