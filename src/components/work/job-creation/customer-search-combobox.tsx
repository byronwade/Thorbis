"use client";

import { Check, ChevronsUpDown, Plus, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Customer Search Combobox - Fast Customer Lookup
 *
 * Features:
 * - Real-time search by name, email, phone, or company
 * - Shows recent customers at top
 * - "Create New Customer" option inline
 * - Keyboard navigation support
 * - Performance optimized with client-side filtering
 */

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name?: string;
  type: "residential" | "commercial" | "industrial";
};

type CustomerSearchComboboxProps = {
  customers: Customer[];
  recentCustomerIds?: string[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onCreateNew: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export function CustomerSearchCombobox({
  customers,
  recentCustomerIds = [],
  selectedCustomer,
  onSelectCustomer,
  onCreateNew,
  placeholder = "Search customers...",
  disabled = false,
}: CustomerSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get recent customers for quick access
  const recentCustomers = customers.filter((c) =>
    recentCustomerIds.includes(c.id)
  );
  const otherCustomers = customers.filter(
    (c) => !recentCustomerIds.includes(c.id)
  );

  // Format customer display name
  const formatCustomerName = (customer: Customer) => {
    const name = `${customer.first_name} ${customer.last_name}`;
    return customer.company_name ? `${name} (${customer.company_name})` : name;
  };

  // Format secondary info (email or phone)
  const formatSecondaryInfo = (customer: Customer) =>
    customer.email || customer.phone || "";

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          {selectedCustomer ? (
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span className="truncate">
                {formatCustomerName(selectedCustomer)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[500px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearchQuery}
            placeholder="Search by name, email, phone, or company..."
            value={searchQuery}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center">
                <p className="text-muted-foreground text-sm">
                  No customers found
                </p>
                <Button
                  className="mt-3"
                  onClick={() => {
                    setOpen(false);
                    onCreateNew();
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 size-4" />
                  Create New Customer
                </Button>
              </div>
            </CommandEmpty>

            {/* Create New Option (always visible at top) */}
            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onCreateNew();
                }}
              >
                <Plus className="mr-2 size-4" />
                <span>Create New Customer</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* Recent Customers */}
            {recentCustomers.length > 0 && !searchQuery && (
              <>
                <CommandGroup heading="Recent">
                  {recentCustomers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      onSelect={() => {
                        onSelectCustomer(
                          customer.id === selectedCustomer?.id ? null : customer
                        );
                        setOpen(false);
                      }}
                      value={`${customer.first_name} ${customer.last_name} ${customer.email} ${customer.phone} ${customer.company_name || ""}`}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selectedCustomer?.id === customer.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">
                          {formatCustomerName(customer)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatSecondaryInfo(customer)}
                        </span>
                      </div>
                      <span className="ml-auto text-muted-foreground text-xs">
                        {customer.type}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* All Customers */}
            <CommandGroup
              heading={searchQuery ? "Search Results" : "All Customers"}
            >
              {(searchQuery ? customers : otherCustomers)
                .filter((customer) => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    customer.first_name.toLowerCase().includes(query) ||
                    customer.last_name.toLowerCase().includes(query) ||
                    customer.email.toLowerCase().includes(query) ||
                    customer.phone.includes(query) ||
                    customer.company_name?.toLowerCase().includes(query)
                  );
                })
                .slice(0, 50) // Limit to 50 results for performance
                .map((customer) => (
                  <CommandItem
                    key={customer.id}
                    onSelect={() => {
                      onSelectCustomer(
                        customer.id === selectedCustomer?.id ? null : customer
                      );
                      setOpen(false);
                    }}
                    value={`${customer.first_name} ${customer.last_name} ${customer.email} ${customer.phone} ${customer.company_name || ""}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        selectedCustomer?.id === customer.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">
                        {formatCustomerName(customer)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatSecondaryInfo(customer)}
                      </span>
                    </div>
                    <span className="ml-auto text-muted-foreground text-xs">
                      {customer.type}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
