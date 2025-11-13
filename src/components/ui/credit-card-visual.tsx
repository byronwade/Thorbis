"use client";

/**
 * Credit Card Visual Component
 *
 * Beautiful, realistic credit card displays with:
 * - Brand-specific colors and gradients (Visa, Mastercard, Amex, Discover)
 * - Card chip, contactless icon, and brand logos
 * - Masked card numbers with proper spacing
 * - Cardholder name and expiration date
 * - Default badge and verified indicators
 * - ACH/Bank account visual
 */

import { BadgeCheck, Building2, Check, ChevronRight, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreditCardVisualProps {
  type?: "card" | "ach" | "bank";
  brand?: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
  cardholderName?: string;
  isDefault?: boolean;
  isVerified?: boolean;
  nickname?: string;
  bankName?: string;
  accountType?: "checking" | "savings";
  className?: string;
}

// Card brand configurations with colors, gradients, and logos
const CARD_CONFIGS: Record<
  string,
  {
    gradient: string;
    logo: string;
    textColor: string;
    chipColor: string;
  }
> = {
  visa: {
    gradient: "from-blue-600 via-blue-700 to-indigo-900",
    logo: "VISA",
    textColor: "text-white",
    chipColor: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400",
  },
  mastercard: {
    gradient: "from-slate-800 via-slate-900 to-black",
    logo: "mastercard",
    textColor: "text-white",
    chipColor: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400",
  },
  amex: {
    gradient: "from-teal-600 via-blue-700 to-indigo-800",
    logo: "AMEX",
    textColor: "text-white",
    chipColor: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400",
  },
  discover: {
    gradient: "from-orange-500 via-orange-600 to-orange-700",
    logo: "DISCOVER",
    textColor: "text-white",
    chipColor: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400",
  },
  default: {
    gradient: "from-slate-700 via-slate-800 to-slate-900",
    logo: "",
    textColor: "text-white",
    chipColor: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400",
  },
};

export function CreditCardVisual({
  type = "card",
  brand = "default",
  last4,
  expMonth,
  expYear,
  cardholderName,
  isDefault,
  isVerified,
  nickname,
  bankName,
  accountType = "checking",
  className,
}: CreditCardVisualProps) {
  const brandKey = brand?.toLowerCase() || "default";
  const config = CARD_CONFIGS[brandKey] || CARD_CONFIGS.default;

  // ACH/Bank Account Visual
  if (type === "ach" || type === "bank") {
    return (
      <div
        className={cn(
          "group relative aspect-[1.586/1] w-full overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-background via-muted/30 to-muted/50 p-6 shadow-md transition-all hover:shadow-lg",
          className
        )}
      >
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 ring-2 ring-primary/20">
                <Building2 className="size-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {accountType === "checking" ? "Checking" : "Savings"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {bankName || "Bank Account"}
                </p>
              </div>
            </div>
            {isDefault && (
              <Badge className="gap-1 shadow-sm" variant="default">
                <Check className="size-3" />
                Default
              </Badge>
            )}
          </div>

          {/* Middle */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 font-mono text-foreground text-lg tracking-wider">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span className="font-semibold">{last4}</span>
            </div>
            {isVerified && (
              <BadgeCheck className="size-4 text-primary" />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            {nickname && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Nickname
                </p>
                <p className="font-medium text-foreground text-sm">
                  {nickname}
                </p>
              </div>
            )}
            <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </div>
    );
  }

  // Credit/Debit Card Visual
  return (
    <div
      className={cn(
        "group relative aspect-[1.586/1] w-full overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl",
        `bg-gradient-to-br ${config.gradient}`,
        className
      )}
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.4),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2),rgba(255,255,255,0))]" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative flex h-full flex-col justify-between p-6",
          config.textColor
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* EMV Chip */}
            <div
              className={cn(
                "size-10 rounded-md shadow-inner",
                config.chipColor
              )}
            >
              <div className="grid size-full grid-cols-3 grid-rows-3 gap-px p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div className="rounded-[1px] bg-amber-500/40" key={i} />
                ))}
              </div>
            </div>
            {/* Contactless Icon */}
            <Wifi className="-rotate-90 size-6 opacity-70" />
          </div>

          {/* Brand Logo & Badges */}
          <div className="flex flex-col items-end gap-2">
            {isDefault && (
              <Badge className="gap-1 bg-white/20 text-white shadow-sm backdrop-blur-sm hover:bg-white/30">
                <Check className="size-3" />
                Default
              </Badge>
            )}
            {brandKey === "visa" && (
              <div className="font-bold text-2xl italic tracking-wider">
                VISA
              </div>
            )}
            {brandKey === "mastercard" && (
              <div className="flex items-center gap-[-4px]">
                <div className="size-7 rounded-full bg-red-500 opacity-90" />
                <div className="-ml-3 size-7 rounded-full bg-amber-500 opacity-90" />
              </div>
            )}
            {brandKey === "amex" && (
              <div className="rounded bg-white/20 px-2 py-1 font-bold text-xs tracking-wider backdrop-blur-sm">
                AMERICAN EXPRESS
              </div>
            )}
            {brandKey === "discover" && (
              <div className="rounded bg-white/20 px-2 py-1 font-bold text-xs tracking-wider backdrop-blur-sm">
                DISCOVER
              </div>
            )}
          </div>
        </div>

        {/* Card Number */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-mono text-xl tracking-wider">
            <span className="opacity-70">••••</span>
            <span className="opacity-70">••••</span>
            <span className="opacity-70">••••</span>
            <span className="font-semibold">{last4}</span>
          </div>
          {isVerified && (
            <BadgeCheck className="size-5 opacity-90" />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div className="flex gap-6">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide opacity-70">
                Cardholder
              </p>
              <p className="font-medium text-sm uppercase tracking-wide">
                {cardholderName || "CARD HOLDER"}
              </p>
            </div>
            {expMonth && expYear && (
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide opacity-70">
                  Expires
                </p>
                <p className="font-medium font-mono text-sm tracking-wide">
                  {String(expMonth).padStart(2, "0")}/
                  {String(expYear).slice(-2)}
                </p>
              </div>
            )}
          </div>

          {nickname && (
            <div className="rounded bg-white/10 px-2 py-1 backdrop-blur-sm">
              <p className="text-xs">{nickname}</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
    </div>
  );
}
