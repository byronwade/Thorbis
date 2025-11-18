"use client";

import { Grid3x3, Plug, Search, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { integrations } from "@/lib/data/integrations";
import { cn } from "@/lib/utils";

export function IntegrationsDropdown() {
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const filteredIntegrations = integrations.filter(
		(integration) =>
			integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			integration.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const connectedIntegrations = filteredIntegrations.filter(
		(integration) => integration.isConnected,
	);
	const availableIntegrations = filteredIntegrations.filter(
		(integration) => !integration.isConnected,
	);

	// Prevent SSR hydration mismatch with Radix UI IDs
	if (!mounted) {
		return (
			<button
				aria-label="Integrations"
				className="hover-gradient group/integrations extend-touch-target hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 inline-flex size-8 shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				data-slot="button"
				title="Integrations"
				type="button"
			>
				<Grid3x3 className="size-4.5" />
				<span className="sr-only">Integrations</span>
			</button>
		);
	}

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<button
					aria-label="Integrations"
					className="hover-gradient group/integrations extend-touch-target hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 inline-flex size-8 shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					data-slot="button"
					title="Integrations"
					type="button"
				>
					{/* Google Apps style grid icon */}
					<Grid3x3 className="size-4.5" />
					<span className="sr-only">Integrations</span>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-[400px] p-0" sideOffset={8}>
				{/* Header with search */}
				<div className="border-b p-3">
					<div className="relative">
						<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
						<Input
							className="h-9 pl-9 text-sm"
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search integrations..."
							value={searchQuery}
						/>
					</div>
				</div>

				{/* Scrollable grid container */}
				<div className="max-h-[400px] overflow-y-auto p-4">
					{/* Connected Integrations */}
					{connectedIntegrations.length > 0 && (
						<div className="mb-4">
							<h3 className="text-muted-foreground mb-3 px-1 text-xs font-medium tracking-wider uppercase">
								Connected ({connectedIntegrations.length})
							</h3>
							<div className="grid grid-cols-3 gap-2">
								{connectedIntegrations.map((integration) => (
									<button
										className="group hover:border-border hover:bg-accent/50 relative flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 transition-all"
										key={integration.id}
										type="button"
									>
										{/* Status indicator */}
										<div className="absolute top-1 right-1">
											<div className="bg-success ring-background size-2 rounded-full ring-2" />
										</div>

										{/* Icon */}
										<Avatar className="size-12 rounded-lg">
											<AvatarImage src={integration.icon} />
											<AvatarFallback
												className={cn(
													"rounded-lg text-sm font-semibold text-white",
													integration.color,
												)}
											>
												{integration.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>

										{/* Name */}
										<span className="line-clamp-1 text-center text-xs font-medium">
											{integration.name}
										</span>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Available Integrations */}
					{availableIntegrations.length > 0 && (
						<div>
							{connectedIntegrations.length > 0 && (
								<div className="bg-border mb-4 h-px" />
							)}
							<h3 className="text-muted-foreground mb-3 px-1 text-xs font-medium tracking-wider uppercase">
								Available ({availableIntegrations.length})
							</h3>
							<div className="grid grid-cols-3 gap-2">
								{availableIntegrations.map((integration) => (
									<button
										className="group hover:border-border hover:bg-accent/50 relative flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 transition-all"
										key={integration.id}
										type="button"
									>
										{/* Icon */}
										<Avatar className="size-12 rounded-lg opacity-60 transition-opacity group-hover:opacity-100">
											<AvatarImage src={integration.icon} />
											<AvatarFallback
												className={cn(
													"rounded-lg text-sm font-semibold text-white",
													integration.color,
												)}
											>
												{integration.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>

										{/* Name */}
										<span className="line-clamp-1 text-center text-xs font-medium opacity-60 transition-opacity group-hover:opacity-100">
											{integration.name}
										</span>

										{/* Hover overlay */}
										<div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
											<Plug className="text-muted-foreground size-5" />
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					{/* No results */}
					{filteredIntegrations.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Zap className="text-muted-foreground/50 mb-3 size-10" />
							<p className="text-muted-foreground text-sm">
								No integrations found
							</p>
						</div>
					)}
				</div>

				{/* Footer - Manage integrations */}
				<div className="border-t p-2">
					<Link href="/dashboard/settings/integrations">
						<Button
							className="w-full justify-start gap-2"
							onClick={() => setOpen(false)}
							size="sm"
							variant="ghost"
						>
							<Settings className="size-4" />
							Manage integrations
						</Button>
					</Link>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
