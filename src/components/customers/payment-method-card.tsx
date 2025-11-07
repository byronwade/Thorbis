"use client";

/**
 * Payment Method Card Component
 *
 * Displays a saved payment method as a card with:
 * - Card brand icon
 * - Last 4 digits
 * - Expiration date
 * - Default badge
 * - Delete button
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2, Check, Building2, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodCardProps {
  id: string;
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  is_default?: boolean;
  nickname?: string;
  is_verified?: boolean;
  onSetDefault?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

const CARD_BRAND_ICONS: Record<string, string> = {
  visa: "💳",
  mastercard: "💳",
  amex: "💳",
  discover: "💳",
  diners: "💳",
  jcb: "💳",
  unionpay: "💳",
};

export function PaymentMethodCard({
  id,
  card_brand,
  card_last4,
  card_exp_month,
  card_exp_year,
  is_default,
  nickname,
  is_verified,
  onSetDefault,
  onRemove,
  disabled = false,
}: PaymentMethodCardProps) {
  const brandIcon = CARD_BRAND_ICONS[card_brand?.toLowerCase()] || "💳";

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      is_default && "border-primary ring-2 ring-primary/20"
    )}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-2xl">
            {brandIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">
                {card_brand?.toUpperCase()} •••• {card_last4}
              </p>
              {is_default && (
                <Badge variant="default" className="gap-1 text-xs">
                  <Check className="size-3" />
                  Default
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>Expires {String(card_exp_month).padStart(2, "0")}/{card_exp_year}</span>
              {nickname && (
                <>
                  <span>•</span>
                  <span>{nickname}</span>
                </>
              )}
              {is_verified && (
                <>
                  <span>•</span>
                  <span className="text-success">Verified</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!is_default && onSetDefault && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSetDefault}
              disabled={disabled}
              className="text-xs"
            >
              Set Default
            </Button>
          )}
          {onRemove && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemove}
              disabled={disabled}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
