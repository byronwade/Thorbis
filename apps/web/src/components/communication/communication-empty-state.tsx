"use client";

import { Button } from "@/components/ui/button";
import {
	Archive,
	Inbox,
	Mail,
	MessageSquare,
	Phone,
	Search,
	Star,
	Voicemail,
} from "lucide-react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateVariant =
	| "no-communications"
	| "no-search-results"
	| "empty-inbox"
	| "empty-folder"
	| "empty-type-filter"
	| "empty-team-channel"
	| "empty-sms-conversation";

interface CommunicationEmptyStateProps {
	variant: EmptyStateVariant;
	searchQuery?: string;
	folder?: string;
	type?: string;
	channelName?: string;
	onAction?: () => void;
	actionLabel?: string;
	className?: string;
}

const variantConfig: Record<
	EmptyStateVariant,
	{
		icon: typeof Mail;
		title: string;
		description: (props: CommunicationEmptyStateProps) => string;
		showAction?: boolean;
		defaultActionLabel?: string;
	}
> = {
	"no-communications": {
		icon: Inbox,
		title: "No communications yet",
		description: () => "Your communications will appear here when you receive messages.",
		showAction: true,
		defaultActionLabel: "New Message",
	},
	"no-search-results": {
		icon: Search,
		title: "No results found",
		description: (props) =>
			props.searchQuery
				? `No communications match "${props.searchQuery}". Try adjusting your search terms.`
				: "No communications match your search. Try adjusting your search terms.",
		showAction: false,
	},
	"empty-inbox": {
		icon: Inbox,
		title: "Inbox is empty",
		description: () => "You're all caught up! No new messages.",
		showAction: true,
		defaultActionLabel: "New Message",
	},
	"empty-folder": {
		icon: Archive,
		title: `No ${"folder"} items`,
		description: (props) => {
			const folderNames: Record<string, string> = {
				draft: "drafts",
				sent: "sent messages",
				archived: "archived items",
				starred: "starred items",
			};
			const folderName = folderNames[props.folder || ""] || "items";
			return `You don't have any ${folderName} yet.`;
		},
		showAction: props => props.folder === "draft",
		defaultActionLabel: "New Message",
	},
	"empty-type-filter": {
		icon: Mail,
		title: `No ${"type"} messages`,
		description: (props) => {
			const typeNames: Record<string, string> = {
				email: "email",
				sms: "text message",
				call: "call",
				voicemail: "voicemail",
			};
			const typeName = typeNames[props.type || ""] || "messages";
			return `You don't have any ${typeName}s in this view.`;
		},
		showAction: true,
		defaultActionLabel: "New Message",
	},
	"empty-team-channel": {
		icon: MessageSquare,
		title: "No messages yet",
		description: (props) =>
			props.channelName
				? `Start the conversation in #${props.channelName}!`
				: "Start the conversation!",
		showAction: false,
	},
	"empty-sms-conversation": {
		icon: MessageSquare,
		title: "No messages yet",
		description: () => "Start a conversation by sending a message.",
		showAction: false,
	},
};

const iconComponents = {
	Mail,
	Inbox,
	Archive,
	Search,
	MessageSquare,
	Phone,
	Voicemail,
	Star,
};

export function CommunicationEmptyState({
	variant,
	searchQuery,
	folder,
	type,
	channelName,
	onAction,
	actionLabel,
	className,
}: CommunicationEmptyStateProps) {
	const config = variantConfig[variant];
	const Icon = config.icon;
	const description = config.description({
		variant,
		searchQuery,
		folder,
		type,
		channelName,
		onAction,
		actionLabel,
		className,
	});

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center p-8 text-center",
				className,
			)}
		>
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
				<Icon className="h-8 w-8 text-muted-foreground" />
			</div>
			<div className="space-y-2 max-w-md">
				<h3 className="text-lg font-semibold">{config.title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
				{config.showAction && onAction && (
					<div className="flex justify-center pt-4">
						<Button onClick={onAction} className="h-11 px-5">
							<Plus className="h-4 w-4 mr-2" />
							{actionLabel || config.defaultActionLabel}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

