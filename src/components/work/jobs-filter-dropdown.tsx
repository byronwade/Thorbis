"use client";

/**
 * Jobs Filter Dropdown
 *
 * Comprehensive filter control for jobs
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Filter, ChevronDown } from "lucide-react";
import {
  useJobsFiltersStore,
  type JobsFilters,
} from "@/lib/stores/jobs-filters-store";

interface JobsFilterDropdownProps {
  activeCount?: number;
  archivedCount?: number;
  totalCount?: number;
}

export function JobsFilterDropdown({
  activeCount,
  archivedCount,
  totalCount,
}: JobsFilterDropdownProps) {
  const globalFilters = useJobsFiltersStore((state) => state.filters);
  const setFilters = useJobsFiltersStore((state) => state.setFilters);
  const resetFilters = useJobsFiltersStore((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState(globalFilters);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(globalFilters);
    }
  }, [isOpen, globalFilters]);

  const activeFilterCount = Object.entries(globalFilters).filter(
    ([key, value]) => {
      if (key === "archiveStatus") return value !== "active";
      if (key === "status" || key === "priority") return value !== "all";
      return value !== "";
    }
  ).length;

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    resetFilters();
    setLocalFilters(globalFilters);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="mr-2 size-4" />
          Filters
          <ChevronDown className="ml-2 size-4" />
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 size-5 rounded-full p-0 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Filter Jobs</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            )}
          </div>

          <Separator />

          {/* Archive Status */}
          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select
              value={localFilters.archiveStatus}
              onValueChange={(value: JobsFilters["archiveStatus"]) =>
                setLocalFilters({ ...localFilters, archiveStatus: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  Active Only{" "}
                  {activeCount !== undefined && `(${activeCount})`}
                </SelectItem>
                <SelectItem value="archived">
                  Archived Only{" "}
                  {archivedCount !== undefined && `(${archivedCount})`}
                </SelectItem>
                <SelectItem value="all">
                  All Jobs{" "}
                  {totalCount !== undefined && `(${totalCount})`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Status */}
          <div className="space-y-2">
            <Label className="text-xs">Job Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, status: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-xs">Priority</Label>
            <Select
              value={localFilters.priority}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, priority: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label className="text-xs">Customer Name</Label>
            <Input
              placeholder="Search by customer..."
              value={localFilters.customerName}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, customerName: e.target.value })
              }
              className="h-9"
            />
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label className="text-xs">Assigned To</Label>
            <Input
              placeholder="Search by assigned person..."
              value={localFilters.assignedTo}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, assignedTo: e.target.value })
              }
              className="h-9"
            />
          </div>

          {/* Job Number */}
          <div className="space-y-2">
            <Label className="text-xs">Job Number</Label>
            <Input
              placeholder="Search by number..."
              value={localFilters.jobNumber}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, jobNumber: e.target.value })
              }
              className="h-9"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs">Category</Label>
            <Input
              placeholder="Filter by category..."
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, category: e.target.value })
              }
              className="h-9"
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
