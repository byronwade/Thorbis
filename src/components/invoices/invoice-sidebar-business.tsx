/**
 * Invoice Business Sidebar - Vertical Pills Navigation
 *
 * Comprehensive invoice management sidebar with:
 * - Vertical pills navigation (like customer sidebar would have)
 * - Line items editing
 * - Full payment suite
 * - Invoice settings
 * - Design customization (collapsed)
 *
 * Architecture matches customer page pattern
 */

"use client";

import { useState } from "react";
import { FileText, DollarSign, Settings, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineItemsEditor } from "./line-items-editor";
import { PaymentsManager } from "./payments-manager";

type SidebarSection = "line-items" | "payments" | "settings" | "design";

interface InvoiceSidebarBusinessProps {
  invoice: any;
  lineItems?: any[];
  payments?: any[];
  onUpdate?: () => void;
}

export function InvoiceSidebarBusiness({
  invoice,
  lineItems = [],
  payments = [],
  onUpdate,
}: InvoiceSidebarBusinessProps) {
  const [activeSection, setActiveSection] = useState<SidebarSection>("line-items");

  const sections = [
    {
      id: "line-items" as const,
      label: "Line Items",
      icon: FileText,
    },
    {
      id: "payments" as const,
      label: "Payments",
      icon: DollarSign,
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: Settings,
    },
    {
      id: "design" as const,
      label: "Design",
      icon: Palette,
    },
  ];

  return (
    <div className="flex h-full w-[380px] border-l bg-background">
      {/* Vertical Pills Navigation */}
      <div className="w-16 border-r bg-muted/30">
        <div className="flex flex-col gap-1 p-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-3 transition-colors",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={section.label}
            >
              <section.icon className="size-5" />
              <span className="text-[10px] font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === "line-items" && (
          <LineItemsEditor
            invoiceId={invoice.id}
            lineItems={lineItems}
            subtotal={invoice.subtotal || 0}
            onUpdate={onUpdate}
          />
        )}

        {activeSection === "payments" && (
          <PaymentsManager
            invoiceId={invoice.id}
            invoice={invoice}
            payments={payments}
            onUpdate={onUpdate}
          />
        )}

        {activeSection === "settings" && (
          <div className="p-4">
            <h3 className="mb-4 font-semibold text-sm">Invoice Settings</h3>
            <p className="text-muted-foreground text-sm">Settings coming soon...</p>
          </div>
        )}

        {activeSection === "design" && (
          <div className="p-4">
            <h3 className="mb-4 font-semibold text-sm">Design Customization</h3>
            <p className="text-muted-foreground text-sm">Design controls coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
