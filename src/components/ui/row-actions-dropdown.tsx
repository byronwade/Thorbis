/**
 * Generic Row Actions Dropdown Component
 *
 * A reusable dropdown menu for table row actions.
 * Consolidates duplicate row action patterns across table components.
 *
 * @example
 * const actions = [
 *   { label: "View", icon: Eye, href: `/items/${id}` },
 *   { label: "Edit", icon: Edit, href: `/items/${id}/edit` },
 *   { label: "Delete", icon: Trash2, onClick: handleDelete, variant: "destructive" },
 * ];
 *
 * <RowActionsDropdown actions={actions} />
 */

import { type LucideIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type RowAction = {
	/** Action label */
	label: string;
	/** Icon component from lucide-react */
	icon: LucideIcon;
	/** Optional href for Link actions */
	href?: string;
	/** Optional onClick handler (if no href) */
	onClick?: () => void | Promise<void>;
	/** Variant style (destructive actions use "destructive") */
	variant?: "default" | "destructive";
	/** Whether to show separator before this action */
	separatorBefore?: boolean;
};

type RowActionsDropdownProps = {
	/** Array of action configurations */
	actions: RowAction[];
	/** Optional label for dropdown menu (default: "Actions") */
	label?: string;
	/** Additional className for trigger button */
	className?: string;
};

/**
 * RowActionsDropdown - Generic dropdown menu for table row actions
 */
export function RowActionsDropdown({ actions, label = "Actions", className }: RowActionsDropdownProps) {
	return (
		<div data-no-row-click>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className={className} size="icon" variant="ghost">
						<MoreHorizontal className="size-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>{label}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actions.map((action, index) => {
						const ActionContent = (
							<>
								<action.icon className="mr-2 size-4" />
								{action.label}
							</>
						);

						const menuItem = action.href ? (
							<DropdownMenuItem asChild key={index}>
								<Link href={action.href}>{ActionContent}</Link>
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem
								className={action.variant === "destructive" ? "text-destructive" : undefined}
								key={index}
								onClick={action.onClick}
							>
								{ActionContent}
							</DropdownMenuItem>
						);

						return (
							<div key={index}>
								{action.separatorBefore && index > 0 && <DropdownMenuSeparator />}
								{menuItem}
							</div>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
