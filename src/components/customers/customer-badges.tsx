"use client";

/**
 * Customer Badges Component
 *
 * Displays badges at the top of the customer profile:
 * - Custom badges
 * - Premade badges (DO NOT SERVICE, VIP, etc.)
 * - Auto-generated badges (past due, payment status)
 * - Dropdown to add new badges
 */

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, AlertTriangle, Star, Calendar, Receipt, ShieldCheck, FileCheck, Heart, UserPlus, LayoutGrid } from "lucide-react";
import {
  getCustomerBadges,
  addCustomerBadge,
  removeCustomerBadge,
  generateAutoBadges,
} from "@/actions/customer-badges";
import { PREMADE_BADGES, type CustomerBadge } from "@/types/customer-badges";
import { cn } from "@/lib/utils";

interface CustomerBadgesProps {
  customerId: string;
}

const ICON_MAP: Record<string, any> = {
  AlertTriangle,
  Star,
  Calendar,
  Receipt,
  ShieldCheck,
  FileCheck,
  Heart,
  UserPlus,
};

export function CustomerBadges({ customerId }: CustomerBadgesProps) {
  const [badges, setBadges] = useState<CustomerBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [customVariant, setCustomVariant] = useState<string>("default");

  // Load badges
  useEffect(() => {
    loadBadges();
  }, [customerId]);

  const loadBadges = async () => {
    setIsLoading(true);
    const result = await getCustomerBadges(customerId);
    if (result.success) {
      setBadges(result.data || []);
    }
    setIsLoading(false);
  };

  const handleAddPremadeBadge = async (premade: typeof PREMADE_BADGES[0]) => {
    const result = await addCustomerBadge({
      customerId,
      label: premade.label,
      variant: premade.variant,
      badgeType: "premade",
      icon: premade.icon,
    });

    if (result.success) {
      loadBadges();
    }
  };

  const handleAddCustomBadge = async () => {
    if (!customLabel.trim()) return;

    const result = await addCustomerBadge({
      customerId,
      label: customLabel,
      variant: customVariant as any,
      badgeType: "custom",
    });

    if (result.success) {
      setCustomLabel("");
      setCustomVariant("default");
      setShowCustomDialog(false);
      loadBadges();
    }
  };

  const handleRemoveBadge = async (badgeId: string) => {
    const result = await removeCustomerBadge(badgeId, customerId);
    if (result.success) {
      loadBadges();
    }
  };

  const handleGenerateAuto = async () => {
    const result = await generateAutoBadges(customerId);
    if (result.success) {
      loadBadges();
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 px-8 py-6">
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-8 py-6">
      {/* Display Badges */}
      {badges.length === 0 && (
        <p className="text-muted-foreground text-sm">No badges yet — add badges to highlight important customer attributes</p>
      )}
      {badges.map((badge) => {
        const Icon = badge.icon ? ICON_MAP[badge.icon] : null;
        return (
          <div key={badge.id} className="group relative">
            <Badge
              variant={badge.variant as any}
              className={cn(
                "gap-1.5 pr-7 text-xs font-medium",
                badge.badge_type === "auto_generated" && "opacity-90"
              )}
            >
              {Icon && <Icon className="size-3.5" />}
              {badge.label}
              <button
                type="button"
                onClick={() => handleRemoveBadge(badge.id)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-background/20 group-hover:opacity-100"
                title="Remove badge"
              >
                <X className="size-3" />
              </button>
            </Badge>
          </div>
        );
      })}

      {/* Add Badge Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            Add Badge
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs">Premade Badges</DropdownMenuLabel>
          {PREMADE_BADGES.map((premade) => {
            const Icon = ICON_MAP[premade.icon];
            return (
              <DropdownMenuItem
                key={premade.label}
                onClick={() => handleAddPremadeBadge(premade)}
                className="cursor-pointer"
              >
                {Icon && <Icon className="mr-2 size-4" />}
                <span className="text-sm">{premade.label}</span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCustomDialog(true)} className="cursor-pointer">
            <Plus className="mr-2 size-4" />
            <span className="text-sm">Custom Badge</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGenerateAuto} className="cursor-pointer">
            <LayoutGrid className="mr-2 size-4" />
            <span className="text-sm">Generate Auto Badges</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Badge Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Add Custom Badge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Badge Label</Label>
              <Input
                placeholder="e.g., Preferred Vendor"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Badge Style</Label>
              <Select value={customVariant} onValueChange={setCustomVariant}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" className="text-sm">Default (Gray)</SelectItem>
                  <SelectItem value="success" className="text-sm">Success (Green)</SelectItem>
                  <SelectItem value="warning" className="text-sm">Warning (Yellow)</SelectItem>
                  <SelectItem value="destructive" className="text-sm">Destructive (Red)</SelectItem>
                  <SelectItem value="secondary" className="text-sm">Secondary (Blue)</SelectItem>
                  <SelectItem value="outline" className="text-sm">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => setShowCustomDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddCustomBadge} className="flex-1">
                <Plus className="mr-2 size-4" />
                Add Badge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
