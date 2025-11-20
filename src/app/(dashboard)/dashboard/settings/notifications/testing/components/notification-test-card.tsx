"use client";

import {
	AlertTriangle,
	Bell,
	CheckCircle2,
	ExternalLink,
	Eye,
	Mail,
	MessageSquare,
	Send,
	Smartphone,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
	NotificationChannel,
	NotificationDefinition,
} from "../notification-registry";
import { EmailPreviewModal } from "./email-preview-modal";
import { NotificationTestDialog } from "./notification-test-dialog";

interface NotificationTestCardProps {
	notification: NotificationDefinition;
	activeChannel: NotificationChannel | "all";
}

export function NotificationTestCard({
	notification,
	activeChannel,
}: NotificationTestCardProps) {
	const [showEmailPreview, setShowEmailPreview] = useState(false);
	const [showTestDialog, setShowTestDialog] = useState(false);
	const [selectedChannel, setSelectedChannel] =
		useState<NotificationChannel | null>(null);

	// Determine which channels to show based on active filter
	const visibleChannels: NotificationChannel[] =
		activeChannel === "all"
			? (["email", "sms", "in_app", "push"] as NotificationChannel[]).filter(
					(ch) => notification.channels[ch] !== undefined,
				)
			: notification.channels[activeChannel]
				? [activeChannel]
				: [];

	const handleTestClick = (channel: NotificationChannel) => {
		setSelectedChannel(channel);
		setShowTestDialog(true);
	};

	const handlePreviewClick = () => {
		if (notification.channels.email) {
			setShowEmailPreview(true);
		}
	};

	return (
		<>
			<Card className="transition-shadow hover:shadow-md">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<CardTitle className="text-lg">{notification.name}</CardTitle>
								<CategoryBadge category={notification.category} />
								<PriorityBadge priority={notification.priority} />
							</div>
							<CardDescription className="mt-1">
								{notification.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Channel Implementation Status */}
					<div className="space-y-2">
						<p className="text-muted-foreground text-sm font-medium">
							Available Channels:
						</p>
						<div className="flex flex-wrap gap-2">
							{visibleChannels.map((channel) => {
								const channelData = notification.channels[channel]!;
								return (
									<ChannelStatusBadge
										key={channel}
										channel={channel}
										status={channelData.status}
										onClick={() => handleTestClick(channel)}
									/>
								);
							})}
							{visibleChannels.length === 0 && (
								<p className="text-muted-foreground text-sm">
									No channels available for current filter
								</p>
							)}
						</div>
					</div>

					{/* Implementation Details */}
					{visibleChannels.map((channel) => {
						const channelData = notification.channels[channel]!;
						return (
							<div key={channel} className="space-y-1 border-t pt-2 text-xs">
								<div className="flex items-center gap-2">
									<ChannelIcon channel={channel} className="h-3 w-3" />
									<span className="font-medium capitalize">
										{channel} Implementation:
									</span>
								</div>
								{channelData.templatePath && (
									<div className="text-muted-foreground flex items-center gap-1 pl-5">
										<code className="bg-muted rounded px-1">
											{channelData.templatePath}
										</code>
									</div>
								)}
								{channelData.templateComponent && (
									<div className="text-muted-foreground pl-5">
										Component:{" "}
										<code className="bg-muted rounded px-1">
											{channelData.templateComponent}
										</code>
									</div>
								)}
								{channelData.templateFunction && (
									<div className="text-muted-foreground pl-5">
										Function:{" "}
										<code className="bg-muted rounded px-1">
											{channelData.templateFunction}
										</code>
									</div>
								)}
								{channelData.triggerFunction && (
									<div className="text-muted-foreground pl-5">
										Trigger:{" "}
										<code className="bg-muted rounded px-1">
											{channelData.triggerFunction}()
										</code>
									</div>
								)}
								{channelData.serviceFunction && (
									<div className="text-muted-foreground pl-5">
										Service:{" "}
										<code className="bg-muted rounded px-1">
											{channelData.serviceFunction}()
										</code>
									</div>
								)}
							</div>
						);
					})}

					{/* Action Buttons */}
					<div className="flex gap-2 pt-2">
						{notification.channels.email?.status === "complete" && (
							<Button size="sm" variant="outline" onClick={handlePreviewClick}>
								<Eye className="mr-2 h-4 w-4" />
								Preview Email
							</Button>
						)}
						{visibleChannels.some(
							(ch) => notification.channels[ch]?.status === "complete",
						) && (
							<Button
								size="sm"
								onClick={() => {
									const firstCompleteChannel = visibleChannels.find(
										(ch) => notification.channels[ch]?.status === "complete",
									);
									if (firstCompleteChannel)
										handleTestClick(firstCompleteChannel);
								}}
							>
								<Send className="mr-2 h-4 w-4" />
								Send Test
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Email Preview Modal */}
			{notification.channels.email && (
				<EmailPreviewModal
					open={showEmailPreview}
					onOpenChange={setShowEmailPreview}
					notification={notification}
				/>
			)}

			{/* Test Dialog */}
			{selectedChannel && (
				<NotificationTestDialog
					open={showTestDialog}
					onOpenChange={setShowTestDialog}
					notification={notification}
					channel={selectedChannel}
				/>
			)}
		</>
	);
}

function CategoryBadge({
	category,
}: {
	category: NotificationDefinition["category"];
}) {
	const colors = {
		auth: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
		job: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
		billing:
			"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		customer:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
		team: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
		system: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
	};

	return (
		<Badge
			variant="secondary"
			className={cn("text-xs capitalize", colors[category])}
		>
			{category}
		</Badge>
	);
}

function PriorityBadge({
	priority,
}: {
	priority: NotificationDefinition["priority"];
}) {
	const config = {
		low: { color: "bg-gray-100 text-gray-600", label: "Low" },
		medium: { color: "bg-blue-100 text-blue-600", label: "Medium" },
		high: { color: "bg-orange-100 text-orange-600", label: "High" },
		urgent: { color: "bg-red-100 text-red-600", label: "Urgent" },
	};

	const { color, label } = config[priority];

	return (
		<Badge variant="outline" className={cn("text-xs", color)}>
			{label}
		</Badge>
	);
}

interface ChannelStatusBadgeProps {
	channel: NotificationChannel;
	status: "complete" | "partial" | "missing";
	onClick: () => void;
}

function ChannelStatusBadge({
	channel,
	status,
	onClick,
}: ChannelStatusBadgeProps) {
	const statusConfig = {
		complete: {
			icon: <CheckCircle2 className="h-3 w-3" />,
			color:
				"bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300",
		},
		partial: {
			icon: <AlertTriangle className="h-3 w-3" />,
			color:
				"bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300",
		},
		missing: {
			icon: <XCircle className="h-3 w-3" />,
			color:
				"bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300",
		},
	};

	const config = statusConfig[status];

	return (
		<Badge
			variant="outline"
			className={cn(
				"flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-80",
				config.color,
			)}
			onClick={status === "complete" ? onClick : undefined}
		>
			<ChannelIcon channel={channel} className="h-3 w-3" />
			<span className="capitalize">{channel.replace("_", "-")}</span>
			{config.icon}
		</Badge>
	);
}

function ChannelIcon({
	channel,
	className,
}: {
	channel: NotificationChannel;
	className?: string;
}) {
	const icons = {
		email: <Mail className={className} />,
		sms: <MessageSquare className={className} />,
		in_app: <Bell className={className} />,
		push: <Smartphone className={className} />,
	};

	return icons[channel] || null;
}
