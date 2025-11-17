"use client";

/**
 * Call Routing Manager - Advanced call routing configuration
 *
 * Features:
 * - Create and manage routing rules with priority
 * - Configure routing types (direct, round-robin, IVR, etc.)
 * - Assign team members to routing rules
 * - Set ring timeout and overflow behavior
 * - Enable/disable rules dynamically
 */

import { ArrowDown, ArrowUp, Clock, Edit, Loader2, Plus, Save, Trash2, Users } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
	createRoutingRule,
	deleteRoutingRule,
	getCallRoutingRules,
	updateRoutingRule,
	updateRulePriority,
} from "@/actions/voip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type RoutingRule = {
	id: string;
	name: string;
	routing_type: string;
	priority: number;
	enabled: boolean;
	phone_number_id: string | null;
	team_members: string[];
	ring_timeout: number;
	voicemail_enabled: boolean;
	record_calls: boolean;
};

export function CallRoutingManager() {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [rules, setRules] = useState<RoutingRule[]>([]);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedRule, setSelectedRule] = useState<RoutingRule | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const [ruleForm, setRuleForm] = useState({
		name: "",
		routing_type: "round_robin",
		ring_timeout: 30,
		voicemail_enabled: true,
		record_calls: false,
		enabled: true,
	});

	useEffect(() => {
		loadRoutingRules();
	}, [loadRoutingRules]);

	async function loadRoutingRules() {
		setIsLoading(true);
		try {
			const result = await getCallRoutingRules();
			if (result.success && result.data) {
				setRules(result.data);
			} else {
				toast.error(result.error || "Failed to load routing rules");
			}
		} catch (_error) {
			toast.error("Failed to load routing rules");
		} finally {
			setIsLoading(false);
		}
	}

	function openCreateDialog() {
		setIsCreating(true);
		setSelectedRule(null);
		setRuleForm({
			name: "",
			routing_type: "round_robin",
			ring_timeout: 30,
			voicemail_enabled: true,
			record_calls: false,
			enabled: true,
		});
		setIsEditDialogOpen(true);
	}

	function openEditDialog(rule: RoutingRule) {
		setIsCreating(false);
		setSelectedRule(rule);
		setRuleForm({
			name: rule.name,
			routing_type: rule.routing_type,
			ring_timeout: rule.ring_timeout,
			voicemail_enabled: rule.voicemail_enabled,
			record_calls: rule.record_calls,
			enabled: rule.enabled,
		});
		setIsEditDialogOpen(true);
	}

	function handleSaveRule() {
		startTransition(async () => {
			let result;
			if (isCreating) {
				result = await createRoutingRule(ruleForm as any);
			} else if (selectedRule) {
				result = await updateRoutingRule(selectedRule.id, ruleForm as any);
			} else {
				return;
			}

			if (result.success) {
				toast.success(`Routing rule ${isCreating ? "created" : "updated"} successfully`);
				setIsEditDialogOpen(false);
				loadRoutingRules();
			} else {
				toast.error(result.error || "Failed to save routing rule");
			}
		});
	}

	function handleDeleteRule(ruleId: string) {
		if (!confirm("Are you sure you want to delete this routing rule?")) {
			return;
		}

		startTransition(async () => {
			const result = await deleteRoutingRule(ruleId);
			if (result.success) {
				toast.success("Routing rule deleted successfully");
				loadRoutingRules();
			} else {
				toast.error(result.error || "Failed to delete routing rule");
			}
		});
	}

	function handleMovePriority(ruleId: string, direction: "up" | "down") {
		startTransition(async () => {
			const result = await updateRulePriority(ruleId, direction);
			if (result.success) {
				loadRoutingRules();
			} else {
				toast.error("Failed to update priority");
			}
		});
	}

	const getRoutingTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			direct: "Direct",
			round_robin: "Round Robin",
			simultaneous: "Simultaneous",
			ivr: "IVR Menu",
			business_hours: "Business Hours",
			conditional: "Conditional",
		};
		return labels[type] || type;
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="text-muted-foreground size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>Call Routing Rules</CardTitle>
							<CardDescription>
								Configure how incoming calls are routed to team members
							</CardDescription>
						</div>
						<Button onClick={openCreateDialog}>
							<Plus className="mr-2 size-4" />
							Create Rule
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-16">Priority</TableHead>
									<TableHead>Rule Name</TableHead>
									<TableHead>Routing Type</TableHead>
									<TableHead>Timeout</TableHead>
									<TableHead>Features</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rules.length === 0 ? (
									<TableRow>
										<TableCell className="h-24 text-center" colSpan={7}>
											No routing rules configured. Create your first rule to get started.
										</TableCell>
									</TableRow>
								) : (
									rules.map((rule, index) => (
										<TableRow key={rule.id}>
											<TableCell>
												<div className="flex items-center gap-1">
													<span className="font-medium">{rule.priority}</span>
													<div className="flex flex-col">
														<Button
															className="h-4 w-4 p-0"
															disabled={index === 0 || isPending}
															onClick={() => handleMovePriority(rule.id, "up")}
															size="sm"
															variant="ghost"
														>
															<ArrowUp className="size-3" />
														</Button>
														<Button
															className="h-4 w-4 p-0"
															disabled={index === rules.length - 1 || isPending}
															onClick={() => handleMovePriority(rule.id, "down")}
															size="sm"
															variant="ghost"
														>
															<ArrowDown className="size-3" />
														</Button>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<div className="font-medium">{rule.name}</div>
													{rule.team_members.length > 0 && (
														<div className="text-muted-foreground flex items-center gap-1 text-xs">
															<Users className="size-3" />
															{rule.team_members.length} team member(s)
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{getRoutingTypeLabel(rule.routing_type)}</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-sm">
													<Clock className="text-muted-foreground size-3" />
													{rule.ring_timeout}s
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{rule.voicemail_enabled && (
														<Badge className="text-xs" variant="secondary">
															VM
														</Badge>
													)}
													{rule.record_calls && (
														<Badge className="text-xs" variant="secondary">
															REC
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												{rule.enabled ? (
													<Badge variant="default">Active</Badge>
												) : (
													<Badge variant="secondary">Disabled</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button onClick={() => openEditDialog(rule)} size="sm" variant="outline">
														<Edit className="mr-2 size-4" />
														Edit
													</Button>
													<Button
														disabled={isPending}
														onClick={() => handleDeleteRule(rule.id)}
														size="sm"
														variant="outline"
													>
														<Trash2 className="mr-2 size-4" />
														Delete
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Edit/Create Dialog */}
			<Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{isCreating ? "Create Routing Rule" : "Edit Routing Rule"}</DialogTitle>
						<DialogDescription>
							Configure how calls are routed to your team members
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						<div>
							<Label htmlFor="ruleName">Rule Name *</Label>
							<Input
								id="ruleName"
								onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
								placeholder="Sales Team Routing"
								value={ruleForm.name}
							/>
						</div>

						<div>
							<Label htmlFor="routingType">Routing Type</Label>
							<Select
								onValueChange={(value) => setRuleForm({ ...ruleForm, routing_type: value })}
								value={ruleForm.routing_type}
							>
								<SelectTrigger className="mt-2" id="routingType">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="direct">Direct - Route to specific agent</SelectItem>
									<SelectItem value="round_robin">Round Robin - Distribute evenly</SelectItem>
									<SelectItem value="simultaneous">Simultaneous - Ring all agents</SelectItem>
									<SelectItem value="ivr">IVR Menu - Interactive menu</SelectItem>
									<SelectItem value="business_hours">
										Business Hours - Time-based routing
									</SelectItem>
									<SelectItem value="conditional">Conditional - Rule-based routing</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="ringTimeout">Ring Timeout (seconds)</Label>
							<Select
								onValueChange={(value) =>
									setRuleForm({
										...ruleForm,
										ring_timeout: Number.parseInt(value, 10),
									})
								}
								value={ruleForm.ring_timeout.toString()}
							>
								<SelectTrigger className="mt-2" id="ringTimeout">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="15">15 seconds</SelectItem>
									<SelectItem value="30">30 seconds</SelectItem>
									<SelectItem value="45">45 seconds</SelectItem>
									<SelectItem value="60">60 seconds</SelectItem>
									<SelectItem value="90">90 seconds</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-muted-foreground mt-1 text-xs">
								Time to ring before moving to next rule or voicemail
							</p>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<Label>Voicemail Enabled</Label>
									<p className="text-muted-foreground text-xs">Allow voicemail if no one answers</p>
								</div>
								<Switch
									checked={ruleForm.voicemail_enabled}
									onCheckedChange={(checked) =>
										setRuleForm({ ...ruleForm, voicemail_enabled: checked })
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<Label>Record Calls</Label>
									<p className="text-muted-foreground text-xs">
										Automatically record calls for this rule
									</p>
								</div>
								<Switch
									checked={ruleForm.record_calls}
									onCheckedChange={(checked) => setRuleForm({ ...ruleForm, record_calls: checked })}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<Label>Rule Enabled</Label>
									<p className="text-muted-foreground text-xs">
										Enable or disable this routing rule
									</p>
								</div>
								<Switch
									checked={ruleForm.enabled}
									onCheckedChange={(checked) => setRuleForm({ ...ruleForm, enabled: checked })}
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							disabled={isPending}
							onClick={() => setIsEditDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isPending} onClick={handleSaveRule}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 size-4" />
									{isCreating ? "Create Rule" : "Save Changes"}
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
