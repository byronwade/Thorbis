"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Mail,
	MessageSquare,
	Users,
	ChevronDown,
	LayoutDashboard,
	Check,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Channel = {
	name: string;
	url: string;
	icon: React.ElementType;
};

export function CommunicationSwitcher() {
	const pathname = usePathname();

	const channels: Channel[] = [
		{
			name: "Dashboard",
			url: "/dashboard/communication",
			icon: LayoutDashboard,
		},
		{
			name: "Email",
			url: "/dashboard/communication/email?folder=inbox",
			icon: Mail,
		},
		{
			name: "SMS",
			url: "/dashboard/communication/sms",
			icon: MessageSquare,
		},
		{
			name: "Teams",
			url: "/dashboard/communication/teams?channel=general",
			icon: Users,
		},
	];

	const getIsActive = (url: string) => {
		if (url === "/dashboard/communication") {
			return pathname === "/dashboard/communication";
		}
		const basePath = url.split("?")[0];
		return pathname?.startsWith(basePath) ?? false;
	};

	const activeChannel = channels.find((c) => getIsActive(c.url)) || channels[0];
	const ActiveIcon = activeChannel.icon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"w-full justify-between h-8 px-2.5 rounded-md",
						"border border-sidebar-border",
						"bg-sidebar-accent/30 hover:bg-sidebar-accent/50",
						"text-sidebar-foreground",
						"font-medium text-sm",
						"transition-colors",
						"group"
					)}
				>
					<div className="flex items-center gap-2">
						<ActiveIcon className="size-4 text-sidebar-foreground/70" />
						<span className="truncate">{activeChannel.name}</span>
					</div>
					<ChevronDown className="size-3.5 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[200px] p-1"
				align="start"
				side="bottom"
				sideOffset={4}
			>
				{/* Dashboard */}
				<DropdownMenuItem asChild className="p-0">
					<Link
						href={channels[0].url}
						className={cn(
							"flex items-center gap-2.5 px-2 py-1.5 rounded-sm cursor-pointer",
							"text-sm transition-colors",
							getIsActive(channels[0].url)
								? "bg-accent font-medium"
								: "hover:bg-muted/80"
						)}
					>
						<LayoutDashboard className="size-4 text-muted-foreground" />
						<span className="flex-1">Dashboard</span>
						{getIsActive(channels[0].url) && (
							<Check className="size-3.5 text-foreground/70" />
						)}
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="my-1" />

				{/* Channels */}
				<div className="space-y-0.5">
					{channels.slice(1).map((channel) => {
						const isActive = getIsActive(channel.url);
						const Icon = channel.icon;
						return (
							<DropdownMenuItem key={channel.name} asChild className="p-0">
								<Link
									href={channel.url}
									className={cn(
										"flex items-center gap-2.5 px-2 py-1.5 rounded-sm cursor-pointer",
										"text-sm transition-colors",
										isActive
											? "bg-accent font-medium"
											: "hover:bg-muted/80"
									)}
								>
									<Icon className="size-4 text-muted-foreground" />
									<span className="flex-1">{channel.name}</span>
									{isActive && (
										<Check className="size-3.5 text-foreground/70" />
									)}
								</Link>
							</DropdownMenuItem>
						);
					})}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
