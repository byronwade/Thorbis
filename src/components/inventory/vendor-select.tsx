"use client";

import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { searchVendors } from "@/actions/vendors";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Vendor = {
  id: string;
  name: string;
  display_name: string;
  vendor_number: string;
  email: string | null;
  phone: string | null;
  status: "active" | "inactive";
};

type VendorSelectProps = {
  value?: string;
  onValueChange: (
    vendorId: string | undefined,
    vendor: Vendor | undefined
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function VendorSelect({
  value,
  onValueChange,
  placeholder = "Select vendor...",
  disabled = false,
  className,
}: VendorSelectProps) {
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load vendors on mount and when search changes
  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true);
      const result = await searchVendors(searchQuery || "");
      if (result.success && result.data) {
        setVendors(result.data);
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(() => {
      loadVendors();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const selectedVendor = vendors.find((v) => v.id === value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedVendor && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          {selectedVendor ? (
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{selectedVendor.display_name || selectedVendor.name}</span>
              <span className="text-muted-foreground text-xs">
                ({selectedVendor.vendor_number})
              </span>
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command>
          <CommandInput
            onValueChange={setSearchQuery}
            placeholder="Search vendors..."
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No vendors found."}
            </CommandEmpty>
            <CommandGroup>
              {vendors.map((vendor) => (
                <CommandItem
                  key={vendor.id}
                  onSelect={() => {
                    onValueChange(
                      vendor.id === value ? undefined : vendor.id,
                      vendor.id === value ? undefined : vendor
                    );
                    setOpen(false);
                  }}
                  value={`${vendor.name} ${vendor.vendor_number} ${vendor.email || ""}`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === vendor.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {vendor.display_name || vendor.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {vendor.vendor_number}
                      {vendor.email && ` • ${vendor.email}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
