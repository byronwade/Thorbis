"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Quick Customer Add - Inline Component
 *
 * Power-user friendly inline customer creation
 * - No modal/dialog interruption
 * - Expandable inline form
 * - Tab-friendly fields
 * - Auto-focus on expand
 * - Quick keyboard shortcuts
 */

type QuickCustomerAddProps = {
  onCustomerCreated: (customerId: string, customerData: any) => void;
  onCancel?: () => void;
};

export function QuickCustomerAdd({
  onCustomerCreated,
  onCancel,
}: QuickCustomerAddProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { createCustomer } = await import("@/actions/customers");
      const formData = new FormData();
      formData.set("firstName", firstName);
      formData.set("lastName", lastName);
      formData.set("phone", phone);
      formData.set("email", email);
      formData.set("address", address);
      formData.set("city", city);
      formData.set("state", state);
      formData.set("zipCode", zipCode);

      const result = await createCustomer(formData);

      if (result.success) {
        onCustomerCreated(result.data, {
          id: result.data,
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          address,
          city,
          state,
          zip_code: zipCode,
        });
        // Reset form
        setIsExpanded(false);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setCity("");
        setState("");
        setZipCode("");
      } else {
        alert(result.error || "Failed to create customer");
      }
    } catch (_error) {
      alert("Failed to create customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    onCancel?.();
  };

  if (!isExpanded) {
    return (
      <Button
        className="w-full"
        onClick={() => setIsExpanded(true)}
        size="sm"
        type="button"
        variant="outline"
      >
        <Plus className="mr-2 size-4" />
        Quick Add New Customer
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-sm">New Customer</h4>
        <Button
          className="h-8 w-8 p-0"
          onClick={handleCancel}
          size="sm"
          type="button"
          variant="ghost"
        >
          <X className="size-4" />
        </Button>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-firstName">
              First Name *
            </Label>
            <Input
              autoFocus
              className="h-9"
              id="quick-firstName"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              value={firstName}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-lastName">
              Last Name *
            </Label>
            <Input
              className="h-9"
              id="quick-lastName"
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
              required
              value={lastName}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-phone">
              Phone *
            </Label>
            <Input
              className="h-9"
              id="quick-phone"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
              type="tel"
              value={phone}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-email">
              Email
            </Label>
            <Input
              className="h-9"
              id="quick-email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              type="email"
              value={email}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs" htmlFor="quick-address">
            Address
          </Label>
          <Input
            className="h-9"
            id="quick-address"
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
            value={address}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-city">
              City
            </Label>
            <Input
              className="h-9"
              id="quick-city"
              onChange={(e) => setCity(e.target.value)}
              placeholder="Portland"
              value={city}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-state">
              State
            </Label>
            <Input
              className="h-9"
              id="quick-state"
              maxLength={2}
              onChange={(e) => setState(e.target.value)}
              placeholder="OR"
              value={state}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="quick-zipCode">
              ZIP
            </Label>
            <Input
              className="h-9"
              id="quick-zipCode"
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="97201"
              value={zipCode}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            disabled={isLoading}
            size="sm"
            type="submit"
          >
            {isLoading ? "Creating..." : "Create & Select"}
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleCancel}
            size="sm"
            type="button"
            variant="ghost"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
