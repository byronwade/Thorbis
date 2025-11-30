"use client"

import { Button } from "@/components/ui/button"
import * as Select from "@/components/ui/select"
import * as PlaybackRate from "@/registry/default/ui/playback-rate"

export function PlaybackRateControl() {
  return (
    <PlaybackRate.SelectRoot>
      <Button variant="ghost" size="icon" asChild>
        <PlaybackRate.SelectTrigger
          size="sm"
          className={`
            border-none bg-transparent px-8 shadow-none
            hover:bg-foreground/10
            dark:bg-transparent dark:shadow-none
          `}
        />
      </Button>
      <Select.SelectContent
        className={`
          z-100 min-w-24 backdrop-blur-md
          dark:bg-accent
        `}
        align="start"
      >
        <PlaybackRate.SelectGroup className={`tracking-wider`} />
      </Select.SelectContent>
    </PlaybackRate.SelectRoot>
  )
}

