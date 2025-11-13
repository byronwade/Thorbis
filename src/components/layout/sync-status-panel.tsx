/**
 * Sync Status Panel - Detailed view of sync operations
 *
 * Features:
 * - Real-time progress for each operation
 * - Offline queue management
 * - Operation history
 * - Retry failed operations
 */

"use client";

import { useSyncStore } from "@/lib/stores/sync-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  CloudOff,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function SyncStatusPanel() {
  const isPanelOpen = useSyncStore((state) => state.isPanelOpen);
  const closePanel = useSyncStore((state) => state.closePanel);
  const operations = useSyncStore((state) => state.operations);
  const offlineQueue = useSyncStore((state) => state.offlineQueue);
  const isOnline = useSyncStore((state) => state.isOnline);
  const clearCompleted = useSyncStore((state) => state.clearCompleted);
  const removeOperation = useSyncStore((state) => state.removeOperation);

  const activeOps = operations.filter((op) => op.status === "in_progress");
  const completedOps = operations.filter(
    (op) => op.status === "completed" || op.status === "failed"
  );

  return (
    <Sheet open={isPanelOpen} onOpenChange={closePanel}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Sync Status
            {!isOnline && (
              <Badge variant="destructive" className="gap-1">
                <CloudOff className="h-3 w-3" />
                Offline
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Real-time tracking of sync operations and offline queue
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-6 py-4">
            {/* Active Operations */}
            {activeOps.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Active Operations</h3>
                  <Badge variant="secondary">{activeOps.length}</Badge>
                </div>

                {activeOps.map((operation) => (
                  <div
                    key={operation.id}
                    className="space-y-2 rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <p className="font-medium text-sm">{operation.title}</p>
                        </div>
                        {operation.description && (
                          <p className="text-muted-foreground text-xs">
                            {operation.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <Progress value={operation.progress} className="h-2" />

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {operation.current && operation.total
                          ? `${operation.current} of ${operation.total}`
                          : `${operation.progress}%`}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(operation.startedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Offline Queue */}
            {offlineQueue.length > 0 && (
              <>
                {activeOps.length > 0 && <Separator />}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Offline Queue</h3>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      {offlineQueue.length}
                    </Badge>
                  </div>

                  {offlineQueue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg border p-3"
                    >
                      <div className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-amber-600" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{item.action}</p>
                          <p className="text-muted-foreground text-xs">
                            Queued{" "}
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <p className="text-muted-foreground text-xs">
                    These operations will sync when you're back online
                  </p>
                </div>
              </>
            )}

            {/* Completed Operations */}
            {completedOps.length > 0 && (
              <>
                {(activeOps.length > 0 || offlineQueue.length > 0) && <Separator />}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Recent</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCompleted}
                      className="h-7 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>

                  {completedOps.map((operation) => (
                    <div
                      key={operation.id}
                      className="flex items-start justify-between gap-2 rounded-lg border p-3"
                    >
                      <div className="flex items-start gap-2">
                        {operation.status === "completed" ? (
                          <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 text-red-600" />
                        )}
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{operation.title}</p>
                          {operation.error && (
                            <p className="text-xs text-red-600">{operation.error}</p>
                          )}
                          <p className="text-muted-foreground text-xs">
                            {formatDistanceToNow(
                              new Date(operation.completedAt || operation.startedAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOperation(operation.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {activeOps.length === 0 &&
              completedOps.length === 0 &&
              offlineQueue.length === 0 && (
                <div className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">All caught up!</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    No active sync operations
                  </p>
                </div>
              )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

