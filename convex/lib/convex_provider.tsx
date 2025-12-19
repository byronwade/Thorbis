"use client";

/**
 * ConvexProvider for Next.js applications
 * Provides Convex client context with authentication support
 */
import { ConvexProvider as ConvexProviderBase, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode, useMemo } from "react";

// Create Convex client instance
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

interface ConvexProviderProps {
  children: ReactNode;
}

/**
 * ConvexProvider wraps the application with Convex client context and authentication
 * Use this at the root of your application (e.g., in layout.tsx)
 *
 * @example
 * // app/layout.tsx
 * import { ConvexProvider } from "@/convex/lib/convex_provider";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ConvexProvider>{children}</ConvexProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function ConvexProvider({ children }: ConvexProviderProps) {
  const client = useMemo(() => new ConvexReactClient(convexUrl), []);

  return (
    <ConvexProviderBase client={client}>
      <ConvexAuthProvider client={client}>{children}</ConvexAuthProvider>
    </ConvexProviderBase>
  );
}

/**
 * ConvexProviderWithoutAuth - Use when auth is not needed (public pages)
 */
export function ConvexProviderWithoutAuth({ children }: ConvexProviderProps) {
  const client = useMemo(() => new ConvexReactClient(convexUrl), []);

  return <ConvexProviderBase client={client}>{children}</ConvexProviderBase>;
}

/**
 * Hook to get Convex client for use outside of React components
 * Useful for server-side operations
 */
export function getConvexClient() {
  return new ConvexReactClient(convexUrl);
}
