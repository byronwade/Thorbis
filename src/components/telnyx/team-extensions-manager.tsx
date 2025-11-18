"use client";

/**
 * Team Extensions Manager - Advanced extension assignment and management
 *
 * Features:
 * - Assign unique extension numbers to team members
 * - Configure direct inward dial (DID) numbers
 * - Set up call forwarding and simultaneous ring
 * - Manage vacation mode and do-not-disturb settings
 * - Configure personal voicemail settings
 * - Real-time availability status
 */

import {
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
	Loader2,
	Phone,
	PhoneForwarded,
	PhoneOff,
	Save,
	Search,
	Voicemail,
	XCircle,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
	getTeamExtensions,
	setVacationMode,
	updateTeamMemberExtension,
} from "@/actions/voip";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type TeamMember = {
	id: string;
	full_name: string;
	email: string;
	role: string;
	phone_extension: string | null;
	direct_inward_dial: string | null;
	extension_enabled: boolean;
	voicemail_pin: string | null;
	call_forwarding_enabled: boolean;
	call_forwarding_number: string | null;
	simultaneous_ring_enabled: boolean;
	ring_timeout_seconds: number;
	availability: {
		status: string;
		can_receive_calls: boolean;
		vacation_mode_enabled: boolean;
		vacation_start_date: string | null;
		vacation_end_date: string | null;
		vacation_message: string | null;
		do_not_disturb_until: string | null;
	} | null;
};

export function TeamExtensionsManager() {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isVacationDialogOpen, setIsVacationDialogOpen] = useState(false);

	// Form state for editing
	const [extensionForm, setExtensionForm] = useState({
		phone_extension: "",
		direct_inward_dial: "",
		extension_enabled: true,
		voicemail_pin: "",
		call_forwarding_enabled: false,
		call_forwarding_number: "",
		simultaneous_ring_enabled: false,
		ring_timeout_seconds: 30,
	});

	// Vacation mode form state
	const [vacationForm, setVacationForm] = useState({
		vacation_mode_enabled: false,
		vacation_start_date: "",
		vacation_end_date: "",
		vacation_message: "",
	});

	useEffect(() => {
		loadTeamExtensions();
	}, [loadTeamExtensions]);

	async function loadTeamExtensions() {
		setIsLoading(true);
		try {
			const result = await getTeamExtensions();
			if (result.success && result.data) {
				setTeamMembers(result.data);
			} else {
				toast.error(result.error || "Failed to load team extensions");
			}
		} catch (_error) {
			toast.error("Failed to load team extensions");
		} finally {
			setIsLoading(false);
		}
	}

	function openEditDialog(member: TeamMember) {
		setSelectedMember(member);
		setExtensionForm({
			phone_extension: member.phone_extension || "",
			direct_inward_dial: member.direct_inward_dial || "",
			extension_enabled: member.extension_enabled,
			voicemail_pin: member.voicemail_pin || "",
			call_forwarding_enabled: member.call_forwarding_enabled,
			call_forwarding_number: member.call_forwarding_number || "",
			simultaneous_ring_enabled: member.simultaneous_ring_enabled,
			ring_timeout_seconds: member.ring_timeout_seconds || 30,
		});
		setIsEditDialogOpen(true);
	}

	function openVacationDialog(member: TeamMember) {
		setSelectedMember(member);
		setVacationForm({
			vacation_mode_enabled:
				member.availability?.vacation_mode_enabled ?? false,
			vacation_start_date: member.availability?.vacation_start_date || "",
			vacation_end_date: member.availability?.vacation_end_date || "",
			vacation_message: member.availability?.vacation_message || "",
		});
		setIsVacationDialogOpen(true);
	}

	function handleSaveExtension() {
		if (!selectedMember) {
			return;
		}

		startTransition(async () => {
			const result = await updateTeamMemberExtension(
				selectedMember.id,
				extensionForm,
			);

			if (result.success) {
				toast.success("Extension settings saved successfully");
				setIsEditDialogOpen(false);
				loadTeamExtensions();
			} else {
				toast.error(result.error || "Failed to save extension settings");
			}
		});
	}

	function handleSaveVacation() {
		if (!selectedMember) {
			return;
		}

		startTransition(async () => {
			const result = await setVacationMode(selectedMember.id, vacationForm);

			if (result.success) {
				toast.success("Vacation mode saved successfully");
				setIsVacationDialogOpen(false);
				loadTeamExtensions();
			} else {
				toast.error(result.error || "Failed to save vacation mode");
			}
		});
	}

	const filteredMembers = teamMembers.filter(
		(member) =>
			member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.phone_extension?.includes(searchTerm),
	);

	const getStatusBadge = (member: TeamMember) => {
		if (member.availability?.vacation_mode_enabled) {
			return (
				<Badge className="gap-1" variant="secondary">
					<Calendar className="size-3" />
					Vacation
				</Badge>
			);
		}
		if (member.availability?.do_not_disturb_until) {
			return (
				<Badge className="gap-1" variant="secondary">
					<PhoneOff className="size-3" />
					DND
				</Badge>
			);
		}
		if (!member.availability?.can_receive_calls) {
			return (
				<Badge className="gap-1" variant="destructive">
					<XCircle className="size-3" />
					Unavailable
				</Badge>
			);
		}
		switch (member.availability?.status) {
			case "available":
				return (
					<Badge className="gap-1" variant="default">
						<CheckCircle2 className="size-3" />
						Available
					</Badge>
				);
			case "busy":
				return (
					<Badge className="gap-1" variant="secondary">
						<Clock className="size-3" />
						Busy
					</Badge>
				);
			case "away":
				return (
					<Badge className="gap-1" variant="secondary">
						<PhoneOff className="size-3" />
						Away
					</Badge>
				);
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
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
							<CardTitle>Team Extensions</CardTitle>
							<CardDescription>
								Assign and manage phone extensions for team members
							</CardDescription>
						</div>
						<div className="relative w-full sm:w-72">
							<Search className="text-muted-foreground absolute top-3 left-3 size-4" />
							<Input
								className="pl-9"
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search team members..."
								value={searchTerm}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Extension</TableHead>
									<TableHead>Direct Dial</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Call Features</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredMembers.length === 0 ? (
									<TableRow>
										<TableCell className="h-24 text-center" colSpan={6}>
											No team members found.
										</TableCell>
									</TableRow>
								) : (
									filteredMembers.map((member) => (
										<TableRow key={member.id}>
											<TableCell>
												<div>
													<div className="font-medium">{member.full_name}</div>
													<div className="text-muted-foreground text-xs">
														{member.email}
													</div>
												</div>
											</TableCell>
											<TableCell>
												{member.phone_extension ? (
													<Badge className="gap-1" variant="outline">
														<Phone className="size-3" />
														{member.phone_extension}
													</Badge>
												) : (
													<span className="text-muted-foreground text-sm">
														Not assigned
													</span>
												)}
											</TableCell>
											<TableCell>
												{member.direct_inward_dial || (
													<span className="text-muted-foreground text-sm">
														—
													</span>
												)}
											</TableCell>
											<TableCell>{getStatusBadge(member)}</TableCell>
											<TableCell>
												<div className="flex gap-2">
													{member.call_forwarding_enabled && (
														<Badge className="gap-1" variant="secondary">
															<PhoneForwarded className="size-3" />
															Forwarding
														</Badge>
													)}
													{member.voicemail_pin && (
														<Badge className="gap-1" variant="secondary">
															<Voicemail className="size-3" />
															VM
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														onClick={() => openVacationDialog(member)}
														size="sm"
														variant="outline"
													>
														<Calendar className="mr-2 size-4" />
														Vacation
													</Button>
													<Button
														onClick={() => openEditDialog(member)}
														size="sm"
														variant="outline"
													>
														<Edit className="mr-2 size-4" />
														Edit
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

			{/* Edit Extension Dialog */}
			<Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Extension Settings</DialogTitle>
						<DialogDescription>
							Configure phone extension and call settings for{" "}
							{selectedMember?.full_name}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<Label htmlFor="extension">Phone Extension *</Label>
								<Input
									id="extension"
									maxLength={10}
									onChange={(e) =>
										setExtensionForm({
											...extensionForm,
											phone_extension: e.target.value,
										})
									}
									placeholder="101"
									value={extensionForm.phone_extension}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									3-4 digit extension number
								</p>
							</div>

							<div>
								<Label htmlFor="did">Direct Inward Dial</Label>
								<Input
									id="did"
									onChange={(e) =>
										setExtensionForm({
											...extensionForm,
											direct_inward_dial: e.target.value,
										})
									}
									placeholder="+1 (555) 123-4567"
									value={extensionForm.direct_inward_dial}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									Direct phone number (optional)
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<Label>Extension Enabled</Label>
								<p className="text-muted-foreground text-xs">
									Allow this extension to receive calls
								</p>
							</div>
							<Switch
								checked={extensionForm.extension_enabled}
								onCheckedChange={(checked) =>
									setExtensionForm({
										...extensionForm,
										extension_enabled: checked,
									})
								}
							/>
						</div>

						<Separator />

						<div>
							<Label htmlFor="vmpin">Voicemail PIN</Label>
							<Input
								id="vmpin"
								maxLength={6}
								onChange={(e) =>
									setExtensionForm({
										...extensionForm,
										voicemail_pin: e.target.value,
									})
								}
								placeholder="6-digit PIN"
								type="password"
								value={extensionForm.voicemail_pin}
							/>
							<p className="text-muted-foreground mt-1 text-xs">
								PIN to access voicemail remotely
							</p>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<Label>Call Forwarding</Label>
									<p className="text-muted-foreground text-xs">
										Forward calls to another number
									</p>
								</div>
								<Switch
									checked={extensionForm.call_forwarding_enabled}
									onCheckedChange={(checked) =>
										setExtensionForm({
											...extensionForm,
											call_forwarding_enabled: checked,
										})
									}
								/>
							</div>

							{extensionForm.call_forwarding_enabled && (
								<div>
									<Label htmlFor="forward">Forward To Number</Label>
									<Input
										id="forward"
										onChange={(e) =>
											setExtensionForm({
												...extensionForm,
												call_forwarding_number: e.target.value,
											})
										}
										placeholder="+1 (555) 987-6543"
										type="tel"
										value={extensionForm.call_forwarding_number}
									/>
								</div>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div>
								<Label>Simultaneous Ring</Label>
								<p className="text-muted-foreground text-xs">
									Ring extension and forward number simultaneously
								</p>
							</div>
							<Switch
								checked={extensionForm.simultaneous_ring_enabled}
								onCheckedChange={(checked) =>
									setExtensionForm({
										...extensionForm,
										simultaneous_ring_enabled: checked,
									})
								}
							/>
						</div>

						<div>
							<Label htmlFor="timeout">Ring Timeout (seconds)</Label>
							<Select
								onValueChange={(value) =>
									setExtensionForm({
										...extensionForm,
										ring_timeout_seconds: Number.parseInt(value, 10),
									})
								}
								value={extensionForm.ring_timeout_seconds.toString()}
							>
								<SelectTrigger id="timeout">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="15">15 seconds</SelectItem>
									<SelectItem value="30">30 seconds</SelectItem>
									<SelectItem value="45">45 seconds</SelectItem>
									<SelectItem value="60">60 seconds</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-muted-foreground mt-1 text-xs">
								Time to ring before forwarding to voicemail
							</p>
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
						<Button disabled={isPending} onClick={handleSaveExtension}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 size-4" />
									Save Settings
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Vacation Mode Dialog */}
			<Dialog
				onOpenChange={setIsVacationDialogOpen}
				open={isVacationDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Vacation Mode Settings</DialogTitle>
						<DialogDescription>
							Configure out-of-office settings for {selectedMember?.full_name}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<Label>Enable Vacation Mode</Label>
								<p className="text-muted-foreground text-xs">
									Stop receiving calls during vacation
								</p>
							</div>
							<Switch
								checked={vacationForm.vacation_mode_enabled}
								onCheckedChange={(checked) =>
									setVacationForm({
										...vacationForm,
										vacation_mode_enabled: checked,
									})
								}
							/>
						</div>

						{vacationForm.vacation_mode_enabled && (
							<>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<Label htmlFor="start">Start Date</Label>
										<Input
											id="start"
											onChange={(e) =>
												setVacationForm({
													...vacationForm,
													vacation_start_date: e.target.value,
												})
											}
											type="date"
											value={vacationForm.vacation_start_date}
										/>
									</div>

									<div>
										<Label htmlFor="end">End Date</Label>
										<Input
											id="end"
											onChange={(e) =>
												setVacationForm({
													...vacationForm,
													vacation_end_date: e.target.value,
												})
											}
											type="date"
											value={vacationForm.vacation_end_date}
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="message">Vacation Message</Label>
									<Textarea
										id="message"
										onChange={(e) =>
											setVacationForm({
												...vacationForm,
												vacation_message: e.target.value,
											})
										}
										placeholder="I'm currently out of office and will return on..."
										rows={3}
										value={vacationForm.vacation_message}
									/>
									<p className="text-muted-foreground mt-1 text-xs">
										This message will be played to callers
									</p>
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button
							disabled={isPending}
							onClick={() => setIsVacationDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isPending} onClick={handleSaveVacation}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 size-4" />
									Save Vacation Mode
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
