"use client";

import { Check, ChevronsUpDown, Plus, User, Clock } from "lucide-react";
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
 * Customer Combobox - Searchable Customer Selection
 *
 * Power-user optimized for CSRs:
 * - Fuzzy search across name, company, phone, email
 * - Keyboard navigation (arrow keys, enter to select)
 * - Recent customers shown first
 * - Quick add customer inline
 * - Performant with thousands of customers
 * - Auto-closes on selection for speed
 */

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name?: string;
};

type CustomerComboboxProps = {
  customers: Customer[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: () => void;
  recentCustomerIds?: string[];
  disabled?: boolean;
  placeholder?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

export function CustomerCombobox({
  customers,
  value,
  onValueChange,
  onAddNew,
  recentCustomerIds = [],
  disabled = false,
  placeholder = "Search customers...",
  ref,
}: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCustomer = customers.find((c) => c.id === value);

  // Separate recent customers
  const recentCustomers = recentCustomerIds
    .map((id) => customers.find((c) => c.id === id))
    .filter(Boolean) as Customer[];

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
    const phone = customer.phone?.toLowerCase() || "";
    const email = customer.email?.toLowerCase() || "";
    const company = customer.company_name?.toLowerCase() || "";

    return (
      fullName.includes(query) ||
      phone.includes(query) ||
      email.includes(query) ||
      company.includes(query)
    );
  });

  // Split filtered customers into recent and others
  const recentMatches = filteredCustomers.filter((c) =>
    recentCustomerIds.includes(c.id)
  );
  const otherMatches = filteredCustomers.filter(
    (c) => !recentCustomerIds.includes(c.id)
  );

  // Limit to 50 results for performance
  const displayedCustomers = [...recentMatches, ...otherMatches].slice(0, 50);

  const handleSelect = (customerId: string) => {
    onValueChange(customerId);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedCustomer ? (
            <span className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              {selectedCustomer.first_name} {selectedCustomer.last_name}
              {selectedCustomer.company_name && (
                <span className="text-muted-foreground">
                  ({selectedCustomer.company_name})
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by name, company, phone, or email..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6">
                <p className="text-muted-foreground text-sm">
                  No customers found
                </p>
                {onAddNew && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      onAddNew();
                    }}
                  >
                    <Plus className="mr-2 size-4" />
                    Add New Customer
                  </Button>
                )}
              </div>
            </CommandEmpty>

            {/* Recent Customers */}
            {recentMatches.length > 0 && (
              <>
                <CommandGroup heading="Recent">
                  {recentMatches.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.id}
                      onSelect={() => handleSelect(customer.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value === customer.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-1 items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {customer.phone}
                            {customer.company_name && ` • ${customer.company_name}`}
                          </span>
                        </div>
                        <Clock className="size-3 text-muted-foreground" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {otherMatches.length > 0 && <CommandSeparator />}
              </>
            )}

            {/* All Other Customers */}
            {otherMatches.length > 0 && (
              <CommandGroup
                heading={
                  recentMatches.length > 0
                    ? `All Customers (${Math.min(50 - recentMatches.length, otherMatches.length)})`
                    : `Customers (${Math.min(50, otherMatches.length)})`
                }
              >
                {otherMatches.slice(0, 50 - recentMatches.length).map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.id}
                    onSelect={() => handleSelect(customer.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {customer.phone}
                        {customer.company_name && ` • ${customer.company_name}`}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Add New Customer */}
            {onAddNew && displayedCustomers.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      onAddNew();
                    }}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 size-4" />
                    Add New Customer
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
