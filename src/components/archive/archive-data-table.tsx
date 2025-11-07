/**
 * Archive Data Table - Client Component
 *
 * Displays archived items with:
 * - Entity type filtering (tabs)
 * - Search
 * - Bulk restore
 * - Permanent delete (after 90 days)
 * - Countdown to permanent deletion
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  RotateCcw,
  Trash2,
  AlertTriangle,
  FileText,
  Briefcase,
  Users,
  Home,
  Wrench,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  FullWidthDataTable,
  type ColumnDef,
  type BulkAction,
} from "@/components/ui/full-width-datatable";
import {
  getArchivedItems,
  bulkRestore,
  type ArchivedItem,
  type ArchivableEntityType,
} from "@/actions/archive";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ArchiveDataTableProps {
  entityFilter?: string;
  dateRange?: string;
  searchQuery?: string;
}

export function ArchiveDataTable({
  entityFilter = "all",
  dateRange = "30days",
  searchQuery,
}: ArchiveDataTableProps) {
  const router = useRouter();
  const [data, setData] = useState<ArchivedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(entityFilter);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Fetch archived items
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getArchivedItems({
        entityType: selectedEntity as any,
        dateRange: dateRange as any,
        searchQuery,
        limit: 100,
        offset: 0,
      });

      if (result.success && result.data) {
        setData(result.data);
      } else {
        toast.error("Failed to load archived items");
        setData([]);
      }
    } catch (error) {
      toast.error("Failed to load archived items");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchData();
  }, [selectedEntity, dateRange, searchQuery]);

  // Get entity icon
  const getEntityIcon = (entityType: ArchivableEntityType) => {
    switch (entityType) {
      case "invoice":
      case "estimate":
      case "contract":
        return <FileText className="h-4 w-4" />;
      case "job":
        return <Briefcase className="h-4 w-4" />;
      case "customer":
        return <Users className="h-4 w-4" />;
      case "property":
        return <Home className="h-4 w-4" />;
      case "equipment":
        return <Wrench className="h-4 w-4" />;
    }
  };

  // Get entity color
  const getEntityColor = (entityType: ArchivableEntityType) => {
    switch (entityType) {
      case "invoice":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
      case "estimate":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200";
      case "contract":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "job":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200";
      case "customer":
        return "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200";
      case "property":
        return "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200";
      case "equipment":
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200";
    }
  };

  // Define columns
  const columns: ColumnDef<ArchivedItem>[] = [
    {
      key: "entityType",
      header: "Type",
      render: (item) => (
        <Badge className={`gap-1 ${getEntityColor(item.entityType)}`}>
          {getEntityIcon(item.entityType)}
          {item.entityType.toUpperCase()}
        </Badge>
      ),
      width: "w-32",
    },
    {
      key: "displayName",
      header: "Item",
      render: (item) => (
        <div>
          <div className="font-medium">{item.displayName}</div>
          {item.entityNumber && (
            <div className="text-muted-foreground text-xs">{item.entityNumber}</div>
          )}
        </div>
      ),
      width: "flex-1",
    },
    {
      key: "deletedAt",
      header: "Archived",
      render: (item) => (
        <div className="text-sm">
          {new Date(item.deletedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
      width: "w-32",
    },
    {
      key: "daysUntilDelete",
      header: "Auto-Delete In",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.daysUntilPermanentDelete > 0 ? (
            <>
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {item.daysUntilPermanentDelete} day
                {item.daysUntilPermanentDelete === 1 ? "" : "s"}
              </span>
            </>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Ready to delete
            </Badge>
          )}
        </div>
      ),
      width: "w-40",
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Restore Selected",
      icon: <RotateCcw className="h-4 w-4" />,
      onClick: async (selectedIds: Set<string>) => {
        setSelectedItems(selectedIds);
        setShowRestoreDialog(true);
      },
    },
    {
      label: "Permanently Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedIds: Set<string>) => {
        toast.error(
          "Permanent deletion not yet implemented. Items will auto-delete after 90 days."
        );
      },
      variant: "destructive",
    },
  ];

  // Handle bulk restore
  const handleBulkRestore = async () => {
    if (selectedItems.size === 0) return;

    try {
      // Group by entity type
      const itemsByType = new Map<ArchivableEntityType, string[]>();
      selectedItems.forEach((id) => {
        const item = data.find((d) => d.id === id);
        if (item) {
          const existing = itemsByType.get(item.entityType) || [];
          itemsByType.set(item.entityType, [...existing, id]);
        }
      });

      // Restore each entity type
      let totalRestored = 0;
      for (const [entityType, ids] of itemsByType.entries()) {
        const result = await bulkRestore(ids, entityType);
        if (result.success && result.data) {
          totalRestored += result.data.restored;
        }
      }

      toast.success(`Restored ${totalRestored} item(s)`);
      setShowRestoreDialog(false);
      setSelectedItems(new Set());
      fetchData(); // Reload data
    } catch (error) {
      toast.error("Failed to restore items");
    }
  };

  return (
    <>
      {/* Entity Type Tabs */}
      <Tabs value={selectedEntity} onValueChange={setSelectedEntity}>
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="invoice">Invoices</TabsTrigger>
          <TabsTrigger value="estimate">Estimates</TabsTrigger>
          <TabsTrigger value="contract">Contracts</TabsTrigger>
          <TabsTrigger value="job">Jobs</TabsTrigger>
          <TabsTrigger value="customer">Customers</TabsTrigger>
          <TabsTrigger value="property">Properties</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Data Table */}
      <FullWidthDataTable
        data={data}
        columns={columns}
        getItemId={(item) => item.id}
        enableSelection={true}
        bulkActions={bulkActions}
        searchPlaceholder="Search archived items..."
        searchFilter={(item, query) => {
          const q = query.toLowerCase();
          return (
            item.displayName.toLowerCase().includes(q) ||
            item.entityNumber?.toLowerCase().includes(q) ||
            item.entityType.toLowerCase().includes(q)
          );
        }}
        showRefresh={true}
        onRefresh={fetchData}
        showPagination={true}
        itemsPerPage={50}
        emptyMessage="No archived items found"
        emptyIcon={<Archive className="h-12 w-12 text-muted-foreground" />}
      />

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore {selectedItems.size} Item(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the selected items to their active state. They
              will reappear in their original locations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkRestore}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
