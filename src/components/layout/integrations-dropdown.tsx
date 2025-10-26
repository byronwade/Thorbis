"use client";

import { Grid3x3, Plug, Search, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedIntegrations = filteredIntegrations.filter(
    (integration) => integration.isConnected
  );
  const availableIntegrations = filteredIntegrations.filter(
    (integration) => !integration.isConnected
  );

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Integrations"
          className="hover-gradient group/integrations extend-touch-target inline-flex size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
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
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
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
              <h3 className="mb-3 px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Connected ({connectedIntegrations.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {connectedIntegrations.map((integration) => (
                  <button
                    className="group relative flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50"
                    key={integration.id}
                    type="button"
                  >
                    {/* Status indicator */}
                    <div className="absolute top-1 right-1">
                      <div className="size-2 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>

                    {/* Icon */}
                    <Avatar className="size-12 rounded-lg">
                      <AvatarImage src={integration.icon} />
                      <AvatarFallback
                        className={cn(
                          "rounded-lg font-semibold text-sm text-white",
                          integration.color
                        )}
                      >
                        {integration.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <span className="line-clamp-1 text-center font-medium text-xs">
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
                <div className="mb-4 h-px bg-border" />
              )}
              <h3 className="mb-3 px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Available ({availableIntegrations.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableIntegrations.map((integration) => (
                  <button
                    className="group relative flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50"
                    key={integration.id}
                    type="button"
                  >
                    {/* Icon */}
                    <Avatar className="size-12 rounded-lg opacity-60 transition-opacity group-hover:opacity-100">
                      <AvatarImage src={integration.icon} />
                      <AvatarFallback
                        className={cn(
                          "rounded-lg font-semibold text-sm text-white",
                          integration.color
                        )}
                      >
                        {integration.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <span className="line-clamp-1 text-center font-medium text-xs opacity-60 transition-opacity group-hover:opacity-100">
                      {integration.name}
                    </span>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                      <Plug className="size-5 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredIntegrations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Zap className="mb-3 size-10 text-muted-foreground/50" />
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
