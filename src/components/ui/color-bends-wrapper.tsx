"use client";

/**
 * ColorBends Wrapper - Client Component
 *
 * This wrapper component allows us to use dynamic imports with ssr: false
 * in Server Components. It acts as a bridge between Server and Client.
 */

import dynamic from "next/dynamic";

const ColorBends = dynamic(() => import("@/components/ui/color-bends"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20">
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading ColorBends...</p>
      </div>
    </div>
  ),
});

type ColorBendsWrapperProps = {
  colors?: string[];
  rotation?: number;
  speed?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  transparent?: boolean;
};

export function ColorBendsWrapper(props: ColorBendsWrapperProps) {
  return <ColorBends {...props} />;
}
