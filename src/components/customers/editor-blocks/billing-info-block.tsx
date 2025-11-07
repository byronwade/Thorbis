/**
 * Billing Info Block - Custom Tiptap Node
 *
 * Displays and edits customer billing information:
 * - Payment terms
 * - Credit limit
 * - Tax exempt status
 * - Billing email
 */

"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { CreditCard, Mail, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentMethodCard } from "../payment-method-card";
import { AddPaymentMethodDialog } from "../add-payment-method-dialog";
import { useState } from "react";
import { setDefaultCustomerPaymentMethod, removeCustomerPaymentMethod } from "@/actions/customer-payment-methods";

// React component that renders the block
export function BillingInfoBlockComponent({ node, updateAttributes, editor }: any) {
  const { billingEmail, paymentTerms, creditLimit, taxExempt, taxExemptNumber, paymentMethods, customerId } = node.attrs;
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSetDefault = async (paymentMethodId: string) => {
    setIsUpdating(true);
    const result = await setDefaultCustomerPaymentMethod(paymentMethodId, customerId);
    setIsUpdating(false);

    if (!result.success) {
      alert(result.error || "Failed to set default payment method");
    } else {
      // Update local state - set all to non-default, then set selected as default
      const updatedMethods = paymentMethods.map((pm: any) => ({
        ...pm,
        is_default: pm.id === paymentMethodId,
      }));
      updateAttributes({ paymentMethods: updatedMethods });
    }
  };

  const handleRemove = async (paymentMethodId: string) => {
    if (!confirm("Are you sure you want to remove this payment method?")) {
      return;
    }

    setIsUpdating(true);
    const result = await removeCustomerPaymentMethod(paymentMethodId, customerId);
    setIsUpdating(false);

    if (!result.success) {
      alert(result.error || "Failed to remove payment method");
    } else {
      // Update local state - remove the payment method
      const updatedMethods = paymentMethods.filter((pm: any) => pm.id !== paymentMethodId);
      updateAttributes({ paymentMethods: updatedMethods });
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      case "discover":
        return "💳";
      default:
        return "💳";
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const paymentTermsLabels: Record<string, string> = {
    due_on_receipt: "Due on Receipt",
    net_15: "Net 15",
    net_30: "Net 30",
    net_60: "Net 60",
    net_90: "Net 90",
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentDialog(true);
  };

  return (
    <NodeViewWrapper className="billing-info-block">
      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        customerId={customerId}
        onSuccess={() => {
          // Reload payment methods
          setShowAddPaymentDialog(false);
        }}
      />
      <CollapsibleSectionWrapper
        title="Billing Information"
        icon={<CreditCard className="size-5" />}
        defaultOpen={false}
        storageKey="customer-billing-section"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddPaymentMethod}
            className="gap-1"
          >
            <Plus className="size-4" />
            Add Payment Method
          </Button>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Billing Email */}
          <div className="space-y-2">
            <Label htmlFor={`billingEmail-${node.attrs.id}`} className="flex items-center gap-1">
              <Mail className="size-3" />
              Billing Email
            </Label>
            <Input
              id={`billingEmail-${node.attrs.id}`}
              type="email"
              value={billingEmail || ""}
              onChange={(e) => updateAttributes({ billingEmail: e.target.value })}
              placeholder="billing@example.com"
            />
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label htmlFor={`paymentTerms-${node.attrs.id}`}>Payment Terms</Label>
            <Select
              value={paymentTerms || "due_on_receipt"}
              onValueChange={(value) => updateAttributes({ paymentTerms: value })}
            >
              <SelectTrigger id={`paymentTerms-${node.attrs.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                <SelectItem value="net_15">Net 15</SelectItem>
                <SelectItem value="net_30">Net 30</SelectItem>
                <SelectItem value="net_60">Net 60</SelectItem>
                <SelectItem value="net_90">Net 90</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Credit Limit */}
          <div className="space-y-2">
            <Label htmlFor={`creditLimit-${node.attrs.id}`}>Credit Limit</Label>
            <Input
              id={`creditLimit-${node.attrs.id}`}
              type="number"
              value={creditLimit ? creditLimit / 100 : ""}
              onChange={(e) => updateAttributes({ creditLimit: parseFloat(e.target.value) * 100 })}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Tax Exempt */}
          <div className="space-y-2">
            <Label htmlFor={`taxExempt-${node.attrs.id}`} className="flex items-center gap-1">
              <Shield className="size-3" />
              Tax Status
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`taxExempt-${node.attrs.id}`}
                checked={taxExempt}
                onCheckedChange={(checked) => updateAttributes({ taxExempt: checked })}
              />
              <label
                htmlFor={`taxExempt-${node.attrs.id}`}
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tax Exempt
              </label>
            </div>
          </div>

          {/* Tax Exempt Number (only if tax exempt) */}
          {taxExempt && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`taxExemptNumber-${node.attrs.id}`}>Tax Exempt Number</Label>
              <Input
                id={`taxExemptNumber-${node.attrs.id}`}
                value={taxExemptNumber || ""}
                onChange={(e) => updateAttributes({ taxExemptNumber: e.target.value })}
                placeholder="Enter tax exempt number"
              />
            </div>
          )}

          {/* Saved Payment Methods */}
          <div className="mt-6 space-y-3 border-t pt-6 md:col-span-2">
            <h4 className="font-semibold text-sm">Saved Payment Methods ({paymentMethods?.length || 0})</h4>
            {paymentMethods && paymentMethods.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {paymentMethods.map((pm: any) => (
                  <PaymentMethodCard
                    key={pm.id}
                    id={pm.id}
                    card_brand={pm.card_brand}
                    card_last4={pm.card_last4}
                    card_exp_month={pm.card_exp_month}
                    card_exp_year={pm.card_exp_year}
                    is_default={pm.is_default}
                    nickname={pm.nickname}
                    is_verified={pm.is_verified}
                    onSetDefault={() => handleSetDefault(pm.id)}
                    onRemove={() => handleRemove(pm.id)}
                    disabled={isUpdating}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
                <CreditCard className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm">No payment methods on file</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Add a card or bank account to streamline payments
                </p>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSectionWrapper>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const BillingInfoBlock = Node.create({
  name: "billingInfoBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      billingEmail: {
        default: "",
      },
      paymentTerms: {
        default: "due_on_receipt",
      },
      creditLimit: {
        default: 0,
      },
      taxExempt: {
        default: false,
      },
      taxExemptNumber: {
        default: "",
      },
      paymentMethods: {
        default: [],
      },
      customerId: {
        default: null,
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="billing-info-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "billing-info-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BillingInfoBlockComponent);
  },

  addCommands() {
    return {
      insertBillingInfoBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    } as any;
  },
});
