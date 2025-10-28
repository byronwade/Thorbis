"use client";

import { Plus } from "lucide-react";
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
  function handleAddWidget(type: WidgetType) {
    const config = WIDGET_CONFIGS[type];
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      size: config.defaultSize,
      position: 0,
    };
    onAddWidget(newWidget);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="default">
          <Plus className="mr-2 size-4" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>Choose a widget to add to your TV leaderboard</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.values(WIDGET_CONFIGS).map((config) => (
              <button
                className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 text-left transition-all hover:border-primary/40 hover:shadow-lg"
                key={config.type}
                onClick={() => {
                  handleAddWidget(config.type);
                }}
                type="button"
              >
                <h4 className="font-semibold">{config.title}</h4>
                <p className="text-muted-foreground text-sm">{config.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                    {config.defaultSize}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
