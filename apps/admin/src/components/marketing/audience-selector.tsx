"use client";

/**
 * Audience Selector Component
 *
 * Allows selection of campaign audience type and filters.
 * Used in the campaign builder for targeting recipients.
 */

import { useState, useEffect } from "react";
import {
	Building2,
	Check,
	Clock,
	Filter,
	Mail,
	Users,
	Loader2,
} from "lucide-react";
import { Button, Label, cn } from "@stratos/ui";
import { Checkbox } from "@/components/ui/checkbox";
import type { EmailCampaignAudienceType, AudienceFilter } from "@/types/campaigns";
import { useCampaignStore } from "@/lib/stores/campaign-store";

type AudienceSelectorProps = {
	value: EmailCampaignAudienceType;
	filter?: AudienceFilter;
	onChange: (type: EmailCampaignAudienceType, filter: AudienceFilter) => void;
	error?: string;
};

type AudienceOption = {
	id: EmailCampaignAudienceType;
	label: string;
	description: string;
	icon: typeof Users;
	iconColor: string;
	bgColor: string;
};

const AUDIENCE_OPTIONS: AudienceOption[] = [
	{
		id: "waitlist",
		label: "Waitlist Subscribers",
		description: "Send to everyone who signed up for the waitlist",
		icon: Clock,
		iconColor: "text-emerald-600",
		bgColor: "bg-emerald-500/10",
	},
	{
		id: "all_users",
		label: "All Platform Users",
		description: "Send to all registered users across all companies",
		icon: Users,
		iconColor: "text-blue-600",
		bgColor: "bg-blue-500/10",
	},
	{
		id: "all_companies",
		label: "All Companies",
		description: "Send to company owners/admins only",
		icon: Building2,
		iconColor: "text-purple-600",
		bgColor: "bg-purple-500/10",
	},
	{
		id: "segment",
		label: "Custom Segment",
		description: "Filter users or companies by specific criteria",
		icon: Filter,
		iconColor: "text-amber-600",
		bgColor: "bg-amber-500/10",
	},
	{
		id: "custom",
		label: "Custom Email List",
		description: "Enter specific email addresses manually",
		icon: Mail,
		iconColor: "text-gray-600",
		bgColor: "bg-gray-500/10",
	},
];

export function AudienceSelector({ value, filter, onChange, error }: AudienceSelectorProps) {
	const [localFilter, setLocalFilter] = useState<AudienceFilter>(
		filter || {
			excludeUnsubscribed: true,
			excludeBounced: true,
			excludeComplained: true,
		}
	);
	const [customEmails, setCustomEmails] = useState<string>(
		filter?.customEmails?.join("\n") || ""
	);

	const { audiencePreview, setAudiencePreview } = useCampaignStore();

	// Simulate fetching audience count when selection changes
	useEffect(() => {
		setAudiencePreview({ isLoading: true });

		// Simulate API call
		const timer = setTimeout(() => {
			const counts: Record<EmailCampaignAudienceType, number> = {
				waitlist: 2156,
				all_users: 8432,
				all_companies: 342,
				segment: 0,
				custom: customEmails.split("\n").filter((e) => e.trim()).length,
			};

			setAudiencePreview({
				isLoading: false,
				estimatedCount: counts[value] || 0,
				sampleRecipients: [
					{ email: "john@example.com", name: "John Doe", type: value },
					{ email: "jane@example.com", name: "Jane Smith", type: value },
					{ email: "mike@example.com", name: "Mike Johnson", type: value },
				],
				lastUpdated: new Date().toISOString(),
			});
		}, 500);

		return () => clearTimeout(timer);
	}, [value, customEmails, setAudiencePreview]);

	const handleTypeChange = (type: EmailCampaignAudienceType) => {
		onChange(type, localFilter);
	};

	const handleFilterChange = (updates: Partial<AudienceFilter>) => {
		const newFilter = { ...localFilter, ...updates };
		setLocalFilter(newFilter);
		onChange(value, newFilter);
	};

	const handleCustomEmailsChange = (emails: string) => {
		setCustomEmails(emails);
		const emailList = emails
			.split("\n")
			.map((e) => e.trim())
			.filter((e) => e && e.includes("@"));
		handleFilterChange({ customEmails: emailList });
	};

	return (
		<div className="space-y-6">
			{/* Audience Type Selection */}
			<div className="grid gap-3">
				{AUDIENCE_OPTIONS.map((option) => {
					const isSelected = value === option.id;
					const Icon = option.icon;

					return (
						<button
							key={option.id}
							type="button"
							className={cn(
								"flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
								isSelected
									? "border-primary bg-primary/5 ring-1 ring-primary"
									: "hover:border-primary/50 hover:bg-muted/50"
							)}
							onClick={() => handleTypeChange(option.id)}
						>
							<div className={cn("rounded-lg p-2", option.bgColor)}>
								<Icon className={cn("size-5", option.iconColor)} />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<p className="font-medium">{option.label}</p>
									{isSelected && (
										<div className="rounded-full bg-primary p-0.5">
											<Check className="size-3 text-primary-foreground" />
										</div>
									)}
								</div>
								<p className="text-sm text-muted-foreground">{option.description}</p>
							</div>
						</button>
					);
				})}
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}

			{/* Filter Options for Segment */}
			{value === "segment" && (
				<div className="rounded-lg border p-4 space-y-4">
					<h4 className="font-medium">Segment Filters</h4>

					<div className="space-y-4">
						{/* User Roles */}
						<div className="space-y-2">
							<Label className="text-sm">User Roles</Label>
							<div className="flex flex-wrap gap-2">
								{(["owner", "admin", "manager", "technician"] as const).map((role) => (
									<label
										key={role}
										className="flex items-center gap-2 rounded border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted"
									>
										<Checkbox
											checked={localFilter.userRoles?.includes(role) || false}
											onCheckedChange={(checked) => {
												const currentRoles = localFilter.userRoles || [];
												const newRoles = checked
													? [...currentRoles, role]
													: currentRoles.filter((r) => r !== role);
												handleFilterChange({ userRoles: newRoles.length > 0 ? newRoles : undefined });
											}}
										/>
										<span className="capitalize">{role}</span>
									</label>
								))}
							</div>
						</div>

						{/* Company Plans */}
						<div className="space-y-2">
							<Label className="text-sm">Company Plans</Label>
							<div className="flex flex-wrap gap-2">
								{(["starter", "professional", "enterprise"] as const).map((plan) => (
									<label
										key={plan}
										className="flex items-center gap-2 rounded border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted"
									>
										<Checkbox
											checked={localFilter.companyPlans?.includes(plan) || false}
											onCheckedChange={(checked) => {
												const currentPlans = localFilter.companyPlans || [];
												const newPlans = checked
													? [...currentPlans, plan]
													: currentPlans.filter((p) => p !== plan);
												handleFilterChange({ companyPlans: newPlans.length > 0 ? newPlans : undefined });
											}}
										/>
										<span className="capitalize">{plan}</span>
									</label>
								))}
							</div>
						</div>

						{/* Status Filters */}
						<div className="space-y-2">
							<Label className="text-sm">Company Status</Label>
							<div className="flex flex-wrap gap-2">
								{(["active", "trial", "suspended"] as const).map((status) => (
									<label
										key={status}
										className="flex items-center gap-2 rounded border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted"
									>
										<Checkbox
											checked={localFilter.companyStatuses?.includes(status) || false}
											onCheckedChange={(checked) => {
												const currentStatuses = localFilter.companyStatuses || [];
												const newStatuses = checked
													? [...currentStatuses, status]
													: currentStatuses.filter((s) => s !== status);
												handleFilterChange({ companyStatuses: newStatuses.length > 0 ? newStatuses : undefined });
											}}
										/>
										<span className="capitalize">{status}</span>
									</label>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Custom Email Input */}
			{value === "custom" && (
				<div className="rounded-lg border p-4 space-y-4">
					<h4 className="font-medium">Custom Email List</h4>
					<p className="text-sm text-muted-foreground">
						Enter email addresses, one per line
					</p>
					<textarea
						className="w-full min-h-[150px] rounded-md border bg-background px-3 py-2 text-sm font-mono"
						placeholder={"john@example.com\njane@example.com\nmike@example.com"}
						value={customEmails}
						onChange={(e) => handleCustomEmailsChange(e.target.value)}
					/>
				</div>
			)}

			{/* Exclusion Options */}
			<div className="rounded-lg border p-4 space-y-4">
				<h4 className="font-medium">Exclusions</h4>
				<div className="space-y-3">
					<label className="flex items-center gap-2 cursor-pointer">
						<Checkbox
							checked={localFilter.excludeUnsubscribed !== false}
							onCheckedChange={(checked) =>
								handleFilterChange({ excludeUnsubscribed: checked === true })
							}
						/>
						<span className="text-sm">Exclude unsubscribed contacts</span>
					</label>
					<label className="flex items-center gap-2 cursor-pointer">
						<Checkbox
							checked={localFilter.excludeBounced !== false}
							onCheckedChange={(checked) =>
								handleFilterChange({ excludeBounced: checked === true })
							}
						/>
						<span className="text-sm">Exclude bounced emails</span>
					</label>
					<label className="flex items-center gap-2 cursor-pointer">
						<Checkbox
							checked={localFilter.excludeComplained !== false}
							onCheckedChange={(checked) =>
								handleFilterChange({ excludeComplained: checked === true })
							}
						/>
						<span className="text-sm">Exclude spam complaints</span>
					</label>
				</div>
			</div>

			{/* Audience Preview */}
			<div className="rounded-lg border bg-muted/30 p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Users className="size-4 text-muted-foreground" />
						<span className="text-sm font-medium">Estimated Recipients</span>
					</div>
					{audiencePreview.isLoading ? (
						<Loader2 className="size-4 animate-spin text-muted-foreground" />
					) : (
						<span className="text-lg font-bold">
							{audiencePreview.estimatedCount.toLocaleString()}
						</span>
					)}
				</div>

				{!audiencePreview.isLoading && audiencePreview.sampleRecipients.length > 0 && (
					<div className="mt-3 pt-3 border-t">
						<p className="text-xs text-muted-foreground mb-2">Sample recipients:</p>
						<div className="space-y-1">
							{audiencePreview.sampleRecipients.slice(0, 3).map((recipient, i) => (
								<div key={i} className="flex items-center gap-2 text-sm">
									<Mail className="size-3 text-muted-foreground" />
									<span>{recipient.email}</span>
									{recipient.name && (
										<span className="text-muted-foreground">({recipient.name})</span>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
