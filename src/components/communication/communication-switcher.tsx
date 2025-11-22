"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Mail,
    MessageSquare,
    Phone,
    Ticket,
    Users,
    ChevronDown,
    Check,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function CommunicationSwitcher() {
	const pathname = usePathname();

	const channels = [
		{
			name: "Email",
			url: "/dashboard/communication/email?folder=inbox",
			icon: Mail,
			isActive: 
				pathname === "/dashboard/communication" || // Legacy support
				pathname?.startsWith("/dashboard/communication/email"),
		},
		{
			name: "SMS",
			url: "/dashboard/communication/sms",
			icon: MessageSquare,
			isActive: pathname?.startsWith("/dashboard/communication/sms"),
		},
		{
			name: "Teams",
			url: "/dashboard/communication/teams?channel=general",
			icon: Users,
			isActive: pathname?.startsWith("/dashboard/communication/teams"),
		},
		{
			name: "Tickets",
			url: "/dashboard/communication/tickets",
			icon: Ticket,
			isActive: pathname?.startsWith("/dashboard/communication/tickets"),
		},
	];

	const activeChannel = channels.find((c) => c.isActive) || channels[0];

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"w-full justify-between h-9 px-3 rounded-lg",
							"bg-sidebar-primary/10 hover:bg-sidebar-primary/20",
							"border border-sidebar-primary/20 hover:border-sidebar-primary/30",
							"text-sidebar-foreground hover:text-sidebar-accent-foreground",
							"font-semibold text-sm",
							"shadow-sm hover:shadow-md",
							"transition-all duration-200"
						)}
					>
						<div className="flex items-center gap-2.5">
							<div className="flex size-5 items-center justify-center">
								<activeChannel.icon className="size-4 text-sidebar-primary" />
							</div>
							<span className="truncate">
								{activeChannel.name}
							</span>
						</div>
						<ChevronDown className="size-3 opacity-60" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-[var(--radix-dropdown-menu-trigger-width)] shadow-lg border-border/50"
					align="start"
					side="bottom"
					sideOffset={6}
				>
					{channels.map((channel) => (
						<DropdownMenuItem
							key={channel.name}
							asChild
							className={cn(
								"gap-3 cursor-pointer px-3 py-2.5",
								"hover:bg-accent/80 focus:bg-accent/80",
								channel.isActive && "bg-accent font-medium"
							)}
						>
							<Link href={channel.url}>
								<div className={cn(
									"flex size-5 items-center justify-center rounded",
									channel.isActive ? "text-primary" : "text-muted-foreground"
								)}>
									<channel.icon className="size-4" />
								</div>
								<span className="text-sm">{channel.name}</span>
								{channel.isActive && (
									<Check className="size-3 ml-auto text-primary" />
								)}
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
