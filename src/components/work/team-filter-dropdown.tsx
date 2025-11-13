"use client";

/**
 * Team Members Filter Dropdown
 *
 * Comprehensive filter control for team members
 */

import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  type TeamFilters,
  useTeamFiltersStore,
} from "@/lib/stores/team-filters-store";

type TeamFilterDropdownProps = {
  activeCount?: number;
  archivedCount?: number;
  totalCount?: number;
};

export function TeamFilterDropdown({
  activeCount,
  archivedCount,
  totalCount,
}: TeamFilterDropdownProps) {
  const globalFilters = useTeamFiltersStore((state) => state.filters);
  const setFilters = useTeamFiltersStore((state) => state.setFilters);
  const resetFilters = useTeamFiltersStore((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState(globalFilters);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local filters with global filters when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(globalFilters);
    }
  }, [isOpen, globalFilters]);

  // Count active filters
  const activeFilterCount = Object.entries(globalFilters).filter(
    ([key, value]) => {
      if (key === "archiveStatus") {
        return value !== "active";
      }
      if (key === "role" || key === "status") {
        return value !== "all";
      }
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
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative" size="sm" variant="outline">
          <Filter className="mr-2 size-4" />
          Filters
          <ChevronDown className="ml-2 size-4" />
          {activeFilterCount > 0 && (
            <Badge
              className="ml-2 size-5 rounded-full p-0 text-xs"
              variant="secondary"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Filter Team Members</h4>
            {activeFilterCount > 0 && (
              <Button
                className="h-auto p-1 text-xs"
                onClick={handleClearAll}
                size="sm"
                variant="ghost"
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
              onValueChange={(value: TeamFilters["archiveStatus"]) =>
                setLocalFilters({ ...localFilters, archiveStatus: value })
              }
              value={localFilters.archiveStatus}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  Active Only {activeCount !== undefined && `(${activeCount})`}
                </SelectItem>
                <SelectItem value="archived">
                  Archived Only{" "}
                  {archivedCount !== undefined && `(${archivedCount})`}
                </SelectItem>
                <SelectItem value="all">
                  All Members {totalCount !== undefined && `(${totalCount})`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-xs">Role</Label>
            <Select
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, role: value })
              }
              value={localFilters.role}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="office_staff">Office Staff</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member Status */}
          <div className="space-y-2">
            <Label className="text-xs">Member Status</Label>
            <Select
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, status: value })
              }
              value={localFilters.status}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name Search */}
          <div className="space-y-2">
            <Label className="text-xs">Member Name</Label>
            <Input
              className="h-9"
              onChange={(e) =>
                setLocalFilters({ ...localFilters, name: e.target.value })
              }
              placeholder="Search by name..."
              value={localFilters.name}
            />
          </div>

          {/* Email Search */}
          <div className="space-y-2">
            <Label className="text-xs">Email</Label>
            <Input
              className="h-9"
              onChange={(e) =>
                setLocalFilters({ ...localFilters, email: e.target.value })
              }
              placeholder="Search by email..."
              value={localFilters.email}
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label className="text-xs">Department</Label>
            <Input
              className="h-9"
              onChange={(e) =>
                setLocalFilters({ ...localFilters, department: e.target.value })
              }
              placeholder="Filter by department..."
              value={localFilters.department}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleApplyFilters} size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
