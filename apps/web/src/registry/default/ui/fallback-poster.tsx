"use client"

import type { ComponentPropsWithoutRef } from "react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export const FallbackPoster = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ children, className, ...props }, ref) => {
  const canPlayThrough = useMediaStore((state) => state.canPlayThrough)
  const status = useMediaStore((state) => state.status)
  const readyState = useMediaStore((state) => state.readyState)
  const [hasEverPlayed, setHasEverPlayed] = React.useState(false)

  // Track if video has ever played to prevent flickering
  React.useEffect(() => {
    if (status === "playing") {
      setHasEverPlayed(true)
    }
  }, [status])

  // Only hide poster when video is actually ready to play through (stable state)
  // This prevents flickering from rapid status changes
  const shouldHide = hasEverPlayed || canPlayThrough || (status === "playing") || (status === "paused" && readyState >= 3)

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 -z-1 flex flex-col items-center justify-center bg-background transition-opacity duration-300",
        shouldHide && "opacity-0 pointer-events-none",
        !shouldHide && "opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

FallbackPoster.displayName = "FallbackPoster"

