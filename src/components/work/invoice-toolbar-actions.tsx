"use client";

/**
 * Invoice Toolbar Actions - Client Component
 *
 * Provides invoice-specific toolbar actions used in AppToolbar:
 * - Preview, PDF, Send
 * - Ellipsis menu with export/archive
 *
 * Design: Clean, compact, no button groups, outline variant
 */

import { Download, Eye, Mail } from "lucide-react";
import { useState } from "react";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function InvoiceToolbarActions() {
	const [_isSaving, setIsSaving] = useState(false);

	const _handleSave = async () => {
		setIsSaving(true);
		// TODO: Implement save logic
		setTimeout(() => {
			setIsSaving(false);
		}, 1000);
	};

	const handleExportPDF = () => {};

	const handleSendEmail = () => {};

	const handlePreview = () => {};

	return (
		<div className="flex items-center gap-1.5">
			{/* Quick Actions - Individual Buttons, NO Groups */}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button className="h-8 gap-1.5" onClick={handlePreview} size="sm" variant="outline">
							<Eye className="size-3.5" />
							<span className="hidden md:inline">Preview</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Preview invoice</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button className="h-8 gap-1.5" onClick={handleExportPDF} size="sm" variant="outline">
							<Download className="size-3.5" />
							<span className="hidden lg:inline">PDF</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Export to PDF</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button className="h-8 gap-1.5" onClick={handleSendEmail} size="sm" variant="outline">
							<Mail className="size-3.5" />
							<span className="hidden lg:inline">Send</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Send via email</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{/* Ellipsis Menu - Export/Import & Archive */}
			<Separator className="h-6" orientation="vertical" />
			<ImportExportDropdown dataType="invoices" />
		</div>
	);
}
