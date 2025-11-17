"use client";

/**
 * Customer Detail Toolbar - AppToolbar Actions
 *
 * Displays in AppToolbar for customer detail pages:
 * - Edit mode toggle button
 * - Quick actions (New Job, New Invoice)
 * - Ellipsis menu with archive
 */

import {
	Archive,
	Briefcase,
	Download,
	Edit3,
	Eye,
	FileText,
	Mail,
	MoreVertical,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CustomerDetailToolbar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const isEditMode = searchParams?.get("mode") === "edit";

	const toggleEditMode = () => {
		const params = new URLSearchParams(searchParams?.toString());
		if (isEditMode) {
			params.delete("mode");
		} else {
			params.set("mode", "edit");
		}
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const customerId = pathname?.split("/").pop();

	return (
		<div className="flex items-center gap-2">
			{/* Edit/View Mode Toggle */}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={toggleEditMode} size="sm" variant="outline">
							{isEditMode ? (
								<>
									<Eye />
									<span className="hidden md:inline">View</span>
								</>
							) : (
								<>
									<Edit3 />
									<span className="hidden md:inline">Edit</span>
								</>
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{isEditMode ? "Switch to view mode" : "Switch to edit mode"}</p>
					</TooltipContent>
				</Tooltip>

				{/* Quick Actions - Only show in view mode */}
				{!isEditMode && (
					<>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button asChild size="sm" variant="outline">
									<a href={`/dashboard/work/new?customerId=${customerId}`}>
										<Briefcase />
										<span className="hidden md:inline">Job</span>
									</a>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Create new job for this customer</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button asChild size="sm" variant="outline">
									<a href={`/dashboard/work/invoices/new?customerId=${customerId}`}>
										<FileText />
										<span className="hidden lg:inline">Invoice</span>
									</a>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Create new invoice for this customer</p>
							</TooltipContent>
						</Tooltip>
					</>
				)}
			</TooltipProvider>

			{/* Ellipsis Menu - Includes Archive */}
			<Separator className="h-8" orientation="vertical" />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon-sm" suppressHydrationWarning variant="outline">
						<MoreVertical />
						<span className="sr-only">More actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
						Actions
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Mail className="mr-2 size-3.5" />
						Send Email
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Download className="mr-2 size-3.5" />
						Export Customer Data
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive focus:text-destructive">
						<Archive className="mr-2 size-3.5" />
						Archive Customer
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
