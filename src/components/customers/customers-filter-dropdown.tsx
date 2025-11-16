"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  type CustomersFilters,
  useCustomersFiltersStore,
} from "@/lib/stores/customers-filters-store";

type CustomersFilterDropdownProps = {
  activeCount?: number;
  archivedCount?: number;
  totalCount?: number;
};

export function CustomersFilterDropdown({
  activeCount,
  archivedCount,
  totalCount,
}: CustomersFilterDropdownProps) {
  const globalFilters = useCustomersFiltersStore((state) => state.filters);
  const setFilters = useCustomersFiltersStore((state) => state.setFilters);
  const resetFilters = useCustomersFiltersStore((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState(globalFilters);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(globalFilters);
    }
  }, [isOpen, globalFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.archiveStatus !== "active") count++;
    if (localFilters.type !== "all") count++;
    if (localFilters.status !== "all") count++;
    if (localFilters.name) count++;
    if (localFilters.email) count++;
    if (localFilters.phone) count++;
    return count;
  }, [localFilters]);

  const handleApply = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    resetFilters();
    setIsOpen(false);
  };

  const handleLocalChange = (key: keyof CustomersFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative" size="sm" variant="outline">
          <Filter className="size-4" />
          <span className="ml-2">Filters</span>
          {activeFilterCount > 0 && (
            <Badge
              className="ml-2 h-5 w-5 justify-center p-0 text-xs"
              variant="secondary"
            >
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className="ml-1 size-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filter Customers</span>
          {activeFilterCount > 0 && (
            <Button
              className="h-6 px-2 text-xs"
              onClick={handleClear}
              size="sm"
              variant="ghost"
            >
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-4 p-3">
          {/* Archive Status */}
          <div className="space-y-2">
            <Label className="font-medium text-xs">Archive Status</Label>
            <Select
              onValueChange={(value) =>
                handleLocalChange(
                  "archiveStatus",
                  value as CustomersFilters["archiveStatus"]
                )
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
                <SelectItem value="all">
                  All Customers {totalCount !== undefined && `(${totalCount})`}
                </SelectItem>
                <SelectItem value="archived">
                  Archived Only{" "}
                  {archivedCount !== undefined && `(${archivedCount})`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Customer Type */}
          <div className="space-y-2">
            <Label className="font-medium text-xs">Customer Type</Label>
            <Select
              onValueChange={(value) => handleLocalChange("type", value)}
              value={localFilters.type}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-2">
            <Label className="font-medium text-xs">Status</Label>
            <Select
              onValueChange={(value) => handleLocalChange("status", value)}
              value={localFilters.status}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-2">
            <Label className="font-medium text-xs">Name</Label>
            <Input
              className="h-9"
              onChange={(e) => handleLocalChange("name", e.target.value)}
              placeholder="Search by name..."
              type="text"
              value={localFilters.name}
            />
          </div>

          <Separator />

          {/* Email */}
          <div className="space-y-2">
            <Label className="font-medium text-xs">Email</Label>
            <Input
              className="h-9"
              onChange={(e) => handleLocalChange("email", e.target.value)}
              placeholder="Search by email..."
              type="text"
              value={localFilters.email}
            />
          </div>

          <Separator />

          {/* Phone */}
          <div className="space-y-2">
            <Label className="font-medium text-xs">Phone</Label>
            <Input
              className="h-9"
              onChange={(e) => handleLocalChange("phone", e.target.value)}
              placeholder="Search by phone..."
              type="text"
              value={localFilters.phone}
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="flex gap-2 p-3">
          <Button
            className="flex-1"
            onClick={() => setIsOpen(false)}
            size="sm"
            variant="outline"
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleApply} size="sm">
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
