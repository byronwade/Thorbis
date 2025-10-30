"use client";

import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Widget, WidgetType } from "./widget-types";
import { WIDGET_CONFIGS } from "./widget-types";

type WidgetManagerProps = {
  onAddWidget: (widget: Widget) => void;
};

export function WidgetManager({ onAddWidget }: WidgetManagerProps) {
  const [open, setOpen] = useState(false);

  function handleAddWidget(type: WidgetType) {
    const config = WIDGET_CONFIGS[type];
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      size: config.defaultSize,
      position: 0,
    };
    onAddWidget(newWidget);
    setOpen(false); // Close dialog after adding
  }

  // Group widgets by category
  const gamificationWidgets = [
    "inspirational-quote",
    "bonus-tracker",
    "prize-wheel",
    "performance-scale",
    "company-randomizer",
  ];

  const statsWidgets = [
    "leaderboard",
    "company-goals",
    "top-performer",
    "revenue-chart",
    "jobs-completed",
    "avg-ticket",
    "customer-rating",
    "daily-stats",
    "weekly-stats",
    "monthly-stats",
  ];

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="lg" variant="default">
          <Plus className="mr-2 size-4" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Widget to View</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your current TV view. Widgets will
            automatically adjust to fit the grid.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Statistics & Performance Widgets */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                  Statistics & Performance
                </h3>
                <Badge className="text-xs" variant="secondary">
                  {statsWidgets.length}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {statsWidgets.map((type) => {
                  const config = WIDGET_CONFIGS[type as WidgetType];
                  return (
                    <button
                      className="group flex flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md"
                      key={config.type}
                      onClick={() => {
                        handleAddWidget(config.type);
                      }}
                      type="button"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm transition-colors group-hover:text-primary">
                          {config.title}
                        </h4>
                        <Badge className="text-xs" variant="outline">
                          {config.defaultSize}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {config.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gamification Widgets */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                  Gamification & Engagement
                </h3>
                <Badge className="text-xs" variant="secondary">
                  {gamificationWidgets.length}
                </Badge>
                <Sparkles className="size-3.5 text-primary" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {gamificationWidgets.map((type) => {
                  const config = WIDGET_CONFIGS[type as WidgetType];
                  return (
                    <button
                      className="group flex flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md"
                      key={config.type}
                      onClick={() => {
                        handleAddWidget(config.type);
                      }}
                      type="button"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm transition-colors group-hover:text-primary">
                          {config.title}
                        </h4>
                        <Badge className="text-xs" variant="outline">
                          {config.defaultSize}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {config.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
