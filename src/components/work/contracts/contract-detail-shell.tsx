import type { ReactNode } from "react";

type ContractDetailShellProps = {
  children: ReactNode;
};

/**
 * Contract Detail Shell - Static Server Component
 *
 * Renders instantly (5-20ms) and is cached at the edge.
 * Contains only static layout elements - no data fetching.
 */
export function ContractDetailShell({ children }: ContractDetailShellProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </div>
  );
}
