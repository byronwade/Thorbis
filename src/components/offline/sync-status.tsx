/**
 * Sync Status Component
 *
 * Detailed view of sync queue operations with manual intervention options.
 * Shows pending, syncing, and failed operations.
 * Allows retry and clear actions for failed operations.
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllRecords, type SyncOperation } from "@/lib/offline/indexed-db";
import { useNetworkStatus } from "@/lib/offline/network-status";
import {
  clearFailedOperations,
  processSyncQueue,
  retryOperation,
} from "@/lib/offline/sync-queue";

export function SyncStatus() {
  const { isOnline, pendingOperations, isSyncing } = useNetworkStatus();
  const [operations, setOperations] = useState<SyncOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const loadOperations = async () => {
    setIsLoading(true);
    try {
      const ops = await getAllRecords<SyncOperation>("sync-queue");
      setOperations(ops.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Failed to load sync operations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOperations();
    // Refresh every 10 seconds
    const interval = setInterval(loadOperations, 10_000);
    return () => clearInterval(interval);
  }, [pendingOperations]);

  const handleRetry = async (operationId: string) => {
    setRetryingId(operationId);
    try {
      const success = await retryOperation(operationId);
      if (success) {
        await loadOperations();
      }
    } catch (error) {
      console.error("Failed to retry operation:", error);
    } finally {
      setRetryingId(null);
    }
  };

  const handleClearFailed = async () => {
    try {
      await clearFailedOperations();
      await loadOperations();
    } catch (error) {
      console.error("Failed to clear failed operations:", error);
    }
  };

  const handleSyncNow = async () => {
    try {
      await processSyncQueue();
      await loadOperations();
    } catch (error) {
      console.error("Failed to sync:", error);
    }
  };

  const failedOps = operations.filter((op) => op.retry_count >= 3);
  const pendingOps = operations.filter((op) => op.retry_count < 3);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sync Status</CardTitle>
          <CardDescription>Loading sync queue...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="size-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sync Status</CardTitle>
            <CardDescription>
              {operations.length === 0
                ? "All operations synced"
                : `${operations.length} operation${operations.length === 1 ? "" : "s"} in queue`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {failedOps.length > 0 && (
              <Button onClick={handleClearFailed} size="sm" variant="outline">
                <Trash2 className="mr-2 size-4" />
                Clear Failed
              </Button>
            )}
            {isOnline && pendingOps.length > 0 && (
              <Button disabled={isSyncing} onClick={handleSyncNow} size="sm">
                {isSyncing ? (
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 size-4" />
                )}
                Sync Now
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="mb-2 size-12 text-green-500" />
            <p className="font-medium text-sm">All Synced</p>
            <p className="text-muted-foreground text-xs">
              No pending operations in the queue
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Failed Operations */}
            {failedOps.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-red-500" />
                  <h4 className="font-semibold text-sm">
                    Failed Operations ({failedOps.length})
                  </h4>
                </div>
                {failedOps.map((op) => (
                  <OperationCard
                    key={op.id}
                    onRetry={handleRetry}
                    operation={op}
                    retrying={retryingId === op.id}
                    status="failed"
                  />
                ))}
              </div>
            )}

            {/* Pending Operations */}
            {pendingOps.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-blue-500" />
                  <h4 className="font-semibold text-sm">
                    Pending Operations ({pendingOps.length})
                  </h4>
                </div>
                {pendingOps.map((op) => (
                  <OperationCard key={op.id} operation={op} status="pending" />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface OperationCardProps {
  operation: SyncOperation;
  status: "pending" | "failed";
  onRetry?: (id: string) => void;
  retrying?: boolean;
}

function OperationCard({
  operation,
  status,
  onRetry,
  retrying,
}: OperationCardProps) {
  const getOperationColor = () => {
    switch (operation.operation) {
      case "INSERT":
        return "text-green-700 dark:text-green-400 bg-green-500/10";
      case "UPDATE":
        return "text-blue-700 dark:text-blue-400 bg-blue-500/10";
      case "DELETE":
        return "text-red-700 dark:text-red-400 bg-red-500/10";
      default:
        return "text-gray-700 dark:text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Badge className={getOperationColor()} variant="secondary">
            {operation.operation}
          </Badge>
          <span className="font-medium text-sm">{operation.table}</span>
          {operation.retry_count > 0 && (
            <span className="text-muted-foreground text-xs">
              (Retry {operation.retry_count}/3)
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          {new Date(operation.timestamp).toLocaleString()}
        </p>
        {operation.error && (
          <p className="text-red-600 text-xs dark:text-red-400">
            {operation.error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {status === "failed" && onRetry && (
          <Button
            disabled={retrying}
            onClick={() => onRetry(operation.id)}
            size="sm"
            variant="outline"
          >
            {retrying ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
