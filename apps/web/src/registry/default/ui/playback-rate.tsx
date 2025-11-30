"use client"

import * as React from "react"

import {
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue,
} from "@/components/ui/select"
import { usePlaybackRate } from "@/registry/default/hooks/use-playback-rate"
import { useMediaStore } from "@/registry/default/ui/media-provider"
import * as SelectPrimitiveLib from "@radix-ui/react-select"

export const SelectRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive>
>((props, _) => {
  const playbackRate = useMediaStore((state) => state.playbackRate) ?? 1
  const { setPlaybackRate } = usePlaybackRate()

  return (
    <SelectPrimitive
      value={playbackRate.toString()}
      onValueChange={(value) => setPlaybackRate(Number(value))}
      {...props}
    />
  )
})

SelectRoot.displayName = "PlaybackRateSelectRoot"

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectTriggerPrimitive>
>((props, forwardedRef) => {
  const playbackRate = useMediaStore((state) => state.playbackRate) ?? 1

  return (
    <SelectTriggerPrimitive ref={forwardedRef} {...props}>
      <SelectValue placeholder={`${playbackRate}x`} />
    </SelectTriggerPrimitive>
  )
})

SelectTrigger.displayName = "PlaybackRateSelectTrigger"

interface SelectGroupProps
  extends React.ComponentProps<typeof SelectPrimitiveLib.Group> {
  suffix?: string
}

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  (props, forwardedRef) => {
    const playbackRates = useMediaStore((state) => state.playbackRates) ?? [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    const { suffix = "x" } = props

    return (
      <SelectPrimitiveLib.Group ref={forwardedRef} {...props}>
        {playbackRates.map((rate) => (
          <SelectItem key={rate} value={rate.toString()}>
            {rate}
            {suffix && <span className="text-xs">{suffix}</span>}
          </SelectItem>
        ))}
      </SelectPrimitiveLib.Group>
    )
  }
)

SelectGroup.displayName = "PlaybackRateSelectGroup"

