"use client";

/**
 * Extracted Information Panel
 *
 * Displays information automatically extracted from the call transcript
 * by AI analysis. CSRs can one-click to update customer records.
 *
 * Extracts:
 * - Contact information (phone, email, address)
 * - Issue details (type, urgency, description)
 * - Equipment mentioned (model, serial number)
 * - Dates and times mentioned
 * - Amounts/prices discussed
 * - Names mentioned
 */

import {
	Calendar,
	Check,
	Clock,
	Copy,
	DollarSign,
	Home,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Plus,
	RefreshCw,
	Sparkles,
	Tag,
	User,
	Wrench,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ExtractedItemType =
	| "phone"
	| "email"
	| "address"
	| "name"
	| "date"
	| "time"
	| "amount"
	| "equipment"
	| "issue"
	| "reference";

type ExtractedItem = {
	id: string;
	type: ExtractedItemType;
	value: string;
	label?: string;
	confidence: number; // 0-100
	source: string; // Quote from transcript
	timestamp: number;
	applied?: boolean;
};

type ExtractedInfoPanelProps = {
	items: ExtractedItem[];
	isExtracting?: boolean;
	onApply?: (item: ExtractedItem) => void;
	onDismiss?: (itemId: string) => void;
	onRefresh?: () => void;
	className?: string;
};

const typeConfig: Record<
	ExtractedItemType,
	{
		icon: React.ElementType;
		label: string;
		color: string;
		bgColor: string;
	}
> = {
	phone: {
		icon: Phone,
		label: "Phone",
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	email: {
		icon: Mail,
		label: "Email",
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	address: {
		icon: MapPin,
		label: "Address",
		color: "text-orange-500",
		bgColor: "bg-orange-500/10",
	},
	name: {
		icon: User,
		label: "Name",
		color: "text-violet-500",
		bgColor: "bg-violet-500/10",
	},
	date: {
		icon: Calendar,
		label: "Date",
		color: "text-success",
		bgColor: "bg-success/10",
	},
	time: {
		icon: Clock,
		label: "Time",
		color: "text-success",
		bgColor: "bg-success/10",
	},
	amount: {
		icon: DollarSign,
		label: "Amount",
		color: "text-warning",
		bgColor: "bg-warning/10",
	},
	equipment: {
		icon: Wrench,
		label: "Equipment",
		color: "text-muted-foreground",
		bgColor: "bg-muted",
	},
	issue: {
		icon: Tag,
		label: "Issue",
		color: "text-destructive",
		bgColor: "bg-destructive/10",
	},
	reference: {
		icon: Tag,
		label: "Reference",
		color: "text-muted-foreground",
		bgColor: "bg-muted",
	},
};

export function ExtractedInfoPanel({
	items,
	isExtracting = false,
	onApply,
	onDismiss,
	onRefresh,
	className,
}: ExtractedInfoPanelProps) {
	const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
	const [copiedId, setCopiedId] = useState<string | null>(null);

	// Filter dismissed items and sort by timestamp
	const visibleItems = items
		.filter((item) => !dismissedIds.has(item.id))
		.sort((a, b) => b.timestamp - a.timestamp);

	const handleDismiss = (itemId: string) => {
		setDismissedIds((prev) => new Set([...prev, itemId]));
		onDismiss?.(itemId);
	};

	const handleCopy = async (item: ExtractedItem) => {
		await navigator.clipboard.writeText(item.value);
		setCopiedId(item.id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const handleApply = (item: ExtractedItem) => {
		onApply?.(item);
		// Mark as applied by adding to dismissed
		handleDismiss(item.id);
	};

	// Group items by type
	const groupedItems = visibleItems.reduce(
		(acc, item) => {
			const type = item.type;
			if (!acc[type]) acc[type] = [];
			acc[type].push(item);
			return acc;
		},
		{} as Record<ExtractedItemType, ExtractedItem[]>,
	);

	if (visibleItems.length === 0 && !isExtracting) {
		return null;
	}

	return (
		<TooltipProvider delayDuration={300}>
			<div
				className={cn(
					"overflow-hidden rounded-xl border shadow-sm",
					"bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5",
					"border-emerald-500/20",
					className,
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-emerald-500/10 px-4 py-2">
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-emerald-500/10 p-1.5">
							<Sparkles className="h-3.5 w-3.5 text-emerald-500" />
						</div>
						<span className="text-sm font-semibold">Extracted Info</span>
						{isExtracting && (
							<Badge
								variant="outline"
								className="gap-1 border-emerald-500/30 text-[10px] text-emerald-500"
							>
								<Loader2 className="h-2.5 w-2.5 animate-spin" />
								Extracting...
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-1">
						<Badge variant="secondary" className="text-[10px]">
							{visibleItems.length} found
						</Badge>
						{onRefresh && (
							<Button
								className="h-7 w-7"
								onClick={onRefresh}
								size="icon"
								variant="ghost"
								disabled={isExtracting}
							>
								<RefreshCw
									className={cn("h-3.5 w-3.5", isExtracting && "animate-spin")}
								/>
							</Button>
						)}
					</div>
				</div>

				{/* Items List */}
				<div className="max-h-[300px] overflow-y-auto p-3">
					{Object.entries(groupedItems).map(([type, typeItems]) => {
						const config = typeConfig[type as ExtractedItemType];
						const Icon = config.icon;

						return (
							<div key={type} className="mb-3 last:mb-0">
								{/* Type Header */}
								<div className="mb-2 flex items-center gap-1.5">
									<div className={cn("rounded p-1", config.bgColor)}>
										<Icon className={cn("h-3 w-3", config.color)} />
									</div>
									<span
										className={cn(
											"text-xs font-medium uppercase tracking-wide",
											config.color,
										)}
									>
										{config.label}
									</span>
								</div>

								{/* Items */}
								<div className="space-y-1.5 pl-6">
									{typeItems.map((item) => (
										<div
											key={item.id}
											className="group flex items-center gap-2 rounded-lg border bg-card p-2 transition-colors hover:bg-muted/50"
										>
											{/* Value */}
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium">
													{item.value}
												</p>
												{item.label && (
													<p className="text-muted-foreground truncate text-[10px]">
														{item.label}
													</p>
												)}
											</div>

											{/* Confidence */}
											<Badge
												variant="outline"
												className={cn(
													"shrink-0 text-[10px]",
													item.confidence >= 90
														? "border-success/50 text-success"
														: item.confidence >= 70
															? "border-warning/50 text-warning"
															: "border-muted text-muted-foreground",
												)}
											>
												{item.confidence}%
											</Badge>

											{/* Actions */}
											<div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															className="h-6 w-6"
															onClick={() => handleCopy(item)}
															size="icon"
															variant="ghost"
														>
															{copiedId === item.id ? (
																<Check className="h-3 w-3 text-success" />
															) : (
																<Copy className="h-3 w-3" />
															)}
														</Button>
													</TooltipTrigger>
													<TooltipContent>Copy</TooltipContent>
												</Tooltip>

												{onApply && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																className="h-6 w-6"
																onClick={() => handleApply(item)}
																size="icon"
																variant="ghost"
															>
																<Plus className="h-3 w-3" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Update customer record
														</TooltipContent>
													</Tooltip>
												)}

												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															className="h-6 w-6"
															onClick={() => handleDismiss(item.id)}
															size="icon"
															variant="ghost"
														>
															<X className="h-3 w-3" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>Dismiss</TooltipContent>
												</Tooltip>
											</div>
										</div>
									))}
								</div>
							</div>
						);
					})}

					{/* Loading state */}
					{isExtracting && visibleItems.length === 0 && (
						<div className="flex items-center justify-center py-6">
							<div className="text-center">
								<Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-500" />
								<p className="text-muted-foreground mt-2 text-xs">
									Analyzing transcript...
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				{visibleItems.length > 0 && (
					<div className="border-t border-emerald-500/10 px-3 py-2">
						<p className="text-muted-foreground/60 text-center text-[10px]">
							Click + to update customer record with extracted info
						</p>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}

/**
 * Compact Extracted Info Badge
 *
 * Shows count of extracted items, expands on click
 */
type ExtractedInfoBadgeProps = {
	count: number;
	onClick?: () => void;
	className?: string;
};

export function ExtractedInfoBadge({
	count,
	onClick,
	className,
}: ExtractedInfoBadgeProps) {
	if (count === 0) return null;

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						className={cn(
							"flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors",
							"border-emerald-500/30 bg-emerald-500/10",
							"hover:bg-emerald-500/20",
							className,
						)}
						onClick={onClick}
						type="button"
					>
						<Sparkles className="h-3.5 w-3.5 text-emerald-500" />
						<span className="text-xs font-medium text-emerald-600">
							{count}
						</span>
					</button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{count} items extracted from transcript</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
