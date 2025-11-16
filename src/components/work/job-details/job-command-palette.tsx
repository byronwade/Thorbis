/**
 * Job Command Palette - Quick Actions (Cmd+K)
 *
 * Features:
 * - Quick navigation between tabs
 * - Common job actions
 * - Search functionality
 * - Keyboard shortcuts
 *
 * Performance:
 * - Client Component for interactivity
 * - Lazy loaded when opened
 * - Keyboard-first navigation
 */

"use client";

import {
	Activity,
	Building2,
	Calendar,
	Camera,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	Mail,
	MapPin,
	MessageSquare,
	Package,
	Pen,
	Phone,
	Save,
	Upload,
	Users,
	Wrench,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	type JobTab,
	useIsCommandPaletteOpen,
	useJobEditorStore,
	useSetActiveTab,
} from "@/lib/stores/job-editor-store";

type JobCommandPaletteProps = {
	jobId: string;
	customer?: any;
};

export function JobCommandPalette({ jobId, customer }: JobCommandPaletteProps) {
	const isOpen = useIsCommandPaletteOpen();
	const setActiveTab = useSetActiveTab();
	const { setCommandPaletteOpen } = useJobEditorStore();

	// Keyboard shortcut: Cmd+K or Ctrl+K
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setCommandPaletteOpen(!isOpen);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [isOpen, setCommandPaletteOpen]);

	// Quick action handlers
	const handleTabNavigation = useCallback(
		(tab: JobTab) => {
			setActiveTab(tab);
			setCommandPaletteOpen(false);
		},
		[setActiveTab, setCommandPaletteOpen]
	);

	const handleQuickAction = useCallback(
		(_action: string) => {
			setCommandPaletteOpen(false);
		},
		[setCommandPaletteOpen]
	);

	return (
		<CommandDialog onOpenChange={setCommandPaletteOpen} open={isOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				{/* Navigation */}
				<CommandGroup heading="Navigate to Tab">
					<CommandItem onSelect={() => handleTabNavigation("overview")}>
						<Building2 className="mr-2 h-4 w-4" />
						<span>Overview</span>
					</CommandItem>
					<CommandItem onSelect={() => handleTabNavigation("team-schedule")}>
						<Users className="mr-2 h-4 w-4" />
						<span>Team & Schedule</span>
					</CommandItem>
					<CommandItem onSelect={() => handleTabNavigation("financials")}>
						<DollarSign className="mr-2 h-4 w-4" />
						<span>Financials</span>
					</CommandItem>
					<CommandItem onSelect={() => handleTabNavigation("materials")}>
						<Package className="mr-2 h-4 w-4" />
						<span>Materials</span>
					</CommandItem>
					<CommandItem onSelect={() => handleTabNavigation("photos-docs")}>
						<Camera className="mr-2 h-4 w-4" />
						<span>Photos & Docs</span>
					</CommandItem>
					<CommandItem onSelect={() => handleTabNavigation("activity")}>
						<Activity className="mr-2 h-4 w-4" />
						<span>Activity</span>
					</CommandItem>
					<CommandItem onSelect={() => handleTabNavigation("equipment")}>
						<Wrench className="mr-2 h-4 w-4" />
						<span>Equipment</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				{/* Customer Actions */}
				{customer && (
					<CommandGroup heading="Customer Actions">
						<CommandItem onSelect={() => handleQuickAction(`call:${customer.phone}`)}>
							<Phone className="mr-2 h-4 w-4" />
							<span>Call {customer.first_name}</span>
						</CommandItem>
						<CommandItem onSelect={() => handleQuickAction(`email:${customer.email}`)}>
							<Mail className="mr-2 h-4 w-4" />
							<span>Email {customer.first_name}</span>
						</CommandItem>
						<CommandItem onSelect={() => handleQuickAction(`sms:${customer.phone}`)}>
							<MessageSquare className="mr-2 h-4 w-4" />
							<span>Send SMS</span>
						</CommandItem>
					</CommandGroup>
				)}

				<CommandSeparator />

				{/* Job Actions */}
				<CommandGroup heading="Job Actions">
					<CommandItem onSelect={() => handleQuickAction("create-invoice")}>
						<FileText className="mr-2 h-4 w-4" />
						<span>Create Invoice</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("create-estimate")}>
						<FileText className="mr-2 h-4 w-4" />
						<span>Create Estimate</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("record-payment")}>
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Record Payment</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("clock-in")}>
						<Clock className="mr-2 h-4 w-4" />
						<span>Clock In</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("upload-photos")}>
						<Upload className="mr-2 h-4 w-4" />
						<span>Upload Photos</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("capture-signature")}>
						<Pen className="mr-2 h-4 w-4" />
						<span>Capture Signature</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("schedule")}>
						<Calendar className="mr-2 h-4 w-4" />
						<span>Reschedule Job</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("navigate")}>
						<MapPin className="mr-2 h-4 w-4" />
						<span>Navigate to Property</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				{/* Document Actions */}
				<CommandGroup heading="Documents">
					<CommandItem onSelect={() => handleQuickAction("download-invoice")}>
						<FileText className="mr-2 h-4 w-4" />
						<span>Download Invoice PDF</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("download-estimate")}>
						<FileText className="mr-2 h-4 w-4" />
						<span>Download Estimate PDF</span>
					</CommandItem>
					<CommandItem onSelect={() => handleQuickAction("export-report")}>
						<Save className="mr-2 h-4 w-4" />
						<span>Export Job Report</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
