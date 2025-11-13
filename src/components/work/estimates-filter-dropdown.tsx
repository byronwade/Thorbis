"use client";

import { Filter, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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
import { useEstimatesFiltersStore, type EstimatesFilters } from "@/lib/stores/estimates-filters-store";

type EstimatesFilterDropdownProps = {
  activeCount?: number;
  archivedCount?: number;
  totalCount?: number;
};

export function EstimatesFilterDropdown({
  activeCount,
  archivedCount,
  totalCount,
}: EstimatesFilterDropdownProps) {
  const globalFilters = useEstimatesFiltersStore((state) => state.filters);
  const setFilters = useEstimatesFiltersStore((state) => state.setFilters);
  const resetFilters = useEstimatesFiltersStore((state) => state.resetFilters);
  
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
    if (localFilters.status !== "all") count++;
    if (localFilters.amountMin) count++;
    if (localFilters.amountMax) count++;
    if (localFilters.customerName) count++;
    if (localFilters.estimateNumber) count++;
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

  const handleLocalChange = (key: keyof EstimatesFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="relative">
          <Filter className="size-4" />
          <span className="ml-2">Filters</span>
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 justify-center p-0 text-xs" variant="secondary">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className="ml-1 size-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filter Estimates</span>
          {activeFilterCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={handleClear}
            >
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-4 p-3">
          {/* Archive Status */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Archive Status</Label>
            <Select
              value={localFilters.archiveStatus}
              onValueChange={(value) =>
                handleLocalChange("archiveStatus", value as EstimatesFilters["archiveStatus"])
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  Active Only {activeCount !== undefined && `(${activeCount})`}
                </SelectItem>
                <SelectItem value="all">
                  All Estimates {totalCount !== undefined && `(${totalCount})`}
                </SelectItem>
                <SelectItem value="archived">
                  Archived Only {archivedCount !== undefined && `(${archivedCount})`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleLocalChange("status", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Amount Range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Amount Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="h-9"
                value={localFilters.amountMin}
                onChange={(e) => handleLocalChange("amountMin", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                className="h-9"
                value={localFilters.amountMax}
                onChange={(e) => handleLocalChange("amountMax", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Customer Name */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Customer</Label>
            <Input
              type="text"
              placeholder="Search by customer name..."
              className="h-9"
              value={localFilters.customerName}
              onChange={(e) => handleLocalChange("customerName", e.target.value)}
            />
          </div>

          <Separator />

          {/* Estimate Number */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Estimate Number</Label>
            <Input
              type="text"
              placeholder="Search by estimate #..."
              className="h-9"
              value={localFilters.estimateNumber}
              onChange={(e) => handleLocalChange("estimateNumber", e.target.value)}
            />
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <div className="flex gap-2 p-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

