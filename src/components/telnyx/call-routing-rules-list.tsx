/**
 * Call Routing Rules List - Server Component
 *
 * Displays all call routing rules with management capabilities:
 * - View all routing rules
 * - Edit rule configuration
 * - Toggle active status
 * - Delete rules
 * - Priority ordering
 *
 * Performance optimizations:
 * - Server Component by default
 * - Efficient database queries
 * - Optimistic UI updates
 */

import { Clock, Menu, Phone, Settings, Users } from "lucide-react";
import { getCallRoutingRules } from "@/actions/telnyx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserCompanyId } from "@/lib/auth/user-data";
import { CallRoutingRuleActions } from "./call-routing-rule-actions";

export async function CallRoutingRulesList() {
	const companyId = await getUserCompanyId();

	if (!companyId) {
		return (
			<div className="flex items-center justify-center p-12">
				<p className="text-muted-foreground">No company found</p>
			</div>
		);
	}

	const result = await getCallRoutingRules(companyId);

	if (!(result.success && result.data)) {
		return (
			<div className="flex items-center justify-center p-12">
				<p className="text-destructive">{result.error || "Failed to load routing rules"}</p>
			</div>
		);
	}

	const rules = result.data;

	if (rules.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12">
				<Phone className="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">No Routing Rules</h3>
				<p className="mb-4 text-muted-foreground">Create your first call routing rule to get started</p>
				<Button>Create Routing Rule</Button>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-6">
			{rules.map((rule) => (
				<Card className={rule.is_active ? "" : "opacity-60"} key={rule.id}>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="mb-2 flex items-center gap-3">
									<CardTitle className="text-lg">{rule.name}</CardTitle>
									<Badge variant={rule.is_active ? "default" : "secondary"}>
										{rule.is_active ? "Active" : "Inactive"}
									</Badge>
									<RoutingTypeBadge type={rule.routing_type} />
								</div>
								{rule.description && <CardDescription>{rule.description}</CardDescription>}
							</div>
							<div className="flex items-center gap-2">
								<Badge className="font-mono" variant="outline">
									Priority: {rule.priority}
								</Badge>
								<CallRoutingRuleActions rule={rule} />
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							{/* Routing Details */}
							<RoutingDetails rule={rule} />

							{/* Business Hours */}
							{rule.routing_type === "business_hours" && <BusinessHoursInfo rule={rule} />}

							{/* Team Members */}
							{rule.routing_type === "round_robin" && rule.team_members && (
								<TeamMembersInfo teamMembers={rule.team_members} />
							)}

							{/* Features */}
							<FeaturesInfo rule={rule} />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function RoutingTypeBadge({ type }: { type: string }) {
	const icons = {
		direct: <Phone className="h-3 w-3" />,
		round_robin: <Users className="h-3 w-3" />,
		ivr: <Menu className="h-3 w-3" />,
		business_hours: <Clock className="h-3 w-3" />,
		conditional: <Settings className="h-3 w-3" />,
	};

	const labels = {
		direct: "Direct",
		round_robin: "Round Robin",
		ivr: "IVR Menu",
		business_hours: "Business Hours",
		conditional: "Conditional",
	};

	return (
		<Badge className="gap-1.5" variant="outline">
			{icons[type as keyof typeof icons]}
			{labels[type as keyof typeof labels] || type}
		</Badge>
	);
}

function RoutingDetails({ rule }: { rule: any }) {
	return (
		<div className="space-y-2">
			<h4 className="font-medium text-sm">Routing Configuration</h4>
			<div className="space-y-1 text-muted-foreground text-sm">
				{rule.routing_type === "direct" && rule.forward_to_number && <p>Forward to: {rule.forward_to_number}</p>}
				{rule.routing_type === "round_robin" && <p>Ring timeout: {rule.ring_timeout}s</p>}
				{rule.routing_type === "ivr" && <p>IVR Menu configured</p>}
				{rule.routing_type === "business_hours" && (
					<>
						<p>Timezone: {rule.timezone}</p>
						<p>After hours: {rule.after_hours_action || "Voicemail"}</p>
					</>
				)}
			</div>
		</div>
	);
}

function BusinessHoursInfo({ rule }: { rule: any }) {
	const businessHours = rule.business_hours as Record<string, any> | null;

	if (!businessHours) {
		return (
			<div className="space-y-2">
				<h4 className="font-medium text-sm">Business Hours</h4>
				<p className="text-muted-foreground text-sm">Not configured</p>
			</div>
		);
	}

	const days = Object.keys(businessHours);
	const configuredDays = days.filter((day) => businessHours[day]?.length > 0);

	return (
		<div className="space-y-2">
			<h4 className="font-medium text-sm">Business Hours</h4>
			<div className="text-muted-foreground text-sm">
				<p>{configuredDays.length} days configured</p>
				{configuredDays.length > 0 && (
					<p className="mt-1 text-xs">
						{configuredDays.slice(0, 3).join(", ")}
						{configuredDays.length > 3 && `, +${configuredDays.length - 3} more`}
					</p>
				)}
			</div>
		</div>
	);
}

function TeamMembersInfo({ teamMembers }: { teamMembers: string[] }) {
	return (
		<div className="space-y-2">
			<h4 className="font-medium text-sm">Team Members</h4>
			<div className="text-muted-foreground text-sm">
				<p>{teamMembers.length} members in rotation</p>
			</div>
		</div>
	);
}

function FeaturesInfo({ rule }: { rule: any }) {
	const features = [];

	if (rule.enable_voicemail) {
		features.push("Voicemail");
	}
	if (rule.record_calls) {
		features.push("Recording");
	}
	if (rule.voicemail_transcription_enabled) {
		features.push("Transcription");
	}
	if (rule.voicemail_email_notifications) {
		features.push("Email alerts");
	}

	if (features.length === 0) {
		return null;
	}

	return (
		<div className="space-y-2">
			<h4 className="font-medium text-sm">Features</h4>
			<div className="flex flex-wrap gap-1">
				{features.map((feature) => (
					<Badge className="text-xs" key={feature} variant="secondary">
						{feature}
					</Badge>
				))}
			</div>
		</div>
	);
}
