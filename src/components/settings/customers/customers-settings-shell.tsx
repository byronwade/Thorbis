import type { ReactNode } from "react";

type CustomersSettingsShellProps = {
  children: ReactNode;
};

/**
 * Settings > Customers Shell - Static Server Component
 *
 * Renders the static header and layout instantly; dynamic content
 * (cards, sections) streams in under PPR.
 */
export function CustomersSettingsShell({
  children,
}: CustomersSettingsShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">Customer Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure customer management preferences and features
        </p>
      </div>

      {children}
    </div>
  );
}
