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
    } catch (error) {
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
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="w-full"
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
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 w-8 p-0"
        >
          <X className="size-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="quick-firstName" className="text-xs">
              First Name *
            </Label>
            <Input
              id="quick-firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
              placeholder="John"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="quick-lastName" className="text-xs">
              Last Name *
            </Label>
            <Input
              id="quick-lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Smith"
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="quick-phone" className="text-xs">
              Phone *
            </Label>
            <Input
              id="quick-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="(555) 123-4567"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="quick-email" className="text-xs">
              Email
            </Label>
            <Input
              id="quick-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="quick-address" className="text-xs">
            Address
          </Label>
          <Input
            id="quick-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="quick-city" className="text-xs">
              City
            </Label>
            <Input
              id="quick-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Portland"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="quick-state" className="text-xs">
              State
            </Label>
            <Input
              id="quick-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="OR"
              maxLength={2}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="quick-zipCode" className="text-xs">
              ZIP
            </Label>
            <Input
              id="quick-zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="97201"
              className="h-9"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create & Select"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
