/**
 * Phone Numbers List
 *
 * Displays all company phone numbers with:
 * - Number, type, and features
 * - Usage metrics (calls, SMS)
 * - Routing configuration
 * - Status and actions
 */

"use client";

import {
	DollarSign,
	Edit,
	MessageSquare,
	MoreVertical,
	Phone,
	Settings,
	Trash2,
	Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PhoneNumberRecord = {
	id: string;
	phoneNumber: string;
	formattedNumber: string;
	areaCode: string | null;
	numberType: string | null;
	status: string | null;
	features: string[];
	incomingCallsCount: number;
	outgoingCallsCount: number;
	smsSentCount: number;
	smsReceivedCount: number;
	monthlyCost: number | null;
	routingRule?: string | null;
	voicemailEnabled?: boolean | null;
	createdAt: string;
	portingStatus?: string | null;
	portingEta?: string | null;
	metadata?: Record<string, unknown> | null;
};

type PhoneNumbersListProps = {
	numbers: PhoneNumberRecord[];
};

export function PhoneNumbersList({ numbers }: PhoneNumbersListProps) {
	return (
		<div className="space-y-4 p-6">
			{numbers.length === 0 ? (
				<EmptyState />
			) : (
				numbers.map((number) => (
					<PhoneNumberCard key={number.id} number={number} />
				))
			)}
		</div>
	);
}

function PhoneNumberCard({ number }: { number: PhoneNumberRecord }) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-3">
							<CardTitle className="text-2xl font-semibold">
								{number.formattedNumber}
							</CardTitle>
							<Badge variant={getStatusVariant(number.status)}>
								{getStatusLabel(number.status)}
							</Badge>
							{number.numberType === "toll-free" && (
								<Badge variant="secondary">Toll-Free</Badge>
							)}
						</div>
						<CardDescription>
							{number.routingRule ?? "Routing not configured"}{" "}
							{number.voicemailEnabled && "• Voicemail enabled"}
						</CardDescription>
						<div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
							{number.metadata?.ten_dlc_campaign_id ? (
								<Badge variant="secondary">10DLC Linked</Badge>
							) : (
								<Badge variant="outline">10DLC Pending</Badge>
							)}
						</div>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreVertical className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Edit className="mr-2 size-4" />
								Configure Routing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 size-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="mr-2 size-4" />
								Release Number
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent>
				{/* Porting Status (if applicable) */}
				{number.status === "porting" && (
					<div className="border-primary bg-primary dark:border-primary dark:bg-primary/20 mb-4 rounded-lg border p-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-primary dark:text-primary font-medium">
									Porting {number.portingStatus}
								</div>
								<div className="text-primary dark:text-primary text-sm">
									Estimated completion: {number.portingEta}
								</div>
							</div>
							<Button size="sm" variant="outline">
								View Status
							</Button>
						</div>
					</div>
				)}

				{/* Usage Metrics */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<MetricCard
						color="text-success dark:text-success"
						icon={Phone}
						label="Incoming Calls"
						value={number.incomingCallsCount.toLocaleString()}
					/>
					<MetricCard
						color="text-primary dark:text-primary"
						icon={Phone}
						label="Outgoing Calls"
						value={number.outgoingCallsCount.toLocaleString()}
					/>
					<MetricCard
						color="text-accent-foreground dark:text-accent-foreground"
						icon={MessageSquare}
						label="SMS Sent"
						value={number.smsSentCount.toLocaleString()}
					/>
					<MetricCard
						color="text-warning dark:text-warning"
						icon={DollarSign}
						label="Monthly Cost"
						value={`$${(number.monthlyCost ?? 0).toFixed(2)}`}
					/>
				</div>

				{/* Features */}
				<div className="mt-4 flex flex-wrap gap-2">
					{number.features.map((feature) => (
						<Badge className="capitalize" key={feature} variant="outline">
							{feature}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function MetricCard({
	icon: Icon,
	label,
	value,
	color,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	color: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			<div className="text-muted-foreground flex items-center gap-2 text-sm">
				<Icon className={`size-4 ${color}`} />
				{label}
			</div>
			<div className="text-xl font-semibold">{value}</div>
		</div>
	);
}

function EmptyState() {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center py-12">
				<Phone className="text-muted-foreground mb-4 size-12" />
				<h3 className="mb-2 text-lg font-semibold">No phone numbers yet</h3>
				<p className="text-muted-foreground mb-6 text-center text-sm">
					Get started by purchasing a new number or porting an existing one
				</p>
				<div className="flex gap-3">
					<Button variant="outline">
						<Upload className="mr-2 size-4" />
						Port Number
					</Button>
					<Button>
						<Phone className="mr-2 size-4" />
						Purchase Number
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function getStatusVariant(
	status: string | null,
): "default" | "secondary" | "destructive" | "outline" {
	switch (status) {
		case "active":
			return "default";
		case "porting":
			return "secondary";
		case "suspended":
			return "destructive";
		default:
			return "outline";
	}
}

function getStatusLabel(status: string | null): string {
	if (!status) {
		return "Unknown";
	}
	switch (status) {
		case "active":
			return "Active";
		case "pending":
			return "Pending Setup";
		case "porting":
			return "Porting";
		case "suspended":
			return "Suspended";
		case "suspended":
			return "Suspended";
		default:
			return status;
	}
}
