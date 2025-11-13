"use client";

/**
 * Payment Method Card Component
 *
 * Beautiful interactive payment method displays with:
 * - Visual credit card with brand-specific styling
 * - ACH/Bank account visualization
 * - Action buttons for set default and remove
 * - Hover effects and transitions
 */

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditCardVisual } from "@/components/ui/credit-card-visual";

interface PaymentMethodCardProps {
  id: string;
  type?: "card" | "ach" | "bank";
  card_brand?: string;
  card_last4: string;
  card_exp_month?: number;
  card_exp_year?: number;
  cardholder_name?: string;
  bank_name?: string;
  account_type?: "checking" | "savings";
  is_default?: boolean;
  nickname?: string;
  is_verified?: boolean;
  onSetDefault?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function PaymentMethodCard({
  id,
  type = "card",
  card_brand,
  card_last4,
  card_exp_month,
  card_exp_year,
  cardholder_name,
  bank_name,
  account_type,
  is_default,
  nickname,
  is_verified,
  onSetDefault,
  onRemove,
  disabled = false,
}: PaymentMethodCardProps) {
  return (
    <div className="group relative">
      {/* Visual Card/Bank Display */}
      <CreditCardVisual
        accountType={account_type}
        bankName={bank_name}
        brand={card_brand}
        cardholderName={cardholder_name}
        expMonth={card_exp_month}
        expYear={card_exp_year}
        isDefault={is_default}
        isVerified={is_verified}
        last4={card_last4}
        nickname={nickname}
        type={type}
      />

      {/* Action Buttons - Show on Hover */}
      <div className="mt-3 flex items-center justify-between gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-2">
          {!is_default && onSetDefault && (
            <Button
              className="h-8 text-xs"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault();
              }}
              size="sm"
              variant="outline"
            >
              Set as Default
            </Button>
          )}
        </div>

        {onRemove && (
          <Button
            className="h-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (
                confirm(`Remove this ${type === "card" ? "card" : "account"}?`)
              ) {
                onRemove();
              }
            }}
            size="sm"
            variant="outline"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
