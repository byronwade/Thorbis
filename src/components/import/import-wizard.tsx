"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ImportWizardProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	entityType: "customers" | "jobs" | "invoices" | "estimates" | "equipment";
	companyId: string;
	userId: string;
};

export function ImportWizard({
	open,
	onOpenChange,
	entityType,
	companyId,
	userId,
}: ImportWizardProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Import {entityType}</DialogTitle>
					<DialogDescription>
						Import wizard for {entityType} is coming soon.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p className="text-muted-foreground text-sm">
						This feature is under development.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
