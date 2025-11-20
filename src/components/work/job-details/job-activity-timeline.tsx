"use client";

import {
	Activity,
	ChevronRight,
	Eye,
	Mail,
	MessageSquare,
	Receipt,
	Search,
	Sparkles,
	User,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ActivityItem = {
	id: string;
	activity_type: string;
	entity_type?: string;
	description: string;
	metadata?: Record<string, any>;
	created_at: string;
	user_id?: string;
	user?:
		| {
				name?: string;
				email?: string;
				avatar?: string;
		  }
		| Array<{
				name?: string;
				email?: string;
				avatar?: string;
		  }>;
};

type JobActivityTimelineProps = {
	activities: ActivityItem[];
};

const ITEMS_PER_PAGE = 10;

export function JobActivityTimeline({ activities }: JobActivityTimelineProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	// Activity type styling configuration
	const getActivityConfig = (type: string) => {
		const configs: Record<
			string,
			{
				icon: ReactNode;
				iconColor: string;
				borderColor: string;
				label: string;
			}
		> = {
			created: {
				icon: <Sparkles className="size-3" />,
				iconColor: "text-emerald-600 dark:text-emerald-400",
				borderColor: "border-l-emerald-500",
				label: "Created",
			},
			sent: {
				icon: <Mail className="size-3" />,
				iconColor: "text-blue-600 dark:text-blue-400",
				borderColor: "border-l-blue-500",
				label: "Sent",
			},
			viewed: {
				icon: <Eye className="size-3" />,
				iconColor: "text-purple-600 dark:text-purple-400",
				borderColor: "border-l-purple-500",
				label: "Viewed",
			},
			status_changed: {
				icon: <Activity className="size-3" />,
				iconColor: "text-orange-600 dark:text-orange-400",
				borderColor: "border-l-orange-500",
				label: "Status Changed",
			},
			note_added: {
				icon: <MessageSquare className="size-3" />,
				iconColor: "text-cyan-600 dark:text-cyan-400",
				borderColor: "border-l-cyan-500",
				label: "Note Added",
			},
			assigned: {
				icon: <User className="size-3" />,
				iconColor: "text-indigo-600 dark:text-indigo-400",
				borderColor: "border-l-indigo-500",
				label: "Assigned",
			},
		};

		return (
			configs[type] || {
				icon: <Activity className="size-3" />,
				iconColor: "text-gray-600 dark:text-gray-400",
				borderColor: "border-l-gray-500",
				label: type.replace(/_/g, " "),
			}
		);
	};

	// Filter and sort activities
	const filteredActivities = useMemo(() => {
		let filtered = [...activities];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.description?.toLowerCase().includes(query) ||
					item.activity_type?.toLowerCase().includes(query) ||
					item.entity_type?.toLowerCase().includes(query) ||
					item.metadata?.estimate_number?.toLowerCase().includes(query) ||
					item.metadata?.invoice_number?.toLowerCase().includes(query),
			);
		}

		// Sort by created_at descending
		filtered.sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		);

		return filtered;
	}, [activities, searchQuery]);

	// Paginate activities
	const paginatedActivities = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredActivities.slice(startIndex, endIndex);
	}, [filteredActivities, currentPage]);

	const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

	return (
		<div>
			{/* Search Bar */}
			{activities.length > 5 && (
				<div className="border-b p-3">
					<div className="relative">
						<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
						<Input
							className="pl-9"
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1); // Reset to first page on search
							}}
							placeholder="Search activities..."
							value={searchQuery}
						/>
					</div>
				</div>
			)}

			{/* Activity Items */}
			<div className="divide-y">
				{paginatedActivities.length > 0 ? (
					paginatedActivities.map((item) => {
						const rawUser = Array.isArray(item.user) ? item.user[0] : item.user;

						// Extract user info from auth.users structure
						const activityUser = rawUser
							? {
									name:
										rawUser.raw_user_meta_data?.name ||
										rawUser.name ||
										"Unknown User",
									email: rawUser.raw_user_meta_data?.email || rawUser.email,
									avatar:
										rawUser.raw_user_meta_data?.avatar_url || rawUser.avatar,
								}
							: null;

						const activityType = item.activity_type || "general";
						const entityType = item.entity_type;
						const metadata = item.metadata || {};
						const config = getActivityConfig(activityType);

						return (
							<div
								className={cn(
									"hover:bg-muted/30 flex gap-3 border-l-2 px-4 py-2.5 transition-colors",
									config.borderColor,
								)}
								key={item.id}
							>
								{/* Icon */}
								<div
									className={cn(
										"bg-muted flex size-7 shrink-0 items-center justify-center rounded-full",
										config.iconColor,
									)}
								>
									{config.icon}
								</div>

								{/* Content */}
								<div className="flex min-w-0 flex-1 flex-col gap-1">
									{/* Header with badges, user, and time */}
									<div className="flex items-center justify-between gap-2">
										<div className="flex flex-wrap items-center gap-1.5">
											<Badge className="text-xs" variant="outline">
												{config.label}
											</Badge>
											{entityType && (
												<Badge className="text-xs" variant="secondary">
													{entityType}
												</Badge>
											)}
											{metadata.estimate_number && (
												<Badge className="font-mono text-xs" variant="outline">
													{metadata.estimate_number}
												</Badge>
											)}
											{metadata.invoice_number && (
												<Badge className="font-mono text-xs" variant="outline">
													{metadata.invoice_number}
												</Badge>
											)}
											{activityUser?.name && (
												<div className="text-muted-foreground flex items-center gap-1 text-xs">
													<Avatar className="size-4">
														<AvatarImage src={activityUser.avatar} />
														<AvatarFallback className="text-[8px]">
															{activityUser.name.substring(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<span>{activityUser.name}</span>
												</div>
											)}
										</div>
										<time className="text-muted-foreground shrink-0 text-xs">
											{new Date(item.created_at).toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												hour: "numeric",
												minute: "2-digit",
											})}
										</time>
									</div>

									{/* Description */}
									<p className="text-sm leading-snug">
										{item.description || "Activity logged"}
									</p>

									{/* Metadata footer */}
									{(metadata.amount ||
										metadata.old_status ||
										metadata.email ||
										metadata.method) && (
										<div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
											{metadata.amount && (
												<span className="flex items-center gap-1">
													<Receipt className="size-3" />$
													{(metadata.amount / 100).toFixed(2)}
												</span>
											)}
											{metadata.old_status && metadata.new_status && (
												<span className="flex items-center gap-1">
													<ChevronRight className="size-3" />
													{metadata.old_status} → {metadata.new_status}
												</span>
											)}
											{metadata.email && (
												<span className="flex items-center gap-1">
													<Mail className="size-3" />
													{metadata.email}
												</span>
											)}
											{metadata.method && (
												<span className="flex items-center gap-1">
													via {metadata.method}
												</span>
											)}
										</div>
									)}
								</div>
							</div>
						);
					})
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
							<Activity className="text-muted-foreground size-6" />
						</div>
						<p className="text-muted-foreground text-sm">
							{searchQuery
								? "No activities match your search"
								: "No activity yet"}
						</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between border-t px-4 py-3">
					<p className="text-muted-foreground text-xs">
						Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
						{Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)}{" "}
						of {filteredActivities.length} activities
					</p>
					<div className="flex items-center gap-1">
						<Button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							size="sm"
							variant="outline"
						>
							Previous
						</Button>
						<Button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							size="sm"
							variant="outline"
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
