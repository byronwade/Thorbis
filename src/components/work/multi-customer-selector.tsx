"use client";

import { Check, Plus, Star, Trash2, User, Users, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CustomerCombobox } from "@/components/work/customer-combobox";

/**
 * Multi-Customer Selector - Client Component
 *
 * Allows selecting multiple customers for a job:
 * - Primary customer (billing)
 * - Secondary customers (co-owners, etc.)
 * - Billing percentage splits
 * - Customer role assignment
 *
 * Power-user optimized for complex job scenarios
 */

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name?: string;
};

type SelectedCustomer = {
  id: string;
  customer: Customer;
  role: "primary" | "secondary" | "billing" | "property_owner";
  isPrimary: boolean;
  isBillingContact: boolean;
  billingPercentage: number;
};

type MultiCustomerSelectorProps = {
  customers: Customer[];
  initialSelected?: SelectedCustomer[];
  onChange?: (selected: SelectedCustomer[]) => void;
  recentCustomerIds?: string[];
};

export function MultiCustomerSelector({
  customers,
  initialSelected = [],
  onChange,
  recentCustomerIds = [],
}: MultiCustomerSelectorProps) {
  const [selectedCustomers, setSelectedCustomers] = useState<SelectedCustomer[]>(initialSelected);
  const [showAddCustomer, setShowAddCustomer] = useState(initialSelected.length === 0);

  const addCustomer = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    // Check if already added
    if (selectedCustomers.some((sc) => sc.id === customerId)) {
      return;
    }

    const newCustomer: SelectedCustomer = {
      id: customerId,
      customer,
      role: selectedCustomers.length === 0 ? "primary" : "secondary",
      isPrimary: selectedCustomers.length === 0,
      isBillingContact: selectedCustomers.length === 0,
      billingPercentage: 100,
    };

    const updated = [...selectedCustomers, newCustomer];
    setSelectedCustomers(updated);
    onChange?.(updated);
    setShowAddCustomer(false);
  };

  const removeCustomer = (customerId: string) => {
    const updated = selectedCustomers.filter((sc) => sc.id !== customerId);

    // If removing primary, set first remaining as primary
    if (updated.length > 0 && !updated.some((sc) => sc.isPrimary)) {
      updated[0].isPrimary = true;
      updated[0].role = "primary";
    }

    setSelectedCustomers(updated);
    onChange?.(updated);
  };

  const setPrimary = (customerId: string) => {
    const updated = selectedCustomers.map((sc) => ({
      ...sc,
      isPrimary: sc.id === customerId,
      role: sc.id === customerId ? "primary" as const : sc.role,
    }));

    setSelectedCustomers(updated);
    onChange?.(updated);
  };

  const updateCustomerRole = (customerId: string, role: SelectedCustomer["role"]) => {
    const updated = selectedCustomers.map((sc) =>
      sc.id === customerId ? { ...sc, role } : sc
    );

    setSelectedCustomers(updated);
    onChange?.(updated);
  };

  const toggleBillingContact = (customerId: string) => {
    const updated = selectedCustomers.map((sc) =>
      sc.id === customerId ? { ...sc, isBillingContact: !sc.isBillingContact } : sc
    );

    setSelectedCustomers(updated);
    onChange?.(updated);
  };

  const getInitials = (customer: Customer) => {
    return `${customer.first_name[0] || ""}${customer.last_name[0] || ""}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <CardTitle>Customers</CardTitle>
          </div>
          <Badge variant="secondary">
            {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <CardDescription>
          Add multiple customers for shared properties or co-billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Customers */}
        {selectedCustomers.map((selected) => (
          <div
            key={selected.id}
            className="rounded-lg border bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Customer Info */}
              <div className="flex flex-1 items-start gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className={selected.isPrimary ? "bg-primary text-primary-foreground" : ""}>
                    {getInitials(selected.customer)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {selected.customer.first_name} {selected.customer.last_name}
                    </p>
                    {selected.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        <Star className="mr-1 size-3" />
                        Primary
                      </Badge>
                    )}
                    {selected.isBillingContact && (
                      <Badge variant="outline" className="text-xs">
                        Billing
                      </Badge>
                    )}
                  </div>

                  {selected.customer.company_name && (
                    <p className="text-muted-foreground text-sm">
                      {selected.customer.company_name}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-muted-foreground">{selected.customer.phone}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{selected.customer.email}</span>
                  </div>

                  {/* Role Selector */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`role-${selected.id}`} className="text-xs">
                        Role:
                      </Label>
                      <Select
                        value={selected.role}
                        onValueChange={(value: any) => updateCustomerRole(selected.id, value)}
                      >
                        <SelectTrigger id={`role-${selected.id}`} className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="billing">Billing Contact</SelectItem>
                          <SelectItem value="property_owner">Property Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id={`billing-${selected.id}`}
                        checked={selected.isBillingContact}
                        onCheckedChange={() => toggleBillingContact(selected.id)}
                        className="scale-75"
                      />
                      <Label htmlFor={`billing-${selected.id}`} className="text-xs">
                        Billing Contact
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                {!selected.isPrimary && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrimary(selected.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Star className="size-4" />
                  </Button>
                )}
                {selectedCustomers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomer(selected.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Hidden input for form submission */}
            <input type="hidden" name={`customer_${selected.id}_role`} value={selected.role} />
            <input type="hidden" name={`customer_${selected.id}_isPrimary`} value={selected.isPrimary ? "true" : "false"} />
            <input type="hidden" name={`customer_${selected.id}_isBilling`} value={selected.isBillingContact ? "true" : "false"} />
          </div>
        ))}

        {/* Add Customer */}
        {showAddCustomer ? (
          <div className="space-y-3 rounded-lg border border-dashed p-4">
            <div className="flex items-center justify-between">
              <Label>Add Customer</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCustomer(false)}
                className="h-8 w-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>

            <CustomerCombobox
              customers={customers}
              onValueChange={addCustomer}
              recentCustomerIds={recentCustomerIds}
              placeholder="Search and add customer..."
            />
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddCustomer(true)}
            className="w-full"
          >
            <Plus className="mr-2 size-4" />
            Add Another Customer
          </Button>
        )}

        {/* Hidden inputs for selected customer IDs */}
        <input
          type="hidden"
          name="customerIds"
          value={selectedCustomers.map((sc) => sc.id).join(",")}
        />
        <input
          type="hidden"
          name="primaryCustomerId"
          value={selectedCustomers.find((sc) => sc.isPrimary)?.id || ""}
        />
      </CardContent>
    </Card>
  );
}
