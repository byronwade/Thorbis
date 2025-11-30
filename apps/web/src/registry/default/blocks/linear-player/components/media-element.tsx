"use client"

import { useEffect, useState } from "react"
import type shaka from "shaka-player"

import { ASSETS } from "@/registry/default/blocks/linear-player/lib/playlist"
import { Media } from "@/registry/default/ui/media"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function MediaElement({
  src,
  config,
}: {
  src?: string
  config?: shaka.extern.PlayerConfiguration
}) {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const mediaElement = mediaRef.current
    if (!player || !mediaElement) return

    // Determine the actual stream URL to use
    let streamUrl: string | null = null
    
    if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
      // Regular video URL - must be a valid URL
      streamUrl = src
    } else if (!src && ASSETS[0]) {
      // Fallback to demo asset
      streamUrl = ASSETS[0].src
      if (ASSETS[0].config && player) {
        player.configure(ASSETS[0].config)
      }
    }

    // If we don't have a valid stream URL, don't try to load
    if (!streamUrl || hasLoaded) {
      return
    }

    // Validate and load the stream URL
    try {
      // Validate URL format - must be a proper URL
      if (!streamUrl.startsWith("http://") && !streamUrl.startsWith("https://")) {
        console.error("[limeplay] Invalid playback URL: URL must start with http:// or https://", "Got:", streamUrl)
        return
      }
      const parsedUrl = new URL(streamUrl)

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid URL protocol")
      }
    } catch (error) {
      console.error(
        "[limeplay] Invalid playback URL:",
        error instanceof Error ? error.message : "Unknown error",
        "URL was:",
        streamUrl
      )
      return
    }

    if (config) {
      player.configure(config)
    }

    console.log("[limeplay] Loading stream URL:", streamUrl.substring(0, 100) + "...")
    setHasLoaded(true) // Mark as loading to prevent reload
    void player
      .load(streamUrl)
      .then(() => {
        console.log("[limeplay] Media loaded successfully")
      })
      .catch((error: unknown) => {
        console.error("[limeplay] Error loading media into Shaka Player:", error)
        if (error instanceof Error) {
          console.error("[limeplay] Error message:", error.message)
          console.error("[limeplay] Error stack:", error.stack)
        }
        setHasLoaded(false) // Reset so we can try again if needed
      })
  }, [player, mediaRef, src, config, hasLoaded])

  return (
    <Media
      as="video"
      className="size-full object-cover"
      autoPlay={false}
      muted
      loop
    />
  )
}
