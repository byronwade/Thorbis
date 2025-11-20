/**
 * NumberPortingWizard - Lazy Loaded Wrapper
 *
 * Performance optimization:
 * - Dynamically imports the full 1101-line number porting wizard (~30KB)
 * - Only loads when user clicks "Port Number" button
 * - Shows loading dialog while importing
 * - Reduces initial phone numbers page bundle significantly
 */

"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const NumberPortingWizard = dynamic(
	() =>
		import("./number-porting-wizard").then((mod) => ({
			default: mod.NumberPortingWizard,
		})),
	{
		loading: () => (
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Loading Port Number Wizard...</DialogTitle>
						<DialogDescription>
							<div className="flex items-center justify-center py-8">
								<Loader2 className="text-muted-foreground size-8 animate-spin" />
							</div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		),
		ssr: false, // Wizard requires browser environment
	},
);

type NumberPortingWizardLazyProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: (phoneNumber: string) => void;
};

export function NumberPortingWizardLazy({
	open,
	onOpenChange,
	onSuccess,
}: NumberPortingWizardLazyProps) {
	// Only render the dynamic component when the modal should be open
	if (!open) return null;

	return (
		<NumberPortingWizard
			open={open}
			onOpenChange={onOpenChange}
			onSuccess={onSuccess}
		/>
	);
}
